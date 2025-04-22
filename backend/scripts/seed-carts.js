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

// Mock cart device data (physical smart cart devices)
const mockCarts = [
  // Original carts
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 0, 15)),  // Jan 15, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 8, 45))  // Apr 21, 2025, 8:45 AM
  },
  {
    status: 'offline',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 0, 15)),  // Jan 15, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 18, 16, 22))  // Apr 18, 2025, 4:22 PM
  },
  {
    status: 'maintenance',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 1, 20)),  // Feb 20, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 17, 11, 30))  // Apr 17, 2025, 11:30 AM
  },
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 5)),  // Mar 5, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 9, 12))  // Apr 21, 2025, 9:12 AM
  },
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),  // Mar 10, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 10, 5))  // Apr 21, 2025, 10:05 AM
  },
  // Additional carts
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),  // Mar 1, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 11, 30))  // Apr 21, 2025, 11:30 AM
  },
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 1)),  // Mar 1, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 14, 15))  // Apr 21, 2025, 2:15 PM
  },
  {
    status: 'offline',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 5)),  // Mar 5, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 20, 17, 40))  // Apr 20, 2025, 5:40 PM
  },
  {
    status: 'maintenance',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 10)),  // Mar 10, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 19, 13, 25))  // Apr 19, 2025, 1:25 PM
  },
  {
    status: 'online',
    createdAt: admin.firestore.Timestamp.fromDate(new Date(2025, 2, 15)),  // Mar 15, 2025
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 21, 15, 50))  // Apr 21, 2025, 3:50 PM
  }
];

// Function to add mock data to Firestore
async function seedDatabase() {
  try {
    console.log('Starting to seed Firestore with mock cart device data...');
    
    // Create a batch to write all documents at once
    const batch = db.batch();
    
    // Add each mock cart to the batch with auto-generated ID
    mockCarts.forEach((cart) => {
      // Create a reference with auto-generated ID
      const cartRef = db.collection('carts').doc();
      
      // Add cartId field with the auto-generated ID
      const cartWithId = {
        ...cart,
        cartId: cartRef.id
      };
      
      batch.set(cartRef, cartWithId);
      console.log(`Added cart device to batch with auto-generated ID: ${cartRef.id}`);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('Successfully added mock cart device data to Firestore!');
    console.log(`Total cart devices added: ${mockCarts.length}`);
    
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