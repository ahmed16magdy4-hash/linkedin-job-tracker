// Firebase configuration and initialization
// Design: Modern Professional Analytics - Firebase integration for job tracking

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration for job-tracker-1e476 project
const firebaseConfig = {
  apiKey: "AIzaSyDWvN2SHvvJUg0QyvRe5soR6BRgLQElxA4",
  authDomain: "job-tracker-1e476.firebaseapp.com",
  projectId: "job-tracker-1e476",
  storageBucket: "job-tracker-1e476.appspot.com",
  messagingSenderId: "82752992155",
  appId: "1:82752992155:web:02fdd4e37047dcf1f7005f",
  measurementId: "G-BEKG29BJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connect to emulator if in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (e) {
    // Emulator already connected or not running
  }
}

export default app;
