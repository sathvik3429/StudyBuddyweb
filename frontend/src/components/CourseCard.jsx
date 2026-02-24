import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const CourseCard = ({ course, onDelete, onEdit }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      onDelete(course.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(course);
  };

  return (
    <Link
      to={`/courses/${course.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <AcademicCapIcon className="w-6 h-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {course.title}
              </h3>
            </div>
            
            {course.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                <span>{course.notes_count || 0} notes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit course"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete course"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
