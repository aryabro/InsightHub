import express from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { requireAuth } from "../middleware/auth.js";
import DocumentChunk from "../models/DocumentChunk.js";
import Team from "../models/Team.js";
import { generateEmbedding } from "../services/embeddings.js";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

async function findRelevantChunks(queryEmbedding, teamId, topK = 5) {
  // Fetch all chunks for this team
  const chunks = await DocumentChunk.find({ team: teamId })
    .populate('document', 'title')
    .lean();
  
  if (chunks.length === 0) {
    return [];
  }
  
  const scoredChunks = chunks.map(chunk => ({
    ...chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  
  scoredChunks.sort((a, b) => b.similarity - a.similarity);
  
  return scoredChunks.slice(0, topK);
}


function buildContext(chunks) {
  if (chunks.length === 0) return null;
  
  const contextParts = chunks.map((chunk, index) => {
    const docTitle = chunk.document?.title || 'Unknown Document';
    return `[Source ${index + 1}: "${docTitle}"]\n${chunk.text}`;
  });
  
  return contextParts.join('\n\n---\n\n');
}

// POST /api/chat
router.post("/", requireAuth, async (req, res) => {
  try {
    const { message, history = [], teamId } = req.body;

    console.log('📥 Received message:', message);
    console.log('📜 Chat history length:', history.length);
    console.log('🏢 Team ID:', teamId);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let relevantContext = null;
    let sourceDocs = [];
    let teamContext = "";
    
    if (teamId) {
      const team = await Team.findById(teamId)
        .populate('members', 'fullName email role timezone')
        .lean();
        
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      if (!team.members.some(m => m._id.toString() === req.user.id)) {
        return res.status(403).json({ error: 'Not authorized to access this team\'s knowledge' });
      }

      teamContext = `
        TEAM INFORMATION:
        Name: ${team.name}
        Description: ${team.description || 'N/A'}
        Mission: ${team.mission || 'N/A'}
        Standup Time: ${team.standupTime || 'N/A'}
        Timezone: ${team.timezone || 'N/A'}
        Members:
        ${team.members.map(m => `- ${m.fullName} (${m.role || 'Member'}) - ${m.email}`).join('\n')}
        `;
      
      try {
        console.log('🔍 Searching for relevant documents...');
        
        const queryEmbedding = await generateEmbedding(message);
        
        const relevantChunks = await findRelevantChunks(queryEmbedding, teamId, 5);
        
        if (relevantChunks.length > 0) {
          console.log(`📚 Found ${relevantChunks.length} relevant chunks`);
          relevantChunks.forEach((chunk, i) => {
            console.log(`  ${i + 1}. "${chunk.document?.title}" (similarity: ${chunk.similarity.toFixed(3)})`);
          });
          
          relevantContext = buildContext(relevantChunks);
          sourceDocs = [...new Set(relevantChunks.map(c => c.document?.title).filter(Boolean))];
        } else {
          console.log('📭 No relevant documents found');
        }
      } catch (ragError) {
        console.error('RAG search error (non-fatal):', ragError);
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const cleanHistory = history.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ 
        text: msg.content.replace(/\n\n\(Please keep your response to 3 sentences or less\)/g, '').trim()
      }]
    }));

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    let finalPrompt;
    if (relevantContext || teamContext) {
      finalPrompt = 
`You are a helpful assistant for a team knowledge base. Use the following context to answer the question.

${teamContext}

CONTEXT FROM TEAM DOCUMENTS:
${relevantContext || 'No relevant documents found.'}

USER QUESTION:
${message}

Please provide a helpful and accurate answer. If you're using information from the context, you don't need to cite the specific source names.`;
} else {
      finalPrompt = `${message}\n\n(Please keep your response concise and helpful)`;
    }

    console.log('🔄 Sending to Gemini...');

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('📤 AI Response length:', text.length, 'characters');

    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Warning: Blank response received from Gemini API');
      return res.status(500).json({ 
        error: 'Received empty response from AI',
        details: 'The AI returned a blank response. Please try rephrasing your question.'
      });
    }

    res.json({ 
      response: text,
      timestamp: new Date().toISOString(),
      sources: sourceDocs.length > 0 ? sourceDocs : undefined
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

export default router;
