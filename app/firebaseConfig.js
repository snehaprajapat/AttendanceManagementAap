import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDO7mO-jeX5rvV98MjTtiwa0e63jhLu65M",
    authDomain: "mobileapplication-7da92.firebaseapp.com",
    projectId: "mobileapplication-7da92",
    storageBucket: "mobileapplication-7da92.firebasestorage.app",
    messagingSenderId: "409202337853",
    appId: "1:409202337853:web:83b50c79a2582c31876254",
    measurementId: "G-Z6BSRCRVBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance with faster timeout
const auth = getAuth();
auth.settings.appVerificationDisabledForTesting = true;

// Get Firestore instance with performance settings
const db = getFirestore();

export { auth, db };