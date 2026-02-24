import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';
import FirebaseProtectedRoute from './components/FirebaseProtectedRoute';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import WorkingSimpleApp from './WorkingSimpleApp';

function App() {
  return (
    <FirebaseAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={
            <FirebaseProtectedRoute>
              <WorkingSimpleApp />
            </FirebaseProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
