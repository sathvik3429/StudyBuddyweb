import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Simple responsive hook
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop
  };
};

// Simple Layout Component
const SimpleLayout = ({ children, breadcrumbs = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useResponsive();

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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${!isMobile ? 'block' : 'hidden'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                📚
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              to="/"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 border-l-4 border-blue-600"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/courses"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              📚 Courses
            </Link>
            <Link
              to="/notes"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              📝 Notes
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isDesktop ? 'md:pl-64' : ''}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  ☰
                </button>
              )}
              
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 001.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`text-gray-900 font-medium ${index === breadcrumbs.length - 1 ? '' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search courses, notes..."
                  className="block w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quick Actions */}
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ➕ New Note
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Simple Dashboard
const SimpleDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    notes: 0,
    sessions: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();
      
      // Fetch notes
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();

      setStats({
        courses: coursesData.success ? coursesData.data?.length || 0 : 0,
        notes: notesData.success ? notesData.data?.length || 0 : 0,
        sessions: 12,
        progress: 75
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SimpleLayout breadcrumbs={[{ label: 'Dashboard' }]}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100 mb-6">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">📚 Courses</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">📝 Notes</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.notes}</p>
            <p className="text-sm text-green-600 mt-2">+8% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">📊 Sessions</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.sessions}</p>
            <p className="text-sm text-green-600 mt-2">+25% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">🎯 Progress</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.progress}%</p>
            <p className="text-sm text-green-600 mt-2">+15% from last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              📚
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Course</h3>
            <p className="text-sm text-gray-600">Organize your learning materials</p>
            <button 
              onClick={() => window.location.href = '/courses'}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Create Course
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              📝
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Note</h3>
            <p className="text-sm text-gray-600">Document your learning journey</p>
            <button 
              onClick={() => window.location.href = '/notes'}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Add Note
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              ✨
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
            <p className="text-sm text-gray-600">Generate intelligent summaries</p>
            <button 
              onClick={() => alert('AI Summary feature - Add your OpenAI key to backend/.env')}
              className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              AI Summary
            </button>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

// Courses Page
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/courses');
      const data = await response.json();
      setCourses(data.success ? data.data || [] : []);
    } catch (error) {
      console.error('Courses fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SimpleLayout breadcrumbs={[{ label: 'Courses', href: '/courses' }]}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout breadcrumbs={[{ label: 'Courses', href: '/courses' }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">Manage your learning materials</p>
          </div>
          <button 
            onClick={() => alert('Create Course feature coming soon!')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  📚
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    ✏️
                  </button>
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
};

// Notes Page
const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/notes');
      const data = await response.json();
      setNotes(data.success ? data.data || [] : []);
    } catch (error) {
      console.error('Notes fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SimpleLayout breadcrumbs={[{ label: 'Notes', href: '/notes' }]}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout breadcrumbs={[{ label: 'Notes', href: '/notes' }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600">Your study materials and documentation</p>
          </div>
          <button 
            onClick={() => alert('Create Note feature coming soon!')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ➕ Create Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  📝
                </div>
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  ✨️
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{note.word_count || 0} words</span>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    ✏️
                  </button>
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
};

// Main App Component
const SimpleResponsive = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleDashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/sessions" element={<SimpleDashboard />} />
        <Route path="/progress" element={<SimpleDashboard />} />
      </Routes>
    </Router>
  );
};

export default SimpleResponsive;
