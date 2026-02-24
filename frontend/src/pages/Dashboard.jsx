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
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { coursesAPI, notesAPI, summariesAPI } from '../api/api';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalNotes: 0,
    totalSummaries: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        totalSummaries: 0, // We'll implement this later
        recentNotes
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold mb-2">Welcome to StudyBuddy!</h1>
              <p className="text-indigo-100 text-lg">
                Organize your study materials and generate AI-powered summaries
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center mb-2">
                <ClockIcon className="w-5 h-5 text-indigo-200 mr-2" />
                <span className="text-sm font-medium">Quick Start</span>
              </div>
              <p className="text-indigo-100 text-sm">Create your first course and note in seconds</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center mb-2">
                <LightBulbIcon className="w-5 h-5 text-indigo-200 mr-2" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
              <p className="text-indigo-100 text-sm">Smart summaries for better learning</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center mb-2">
                <TrendingUpIcon className="w-5 h-5 text-indigo-200 mr-2" />
                <span className="text-sm font-medium">Track Progress</span>
              </div>
              <p className="text-indigo-100 text-sm">Monitor your study journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={AcademicCapIcon}
          color="indigo"
          trend={12}
        />
        <StatsCard
          title="Total Notes"
          value={stats.totalNotes}
          icon={DocumentTextIcon}
          color="green"
          trend={8}
        />
        <StatsCard
          title="AI Summaries"
          value={stats.totalSummaries}
          icon={SparklesIcon}
          color="purple"
          trend={15}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <ChartBarIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/courses/new"
            className="group flex items-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <PlusIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Create New Course</h3>
                <p className="text-sm text-gray-600 mt-1">Start organizing your study materials</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/notes/new"
            className="group flex items-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <PlusIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Create New Note</h3>
                <p className="text-sm text-gray-600 mt-1">Add content to your courses</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Notes */}
      {stats.recentNotes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
            <Link
              to="/notes"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View All
              <TrendingUpIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentNotes.map((note) => (
              <Link
                key={note.id}
                to={`/notes/${note.id}`}
                className="group block p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <DocumentTextIcon className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">{note.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{note.course_title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    {note.content && note.content.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle summarize action
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Generate Summary"
                      >
                        <SparklesIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.totalCourses === 0 && stats.totalNotes === 0 && (
        <EmptyState
          icon={BookOpenIcon}
          title="Start Your Learning Journey"
          description="Create your first course and note to begin organizing your study materials with AI-powered summaries."
          actionText="Create Your First Course"
          onAction={() => window.location.href = '/courses/new'}
        />
      )}
    </div>
  );
};

export default Dashboard;
