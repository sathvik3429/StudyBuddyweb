import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 mb-4">
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-indigo-600 rounded-full animate-spin`}></div>
      </div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
