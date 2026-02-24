const express = require('express');
const router = express.Router();
const SummaryController = require('../controllers/summaryController');

// POST /api/summaries/notes/:id/generate - Generate summary for a note
router.post('/notes/:id/generate', 
  SummaryController.generateSummary
);

// GET /api/summaries/notes/:id - Get all summaries for a note
router.get('/notes/:id', 
  SummaryController.getSummariesByNoteId
);

// GET /api/summaries/notes/:id/latest - Get latest summary for a note
router.get('/notes/:id/latest', 
  SummaryController.getLatestSummaryByNoteId
);

// GET /api/summaries/:id - Get a specific summary
router.get('/:id', 
  SummaryController.getSummaryById
);

// DELETE /api/summaries/:id - Delete a summary
router.delete('/:id', 
  SummaryController.deleteSummary
);

// GET /api/summaries/status - Get AI service status
router.get('/status', 
  SummaryController.getAIStatus
);

// POST /api/summaries/batch - Batch generate summaries for multiple notes
router.post('/batch', 
  SummaryController.batchGenerateSummaries
);

module.exports = router;
