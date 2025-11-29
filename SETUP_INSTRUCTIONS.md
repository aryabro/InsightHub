# InsightHub - Gemini AI Chatbot Setup

Your AI chatbot is now ready to use! Follow these steps to get it running.

## Quick Start

### 1. Install All Dependencies

From the project root directory:

```bash
npm install
cd server
npm install
cd ..
```

### 2. Configure Your Gemini API Key

**Get your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Set up the environment file:**
```bash
cd server
cp env.example .env
```

Open `server/.env` in a text editor and paste your API key:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Run the Application

From the project root:

```bash
npm run dev:all
```

This will start:
- **Frontend** on http://localhost:3000
- **Backend** on http://localhost:3001

The browser will automatically open to http://localhost:3000

## Testing the Chatbot

1. Navigate to the "AI Chat" section in the app
2. Type a message and press Enter or click Send
3. The AI will respond using Google Gemini

Try these example prompts:
- "Tell me a joke"
- "Explain how React hooks work"
- "Write a haiku about coding"

## Troubleshooting

### "Failed to get response from AI"
- Make sure the backend server is running (check the terminal)
- Verify your API key is correct in `server/.env`
- Check that you have an internet connection

### Backend won't start
- Make sure you ran `npm install` in the `server` directory
- Check that port 3001 is not already in use
- Verify the `.env` file exists in the `server` directory

### Frontend can't connect to backend
- Both servers must be running simultaneously
- Use `npm run dev:all` from the project root
- Check the browser console for any error messages

## Project Structure

```
CS409_WEBSTARS/
├── src/                          # Frontend React code
│   └── components/
│       └── ChatSection.tsx       # AI chat interface
├── server/                       # Backend Node.js server
│   ├── index.js                 # Express server with Gemini integration
│   ├── package.json             # Backend dependencies
│   └── .env                     # API key (you create this)
├── package.json                 # Root package with dev:all script
└── vite.config.ts              # Frontend config with API proxy
```

## What's Next?

This is a foundation for future enhancements:

### Phase 2: User Authentication
- Add user login/signup
- Store chat history per user
- Implement session management

### Phase 3: Document Context (RAG)
- Upload documents to a vector database
- Query relevant context before sending to AI
- Provide cited answers from your documents

### Phase 4: Advanced Features
- Multiple chat sessions
- File attachments
- Voice input/output
- Team sharing

The current backend is designed to easily scale into these features!

## Security Note

Your `.env` file containing the API key is automatically ignored by git. Never commit API keys to version control.

