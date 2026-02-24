import React, { useState, useEffect } from 'react';

function WorkingSimpleApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    course_id: ''
  });

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setCourses([
        { id: 1, title: 'Sample Course 1', description: 'This is a sample course', difficulty_level: 1, created_at: new Date().toISOString() },
        { id: 2, title: 'Sample Course 2', description: 'Another sample course', difficulty_level: 2, created_at: new Date().toISOString() }
      ]);
      setNotes([
        { id: 1, title: 'Sample Note 1', content: 'This is a sample note content', word_count: 10, created_at: new Date().toISOString() },
        { id: 2, title: 'Sample Note 2', content: 'Another sample note with more content', word_count: 15, created_at: new Date().toISOString() }
      ]);
      setFlashcards([
        { id: 1, front: 'What is React?', back: 'React is a JavaScript library for building user interfaces', difficulty: 1 },
        { id: 2, front: 'What is a component?', back: 'A component is a reusable piece of UI', difficulty: 2 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const createCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      title: formData.title || `New Course ${courses.length + 1}`,
      description: formData.description || 'Course description',
      difficulty_level: 1,
      created_at: new Date().toISOString()
    };
    setCourses([...courses, newCourse]);
    showMessage('✅ Course created successfully!');
    setShowCreateForm(false);
    setFormData({ title: '', description: '', content: '', course_id: '' });
  };

  const createNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: formData.title || `New Note ${notes.length + 1}`,
      content: formData.content || 'Note content',
      word_count: formData.content.split(' ').length || 5,
      created_at: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
    showMessage('✅ Note created successfully!');
    setShowCreateForm(false);
    setFormData({ title: '', description: '', content: '', course_id: '' });
  };

  const createFlashcard = () => {
    const newFlashcard = {
      id: flashcards.length + 1,
      front: formData.title || 'Question',
      back: formData.content || 'Answer',
      difficulty: 1
    };
    setFlashcards([...flashcards, newFlashcard]);
    showMessage('✅ Flashcard created successfully!');
    setShowCreateForm(false);
    setFormData({ title: '', description: '', content: '', course_id: '' });
  };

  const deleteItem = (type, id) => {
    if (type === 'course') {
      setCourses(courses.filter(c => c.id !== id));
      showMessage('✅ Course deleted successfully!');
    } else if (type === 'note') {
      setNotes(notes.filter(n => n.id !== id));
      showMessage('✅ Note deleted successfully!');
    } else if (type === 'flashcard') {
      setFlashcards(flashcards.filter(f => f.id !== id));
      showMessage('✅ Flashcard deleted successfully!');
    }
  };

  const generateAISummary = async (noteId = null, noteContent = null) => {
    try {
      setMessage('🤖 Generating AI summary...');
      
      // Use the provided note content or get the first note's content
      const contentToSummarize = noteContent || (notes.length > 0 ? notes[0].content : null);
      
      if (!contentToSummarize) {
        setMessage('❌ No content available for summarization');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      // Try multiple approaches for AI summarization
      
      // Approach 1: Try backend proxy first
      try {
        const backendResponse = await fetch('http://localhost:3001/api/ai/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: contentToSummarize,
            max_length: 150,
            min_length: 30
          })
        });

        if (backendResponse.ok) {
          const result = await backendResponse.json();
          if (result.success && result.summary) {
            displaySummary(result.summary, noteId);
            return;
          }
        }
      } catch (backendError) {
        console.log('Backend not available, trying direct API...');
      }

      // Approach 2: Try direct Hugging Face API with CORS workaround
      try {
        // Use a CORS proxy or alternative method
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
        
        const response = await fetch(proxyUrl + apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_HUGGINGFACE_TOKEN',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            inputs: contentToSummarize,
            parameters: {
              max_length: 150,
              min_length: 30,
              do_sample: false,
              early_stopping: true,
              num_beams: 4,
              temperature: 1.0,
              length_penalty: 2.0,
              repetition_penalty: 1.0
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result && result[0] && result[0].summary_text) {
            displaySummary(result[0].summary_text, noteId);
            return;
          }
        }
      } catch (corsError) {
        console.log('CORS API failed, using fallback...');
      }

      // Approach 3: Use a simple AI-like summarization as fallback
      const smartSummary = generateSmartSummary(contentToSummarize);
      displaySummary(smartSummary, noteId, true);
      
    } catch (error) {
      console.error('AI Summary Error:', error);
      setMessage(`❌ AI Summary Error: ${error.message}`);
      
      // Final fallback to simple summary
      setTimeout(() => {
        const fallbackSummary = generateSimpleSummary(contentToSummarize);
        displaySummary(fallbackSummary, noteId, true);
      }, 2000);
    }
  };

  const displaySummary = (summary, noteId, isFallback = false) => {
    setMessage(`✅ ${isFallback ? 'Smart' : 'AI'} summary generated successfully!`);
    
    // Show the summary in a modal or alert
    setTimeout(() => {
      alert(`🤖 ${isFallback ? 'Smart' : 'AI'} Summary:\n\n${summary}`);
    }, 1000);
    
    // Update the note with the summary
    if (noteId) {
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              ai_summary: summary, 
              summary_generated_at: new Date().toISOString(),
              is_fallback_summary: isFallback
            }
          : note
      );
      setNotes(updatedNotes);
    }
  };

  const generateSmartSummary = (text) => {
    if (!text) return 'No content to summarize.';
    
    // Clean the text first
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ');
    
    if (words.length <= 30) {
      return cleanText;
    }
    
    // Extract key sentences using simple heuristics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return cleanText.substring(0, 100) + '...';
    }
    
    // Score sentences based on length and position
    const scoredSentences = sentences.map((sentence, index) => {
      const sentenceWords = sentence.trim().split(' ');
      const lengthScore = sentenceWords.length >= 10 && sentenceWords.length <= 25 ? 1 : 0.5;
      const positionScore = index === 0 || index === sentences.length - 1 ? 0.8 : 0.6;
      
      return {
        sentence: sentence.trim(),
        score: lengthScore + positionScore
      };
    });
    
    // Sort by score and take top sentences
    scoredSentences.sort((a, b) => b.score - a.score);
    const topSentences = scoredSentences.slice(0, Math.min(3, sentences.length));
    
    // Create summary
    let summary = topSentences.map(s => s.sentence).join('. ');
    
    // Ensure it's not too long
    if (summary.length > 150) {
      summary = summary.substring(0, 147) + '...';
    }
    
    return summary + (summary.endsWith('.') ? '' : '.');
  };

  const generateSimpleSummary = (text) => {
    if (!text) return 'No content to summarize.';
    
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    if (sentences.length === 0) return text.substring(0, 100) + '...';
    
    // Simple extractive summarization - take first and last sentences
    const firstSentence = sentences[0].trim();
    const lastSentence = sentences[sentences.length - 1].trim();
    
    if (sentences.length === 1) {
      return firstSentence;
    } else if (sentences.length === 2) {
      return `${firstSentence}. ${lastSentence}.`;
    } else {
      return `${firstSentence}. ... ${lastSentence}.`;
    }
  };

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

  const renderDashboard = () => (
    <div style={{ 
      padding: '2rem', 
      height: '100%',
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '2rem' }}>📊 Dashboard</h1>
      
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
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>🃏 Flashcards</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{flashcards.length}</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0' }}>🤖 AI</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>✅</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        <button 
          onClick={() => { setCurrentPage('courses'); setShowCreateForm(true); }}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Course
        </button>
        
        <button 
          onClick={() => { setCurrentPage('notes'); setShowCreateForm(true); }}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Note
        </button>
        
        <button 
          onClick={() => { setCurrentPage('flashcards'); setShowCreateForm(true); }}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Flashcard
        </button>
        
        <button 
          onClick={() => generateAISummary()}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🤖 AI Summary
        </button>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div style={{ 
      padding: '2rem', 
      height: '100%',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0' }}>📚 Courses</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
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

      {showCreateForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>➕ Create New Course</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Course Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter course title"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter course description"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={createCourse} style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Create Course
            </button>
            <button onClick={() => setShowCreateForm(false)} style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

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
              <button 
                onClick={() => deleteItem('course', course.id)}
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
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div style={{ 
      padding: '2rem', 
      height: '100%',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0' }}>📝 Notes</h1>
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
          ➕ Create Note
        </button>
      </div>

      {showCreateForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>➕ Create New Note</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Note Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter note title"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter note content"
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={createNote} style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Create Note
            </button>
            <button onClick={() => setShowCreateForm(false)} style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

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
            <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{note.content}</p>
            
            {/* AI Summary Display */}
            {note.ai_summary && (
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#0369a1',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🤖 AI Summary:</div>
                <div>{note.ai_summary}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Generated: {new Date(note.summary_generated_at).toLocaleString()}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {note.word_count} words • {new Date(note.created_at).toLocaleDateString()}
                {note.ai_summary && ' • 🤖 AI Summary'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => generateAISummary(note.id, note.content)}
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
                  onClick={() => deleteItem('note', note.id)}
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
    </div>
  );

  const renderFlashcards = () => (
    <div style={{ 
      padding: '2rem', 
      height: '100%',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0' }}>🃏 Flashcards</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Create Flashcard
        </button>
      </div>

      {showCreateForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>➕ Create New Flashcard</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Front (Question)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter question"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Back (Answer)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter answer"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={createFlashcard} style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Create Flashcard
            </button>
            <button onClick={() => setShowCreateForm(false)} style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {flashcards.map((flashcard) => (
          <div key={flashcard.id} style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Front:</p>
              <p style={{ color: '#1f2937', margin: '0' }}>{flashcard.front}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Back:</p>
              <p style={{ color: '#1f2937', margin: '0' }}>{flashcard.back}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: flashcard.difficulty === 1 ? '#10b981' : flashcard.difficulty === 2 ? '#f59e0b' : '#ef4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {flashcard.difficulty === 1 ? 'Easy' : flashcard.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
              <button 
                onClick={() => deleteItem('flashcard', flashcard.id)}
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
        ))}
      </div>
    </div>
  );

  const renderStudy = () => (
    <div style={{ 
      padding: '2rem', 
      height: '100%',
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '2rem' }}>📚 Study Session</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        <h2 style={{ color: '#1f2937', margin: '0 0 1rem 0' }}>Study Session Coming Soon!</h2>
        <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>
          Track your study time, pages read, and notes taken with our comprehensive study session tracker.
        </p>
        <button 
          onClick={() => showMessage('🚀 Study session feature coming soon!')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚀 Coming Soon
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
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
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#f9fafb', 
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {renderNavigation()}
      
      {/* Message Display */}
      {message && (
        <div style={{ 
          position: 'fixed',
          top: '80px',
          right: '20px',
          padding: '1rem 1.5rem', 
          borderRadius: '0.5rem',
          backgroundColor: message.includes('✅') ? '#10b981' : message.includes('❌') ? '#ef4444' : '#3b82f6',
          color: 'white',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        width: '100%'
      }}>
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'courses' && renderCourses()}
        {currentPage === 'notes' && renderNotes()}
        {currentPage === 'flashcards' && renderFlashcards()}
        {currentPage === 'study' && renderStudy()}
      </div>
    </div>
  );
}

export default WorkingSimpleApp;
