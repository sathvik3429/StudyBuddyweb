const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid('student', 'teacher', 'admin').default('student')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100),
  lastName: Joi.string().min(1).max(100),
  avatarUrl: Joi.string().uri().allow('')
});

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    console.log('Creating user with data:', value);
    
    // Create user
    const user = await User.create(value);
    console.log('User created successfully:', user);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
      error: 'REGISTRATION_FAILED'
    });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Authenticate user
    const result = await User.authenticate(value.email, value.password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
      error: 'LOGIN_FAILED'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const stats = await User.getStats(req.user.id);
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user,
        stats
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: 'PROFILE_FETCH_FAILED'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Update profile
    const updatedUser = await User.update(req.user.id, value);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Profile update failed',
      error: 'PROFILE_UPDATE_FAILED'
    });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Change password
    const result = await User.changePassword(req.user.id, value.currentPassword, value.newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully',
      data: result
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Password change failed',
      error: 'PASSWORD_CHANGE_FAILED'
    });
  }
});

// Verify token (for frontend to check if token is still valid)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

// Logout (client-side token removal, but we can add server-side tracking if needed)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Deactivate account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const result = await User.deactivate(req.user.id);
    
    res.json({
      success: true,
      message: 'Account deactivated successfully',
      data: result
    });
  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Account deactivation failed',
      error: 'ACCOUNT_DEACTIVATION_FAILED'
    });
  }
});

module.exports = router;
