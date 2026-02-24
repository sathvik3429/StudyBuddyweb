import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
