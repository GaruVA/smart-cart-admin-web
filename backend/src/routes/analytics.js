const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/kpis
router.get('/dashboard-kpis', analyticsController.getDashboardKPIs);

// GET /api/analytics/analytics-kpis
router.get('/analytics-kpis', analyticsController.getAnalyticsKPIs);

// Chart-specific endpoints
router.get('/sales-trend', analyticsController.getSalesTrend);
router.get('/sales-by-category', analyticsController.getSalesByCategory);
router.get('/inventory-levels', analyticsController.getInventoryLevels);
router.get('/low-stock-items', analyticsController.getLowStockItems);
router.get('/cart-status', analyticsController.getCartStatus);
router.get('/session-status', analyticsController.getSessionStatus);
router.get('/cart-usage', analyticsController.getCartUsage);
router.get('/avg-session-value', analyticsController.getAvgSessionValue);
router.get('/hourly-session-activity', analyticsController.getHourlySessionActivity);

module.exports = router;