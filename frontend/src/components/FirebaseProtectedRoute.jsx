import React from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import FirebaseLoginForm from './FirebaseLoginForm';
import { Navigate } from 'react-router-dom';

const FirebaseProtectedRoute = ({ children }) => {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default FirebaseProtectedRoute;
