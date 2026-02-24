const Note = require('../models/Note');
const { asyncHandler } = require('../middleware/errorHandler');

class NoteController {
  static createNote = asyncHandler(async (req, res) => {
    const note = await Note.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  });

  static getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.findAll();
    
    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
      count: notes.length
    });
  });

  static getNotesByCourseId = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const notes = await Note.findByCourseId(courseId);
    
    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
      count: notes.length
    });
  });

  static getNoteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    
    if (!note) {
      const error = new Error('Resource not found');
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note
    });
  });

  static updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if note exists
    const existingNote = await Note.findById(id);
    if (!existingNote) {
      const error = new Error('Resource not found');
      throw error;
    }

    const updatedNote = await Note.update(id, req.body);
    
    if (updatedNote.changes === 0) {
      return res.status(200).json({
        success: true,
        message: 'No changes made to note',
        data: existingNote
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: { id, ...req.body }
    });
  });

  static deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if note exists
    const existingNote = await Note.findById(id);
    if (!existingNote) {
      const error = new Error('Resource not found');
      throw error;
    }

    const result = await Note.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: {
        id: parseInt(id),
        deleted: result.deleted
      }
    });
  });

  static getNoteContent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.getContent(id);
    
    if (!note) {
      const error = new Error('Resource not found');
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Note content retrieved successfully',
      data: note
    });
  });
}

module.exports = NoteController;
