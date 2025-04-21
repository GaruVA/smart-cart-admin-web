import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/analytics.css';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  // Mock KPI data
  const kpis = [
    { label: 'Total Items', value: '1245', change: '12%', sub: 'from last month', changeColor: 'analytics-kpi-up' },
    { label: 'Total Carts', value: '28', change: '3%', sub: 'from last month', changeColor: 'analytics-kpi-up' },
    { label: 'Active Sessions', value: '8', change: '2%', sub: 'from yesterday', changeColor: 'analytics-kpi-up' },
    { label: 'Total Sales', value: '$8,459.99', change: '15%', sub: 'from last week', changeColor: 'analytics-kpi-up' },
  ];

  // Mock chart data
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
    <AdminLayout>
      <div className="analytics-page">
        <h2>Dashboard</h2>
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
              <tr><th>Product</th><th>Category</th><th>Qty</th><th>Threshold</th></tr>
            </thead>
            <tbody>
              <tr><td>Bananas</td><td>Fruits</td><td>4</td><td>10</td></tr>
              <tr><td>Milk</td><td>Dairy</td><td>3</td><td>10</td></tr>
              <tr><td>Bread</td><td>Bakery</td><td>5</td><td>10</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;