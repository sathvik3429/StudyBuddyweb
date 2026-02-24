import React from 'react';

// Design System Tokens
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  }
};

// Base Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm`,
    secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300`,
    success: `bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm`,
    ghost: `bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-gray-300`,
    link: `bg-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500 p-0`
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md',
  hover = false,
  border = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl';
  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300 transition-all duration-200' : '';
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${borderClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Input Component
export const Input = ({ 
  label, 
  placeholder = '', 
  type = 'text', 
  error = '', 
  helperText = '',
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Avatar Component
export const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback = '',
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };
  
  const classes = `${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ${className}`;
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
        {...props}
      />
    );
  }
  
  return (
    <div className={classes} {...props}>
      {fallback ? fallback.charAt(0).toUpperCase() : ''}
    </div>
  );
};

// Icon Component (placeholder for Heroicons)
export const Icon = ({ name, size = 'md', className = '', ...props }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  
  // Simple SVG icons for common use cases
  const icons = {
    book: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    plus: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    edit: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    trash: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    sparkles: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    clock: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    user: (
      <svg className={`${sizes[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  };
  
  return icons[name] || (
    <div className={`${sizes[size]} ${className}`} {...props}>
      {name}
    </div>
  );
};

// Breadcrumb Component
export const Breadcrumb = ({ items, className = '', ...props }) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.href ? (
            <a
              href={item.href}
              className={`text-gray-500 hover:text-gray-700 ${index === items.length - 1 ? 'text-gray-900 font-medium' : ''}`}
            >
              {item.label}
            </a>
          ) : (
            <span className={`text-gray-900 font-medium ${index === items.length - 1 ? '' : 'text-gray-500'}`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Loading Spinner Component
export const Spinner = ({ size = 'md', className = '', ...props }) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`} {...props}>
      <svg className={`animate-spin ${sizes[size]} text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

export default {
  tokens,
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  Icon,
  Breadcrumb,
  Spinner
};
