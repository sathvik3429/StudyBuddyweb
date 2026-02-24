import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { coursesAPI } from '../api/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, sortBy, sortOrder]);

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

  const filterAndSortCourses = () => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort courses
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(filtered);
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
      throw err;
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

  if (loading) {
    return <LoadingSpinner text="Loading courses..." />;
  }

  if (showForm) {
    return (
      <CourseForm
        course={editingCourse}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={handleCreateCourse}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Course
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
              <option value="updated_at">Last Updated</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Bar */}
      {filteredCourses.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AcademicCapIcon className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-900">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
              </span>
            </div>
            <div className="flex items-center text-sm text-indigo-700">
              <ClockIcon className="w-4 h-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={AcademicCapIcon}
          title={searchTerm ? 'No Courses Found' : 'No Courses Yet'}
          description={
            searchTerm 
              ? `No courses found matching "${searchTerm}". Try different search terms.`
              : 'Create your first course to start organizing your study materials.'
          }
          actionText={searchTerm ? 'Clear Search' : 'Create Your First Course'}
          onAction={searchTerm ? () => setSearchTerm('') : handleCreateCourse}
          illustration="/api/placeholder/illustration/courses-empty.svg"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group relative">
              <CourseCard
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
              
              {/* Hover overlay with quick actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200 pointer-events-none">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-2 bg-blue-600 text-white rounded-lg shadow-lg transform hover:scale-110 transition-all duration-200"
                      title="Edit course"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 bg-red-600 text-white rounded-lg shadow-lg transform hover:scale-110 transition-all duration-200"
                      title="Delete course"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      {courses.length > 0 && !showForm && (
        <button
          onClick={handleCreateCourse}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40"
          title="Create new course"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default CoursesPage;
