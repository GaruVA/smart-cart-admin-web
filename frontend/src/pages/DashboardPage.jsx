import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/analytics.css';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch KPI data on mount
  useEffect(() => {
    analyticsService.getDashboardKPIs()
      .then(res => {
        const { totalItems, totalCarts, activeSessions, totalSales } = res.data;
        setKpis([
          { label: 'Total Items', value: totalItems, change: null, sub: null, changeColor: '' },
          { label: 'Total Carts', value: totalCarts, change: null, sub: null, changeColor: '' },
          { label: 'Active Sessions', value: activeSessions, change: null, sub: null, changeColor: '' },
          { label: 'Total Sales', value: `$${totalSales.toFixed(2)}`, change: null, sub: null, changeColor: '' },
        ]);
      })
      .catch(err => setError('Failed to load KPIs'))
      .finally(() => setLoading(false));
  }, []);

  // Mock chart data remains unchanged
  const salesTrendData = [
    { date: '04-16', sales: 1056 },{ date: '04-17', sales: 1346 },{ date: '04-18', sales: 1246 },
    { date: '04-19', sales: 1456 },{ date: '04-20', sales: 1178 },{ date: '04-21', sales: 1320 },{ date: '04-22', sales: 1405 }
  ];
  const inventoryLevelsData = [
    { category: 'Fruits', stock: 120 },{ category: 'Dairy', stock: 75 },{ category: 'Bakery', stock: 50 },{ category: 'Meat', stock: 30 }
  ];
  const cartStatusData = [ { name: 'Online', value: 45 }, { name: 'Offline', value: 30 }, { name: 'Maintenance', value: 25 } ];
  const sessionStatusData = [ { name: 'Completed', value: 265 }, { name: 'Active', value: 120 }, { name: 'Abandoned', value: 122 } ];

  return (
    <AdminLayout loading={loading} error={error}>
      <div className="analytics-page">
        <div className="page-header"><h1>Dashboard</h1></div>
        <div className="analytics-kpi-container">
          {kpis.map((kpi, i) => (
            <div key={i} className="analytics-kpi">
              <h3>{kpi.label}</h3>
              <div className="analytics-kpi-value">{kpi.value}</div>
              <div style={{ display:'flex', alignItems:'center', fontSize:13 }}>
                <span className={kpi.changeColor} style={{ marginRight:4 }}>{kpi.change}</span>
                <span style={{ color:'#757575' }}>{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="analytics-charts">
          <div className="chart-container">
            <h3>Sales This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData} margin={{ top:5, right:20, bottom:5, left:0 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3f51b5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3>Cart Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={cartStatusData} dataKey="value" nameKey="name" outerRadius={60} fill="#3f51b5" label />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          </div>
        <div className="analytics-tables">
          <h3>Low Stock Items</h3>
          <table className="analytics-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Qty</th></tr>
            </thead>
            <tbody>
              <tr><td>Bananas</td><td>Fruits</td><td>4</td></tr>
              <tr><td>Milk</td><td>Dairy</td><td>3</td></tr>
              <tr><td>Bread</td><td>Bakery</td><td>5</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;