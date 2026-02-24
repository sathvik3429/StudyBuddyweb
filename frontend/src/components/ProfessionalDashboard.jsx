import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Icon, Breadcrumb, Spinner, tokens } from './design/DesignSystem';

// Layout Component
const Layout = ({ children, breadcrumbs = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'clock' },
    { name: 'Courses', href: '/courses', icon: 'book' },
    { name: 'Notes', href: '/notes', icon: 'edit' },
    { name: 'Study Sessions', href: '/sessions', icon: 'clock' },
    { name: 'Progress', href: '/progress', icon: 'sparkles' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon name="book" size="sm" className="text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
                <p className="text-xs text-gray-500">Learning Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${window.location.pathname === item.href 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon name={item.icon} size="md" className="mr-3 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
                {window.location.pathname === item.href && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Icon name="user" size="sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses, notes..."
                    className="block w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <Button variant="primary" size="sm">
                <Icon name="plus" size="sm" className="mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card hover={true} className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon name={icon} size="lg" />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
    </Card>
  );
};

// Dashboard Home Page
const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    notes: 0,
    sessions: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

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

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'note', title: 'React Hooks Deep Dive', time: '2 hours ago' },
        { id: 2, type: 'course', title: 'Advanced JavaScript', time: '1 day ago' },
        { id: 3, type: 'session', title: 'Study Session - Web Dev', time: '2 days ago' }
      ]);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100 mb-6">Ready to continue your learning journey?</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Icon name="book" size="sm" className="mr-2" />
              Browse Courses
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Icon name="sparkles" size="sm" className="mr-2" />
              View Progress
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Courses" 
            value={stats.courses} 
            change={12} 
            icon="book" 
            color="blue" 
          />
          <StatsCard 
            title="Notes" 
            value={stats.notes} 
            change={8} 
            icon="edit" 
            color="green" 
          />
          <StatsCard 
            title="Study Sessions" 
            value={stats.sessions} 
            change={25} 
            icon="clock" 
            color="purple" 
          />
          <StatsCard 
            title="Progress" 
            value={`${stats.progress}%`} 
            change={15} 
            icon="sparkles" 
            color="orange" 
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600">Your latest learning updates</p>
            </div>
            <Link to="/activity" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
              <Icon name="edit" size="sm" className="ml-1 inline" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  activity.type === 'note' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'course' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon name={activity.type === 'note' ? 'edit' : activity.type === 'course' ? 'book' : 'clock'} size="sm" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="default" size="sm">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Icon name="book" size="lg" className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Course</h3>
              <p className="text-sm text-gray-600">Organize your learning materials</p>
            </div>
          </Card>

          <Card hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Icon name="edit" size="lg" className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Note</h3>
              <p className="text-sm text-gray-600">Document your learning journey</p>
            </div>
          </Card>

          <Card hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Icon name="sparkles" size="lg" className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
              <p className="text-sm text-gray-600">Generate intelligent summaries</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
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

  return (
    <Layout breadcrumbs={[{ label: 'Courses', href: '/courses' }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">Manage your learning materials</p>
          </div>
          <Button variant="primary">
            <Icon name="plus" size="sm" className="mr-2" />
            Create Course
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} hover={true} className="cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="book" size="md" className="text-blue-600" />
                    </div>
                    <Badge variant="primary" size="sm">Active</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="edit" size="sm" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="trash" size="sm" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
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

  return (
    <Layout breadcrumbs={[{ label: 'Notes', href: '/notes' }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600">Your study materials and documentation</p>
          </div>
          <Button variant="primary">
            <Icon name="plus" size="sm" className="mr-2" />
            Create Note
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} hover={true} className="cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="edit" size="md" className="text-green-600" />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="sparkles" size="sm" />
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{note.word_count || 0} words</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="edit" size="sm" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="trash" size="sm" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Main App Component
const ProfessionalDashboard = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/sessions" element={<Dashboard />} />
        <Route path="/progress" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default ProfessionalDashboard;
