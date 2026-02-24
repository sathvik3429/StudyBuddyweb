// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBst9qT4GwjbkBu22IWqaDU4hVfKlWRdMc",
  authDomain: "studybuddy-abc41.firebaseapp.com",
  projectId: "studybuddy-abc41",
  storageBucket: "studybuddy-abc41.firebasestorage.app",
  messagingSenderId: "10886046986",
  appId: "1:10886046986:web:1a9070e02e101bfa5606f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  auth, 
  db,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  sendEmailVerification,
  onAuthStateChanged
};

export default app;
