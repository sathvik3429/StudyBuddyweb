const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = User.verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'INVALID_TOKEN'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'AUTH_REQUIRED'
        });
      }

      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Get the resource ID from request parameters
      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID required',
          error: 'RESOURCE_ID_REQUIRED'
        });
      }

      // Check if user owns the resource
      const database = require('../config/database-enhanced');
      let resource;

      // Determine the table based on the route
      if (req.originalUrl.includes('/courses')) {
        resource = await database.get('SELECT * FROM courses WHERE id = ?', [resourceId]);
      } else if (req.originalUrl.includes('/notes')) {
        resource = await database.get('SELECT * FROM notes WHERE id = ?', [resourceId]);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unable to determine resource type',
          error: 'UNKNOWN_RESOURCE_TYPE'
        });
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
          error: 'RESOURCE_NOT_FOUND'
        });
      }

      if (resource[resourceUserIdField] !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this resource',
          error: 'ACCESS_DENIED'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        error: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = User.verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.is_active) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrAdmin,
  optionalAuth
};
