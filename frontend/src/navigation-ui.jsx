import React, { useState, useEffect } from 'react';

function NavigationUI() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();
      
      // Fetch notes
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();

      setCourses(coursesData.success ? coursesData.data || [] : []);
      setNotes(notesData.success ? notesData.data || [] : []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      setMessage('❌ Error loading data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMessage(`📍 Navigated to ${page}`);
    setTimeout(() => setMessage(''), 2000);
  };

  const createCourse = async () => {
    try {
      setMessage('Creating course...');
      
      const courseData = {
        title: `Course ${Date.now()}`,
        description: 'Course created from StudyBuddy with new database structure',
        category_id: 1,
        difficulty_level: 1,
        is_public: false
      };
      
      console.log('Creating course with data:', courseData);
      
      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        setMessage('✅ Course created successfully!');
        fetchData();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create course error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const createNote = async () => {
    try {
      setMessage('Creating note...');
      
      const noteData = {
        title: `Note ${Date.now()}`,
        content: 'This is a test note created from StudyBuddy with the new database structure. It demonstrates the working functionality of the note creation feature with proper navigation.',
        course_id: 1
      };
      
      console.log('Creating note with data:', noteData);
      
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData)
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        setMessage('✅ Note created successfully!');
        fetchData();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create note error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const renderNavigation = () => (
    <nav style={{ 
      backgroundColor: '#1f2937', 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>🎓 StudyBuddy</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['dashboard', 'courses', 'notes', 'about'].map((page) => (
            <button
              key={page}
              onClick={() => navigateTo(page)}
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
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ color: 'white', fontSize: '0.875rem' }}>
        New Database Structure
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>📊 Dashboard</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 0.5rem 0' }}>📚 Courses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{courses.length}</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Total courses</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>📝 Notes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{notes.length}</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Total notes</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>🤖 AI</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>✅</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Ready</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0' }}>🗄️ DB</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>New</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Structure</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <button 
          onClick={() => navigateTo('courses')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          📚 View Courses
        </button>
        
        <button 
          onClick={() => navigateTo('notes')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          📝 View Notes
        </button>
        
        <button 
          onClick={createCourse}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          ➕ Create Course
        </button>
        
        <button 
          onClick={createNote}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          ➕ Create Note
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        marginTop: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>🎯 Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button 
            onClick={() => alert('Study Sessions coming soon!')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            📚 Study Sessions
          </button>
          <button 
            onClick={() => alert('Flashcards coming soon!')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            🃏 Flashcards
          </button>
          <button 
            onClick={() => alert('Progress tracking coming soon!')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            📈 Progress
          </button>
          <button 
            onClick={() => alert('Settings coming soon!')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#1f2937', margin: 0 }}>📚 Courses</h2>
        <button 
          onClick={createCourse}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>No courses yet</p>
          <button 
            onClick={createCourse}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {courses.map((course) => (
            <div key={course.id} style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>{course.title}</h3>
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{course.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
                <div>
                  <button style={{ 
                    backgroundColor: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    marginRight: '0.25rem',
                    cursor: 'pointer'
                  }}>
                    ✏️
                  </button>
                  <button style={{ 
                    backgroundColor: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNotes = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#1f2937', margin: 0 }}>📝 Notes</h2>
        <button 
          onClick={createNote}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>No notes yet</p>
          <button 
            onClick={createNote}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {notes.map((note) => (
            <div key={note.id} style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>{note.title}</h3>
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
                {note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {note.word_count || 0} words
                </span>
                <div>
                  <button style={{ 
                    backgroundColor: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    marginRight: '0.25rem',
                    cursor: 'pointer'
                  }}>
                    ✨️
                  </button>
                  <button style={{ 
                    backgroundColor: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}>
                    ✏️
                  </button>
                  <button style={{ 
                    backgroundColor: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '2rem' }}>🎯 About StudyBuddy</h2>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>New Database Structure</h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
          StudyBuddy has been completely restructured with a new database schema that includes:
        </p>
        <ul style={{ color: '#6b7280', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
          <li>Users table with authentication</li>
          <li>Categories for course organization</li>
          <li>Courses with difficulty levels and progress tracking</li>
          <li>Notes with word count and reading time</li>
          <li>AI-powered summaries</li>
          <li>Study sessions tracking</li>
          <li>Flashcards for learning</li>
          <li>User progress monitoring</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>🚀 Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Course Management</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Create and organize courses</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Note Taking</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Rich text notes with AI summaries</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>AI Integration</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Hugging Face powered summaries</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Progress Tracking</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Monitor your learning progress</p>
          </div>
        </div>
      </div>
    </div>
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
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {renderNavigation()}
      
      {/* Message Display */}
      {message && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '1rem auto', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          backgroundColor: message.includes('✅') ? '#10b981' : message.includes('❌') ? '#ef4444' : '#3b82f6',
          color: 'white',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {/* Page Content */}
      {currentPage === 'dashboard' && renderDashboard()}
      {currentPage === 'courses' && renderCourses()}
      {currentPage === 'notes' && renderNotes()}
      {currentPage === 'about' && renderAbout()}
    </div>
  );
}

export default NavigationUI;
