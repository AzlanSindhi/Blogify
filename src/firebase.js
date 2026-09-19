import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnH27a7VzWP2XHelkKE3eszsnEGbF7z9g",
  authDomain: "blogify-cef1a.firebaseapp.com",
  projectId: "blogify-cef1a",
  storageBucket: "blogify-cef1a.firebasestorage.app",
  messagingSenderId: "404920369668",
  appId: "1:404920369668:web:d0e01175f5f75c5787ab51",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;