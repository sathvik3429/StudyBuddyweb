import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500',
    secondary: 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 focus:ring-indigo-500 focus:border-indigo-500',
    danger: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2',
    ghost: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const loadingClasses = 'animate-pulse';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses : ''}
    ${loading ? loadingClasses : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600"></div>
          <span className="ml-2">{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
