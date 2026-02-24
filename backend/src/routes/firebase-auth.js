const express = require('express');
const router = express.Router();
const { auth } = require('../config/firebase-admin');
const User = require('../models/User');

// Verify Firebase token and create/update user
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in our database
    let user = await User.findByEmail(email);
    
    if (!user) {
      // Create new user in our database
      const firstName = name ? name.split(' ')[0] : '';
      const lastName = name ? name.split(' ').slice(1).join(' ') : '';
      const username = email ? email.split('@')[0] : `user_${uid.slice(0, 8)}`;
      
      try {
        user = await User.create({
          username,
          email,
          password: `firebase-auth-${uid}`, // Special password for Firebase users
          firstName,
          lastName,
          role: 'student'
        });
      } catch (createError) {
        // If username already exists, try with a different one
        const uniqueUsername = `${username}_${uid.slice(0, 4)}`;
        user = await User.create({
          username: uniqueUsername,
          email,
          password: `firebase-auth-${uid}`,
          firstName,
          lastName,
          role: 'student'
        });
      }
    }

    // Generate JWT token for our app
    const jwtToken = User.generateJWT(user);

    res.json({
      success: true,
      message: 'Firebase authentication successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatarUrl: user.avatar_url || picture,
          createdAt: user.created_at
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Firebase token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid Firebase token',
      error: error.message
    });
  }
});

// Get Firebase user info
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userRecord = await auth.getUser(uid);
    
    res.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified
      }
    });
  } catch (error) {
    console.error('Error fetching Firebase user:', error);
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: error.message
    });
  }
});

module.exports = router;
