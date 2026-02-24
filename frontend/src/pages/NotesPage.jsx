import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import SummaryModal from '../components/SummaryModal';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { notesAPI, coursesAPI, summariesAPI } from '../api/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [summaryModal, setSummaryModal] = useState({
    isOpen: false,
    note: null,
    summary: null,
    isGenerating: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchTerm, selectedCourse, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notesRes, coursesRes] = await Promise.all([
        notesAPI.getAll(),
        coursesAPI.getAll()
      ]);
      setNotes(notesRes.data.data || []);
      setCourses(coursesRes.data.data || []);
    } catch (err) {
      setError('Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNotes = () => {
    let filtered = notes;

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(note => note.course_id === parseInt(selectedCourse));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.course_title && note.course_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingNote) {
        await notesAPI.update(editingNote.id, formData);
      } else {
        await notesAPI.create(formData);
      }
      setShowForm(false);
      setEditingNote(null);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.delete(noteId);
      await fetchData();
    } catch (err) {
      setError('Failed to delete note');
      console.error('Delete note error:', err);
    }
  };

  const handleSummarize = async (note) => {
    try {
      setSummaryModal({
        isOpen: true,
        note,
        summary: null,
        isGenerating: true
      });

      // Try to get existing summary first
      try {
        const summaryRes = await summariesAPI.getLatestByNoteId(note.id);
        setSummaryModal(prev => ({
          ...prev,
          summary: summaryRes.data.data,
          isGenerating: false
        }));
      } catch {
        // No existing summary, generate a new one
        const summaryRes = await summariesAPI.generate(note.id);
        setSummaryModal(prev => ({
          ...prev,
          summary: summaryRes.data.data,
          isGenerating: false
        }));
      }
    } catch (err) {
      setSummaryModal(prev => ({ ...prev, isGenerating: false }));
      setError('Failed to generate summary');
      console.error('Summary error:', err);
    }
  };

  const handleGenerateSummary = async (noteId) => {
    try {
      setSummaryModal(prev => ({ ...prev, isGenerating: true }));
      const summaryRes = await summariesAPI.generate(noteId);
      setSummaryModal(prev => ({
        ...prev,
        summary: summaryRes.data.data,
        isGenerating: false
      }));
    } catch (err) {
      setSummaryModal(prev => ({ ...prev, isGenerating: false }));
      setError('Failed to generate summary');
      console.error('Generate summary error:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const closeSummaryModal = () => {
    setSummaryModal({
      isOpen: false,
      note: null,
      summary: null,
      isGenerating: false
    });
  };

  if (showForm) {
    return (
      <NoteForm
        note={editingNote}
        courses={courses}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading notes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <button
          onClick={handleCreateNote}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Note
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search notes by title, content, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
              <option value="updated_at">Last Updated</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Bar */}
      {filteredNotes.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-900">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
              </span>
            </div>
            <div className="flex items-center text-sm text-green-700">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title={searchTerm || selectedCourse ? 'No Notes Found' : 'No Notes Yet'}
          description={
            searchTerm || selectedCourse
              ? `No notes found matching your criteria. Try adjusting filters.`
              : 'Create your first note to start documenting your learning journey.'
          }
          actionText={searchTerm || selectedCourse ? 'Clear Filters' : 'Create Your First Note'}
          onAction={searchTerm || selectedCourse ? () => {
            setSearchTerm('');
            setSelectedCourse('');
          } : handleCreateNote}
          illustration="/api/placeholder/illustration/notes-empty.svg"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="group relative">
              <NoteCard
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onSummarize={handleSummarize}
              />
              
              {/* Hover overlay with quick stats */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-200 pointer-events-none">
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white rounded-lg shadow-xl p-3 min-w-48">
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {note.content ? `${note.content.length} characters` : 'No content'}
                    </div>
                    {note.course_title && (
                      <div className="flex items-center text-xs text-gray-600">
                        <TagIcon className="w-4 h-4 mr-1" />
                        {note.course_title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      {notes.length > 0 && !showForm && (
        <button
          onClick={handleCreateNote}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40"
          title="Create new note"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {/* Summary Modal */}
      <SummaryModal
        isOpen={summaryModal.isOpen}
        onClose={closeSummaryModal}
        note={summaryModal.note}
        summary={summaryModal.summary}
        isGenerating={summaryModal.isGenerating}
        onGenerate={handleGenerateSummary}
      />
    </div>
  );
};

export default NotesPage;
