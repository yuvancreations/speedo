import { auth } from "./config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { createUserProfile } from "./firestore";

// ==========================================
// Email & Password Authentication
// ==========================================

// Sign Up new user and save profile to Firestore
export const signUpUser = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore database
        await createUserProfile(user.uid, {
            email: user.email,
            role: "user", // default role
            createdAt: new Date(),
            ...userData // Any extra data like name, phone, etc.
        });

        return user;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

// Log In existing user
export const logInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Log Out
export const logOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};


// ==========================================
// Phone Number (OTP) Authentication
// ==========================================

// 1. Initialize Recaptcha (Required for phone auth)
export const setupRecaptcha = (buttonId) => {
    // Clear any existing recaptcha instance to avoid "already rendered" error
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved
        }
    });
    return window.recaptchaVerifier;
};

// 2. Send OTP to Phone Number
// Format should be "+919876543210" for India
export const sendOTP = async (phoneNumber) => {
    try {
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult; // Save it to global window object
        return confirmationResult;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

// 3. Verify OTP entered by User
export const verifyOTP = async (otp) => {
    try {
        const confirmationResult = window.confirmationResult;
        const result = await confirmationResult.confirm(otp);
        return result.user;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};
