import React from 'react';

const Input = ({ 
  label, 
  placeholder = '', 
  type = 'text', 
  error = '', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  
  const classes = `
    ${baseClasses}
    ${errorClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
