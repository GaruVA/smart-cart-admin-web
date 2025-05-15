// Load environment variables
require('dotenv').config({ path: '../.env' });

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Seed script to populate the cart logs collection with mock data
 */

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
    // Extract the document IDs directly, as they are the cartIds we need
    const ids = cartsSnapshot.docs.map(doc => doc.id);
    console.log(`Found ${ids.length} cart IDs: ${ids.join(', ')}`);
    return ids;
  } catch (error) {
    console.error('Error fetching cart IDs:', error);
    return [];
  }
}

// Define log action types
const ACTION_TYPES = [
  'ITEM_ADDED',
  'ITEM_REMOVED',
  'QUANTITY_CHANGED',
  'CHECKOUT_STARTED',
  'CHECKOUT_COMPLETED',
  'CART_ABANDONED',
  'SESSION_STARTED',
  'ITEM_SCANNED'
];

// Define item pool for realistic item data
const ITEM_POOL = [
  { itemId: '5901234123457', name: 'Organic Bananas', unitPrice: 1.99 },
  { itemId: '4003994155486', name: 'Whole Milk', unitPrice: 3.49 },
  { itemId: '7622210100146', name: 'Wheat Bread', unitPrice: 4.99 },
  { itemId: '0796030176614', name: 'Premium Ground Beef', unitPrice: 6.99 },
  { itemId: '4033800226004', name: 'Gala Apples', unitPrice: 2.49 },
  { itemId: '0041331092609', name: 'Eggs', unitPrice: 3.99 },
  { itemId: '0023700043171', name: 'Chicken Breast', unitPrice: 5.49 },
  { itemId: '0074682501756', name: 'Atlantic Salmon', unitPrice: 8.99 },
  { itemId: '0011110000123', name: 'Bell Peppers', unitPrice: 1.29 },
  { itemId: '0011110000124', name: 'Carrots', unitPrice: 0.99 }
];

// Generate log entries for a single cart
function generateLogsForCart(cartId, numLogs = 5) {
  const logs = [];
  
  // Set a base date somewhere in the last week
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 7)); // Random day within last week
  
  // Initialize with a baseline time
  let currentTime = new Date(baseDate);
  currentTime.setHours(9 + Math.floor(Math.random() * 8)); // Start between 9 AM and 5 PM
  currentTime.setMinutes(Math.floor(Math.random() * 60));
  
  for (let i = 0; i < numLogs; i++) {
    // Move time forward 2-15 minutes for each log
    currentTime = new Date(currentTime.getTime() + (2 + Math.floor(Math.random() * 13)) * 60000);
    
    // Choose a random action, weighted toward ITEM_ADDED (most common)
    const actionRandom = Math.random();
    let action;
    
    if (actionRandom < 0.5) {
      action = 'ITEM_ADDED'; // 50% chance of adding items
    } else if (actionRandom < 0.7) {
      action = 'QUANTITY_CHANGED'; // 20% chance of changing quantity
    } else if (actionRandom < 0.85) {
      action = 'ITEM_REMOVED'; // 15% chance of removing items
    } else {
      // 15% chance of one of the other actions
      action = ACTION_TYPES.filter(a => !['ITEM_ADDED', 'QUANTITY_CHANGED', 'ITEM_REMOVED'].includes(a))
        [Math.floor(Math.random() * (ACTION_TYPES.length - 3))];
    }
    
    // Choose a random item from the pool
    const item = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
    
    // Create appropriate details based on the action type
    let details = {};
    
    switch (action) {
      case 'ITEM_ADDED':
        details = { 
          itemId: item.itemId, 
          name: item.name, 
          quantity: Math.floor(Math.random() * 3) + 1 // 1-3 items
        };
        break;
      case 'ITEM_REMOVED':
        details = { 
          itemId: item.itemId, 
          name: item.name, 
          quantity: Math.floor(Math.random() * 2) + 1 // 1-2 items
        };
        break;
      case 'QUANTITY_CHANGED':
        const prevQuantity = Math.floor(Math.random() * 2) + 1; // 1-2 items
        details = { 
          itemId: item.itemId, 
          name: item.name, 
          quantity: prevQuantity + Math.floor(Math.random() * 2) + 1, // 2-4 items
          previousQuantity: prevQuantity
        };
        break;
      case 'CHECKOUT_STARTED':
      case 'CHECKOUT_COMPLETED':
        details = { 
          itemCount: Math.floor(Math.random() * 10) + 1, // 1-10 items
          totalValue: Math.round((Math.random() * 100 + 5) * 100) / 100 // $5-$105, rounded to 2 decimals
        };
        break;
      default:
        details = { note: `${action} action performed` };
    }
      logs.push({
      logId: uuidv4(),
      cartId,
      timestamp: admin.firestore.Timestamp.fromDate(currentTime),
      action,
      details
    });
  }
  
  return logs;
}

async function seedCartLogs() {
  try {
    console.log('Starting to seed cart logs...');
    
    // Get existing cart IDs from Firestore
    const cartIds = await getCartIds();
    console.log(`Found ${cartIds.length} carts to generate logs for`);
    
    if (cartIds.length === 0) {
      console.error('No carts found in the database. Please run seed-carts.js first.');
      process.exit(1);
    }
    
    // Generate logs for each cart (3-10 logs per cart)
    const allLogs = [];
    for (const cartId of cartIds) {
      const numLogs = Math.floor(Math.random() * 8) + 3; // 3-10 logs per cart
      const cartLogs = generateLogsForCart(cartId, numLogs);
      allLogs.push(...cartLogs);
    }
    console.log(`Generated ${allLogs.length} cart log entries`);
    
    // Start committing to Firestore
    const cartLogsCollection = db.collection('cartLogs');
    const batchSize = 100;
    let batch = db.batch();
    let operationCount = 0;
    
    for (const log of allLogs) {
      const docRef = cartLogsCollection.doc(log.logId);
      batch.set(docRef, log);
      operationCount++;
      
      if (operationCount >= batchSize) {
        await batch.commit();
        console.log(`Committed batch of ${operationCount} operations`);
        batch = db.batch();
        operationCount = 0;
      }
    }
    
    if (operationCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${operationCount} operations`);
    }
    
    console.log('Successfully seeded cart logs collection!');
  } catch (error) {
    console.error('Error seeding cart logs:', error);
  }
}

// Execute the seed function
seedCartLogs().then(() => {
  console.log('Seed script completed!');
  process.exit(0);
}).catch(error => {
  console.error('Seed script failed:', error);
  process.exit(1);
});