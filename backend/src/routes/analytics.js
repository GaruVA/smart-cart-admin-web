const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/kpis
router.get('/dashboard-kpis', analyticsController.getDashboardKPIs);

module.exports = router;