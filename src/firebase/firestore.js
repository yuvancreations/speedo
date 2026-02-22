import { db } from "./config";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

// Users
export const createUserProfile = async (uid, data) => {
    await setDoc(doc(db, "users", uid), data);
};

export const getUserProfile = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Bookings
export const createBooking = async (bookingData) => {
    const newBookingRef = doc(collection(db, "bookings"));
    await setDoc(newBookingRef, { ...bookingData, bookingId: newBookingRef.id });
    return newBookingRef.id;
};

export const getUserBookings = async (userId) => {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};

export const getAllBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    return querySnapshot.docs.map(doc => doc.data());
};

export const updateBookingStatus = async (bookingId, status) => {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status });
};

export const deleteBookingRecord = async (bookingId) => {
    const bookingRef = doc(db, "bookings", bookingId);
    await deleteDoc(bookingRef);
};
