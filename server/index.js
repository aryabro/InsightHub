import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from '@google/generative-ai';

import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/teams.js";
import documentRoutes from "./routes/documents.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/insighthub";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like iframes, mobile apps, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    // Allow iframe embedding
    optionsSuccessStatus: 200
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);

// AI Chat endpoint
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

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "InsightHub API running" });
});

// Mongo connection & server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


