// backend/controllers/itemsController.js
const admin = require('firebase-admin');
const db = admin.firestore();
const itemsCollection = db.collection('items');

// Get all items with filtering options
exports.getItems = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '' } = req.query;
    
    // Start building the query
    let query = itemsCollection;
    
    // Add filters if provided
    if (category) {
      query = query.where('category', '==', category);
    }
    
    // Get data with pagination
    const startAfter = (page - 1) * limit;
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    
    // Process results
    let items = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      items.push({ ...data, id: doc.id });
    });
    
    // Client-side search for simplicity (in production, consider server-side search)
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower) ||
        item.id.includes(search)
      );
    }
    
    return res.status(200).json({
      items,
      total: items.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error getting items:', error);
    return res.status(500).json({ error: 'Server error getting items' });
  }
};

// Get a single item by ID
exports.getItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const doc = await itemsCollection.doc(itemId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting item:', error);
    return res.status(500).json({ error: 'Server error getting item' });
  }
};

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { id, name, category, price, stockQuantity, weight, description } = req.body;
    
    // Validate required fields
    if (!id || !name || !category || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if item with this ID already exists
    const existingItem = await itemsCollection.doc(id).get();
    if (existingItem.exists) {
      return res.status(400).json({ error: 'Item with this ID already exists' });
    }
    
    // Create timestamp
    const now = admin.firestore.Timestamp.now();
      // Create new item
    const newItem = {
      id,
      name,
      category,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      weight: weight ? parseInt(weight) : null,
      description: description || '',
      createdAt: now,
      updatedAt: now
    };
    
    // Save to database
    await itemsCollection.doc(id).set(newItem);
    
    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ error: 'Server error creating item' });
  }
};

// Update an existing item
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, category, price, stockQuantity, weight, description } = req.body;
    
    // Check if item exists
    const doc = await itemsCollection.doc(itemId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
      // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (weight !== undefined) updateData.weight = weight ? parseInt(weight) : null;
    if (description !== undefined) updateData.description = description;
    
    // Always update the timestamp
    updateData.updatedAt = admin.firestore.Timestamp.now();
    
    // Update in database
    await itemsCollection.doc(itemId).update(updateData);
    
    // Get updated item
    const updatedDoc = await itemsCollection.doc(itemId).get();
    
    return res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({ error: 'Server error updating item' });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const doc = await itemsCollection.doc(itemId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Delete from database
    await itemsCollection.doc(itemId).delete();
    
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Server error deleting item' });
  }
};