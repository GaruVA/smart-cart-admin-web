// src/controllers/cartController.js
const admin = require('firebase-admin');

// Create a new cart with auto-generated ID
const createCart = async (req, res) => {
  try {
    const cartData = req.body;
    const cartsCol = admin.firestore().collection('carts');
    const cartRef = cartsCol.doc(); // auto-generated ID
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    // Include document ID in the cart data
    const newCart = { cartId: cartRef.id, ...cartData, createdAt: timestamp, updatedAt: timestamp };
    await cartRef.set(newCart);
    // Read back the saved document to get real timestamps
    const savedDoc = await cartRef.get();
    const savedData = savedDoc.data();
    // Serialize timestamps
    res.status(201).json({
      cartId: savedDoc.id,
      ...Object.fromEntries(Object.entries(savedData).map(([k,v]) => [
        k,
        (v && v.toDate && typeof v.toDate === 'function') ? v.toDate().toISOString() : v
      ]))
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing cart by ID
const updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cartData = req.body;
    const cartRef = admin.firestore().collection('carts').doc(cartId);
    const exists = (await cartRef.get()).exists;
    if (!exists) return res.status(404).json({ error: 'Cart not found' });
    // Merge in updated fields and keep cartId
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await cartRef.set({ ...cartData, updatedAt: timestamp }, { merge: true });
    // Read back to get real updatedAt
    const savedDoc = await cartRef.get();
    const savedData = savedDoc.data();
    res.status(200).json({
      cartId: savedDoc.id,
      ...Object.fromEntries(Object.entries(savedData).map(([k,v]) => [
        k,
        (v && v.toDate && typeof v.toDate === 'function') ? v.toDate().toISOString() : v
      ]))
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    // Fetch cart and include doc.id as cartId
    const doc = await admin.firestore().collection('carts').doc(cartId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const data = doc.data();
    // Serialize timestamps to ISO strings
    const { createdAt, updatedAt, ...rest } = data;
    res.status(200).json({
      cartId: doc.id,
      ...rest,
      createdAt: createdAt.toDate().toISOString(),
      updatedAt: updatedAt.toDate().toISOString()
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const cartRef = admin.firestore().collection('carts').doc(cartId);
    const doc = await cartRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const data = doc.data();
    const items = Array.isArray(data.items) ? data.items : [];
    const updatedItems = items.filter(item => item.id !== itemId);
    await cartRef.update({
      items: updatedItems,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List all carts with optional filtering and pagination
const listCarts = async (req, res) => {
  try {
    const { status = '', page = 1, limit = 20 } = req.query;
    let query = admin.firestore().collection('carts');
    if (status) query = query.where('status', '==', status);
    const offset = (page - 1) * limit;
    const snapshot = await query.offset(offset).limit(Number(limit)).get();
    // Include doc.id as cartId in each entry
    const carts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        cartId: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      };
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error listing carts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete entire cart
const removeCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await admin.firestore().collection('carts').doc(cartId).delete();
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createCart, updateCart, getCart, removeItemFromCart, listCarts, removeCart };
