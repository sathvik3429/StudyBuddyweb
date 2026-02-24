import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Courses', href: '/courses', icon: AcademicCapIcon },
    { name: 'Notes', href: '/notes', icon: DocumentTextIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">StudyBuddy</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Cog6ToothIcon className="w-4 h-4 mr-1" />
              StudyBuddy v1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.href === location.pathname)?.name || 'StudyBuddy'}
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
