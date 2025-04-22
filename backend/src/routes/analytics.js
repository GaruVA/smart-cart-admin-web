const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/kpis
router.get('/dashboard-kpis', analyticsController.getDashboardKPIs);

// GET /api/analytics/analytics-kpis
router.get('/analytics-kpis', analyticsController.getAnalyticsKPIs);

module.exports = router;