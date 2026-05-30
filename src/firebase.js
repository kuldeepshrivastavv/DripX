// Firebase v9+ modular SDK — DripX project
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDG7ik0KrAPJMnqWvt4jlBFzUhcn3FvNE",
  authDomain: "dripx-fcd03.firebaseapp.com",
  projectId: "dripx-fcd03",
  storageBucket: "dripx-fcd03.firebasestorage.app",
  messagingSenderId: "511248400408",
  appId: "1:511248400408:web:8b515b29ea0fbcdd5d836d",
  measurementId: "G-8Q64H4F0TM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (only in browser env)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Auth instance
const auth = getAuth(app);

// Firestore instance
const db = getFirestore(app);

// Storage instance
const storage = getStorage(app);

// Provider instances
const googleProvider = new GoogleAuthProvider();

export {
  app,
  analytics,
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  googleProvider,
  signInWithPopup,
};


