import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI2gpdtvavTuwsBtP1gvnzzIM1BtTmYyM",
  authDomain: "trend-sense-capital.firebaseapp.com",
  projectId: "trend-sense-capital",
  storageBucket: "trend-sense-capital.firebasestorage.app",
  messagingSenderId: "949609644843",
  appId: "1:949609644843:web:ec948948cf52a85dd67b6e",
  measurementId: "G-11NFYG6B73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Stock data functions
const getStocks = async () => {
  const stocksCollection = collection(db, "stocks");
  const stocksSnapshot = await getDocs(stocksCollection);
  return stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getStockById = async (id: string) => {
  const stockDoc = doc(db, "stocks", id);
  const stockSnapshot = await getDoc(stockDoc);
  return stockSnapshot.exists() ? { id: stockSnapshot.id, ...stockSnapshot.data() } : null;
};

const addStock = async (stockData: any) => {
  const stocksCollection = collection(db, "stocks");
  return await addDoc(stocksCollection, stockData);
};

const updateStock = async (id: string, stockData: any) => {
  const stockDoc = doc(db, "stocks", id);
  return await updateDoc(stockDoc, stockData);
};

const deleteStock = async (id: string) => {
  const stockDoc = doc(db, "stocks", id);
  return await deleteDoc(stockDoc);
};

// User management functions
const getUsers = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getUserById = async (id: string) => {
  const userDoc = doc(db, "users", id);
  const userSnapshot = await getDoc(userDoc);
  return userSnapshot.exists() ? { id: userSnapshot.id, ...userSnapshot.data() } : null;
};

const updateUser = async (id: string, userData: any) => {
  const userDoc = doc(db, "users", id);
  return await updateDoc(userDoc, userData);
};

const deleteUser = async (id: string) => {
  const userDoc = doc(db, "users", id);
  return await deleteDoc(userDoc);
};

// Deactivation request functions
const getDeactivationRequests = async () => {
  const requestsCollection = collection(db, "deactivationRequests");
  const requestsSnapshot = await getDocs(requestsCollection);
  return requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteDeactivationRequest = async (id: string) => {
  const requestDoc = doc(db, "deactivationRequests", id);
  return await deleteDoc(requestDoc);
};

// Password reset request functions
const getResetRequests = async () => {
  const requestsCollection = collection(db, "resetRequests");
  const requestsSnapshot = await getDocs(requestsCollection);
  return requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteResetRequest = async (id: string) => {
  const requestDoc = doc(db, "resetRequests", id);
  return await deleteDoc(requestDoc);
};

export { 
  app,
  auth,
  db,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  getStocks,
  getStockById,
  addStock,
  updateStock,
  deleteStock,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDeactivationRequests,
  deleteDeactivationRequest,
  getResetRequests,
  deleteResetRequest
}; 