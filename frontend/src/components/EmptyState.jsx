import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  illustration = null 
}) => {
  return (
    <div className="text-center py-12 px-4">
      {illustration ? (
        <div className="mb-8 flex justify-center">
          <img 
            src={illustration} 
            alt={title}
            className="w-64 h-64 object-cover rounded-lg opacity-75"
          />
        </div>
      ) : Icon ? (
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <Icon className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      ) : null}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
