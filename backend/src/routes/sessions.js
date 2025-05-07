const express = require('express');
const sessionsController = require('../controllers/sessionsController');

const router = express.Router();

// Routes for sessions
router.get('/', sessionsController.getSessions); // Get all sessions
router.get('/:id', sessionsController.getSession); // Get a session by ID
router.post('/', sessionsController.createSession); // Create a new session
router.put('/:id', sessionsController.updateSession); // Update a session
router.delete('/:id', sessionsController.deleteSession); // Delete a session

module.exports = router;