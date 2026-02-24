import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';
import FirebaseProtectedRoute from './components/FirebaseProtectedRoute';
import FirebaseLoginForm from './components/FirebaseLoginForm';
import FirebaseRegisterForm from './components/FirebaseRegisterForm';
import VerifyEmailPage from './components/VerifyEmailPage';
import WorkingSimpleApp from './WorkingSimpleApp';

function App() {
  return (
    <FirebaseAuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<FirebaseLoginForm />} />
            <Route path="/register" element={<FirebaseRegisterForm />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <FirebaseProtectedRoute>
                <WorkingSimpleApp />
              </FirebaseProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <FirebaseProtectedRoute>
                <WorkingSimpleApp />
              </FirebaseProtectedRoute>
            } />
            <Route path="/courses" element={
              <FirebaseProtectedRoute>
                <WorkingSimpleApp />
              </FirebaseProtectedRoute>
            } />
            <Route path="/notes" element={
              <FirebaseProtectedRoute>
                <WorkingSimpleApp />
              </FirebaseProtectedRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
