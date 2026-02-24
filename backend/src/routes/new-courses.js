const express = require('express');
const router = express.Router();
const Database = require('../config/database-new');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Database.all(`
      SELECT c.*, cat.name as category_name, u.name as user_name,
             (SELECT COUNT(*) FROM notes n WHERE n.course_id = c.id) as notes_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.status = 'active'
      ORDER BY c.created_at DESC
    `);
    
    res.json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve courses'
    });
  }
});

// GET course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Database.get(`
      SELECT c.*, cat.name as category_name, u.name as user_name,
             (SELECT COUNT(*) FROM notes n WHERE n.course_id = c.id) as notes_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ? AND c.status = 'active'
    `, [id]);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    // Get notes for this course
    const notes = await Database.all(`
      SELECT * FROM notes 
      WHERE course_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        ...course,
        notes: notes
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve course'
    });
  }
});

// POST create new course
router.post('/', async (req, res) => {
  try {
    const { title, description, category_id, difficulty_level = 1, is_public = false } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Title is required'
      });
    }

    const result = await Database.run(`
      INSERT INTO courses (title, description, category_id, user_id, difficulty_level, is_public)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, category_id || 1, 1, difficulty_level, is_public]);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        id: result.id,
        title,
        description,
        category_id: category_id || 1,
        user_id: 1,
        difficulty_level,
        is_public,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create course'
    });
  }
});

// PUT update course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, difficulty_level, is_public, status } = req.body;
    
    // Check if course exists
    const existingCourse = await Database.get('SELECT * FROM courses WHERE id = ?', [id]);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    const result = await Database.run(`
      UPDATE courses 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          category_id = COALESCE(?, category_id),
          difficulty_level = COALESCE(?, difficulty_level),
          is_public = COALESCE(?, is_public),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, category_id, difficulty_level, is_public, status, id]);

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: {
        id: parseInt(id),
        changes: result.changes
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update course'
    });
  }
});

// DELETE course (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Database.run(`
      UPDATE courses 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete course'
    });
  }
});

module.exports = router;
