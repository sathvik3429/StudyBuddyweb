import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import FullCoursesPage from './pages/FullCoursesPage';
import FullNotesPage from './pages/FullNotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudySessionPage from './pages/StudySessionPage';

function SimpleFullApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const renderNavigation = () => (
    <nav style={{ 
      backgroundColor: '#1f2937', 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>🎓 StudyBuddy</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['dashboard', 'courses', 'notes', 'flashcards', 'study'].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: currentPage === page ? '#3b82f6' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: currentPage === page ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {page === 'dashboard' && '📊 Dashboard'}
              {page === 'courses' && '📚 Courses'}
              {page === 'notes' && '📝 Notes'}
              {page === 'flashcards' && '🃏 Flashcards'}
              {page === 'study' && '📚 Study'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'white', fontSize: '0.875rem' }}>
          👋 Guest User
        </span>
        <span style={{ color: '#10b981', fontSize: '0.875rem' }}>
          🟢 Online
        </span>
      </div>
    </nav>
  );

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #3b82f6', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading StudyBuddy...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {renderNavigation()}
      
      <div style={{ minHeight: 'calc(100vh - 64px)' }}>
        {currentPage === 'dashboard' && <DashboardPage user={{ name: 'Guest User' }} />}
        {currentPage === 'courses' && <FullCoursesPage />}
        {currentPage === 'notes' && <FullNotesPage />}
        {currentPage === 'flashcards' && <FlashcardsPage />}
        {currentPage === 'study' && <StudySessionPage />}
      </div>
    </div>
  );
}

export default SimpleFullApp;
