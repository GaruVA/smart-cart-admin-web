import api from './api';

const analyticsService = {
  // Get dashboard KPI metrics
  getDashboardKPIs: () => api.get('/analytics/dashboard-kpis'),
  // Get extended analytics KPI metrics
  getAnalyticsKPIs: () => api.get('/analytics/analytics-kpis'),

  // Chart data endpoints
  getSalesTrend: (from, to) => api.get('/analytics/sales-trend', { params: { from, to } }),
  getSalesByCategory: (from, to) => api.get('/analytics/sales-by-category', { params: { from, to } }),
  getInventoryLevels: () => api.get('/analytics/inventory-levels'),
  getCartStatus: () => api.get('/analytics/cart-status'),
  getSessionStatus: () => api.get('/analytics/session-status'),
  getCartUsage: (from, to) => api.get('/analytics/cart-usage', { params: { from, to } }),
  getAvgSessionValue: (from, to) => api.get('/analytics/avg-session-value', { params: { from, to } }),
  getHourlySessionActivity: (date) => api.get('/analytics/hourly-session-activity', { params: { date } }),
  getLowStockItems: (threshold) => api.get('/analytics/low-stock-items', { params: { threshold } }),
};

export default analyticsService;