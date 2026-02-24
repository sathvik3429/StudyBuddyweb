import React, { useState } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SummaryModal = ({ isOpen, onClose, note, summary, isGenerating, onGenerate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                AI Summary
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Note info */}
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                <span className="font-medium">{note?.title}</span>
              </div>
              {note?.course_title && (
                <div className="text-xs text-gray-500">
                  Course: {note.course_title}
                </div>
              )}
            </div>

            {/* Summary content or loading state */}
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-600">Generating AI summary...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Summary</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {summary.summary_text}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    Generated {new Date(summary.created_at).toLocaleString()}
                  </div>
                  <div>
                    {summary.original_content_length && (
                      <span>
                        Reduced from {summary.original_content_length} to {summary.summary_text.length} characters
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No summary available for this note</p>
                <button
                  onClick={() => onGenerate(note.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Generate Summary
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
