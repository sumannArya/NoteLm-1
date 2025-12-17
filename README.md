# NoteLm - Voice-Powered Notes App

A modern, full-stack note-taking application built with Next.js that allows users to create, edit, and manage notes using both voice and text input.

![NoteLm](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- 🎤 **Voice-to-Text**: Create notes using your voice with the Web Speech API
- 📝 **Text Input**: Traditional text-based note creation and editing
- ⭐ **Star Notes**: Mark important notes for quick access
- 🎨 **Color Coding**: Organize notes with custom colors
- 🔍 **Search**: Quickly find notes by title or content
- 🔐 **Google Authentication**: Secure sign-in with Google OAuth
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: SQLite with Prisma ORM
- **Voice Recognition**: Web Speech API (NLP)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sumannArya/NoteLm.git
   cd NoteLm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

5. Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

6. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Create Note**: Click "New Note" button
3. **Voice Input**: Click the microphone button to start voice recording
4. **Edit Note**: Click on any note card to edit
5. **Star Note**: Click the star icon to mark as important
6. **Search**: Use the search bar to filter notes
7. **Delete**: Hover over a note and click the trash icon

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth.js routes
│   │   └── notes/               # Notes CRUD API
│   ├── auth/signin/             # Sign-in page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── NoteCard.tsx             # Individual note card
│   ├── NoteEditor.tsx           # Note creation/editing modal
│   ├── NotesGrid.tsx            # Notes grid view
│   └── Providers.tsx            # Session provider
├── hooks/
│   └── useSpeechRecognition.ts  # Voice input hook
├── lib/
│   └── prisma.ts                # Prisma client
└── types/
    ├── next-auth.d.ts           # NextAuth type extensions
    └── speech-recognition.d.ts  # Web Speech API types
```

## Browser Support

Voice recognition requires a browser that supports the Web Speech API:
- Chrome (recommended)
- Edge
- Safari

## License

MIT License - feel free to use this project for personal or commercial purposes.
