import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PerfectLayout from './PerfectLayout';
import {
  Container,
  ResponsiveCard,
  ResponsiveButton,
  ResponsiveStatsGrid,
  Flex,
  Text,
  Grid,
  useResponsive,
  ResponsiveFormField
} from './design/ResponsiveDesignSystem';

// Icon components
const Icons = {
  book: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  edit: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center">
      <svg className={`animate-spin ${sizeClasses[size]} text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
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
    <ResponsiveCard hover={true} className="relative overflow-hidden">
      <Flex justify="between" align="center" responsive={{ sm: { flex: 'row' } }}>
        <div className="flex-1">
          <Text size="sm" color="gray" className="mb-1">{title}</Text>
          <Text size="2xl" weight="bold" className="mt-1">{value}</Text>
          {change && (
            <Text size="sm" color={change > 0 ? 'green' : 'red'} className="mt-2">
              {change > 0 ? '+' : ''}{change}% from last month
            </Text>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} ml-4`}>
          {icon}
        </div>
      </Flex>
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
    </ResponsiveCard>
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

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'note', title: 'React Hooks Deep Dive', time: '2 hours ago', icon: Icons.edit },
        { id: 2, type: 'course', title: 'Advanced JavaScript', time: '1 day ago', icon: Icons.book },
        { id: 3, type: 'session', title: 'Study Session - Web Dev', time: '2 days ago', icon: Icons.clock }
      ]);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PerfectLayout breadcrumbs={[{ label: 'Dashboard' }]}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PerfectLayout>
    );
  }

  return (
    <PerfectLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <div className="max-w-3xl">
            <Text size="3xl" weight="bold" className="mb-2">Welcome back, John!</Text>
            <Text size="lg" className="text-blue-100 mb-6 sm:mb-8">Ready to continue your learning journey?</Text>
            
            <Flex 
              direction={{ xs: 'column', sm: 'row' }} 
              gap={4}
              wrap={true}
              responsive={{ sm: { flex: 'row' } }}
            >
              <ResponsiveButton 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                  responsive={{ xs: { fullWidth: true }, sm: { fullWidth: false } }}
                  onClick={() => window.location.href = '/courses'}
                >
                  <Icons.book className="mr-2" />
                  Browse Courses
                </ResponsiveButton>
              <ResponsiveButton 
                variant="secondary" 
                className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                responsive={{ xs: { fullWidth: true }, sm: { fullWidth: false } }}
              >
                <Icons.sparkles className="mr-2" />
                View Progress
              </ResponsiveButton>
            </Flex>
          </div>
        </div>

        {/* Stats Grid */}
        <ResponsiveStatsGrid
          stats={[
            { title: 'Courses', value: stats.courses, change: 12, icon: Icons.book, color: 'blue' },
            { title: 'Notes', value: stats.notes, change: 8, icon: Icons.edit, color: 'green' },
            { title: 'Study Sessions', value: stats.sessions, change: 25, icon: Icons.clock, color: 'purple' },
            { title: 'Progress', value: `${stats.progress}%`, change: 15, icon: Icons.sparkles, color: 'orange' }
          ]}
        />

        {/* Recent Activity */}
        <ResponsiveCard>
          <div className="mb-6">
            <Flex justify="between" align="center">
              <div>
                <Text size="lg" weight="semibold">Recent Activity</Text>
                <Text size="sm" color="gray">Your latest learning updates</Text>
              </div>
              <Link to="/activity" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
                <Icons.arrowRight className="ml-1 inline" />
              </Link>
            </Flex>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  activity.type === 'note' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'course' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <Text size="sm" weight="medium" className="truncate">{activity.title}</Text>
                  <Text size="xs" color="gray">{activity.time}</Text>
                </div>
                <div className="hidden sm:block">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ResponsiveCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResponsiveCard hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Icons.book className="text-blue-600" />
              </div>
              <Text size="lg" weight="semibold" className="mb-2">Create Course</Text>
              <Text size="sm" color="gray">Organize your learning materials</Text>
              <div className="mt-4">
                <ResponsiveButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/courses'}
                  responsive={{ xs: { fullWidth: true } }}
                >
                  <Icons.plus className="mr-2" />
                  Create Course
                </ResponsiveButton>
              </div>
            </div>
          </ResponsiveCard>

          <ResponsiveCard hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Icons.edit className="text-green-600" />
              </div>
              <Text size="lg" weight="semibold" className="mb-2">Add Note</Text>
              <Text size="sm" color="gray">Document your learning journey</Text>
              <div className="mt-4">
                <ResponsiveButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/notes'}
                  responsive={{ xs: { fullWidth: true } }}
                >
                  <Icons.plus className="mr-2" />
                  Add Note
                </ResponsiveButton>
              </div>
            </div>
          </ResponsiveCard>

          <ResponsiveCard hover={true} className="text-center group cursor-pointer">
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Icons.sparkles className="text-purple-600" />
              </div>
              <Text size="lg" weight="semibold" className="mb-2">AI Summary</Text>
              <Text size="sm" color="gray">Generate intelligent summaries</Text>
            </div>
          </ResponsiveCard>
        </div>

        {/* Learning Progress */}
        <ResponsiveCard>
          <div className="mb-6">
            <Flex justify="between" align="center">
              <div>
                <Text size="lg" weight="semibold">Learning Progress</Text>
                <Text size="sm" color="gray">Track your study habits</Text>
              </div>
              <Link to="/analytics" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Analytics
                <Icons.arrowRight className="ml-1 inline" />
              </Link>
            </Flex>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-2 ${
                  index === 0 ? 'bg-indigo-100 text-indigo-600' :
                  index === 1 ? 'bg-green-100 text-green-600' :
                  index === 2 ? 'bg-purple-100 text-purple-600' :
                  index === 3 ? 'bg-yellow-100 text-yellow-600' :
                  index === 4 ? 'bg-red-100 text-red-600' :
                  index === 5 ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {index === 0 ? Icons.clock : Icons.book}
                </div>
                <Text size="xs" color="gray">{day}</Text>
                <Text size="sm" weight="bold">{[15, 23, 7, 12, 5, 18, 9][index]}</Text>
              </div>
            ))}
          </div>
        </ResponsiveCard>
      </div>
    </PerfectLayout>
  );
};

// Courses Page
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useResponsive();

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
      <PerfectLayout breadcrumbs={[{ label: 'Courses', href: '/courses' }]}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PerfectLayout>
    );
  }

  return (
    <PerfectLayout breadcrumbs={[{ label: 'Courses', href: '/courses' }]}>
      <div className="space-y-6">
        <Flex justify="between" align="center" responsive={{ xs: { flex: 'column', align: 'stretch' } }}>
          <div>
            <Text size="2xl" weight="bold">Courses</Text>
            <Text size="sm" color="gray">Manage your learning materials</Text>
          </div>
          <ResponsiveButton variant="primary" responsive={{ xs: { fullWidth: true }, sm: { fullWidth: false } }}>
              <Icons.plus className="mr-2" />
              Create Course
            </ResponsiveButton>
        </Flex>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <ResponsiveCard key={course.id} hover={true} className="cursor-pointer">
              <div className="p-6">
                <Flex justify="between" align="center" className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icons.book className="text-blue-600" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                </Flex>
                <Text size="lg" weight="semibold" className="mb-2">{course.title}</Text>
                <Text size="sm" color="gray" className="mb-4 line-clamp-2">{course.description}</Text>
                <Flex justify="between" align="center" className="text-sm text-gray-500">
                  <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                      <Icons.edit />
                    </button>
                    <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Flex>
              </div>
            </ResponsiveCard>
          ))}
        </div>
      </div>
    </PerfectLayout>
  );
};

// Notes Page
const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useResponsive();

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
      <PerfectLayout breadcrumbs={[{ label: 'Notes', href: '/notes' }]}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PerfectLayout>
    );
  }

  return (
    <PerfectLayout breadcrumbs={[{ label: 'Notes', href: '/notes' }]}>
      <div className="space-y-6">
        <Flex justify="between" align="center" responsive={{ xs: { flex: 'column', align: 'stretch' } }}>
          <div>
            <Text size="2xl" weight="bold">Notes</Text>
            <Text size="sm" color="gray">Your study materials and documentation</Text>
          </div>
          <ResponsiveButton variant="primary" responsive={{ xs: { fullWidth: true }, sm: { fullWidth: false } }}>
              <Icons.plus className="mr-2" />
              Create Note
            </ResponsiveButton>
        </Flex>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <ResponsiveCard key={note.id} hover={true} className="cursor-pointer">
              <div className="p-6">
                <Flex justify="between" align="center" className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icons.edit className="text-green-600" />
                  </div>
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                    <Icons.sparkles />
                  </button>
                </Flex>
                <Text size="lg" weight="semibold" className="mb-2">{note.title}</Text>
                <Text size="sm" color="gray" className="mb-4 line-clamp-3">{note.content}</Text>
                <Flex justify="between" align="center" className="text-sm text-gray-500">
                  <span>{note.word_count || 0} words</span>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                      <Icons.edit />
                    </button>
                    <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Flex>
              </div>
            </ResponsiveCard>
          ))}
        </div>
      </div>
    </PerfectLayout>
  );
};

// Main App Component
const PerfectDashboard = () => {
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

export default PerfectDashboard;
