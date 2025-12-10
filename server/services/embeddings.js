import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}


export function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.length === 0) {
    return [];
  }

  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= chunkSize) {
    return [cleanedText];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < cleanedText.length) {
    let endIndex = startIndex + chunkSize;
    
    if (endIndex < cleanedText.length) {
    
      const sentenceEnd = cleanedText.substring(startIndex, endIndex).lastIndexOf('. ');
      if (sentenceEnd > chunkSize * 0.5) {
        endIndex = startIndex + sentenceEnd + 1;
      } else {
        const lastSpace = cleanedText.substring(startIndex, endIndex).lastIndexOf(' ');
        if (lastSpace > chunkSize * 0.5) {
          endIndex = startIndex + lastSpace;
        }
      }
    }

    const chunk = cleanedText.substring(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    startIndex = endIndex - overlap;
    if (startIndex >= cleanedText.length) break;
  }

  return chunks;
}


export async function processTextToChunks(text) {
  const chunks = splitTextIntoChunks(text);
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    try {
      const embedding = await generateEmbedding(chunkText);
      results.push({
        text: chunkText,
        embedding,
        chunkIndex: i
      });
    } catch (error) {
      console.error(`Error generating embedding for chunk ${i}:`, error);
    }
  }

  return results;
}
