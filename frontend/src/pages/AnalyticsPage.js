import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../contexts/AuthContext';

const AnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [period, setPeriod] = useState('daily');
  const [startDate, setStartDate] = useState('2025-03-18');
  const [endDate, setEndDate] = useState('2025-04-18');

  // Static data for analytics
  const salesData = {
    totalSales: 24895.45,
    totalCarts: 387,
    averageOrderValue: 64.33,
    salesData: [
      { date: '2025-04-18', sales: 1245.67 },
      { date: '2025-04-17', sales: 1056.32 },
      { date: '2025-04-16', sales: 1345.88 },
      { date: '2025-04-15', sales: 1122.45 },
      { date: '2025-04-14', sales: 1267.34 },
    ]
  };

  const inventoryData = {
    totalItems: 148,
    lowStockItems: 12,
    categories: [
      {
        name: 'Groceries',
        items: [
          { id: 1, name: 'Organic Bananas', stockQuantity: 4, price: 1.99 },
          { id: 2, name: 'Milk', stockQuantity: 3, price: 3.49 },
          { id: 3, name: 'Bread', stockQuantity: 5, price: 2.99 }
        ]
      },
      {
        name: 'Electronics',
        items: [
          { id: 4, name: 'Portable Charger', stockQuantity: 2, price: 24.99 },
          { id: 5, name: 'Wireless Earbuds', stockQuantity: 1, price: 59.99 }
        ]
      }
    ]
  };

  const cartData = {
    conversionRate: 68.5,
    abandonmentRate: 31.5,
    averageCartValue: 64.33,
    chartData: [
      { status: 'Completed', count: 265 },
      { status: 'Abandoned', count: 122 }
    ]
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle period change
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  // Handle date changes
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <AdminLayout>
      <div className="analytics-page">
        <div className="analytics-header">
          <h2>Analytics</h2>
          <div className="analytics-actions">
            <button className="btn btn-primary">Export Data</button>
          </div>
        </div>

        {/* Date range and period filters */}
        <div className="analytics-filters">
          <div>
            <select className="time-period" value={period} onChange={handlePeriodChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="date-range">
            <label>From:</label>
            <input
              type="date"
              className="date-filter"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <label>To:</label>
            <input
              type="date"
              className="date-filter"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>

        <>
          {/* Sales KPIs */}
          <h3>Sales Overview</h3>
          <div className="dashboard-kpi-container">
            <div className="dashboard-kpi">
              <h3>Total Sales</h3>
              <div className="kpi-value">
                {formatCurrency(salesData.totalSales)}
              </div>
            </div>
            <div className="dashboard-kpi">
              <h3>Total Orders</h3>
              <div className="kpi-value">{salesData.totalCarts}</div>
            </div>
            <div className="dashboard-kpi">
              <h3>Average Order Value</h3>
              <div className="kpi-value">
                {formatCurrency(salesData.averageOrderValue)}
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="analytics-charts">
            <div className="chart-container">
              <h3>Sales Over Time</h3>
              <div className="chart-placeholder">
                [Sales chart visualization would be displayed here with data]
              </div>
            </div>
          </div>

          {/* Inventory KPIs */}
          <h3>Inventory Overview</h3>
          <div className="dashboard-kpi-container">
            <div className="dashboard-kpi">
              <h3>Total Products</h3>
              <div className="kpi-value">{inventoryData.totalItems}</div>
            </div>
            <div className="dashboard-kpi">
              <h3>Low Stock Items</h3>
              <div className="kpi-value">{inventoryData.lowStockItems}</div>
            </div>
          </div>

          {/* Inventory Chart */}
          <div className="analytics-charts">
            <div className="chart-container">
              <h3>Inventory by Category</h3>
              <div className="chart-placeholder">
                [Category breakdown chart would be displayed here with data]
              </div>
            </div>
          </div>

          {/* Cart Activity KPIs */}
          <h3>Cart Activity</h3>
          <div className="dashboard-kpi-container">
            <div className="dashboard-kpi">
              <h3>Conversion Rate</h3>
              <div className="kpi-value">{cartData.conversionRate.toFixed(2)}%</div>
            </div>
            <div className="dashboard-kpi">
              <h3>Abandonment Rate</h3>
              <div className="kpi-value">{cartData.abandonmentRate.toFixed(2)}%</div>
            </div>
            <div className="dashboard-kpi">
              <h3>Average Cart Value</h3>
              <div className="kpi-value">
                {formatCurrency(cartData.averageCartValue)}
              </div>
            </div>
          </div>

          {/* Cart Status Chart */}
          <div className="analytics-charts">
            <div className="chart-container">
              <h3>Cart Status Distribution</h3>
              <div className="chart-placeholder">
                [Cart status pie chart would be displayed here with data]
              </div>
            </div>
          </div>

          {/* Detailed Analytics Tables */}
          <div className="analytics-tables">
            <h3>Low Stock Items</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stock Quantity</th>
                  <th>Unit Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.categories.map((category) =>
                  category.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{category.name}</td>
                      <td>{item.stockQuantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.stockQuantity)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;