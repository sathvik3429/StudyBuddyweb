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
      setMessage('Loading data...');
      
      // Fetch courses with proper error handling
      console.log('Fetching courses...');
      const coursesResponse = await fetch('http://localhost:3001/api/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!coursesResponse.ok) {
        throw new Error(`HTTP ${coursesResponse.status}: ${coursesResponse.statusText}`);
      }
      
      const coursesData = await coursesResponse.json();
      console.log('Courses data:', coursesData);
      
      // Fetch notes
      console.log('Fetching notes...');
      const notesResponse = await fetch('http://localhost:3001/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!notesResponse.ok) {
        throw new Error(`HTTP ${notesResponse.status}: ${notesResponse.statusText}`);
      }
      
      const notesData = await notesResponse.json();
      console.log('Notes data:', notesData);
      
      setStats({
        courses: coursesData.success ? coursesData.data?.length || 0 : 0,
        notes: notesData.success ? notesData.data?.length || 0 : 0,
        summaries: 0
      });
      
      setMessage('✅ Data loaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      setMessage('Creating course...');
      setLoading(true);
      
      const courseData = {
        title: 'Test Course ' + Date.now(),
        description: 'Course created from working frontend'
      };
      
      console.log('Creating course:', courseData);
      
      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });
      
      console.log('Course response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Course creation result:', result);
      
      if (result.success) {
        setMessage('✅ Course created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${result.message || 'Unknown error'}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create course error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      setMessage('Creating note...');
      setLoading(true);
      
      const noteData = {
        title: 'Test Note ' + Date.now(),
        content: 'This is a test note created from the working frontend.',
        course_id: 1
      };
      
      console.log('Creating note:', noteData);
      
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData)
      });
      
      console.log('Note response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Note creation result:', result);
      
      if (result.success) {
        setMessage('✅ Note created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${result.message || 'Unknown error'}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create note error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
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
          color: '#10b981', 
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          🎓 StudyBuddy - Final Working Version
        </h1>
        
        {/* Message */}
        {message && (
          <div style={{ 
            backgroundColor: message.includes('✅') ? '#10b981' : '#ef4444',
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
          >
            📝 Create Note
          </button>
        </div>
        
        {/* Instructions */}
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
            <strong>🗄️ Database:</strong> SQLite (Working)
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>💡 Instructions:</strong> Test the buttons above!
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669' }}>
            <strong>🔍 Debug:</strong> Check browser console (F12) for detailed logs
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
