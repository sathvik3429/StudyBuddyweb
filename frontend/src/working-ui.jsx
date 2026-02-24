import React, { useState, useEffect } from 'react';

function WorkingUI() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [creatingNote, setCreatingNote] = useState(false);

  useEffect(() => {
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

  const createCourse = async () => {
    try {
      setCreatingCourse(true);
      setMessage('Creating course...');
      
      const courseData = {
        title: `Course ${Date.now()}`,
        description: 'Course created from StudyBuddy',
        category_id: 1,
        user_id: 1,
        difficulty_level: 1,
        is_public: false
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
        setMessage('✅ Course created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create course error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setCreatingCourse(false);
    }
  };

  const createNote = async () => {
    try {
      setCreatingNote(true);
      setMessage('Creating note...');
      
      const noteData = {
        title: `Note ${Date.now()}`,
        content: 'This is a test note created from StudyBuddy. It demonstrates the working functionality of the note creation feature.',
        course_id: 1,
        user_id: 1
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
        setMessage('✅ Note created successfully!');
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create note error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setCreatingNote(false);
    }
  };

  const generateSummary = async () => {
    try {
      setMessage('Generating AI summary...');
      
      // Get first note for testing
      if (notes.length === 0) {
        setMessage('❌ No notes available for summarization');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/summaries/notes/${notes[0].id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ AI summary generated successfully!');
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Generate summary error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5', 
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
          <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderBottom: '1px solid #e5e5e5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '32px', 
            color: '#333', 
            margin: '0',
            display: 'flex',
            alignItems: 'center'
          }}>
            🎓 StudyBuddy
          </h1>
          <p style={{ color: '#666', margin: '5px 0 0 0 0' }}>Simple Learning Platform</p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '20px auto', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: message.includes('✅') ? '#10b981' : '#ef4444',
          color: 'white',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>📚 Courses</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{courses.length}</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.0.1)'
          }}>
            <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>📝 Notes</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{notes.length}</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.0.1)'
          }}>
            <h3 style={{ color: '#8b5cf6', margin: '0 0 10px 0' }}>🤖 AI Ready</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>✅</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <button 
            onClick={createCourse}
            disabled={creatingCourse || loading}
            style={{
              backgroundColor: creatingCourse ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: creatingCourse ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: creatingCourse || loading ? 0.7 : 1
            }}
          >
            {creatingCourse ? 'Creating...' : '➕ Create Course'}
          </button>
          
          <button 
            onClick={createNote}
            disabled={creatingNote || loading}
            style={{
              backgroundColor: creatingNote ? '#9ca3af' : '#10b981',
              color: 'white',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: creatingNote ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: creatingNote || loading ? 0.7 : 1
            }}
          >
            {creatingNote ? 'Creating...' : '➕ Create Note'}
          </button>
          
          <button 
            onClick={generateSummary}
            disabled={loading}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1
            }}
          >
            ✨ AI Summary
          </button>
        </div>

        {/* Courses Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>📚 Courses</h2>
          {courses.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '40px', 
              borderRadius: '8px', 
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '18px' }}>No courses yet. Create your first course!</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {courses.map((course) => (
                <div key={course.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>{course.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 15px 0' }}>{course.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                    <div>
                      <button style={{ 
                        backgroundColor: '#f3f4f6', 
                        border: '1px solid #ddd', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
                        marginRight: '5px',
                        cursor: 'pointer'
                      }}>
                        ✏️
                      </button>
                      <button style={{ 
                        backgroundColor: '#f3f4f6', 
                        border: '1px solid #ddd', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
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

        {/* Notes Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>📝 Notes</h2>
          {notes.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '40px', 
              borderRadius: '8px', 
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '18px' }}>No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {notes.map((note) => (
                <div key={note.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>{note.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 15px 0', lineHeight: '1.4' }}>
                    {note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {note.word_count || 0} words
                    </span>
                    <div>
                      <button 
                        onClick={generateSummary}
                        style={{ 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #ddd', 
                          padding: '5px 10px', 
                          borderRadius: '4px',
                          marginRight: '5px',
                          cursor: 'pointer'
                        }}>
                        ✨️
                      </button>
                      <button style={{ 
                        backgroundColor: '#f3f4f6', 
                        border: '1px solid #ddd', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        ✏️
                      </button>
                      <button style={{ 
                        backgroundColor: '#f3f4f6', 
                        border: '1px solid #ddd', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
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

        {/* Footer */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <p style={{ color: '#666', margin: '0' }}>
            <strong>🌐 Frontend:</strong> http://localhost:5174 | 
            <strong>🔧 Backend:</strong> http://localhost:3001 | 
            <strong>🤖 AI:</strong> Hugging Face ✅ | 
            <strong>📱 Responsive:</strong> Simple UI ✅
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkingUI;
