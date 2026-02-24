const db = require('../models/db');

exports.getAllCourses = (req, res) => {
  db.all('SELECT * FROM courses ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createCourse = (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.run('INSERT INTO courses (title, description) VALUES (?, ?)', [title, description], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, description });
  });
};

exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', [title, description, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ id, title, description });
  });
};

exports.deleteCourse = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM courses WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  });
};
