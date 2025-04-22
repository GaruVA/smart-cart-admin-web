import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/analytics.css';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  const [kpis, setKpis] = useState([]);
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [cartStatusData, setCartStatusData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get today's date
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const todayStr = today.toISOString().split('T')[0];
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  // Fetch all dashboard data on mount
  useEffect(() => {
    Promise.all([
      analyticsService.getDashboardKPIs(),
      analyticsService.getSalesTrend(weekAgoStr, todayStr),
      analyticsService.getCartStatus(),
      analyticsService.getLowStockItems(20) // Fetch low stock items with threshold of 20
    ])
    .then(([kpisRes, salesTrendRes, cartStatusRes, lowStockRes]) => {
      // Set KPIs
      const { totalItems, totalCarts, activeSessions, totalSales } = kpisRes.data;
      setKpis([
        { label: 'Total Items', value: totalItems, change: null, sub: null, changeColor: '' },
        { label: 'Total Carts', value: totalCarts, change: null, sub: null, changeColor: '' },
        { label: 'Active Sessions', value: activeSessions, change: null, sub: null, changeColor: '' },
        { label: 'Total Sales', value: `$${totalSales.toFixed(2)}`, change: null, sub: null, changeColor: '' },
      ]);
      
      // Set sales trend data
      setSalesTrendData(salesTrendRes.data);
      
      // Set cart status data
      setCartStatusData(cartStatusRes.data);
      
      // Set low stock items from API
      setLowStockItems(lowStockRes.data);
      
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching dashboard data:", err);
      setError('Failed to load dashboard data');
      setLoading(false);
    });
  }, []);

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
              {lowStockItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;