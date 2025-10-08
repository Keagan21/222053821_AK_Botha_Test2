// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";;
import { getAuth } from "firebase/auth";
import { getFireStore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP2QhkLpnaTy4gB1t3N1VfrXrcedgzAAc",
  authDomain: "test-2-6e3a9.firebaseapp.com",
  projectId: "test-2-6e3a9",
  storageBucket: "test-2-6e3a9.firebasestorage.app",
  messagingSenderId: "565568908771",
  appId: "1:565568908771:web:cd36ea548561ab7f90c4d6",
  measurementId: "G-LPZXQ5QQQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFireStore(app);
export default app;