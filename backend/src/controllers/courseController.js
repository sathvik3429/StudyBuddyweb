const Course = require('../models/Course');
const { asyncHandler } = require('../middleware/errorHandler');

class CourseController {
  static createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  });

  static getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
      count: courses.length
    });
  });

  static getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    
    if (!course) {
      const error = new Error('Resource not found');
      throw error;
    }

    const notesCount = await Course.getNotesCount(id);
    
    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        ...course,
        notes_count: notesCount
      }
    });
  });

  static updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      const error = new Error('Resource not found');
      throw error;
    }

    const updatedCourse = await Course.update(id, req.body);
    
    if (updatedCourse.changes === 0) {
      return res.status(200).json({
        success: true,
        message: 'No changes made to course',
        data: existingCourse
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { id, ...req.body }
    });
  });

  static deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      const error = new Error('Resource not found');
      throw error;
    }

    const result = await Course.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        id: parseInt(id),
        deleted: result.deleted
      }
    });
  });
}

module.exports = CourseController;
