const Joi = require('joi');

const courseSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Course title is required',
    'string.min': 'Course title must be at least 1 character long',
    'string.max': 'Course title must not exceed 255 characters',
    'any.required': 'Course title is required'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Course description must not exceed 1000 characters'
  })
});

const noteSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Note title is required',
    'string.min': 'Note title must be at least 1 character long',
    'string.max': 'Note title must not exceed 255 characters',
    'any.required': 'Note title is required'
  }),
  content: Joi.string().max(50000).optional().allow('').messages({
    'string.max': 'Note content must not exceed 50000 characters'
  }),
  course_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Course ID must be a number',
    'number.integer': 'Course ID must be an integer',
    'number.positive': 'Course ID must be a positive number',
    'any.required': 'Course ID is required'
  })
});

const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Note title cannot be empty',
    'string.min': 'Note title must be at least 1 character long',
    'string.max': 'Note title must not exceed 255 characters'
  }),
  content: Joi.string().max(50000).optional().allow('').messages({
    'string.max': 'Note content must not exceed 50000 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.empty': 'Course title cannot be empty',
    'string.min': 'Course title must be at least 1 character long',
    'string.max': 'Course title must not exceed 255 characters'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Course description must not exceed 1000 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new Error('Validation Error');
      validationError.name = 'ValidationError';
      validationError.details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(validationError);
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  courseSchema,
  noteSchema,
  updateNoteSchema,
  updateCourseSchema
};
