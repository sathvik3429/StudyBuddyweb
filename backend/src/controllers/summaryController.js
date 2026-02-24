const Note = require('../models/Note');
const Summary = require('../models/Summary');
const AIService = require('../services/aiService');
const { asyncHandler } = require('../middleware/errorHandler');

class SummaryController {
  static generateSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if note exists and get its content
    const note = await Note.findById(id);
    if (!note) {
      const error = new Error('Resource not found');
      throw error;
    }

    // Check if there's content to summarize
    if (!note.content || note.content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Note has no content to summarize'
      });
    }

    // Generate summary using AI service
    const summaryText = await AIService.summarizeText(note.content);

    // Save summary to database
    const summary = await Summary.create({
      note_id: parseInt(id),
      summary_text: summaryText
    });

    res.status(201).json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        ...summary,
        note_title: note.title,
        original_content_length: note.content.length,
        summary_length: summaryText.length
      }
    });
  });

  static getSummariesByNoteId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if note exists
    const note = await Note.findById(id);
    if (!note) {
      const error = new Error('Resource not found');
      throw error;
    }

    const summaries = await Summary.findByNoteId(id);
    
    res.status(200).json({
      success: true,
      message: 'Summaries retrieved successfully',
      data: summaries,
      count: summaries.length
    });
  });

  static getLatestSummaryByNoteId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if note exists
    const note = await Note.findById(id);
    if (!note) {
      const error = new Error('Resource not found');
      throw error;
    }

    const summary = await Summary.getLatestByNoteId(id);
    
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
  });

  static getSummaryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const summary = await Summary.findById(id);
    
    if (!summary) {
      const error = new Error('Resource not found');
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Summary retrieved successfully',
      data: summary
    });
  });

  static deleteSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if summary exists
    const existingSummary = await Summary.findById(id);
    if (!existingSummary) {
      const error = new Error('Resource not found');
      throw error;
    }

    const result = await Summary.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully',
      data: {
        id: parseInt(id),
        deleted: result.deleted
      }
    });
  });

  static getAIStatus = asyncHandler(async (req, res) => {
    const isValid = await AIService.validateApiKey();
    
    res.status(200).json({
      success: true,
      message: 'AI service status retrieved successfully',
      data: {
        ai_enabled: !!process.env.OPENAI_API_KEY || !!process.env.HUGGINGFACE_API_KEY,
        api_key_valid: isValid,
        service: process.env.AI_API_URL?.includes('openai') ? 'OpenAI' : 'Hugging Face',
        model: process.env.AI_MODEL || 'gpt-3.5-turbo'
      }
    });
  });
}

module.exports = SummaryController;
