import { getAuth, signInWithEmailAndPassword, signInAnonymously, signOut, sendPasswordResetEmail, onAuthStateChanged, User } from 'firebase/auth';
import app from './firebase';

export const auth = getAuth(app);

// Traveler Login (Email + PIN as password)
export const loginTraveler = async (email: string, pin: string) => {
  return signInWithEmailAndPassword(auth, email, pin);
};

// Guest Login (Anonymous)
export const loginGuest = async () => {
  return signInAnonymously(auth);
};

// Forgot PIN
export const resetPin = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
  return signOut(auth);
};

// Listener
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
