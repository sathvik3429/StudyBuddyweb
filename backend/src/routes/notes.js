const express = require('express');
const NoteController = require('../controllers/noteController');
const { validate, noteSchema, updateNoteSchema } = require('../middleware/validation');

const router = express.Router();

// POST /api/notes - Create a new note
router.post('/', 
  validate(noteSchema),
  NoteController.createNote
);

// GET /api/notes - Get all notes
router.get('/', 
  NoteController.getAllNotes
);

// GET /api/courses/:courseId/notes - Get all notes for a specific course
router.get('/courses/:courseId/notes', 
  NoteController.getNotesByCourseId
);

// GET /api/notes/:id - Get a specific note
router.get('/:id', 
  NoteController.getNoteById
);

// GET /api/notes/:id/content - Get note content for summarization
router.get('/:id/content', 
  NoteController.getNoteContent
);

// PUT /api/notes/:id - Update a note
router.put('/:id', 
  validate(updateNoteSchema),
  NoteController.updateNote
);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', 
  NoteController.deleteNote
);

module.exports = router;
