// src/routes/cartRoutes.js
const express = require('express');
const { createCart, updateCart, getCart, removeItemFromCart, listCarts, removeCart, getCartLogs } = require('../controllers/cartController');
const router = express.Router();

// Define the routes for cart operations
// Create a new cart
router.post('/', createCart);
// Get single cart by cartId
router.get('/:cartId', getCart);
// Update existing cart
router.put('/:cartId', updateCart);
// Delete entire cart
router.delete('/:cartId', removeCart);
// Remove item from cart
router.delete('/:cartId/item/:itemId', removeItemFromCart);
// Get logs for a cart
router.get('/:cartId/logs', getCartLogs);
// List all carts with optional filters and pagination
router.get('/', listCarts);

module.exports = router;
