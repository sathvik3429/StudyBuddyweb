const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
            if (pragmaErr) {
                console.error('Error enabling foreign keys', pragmaErr.message);
            }
        });

        db.serialize(() => {
            // Courses Table
            db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Notes Table
            db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        course_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
      )`);

            // Summaries Table
            db.run(`CREATE TABLE IF NOT EXISTS summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note_id INTEGER NOT NULL,
        summary_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
      )`);
        });
    }
});

module.exports = db;
