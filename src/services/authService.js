import { auth, firestore } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Real Firebase Authentication Service
 */

/**
 * Logs in a user using Firebase Authentication and verifies their role in Firestore.
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @param {boolean} remember - Whether to remember the session
 * @returns {Promise<Object>} - User data if successful
 */
export const login = async (email, password, remember = false) => {
  try {
    // Set persistence based on the 'remember' checkbox
    const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);

    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user details from Firestore to verify their role
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // User exists in Auth but not in Firestore Database
      await firebaseSignOut(auth);
      throw new Error("User record not found in the database. Please contact support.");
    }

    const userData = userDocSnap.data();

    // Verify role (Deny access to students)
    const allowedRoles = ['librarian', 'admin', 'super_admin'];
    if (!allowedRoles.includes(userData.role)) {
      await firebaseSignOut(auth);
      throw new Error("Unauthorized access. This portal is strictly for library staff and administrators.");
    }

    // Verify account status (Block inactive/suspended/banned)
    if (userData.account_status && userData.account_status !== 'active') {
      await firebaseSignOut(auth);
      throw new Error(`Your account is currently ${userData.account_status}. Please contact the administrator.`);
    }

    console.log('[AuthService] Successfully logged in:', userData.name);

    return {
      success: true,
      message: 'Login successful.',
      user: {
        uid: user.uid,
        email: user.email,
        role: userData.role,
        name: userData.name,
        profile_image: userData.profile_image || null
      }
    };
  } catch (error) {
    console.error('[AuthService] Login Error:', error);
    
    // Map Firebase error codes to user-friendly messages
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
    } else if (error.message) {
      errorMessage = error.message; // Use custom errors thrown above
    }

    throw new Error(errorMessage);
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<Object>}
 */
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('[AuthService] Logout Error:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Sends a password reset email using Firebase.
 * @param {string} email
 * @returns {Promise<Object>}
 */
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset link sent to your email.' };
  } catch (error) {
    console.error('[AuthService] Forgot Password Error:', error);
    throw new Error('Failed to send reset link. Please verify your email address.');
  }
};

/**
 * Registers a new Super Admin account.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<Object>}
 */
export const registerSuperAdmin = async (email, password, fullName) => {
  try {
    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Create the user document in Firestore users collection
    await setDoc(doc(firestore, 'users', user.uid), {
      name: fullName,
      email: email,
      role: 'super_admin',
      account_status: 'active',
      created_at: serverTimestamp(),
      availability_status: 'available',
      is_online: true
    });

    console.log('[AuthService] Super Admin registered successfully:', fullName);
    return { success: true, message: 'Super Admin account created successfully.' };
  } catch (error) {
    console.error('[AuthService] Registration Error:', error);
    let errorMessage = "Registration failed. Please try again.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already registered.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please provide a valid email address.";
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = "Email/Password sign-in is NOT enabled in your Firebase Console! Please enable it under Authentication -> Sign-in method.";
    } else {
      errorMessage = `Firebase Error: ${error.message} (${error.code})`;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Subscribes to Firebase Authentication state changes.
 * Restores user data from Firestore if a persisted session is found.
 * @param {function} callback - Function called with user object or null
 * @returns {function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          callback({
            uid: user.uid,
            email: user.email,
            role: userData.role,
            name: userData.name,
            profile_image: userData.profile_image || null
          });
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('[AuthService] Error fetching user data on auth change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
