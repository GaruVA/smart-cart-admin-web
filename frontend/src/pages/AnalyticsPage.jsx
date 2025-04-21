import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/AdminStyles.css';
import '../styles/analytics.css';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const REPORT_TYPES = [
  { label: 'Sales Report', value: 'sales' },
  { label: 'Inventory Report', value: 'inventory' },
  { label: 'Cart Report', value: 'carts' },
  { label: 'Session Report', value: 'sessions' },
];

const TABS = [
  { label: 'Sales Analytics', value: 'sales' },
  { label: 'Inventory Analytics', value: 'inventory' },
  { label: 'Cart Analytics', value: 'carts' },
  { label: 'Session Analytics', value: 'sessions' },
];

const AnalyticsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({ from: '2025-04-15', to: '2025-04-22' });
  const [activeTab, setActiveTab] = useState('sales');

  // Mock KPIs
  const kpis = [
    {
      label: 'Total Sales',
      value: '$24,589.99',
      change: '+15.2%',
      changeColor: 'analytics-kpi-up',
      icon: 'up',
      sub: 'from previous period',
    },
    {
      label: 'Average Cart Value',
      value: '$42.75',
      change: '+8.5%',
      changeColor: 'analytics-kpi-up',
      icon: 'up',
      sub: 'from previous period',
    },
    {
      label: 'Conversion Rate',
      value: '68.3%',
      change: '-2.1%',
      changeColor: 'analytics-kpi-down',
      icon: 'down',
      sub: 'from previous period',
    },
    {
      label: 'Top Selling Category',
      value: 'Dairy',
      change: '+12.4%',
      changeColor: 'analytics-kpi-up',
      icon: 'up',
      sub: 'from previous period',
    },
  ];

  // Mock chart data
  const salesTrendData = [
    { date: '2025-04-16', sales: 1056 },
    { date: '2025-04-17', sales: 1346 },
    { date: '2025-04-18', sales: 1246 },
    { date: '2025-04-19', sales: 1456 },
    { date: '2025-04-20', sales: 1178 },
    { date: '2025-04-21', sales: 1320 },
    { date: '2025-04-22', sales: 1405 }
  ];
  const salesByCategoryData = [
    { category: 'Fruits', sales: 5400 },
    { category: 'Dairy', sales: 4200 },
    { category: 'Bakery', sales: 3500 },
    { category: 'Meat', sales: 2800 }
  ];
  const inventoryLevelsData = [
    { category: 'Fruits', stock: 120 },
    { category: 'Dairy', stock: 75 },
    { category: 'Bakery', stock: 50 },
    { category: 'Meat', stock: 30 }
  ];
  const cartStatusData = [
    { name: 'Online', value: 45 },
    { name: 'Offline', value: 30 },
    { name: 'Maintenance', value: 25 }
  ];
  const cartUsageData = [
    { cart: 'CART-001', sessions: 15 },
    { cart: 'CART-002', sessions: 12 },
    { cart: 'CART-003', sessions: 20 }
  ];
  const avgSessionValueData = [
    { date: '2025-04-16', value: 58.2 },
    { date: '2025-04-17', value: 62.5 },
    { date: '2025-04-18', value: 64.3 },
    { date: '2025-04-19', value: 59.8 },
    { date: '2025-04-20', value: 61.0 },
    { date: '2025-04-21', value: 63.7 },
    { date: '2025-04-22', value: 65.4 }
  ];
  const hourlySessionsData = [
    { hour: '08', sessions: 5 }, { hour: '09', sessions: 8 }, { hour: '10', sessions: 12 },
    { hour: '11', sessions: 15 }, { hour: '12', sessions: 20 }, { hour: '13', sessions: 18 },
    { hour: '14', sessions: 22 }, { hour: '15', sessions: 17 }, { hour: '16', sessions: 14 }
  ];

  // SVG icons
  const ArrowIcon = ({ direction, color }) => direction === 'up' ? (
    <span className={color} style={{ marginRight: 4 }}>▲</span>
  ) : (
    <span className={color} style={{ marginRight: 4 }}>▼</span>
  );

  return (
    <AdminLayout>
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>Analytics &amp; Reports</h1>
        </div>
        <div className="analytics-filters">
          <div style={{ display: 'flex', gap: 30}}>
          <div>
            <label htmlFor="reportType" style={{ marginRight: 8 }}>Report Type:</label>
            <select
              id="reportType"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              {REPORT_TYPES.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>From:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
            />
            <label style={{ margin: '0 8px' }}>To:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
            />
          </div>
          </div>
          <div className="analytics-actions">
            <button>Export Report</button>
          </div>
        </div>
        <div className="analytics-kpi-container">
          {kpis.map((kpi, i) => (
            <div key={i} className="analytics-kpi">
              <h3>{kpi.label}</h3>
              <div className="analytics-kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, marginTop: 4 }}>
                <ArrowIcon direction={kpi.icon} color={kpi.changeColor} />
                <span className={kpi.changeColor}>{kpi.change}</span>
                <span style={{ marginLeft: 6, color: '#757575' }}>{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ margin: '24px 0' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={activeTab === tab.value ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ minWidth: 140 }}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="analytics-charts">
            {/* Sales Analytics: Sales Trend, Sales by Category */}
            {activeTab === 'sales' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Sales Trend (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#3f51b5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Sales by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesByCategoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#3f51b5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            {/* Inventory Analytics: Inventory Levels */}
            {activeTab === 'inventory' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Inventory Levels by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={inventoryLevelsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Low Stock Items</h3>
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
              </>
            )}
            {/* Cart Analytics: Cart Status Distribution, Cart Usage */}
            {activeTab === 'carts' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie data={cartStatusData} dataKey="value" nameKey="name" outerRadius={100} fill="#3f51b5" label />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Usage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cartUsageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="cart" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sessions" fill="#ff9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            {/* Session Analytics: Average Session Value, Hourly Session Activity */}
            {activeTab === 'sessions' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Average Session Value (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={avgSessionValueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#f50057" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Hourly Session Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlySessionsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sessions" fill="#3f51b5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;