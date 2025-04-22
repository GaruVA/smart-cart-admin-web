import api from './api';

const analyticsService = {
  // Get dashboard KPI metrics
  getDashboardKPIs: () => api.get('/analytics/dashboard-kpis'),
  // Get extended analytics KPI metrics
  getAnalyticsKPIs: () => api.get('/analytics/analytics-kpis'),
};

export default analyticsService;