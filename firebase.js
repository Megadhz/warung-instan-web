// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBToYSPucb6iTYkNlHDYpaFm97MTqFZigI",
  authDomain: "warung-instan.firebaseapp.com",
  projectId: "warung-instan",
  storageBucket: "warung-instan.firebasestorage.app",
  messagingSenderId: "258935327726",
  appId: "1:258935327726:web:72d6abc0603c3b04275cff"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Init Firestore (Database)
export const db = getFirestore(app);
