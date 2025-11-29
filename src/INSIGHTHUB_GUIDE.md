# InsightHub - Complete Application Guide

## Overview
InsightHub is a centralized team knowledge hub with AI-powered chat capabilities. It brings together docs, people, and AI answers in one beautiful interface.

## Brand Identity
- **Primary Color**: Violet Purple (#6D28D9)
- **Accent Color**: Aqua Teal (#14B8A6)
- **Typography**: Inter font family
- **Design**: Calm, modern, developer-friendly aesthetic with generous whitespace

## Application Flow

### 1. Landing Page (Pre-Login)
**Route**: `landing`
- Hero section with value proposition
- Feature cards highlighting:
  - Centralized Product Knowledge
  - AI Answers from Your Docs
  - Faster Onboarding
- Call-to-action buttons: "Get Started Free" and "Log In"
- Footer with links

### 2. Authentication

#### Login Page
**Route**: `login`
- Email and password fields
- "Forgot password?" link
- Link to sign up page
- Left side illustration with abstract docs and chat

#### Sign Up Page
**Route**: `signup`
- Collects:
  - Full name
  - Work email
  - Phone (optional)
  - Role (Manager/Developer/Designer/Product Manager)
  - Time zone
  - Password and confirmation
- Note about creating/joining a team next
- Link to login page

### 3. Onboarding (First-Time Users)

#### Onboarding Choice
**Route**: `onboarding-choice`
- Two large cards:
  1. **Create a Team** - For managers starting a new product space
  2. **Join a Team** - For members with an invite or searching directory

### 4. Create Team Flow (Managers)

#### Step 1: Create Team
**Route**: `create-team`
- Team/Product name
- Short product description
- Standup time + time zone
- Contact points (Slack channel, email)
- Visibility toggle (private by default)

#### Step 2: Team Setup
**Route**: `team-setup`
- Two side-by-side cards:
  1. **Invite Members**:
     - Enter emails
     - Assign roles (Manager/Developer)
     - Optional welcome note
     - Shows pending invites list
  2. **Upload Initial Documents**:
     - Drag-and-drop file uploader
     - Document tags: Design Doc, API Spec, Runbook, Guide
     - Shows upload progress
- Buttons: "Skip for now" and "Go to Team Dashboard"

### 5. Join Team Flow (Members)

#### Join Team Page
**Route**: `join-team`
- Two tabs:
  1. **By Invite Code**: Single input for code + join button
  2. **Search Directory**:
     - Search existing teams by name
     - Shows: About snippet, standup time, member count
     - Private teams require invite code
- On success → Team Dashboard

### 6. Main Application (Post-Login)

#### Team Dashboard (Core Screen)
**Route**: `app` with `activeSection: dashboard`

**Above the fold:**
- **About Card**: Product description, contact points (Slack, email), edit button (Managers only)
- **Standup Card**: Next standup time in user's local time, world-clock hint for team time zones
- **Members Card**: Grid/list with avatar, name, role badge, time zone, online status
- **Documents Card**: 
  - Filter by tag (Design Doc, API Spec, Runbook)
  - Search functionality
  - Upload button (Managers only)
  - List with title, owner, last updated
  - Click to view document details
- **AI Chat Panel**:
  - Fixed right-side panel
  - Input field and chat history
  - Citations area showing source documents
  - "Answers are sourced from your team's uploaded knowledge base" hint
  - Open full chat button

#### Team Members Section
**Route**: `app` with `activeSection: team`
- Grid of team member cards
- Each card shows:
  - Avatar
  - Name and role
  - Email, location, join date
  - Online status badge
  - Time zone
- Search functionality
- "Add Member" button

#### Documents Section
**Route**: `app` with `activeSection: documents`
- Grid of document cards
- Category filtering
- Search functionality
- Each card shows:
  - Icon with gradient
  - Title and description
  - Category badge
  - Author and last updated time
- Upload button
- Empty state for no documents

#### Document Detail Page
**Route**: `document-detail`
- Header with title and tag
- Right sidebar with metadata:
  - Uploader
  - Upload date
  - Last updated
  - Version
  - File size
  - Usage stats (views, chat references)
- Main area: Document preview placeholder
- "Referenced By" section showing related docs
- "Used by Chat" badges showing AI usage
- Download and share buttons

#### AI Chat (Full Page)
**Route**: `app` with `activeSection: chat`
- Left column: Chat history sessions with search
- Main column:
  - Chat feed with message bubbles
  - Code/step blocks
  - Citation chips linking to document details
  - "Attach doc reference" button
- Sample interactions showing doc-sourced answers
- Disclaimer about internal use

#### Settings
**Route**: `app` with `activeSection: settings`
- Tabs:
  1. **Profile**: Personal info, avatar, contact details
  2. **Notifications**: Email, document updates, mentions, summaries
  3. **Security**: Change password, 2FA settings
  4. **Preferences**: Language, date format, compact mode, animations

#### Profile Page
**Route**: `profile`
- Avatar and personal info
- List of teams user belongs to
- Recent documents contributed
- Recent chat sessions
- Notification settings
- Edit profile button

### 7. Modals & Interactions

#### Document Upload Modal
- Drag-drop zone
- File list with progress
- Required fields:
  - Title
  - Tag (Design Doc/API Spec/Runbook/Guide/Reference/Other)
  - Optional summary
- Success toast notification
- Automatically updates knowledge base for AI

### 8. Empty States
- **No Documents**: Encourages upload with illustration
- **No Members**: Prompts to invite team members
- **No Chat History**: Suggests first question with examples

## Navigation Structure

```
Landing Page
├── Sign Up → Onboarding Choice
│   ├── Create Team → Team Setup → Team Dashboard
│   └── Join Team → Team Dashboard
└── Log In → Team Dashboard

Team Dashboard (App Shell)
├── Dashboard (Home)
├── Team (Members)
├── Documents
│   └── Document Detail
├── AI Chat
├── Settings
└── Profile
```

## Key Features

### AI-Powered Chat
- Trained on uploaded documents
- Provides answers with source citations
- Shows which documents were referenced
- Tracks usage stats per document

### Team Management
- Role-based permissions (Manager/Developer)
- Time zone awareness for global teams
- Online status indicators
- Private team workspaces

### Document Organization
- Tag-based categorization
- Full-text search
- Version tracking
- Usage analytics

### Design System
- 8px spacing scale
- Rounded-2xl cards with soft shadows
- Gradient accents on key elements
- High contrast, AA accessible colors
- Consistent component library

## Component Library

### Buttons
- Primary (solid violet)
- Secondary (outline)
- Ghost (subtle)
- Icon buttons
- Size variants: sm, default, lg

### Inputs
- Text, email, tel, password
- Select dropdowns
- Time pickers
- Textarea
- File uploader (drag & drop)

### Cards
- Rounded-2xl with border
- Hover effects
- Shadow variants
- Gradient backgrounds for special cards

### Badges
- Role badges
- Status indicators
- Time zone badges
- Document tags
- Color variants for different states

### Navigation
- Top navigation bar with search
- Collapsible sidebar
- Breadcrumbs (where applicable)
- Tab navigation within sections

## Responsive Design
- Mobile-first approach
- Grid system: 12 columns
- Max content width: 1200px
- Breakpoints: sm, md, lg, xl
- Adaptive layouts for different screen sizes

## Access Control
- Post-login users see only their team's data
- Private teams require invite codes
- Managers have edit/upload/invite permissions
- Developers have view and chat permissions
- All data scoped to team workspace

## Development Notes
- Built with React and TypeScript
- Styled with Tailwind CSS v4.0
- Uses Lucide React for icons
- Toast notifications with Sonner
- Component library with shadcn/ui patterns
- State management with React hooks
- No external API calls (demo/prototype)
