const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database-enhanced');

class User {
  constructor() {
    this.saltRounds = 12;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiry = process.env.JWT_EXPIRY || '7d';
  }

  // Create a new user
  async create(userData) {
    const { username, email, password, firstName, lastName, role = 'student' } = userData;
    
    // Validate input
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await this.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // Insert user
    const result = await database.run(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, firstName, lastName, role]
    );

    // Return user without password hash
    return this.findById(result.lastID);
  }

  // Find user by ID
  async findById(id) {
    const user = await database.get(
      'SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return user;
  }

  // Find user by email
  async findByEmail(email) {
    const user = await database.get(
      'SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    return user;
  }

  // Find user by username
  async findByUsername(username) {
    const user = await database.get(
      'SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, created_at, updated_at FROM users WHERE username = ?',
      [username]
    );
    return user;
  }

  // Find user by email with password hash (for authentication)
  async findByEmailWithPassword(email) {
    const user = await database.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return user;
  }

  // Authenticate user
  async authenticate(email, password) {
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user data without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Update user profile
  async update(id, userData) {
    const { firstName, lastName, avatarUrl } = userData;
    const result = await database.run(
      `UPDATE users SET first_name = ?, last_name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [firstName, lastName, avatarUrl, id]
    );

    if (result.changes === 0) {
      throw new Error('User not found');
    }

    return this.findById(id);
  }

  // Change password
  async changePassword(id, currentPassword, newPassword) {
    const user = await database.get(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);
    
    await database.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, id]
    );

    return { success: true, message: 'Password updated successfully' };
  }

  // Deactivate user
  async deactivate(id) {
    const result = await database.run(
      'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      throw new Error('User not found');
    }

    return { success: true, message: 'User deactivated successfully' };
  }

  // Get user statistics
  async getStats(userId) {
    const stats = await database.get(`
      SELECT 
        COUNT(DISTINCT c.id) as courses_count,
        COUNT(DISTINCT n.id) as notes_count,
        COUNT(DISTINCT s.id) as summaries_count,
        COUNT(DISTINCT ss.id) as study_sessions_count,
        COALESCE(SUM(ss.duration_minutes), 0) as total_study_minutes
      FROM users u
      LEFT JOIN courses c ON u.id = c.user_id
      LEFT JOIN notes n ON u.id = n.user_id
      LEFT JOIN summaries s ON n.id = s.note_id
      LEFT JOIN study_sessions ss ON u.id = ss.user_id
      WHERE u.id = ?
    `, [userId]);

    return stats;
  }
}

module.exports = new User();
