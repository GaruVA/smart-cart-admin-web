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

// Function to get all cart IDs from Firestore
async function getCartIds() {
  try {
    const cartsSnapshot = await db.collection('carts').get();
    return cartsSnapshot.docs.map(doc => doc.data().cartId);
  } catch (error) {
    console.error('Error fetching cart IDs:', error);
    return [];
  }
}

// Mock shopping sessions data template (cartIds will be filled in dynamically)
const createMockSessions = (cartIds) => {
  // Make sure we have at least one cartId to work with
  if (!cartIds.length) {
    console.error('No carts found in the database. Please run seed-carts.js first.');
    process.exit(1);
  }
  
  // Function to get a random cart ID from our list
  const getRandomCartId = () => cartIds[Math.floor(Math.random() * cartIds.length)];
  
  return [
    {
      items: [
        { itemId: '5901234123457', quantity: 2, unitPrice: 1.99 }, // Organic Bananas
        { itemId: '4003994155486', quantity: 1, unitPrice: 3.49 }  // Whole Milk
      ],
      totalCost: 7.47,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 19, 9, 30)), // April 19, 2025, 9:30 AM
      endedAt: null,
      status: 'active'
    },
    {
      items: [
        { itemId: '7622210100146', quantity: 1, unitPrice: 4.99 },  // Wheat Bread
        { itemId: '0041331092609', quantity: 2, unitPrice: 3.99 },  // Eggs
        { itemId: '0023700043171', quantity: 1, unitPrice: 5.49 }   // Chicken Breast
      ],
      totalCost: 18.46,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 18, 15, 15)), // April 18, 2025, 3:15 PM
      endedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 18, 15, 40)),   // April 18, 2025, 3:40 PM
      status: 'completed'
    },
    {
      items: [
        { itemId: '5901234123457', quantity: 1, unitPrice: 1.99 },  // Organic Bananas
        { itemId: '0041331092609', quantity: 1, unitPrice: 3.99 }   // Eggs
      ],
      totalCost: 5.98,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 18, 11, 20)), // April 18, 2025, 11:20 AM
      endedAt: null,
      status: 'abandoned'
    },
    {
      items: [
        { itemId: '0796030176614', quantity: 2, unitPrice: 6.99 },   // Premium Ground Beef
        { itemId: '0074682501756', quantity: 1, unitPrice: 8.99 },   // Atlantic Salmon
        { itemId: '4003994155486', quantity: 1, unitPrice: 3.49 }    // Whole Milk
      ],
      totalCost: 26.46,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 17, 14, 10)), // April 17, 2025, 2:10 PM
      endedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 17, 14, 35)),   // April 17, 2025, 2:35 PM
      status: 'completed'
    },
    {
      items: [
        { itemId: '4033800226004', quantity: 4, unitPrice: 2.49 },  // Gala Apples
        { itemId: '7622210100146', quantity: 1, unitPrice: 4.99 }   // Wheat Bread
      ],
      totalCost: 14.95,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 19, 10, 15)), // April 19, 2025, 10:15 AM
      endedAt: null,
      status: 'active'
    },
    {
      items: [
        { itemId: '0023700043171', quantity: 2, unitPrice: 5.49 },   // Chicken Breast
        { itemId: '0074682501756', quantity: 1, unitPrice: 8.99 }    // Atlantic Salmon
      ],
      totalCost: 19.97,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16, 16, 45)), // April 16, 2025, 4:45 PM
      endedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 16, 17, 10)),   // April 16, 2025, 5:10 PM
      status: 'completed'
    },
    {
      items: [
        { itemId: '7622210100146', quantity: 1, unitPrice: 4.99 },  // Wheat Bread
        { itemId: '4003994155486', quantity: 1, unitPrice: 3.49 }   // Whole Milk
      ],
      totalCost: 8.48,
      cartId: getRandomCartId(),
      startedAt: admin.firestore.Timestamp.fromDate(new Date(2025, 3, 18, 8, 20)), // April 18, 2025, 8:20 AM
      endedAt: null,
      status: 'abandoned'
    }
  ];
};

// Function to add mock data to Firestore
async function seedDatabase() {
  try {
    console.log('Starting to seed Firestore with mock shopping session data...');
    
    // Get existing cart IDs to use as references
    const cartIds = await getCartIds();
    console.log(`Found ${cartIds.length} carts to reference in sessions`);
    
    // Generate mock sessions with real cart references
    const mockSessions = createMockSessions(cartIds);
    
    // Create a batch to write all documents at once
    const batch = db.batch();
    
    // Add each mock session to the batch with auto-generated ID
    mockSessions.forEach((session) => {
      // Create a reference with auto-generated ID
      const sessionRef = db.collection('sessions').doc();
      
      // Add sessionId field with the auto-generated ID
      const sessionWithId = {
        ...session,
        sessionId: sessionRef.id
      };
      
      batch.set(sessionRef, sessionWithId);
      console.log(`Added shopping session to batch with auto-generated ID: ${sessionRef.id}`);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('Successfully added mock shopping session data to Firestore!');
    console.log(`Total shopping sessions added: ${mockSessions.length}`);
    
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