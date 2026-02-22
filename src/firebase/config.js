import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCjsEtpgpBm6aZAr2G8ndIriKe5ykOCwgo",
    authDomain: "speedo-17db9.firebaseapp.com",
    projectId: "speedo-17db9",
    storageBucket: "speedo-17db9.firebasestorage.app",
    messagingSenderId: "897273805103",
    appId: "1:897273805103:web:b5b7c2ab964feb3f5d89da"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);