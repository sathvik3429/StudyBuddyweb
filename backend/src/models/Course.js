const database = require('../config/database');

class Course {
  static async create(courseData) {
    const { title, description } = courseData;
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO courses (title, description) VALUES (?, ?)';
      db.run(query, [title, description], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, description });
        }
      });
    });
  }

  static async findAll() {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM courses ORDER BY created_at DESC';
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findById(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM courses WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, courseData) {
    const { title, description } = courseData;
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE courses 
        SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      db.run(query, [title, description, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, title, description, changes: this.changes });
        }
      });
    });
  }

  static async delete(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM courses WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }

  static async getNotesCount(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM notes WHERE course_id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

module.exports = Course;
