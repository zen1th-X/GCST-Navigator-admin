import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration using the provided Realtime Database URL
const firebaseConfig = {
  apiKey: "AIzaSyA0hAEFklO2RAC7Ctk-MdasBHMnw-ifFr8",
  authDomain: "granbylibrarymanagement.firebaseapp.com",
  databaseURL: "https://granbylibrarymanagement-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "granbylibrarymanagement",
  storageBucket: "granbylibrarymanagement.firebasestorage.app",
  messagingSenderId: "256418801910",
  appId: "1:256418801910:web:fd23f3de4b976ffb4ee4d7",
  measurementId: "G-Z2QCGG61GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Cloud Firestore
export const firestore = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
