// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD4cAIdVp-JE-4bgoaAFcmXCc0ElQ9mHY",
  authDomain: "ctrlyou-de90f.firebaseapp.com",
  projectId: "ctrlyou-de90f",
  storageBucket: "ctrlyou-de90f.firebasestorage.app",
  messagingSenderId: "845152670415",
  appId: "1:845152670415:web:bc44cf661ab1f98bb71dba",
  measurementId: "G-W98WVJZNLQ"
};

// Initialize Firebase (check if already initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics (optional, only in browser)


export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
