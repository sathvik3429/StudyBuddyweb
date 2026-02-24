import React from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const NoteCard = ({ note, onDelete, onEdit, onSummarize }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(note);
  };

  const handleSummarize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSummarize(note);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return 'No content';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Link
      to={`/notes/${note.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {note.title}
              </h3>
            </div>
            
            {note.course_title && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <AcademicCapIcon className="w-4 h-4 mr-1" />
                <span>{note.course_title}</span>
              </div>
            )}

            <p className="text-gray-600 text-sm mb-4">
              {truncateContent(note.content)}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {new Date(note.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSummarize}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                  title="Generate summary"
                >
                  <SparklesIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit note"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete note"
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

export default NoteCard;
