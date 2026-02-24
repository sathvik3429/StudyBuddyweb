require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const coursesRouter = require('./routes/courses');
const notesRouter = require('./routes/notes');
const summariesRouter = require('./routes/summaries');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyBuddy API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/courses', coursesRouter);
app.use('/api/notes', notesRouter);
app.use('/api/summaries', summariesRouter);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyBuddy API Documentation',
    version: '1.0.0',
    endpoints: {
      courses: {
        'GET /api/courses': 'Get all courses',
        'POST /api/courses': 'Create a new course',
        'GET /api/courses/:id': 'Get a specific course',
        'PUT /api/courses/:id': 'Update a course',
        'DELETE /api/courses/:id': 'Delete a course'
      },
      notes: {
        'GET /api/notes': 'Get all notes',
        'POST /api/notes': 'Create a new note',
        'GET /api/notes/:id': 'Get a specific note',
        'GET /api/courses/:courseId/notes': 'Get notes for a course',
        'PUT /api/notes/:id': 'Update a note',
        'DELETE /api/notes/:id': 'Delete a note'
      },
      summaries: {
        'POST /api/summaries/notes/:id/generate': 'Generate summary for a note',
        'GET /api/summaries/notes/:id': 'Get summaries for a note',
        'GET /api/summaries/notes/:id/latest': 'Get latest summary for a note',
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
