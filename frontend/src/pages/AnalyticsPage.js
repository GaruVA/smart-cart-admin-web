import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/AdminStyles.css';
import '../styles/analytics.css';

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
                  <div className="chart-placeholder">[Line chart: Daily sales for the past week]</div>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Sales by Category</h3>
                  <div className="chart-placeholder">[Bar chart: Total sales by product category]</div>
                </div>
              </>
            )}
            {/* Inventory Analytics: Inventory Levels */}
            {activeTab === 'inventory' && (
              <div className="chart-container">
                <h3 style={{ marginBottom: 8 }}>Inventory Levels by Category</h3>
                <div className="chart-placeholder">[Bar chart: Current stock levels by category]</div>
              </div>
            )}
            {/* Cart Analytics: Cart Status Distribution, Cart Usage */}
            {activeTab === 'carts' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Status Distribution</h3>
                  <div className="chart-placeholder">[Pie chart: Distribution of cart statuses]</div>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Usage</h3>
                  <div className="chart-placeholder">[Bar chart: Number of sessions per cart]</div>
                </div>
              </>
            )}
            {/* Session Analytics: Average Session Value, Hourly Session Activity */}
            {activeTab === 'sessions' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Average Session Value (Last 7 Days)</h3>
                  <div className="chart-placeholder">[Line chart: Average session value per day]</div>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Hourly Session Activity</h3>
                  <div className="chart-placeholder">[Bar/line chart: Sessions by hour]</div>
                </div>
              </>
            )}
          </div>
        </div>
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
              <tr>
                <td>Organic Bananas</td>
                <td>Fruits</td>
                <td>4</td>
                <td>$1.99</td>
                <td>$7.96</td>
              </tr>
              <tr>
                <td>Milk</td>
                <td>Dairy</td>
                <td>3</td>
                <td>$3.49</td>
                <td>$10.47</td>
              </tr>
              <tr>
                <td>Bread</td>
                <td>Bakery</td>
                <td>5</td>
                <td>$2.99</td>
                <td>$14.95</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;