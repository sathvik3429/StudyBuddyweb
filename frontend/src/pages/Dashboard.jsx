import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { coursesAPI, notesAPI, summariesAPI } from '../api/api';

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to StudyBuddy!</h1>
        <p className="text-indigo-100">
          Organize your study materials and generate AI-powered summaries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DocumentTextIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Summaries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSummaries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/courses/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-6 h-6 text-indigo-600 mr-3" />
            <span className="font-medium text-gray-900">Create New Course</span>
          </Link>
          <Link
            to="/notes/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-6 h-6 text-green-600 mr-3" />
            <span className="font-medium text-gray-900">Create New Note</span>
          </Link>
        </div>
      </div>

      {/* Recent Notes */}
      {stats.recentNotes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
            <Link
              to="/notes"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentNotes.map((note) => (
              <Link
                key={note.id}
                to={`/notes/${note.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {note.course_title}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
