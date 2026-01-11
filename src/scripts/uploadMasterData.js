import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const db = getFirestore(app);

const uploadMasterData = async () => {
  try {
    // Read the JSON file
    const filePath = path.join(__dirname, '..', 'data', 'masterStockData.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const stocks = JSON.parse(jsonData);

    // Upload each stock to Firestore
    const stocksCollection = collection(db, "stocks");
    for (const stock of stocks) {
      await addDoc(stocksCollection, stock);
      console.log(`Added ${stock.ticker} to database`);
    }
    console.log('All stocks uploaded successfully');
  } catch (error) {
    console.error('Error uploading stocks:', error);
  } finally {
    process.exit(0);
  }
};

uploadMasterData(); 