import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import SummaryModal from '../components/SummaryModal';
import { notesAPI, coursesAPI, summariesAPI } from '../api/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
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
    // Filter notes based on search term and course
    let filtered = notes;

    if (selectedCourse) {
      filtered = filtered.filter(note => note.course_id === parseInt(selectedCourse));
    }

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.course_title && note.course_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedCourse]);

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
      throw err; // Let the form handle the error
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
      setSummaryModal(prev => ({
        ...prev,
        isGenerating: false
      }));
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        <button
          onClick={handleCreateNote}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Course Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || selectedCourse ? 'No notes found matching your filters.' : 'No notes yet.'}
          </div>
          {!searchTerm && !selectedCourse && (
            <button
              onClick={handleCreateNote}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onSummarize={handleSummarize}
            />
          ))}
        </div>
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
