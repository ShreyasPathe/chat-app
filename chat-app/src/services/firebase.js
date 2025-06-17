import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth functions
export const signIn = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUp = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const onAuthChange = (callback) => 
  onAuthStateChanged(auth, callback);

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// User functions
export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, userData);
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData);
};

// Friend functions
export const sendFriendRequest = async (fromUserId, toUserId) => {
  const requestRef = await addDoc(collection(db, 'friendRequests'), {
    from: fromUserId,
    to: toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  return requestRef.id;
};

export const acceptFriendRequest = async (requestId) => {
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, { status: 'accepted' });
};

export const getFriends = async (userId) => {
  const requestsRef = collection(db, 'friendRequests');
  const q = query(
    requestsRef,
    where('status', '==', 'accepted'),
    where('participants', 'array-contains', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Chat functions
export const createChat = async (participants, type = 'private') => {
  const chatRef = await addDoc(collection(db, 'chats'), {
    type,
    participants,
    createdAt: new Date().toISOString(),
    lastMessage: null
  });
  return chatRef.id;
};

export const sendMessage = async (chatId, message) => {
  const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
    ...message,
    createdAt: new Date().toISOString()
  });
  return messageRef.id;
};

export const getUserChats = async (userId) => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Group functions
export const createGroup = async (groupData) => {
  const groupRef = doc(collection(db, 'groups'));
  await setDoc(groupRef, {
    ...groupData,
    createdAt: serverTimestamp(),
    members: groupData.members,
    admins: [groupData.createdBy]
  });
  return groupRef.id;
};

// File upload
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Presence system
export const updateUserPresence = async (userId, status) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    onlineStatus: status,
    lastSeen: serverTimestamp()
  });
};

// Typing indicator
export const updateTypingStatus = async (conversationId, userId, isTyping) => {
  const typingRef = doc(db, `conversations/${conversationId}/typing`, userId);
  await setDoc(typingRef, {
    isTyping,
    updatedAt: serverTimestamp()
  });
};

export { auth, db, storage }; 