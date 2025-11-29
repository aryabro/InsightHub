import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    console.log('📥 Received message:', message);
    console.log('📜 Chat history length:', history.length);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the generative model (using gemini-2.5-flash - fast and free tier friendly)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Clean history - remove any instruction text that may have been saved
    const cleanHistory = history.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ 
        text: msg.content.replace(/\n\n\(Please keep your response to 3 sentences or less\)/g, '').trim()
      }]
    }));

    // Start a chat session with history if provided
    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Add instruction ONLY to the current message, not stored in history
    const promptWithInstruction = `${message}\n\n(Please keep your response to 3 sentences or less)`;
    
    console.log('🔄 Sending to Gemini:', promptWithInstruction);

    // Send the message and get response
    const result = await chat.sendMessage(promptWithInstruction);
    const response = await result.response;
    const text = response.text();

    console.log('📤 AI Response:', text);
    console.log('📊 Response length:', text.length, 'characters');

    // Check if response is blank
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Warning: Blank response received from Gemini API');
      return res.status(500).json({ 
        error: 'Received empty response from AI',
        details: 'The AI returned a blank response. Please try rephrasing your question.'
      });
    }

    res.json({ 
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/chat`);
});

