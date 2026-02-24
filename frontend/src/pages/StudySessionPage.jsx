import React, { useState, useEffect } from 'react';

function StudySessionPage() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    startTime: null,
    pagesRead: 0,
    notesTaken: 0,
    duration: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sessionData, setSessionData] = useState({
    course_id: '',
    note_id: '',
    session_type: 'study'
  });

  useEffect(() => {
    fetchData();
    
    // Update session duration every second
    const interval = setInterval(() => {
      if (activeSession && sessionStats.startTime) {
        setSessionStats(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime) / 1000 / 60) // minutes
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, sessionStats.startTime]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses (without auth)
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();
      
      // Fetch notes (without auth)
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();

      if (coursesData.success) {
        setCourses(coursesData.data || []);
      }
      
      if (notesData.success) {
        setNotes(notesData.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('❌ Error loading data');
      setTimeout(() => setMessage(''), 3000);
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('http://localhost:3001/api/study-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      const result = await response.json();
      
      if (result.success) {
        setActiveSession(result.data);
        setSessionStats({
          startTime: Date.now(),
          pagesRead: 0,
          notesTaken: 0,
          duration: 0
        });
        setMessage('✅ Study session started!');
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      setLoading(true);
      setMessage('Ending session...');

      const response = await fetch(`http://localhost:3001/api/study-sessions/${activeSession.id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pages_read: sessionStats.pagesRead,
          notes_taken: sessionStats.notesTaken
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setActiveSession(null);
        setSessionStats({
          startTime: null,
          pagesRead: 0,
          notesTaken: 0,
          duration: 0
        });
        setMessage('✅ Study session completed!');
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const incrementPages = () => {
    setSessionStats(prev => ({ ...prev, pagesRead: prev.pagesRead + 1 }));
  };

  const incrementNotes = () => {
    setSessionStats(prev => ({ ...prev, notesTaken: prev.notesTaken + 1 }));
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading && courses.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
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
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>📚 Study Session</h1>
        <p style={{ color: '#6b7280', margin: '0' }}>Track your learning progress</p>
      </div>

      {message && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '0.5rem',
          backgroundColor: message.includes('✅') ? '#10b981' : '#ef4444',
          color: 'white',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {!activeSession ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>
            🎯 Start a New Study Session
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Course (Optional)
              </label>
              <select
                value={sessionData.course_id}
                onChange={(e) => setSessionData({...sessionData, course_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Note (Optional)
              </label>
              <select
                value={sessionData.note_id}
                onChange={(e) => setSessionData({...sessionData, note_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select a note</option>
                {notes.map(note => (
                  <option key={note.id} value={note.id}>
                    {note.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Session Type
            </label>
            <select
              value={sessionData.session_type}
              onChange={(e) => setSessionData({...sessionData, session_type: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="study">📚 Study</option>
              <option value="review">🔄 Review</option>
              <option value="practice">✍️ Practice</option>
              <option value="reading">📖 Reading</option>
            </select>
          </div>

          <button
            onClick={startSession}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            {loading ? 'Starting...' : '🚀 Start Study Session'}
          </button>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
              📚 Active Study Session
            </h2>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Session Type: {sessionData.session_type.charAt(0).toUpperCase() + sessionData.session_type.slice(1)}
            </p>
          </div>

          {/* Session Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <h3 style={{ color: '#0369a1', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                {formatDuration(sessionStats.duration)}
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>Duration</p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <h3 style={{ color: '#166534', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                {sessionStats.pagesRead}
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>Pages Read</p>
            </div>
            
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <h3 style={{ color: '#92400e', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                {sessionStats.notesTaken}
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>Notes Taken</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={incrementPages}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              📄 Page Read
            </button>
            
            <button
              onClick={incrementNotes}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              📝 Note Taken
            </button>
          </div>

          {/* End Session Button */}
          <button
            onClick={endSession}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#ef4444',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            {loading ? 'Ending...' : '🏁 End Session'}
          </button>
        </div>
      )}

      {/* Recent Sessions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>
          📊 Study Tips
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#0369a1', margin: '0 0 0.5rem 0' }}>🎯 Set Clear Goals</h3>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>
              Define what you want to accomplish in each study session.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>⏰ Use Pomodoro</h3>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>
              Study for 25 minutes, then take a 5-minute break.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>📝 Take Notes</h3>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>
              Write down key concepts and questions as you study.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h3 style={{ color: '#374151', margin: '0 0 0.5rem 0' }}>🔄 Review Regularly</h3>
            <p style={{ color: '#6b7280', margin: '0', fontSize: '0.875rem' }}>
              Review your notes within 24 hours to reinforce learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudySessionPage;
