const HuggingFaceService = require('../services/freeLLMService');
const Summary = require('../models/Summary');
const Note = require('../models/Note');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate summary for a note
const generateSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type = 'standard', maxLength = 500 } = req.query;
  
  try {
    // Get the note content
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    // Check if note has content
    if (!note.content || note.content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Note has no content to summarize'
      });
    }

    // Generate summary using Hugging Face service
    let summaryText;
    try {
      switch (type) {
        case 'bullet-points':
          summaryText = await HuggingFaceService.summarizeWithBulletPoints(note.content);
          break;
        case 'concepts':
          const concepts = await HuggingFaceService.extractKeyConcepts(note.content);
          summaryText = `Key Concepts: ${concepts.join(', ')}`;
          break;
        case 'questions':
          const questions = await HuggingFaceService.generateStudyQuestions(note.content);
          summaryText = `Study Questions:\n${questions.join('\n')}`;
          break;
        default:
          summaryText = await HuggingFaceService.summarizeText(note.content, maxLength);
      }
    } catch (aiError) {
      console.error('AI summarization error:', aiError);
      // Use fallback summarization
      summaryText = HuggingFaceService.generateFallbackSummary(note.content, maxLength);
    }

    // Save summary to database
    const wordCount = summaryText.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    const summary = await Summary.create({
      note_id: id,
      content: summaryText,
      word_count: wordCount,
      reading_time_seconds: readingTime * 60,
      model: 'facebook/bart-large-cnn',
      ai_confidence: 0.85 // Hugging Face confidence
    });

    res.status(201).json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        ...summary,
        provider_info: {
          service: 'HuggingFaceService',
          model: 'facebook/bart-large-cnn',
          type: type
        }
      }
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to generate summary'
    });
  }
});

// Get all summaries for a note
const getSummariesByNoteId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const summaries = await Summary.findByNoteId(id);
    
    res.status(200).json({
      success: true,
      message: 'Summaries retrieved successfully',
      data: summaries,
      count: summaries.length
    });
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve summaries'
    });
  }
});

// Get latest summary for a note
const getLatestSummaryByNoteId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const summary = await Summary.findLatestByNoteId(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'No summary found for this note'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Latest summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Get latest summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve latest summary'
    });
  }
});

// Get a specific summary
const getSummaryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const summary = await Summary.findById(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Summary not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve summary'
    });
  }
});

// Delete a summary
const deleteSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const summary = await Summary.findById(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Summary not found'
      });
    }

    await Summary.delete(id);
    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully'
    });
  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete summary'
    });
  }
});

// Get AI service status
const getAIStatus = asyncHandler(async (req, res) => {
  try {
    const connectionTest = await HuggingFaceService.testConnection();
    
    res.status(200).json({
      success: true,
      message: 'AI service status retrieved successfully',
      data: {
        service: 'HuggingFaceService',
        is_configured: HuggingFaceService.isConfigured(),
        provider: 'huggingface',
        model: 'facebook/bart-large-cnn',
        connection_test: connectionTest,
        features: [
          'Text summarization',
          'Bullet point summaries',
          'Key concept extraction',
          'Study question generation',
          'Fallback summarization',
          'Batch processing'
        ],
        supported_types: [
          'standard',
          'bullet-points',
          'concepts',
          'questions'
        ],
        api_info: {
          provider: 'Hugging Face',
          model: 'facebook/bart-large-cnn',
          api_url: 'https://api-inference.huggingface.co',
          tier: 'Free',
          limits: '10,000 requests/month, 30 requests/second'
        }
      }
    });
  } catch (error) {
    console.error('AI status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get AI service status'
    });
  }
});

// Batch generate summaries for multiple notes
const batchGenerateSummaries = asyncHandler(async (req, res) => {
  const { note_ids, type = 'standard', maxLength = 500 } = req.body;
  
  if (!Array.isArray(note_ids) || note_ids.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'note_ids must be a non-empty array'
    });
  }

  if (note_ids.length > 10) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Cannot process more than 10 notes at once'
    });
  }

  try {
    // Get all notes
    const notes = [];
    for (const noteId of note_ids) {
      const note = await Note.findById(noteId);
      if (note) {
        notes.push(note);
      }
    }

    // Use Hugging Face batch processing
    const batchResult = await HuggingFaceService.batchSummarize(notes, type, maxLength);

    // Save summaries to database
    const savedSummaries = [];
    for (const result of batchResult.successful) {
      try {
        const wordCount = result.summary.split(' ').length;
        const readingTime = Math.ceil(wordCount / 200);
        
        const summary = await Summary.create({
          note_id: result.note_id,
          content: result.summary,
          word_count: wordCount,
          reading_time_seconds: readingTime * 60,
          model: 'facebook/bart-large-cnn',
          ai_confidence: 0.85
        });
        
        savedSummaries.push({
          note_id: result.note_id,
          summary_id: summary.id,
          success: true
        });
      } catch (error) {
        batchResult.failed.push({ note_id: result.note_id, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Batch processing completed. ${savedSummaries.length} successful, ${batchResult.failed.length} failed`,
      data: {
        successful: savedSummaries,
        failed: batchResult.failed,
        total_processed: note_ids.length,
        success_rate: (savedSummaries.length / note_ids.length * 100).toFixed(1) + '%'
      }
    });
  } catch (error) {
    console.error('Batch generate summaries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to batch generate summaries'
    });
  }
});

module.exports = {
  generateSummary,
  getSummariesByNoteId,
  getLatestSummaryByNoteId,
  getSummaryById,
  deleteSummary,
  getAIStatus,
  batchGenerateSummaries
};
