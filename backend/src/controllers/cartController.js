// src/controllers/cartController.js
const Cart = require('../models/cartModel');

const createOrUpdateCart = async (req, res) => {
  try {
    const { userId, cartData } = req.body;
    const cart = new Cart(userId);
    await cart.createOrUpdateCart(cartData);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error creating/updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = new Cart(userId);
    const cartData = await cart.getCart();
    if (!cartData) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const cart = new Cart(userId);
    await cart.removeItemFromCart(itemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createOrUpdateCart, getCart, removeItemFromCart };
