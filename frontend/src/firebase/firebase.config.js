// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOQsHJdo28UzKVe1xXFg5eI0caIjSwT5c",
  authDomain: "studypartner-eb836.firebaseapp.com",
  projectId: "studypartner-eb836",
  storageBucket: "studypartner-eb836.firebasestorage.app",
  messagingSenderId: "135131398863",
  appId: "1:135131398863:web:5ca2adabbc01c3f9c12dba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
