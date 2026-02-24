import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

const FirebaseProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default FirebaseProtectedRoute;
