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

// Function to generate a random time between given hours
function randomTimeBetween(startHour, endHour) {
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  return { hour, minute };
}

// Function to create a timestamp for a specific date with random time in given range
function createTimestamp(date, startHour, endHour) {
  const { hour, minute } = randomTimeBetween(startHour, endHour);
  const newDate = new Date(date);
  newDate.setHours(hour, minute);
  return admin.firestore.Timestamp.fromDate(newDate);
}

// Function to generate mock sessions for a specific date
function generateSessionsForDate(date, cartIds) {
  // Create between 1-3 sessions per day
  const numSessions = Math.floor(Math.random() * 3) + 1;
  const sessions = [];
  
  for (let i = 0; i < numSessions; i++) {
    let sessionType;
    // Distribute session types roughly: 60% completed, 25% active, 15% abandoned
    const rand = Math.random();
    if (rand < 0.6) {
      sessionType = 'completed';
    } else if (rand < 0.85) {
      sessionType = 'abandoned';
    } else {
      sessionType = 'active';
    }
    
    // Set different time ranges based on session time
    let startTime, endTime;
    if (i === 0) {
      // Morning session
      startTime = createTimestamp(date, 8, 11);
    } else if (i === 1) {
      // Afternoon session
      startTime = createTimestamp(date, 12, 16);
    } else {
      // Evening session
      startTime = createTimestamp(date, 17, 20);
    }
    
    // For completed sessions, create end time 20-40 minutes after start
    if (sessionType === 'completed') {
      const startDate = startTime.toDate();
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + Math.floor(Math.random() * 21) + 20); // 20-40 minutes
      endTime = admin.firestore.Timestamp.fromDate(endDate);
    } else {
      endTime = null;
    }

    // Create random basket of items (1-6 items)
    const numItems = Math.floor(Math.random() * 6) + 1;
    const itemPool = [
      { itemId: '5901234123457', unitPrice: 1.99 }, // Organic Bananas
      { itemId: '4003994155486', unitPrice: 3.49 }, // Whole Milk
      { itemId: '7622210100146', unitPrice: 4.99 }, // Wheat Bread
      { itemId: '0796030176614', unitPrice: 6.99 }, // Premium Ground Beef
      { itemId: '4033800226004', unitPrice: 2.49 }, // Gala Apples
      { itemId: '0041331092609', unitPrice: 3.99 }, // Eggs
      { itemId: '0023700043171', unitPrice: 5.49 }, // Chicken Breast
      { itemId: '0074682501756', unitPrice: 8.99 }, // Atlantic Salmon
      { itemId: '0011110000123', unitPrice: 1.29 }, // Bell Peppers
      { itemId: '0011110000124', unitPrice: 0.99 }, // Carrots
      { itemId: '0011110000125', unitPrice: 3.49 }, // Potatoes
      { itemId: '0011110000126', unitPrice: 4.99 }, // Greek Yogurt
      { itemId: '0011110000127', unitPrice: 3.29 }, // Cheddar Cheese
      { itemId: '0011110000128', unitPrice: 2.99 }, // White Rice
      { itemId: '0011110000129', unitPrice: 1.49 }, // Pasta
      { itemId: '0011110000130', unitPrice: 3.99 }, // Cereal
      { itemId: '0011110000131', unitPrice: 4.29 }, // Orange Juice
      { itemId: '0011110000132', unitPrice: 7.99 }, // Coffee
      { itemId: '0011110000133', unitPrice: 5.99 }, // Toilet Paper
      { itemId: '0011110000134', unitPrice: 4.99 }  // Paper Towels
    ];

    // Select random items
    const items = [];
    let totalCost = 0;
    
    // Shuffle the item pool and pick the first numItems
    const shuffled = [...itemPool].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numItems; j++) {
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 of each item
      const { itemId, unitPrice } = shuffled[j];
      const itemCost = quantity * unitPrice;
      totalCost += itemCost;
      
      items.push({
        itemId,
        quantity,
        unitPrice
      });
    }
    
    // Round total cost to 2 decimal places
    totalCost = Math.round(totalCost * 100) / 100;
    
    // Create the session
    const session = {
      items,
      totalCost,
      cartId: cartIds[Math.floor(Math.random() * cartIds.length)],
      startedAt: startTime,
      endedAt: endTime,
      status: sessionType
    };
    
    sessions.push(session);
  }
  
  return sessions;
}

// Function to add mock data to Firestore
async function seedDatabase() {
  try {
    console.log('Starting to seed Firestore with mock shopping session data...');
    
    // Get existing cart IDs to use as references
    const cartIds = await getCartIds();
    console.log(`Found ${cartIds.length} carts to reference in sessions`);
    
    if (cartIds.length === 0) {
      console.error('No carts found in the database. Please run seed-carts.js first.');
      process.exit(1);
    }
    
    // Generate sessions for the past week (April 15-22, 2025)
    const mockSessions = [];
    const today = new Date(2025, 3, 22); // April 22, 2025
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const sessionsForDate = generateSessionsForDate(date, cartIds);
      mockSessions.push(...sessionsForDate);
    }
    
    console.log(`Generated ${mockSessions.length} mock sessions across 8 days`);
    
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