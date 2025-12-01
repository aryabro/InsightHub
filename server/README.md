# InsightHub Backend Server

This is the backend proxy server for the InsightHub AI chatbot, powered by Google Gemini.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure API Key

Create a `.env` file in the `server` directory:

```bash
cp env.example .env
```

Then edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

### 4. Run the Server

From the project root:

```bash
npm run dev:all
```

This will start both the frontend (port 3000) and backend (port 3001) simultaneously.

Or run just the backend:

```bash
cd server
npm run dev
```

## API Endpoints

### POST /api/chat

Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "Your question here",
  "history": [
    {
      "type": "user",
      "content": "Previous user message"
    },
    {
      "type": "bot",
      "content": "Previous bot response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "AI's response",
  "timestamp": "2025-11-29T..."
}
```

### GET /api/health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T..."
}
```

## Security Note

The `.env` file is git-ignored to keep your API key secure. Never commit your API key to version control.

