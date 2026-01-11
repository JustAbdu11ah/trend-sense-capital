const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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

const stockData = [
  {
    name: "Apple Inc.",
    ticker: "AAPL",
    currentPrice: 178.42,
    change: 1.25,
    sentiment: "Positive",
    sentimentScore: 0.62,
    sentimentSource: "Reddit",
    prediction: {
      action: "Buy",
      confidence: 0.78,
      reasoning: "Strong positive sentiment and upcoming product releases"
    }
  },
  {
    name: "Microsoft Corporation",
    ticker: "MSFT",
    currentPrice: 328.79,
    change: 2.84,
    sentiment: "Positive",
    sentimentScore: 0.75,
    sentimentSource: "Reddit",
    prediction: {
      action: "Buy",
      confidence: 0.85,
      reasoning: "Consistent positive sentiment and cloud services growth"
    }
  },
  {
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    currentPrice: 142.56,
    change: -0.85,
    sentiment: "Neutral",
    sentimentScore: 0.08,
    sentimentSource: "Reddit",
    prediction: {
      action: "Hold",
      confidence: 0.62,
      reasoning: "Mixed sentiment with potential regulatory headwinds"
    }
  }
];

const seedStocks = async () => {
  try {
    const stocksCollection = collection(db, "stocks");
    for (const stock of stockData) {
      await addDoc(stocksCollection, stock);
      console.log(`Added ${stock.ticker} to database`);
    }
    console.log('Stock seeding completed successfully');
  } catch (error) {
    console.error('Error seeding stocks:', error);
  } finally {
    process.exit(0);
  }
};

seedStocks(); 