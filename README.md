# StudyBuddy MVP

A production-quality study management application with AI-powered summarization capabilities.

## 🎯 Overview

StudyBuddy is a modern web application that helps students organize their study materials through courses and notes, with intelligent AI summarization to enhance learning efficiency.

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Node.js** with Express.js
- **SQLite** database with foreign key constraints
- **Joi** for data validation
- **Helmet** for security
- **CORS** for cross-origin requests

**Frontend:**
- **React.js** with Vite
- **React Router** for navigation
- **Axios** for API communication
- **Heroicons** for UI icons
- **Tailwind CSS** for styling

**AI Integration:**
- **OpenAI API** (GPT-3.5-turbo) - Primary
- **Hugging Face API** (BART) - Fallback
- Built-in fallback summarization for offline use

### Database Schema

```sql
courses
├── id (PK, AUTOINCREMENT)
├── title (TEXT, NOT NULL)
├── description (TEXT)
├── created_at (DATETIME)
└── updated_at (DATETIME)

notes
├── id (PK, AUTOINCREMENT)
├── title (TEXT, NOT NULL)
├── content (TEXT)
├── course_id (FK → courses.id, ON DELETE CASCADE)
├── created_at (DATETIME)
└── updated_at (DATETIME)

summaries
├── id (PK, AUTOINCREMENT)
├── note_id (FK → notes.id, ON DELETE CASCADE)
├── summary_text (TEXT, NOT NULL)
└── created_at (DATETIME)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StudyBuddyweb
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   NODE_ENV=development
   
   # AI Service (Choose one)
   OPENAI_API_KEY=your_openai_api_key_here
   # OR
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   
   # Server
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

6. **Frontend Setup** (In a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```
   
   Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

7. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/api

## 📁 Project Structure

```
StudyBuddyweb/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database configuration
│   │   ├── controllers/
│   │   │   ├── courseController.js  # Course logic
│   │   │   ├── noteController.js    # Note logic
│   │   │   └── summaryController.js # AI summary logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── validation.js        # Request validation
│   │   ├── models/
│   │   │   ├── Course.js            # Course model
│   │   │   ├── Note.js              # Note model
│   │   │   └── Summary.js           # Summary model
│   │   ├── routes/
│   │   │   ├── courses.js           # Course routes
│   │   │   ├── notes.js             # Note routes
│   │   │   └── summaries.js         # Summary routes
│   │   ├── services/
│   │   │   └── aiService.js         # AI integration
│   │   └── app.js                   # Express app
│   ├── scripts/
│   │   └── init-db.js               # Database initialization
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js               # API client
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Main layout
│   │   │   ├── CourseCard.jsx       # Course card component
│   │   │   ├── NoteCard.jsx         # Note card component
│   │   │   ├── CourseForm.jsx       # Course form
│   │   │   ├── NoteForm.jsx         # Note form
│   │   │   └── SummaryModal.jsx     # Summary modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Dashboard page
│   │   │   ├── CoursesPage.jsx      # Courses page
│   │   │   └── NotesPage.jsx        # Notes page
│   │   └── App.jsx                  # Main App component
│   ├── package.json
│   └── .env.example
├── docs/
│   └── postman-collection.json      # API collection
└── README.md
```

## 🔌 API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get note by ID
- `GET /api/courses/:courseId/notes` - Get notes by course
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Summaries
- `POST /api/summaries/notes/:id/generate` - Generate summary
- `GET /api/summaries/notes/:id` - Get summaries by note
- `GET /api/summaries/notes/:id/latest` - Get latest summary
- `GET /api/summaries/status` - Get AI service status

## 🤖 AI Integration

### Setup Options

1. **OpenAI (Recommended)**
   - Get API key from https://platform.openai.com/
   - Set `OPENAI_API_KEY` in `.env`
   - Uses GPT-3.5-turbo for high-quality summaries

2. **Hugging Face (Free Alternative)**
   - Get API key from https://huggingface.co/
   - Set `HUGGINGFACE_API_KEY` in `.env`
   - Uses BART model for summarization

3. **Offline Fallback**
   - Built-in simple summarization algorithm
   - Works without API keys
   - Less sophisticated but functional

### Features

- **Smart Caching**: Stores all generated summaries
- **Multiple Versions**: Keeps history of summaries per note
- **Error Handling**: Graceful fallback to offline mode
- **Rate Limiting**: Built-in timeout and retry logic

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### API Testing with Postman
1. Import `docs/postman-collection.json` into Postman
2. Set environment variable `baseUrl` to `http://localhost:3001/api`
3. Run requests to test endpoints

## 📊 Performance Considerations

### Database Optimization
- **Indexes**: Primary keys automatically indexed
- **Foreign Keys**: Enforced with CASCADE deletes
- **Connection Pooling**: Single connection for SQLite
- **Query Optimization**: Efficient JOIN queries

### Frontend Optimization
- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Heroicons for lightweight icons
- **Bundle Analysis**: Vite's built-in optimization
- **Caching**: Axios interceptors for response caching

### API Performance
- **Request Validation**: Joi validation prevents bad requests
- **Error Boundaries**: Comprehensive error handling
- **Timeout Handling**: 10-second timeout for AI requests
- **Rate Limiting**: Built-in protection against abuse

## 🔒 Security Features

- **Helmet.js**: Security headers for Express
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Environment Variables**: Secure configuration

## 🐛 Edge Case Handling

### Database Errors
- Foreign key constraint violations
- Duplicate entry handling
- Connection timeout management
- Transaction rollback on errors

### API Errors
- 404 for missing resources
- 400 for validation errors
- 500 for server errors
- Graceful AI service degradation

### Frontend Errors
- Network failure handling
- Loading states for all operations
- User-friendly error messages
- Fallback UI components

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use proper database file paths
- Configure CORS for production domain
- Set up proper API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite is properly installed
   - Check file permissions for database.sqlite
   - Run `npm run init-db` to recreate database

2. **AI Service Not Working**
   - Verify API key is correct
   - Check internet connection
   - Try the fallback summarization

3. **CORS Errors**
   - Ensure frontend URL matches `CORS_ORIGIN`
   - Check both servers are running
   - Verify port numbers

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Getting Help

- Check the console for detailed error messages
- Review the API documentation at `/api`
- Test endpoints with the Postman collection
- Check environment variable configuration

## 🎉 Features Implemented

✅ **Core Features**
- Course management (CRUD operations)
- Note management with rich text support
- Relational database with proper foreign keys
- RESTful API design
- Modern React frontend with routing

✅ **AI Integration**
- OpenAI API integration
- Hugging Face fallback
- Offline summarization capability
- Summary history and management

✅ **Production Quality**
- Comprehensive error handling
- Input validation and sanitization
- Security headers and CORS
- Performance optimizations
- Edge case handling

✅ **Developer Experience**
- Clear project structure
- Environment configuration
- API documentation
- Postman collection
- Comprehensive README

StudyBuddy is now ready for development, testing, and deployment! 🚀
