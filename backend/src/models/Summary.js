const database = require('../config/database');

class Summary {
  static async create(summaryData) {
    const { note_id, summary_text } = summaryData;
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO summaries (note_id, summary_text) VALUES (?, ?)';
      db.run(query, [note_id, summary_text], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, note_id, summary_text });
        }
      });
    });
  }

  static async findByNoteId(noteId) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, n.title as note_title 
        FROM summaries s 
        JOIN notes n ON s.note_id = n.id 
        WHERE s.note_id = ? 
        ORDER BY s.created_at DESC
      `;
      db.all(query, [noteId], (err, rows) => {
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
        SELECT s.*, n.title as note_title, c.title as course_title 
        FROM summaries s 
        JOIN notes n ON s.note_id = n.id 
        JOIN courses c ON n.course_id = c.id 
        WHERE s.id = ?
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

  static async getLatestByNoteId(noteId) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, n.title as note_title 
        FROM summaries s 
        JOIN notes n ON s.note_id = n.id 
        WHERE s.note_id = ? 
        ORDER BY s.created_at DESC 
        LIMIT 1
      `;
      db.get(query, [noteId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async delete(id) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM summaries WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }

  static async deleteByNoteId(noteId) {
    const db = database.getDatabase();
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM summaries WHERE note_id = ?';
      db.run(query, [noteId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      });
    });
  }
}

module.exports = Summary;
