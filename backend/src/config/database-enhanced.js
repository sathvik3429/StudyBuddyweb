const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'database-enhanced.sqlite');
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to enhanced SQLite database.');
          // Skip sample data insertion due to disk space issues
          resolve();
        }
      });
    });
  }

  createTables() {
    const tables = [
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            avatar_url VARCHAR(255),
            role VARCHAR(20) DEFAULT 'student',
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'categories',
        sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            color VARCHAR(7) DEFAULT '#3B82F6',
            icon VARCHAR(50),
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'courses',
        sql: `
          CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            category_id INTEGER,
            user_id INTEGER NOT NULL,
            difficulty_level INTEGER DEFAULT 1,
            estimated_hours INTEGER DEFAULT 0,
            is_public BOOLEAN DEFAULT 0,
            status VARCHAR(20) DEFAULT 'active',
            thumbnail_url VARCHAR(255),
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'course_modules',
        sql: `
          CREATE TABLE IF NOT EXISTS course_modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            order_index INTEGER DEFAULT 0,
            is_required BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'notes',
        sql: `
          CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(300) NOT NULL,
            content TEXT NOT NULL,
            content_type VARCHAR(20) DEFAULT 'markdown',
            course_id INTEGER NOT NULL,
            module_id INTEGER,
            user_id INTEGER NOT NULL,
            is_bookmarked BOOLEAN DEFAULT 0,
            is_archived BOOLEAN DEFAULT 0,
            word_count INTEGER DEFAULT 0,
            reading_time_minutes INTEGER DEFAULT 0,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'note_versions',
        sql: `
          CREATE TABLE IF NOT EXISTS note_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            version_number INTEGER DEFAULT 1,
            change_summary TEXT,
            created_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'summaries',
        sql: `
          CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            model VARCHAR(50) DEFAULT 'gpt-3.5-turbo',
            word_count INTEGER DEFAULT 0,
            reading_time_seconds INTEGER DEFAULT 0,
            ai_confidence REAL DEFAULT 0.0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'study_sessions',
        sql: `
          CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id INTEGER,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            duration_minutes INTEGER,
            notes_covered INTEGER DEFAULT 0,
            completion_percentage REAL DEFAULT 0.0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'flashcards',
        sql: `
          CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            difficulty INTEGER DEFAULT 1,
            review_count INTEGER DEFAULT 0,
            last_reviewed DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'user_progress',
        sql: `
          CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            module_id INTEGER,
            completion_percentage REAL DEFAULT 0.0,
            time_spent_minutes INTEGER DEFAULT 0,
            last_accessed DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
            UNIQUE(user_id, course_id, module_id)
          )
        `
      }
    ];

    // Create all tables
    const createTablePromises = tables.map(table => {
      return new Promise((resolve, reject) => {
        this.db.run(table.sql, (err) => {
          if (err) {
            console.error(`Error creating table ${table.name}:`, err.message);
            reject(err);
          } else {
            console.log(`Table ${table.name} created successfully`);
            resolve();
          }
        });
      });
    });

    return Promise.all(createTablePromises)
      .then(() => {
        // Create indexes for better performance
        const indexes = [
          'CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id)',
          'CREATE INDEX IF NOT EXISTS idx_notes_course_id ON notes(course_id)',
          'CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)',
          'CREATE INDEX IF NOT EXISTS idx_summaries_note_id ON summaries(note_id)',
          'CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id)',
          'CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id)'
        ];

        const indexPromises = indexes.map(index => {
          return new Promise((resolve, reject) => {
            this.db.run(index, (err) => {
              if (err) {
                console.error(`Error creating index:`, err.message);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });

        return Promise.all(indexPromises);
      })
      .then(() => {
        // Insert sample data
        return this.insertSampleData();
      })
      .catch(error => {
        console.error('Error creating tables:', error);
        throw error;
      });
  }

  insertSampleData() {
    console.log('Inserting enhanced sample data...');
    
    // Sample user
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['john_doe', 'john@example.com', 'hashed_password', 'John', 'Doe', 'student'], (err) => {
        if (err) {
          console.error('Error inserting sample user:', err.message);
        } else {
          resolve();
        }
      });
    }).then(() => {
      // Sample categories
      return new Promise((resolve, reject) => {
        this.db.run(`
          INSERT OR IGNORE INTO categories (name, description, color, icon, user_id) 
          VALUES (?, ?, ?, ?, ?)
        `, ['Web Development', 'Modern web technologies and frameworks', '#3B82F6', 'code', 1], (err) => {
          if (err) {
            console.error('Error inserting sample category:', err.message);
          } else {
            resolve();
          }
        });
      });
    }).then(() => {
      // Sample course with modules
      return new Promise((resolve) => {
        this.db.run(`
          INSERT OR IGNORE INTO courses (title, description, category_id, user_id, difficulty_level, is_public) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['Full-Stack Web Development', 'Complete course covering modern web development with React, Node.js, and best practices', 1, 1, 1, 1], (err) => {
          if (err) {
            console.error('Error inserting sample course:', err.message);
          } else {
            resolve(1); // Return course ID 1
          }
        });
      });
    }).then((courseId) => {
      // Sample modules
      const modules = [
        ['Introduction to React', 'Components and Props', 'State Management', 'Hooks and Effects', 'Routing and Navigation', 'API Integration'],
        ['HTML & CSS Fundamentals', 'JavaScript ES6+', 'DOM Manipulation', 'Event Handling', 'Async Programming', 'Error Handling']
      ];

      const modulePromises = modules.map((module, i) => {
        return new Promise((resolve, reject) => {
          this.db.run(`
            INSERT OR IGNORE INTO course_modules (course_id, title, description, order_index) 
            VALUES (?, ?, ?, ?)
          `, [courseId, module, `Module ${i + 1}: ${module}`, i], (err) => {
            if (err) {
              console.error(`Error inserting module ${i}:`, err.message);
            } else {
              resolve();
            }
          });
        });
      });

      return Promise.all(modulePromises);
    }).then(() => {
      // Sample notes
      return new Promise((resolve) => {
        this.db.run(`
          INSERT OR IGNORE INTO notes (title, content, content_type, course_id, user_id, word_count) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['Getting Started with React', '# Getting Started with React\n\nReact is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage application state efficiently.', 'markdown', 1, 1, 45], (err) => {
          if (err) {
            console.error('Error inserting sample note:', err.message);
          } else {
            resolve();
          }
        });
      });
    }).then(() => {
      console.log('Enhanced sample data inserted successfully');
    }).catch(error => {
      console.error('Error inserting sample data:', error);
      throw error;
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            console.log('Database connection closed.');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Helper methods for CRUD operations
  async query(sql, params = []) {
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

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
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
}

module.exports = new Database();
