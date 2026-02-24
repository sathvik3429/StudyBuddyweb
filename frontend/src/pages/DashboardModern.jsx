import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  TrendingUpIcon,
  BookOpenIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { coursesAPI, notesAPI } from '../api/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const DashboardModern = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalNotes: 0,
    totalSummaries: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesRes, notesRes] = await Promise.all([
        coursesAPI.getAll(),
        notesAPI.getAll()
      ]);

      const courses = coursesRes.data.data || [];
      const notes = notesRes.data.data || [];

      // Get recent notes (last 5)
      const recentNotes = notes
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({
        totalCourses: courses.length,
        totalNotes: notes.length,
        totalSummaries: 0,
        recentNotes
      });
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <BookOpenIcon className="w-12 h-12 text-white" />
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold mb-4">Welcome back, John!</h1>
              <p className="text-xl text-indigo-100 mb-8">
                Ready to continue your learning journey?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                    <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">3 Courses</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <DocumentTextIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">12 Notes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <SparklesIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">5 Summaries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-2xl">
                <DocumentTextIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalNotes}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-green-500" />
              <span>+8% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <SparklesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Summaries</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSummaries}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-purple-500" />
              <span>+25% from last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-2xl transition-all duration-300 group">
          <Link to="/courses/new" className="block">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <PlusIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">Create Course</h3>
                  <p className="text-sm text-gray-600">Organize your learning materials</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white group-hover:bg-indigo-700 transition-all duration-200">
                  <ArrowTrendingUpIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-300 group">
          <Link to="/notes/new" className="block">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <PlusIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Create Note</h3>
                  <p className="text-sm text-gray-600">Add content to your courses</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white group-hover:bg-green-700 transition-all duration-200">
                  <ArrowTrendingUpIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">Your latest learning updates</p>
          </div>
          <Link to="/notes" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All Notes
            <ArrowTrendingUpIcon className="w-4 h-4 ml-1 inline" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {stats.recentNotes.slice(0, 3).map((note) => (
            <div key={note.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
                    <p className="text-xs text-gray-500">{note.course_title}</p>
                  </div>
                  <Badge variant="default" size="sm">
                    {new Date(note.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <SparklesIcon className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Progress */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
            <p className="text-sm text-gray-600">Track your study habits</p>
          </div>
          <Link to="/analytics" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View Analytics
            <ChartBarIcon className="w-4 h-4 ml-1 inline" />
          </Link>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-600">Mon</p>
            <p className="text-lg font-bold text-gray-900">15</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-2">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Tue</p>
            <p className="text-lg font-bold text-gray-900">23</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-2">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Wed</p>
            <p className="text-lg font-bold text-gray-900">7</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <LightBulbIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-600">Thu</p>
            <p className="text-lg font-bold text-gray-900">12</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-xs text-gray-600">Fri</p>
            <p className="text-lg font-bold text-gray-900">5</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Sat</p>
            <p className="text-lg font-bold text-gray-900">18</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Sun</p>
            <p className="text-lg font-bold text-gray-900">9</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardModern;
