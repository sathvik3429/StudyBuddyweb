import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from '../firebase/firebase.config';

const FirebaseAuthContext = createContext();

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(result.user);
      
      // Sign out the user immediately after registration
      await signOut(auth);
      
      return { 
        success: true, 
        user: result.user,
        emailSent: true,
        needsVerification: true
      };
    } catch (error) {
      let errorMessage = 'An error occurred during sign up';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'User already exists. Please sign in';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        await signOut(auth); // Sign out the user
        return { 
          success: false, 
          error: 'Please verify your email before signing in. Check your inbox for the verification email.',
          needsVerification: true,
          email: result.user.email
        };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'An error occurred during sign in';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email or password is incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'An error occurred during Google sign in';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by the browser. Please allow popups';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out');
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseAuthContext;
