import React, { useState } from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { EyeIcon, EyeSlashIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const FirebaseProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useFirebaseAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-gray-100"
      >
        <UserCircleIcon className="h-8 w-8 text-gray-600" />
        <span className="hidden md:block text-gray-700 font-medium">
          {user.displayName || user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                UID: {user.uid.slice(0, 8)}...
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseProfileDropdown;
