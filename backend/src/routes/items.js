// backend/routes/items.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const itemsController = require('../controllers/itemsController');

// Apply auth middleware to all routes
router.use(verifyToken);

// Items routes
router.get('/', itemsController.getItems);
router.get('/:id', itemsController.getItem);
router.post('/', itemsController.createItem);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;