import React, { useState, useEffect } from 'react';

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || ''
      });
    }
  }, [course]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Course title must not exceed 255 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {course ? 'Edit Course' : 'Create New Course'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course title"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course description (optional)"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
