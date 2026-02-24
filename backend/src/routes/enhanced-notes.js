const express = require('express');
const router = express.Router();
const Joi = require('joi');
const database = require('../config/database-enhanced');

// Validation schemas
const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(300).required(),
  content: Joi.string().min(1).required(),
  content_type: Joi.string().valid('markdown', 'plain', 'html').default('markdown'),
  course_id: Joi.number().integer().positive().required(),
  module_id: Joi.number().integer().positive().optional(),
  tags: Joi.string().max(500).optional(),
  is_bookmarked: Joi.boolean().default(false)
});

const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(300).optional(),
  content: Joi.string().min(1).optional(),
  content_type: Joi.string().valid('markdown', 'plain', 'html').optional(),
  course_id: Joi.number().integer().positive().optional(),
  module_id: Joi.number().integer().positive().optional(),
  tags: Joi.string().max(500).optional(),
  is_bookmarked: Joi.boolean().optional(),
  is_archived: Joi.boolean().optional()
});

// Helper function to calculate word count and reading time
const calculateReadingStats = (content) => {
  const wordCount = content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  return { wordCount, readingTimeMinutes };
};

// GET /api/notes - Get all notes with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      course_id, 
      module_id,
      is_bookmarked,
      is_archived = false,
      search,
      sort_by = 'updated_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE n.is_archived = ?';
    let params = [is_archived === 'true' ? 1 : 0];

    // Add filters
    if (course_id) {
      whereClause += ' AND n.course_id = ?';
      params.push(course_id);
    }

    if (module_id) {
      whereClause += ' AND n.module_id = ?';
      params.push(module_id);
    }

    if (is_bookmarked) {
      whereClause += ' AND n.is_bookmarked = ?';
      params.push(is_bookmarked === 'true' ? 1 : 0);
    }

    if (search) {
      whereClause += ' AND (n.title LIKE ? OR n.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const validSortColumns = ['title', 'created_at', 'updated_at', 'word_count', 'reading_time_minutes'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'updated_at';
    const sortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM notes n 
      ${whereClause}
    `;
    
    const countResult = await database.get(countQuery, params);
    const total = countResult.total;

    // Get notes with additional info
    const notesQuery = `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.content_type,
        n.course_id,
        n.module_id,
        n.user_id,
        n.is_bookmarked,
        n.is_archived,
        n.word_count,
        n.reading_time_minutes,
        n.tags,
        n.created_at,
        n.updated_at,
        c.title as course_title,
        c.description as course_description,
        cm.title as module_title,
        (SELECT COUNT(*) FROM summaries s WHERE s.note_id = n.id) as summaries_count,
        (SELECT COUNT(*) FROM flashcards f WHERE f.note_id = n.id) as flashcards_count
      FROM notes n
      LEFT JOIN courses c ON n.course_id = c.id
      LEFT JOIN course_modules cm ON n.module_id = cm.id
      ${whereClause}
      ORDER BY n.${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const notes = await database.query(notesQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve notes'
    });
  }
});

// GET /api/notes/:id - Get a specific note with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const noteQuery = `
      SELECT 
        n.*,
        c.title as course_title,
        c.description as course_description,
        cm.title as module_title,
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        (SELECT COUNT(*) FROM summaries s WHERE s.note_id = n.id) as summaries_count,
        (SELECT COUNT(*) FROM flashcards f WHERE f.note_id = n.id) as flashcards_count,
        (SELECT COUNT(*) FROM note_versions nv WHERE nv.note_id = n.id) as versions_count
      FROM notes n
      LEFT JOIN courses c ON n.course_id = c.id
      LEFT JOIN course_modules cm ON n.module_id = cm.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = ?
    `;

    const note = await database.get(noteQuery, [id]);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    // Get summaries for this note
    const summariesQuery = `
      SELECT * FROM summaries 
      WHERE note_id = ? 
      ORDER BY created_at DESC
    `;
    const summaries = await database.query(summariesQuery, [id]);

    // Get flashcards for this note
    const flashcardsQuery = `
      SELECT * FROM flashcards 
      WHERE note_id = ? 
      ORDER BY created_at DESC
    `;
    const flashcards = await database.query(flashcardsQuery, [id]);

    res.json({
      success: true,
      message: 'Note retrieved successfully',
      data: {
        ...note,
        summaries,
        flashcards
      }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve note'
    });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { error, value } = createNoteSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
    }

    const {
      title,
      content,
      content_type,
      course_id,
      module_id,
      tags,
      is_bookmarked
    } = value;

    // Calculate reading stats
    const { wordCount, readingTimeMinutes } = calculateReadingStats(content);

    // For now, we'll use a default user_id (in a real app, this would come from authentication)
    const user_id = 1;

    // Check if course exists
    const course = await database.get('SELECT * FROM courses WHERE id = ?', [course_id]);
    
    if (!course) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Course not found'
      });
    }

    // Check if module exists (if provided)
    if (module_id) {
      const module = await database.get('SELECT * FROM course_modules WHERE id = ? AND course_id = ?', [module_id, course_id]);
      
      if (!module) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Module not found or does not belong to this course'
        });
      }
    }

    const insertQuery = `
      INSERT INTO notes (
        title, content, content_type, course_id, module_id, user_id,
        is_bookmarked, word_count, reading_time_minutes, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await database.run(insertQuery, [
      title, content, content_type, course_id, module_id, user_id,
      is_bookmarked, wordCount, readingTimeMinutes, tags
    ]);

    // Create a version record
    const versionQuery = `
      INSERT INTO note_versions (note_id, content, version_number, created_by)
      VALUES (?, ?, ?, ?)
    `;
    await database.run(versionQuery, [result.lastID, content, 1, user_id]);

    // Get the created note
    const createdNote = await database.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: createdNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create note'
    });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateNoteSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
    }

    // Check if note exists
    const existingNote = await database.get('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    const updates = [];
    const params = [];

    // Build dynamic update query
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value[key]);
      }
    });

    // Recalculate reading stats if content was updated
    if (value.content) {
      const { wordCount, readingTimeMinutes } = calculateReadingStats(value.content);
      updates.push('word_count = ?');
      updates.push('reading_time_minutes = ?');
      params.push(wordCount, readingTimeMinutes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No valid fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const updateQuery = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`;
    
    await database.run(updateQuery, params);

    // Create a version record if content was updated
    if (value.content) {
      const versionQuery = `
        INSERT INTO note_versions (note_id, content, version_number, created_by, change_summary)
        SELECT ?, ?, COALESCE(MAX(version_number), 0) + 1, ?, ?
        FROM note_versions WHERE note_id = ?
      `;
      await database.run(versionQuery, [id, value.content, 1, 'Content updated', id]);
    }

    // Get updated note
    const updatedNote = await database.get('SELECT * FROM notes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update note'
    });
  }
});

// DELETE /api/notes/:id - Delete a note (soft delete by archiving)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if note exists
    const existingNote = await database.get('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    // Soft delete by archiving
    await database.run('UPDATE notes SET is_archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Note archived successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to archive note'
    });
  }
});

// POST /api/notes/:id/bookmark - Toggle bookmark status
router.post('/:id/bookmark', async (req, res) => {
  try {
    const { id } = req.params;

    const note = await database.get('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    const newBookmarkStatus = note.is_bookmarked ? 0 : 1;
    
    await database.run(
      'UPDATE notes SET is_bookmarked = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [newBookmarkStatus, id]
    );

    const updatedNote = await database.get('SELECT * FROM notes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Note ${newBookmarkStatus ? 'bookmarked' : 'unbookmarked'} successfully`,
      data: updatedNote
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to toggle bookmark'
    });
  }
});

// GET /api/notes/:id/versions - Get note version history
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;

    const versionsQuery = `
      SELECT 
        nv.*,
        u.username as editor_username,
        u.first_name as editor_first_name,
        u.last_name as editor_last_name
      FROM note_versions nv
      LEFT JOIN users u ON nv.created_by = u.id
      WHERE nv.note_id = ?
      ORDER BY nv.version_number DESC
    `;

    const versions = await database.query(versionsQuery, [id]);

    res.json({
      success: true,
      message: 'Note versions retrieved successfully',
      data: versions
    });
  } catch (error) {
    console.error('Get note versions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve note versions'
    });
  }
});

// POST /api/notes/:id/flashcards - Create flashcards from note content
router.post('/:id/flashcards', async (req, res) => {
  try {
    const { id } = req.params;
    const { flashcards } = req.body; // Array of {question, answer} objects

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Flashcards array is required and cannot be empty'
      });
    }

    // Check if note exists
    const note = await database.get('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    const createdFlashcards = [];

    for (const flashcard of flashcards) {
      const { question, answer } = flashcard;
      
      if (!question || !answer) {
        continue; // Skip invalid flashcards
      }

      const insertQuery = `
        INSERT INTO flashcards (note_id, question, answer)
        VALUES (?, ?, ?)
      `;

      const result = await database.run(insertQuery, [id, question, answer]);
      
      const createdFlashcard = await database.get('SELECT * FROM flashcards WHERE id = ?', [result.lastID]);
      createdFlashcards.push(createdFlashcard);
    }

    res.status(201).json({
      success: true,
      message: 'Flashcards created successfully',
      data: createdFlashcards
    });
  } catch (error) {
    console.error('Create flashcards error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create flashcards'
    });
  }
});

module.exports = router;
