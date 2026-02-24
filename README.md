# StudyBuddy Enhanced 🎓

StudyBuddy is a powerful, production-ready study management platform designed to help students organize their learning journey with AI-powered tools.

## ✨ Features

- **Advanced Note Management**: Create, edit, and version-control your study notes with markdown support.
- **Course Organization**: Organize notes into courses and modules with progress tracking.
- **AI Summarization**: Automatically generate concise summaries of long notes using Hugging Face (BART) or built-in smart algorithms.
- **Flashcard Generation**: Create interactive study aids directly from your notes.
- **Enhanced Security**: JWT-based authentication, rate limiting, and secure headers.
- **Modern UI**: A lightning-fast, responsive frontend built with Vite, React, and Tailwind CSS.
- **Performance Optimized**: Local SQLite database for persistent storage with efficient query handling.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd StudyBuddyweb
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run init-db
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, SQLite3, Joi (Validation), JWT (Auth)
- **AI**: Hugging Face API (facebook/bart-large-cnn)
- **Security**: Helmet, Express-Rate-Limit, CORS

## 🔌 API Documentation

Detailed documentation is available at `http://localhost:3001/api` when the server is running.

### Key Endpoints:
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate and get token
- `GET /api/courses` - List courses (paginated)
- `POST /api/notes` - Create new study note
- `POST /api/summaries/notes/:id/generate` - AI Summarization

## 🧪 Testing & Tools

- **Postman**: Import `docs/postman-collection.json` for a pre-configured API testing suite.
- **Tests**: Run `npm test` in the backend directory.

## 📝 License
MIT License
