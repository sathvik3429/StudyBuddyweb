const db = require('../models/db');

exports.getNotesByCourse = (req, res) => {
  const { courseId } = req.query;
  const query = courseId
    ? 'SELECT * FROM notes WHERE course_id = ? ORDER BY created_at DESC'
    : 'SELECT * FROM notes ORDER BY created_at DESC';
  const params = courseId ? [courseId] : [];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createNote = (req, res) => {
  const { title, content, course_id } = req.body;
  if (!title || !course_id) return res.status(400).json({ error: 'Title and course_id are required' });

  db.run('INSERT INTO notes (title, content, course_id) VALUES (?, ?, ?)', [title, content || '', course_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, content, course_id });
  });
};

exports.deleteNote = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM notes WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  });
};
