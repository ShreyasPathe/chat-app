// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

const firebaseConfig = {
  // ADD YOU FIREBASE CREDENTIALS HERE
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      username,
      email,
      photoURL: null,
      connections: [],
      connectionRequests: [],
      online: true,
      lastSeen: new Date().toISOString()
    });

    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    toast.error(error.message);
    return { success: false, error };
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user's online status
    await updateDoc(doc(db, 'users', user.uid), {
      online: true,
      lastSeen: new Date().toISOString()
    });

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.message);
    return { success: false, error };
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Reset error:', error);
    throw error;
  }
};

export const handleConnectionRequest = async (currentUserId, targetUserId, action) => {
  try {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    if (action === 'accept') {
      // Add to connections array for both users
      await updateDoc(currentUserRef, {
        connections: arrayUnion(targetUserId),
        connectionRequests: arrayRemove({ from: targetUserId })
      });

      await updateDoc(targetUserRef, {
        connections: arrayUnion(currentUserId)
      });

      toast.success('Connection request accepted!');
    } else if (action === 'reject') {
      // Remove from connection requests
      await updateDoc(currentUserRef, {
        connectionRequests: arrayRemove({ from: targetUserId })
      });

      toast.success('Connection request rejected');
    }
  } catch (error) {
    console.error('Connection request error:', error);
    toast.error('Failed to process connection request');
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      online: status,
      lastSeen: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status update error:', error);
  }
};

export { signup, login, resetPassword }
