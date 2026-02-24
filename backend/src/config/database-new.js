const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class NewDatabase {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../database-new.sqlite');
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to new SQLite database.');
          this.createTables()
            .then(() => this.insertSampleData())
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          avatar_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Categories table
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          color VARCHAR(7) DEFAULT '#3B82F6',
          icon VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Courses table
        `CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category_id INTEGER,
          user_id INTEGER NOT NULL,
          difficulty_level INTEGER DEFAULT 1,
          is_public BOOLEAN DEFAULT false,
          status VARCHAR(20) DEFAULT 'active',
          progress INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        // Notes table
        `CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          content_type VARCHAR(50) DEFAULT 'markdown',
          course_id INTEGER,
          user_id INTEGER NOT NULL,
          word_count INTEGER DEFAULT 0,
          reading_time INTEGER DEFAULT 0,
          is_bookmarked BOOLEAN DEFAULT false,
          status VARCHAR(20) DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        // Summaries table
        `CREATE TABLE IF NOT EXISTS summaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          word_count INTEGER DEFAULT 0,
          reading_time_seconds INTEGER DEFAULT 0,
          model VARCHAR(100) DEFAULT 'facebook/bart-large-cnn',
          ai_confidence REAL DEFAULT 0.8,
          summary_type VARCHAR(50) DEFAULT 'standard',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (note_id) REFERENCES notes(id)
        )`,

        // Study Sessions table
        `CREATE TABLE IF NOT EXISTS study_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          course_id INTEGER,
          note_id INTEGER,
          session_type VARCHAR(50) DEFAULT 'study',
          duration_minutes INTEGER DEFAULT 0,
          pages_read INTEGER DEFAULT 0,
          notes_taken INTEGER DEFAULT 0,
          completed BOOLEAN DEFAULT false,
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          ended_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (course_id) REFERENCES courses(id),
          FOREIGN KEY (note_id) REFERENCES notes(id)
        )`,

        // Flashcards table
        `CREATE TABLE IF NOT EXISTS flashcards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note_id INTEGER NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          difficulty INTEGER DEFAULT 1,
          review_count INTEGER DEFAULT 0,
          last_reviewed DATETIME,
          next_review DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (note_id) REFERENCES notes(id)
        )`,

        // User Progress table
        `CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          course_id INTEGER,
          total_time_spent INTEGER DEFAULT 0,
          sessions_completed INTEGER DEFAULT 0,
          notes_created INTEGER DEFAULT 0,
          flashcards_reviewed INTEGER DEFAULT 0,
          last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )`
      ];

      let completed = 0;
      tables.forEach((tableSQL, index) => {
        this.db.run(tableSQL, (err) => {
          if (err) {
            console.error(`Error creating table ${index + 1}:`, err.message);
            reject(err);
          } else {
            completed++;
            if (completed === tables.length) {
              console.log('All new tables created successfully');
              resolve();
            }
          }
        });
      });
    });
  }

  async insertSampleData() {
    return new Promise((resolve, reject) => {
      // Insert sample user
      this.db.run(`
        INSERT OR IGNORE INTO users (name, email, password_hash) 
        VALUES (?, ?, ?)
      `, ['John Doe', 'john@example.com', 'hashed_password'], (err) => {
        if (err) {
          console.error('Error inserting sample user:', err.message);
        } else {
          // Insert sample categories
          this.db.run(`
            INSERT OR IGNORE INTO categories (name, description, color, icon) 
            VALUES (?, ?, ?, ?)
          `, ['Web Development', 'Modern web technologies and frameworks', '#3B82F6', 'code'], (err) => {
            if (err) {
              console.error('Error inserting sample category:', err.message);
            } else {
              // Insert sample course
              this.db.run(`
                INSERT OR IGNORE INTO courses (title, description, category_id, user_id, difficulty_level, is_public) 
                VALUES (?, ?, ?, ?, ?, ?)
              `, ['Full-Stack Web Development', 'Complete course covering modern web development with React, Node.js, and best practices', 1, 1, 1, false], (err) => {
                if (err) {
                  console.error('Error inserting sample course:', err.message);
                } else {
                  // Insert sample note
                  this.db.run(`
                    INSERT OR IGNORE INTO notes (title, content, content_type, course_id, user_id, word_count) 
                    VALUES (?, ?, ?, ?, ?, ?)
                  `, ['Getting Started with React', '# Getting Started with React\n\nReact is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage application state efficiently.', 'markdown', 1, 1, 45], (err) => {
                    if (err) {
                      console.error('Error inserting sample note:', err.message);
                    } else {
                      console.log('New sample data inserted successfully');
                      resolve();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed.');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Helper methods for database operations
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = new NewDatabase();
