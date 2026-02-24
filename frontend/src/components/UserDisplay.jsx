import React from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

const UserDisplay = () => {
  const { user } = useFirebaseAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
        {user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-medium">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </div>
      <span className="text-sm text-gray-700 font-medium">
        {user.displayName || user.email?.split('@')[0]}
      </span>
    </div>
  );
};

export default UserDisplay;
