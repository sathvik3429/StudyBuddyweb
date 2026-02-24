const express = require('express');
const router = express.Router();
const Joi = require('joi');
const database = require('../config/database-enhanced');

// Validation schemas
const createCourseSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  category_id: Joi.number().integer().positive().optional(),
  difficulty_level: Joi.number().integer().min(1).max(5).default(1),
  estimated_hours: Joi.number().integer().min(0).default(0),
  is_public: Joi.boolean().default(false),
  status: Joi.string().valid('active', 'archived', 'draft').default('active'),
  tags: Joi.string().max(500).optional(),
  thumbnail_url: Joi.string().uri().optional()
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  category_id: Joi.number().integer().positive().optional(),
  difficulty_level: Joi.number().integer().min(1).max(5).optional(),
  estimated_hours: Joi.number().integer().min(0).optional(),
  is_public: Joi.boolean().optional(),
  status: Joi.string().valid('active', 'archived', 'draft').optional(),
  tags: Joi.string().max(500).optional(),
  thumbnail_url: Joi.string().uri().optional()
});

// GET /api/courses - Get all courses with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category_id, 
      difficulty_level, 
      status = 'active',
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE c.status = ?';
    let params = [status];

    // Add filters
    if (category_id) {
      whereClause += ' AND c.category_id = ?';
      params.push(category_id);
    }

    if (difficulty_level) {
      whereClause += ' AND c.difficulty_level = ?';
      params.push(difficulty_level);
    }

    if (search) {
      whereClause += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Validate sort column
    const validSortColumns = ['title', 'created_at', 'updated_at', 'difficulty_level', 'estimated_hours'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM courses c 
      ${whereClause}
    `;
    
    const countResult = await database.get(countQuery, params);
    const total = countResult.total;

    // Get courses with additional info
    const coursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category_id,
        c.user_id,
        c.difficulty_level,
        c.estimated_hours,
        c.is_public,
        c.status,
        c.thumbnail_url,
        c.tags,
        c.created_at,
        c.updated_at,
        cat.name as category_name,
        cat.color as category_color,
        cat.icon as category_icon,
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        (SELECT COUNT(*) FROM notes n WHERE n.course_id = c.id AND n.is_archived = 0) as notes_count,
        (SELECT COUNT(*) FROM course_modules cm WHERE cm.course_id = c.id) as modules_count,
        (SELECT AVG(up.completion_percentage) FROM user_progress up WHERE up.course_id = c.id) as avg_completion
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const courses = await database.query(coursesQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
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

// GET /api/courses/:id - Get a specific course with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const courseQuery = `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        cat.icon as category_icon,
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        (SELECT COUNT(*) FROM notes n WHERE n.course_id = c.id AND n.is_archived = 0) as notes_count,
        (SELECT COUNT(*) FROM course_modules cm WHERE cm.course_id = c.id) as modules_count,
        (SELECT AVG(up.completion_percentage) FROM user_progress up WHERE up.course_id = c.id) as avg_completion
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;

    const course = await database.get(courseQuery, [id]);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    // Get course modules
    const modulesQuery = `
      SELECT * FROM course_modules 
      WHERE course_id = ? 
      ORDER BY order_index ASC
    `;
    const modules = await database.query(modulesQuery, [id]);

    // Get recent notes
    const notesQuery = `
      SELECT id, title, word_count, reading_time_minutes, created_at, updated_at
      FROM notes 
      WHERE course_id = ? AND is_archived = 0
      ORDER BY updated_at DESC
      LIMIT 5
    `;
    const recentNotes = await database.query(notesQuery, [id]);

    res.json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        ...course,
        modules,
        recentNotes
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

// GET /api/courses/:id/notes - Get all notes for a specific course
router.get('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search, sort_by = 'updated_at', sort_order = 'DESC' } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE n.course_id = ? AND n.is_archived = 0';
    let params = [id];

    if (search) {
      whereClause += ' AND (n.title LIKE ? OR n.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const validSortColumns = ['title', 'created_at', 'updated_at', 'word_count'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'updated_at';
    const sortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM notes n 
      ${whereClause}
    `;
    
    const countResult = await database.get(countQuery, params);
    const total = countResult.total;

    const notesQuery = `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.content_type,
        n.word_count,
        n.reading_time_minutes,
        n.is_bookmarked,
        n.tags,
        n.created_at,
        n.updated_at,
        (SELECT COUNT(*) FROM summaries s WHERE s.note_id = n.id) as summaries_count
      FROM notes n
      ${whereClause}
      ORDER BY n.${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const notes = await database.query(notesQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      message: 'Course notes retrieved successfully',
      data: notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get course notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve course notes'
    });
  }
});

// POST /api/courses - Create a new course
router.post('/', async (req, res) => {
  try {
    const { error, value } = createCourseSchema.validate(req.body);
    
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
      description,
      category_id,
      difficulty_level,
      estimated_hours,
      is_public,
      status,
      tags,
      thumbnail_url
    } = value;

    // For now, we'll use a default user_id (in a real app, this would come from authentication)
    const user_id = 1;

    const insertQuery = `
      INSERT INTO courses (
        title, description, category_id, user_id, difficulty_level, 
        estimated_hours, is_public, status, tags, thumbnail_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await database.run(insertQuery, [
      title, description, category_id, user_id, difficulty_level,
      estimated_hours, is_public, status, tags, thumbnail_url
    ]);

    // Get the created course
    const createdCourse = await database.get('SELECT * FROM courses WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: createdCourse
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

// PUT /api/courses/:id - Update a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateCourseSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
    }

    // Check if course exists
    const existingCourse = await database.get('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
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

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No valid fields to update'
      });
    }

    params.push(id);

    const updateQuery = `UPDATE courses SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    await database.run(updateQuery, params);

    // Get updated course
    const updatedCourse = await database.get('SELECT * FROM courses WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
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

// DELETE /api/courses/:id - Delete a course (soft delete by updating status)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await database.get('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    // Soft delete by updating status to archived
    await database.run('UPDATE courses SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['archived', id]);

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

// POST /api/courses/:id/modules - Add a module to a course
router.post('/:id/modules', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order_index, is_required } = req.body;

    const moduleSchema = Joi.object({
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().max(1000).optional(),
      order_index: Joi.number().integer().min(0).default(0),
      is_required: Joi.boolean().default(true)
    });

    const { error, value } = moduleSchema.validate({ title, description, order_index, is_required });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    // Check if course exists
    const course = await database.get('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    const insertQuery = `
      INSERT INTO course_modules (course_id, title, description, order_index, is_required)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await database.run(insertQuery, [id, value.title, value.description, value.order_index, value.is_required]);

    const createdModule = await database.get('SELECT * FROM course_modules WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Module added successfully',
      data: createdModule
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to add module'
    });
  }
});

module.exports = router;
