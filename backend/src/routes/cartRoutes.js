// src/routes/cartRoutes.js
const express = require('express');
const { createOrUpdateCart, getCart, removeItemFromCart } = require('../controllers/cartController');
const router = express.Router();

// Define the routes for cart operations
router.post('/cart', createOrUpdateCart); // Create or update cart
router.get('/cart/:userId', getCart); // Get cart by userId
router.delete('/cart/:userId/item/:itemId', removeItemFromCart); // Remove item from cart

module.exports = router;
