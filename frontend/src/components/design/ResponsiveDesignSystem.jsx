import React from 'react';

// Enhanced responsive design tokens
export const responsiveTokens = {
  breakpoints: {
    xs: '0px',      // 0-575px
    sm: '640px',    // 576-767px
    md: '768px',    // 768-991px
    lg: '1024px',   // 992-1199px
    xl: '1280px',   // 1200-1439px
    '2xl': '1536px' // 1440px+
  },
  containers: {
    xs: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  typography: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '64px'
  }
};

// Responsive utility functions
export const useResponsive = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = () => {
    const { width } = windowSize;
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 640) return 'sm';
    return 'xs';
  };

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  const isLargeDesktop = windowSize.width >= 1280;

  return {
    windowSize,
    breakpoint: getBreakpoint(),
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  };
};

// Responsive Container Component
export const Container = ({ 
  children, 
  className = '', 
  maxWidth = 'xl', 
  padding = true,
  ...props 
}) => {
  const containerClasses = `
    mx-auto px-4 sm:px-6 lg:px-8
    ${padding ? 'py-4 sm:py-6 lg:py-8' : ''}
    ${maxWidth === 'xs' ? 'max-w-xs' : ''}
    ${maxWidth === 'sm' ? 'max-w-sm' : ''}
    ${maxWidth === 'md' ? 'max-w-md' : ''}
    ${maxWidth === 'lg' ? 'max-w-lg' : ''}
    ${maxWidth === 'xl' ? 'max-w-xl' : ''}
    ${maxWidth === '2xl' ? 'max-w-2xl' : ''}
    ${maxWidth === '3xl' ? 'max-w-3xl' : ''}
    ${maxWidth === '4xl' ? 'max-w-4xl' : ''}
    ${maxWidth === '5xl' ? 'max-w-5xl' : ''}
    ${maxWidth === '6xl' ? 'max-w-6xl' : ''}
    ${maxWidth === '7xl' ? 'max-w-7xl' : ''}
    ${maxWidth === 'full' ? 'max-w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive Grid Component
export const Grid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }, 
  gap = 4,
  className = '',
  ...props 
}) => {
  const gridClasses = `
    grid
    grid-cols-${cols.xs || 1}
    ${cols.sm ? `sm:grid-cols-${cols.sm}` : ''}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}
    ${cols['2xl'] ? `2xl:grid-cols-${cols['2xl']}` : ''}
    gap-${gap}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive Flex Component
export const Flex = ({ 
  children, 
  direction = 'row', 
  justify = 'start', 
  align = 'start', 
  wrap = false,
  gap = 4,
  responsive = {},
  className = '',
  ...props 
}) => {
  const baseClasses = `
    flex
    flex-${direction}
    justify-${justify}
    items-${align}
    ${wrap ? 'flex-wrap' : 'flex-nowrap'}
    gap-${gap}
  `.trim().replace(/\s+/g, ' ');

  const responsiveClasses = Object.entries(responsive).map(([breakpoint, config]) => {
    const { direction: rDir, justify: rJustify, align: rAlign, wrap: rWrap, gap: rGap } = config;
    let classes = `${breakpoint}:`;
    
    if (rDir) classes += ` flex-${rDir}`;
    if (rJustify) classes += ` justify-${rJustify}`;
    if (rAlign) classes += ` items-${rAlign}`;
    if (rWrap) classes += ` ${rWrap ? 'flex-wrap' : 'flex-nowrap'}`;
    if (rGap) classes += ` gap-${rGap}`;
    
    return classes;
  }).join(' ');

  const finalClasses = `${baseClasses} ${responsiveClasses} ${className}`.trim().replace(/\s+/g, ' ');

  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive Text Component
export const Text = ({ 
  children, 
  size = 'md', 
  weight = 'normal', 
  color = 'gray', 
  align = 'left',
  responsive = {},
  className = '',
  ...props 
}) => {
  const baseClasses = `
    text-${size}
    font-${weight}
    text-${color}-${color === 'gray' ? '900' : '600'}
    text-${align}
    leading-relaxed
  `.trim().replace(/\s+/g, ' ');

  const responsiveClasses = Object.entries(responsive).map(([breakpoint, config]) => {
    const { size: rSize, weight: rWeight, color: rColor, align: rAlign } = config;
    let classes = `${breakpoint}:`;
    
    if (rSize) classes += ` text-${rSize}`;
    if (rWeight) classes += ` font-${rWeight}`;
    if (rColor) classes += ` text-${rColor}-${rColor === 'gray' ? '900' : '600'}`;
    if (rAlign) classes += ` text-${rAlign}`;
    
    return classes;
  }).join(' ');

  const finalClasses = `${baseClasses} ${responsiveClasses} ${className}`.trim().replace(/\s+/g, ' ');

  return (
  <p className={finalClasses} {...props}>
    {children}
  </p>
  );
};

// Responsive Card Component
export const ResponsiveCard = ({ 
  children, 
  padding = { xs: 4, sm: 6, md: 6, lg: 6 },
  shadow = 'md',
  hover = false,
  border = true,
  rounded = 'lg',
  className = '',
  ...props 
}) => {
  const paddingClasses = `
    p-${padding.xs || 4}
    ${padding.sm ? `sm:p-${padding.sm}` : ''}
    ${padding.md ? `md:p-${padding.md}` : ''}
    ${padding.lg ? `lg:p-${padding.lg}` : ''}
    ${padding.xl ? `xl:p-${padding.xl}` : ''}
  `.trim().replace(/\s+/g, ' ');

  const baseClasses = `
    bg-white
    rounded-${rounded}
    ${border ? 'border border-gray-200' : ''}
    ${shadow ? `shadow-${shadow}` : ''}
    ${hover ? 'hover:shadow-xl hover:border-gray-300 transition-all duration-200' : ''}
    ${paddingClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive Button Component
export const ResponsiveButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  responsive = {},
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `.trim().replace(/\s+/g, ' ');

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-gray-300',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500 p-0'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };

  const responsiveClasses = Object.entries(responsive).map(([breakpoint, config]) => {
    const { size: rSize, variant: rVariant, fullWidth: rFullWidth } = config;
    let classes = `${breakpoint}:`;
    
    if (rSize) classes += ` ${sizeClasses[rSize]}`;
    if (rVariant) classes += ` ${variantClasses[rVariant]}`;
    if (rFullWidth) classes += ` w-full`;
    
    return classes;
  }).join(' ');

  const finalClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${responsiveClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={finalClasses}
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

// Responsive Sidebar Component
export const ResponsiveSidebar = ({ 
  children, 
  isOpen, 
  onClose, 
  position = 'left',
  width = { xs: 'full', md: '64' },
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive();
  
  const sidebarClasses = `
    fixed inset-y-0 ${position}-0 z-50
    ${isMobile ? 'w-full' : `w-${width.md || 64}`}
    bg-white border-r border-gray-200
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
    ${isMobile ? (isOpen ? 'block' : 'hidden') : ''}
    md:translate-x-0 md:block
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (isMobile && !isOpen) return null;

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}
      <div className={sidebarClasses} {...props}>
        {children}
      </div>
    </>
  );
};

// Responsive Header Component
export const ResponsiveHeader = ({ 
  children, 
  sticky = true, 
  className = '',
  ...props 
}) => {
  const headerClasses = `
    bg-white border-b border-gray-200
    ${sticky ? 'sticky top-0 z-30' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <header className={headerClasses} {...props}>
      {children}
    </header>
  );
};

// Responsive Navigation Component
export const ResponsiveNavigation = ({ 
  items, 
  activeItem, 
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <nav className={`space-y-1 ${className}`} {...props}>
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`
              flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${activeItem === item.name 
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            <span className="font-medium">{item.name}</span>
            {activeItem === item.name && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav className={`hidden md:flex md:flex-row md:space-x-8 ${className}`} {...props}>
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`
            inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200
            ${activeItem === item.name 
              ? 'text-blue-700 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.name}
        </a>
      ))}
    </nav>
  );
};

// Responsive Stats Grid Component
export const ResponsiveStatsGrid = ({ 
  stats, 
  className = '',
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const gridCols = isMobile ? 1 : isTablet ? 2 : stats.length;

  return (
    <Grid cols={{ xs: 1, sm: 2, lg: stats.length }} gap={4} className={className} {...props}>
      {stats.map((stat, index) => (
        <ResponsiveCard 
          key={index} 
          hover={true} 
          padding={{ xs: 4, sm: 6 }}
          className="relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              {stat.change && (
                <p className={`text-sm mt-2 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}% from last month
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color || 'blue'}-100 text-${stat.color || 'blue'}-600`}>
              {stat.icon}
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        </ResponsiveCard>
      ))}
    </Grid>
  );
};

// Responsive Form Component
export const ResponsiveForm = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {children}
    </form>
  );
};

// Responsive Form Field Component
export const ResponsiveFormField = ({ 
  label, 
  error, 
  helperText, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default {
  responsiveTokens,
  useResponsive,
  Container,
  Grid,
  Flex,
  Text,
  ResponsiveCard,
  ResponsiveButton,
  ResponsiveSidebar,
  ResponsiveHeader,
  ResponsiveNavigation,
  ResponsiveStatsGrid,
  ResponsiveForm,
  ResponsiveFormField
};
