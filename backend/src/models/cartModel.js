// src/models/cartModel.js
const admin = require('firebase-admin');

// Create a Cart model that communicates with Firebase
class Cart {
  constructor(userId) {
    this.userId = userId;
    this.db = admin.firestore();
  }

  // Create or update a cart
  async createOrUpdateCart(cartData) {
    const cartRef = this.db.collection('carts').doc(this.userId);
    await cartRef.set(cartData, { merge: true });
  }

  // Get the user's cart
  async getCart() {
    const cartRef = this.db.collection('carts').doc(this.userId);
    const cartDoc = await cartRef.get();
    if (!cartDoc.exists) {
      return null;
    }
    return cartDoc.data();
  }

  // Remove item from cart
  async removeItemFromCart(itemId) {
    const cartRef = this.db.collection('carts').doc(this.userId);
    const cartDoc = await cartRef.get();
    if (!cartDoc.exists) {
      return;
    }
    const cartData = cartDoc.data();
    const updatedItems = cartData.items.filter(item => item.id !== itemId);
    await cartRef.update({ items: updatedItems });
  }
}

module.exports = Cart;
