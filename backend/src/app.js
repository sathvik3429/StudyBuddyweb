require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./config/database-enhanced');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter, aiLimiter, createLimiter } = require('./middleware/rateLimiter');
const { performanceMonitor, requestSizeLimiter, performanceHealthCheck } = require('./middleware/performance');

// Import routes
const authRouter = require('./routes/auth');
const courseRouter = require('./routes/enhanced-courses');
const noteRouter = require('./routes/enhanced-notes');
const summaryRouter = require('./routes/summaries');
const aiRouter = require('./routes/ai');
const firebaseAuthRouter = require('./routes/firebase-auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Performance monitoring
app.use(performanceMonitor);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with size limit
app.use(requestSizeLimiter(10 * 1024 * 1024)); // 10MB limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Apply rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', performanceHealthCheck);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/firebase-auth', firebaseAuthRouter);
app.use('/api/courses', courseRouter);
app.use('/api/notes', noteRouter);
app.use('/api/summaries', summaryRouter);
app.use('/api/ai', aiRouter);

// Additional API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'StudyBuddy Enhanced API',
    version: '2.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user and get JWT token',
        'GET /api/auth/profile': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/password': 'Change user password',
        'GET /api/auth/verify': 'Verify JWT token',
        'POST /api/auth/logout': 'Logout user',
        'DELETE /api/auth/account': 'Deactivate user account'
      },
      courses: {
        'GET /api/courses': 'Get all courses with pagination and filtering',
        'GET /api/courses/:id': 'Get a specific course with full details',
        'GET /api/courses/:id/notes': 'Get all notes for a specific course',
        'POST /api/courses': 'Create a new course',
        'PUT /api/courses/:id': 'Update a course',
        'DELETE /api/courses/:id': 'Delete a course (soft delete)',
        'POST /api/courses/:id/modules': 'Add a module to a course'
      },
      notes: {
        'GET /api/notes': 'Get all notes with pagination and filtering',
        'GET /api/notes/:id': 'Get a specific note with full details',
        'POST /api/notes': 'Create a new note',
        'PUT /api/notes/:id': 'Update a note',
        'DELETE /api/notes/:id': 'Delete a note (soft delete)',
        'POST /api/notes/:id/bookmark': 'Toggle bookmark status',
        'GET /api/notes/:id/versions': 'Get note version history',
        'POST /api/notes/:id/flashcards': 'Create flashcards from note content'
      },
      summaries: {
        'POST /api/summaries/notes/:id/generate': 'Generate summary for a note',
        'GET /api/summaries/notes/:id': 'Get all summaries for a note',
        'GET /api/summaries/notes/:id/latest': 'Get latest summary for a note',
        'GET /api/summaries/:id': 'Get a specific summary',
        'DELETE /api/summaries/:id': 'Delete a summary',
        'GET /api/summaries/status': 'Get AI service status'
      }
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await database.initialize();
    await database.createTables();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 StudyBuddy API server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
