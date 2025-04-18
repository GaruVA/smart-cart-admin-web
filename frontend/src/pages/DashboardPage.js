import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <div className="dashboard-page">
        <h2>Dashboard</h2>
        <div className="dashboard-kpi-container">
          {/* Placeholder for DashboardKPI components */}
          <div className="dashboard-kpi">
            <h3>Total Items</h3>
            <div className="kpi-value">120</div>
          </div>
          <div className="dashboard-kpi">
            <h3>Active Carts</h3>
            <div className="kpi-value">8</div>
          </div>
          <div className="dashboard-kpi">
            <h3>Low Stock Items</h3>
            <div className="kpi-value">5</div>
          </div>
        </div>
        
        <div className="dashboard-charts">
          <div className="dashboard-chart">
            <h3>Recent Sales</h3>
            <div className="chart-placeholder">
              Chart will be displayed here
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;