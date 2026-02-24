// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3BHGXmCOsa4W2WbIyUMISmJdnEye8BiM",
  authDomain: "software-encyclopedia-da17e.firebaseapp.com",
  projectId: "software-encyclopedia-da17e",
  storageBucket: "software-encyclopedia-da17e.firebasestorage.app",
  messagingSenderId: "872204374926",
  appId: "1:872204374926:web:0c524624c2247484968adf",
  measurementId: "G-WJ0DX0VRJ9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional (safe to keep)
export const analytics = getAnalytics(app);
