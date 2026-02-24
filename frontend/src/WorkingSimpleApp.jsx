import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from './contexts/FirebaseAuthContext';
import { dbService } from './services/database';
import UserDisplay from './components/UserDisplay';

function WorkingSimpleApp() {
  const { user, logout } = useFirebaseAuth();
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
    difficulty_level: 1,
    course_id: null,
    front: '',
    back: '',
    difficulty: 1
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

  // Load user data from Firestore on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      console.log('Loading user data for:', user?.uid);
      setLoading(true);
      
      if (!user?.uid) {
        console.error('No user UID found');
        setMessage('❌ No user authenticated');
        setLoading(false);
        return;
      }
      
      // Load all user data from Firestore
      console.log('Fetching data from Firestore...');
      const [coursesResult, notesResult, flashcardsResult] = await Promise.all([
        dbService.getUserCourses(user.uid),
        dbService.getUserNotes(user.uid),
        dbService.getUserFlashcards(user.uid)
      ]);

      console.log('Data results:', { coursesResult, notesResult, flashcardsResult });

      if (coursesResult.success) {
        console.log('Courses loaded:', coursesResult.data);
        setCourses(coursesResult.data);
      } else {
        console.error('Failed to load courses:', coursesResult.error);
      }
      
      if (notesResult.success) {
        console.log('Notes loaded:', notesResult.data);
        setNotes(notesResult.data);
      } else {
        console.error('Failed to load notes:', notesResult.error);
      }
      
      if (flashcardsResult.success) {
        console.log('Flashcards loaded:', flashcardsResult.data);
        setFlashcards(flashcardsResult.data);
      } else {
        console.error('Failed to load flashcards:', flashcardsResult.error);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage('❌ Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save course to Firestore
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    console.log('Creating course - User:', user);
    console.log('Creating course - FormData:', formData);

    if (!user || !user.uid) {
      console.error('No user or user UID available');
      setMessage('❌ Please sign in to create courses');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setMessage('🔄 Creating course...');
      const courseData = {
        title: formData.title,
        description: formData.description,
        difficulty_level: formData.difficulty_level
      };

      console.log('Saving course data:', courseData);
      const result = await dbService.saveCourse(user.uid, courseData);
      console.log('Save course result:', result);
      
      if (result.success) {
        // Reload courses
        const coursesResult = await dbService.getUserCourses(user.uid);
        if (coursesResult.success) {
          setCourses(coursesResult.data);
        }
        
        setShowCreateForm(false);
        setFormData({ ...formData, title: '', description: '', difficulty_level: 1 });
        setMessage('✅ Course created successfully!');
      } else {
        console.error('Course creation failed:', result.error);
        setMessage('❌ Failed to create course: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('❌ Error creating course: ' + error.message);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Save note to Firestore
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    console.log('Creating note - User:', user);
    console.log('Creating note - FormData:', formData);

    if (!user || !user.uid) {
      console.error('No user or user UID available');
      setMessage('❌ Please sign in to create notes');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setMessage('🔄 Creating note...');
      const noteData = {
        title: formData.title,
        content: formData.content,
        word_count: formData.content.split(/\s+/).length,
        course_id: formData.course_id
      };

      console.log('Saving note data:', noteData);
      const result = await dbService.saveNote(user.uid, noteData);
      console.log('Save note result:', result);
      
      if (result.success) {
        // Reload notes
        const notesResult = await dbService.getUserNotes(user.uid);
        if (notesResult.success) {
          setNotes(notesResult.data);
        }
        
        setShowCreateForm(false);
        setFormData({ ...formData, title: '', content: '', course_id: null });
        setMessage('✅ Note created successfully!');
      } else {
        console.error('Note creation failed:', result.error);
        setMessage('❌ Failed to create note: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      setMessage('❌ Error creating note: ' + error.message);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Save flashcard to Firestore
  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    if (!formData.front.trim() || !formData.back.trim()) return;

    console.log('Creating flashcard - User:', user);
    console.log('Creating flashcard - FormData:', formData);

    if (!user || !user.uid) {
      console.error('No user or user UID available');
      setMessage('❌ Please sign in to create flashcards');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setMessage('🔄 Creating flashcard...');
      const flashcardData = {
        front: formData.front,
        back: formData.back,
        difficulty: formData.difficulty
      };

      console.log('Saving flashcard data:', flashcardData);
      const result = await dbService.saveFlashcard(user.uid, flashcardData);
      console.log('Save flashcard result:', result);
      
      if (result.success) {
        // Reload flashcards
        const flashcardsResult = await dbService.getUserFlashcards(user.uid);
        if (flashcardsResult.success) {
          setFlashcards(flashcardsResult.data);
        }
        
        setShowCreateForm(false);
        setFormData({ ...formData, front: '', back: '', difficulty: 1 });
        setMessage('✅ Flashcard created successfully!');
      } else {
        console.error('Flashcard creation failed:', result.error);
        setMessage('❌ Failed to create flashcard: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      setMessage('❌ Error creating flashcard: ' + error.message);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Delete course from Firestore
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      setMessage('🔄 Deleting course...');
      const result = await dbService.deleteCourse(user.uid, courseId);
      
      if (result.success) {
        setCourses(courses.filter(course => course.id !== courseId));
        setMessage('✅ Course deleted successfully!');
      } else {
        setMessage('❌ Failed to delete course');
      }
    } catch (error) {
      setMessage('❌ Error deleting course');
    }
    
    setTimeout(() => setMessage(''), 2000);
  };

  // Delete note from Firestore
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      setMessage('🔄 Deleting note...');
      const result = await dbService.deleteNote(user.uid, noteId);
      
      if (result.success) {
        setNotes(notes.filter(note => note.id !== noteId));
        setMessage('✅ Note deleted successfully!');
      } else {
        setMessage('❌ Failed to delete note');
      }
    } catch (error) {
      setMessage('❌ Error deleting note');
    }
    
    setTimeout(() => setMessage(''), 2000);
  };

  // Delete flashcard from Firestore
  const handleDeleteFlashcard = async (flashcardId) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      setMessage('🔄 Deleting flashcard...');
      const result = await dbService.deleteFlashcard(user.uid, flashcardId);
      
      if (result.success) {
        setFlashcards(flashcards.filter(card => card.id !== flashcardId));
        setMessage('✅ Flashcard deleted successfully!');
      } else {
        setMessage('❌ Failed to delete flashcard');
      }
    } catch (error) {
      setMessage('❌ Error deleting flashcard');
    }
    
    setTimeout(() => setMessage(''), 2000);
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const createCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      title: formData.title || 'New Course',
      description: formData.description || 'Course description',
      difficulty_level: 1,
      created_at: new Date().toISOString()
    };
    setCourses([...courses, newCourse]);
    setShowCreateForm(false);
    setFormData({ title: '', description: '', content: '', course_id: '' });
    showMessage('Course created successfully!');
  };

  const createNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: formData.title || 'New Note',
      content: formData.content || 'Note content',
      word_count: formData.content?.split(' ').length || 5,
      created_at: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
    setShowCreateForm(false);
    setFormData({ title: '', description: '', content: '', course_id: '' });
    showMessage('Note created successfully!');
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    showMessage('Course deleted successfully!');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    showMessage('Note deleted successfully!');
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

  const updateNote = () => {
    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: formData.title,
            description: formData.description,
            content: formData.content,
            word_count: formData.content?.split(' ').length || 0,
            updated_at: new Date().toISOString()
          }
        : note
    );
    setNotes(updatedNotes);
    setShowCreateForm(false);
    setEditingNote(null);
    setFormData({ title: '', description: '', content: '', course_id: '' });
    showMessage('Note updated successfully!');
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

  const completeStudySession = () => {
    setShowStudySession(false);
    setStudyStats(prev => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1,
      flashcardsReviewed: prev.flashcardsReviewed + flashcards.length,
      totalStudyTime: prev.totalStudyTime + 5 // Simulated 5 minutes
    }));
    showMessage('🎉 Study session completed! Great job!');
  };

  const viewProgress = () => {
    setShowProgress(true);
  };

  const generateSmartSummary = (content) => {
    const sentences = content.split('.').filter(s => s.trim());
    if (sentences.length <= 2) return content;
    
    const keyPoints = sentences.slice(0, 3).join('. ').trim();
    return `${keyPoints}. This content covers ${sentences.length} main points about the topic.`;
  };

  const displaySummary = (summary, noteId, isFallback = false) => {
    setMessage(`✅ ${isFallback ? 'Smart' : 'AI'} summary generated successfully!`);
    
    // Clear the success message after 2 seconds
    setTimeout(() => {
      setMessage('');
    }, 2000);

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

    // Update the note with the summary in Firestore
    if (noteId) {
      dbService.updateNote(user.uid, noteId, {
        ai_summary: summary,
        summary_generated_at: new Date().toISOString(),
        is_fallback_summary: isFallback
      });
    }
  };

  const generateAISummary = async (noteId = null, noteContent = null) => {
    try {
      setMessage('🤖 Generating AI summary...');
      const contentToSummarize = noteContent || (notes.length > 0 ? notes[0].content : null);
      
      if (!contentToSummarize) {
        setMessage('❌ No content available for summarization');
        setTimeout(() => setMessage(''), 2000);
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
      setTimeout(() => setMessage(''), 2000);
    }
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
            <UserDisplay />
            <button
              onClick={async () => {
                const result = await logout();
                if (result.success) {
                  window.location.href = '/login';
                }
              }}
              className="ml-3 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign out
            </button>
            <span className="ml-3 text-sm text-green-600">🟢 Online</span>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setCurrentPage('notes');
                setShowCreateForm(true);
                setFormData({
                  title: '',
                  content: '',
                  course_id: null
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Add Note
            </button>
            <button
              onClick={() => {
                setCurrentPage('courses');
                setShowCreateForm(true);
                setFormData({
                  title: '',
                  description: '',
                  difficulty_level: 1
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Add Course
            </button>
            <button
              onClick={() => {
                setCurrentPage('flashcards');
                setShowCreateForm(true);
                setFormData({
                  front: '',
                  back: '',
                  difficulty: 1
                });
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Add Flashcard
            </button>
          </div>
        </div>

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
