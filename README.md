# InsightHub — AI-Powered Team Collaboration Platform

A full-stack, multi-tenant knowledge management platform where teams can upload documents, coordinate activity, and query their knowledge base through an LLM-powered RAG chat interface.

**Live Demo:** [cs-409-webstars.vercel.app](https://cs-409-webstars.vercel.app)

---

## Tech Stack


| Layer               | Technologies                                       |
| ------------------- | -------------------------------------------------- |
| **Frontend**        | React 18, TypeScript, Vite, Tailwind CSS, Radix UI |
| **Backend**         | Node.js, Express, MongoDB (Mongoose)               |
| **AI / Embeddings** | Google Gemini 2.5 Flash, `text-embedding-004`      |
| **Auth**            | JWT (7-day tokens), bcryptjs                       |
| **File Handling**   | Multer (in-memory, up to 50MB), pdf-parse          |
| **Dev Tooling**     | Nodemon, Concurrently, Morgan                      |


---

## Architecture

### Multi-Tenancy

Every resource — documents, notifications, and chat history — is scoped strictly to a `team`. All 20+ protected API routes validate team membership on every request through a centralized `requireAuth` Express middleware guard, ensuring zero cross-tenant data access.

```
Request → requireAuth (JWT verify) → team membership check → resource handler
```

### RAG Pipeline

The core AI feature is a Retrieval-Augmented Generation (RAG) pipeline that lets users ask questions answered directly from their team's uploaded documents.

```
PDF Upload (≤50MB)
    └─► pdf-parse extracts raw text
        └─► Sliding window chunker (1000 chars, 200-char overlap)
            └─► text-embedding-004 generates 768-dimensional vectors
                └─► DocumentChunk saved to MongoDB with compound index {team, document}

User Query
    └─► Query embedded → 768-dim vector
        └─► In-memory cosine similarity scored against all team chunks
            └─► Top-5 chunks retrieved → context injected into Gemini 2.5 Flash prompt
                └─► Context-aware response returned with source citations
```

**Why in-memory search?** For team-sized document corpora this keeps infrastructure lean — no external vector database required. MongoDB compound indexes on `{team: 1}` and `{document: 1}` keep chunk retrieval fast.

### Notification System

Activity events (member joined, document uploaded, team updated) are persisted as `Notification` documents with a **24-hour TTL** enforced by a MongoDB `expiresAt` index. A cleanup endpoint purges expired entries on demand, preventing storage bloat.

---

## Data Models

```
User          — fullName, email, passwordHash, role, timezone
Team          — name, description, mission, standupTime, timezone, inviteCode (unique), isPrivate, members[], createdBy
Document      — team, title, tag, summary, fileName, fileSize, fileContent (Buffer), uploadedBy, viewCount
DocumentChunk — document, team, text, embedding (Number[768]), chunkIndex  ← compound indexed
Notification  — team, type (enum), message, createdBy, relatedDocument, relatedUser, expiresAt (TTL)
```

---

## API Reference

### Auth — `/api/auth`


| Method  | Endpoint  | Description                      |
| ------- | --------- | -------------------------------- |
| `POST`  | `/signup` | Register a new user              |
| `POST`  | `/login`  | Authenticate and receive JWT     |
| `GET`   | `/me`     | Fetch authenticated user profile |
| `PATCH` | `/me`     | Update profile fields            |


### Teams — `/api/teams`


| Method   | Endpoint               | Description                                      |
| -------- | ---------------------- | ------------------------------------------------ |
| `POST`   | `/`                    | Create a new team (generates unique invite code) |
| `GET`    | `/my`                  | List all teams the user is a member of           |
| `GET`    | `/public`              | Discover public teams                            |
| `POST`   | `/join`                | Join via invite code or team ID                  |
| `GET`    | `/:id`                 | Get team details                                 |
| `PATCH`  | `/:id`                 | Update team settings                             |
| `GET`    | `/:id/members`         | List team members                                |
| `POST`   | `/:id/members`         | Add members by email array                       |
| `DELETE` | `/:id/members/:userId` | Remove a member (creator only)                   |


### Documents — `/api/documents`


| Method   | Endpoint        | Description                                                |
| -------- | --------------- | ---------------------------------------------------------- |
| `POST`   | `/`             | Upload a PDF (triggers RAG chunking + embedding)           |
| `GET`    | `/team/:teamId` | List all documents for a team                              |
| `GET`    | `/recent`       | Fetch recently uploaded documents across user's teams      |
| `GET`    | `/:id`          | Get document metadata (increments view count)              |
| `GET`    | `/:id/preview`  | Stream PDF inline (supports token query param for iframes) |
| `GET`    | `/:id/download` | Download PDF as attachment                                 |
| `DELETE` | `/:id`          | Delete document + all its chunks (creator only)            |


### Chat — `/api/chat`


| Method | Endpoint | Description                                                                   |
| ------ | -------- | ----------------------------------------------------------------------------- |
| `POST` | `/`      | Send a message; RAG retrieves relevant chunks and injects context into Gemini |


### Notifications — `/api/notifications`


| Method   | Endpoint        | Description                                    |
| -------- | --------------- | ---------------------------------------------- |
| `GET`    | `/team/:teamId` | Fetch up to 50 active notifications for a team |
| `DELETE` | `/:id`          | Dismiss a notification                         |
| `POST`   | `/cleanup`      | Purge all expired notifications                |


---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Google Gemini API key ([get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repo
git clone https://github.com/aryabro/InsightHub.git
cd InsightHub

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### Environment Variables

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=mongodb://127.0.0.1:27017/insighthub
JWT_SECRET=your_jwt_secret
PORT=4000
```

Create `.env` in the project root (for the frontend):

```env
VITE_API_URL=http://localhost:4000
```

### Running Locally

```bash
# Run both frontend (port 3000) and backend (port 4000) concurrently
npm run dev:all

# Or run separately
npm run dev        # frontend only
npm run server     # backend only
```

---

## Security Notes

- JWT tokens are signed with `JWT_SECRET` and expire after 7 days
- Passwords are hashed with `bcryptjs` (salt rounds: 10)
- CORS is allowlisted to specific origins — no wildcard `*`
- All document and chunk access enforces team-membership checks server-side
- File uploads are validated to PDF-only before processing

