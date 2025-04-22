import api from './api';

const analyticsService = {
  // Get dashboard KPI metrics
  getKPIs: () => api.get('/analytics/dashboard-kpis'),
};

export default analyticsService;