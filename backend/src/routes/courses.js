const express = require('express');
const CourseController = require('../controllers/courseController');
const { validate, courseSchema, updateCourseSchema } = require('../middleware/validation');

const router = express.Router();

// POST /api/courses - Create a new course
router.post('/', 
  validate(courseSchema),
  CourseController.createCourse
);

// GET /api/courses - Get all courses
router.get('/', 
  CourseController.getAllCourses
);

// GET /api/courses/:id - Get a specific course
router.get('/:id', 
  CourseController.getCourseById
);

// PUT /api/courses/:id - Update a course
router.put('/:id', 
  validate(updateCourseSchema),
  CourseController.updateCourse
);

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', 
  CourseController.deleteCourse
);

module.exports = router;
