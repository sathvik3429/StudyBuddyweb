import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';
import { coursesAPI } from '../api/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search term
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      setCourses(response.data.data || []);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, formData);
      } else {
        await coursesAPI.create(formData);
      }
      setShowForm(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (err) {
      throw err; // Let the form handle the error
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await coursesAPI.delete(courseId);
      await fetchCourses();
    } catch (err) {
      setError('Failed to delete course');
      console.error('Delete course error:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (showForm) {
    return (
      <CourseForm
        course={editingCourse}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={handleCreateCourse}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm ? 'No courses found matching your search.' : 'No courses yet.'}
          </div>
          {!searchTerm && (
            <button
              onClick={handleCreateCourse}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
