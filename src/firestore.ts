// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAH7P3-dqAvf3D15TD0DyZESyBtxoHeYds",
    authDomain: "jukkis-ecom.firebaseapp.com",
    projectId: "jukkis-ecom",
    storageBucket: "jukkis-ecom.firebasestorage.app",
    messagingSenderId: "954499027294",
    appId: "1:954499027294:web:93146e99f56c4aa3893fcf",
    measurementId: "G-JBN2RF7Z38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };