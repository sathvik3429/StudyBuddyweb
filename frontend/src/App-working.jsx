import React, { useState, useEffect } from 'react';

function App() {
  const [stats, setStats] = useState({
    courses: 0,
    notes: 0,
    summaries: 0
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial data from backend
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();
      
      // Fetch notes
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();
      
      setStats({
        courses: coursesData.success ? coursesData.data?.length || 0 : 0,
        notes: notesData.success ? notesData.data?.length || 0 : 0,
        summaries: 0 // We'll implement this later
      });
      
      setMessage('Data loaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error loading data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      const courseData = {
        title: 'New Course ' + Date.now(),
        description: 'Sample course created from frontend'
      };
      
      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Course created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage('Error creating course');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create course error:', error);
      setMessage('Error creating course');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const createNote = async () => {
    try {
      const noteData = {
        title: 'New Note ' + Date.now(),
        content: 'This is a sample note created from the frontend with some content to summarize.',
        course_id: 1 // Use first course
      };
      
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Note created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage('Error creating note');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create note error:', error);
      setMessage('Error creating note');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const testAI = async () => {
    try {
      setMessage('Testing AI service...');
      
      const response = await fetch('http://localhost:3001/api/summaries/status');
      const result = await response.json();
      
      if (result.success) {
        setMessage(`AI Status: ${result.data.service} - ${result.data.ai_enabled ? 'Enabled' : 'Disabled'}`);
      } else {
        setMessage('AI service test failed');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('AI test error:', error);
      setMessage('Error testing AI service');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        marginBottom: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1e40af', 
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          🎓 StudyBuddy - Working Version
        </h1>
        
        {/* Message */}
        {message && (
          <div style={{ 
            backgroundColor: '#10b981', 
            color: 'white', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              📚
            </div>
            <div style={{ fontSize: '18px', color: '#1e40af', marginTop: '8px' }}>
              Courses
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
              {loading ? '...' : stats.courses}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#dcfce7', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
              📝
            </div>
            <div style={{ fontSize: '18px', color: '#059669', marginTop: '8px' }}>
              Notes
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
              {loading ? '...' : stats.notes}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f3e8ff', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
              ✨
            </div>
            <div style={{ fontSize: '18px', color: '#7c3aed', marginTop: '8px' }}>
              AI Summaries
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>
              {loading ? '...' : stats.summaries}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          <button
            onClick={createCourse}
            disabled={loading}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            📚 Create Course
          </button>
          
          <button
            onClick={createNote}
            disabled={loading}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#047857';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#059669';
            }}
          >
            📝 Create Note
          </button>
          
          <button
            onClick={testAI}
            disabled={loading}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#6d28d9';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#7c3aed';
            }}
          >
            ✨ Test AI
          </button>
          
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#4b5563';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#6b7280';
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '32px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>🌐 Frontend:</strong> http://localhost:5174
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>🔧 Backend:</strong> http://localhost:3001
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>🗄️ Database:</strong> SQLite (Initialized)
        </div>
        <div>
          <strong>🤖 AI Status:</strong> Configured with OpenAI
        </div>
      </div>
    </div>
  );
}

export default App;
