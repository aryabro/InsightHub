import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate embedding for a text using Google's text-embedding model
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector
 */
export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Split text into chunks of roughly equal size
 * @param {string} text - The text to split
 * @param {number} chunkSize - Target size of each chunk in characters
 * @param {number} overlap - Number of characters to overlap between chunks
 * @returns {string[]} - Array of text chunks
 */
export function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.length === 0) {
    return [];
  }

  // Clean the text - normalize whitespace
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= chunkSize) {
    return [cleanedText];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < cleanedText.length) {
    let endIndex = startIndex + chunkSize;
    
    // If not at the end, try to break at a sentence or word boundary
    if (endIndex < cleanedText.length) {
      // Look for sentence ending (.!?) near the end of chunk
      const sentenceEnd = cleanedText.substring(startIndex, endIndex).lastIndexOf('. ');
      if (sentenceEnd > chunkSize * 0.5) {
        endIndex = startIndex + sentenceEnd + 1;
      } else {
        // Fall back to word boundary
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

    // Move start index, accounting for overlap
    startIndex = endIndex - overlap;
    if (startIndex >= cleanedText.length) break;
  }

  return chunks;
}

/**
 * Process text and generate embeddings for all chunks
 * @param {string} text - The full text to process
 * @returns {Promise<{text: string, embedding: number[]}[]>} - Array of chunk objects
 */
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
      // Continue with other chunks even if one fails
    }
  }

  return results;
}
