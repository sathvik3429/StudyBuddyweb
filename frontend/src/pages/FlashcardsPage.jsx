import React, { useState, useEffect } from 'react';

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    note_id: '',
    front: '',
    back: '',
    difficulty: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch flashcards (without auth)
      const flashcardsResponse = await fetch('http://localhost:3001/api/flashcards');
      const flashcardsData = await flashcardsResponse.json();
      
      // Fetch notes for creating flashcards (without auth)
      const notesResponse = await fetch('http://localhost:3001/api/notes');
      const notesData = await notesResponse.json();

      if (flashcardsData.success) {
        setFlashcards(flashcardsData.data || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Flashcard created successfully!');
        setShowCreateForm(false);
        setFormData({
          note_id: '',
          front: '',
          back: '',
          difficulty: 1
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

  const handleDelete = async (flashcardId) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/flashcards/${flashcardId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Flashcard deleted successfully!');
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

  const handleReview = async (flashcardId, difficulty) => {
    try {
      const response = await fetch(`http://localhost:3001/api/flashcards/${flashcardId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ difficulty })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Flashcard reviewed!');
        fetchData();
        
        // Move to next card
        if (currentCardIndex < flashcards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          setIsFlipped(false);
        } else {
          setStudyMode(false);
          setMessage('🎉 Study session completed!');
        }
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: '#10b981', // Easy - Green
      2: '#f59e0b', // Medium - Yellow
      3: '#ef4444'  // Hard - Red
    };
    return colors[level] || '#6b7280';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Easy',
      2: 'Medium',
      3: 'Hard'
    };
    return labels[level] || 'Unknown';
  };

  if (loading && flashcards.length === 0) {
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
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (studyMode && flashcards.length > 0) {
    const currentCard = flashcards[currentCardIndex];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>🃏 Study Mode</h2>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Card {currentCardIndex + 1} of {flashcards.length}
            </p>
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

          {/* Flashcard */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            minHeight: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '2rem',
            border: '2px solid #e5e7eb'
          }}
          onClick={() => setIsFlipped(!isFlipped)}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {isFlipped ? 'Back' : 'Front'} (Click to flip)
              </p>
              <p style={{ color: '#1f2937', fontSize: '1.125rem', lineHeight: '1.5' }}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>
          </div>

          {/* Difficulty Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => handleReview(currentCard.id, 1)}
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
              😊 Easy
            </button>
            <button
              onClick={() => handleReview(currentCard.id, 2)}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🤔 Medium
            </button>
            <button
              onClick={() => handleReview(currentCard.id, 3)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              😰 Hard
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setStudyMode(false)}
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
              Exit Study Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>🃏 Flashcards</h1>
          <p style={{ color: '#6b7280', margin: '0' }}>Study with flashcards</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {flashcards.length > 0 && (
            <button 
              onClick={() => {
                setStudyMode(true);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
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
              📚 Study Mode
            </button>
          )}
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
            ➕ Create Flashcard
          </button>
        </div>
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

      {/* Create Form */}
      {showCreateForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: '0 0 1.5rem 0' }}>
            ➕ Create New Flashcard
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Note (Optional)
              </label>
              <select
                value={formData.note_id}
                onChange={(e) => setFormData({...formData, note_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select a note (optional)</option>
                {notes.map(note => (
                  <option key={note.id} value={note.id}>
                    {note.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Front Side *
              </label>
              <textarea
                value={formData.front}
                onChange={(e) => setFormData({...formData, front: e.target.value})}
                required
                placeholder="Enter the question or prompt"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Back Side *
              </label>
              <textarea
                value={formData.back}
                onChange={(e) => setFormData({...formData, back: e.target.value})}
                required
                placeholder="Enter the answer"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Creating...' : 'Create Flashcard'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
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

      {/* Flashcards Grid */}
      {flashcards.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>No flashcards yet</p>
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
            Create Your First Flashcard
          </button>
        </div>
      ) : (
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
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Front:</p>
                <p style={{ color: '#1f2937', margin: '0', lineHeight: '1.5' }}>
                  {flashcard.front.length > 100 ? flashcard.front.substring(0, 100) + '...' : flashcard.front}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Back:</p>
                <p style={{ color: '#1f2937', margin: '0', lineHeight: '1.5' }}>
                  {flashcard.back.length > 100 ? flashcard.back.substring(0, 100) + '...' : flashcard.back}
                </p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ 
                  backgroundColor: getDifficultyColor(flashcard.difficulty),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {getDifficultyLabel(flashcard.difficulty)}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {flashcard.review_count || 0} reviews
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {flashcard.last_reviewed ? `Last: ${new Date(flashcard.last_reviewed).toLocaleDateString()}` : 'Not reviewed'}
                </span>
                <button 
                  onClick={() => handleDelete(flashcard.id)}
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
      )}
    </div>
  );
}

export default FlashcardsPage;
