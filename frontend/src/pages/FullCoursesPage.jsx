import React, { useState, useEffect } from 'react';

function FullCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    difficulty_level: 1,
    is_public: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses (without auth)
      const coursesResponse = await fetch('http://localhost:3001/api/courses');
      const coursesData = await coursesResponse.json();
      
      // Fetch categories (without auth)
      const categoriesResponse = await fetch('http://localhost:3001/api/categories');
      const categoriesData = await categoriesResponse.json();

      if (coursesData.success) {
        setCourses(coursesData.data || []);
      }
      
      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
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
      const url = editingCourse 
        ? `http://localhost:3001/api/courses/${editingCourse.id}`
        : 'http://localhost:3001/api/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Course ${editingCourse ? 'updated' : 'created'} successfully!`);
        setShowCreateForm(false);
        setEditingCourse(null);
        setFormData({
          title: '',
          description: '',
          category_id: '',
          difficulty_level: 1,
          is_public: false
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

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category_id: course.category_id,
      difficulty_level: course.difficulty_level,
      is_public: course.is_public
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Course deleted successfully!');
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

  const getDifficultyColor = (level) => {
    const colors = {
      1: '#10b981', // Beginner - Green
      2: '#f59e0b', // Intermediate - Yellow
      3: '#ef4444'  // Advanced - Red
    };
    return colors[level] || '#6b7280';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced'
    };
    return labels[level] || 'Unknown';
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
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 0.5rem 0' }}>📚 Courses</h1>
          <p style={{ color: '#6b7280', margin: '0' }}>Manage your learning courses</p>
        </div>
        <button 
          onClick={() => {
            setShowCreateForm(true);
            setEditingCourse(null);
            setFormData({
              title: '',
              description: '',
              category_id: '',
              difficulty_level: 1,
              is_public: false
            });
          }}
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
            {editingCourse ? '✏️ Edit Course' : '➕ Create New Course'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                  Course Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter course title"
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
              <div>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
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
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'medium' }}>
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({...formData, difficulty_level: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                  style={{ width: '1rem', height: '1rem' }}
                />
                <label htmlFor="is_public" style={{ color: '#374151', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Make this course public
                </label>
              </div>
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
                {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingCourse(null);
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

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>No courses yet</p>
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
            Create Your First Course
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1f2937', margin: '0', fontSize: '1.25rem' }}>{course.title}</h3>
                <span style={{ 
                  backgroundColor: getDifficultyColor(course.difficulty_level),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {getDifficultyLabel(course.difficulty_level)}
                </span>
              </div>
              
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                {course.description || 'No description available'}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {course.notes_count || 0} notes
                </span>
                {course.is_public && (
                  <span style={{ fontSize: '0.875rem', color: '#10b981' }}>
                    🌐 Public
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(course)}
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
                    onClick={() => handleDelete(course.id)}
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

export default FullCoursesPage;
