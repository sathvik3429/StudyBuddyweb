import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple page components
function HomePage() {
  const [stats, setStats] = useState({ courses: 0, notes: 0 });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/courses');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setStats({ courses: data.data?.length || 0, notes: 0 });
      setMessage('✅ Stats loaded');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      setLoading(true);
      setMessage('Creating course...');
      
      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Course ${Date.now()}`,
          description: 'Test course'
        })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Course created!');
        loadStats();
      } else {
        setMessage(`❌ Failed: ${result.message}`);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>🎓 StudyBuddy</h1>
        
        {message && (
          <div style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: message.includes('✅') ? '#10b981' : '#ef4444',
            color: 'white'
          }}>
            {message}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>📚 Courses</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.courses}</p>
            <button 
              onClick={createCourse}
              disabled={loading}
              style={{
                backgroundColor: '#3b82f6', color: 'white', border: 'none', 
                padding: '12px 20px', borderRadius: '8px', cursor: 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
            <h3 style={{ color: '#059669', marginBottom: '10px' }}>📝 Notes</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.notes}</p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          <p><strong>🌐 Frontend:</strong> http://localhost:5174</p>
          <p><strong>🔧 Backend:</strong> http://localhost:3001</p>
          <p><strong>📊 Status:</strong> {loading ? 'Loading...' : 'Ready'}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/courses" element={<HomePage />} />
        <Route path="/notes" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
