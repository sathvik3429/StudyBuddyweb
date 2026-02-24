const express = require('express');
const router = express.Router();
const Database = require('../config/database-new');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const { course_id, user_id = 1, status = 'active' } = req.query;
    
    let sql = `
      SELECT n.*, c.title as course_title, u.name as user_name,
             (SELECT COUNT(*) FROM summaries s WHERE s.note_id = n.id) as summaries_count
      FROM notes n
      LEFT JOIN courses c ON n.course_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.status = ? AND n.user_id = ?
    `;
    
    const params = [status, user_id];
    
    if (course_id) {
      sql += ' AND n.course_id = ?';
      params.push(course_id);
    }
    
    sql += ' ORDER BY n.created_at DESC';
    
    const notes = await Database.all(sql, params);
    
    res.json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes,
      count: notes.length
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

// GET note by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Database.get(`
      SELECT n.*, c.title as course_title, u.name as user_name
      FROM notes n
      LEFT JOIN courses c ON n.course_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = ? AND n.status = 'active'
    `, [id]);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    // Get summaries for this note
    const summaries = await Database.all(`
      SELECT * FROM summaries 
      WHERE note_id = ? 
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      success: true,
      message: 'Note retrieved successfully',
      data: {
        ...note,
        summaries: summaries
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

// POST create new note
router.post('/', async (req, res) => {
  try {
    const { title, content, content_type = 'markdown', course_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Title and content are required'
      });
    }

    // Calculate word count and reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    const result = await Database.run(`
      INSERT INTO notes (title, content, content_type, course_id, user_id, word_count, reading_time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, content, content_type, course_id || 1, 1, wordCount, readingTime]);

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        id: result.id,
        title,
        content,
        content_type,
        course_id: course_id || 1,
        user_id: 1,
        word_count: wordCount,
        reading_time: readingTime,
        created_at: new Date().toISOString()
      }
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

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, content_type, course_id, is_bookmarked, status } = req.body;
    
    // Check if note exists
    const existingNote = await Database.get('SELECT * FROM notes WHERE id = ?', [id]);
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    // Recalculate word count and reading time if content changed
    let wordCount = existingNote.word_count;
    let readingTime = existingNote.reading_time;
    
    if (content && content !== existingNote.content) {
      wordCount = content.split(/\s+/).length;
      readingTime = Math.ceil(wordCount / 200);
    }

    const result = await Database.run(`
      UPDATE notes 
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          content_type = COALESCE(?, content_type),
          course_id = COALESCE(?, course_id),
          word_count = COALESCE(?, word_count),
          reading_time = COALESCE(?, reading_time),
          is_bookmarked = COALESCE(?, is_bookmarked),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, content, content_type, course_id, wordCount, readingTime, is_bookmarked, status, id]);

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: {
        id: parseInt(id),
        changes: result.changes
      }
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

// DELETE note (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Database.run(`
      UPDATE notes 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete note'
    });
  }
});

// POST toggle bookmark
router.post('/:id/bookmark', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current bookmark status
    const note = await Database.get('SELECT is_bookmarked FROM notes WHERE id = ?', [id]);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Note not found'
      });
    }

    const newBookmarkStatus = !note.is_bookmarked;
    
    await Database.run(`
      UPDATE notes 
      SET is_bookmarked = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newBookmarkStatus, id]);

    res.json({
      success: true,
      message: `Note ${newBookmarkStatus ? 'bookmarked' : 'unbookmarked'} successfully`,
      data: {
        id: parseInt(id),
        is_bookmarked: newBookmarkStatus
      }
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

module.exports = router;
