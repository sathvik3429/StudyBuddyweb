import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const LayoutModern = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: HomeIcon,
      current: location.pathname === '/' 
    },
    { 
      name: 'Courses', 
      href: '/courses', 
      icon: AcademicCapIcon,
      current: location.pathname.startsWith('/courses') 
    },
    { 
      name: 'Notes', 
      href: '/notes', 
      icon: DocumentTextIcon,
      current: location.pathname.startsWith('/notes') 
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    // Implement search functionality
    console.log('Searching for:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
                <p className="text-sm text-gray-500">Modern Learning Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
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
                  ${item.current 
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
                {item.current && (
                  <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notes, courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </form>
              
              {/* Quick Actions */}
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <PlusIcon className="w-5 h-5 mr-2" />
                New Note
              </button>
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

export default LayoutModern;
