import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useResponsive,
  Container,
  ResponsiveSidebar,
  ResponsiveHeader,
  ResponsiveNavigation,
  ResponsiveButton,
  ResponsiveStatsGrid,
  Flex,
  Text,
  responsiveTokens
} from './design/ResponsiveDesignSystem';

// Icon components
const Icons = {
  menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
};

const PerfectLayout = ({ children, breadcrumbs = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Icons.clock },
    { name: 'Courses', href: '/courses', icon: Icons.book },
    { name: 'Notes', href: '/notes', icon: Icons.edit },
    { name: 'Study Sessions', href: '/sessions', icon: Icons.clock },
    { name: 'Progress', href: '/progress', icon: Icons.sparkles }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <ResponsiveSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        position="left"
        width={{ xs: 'full', md: '64' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icons.book />
              </div>
              <div className="ml-3 hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
                <p className="text-xs text-gray-500 hidden lg:block">Learning Platform</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Icons.close />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2 md:px-4 py-6 space-y-1 overflow-y-auto">
            <ResponsiveNavigation
              items={navigation}
              activeItem={navigation.find(item => item.href === location.pathname)?.name}
            />
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Icons.user />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Icons.chevronDown />
              </button>
            </div>
          </div>
        </div>
      </ResponsiveSidebar>

      {/* Main Content */}
      <div className={`${isDesktop ? 'md:pl-64' : ''}`}>
        {/* Top Bar */}
        <ResponsiveHeader>
          <Container maxWidth="full" padding={false}>
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <Icons.menu />
                  </button>
                )}
                
                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {item.href ? (
                          <a
                            href={item.href}
                            className={`text-gray-500 hover:text-gray-700 ${index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}`}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className={`text-gray-900 font-medium ${index === breadcrumbs.length - 1 ? '' : 'text-gray-500'}`}>
                            {item.label}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search Bar */}
                <div className="hidden sm:block">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.search />
                    </div>
                    <input
                      type="text"
                      placeholder="Search courses, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </form>
                </div>

                {/* Mobile Search */}
                {isMobile && (
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    <Icons.search />
                  </button>
                )}

                {/* Quick Actions */}
                <ResponsiveButton
                  variant="primary"
                  size={isMobile ? 'sm' : 'md'}
                  responsive={{
                    xs: { size: 'xs' },
                    sm: { size: 'sm' }
                  }}
                >
                  <Icons.plus className="mr-2" />
                  <span className="hidden sm:inline">New Note</span>
                  <span className="sm:hidden">+</span>
                </ResponsiveButton>
              </div>
            </div>
          </Container>
        </ResponsiveHeader>

        {/* Page Content */}
        <main className="flex-1">
          <Container>
            <div className="py-4 sm:py-6 lg:py-8">
              {children}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default PerfectLayout;
