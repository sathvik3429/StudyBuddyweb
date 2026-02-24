const database = require('../config/database');

class Note {
  static async create(noteData) {
    const { title, content, course_id } = noteData;
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO notes (title, content, course_id) VALUES (?, ?, ?)';
      db.run(query, [title, content, course_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, content, course_id });
        }
      });
    });
  }

  static async findAll() {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT n.*, c.title as course_title 
        FROM notes n 
        JOIN courses c ON n.course_id = c.id 
        ORDER BY n.created_at DESC
      `;
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findByCourseId(courseId) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT n.*, c.title as course_title 
        FROM notes n 
        JOIN courses c ON n.course_id = c.id 
        WHERE n.course_id = ? 
        ORDER BY n.created_at DESC
      `;
      db.all(query, [courseId], (err, rows) => {
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
      const query = `
        SELECT n.*, c.title as course_title 
        FROM notes n 
        JOIN courses c ON n.course_id = c.id 
        WHERE n.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, noteData) {
    const { title, content } = noteData;
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE notes 
        SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      db.run(query, [title, content, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, title, content, changes: this.changes });
        }
      });
    });
  }

  static async delete(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM notes WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }

  static async getContent(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT title, content FROM notes WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Note;
