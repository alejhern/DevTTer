import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPNG8D9e6f6NUcY6xQVpUSQoU_d7iZTsE",
  authDomain: "devtter-c169a.firebaseapp.com",
  projectId: "devtter-c169a",
  storageBucket: "devtter-c169a.firebasestorage.app",
  messagingSenderId: "377164209549",
  appId: "1:377164209549:web:fed53a9d16e3e3de0871c4",
  measurementId: "G-SC0J347VHM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
