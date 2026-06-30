import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYGpq7jtEhnYIfQw1xqcEEu0NfkQuceCU",
  authDomain: "my-central-auth.firebaseapp.com",
  projectId: "my-central-auth",
  storageBucket: "my-central-auth.firebasestorage.app",
  messagingSenderId: "623323853491",
  appId: "1:623323853491:web:ab61e37cfc7193d17476c6",
  measurementId: "G-3GT0ESLCX9"
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);