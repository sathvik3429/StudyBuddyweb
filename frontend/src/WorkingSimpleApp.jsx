import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from './contexts/FirebaseAuthContext';
import FirebaseProfileDropdown from './components/FirebaseProfileDropdown';
import databaseService from './services/databaseService';

function WorkingSimpleApp() {
  const { user } = useFirebaseAuth();
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
  const [editingNote, setEditingNote] = useState(null);
  const [showStudySession, setShowStudySession] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [studyStats, setStudyStats] = useState({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    flashcardsReviewed: 0,
    notesStudied: 0,
    streak: 7
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Load user's data from Firestore
        const [userCourses, userNotes, userFlashcards, userStats] = await Promise.all([
          databaseService.getUserCourses(user.uid),
          databaseService.getUserNotes(user.uid),
          databaseService.getUserFlashcards(user.uid),
          databaseService.getStudyStats(user.uid)
        ]);

        setCourses(userCourses);
        setNotes(userNotes);
        setFlashcards(userFlashcards);
        setStudyStats(userStats);
        
      } catch (error) {
        console.error('Error loading user data:', error);
        showMessage('❌ Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const createCourse = async () => {
    if (!user) return;
    
    try {
      const courseData = {
        title: formData.title || 'New Course',
        description: formData.description || 'Course description',
        difficulty_level: 1
      };
      
      const newCourse = await databaseService.createCourse(user.uid, courseData);
      setCourses([newCourse, ...courses]);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', content: '', course_id: '' });
      showMessage('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      showMessage('❌ Error creating course. Please try again.');
    }
  };

  const deleteCourse = async (id) => {
    if (!user) return;
    
    try {
      await databaseService.deleteCourse(user.uid, id);
      setCourses(courses.filter(course => course.id !== id));
      showMessage('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      showMessage('❌ Error deleting course. Please try again.');
    }
  };

  const createNote = async () => {
    if (!user) return;
    
    try {
      const noteData = {
        title: formData.title || 'New Note',
        content: formData.content || 'Note content',
        word_count: formData.content?.split(' ').length || 5
      };
      
      const newNote = await databaseService.createNote(user.uid, noteData);
      setNotes([newNote, ...notes]);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', content: '', course_id: '' });
      showMessage('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      showMessage('❌ Error creating note. Please try again.');
    }
  };

  const updateNote = async () => {
    if (!user || !editingNote) return;
    
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        word_count: formData.content?.split(' ').length || 0
      };
      
      await databaseService.updateNote(user.uid, editingNote.id, updateData);
      
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...note, ...updateData, updated_at: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      setShowCreateForm(false);
      setEditingNote(null);
      setFormData({ title: '', description: '', content: '', course_id: '' });
      showMessage('Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      showMessage('❌ Error updating note. Please try again.');
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description || '',
      content: note.content,
      course_id: note.course_id || ''
    });
    setShowCreateForm(true);
  };

  const deleteNote = async (id) => {
    if (!user) return;
    
    try {
      await databaseService.deleteNote(user.uid, id);
      setNotes(notes.filter(note => note.id !== id));
      showMessage('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      showMessage('❌ Error deleting note. Please try again.');
    }
  };

  const startStudySession = () => {
    setShowStudySession(true);
    setCurrentFlashcardIndex(0);
    showMessage('📚 Study session started! Focus and learn!');
  };

  const nextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    } else {
      completeStudySession();
    }
  };

  const previousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
    }
  };

  const completeStudySession = async () => {
    if (!user) return;
    
    try {
      setShowStudySession(false);
      
      const statsUpdate = {
        sessionsCompleted: studyStats.sessionsCompleted + 1,
        flashcardsReviewed: studyStats.flashcardsReviewed + flashcards.length,
        totalStudyTime: studyStats.totalStudyTime + 5, // Simulated 5 minutes
        lastStudyDate: new Date().toISOString()
      };
      
      await databaseService.updateStudyStats(user.uid, statsUpdate);
      
      setStudyStats(prev => ({
        ...prev,
        ...statsUpdate
      }));
      
      showMessage('🎉 Study session completed! Great job!');
    } catch (error) {
      console.error('Error updating study stats:', error);
      showMessage('❌ Error saving study progress. Please try again.');
    }
  };

  const viewProgress = () => {
    setShowProgress(true);
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

      // Show immediate feedback that processing is happening
      const processingModal = document.createElement('div');
      processingModal.className = 'fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50';
      processingModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">🤖 Processing...</h3>
          <p class="text-sm text-gray-600">Generating smart summary</p>
        </div>
      `;
      document.body.appendChild(processingModal);

      // Simulate AI processing with a smart summary - reduced delay
      setTimeout(() => {
        // Remove processing modal
        processingModal.remove();
        
        const smartSummary = generateSmartSummary(contentToSummarize);
        displaySummary(smartSummary, noteId, true);
      }, 500); // Reduced from 2000ms to 500ms

    } catch (error) {
      console.error('AI Summary Error:', error);
      setMessage(`❌ AI Summary Error: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const displaySummary = async (summary, noteId, isFallback = false) => {
    setMessage(`✅ ${isFallback ? 'Smart' : 'AI'} summary generated successfully!`);

    // Show the summary in a modal - reduced delay
    setTimeout(() => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-900 mb-4">🤖 ${isFallback ? 'Smart' : 'AI'} Summary</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="text-gray-800 leading-relaxed">${summary}</p>
          </div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }, 200); // Reduced from 500ms to 200ms

    // Update the note with the summary in database
    if (noteId && user) {
      try {
        const updateData = {
          ai_summary: summary,
          summary_generated_at: new Date().toISOString(),
          is_fallback_summary: isFallback
        };
        
        await databaseService.updateNote(user.uid, noteId, updateData);
        
        // Update local state
        const updatedNotes = notes.map(note =>
          note.id === noteId
            ? { ...note, ...updateData }
            : note
        );
        setNotes(updatedNotes);
      } catch (error) {
        console.error('Error saving AI summary:', error);
      }
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

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🎓 StudyBuddy</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {['dashboard', 'courses', 'notes', 'flashcards', 'study'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${
                    currentPage === page
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
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
          <div className="flex items-center">
            <FirebaseProfileDropdown />
            <span className="ml-3 text-sm text-green-600">🟢 Online</span>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    📚
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">{courses.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    📝
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Notes</dt>
                    <dd className="text-lg font-medium text-gray-900">{notes.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    🃏
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Flashcards</dt>
                    <dd className="text-lg font-medium text-gray-900">{flashcards.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    🤖
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">AI Summary</dt>
                    <dd className="text-lg font-medium text-gray-900">✅</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Courses</h3>
              <div className="space-y-3">
                {courses.slice(0, 3).map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.description}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Level {course.difficulty_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Notes</h3>
                <button
                  onClick={() => generateAISummary()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  🤖 AI Summary
                </button>
              </div>
              <div className="space-y-3">
                {notes.slice(0, 3).map(note => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-900">{note.title}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generateAISummary(note.id, note.content)}
                          className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                          title="Generate AI Summary"
                        >
                          🤖
                        </button>
                        <button
                          onClick={() => editNote(note)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          title="Edit Note"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{note.content.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-2">{note.word_count} words</p>
                    {note.ai_summary && (
                      <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-800">
                        🤖 AI Summary available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Courses</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            + Add Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Level {course.difficulty_level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button 
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📝 Notes</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => generateAISummary()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              🤖 AI Summary All
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              + Add Note
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                  <button
                    onClick={() => generateAISummary(note.id, note.content)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    title="Generate AI Summary"
                  >
                    🤖
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{note.content.substring(0, 150)}...</p>
                
                {note.ai_summary && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900 mb-1">🤖 AI Summary</h4>
                    <p className="text-sm text-purple-800">{note.ai_summary}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{note.word_count} words</span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => editNote(note)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFlashcards = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🃏 Flashcards</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map(card => (
            <div key={card.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Front</h4>
                  <p className="text-gray-900">{card.front}</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Back</h4>
                  <p className="text-gray-900">{card.back}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Difficulty {card.difficulty}
                  </span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Practice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudy = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📚 Study Mode</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Study Session</h2>
            <p className="text-gray-600 mb-6">Start a focused study session with your flashcards and notes.</p>
            <button
              onClick={startStudySession}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Start Study Session
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Progress</h2>
            <p className="text-gray-600 mb-6">Track your learning progress and identify areas for improvement.</p>
            <button
              onClick={viewProgress}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              View Progress
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🤖 AI Study Assistant</h2>
            <p className="text-gray-600 mb-6">Generate AI-powered summaries and insights from your notes.</p>
            <button
              onClick={() => generateAISummary()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Generate AI Summary
            </button>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🤖 AI-Powered Learning Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Smart Summaries</h4>
              <p className="text-sm text-gray-600 mb-3">Get concise summaries of your notes using advanced AI algorithms.</p>
              <button
                onClick={() => generateAISummary()}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Try Summarization →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
              <p className="text-sm text-gray-600 mb-3">Extract key concepts and important points from your study materials.</p>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Coming Soon →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Study Recommendations</h4>
              <p className="text-sm text-gray-600 mb-3">Get personalized study suggestions based on your learning patterns.</p>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Coming Soon →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Flashcard Generation</h4>
              <p className="text-sm text-gray-600 mb-3">Automatically generate flashcards from your notes and course content.</p>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Coming Soon →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard': return renderDashboard();
      case 'courses': return renderCourses();
      case 'notes': return renderNotes();
      case 'flashcards': return renderFlashcards();
      case 'study': return renderStudy();
      default: return renderDashboard();
    }
  };

  const renderCreateModal = () => {
    if (!showCreateForm) return null;

    const isEditing = editingNote !== null;
    const isNotePage = currentPage === 'notes';

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? `Edit ${isNotePage ? 'Note' : 'Course'}` : `Create New ${isNotePage ? 'Note' : 'Course'}`}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter title"
              />
            </div>
            
            {currentPage === 'courses' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
            )}
            
            {currentPage === 'notes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter note content"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingNote(null);
                setFormData({ title: '', description: '', content: '', course_id: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (isEditing) {
                  if (isNotePage) {
                    updateNote();
                  } else {
                    // Update course functionality can be added here
                    showMessage('Course update coming soon!');
                  }
                } else {
                  if (isNotePage) {
                    createNote();
                  } else {
                    createCourse();
                  }
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100">
      {renderNavigation()}
      
      {/* Message Display */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`${
            message.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' : 
            message.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' : 
            'bg-blue-50 border-blue-200 text-blue-800'
          } border px-4 py-3 rounded-md shadow-sm`}>
            {message}
          </div>
        </div>
      )}

      {renderContent()}
      {renderCreateModal()}
      
      {/* Study Session Modal */}
      {showStudySession && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Study Session</h3>
            
            {flashcards.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Flashcard {currentFlashcardIndex + 1} of {flashcards.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      Difficulty: {flashcards[currentFlashcardIndex]?.difficulty || 1}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Front:</h4>
                    <p className="text-lg font-medium text-gray-900">
                      {flashcards[currentFlashcardIndex]?.front}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Back:</h4>
                    <p className="text-lg text-gray-900">
                      {flashcards[currentFlashcardIndex]?.back}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={previousFlashcard}
                    disabled={currentFlashcardIndex === 0}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <button
                    onClick={completeStudySession}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    End Session
                  </button>
                  
                  <button
                    onClick={nextFlashcard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {currentFlashcardIndex === flashcards.length - 1 ? 'Complete' : 'Next →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No flashcards available for study session.</p>
                <p className="text-sm text-gray-400">Create some flashcards first to start studying!</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Progress Modal */}
      {showProgress && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Study Progress</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{studyStats.totalStudyTime}</div>
                <div className="text-sm text-blue-600">Minutes Studied</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{studyStats.sessionsCompleted}</div>
                <div className="text-sm text-green-600">Sessions</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{studyStats.flashcardsReviewed}</div>
                <div className="text-sm text-purple-600">Flashcards</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{studyStats.streak}</div>
                <div className="text-sm text-yellow-600">Day Streak</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last study session</span>
                    <span className="text-gray-900">Today</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Notes created</span>
                    <span className="text-gray-900">{notes.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Flashcards created</span>
                    <span className="text-gray-900">{flashcards.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Learning Goals</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">60% Daily Goal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">80% Weekly Goal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProgress(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkingSimpleApp;
