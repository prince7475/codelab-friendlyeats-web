import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from "@/src/lib/firebase/clientApp";
import { db } from "@/src/lib/firebase/clientApp";

/**
 * Listens to authentication state changes
 * @param {Function} cb - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

/**
 * Creates or updates user profile in Firestore
 * @param {Object} user - Firebase user object
 * @returns {Promise} Promise that resolves when profile is saved
 */
async function saveUserProfile(user) {
  console.log('saveUserProfile', user);
  if (!user) return null;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: new Date().toISOString(),
    };

    // If user doesn't exist, create new profile
    if (!userSnap.exists()) {
      userData.createdAt = new Date().toISOString();
      userData.itemCount = 0; // Track number of wardrobe items
    }

    await setDoc(userRef, userData, { merge: true });
    return userData;
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Return basic user data even if saving to Firestore fails
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
}

/**
 * Signs in user with Google
 * @returns {Promise<Object>} Promise that resolves with user data
 * @throws {Error} If sign in fails
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const userData = await saveUserProfile(result.user);
    return userData || result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up blocked by browser');
    } else if (error.code === 'permission-denied') {
      // If Firestore permission is denied, still return the user
      return error.user;
    } else {
      throw new Error('Failed to sign in with Google');
    }
  }
}

/**
 * Signs out the current user
 * @returns {Promise<void>}
 * @throws {Error} If sign out fails
 */
export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error('Failed to sign out');
  }
}