// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "chapterone-e823e.firebaseapp.com",
  projectId: "chapterone-e823e",
  storageBucket: "chapterone-e823e.firebasestorage.app",
  messagingSenderId: "1094212453203",
  appId: "1:1094212453203:web:b67241dc23f3f0f089d7a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth,provider}
