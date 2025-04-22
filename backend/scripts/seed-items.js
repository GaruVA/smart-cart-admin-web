// Load environment variables
require('dotenv').config({ path: '../.env' });

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK with service account
try {
  const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file not found at:', serviceAccountPath);
    process.exit(1);
  }
  
  const serviceAccount = require(serviceAccountPath);
  
  // Initialize only if Firebase is not already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// Mock items data with realistic EAN-13 barcodes
const mockItems = [
  // Existing items
  {
    id: "5901234123457", // EAN-13 barcode for Organic Bananas
    name: "Organic Bananas",
    category: "Fruits",
    price: 1.99,
    stockQuantity: 8, // Reduced to create low stock item
    description: "Bunch of organic bananas, approximately 5-7 bananas per bunch.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)), // March 1, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15)) // April 15, 2025
  },
  {
    id: "4003994155486", // EAN-13 barcode for Whole Milk
    name: "Whole Milk",
    category: "Dairy",
    price: 3.49,
    stockQuantity: 75,
    description: "Fresh whole milk, 1 gallon.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "7622210100146", // EAN-13 barcode for Wheat Bread
    name: "Wheat Bread",
    category: "Bakery",
    price: 4.99,
    stockQuantity: 12, // Reduced to create low stock item
    description: "Freshly baked wheat bread, 20 oz loaf.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "0796030176614", // EAN-13 barcode for Premium Ground Beef
    name: "Premium Ground Beef",
    category: "Meat",
    price: 6.99,
    stockQuantity: 35,
    description: "Premium ground beef, 85% lean, 1 lb package.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "4033800226004", // EAN-13 barcode for Gala Apples
    name: "Gala Apples",
    category: "Fruits",
    price: 2.49,
    stockQuantity: 120,
    description: "Fresh Gala apples, sold individually.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "0041331092609", // EAN-13 barcode for Eggs
    name: "Eggs",
    category: "Dairy",
    price: 3.99,
    stockQuantity: 60,
    description: "Large Grade A eggs, dozen.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "0023700043171", // EAN-13 barcode for Chicken Breast
    name: "Chicken Breast",
    category: "Meat",
    price: 5.49,
    stockQuantity: 45,
    description: "Boneless, skinless chicken breast, 1 lb package.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  {
    id: "0074682501756", // EAN-13 barcode for Atlantic Salmon
    name: "Atlantic Salmon",
    category: "Seafood",
    price: 8.99,
    stockQuantity: 25,
    description: "Fresh Atlantic salmon fillet, 1 lb.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 15))
  },
  // Additional items with some having low stock
  {
    id: "0011110000123", 
    name: "Bell Peppers",
    category: "Vegetables",
    price: 1.29,
    stockQuantity: 42,
    description: "Fresh bell peppers, assorted colors.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000124", 
    name: "Carrots",
    category: "Vegetables",
    price: 0.99,
    stockQuantity: 85,
    description: "Organic carrots, 1 lb bag.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000125", 
    name: "Potatoes",
    category: "Vegetables",
    price: 3.49,
    stockQuantity: 10, // Low stock
    description: "Russet potatoes, 5 lb bag.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000126", 
    name: "Greek Yogurt",
    category: "Dairy",
    price: 4.99,
    stockQuantity: 38,
    description: "Plain Greek yogurt, 32 oz.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000127", 
    name: "Cheddar Cheese",
    category: "Dairy",
    price: 3.29,
    stockQuantity: 27,
    description: "Sharp cheddar cheese, 8 oz block.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000128", 
    name: "White Rice",
    category: "Grains",
    price: 2.99,
    stockQuantity: 65,
    description: "Long grain white rice, 2 lb bag.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000129", 
    name: "Pasta",
    category: "Grains",
    price: 1.49,
    stockQuantity: 9, // Low stock
    description: "Spaghetti pasta, 16 oz box.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000130", 
    name: "Cereal",
    category: "Breakfast",
    price: 3.99,
    stockQuantity: 32,
    description: "Corn flakes cereal, 18 oz box.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000131", 
    name: "Orange Juice",
    category: "Beverages",
    price: 4.29,
    stockQuantity: 26, // Just below threshold
    description: "100% pure orange juice, 64 oz.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000132", 
    name: "Coffee",
    category: "Beverages",
    price: 7.99,
    stockQuantity: 40,
    description: "Medium roast coffee beans, 12 oz bag.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000133", 
    name: "Toilet Paper",
    category: "Household",
    price: 5.99,
    stockQuantity: 50,
    description: "12 double rolls.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  },
  {
    id: "0011110000134", 
    name: "Paper Towels",
    category: "Household",
    price: 4.99,
    stockQuantity: 5, // Very low stock
    description: "6 mega rolls.",
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16))
  }
];

// Function to add mock data to Firestore
async function seedDatabase() {
  try {
    console.log('Starting to seed Firestore with mock item data...');
    
    // Create a batch to write all documents at once
    const batch = db.batch();
    
    // Add each mock item to the batch with specific ID
    mockItems.forEach((item) => {
      // Use the specified ID from the item object
      const itemRef = db.collection('items').doc(item.id);
      batch.set(itemRef, item);
      console.log(`Added item to batch with ID: ${item.id}`);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('Successfully added mock item data to Firestore!');
    console.log(`Total items added: ${mockItems.length}`);
    
    // Success, exit with code 0
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Error, exit with code 1
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();