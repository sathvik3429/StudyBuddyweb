import React, { useState, useEffect } from 'react';

function FullNotesPage() {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course_id: '',
    content_type: 'markdown'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch notes (without auth)
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();
      
      // Fetch courses (without auth)
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();

      if (notesData.success) {
        setNotes(notesData.data || []);
      }
      
      if (coursesData.success) {
        setCourses(coursesData.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('❌ Error loading data');
      setTimeout(() => setMessage(''), 3000);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = editingNote 
        ? `http://localhost:3001/api/notes/${editingNote.id}`
        : 'http://localhost:3001/api/notes';
      
      const method = editingNote ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Note ${editingNote ? 'updated' : 'created'} successfully!`);
        setShowCreateForm(false);
        setEditingNote(null);
        setFormData({
          title: '',
          content: '',
          course_id: '',
          content_type: 'markdown'
        });
        fetchData();
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

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      course_id: note.course_id,
      content_type: note.content_type
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Note deleted successfully!');
        fetchData();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const generateAISummary = async (noteId) => {
    try {
      setMessage('🤖 Generating AI summary...');
      
      const response = await fetch(`http://localhost:3001/api/summaries/notes/${noteId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ AI summary generated successfully!');
        fetchData();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleBookmark = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}/bookmark`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Note ${result.data.is_bookmarked ? 'bookmarked' : 'unbookmarked'}!`);
        fetchData();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading && notes.length === 0) {
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
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>📝 Notes</h1>
          <p style={{ color: '#6b7280', margin: '0' }}>Manage your learning notes</p>
        </div>
        <button 
          onClick={() => {
            setShowCreateForm(true);
            setEditingNote(null);
            setFormData({
              title: '',
              content: '',
              course_id: '',
              content_type: 'markdown'
            });
          }}
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

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>
            {editingNote ? '✏️ Edit Note' : '➕ Create New Note'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Note Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter note title"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Course
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select a course (optional)</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                placeholder="Enter your note content here..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Content Type
              </label>
              <select
                value={formData.content_type}
                onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="markdown">Markdown</option>
                <option value="text">Plain Text</option>
                <option value="html">HTML</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingNote(null);
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>No notes yet</p>
          <button 
            onClick={() => setShowCreateForm(true)}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1f2937', margin: '0', fontSize: '1.25rem' }}>{note.title}</h3>
                <button
                  onClick={() => toggleBookmark(note.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '1.25rem'
                  }}
                >
                  {note.is_bookmarked ? '🔖' : '📌'}
                </button>
              </div>
              
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                {note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                  <span>📊 {note.word_count || 0} words</span>
                  <span>⏱️ {note.reading_time || 0} min read</span>
                  {note.course_title && <span>📚 {note.course_title}</span>}
                </div>
              </div>
              
              {note.summaries_count > 0 && (
                <div style={{ 
                  backgroundColor: '#f0f9ff', 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem', 
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: '#0369a1'
                }}>
                  🤖 {note.summaries_count} AI summary{note.summaries_count > 1 ? 'ies' : ''} available
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => generateAISummary(note.id)}
                    style={{ 
                      backgroundColor: '#f3f4f6', 
                      border: '1px solid #d1d5db', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    🤖 AI
                  </button>
                  <button 
                    onClick={() => handleEdit(note)}
                    style={{ 
                      backgroundColor: '#f3f4f6', 
                      border: '1px solid #d1d5db', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    style={{ 
                      backgroundColor: '#fef2f2', 
                      border: '1px solid #fecaca', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#dc2626'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FullNotesPage;
