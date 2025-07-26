// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEkGjL42tX9dareCmmmZbO_J-QjtggDhw",
  authDomain: "pathconnect-435e9.firebaseapp.com",
  projectId: "pathconnect-435e9",
  storageBucket: "pathconnect-435e9.firebasestorage.app",
  messagingSenderId: "686805370083",
  appId: "1:686805370083:web:7df76bcaecccbb3dfcb1d6",
  measurementId: "G-D2LE734CWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };