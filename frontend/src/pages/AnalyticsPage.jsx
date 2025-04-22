import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/AdminStyles.css';
import '../styles/analytics.css';
import analyticsService from '../services/analyticsService';
import reportService from '../services/reportService';
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
  const [analytics, setAnalytics] = useState({ totalSales:0, averageSessionValue:0, conversionRate:0, topSellingCategory:'' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [salesByCategoryData, setSalesByCategoryData] = useState([]);
  const [inventoryLevelsData, setInventoryLevelsData] = useState([]);
  const [cartStatusData, setCartStatusData] = useState([]);
  const [sessionStatusData, setSessionStatusData] = useState([]);
  const [cartUsageData, setCartUsageData] = useState([]);
  const [avgSessionValueData, setAvgSessionValueData] = useState([]);
  const [hourlySessionsData, setHourlySessionsData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    analyticsService.getAnalyticsKPIs()
      .then(res => { setAnalytics(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load analytics data'); setLoading(false); });
  }, []);

  useEffect(() => {
    const { from, to } = dateRange;
    if (activeTab === 'sales') {
      analyticsService.getSalesTrend(from, to).then(res => setSalesTrendData(res.data));
      analyticsService.getSalesByCategory(from, to).then(res => setSalesByCategoryData(res.data));
    } else if (activeTab === 'inventory') {
      analyticsService.getInventoryLevels().then(res => setInventoryLevelsData(res.data));
      analyticsService.getLowStockItems(20).then(res => setLowStockItems(res.data));
    } else if (activeTab === 'carts') {
      analyticsService.getCartStatus().then(res => setCartStatusData(res.data));
      analyticsService.getCartUsage(from, to).then(res => setCartUsageData(res.data));
    } else if (activeTab === 'sessions') {
      analyticsService.getAvgSessionValue(from, to).then(res => setAvgSessionValueData(res.data));
      analyticsService.getHourlySessionActivity(dateRange.from).then(res => setHourlySessionsData(res.data));
      analyticsService.getSessionStatus().then(res => setSessionStatusData(res.data));
    }
  }, [activeTab, dateRange]);

  // Dynamic KPIs from API
  const kpis = [
    { label: 'Total Sales', value: `$${analytics.totalSales.toFixed(2)}` },
    { label: 'Average Session Value', value: `$${analytics.averageSessionValue.toFixed(2)}` },
    { label: 'Conversion Rate', value: `${analytics.conversionRate.toFixed(2)}%` },
    { label: 'Top Selling Category', value: analytics.topSellingCategory }
  ];

  // Function to handle PDF export
  const handleExport = async () => {
    try {
      setExporting(true);
      const { from, to } = dateRange;
      
      // Collect data based on selected report type
      const reportData = {};
      
      // Add chart data based on report type
      switch (reportType) {
        case 'sales':
          reportData.salesTrend = salesTrendData;
          reportData.salesByCategory = salesByCategoryData;
          break;
        case 'inventory':
          reportData.inventoryLevels = inventoryLevelsData;
          reportData.lowStockItems = lowStockItems;
          break;
        case 'carts':
          reportData.cartStatus = cartStatusData;
          reportData.cartUsage = cartUsageData;
          break;
        case 'sessions':
          reportData.avgSessionValue = avgSessionValueData;
          reportData.hourlySessionActivity = hourlySessionsData;
          break;
        default:
          break;
      }
      
      // Get report title
      const reportTitle = REPORT_TYPES.find(r => r.value === reportType)?.label || 'Analytics Report';
      
      // Export PDF
      reportService.exportPDF(reportType, reportData, { 
        from, to, title: reportTitle 
      });
      
      setExporting(false);
    } catch (error) {
      console.error('Error exporting report:', error);
      setExporting(false);
    }
  };

  return (
    <AdminLayout loading={loading} error={error}>
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
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="export-btn"
            >
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>
        <div className="analytics-kpi-container">
          {kpis.map((kpi, i) => (
            <div key={i} className="analytics-kpi">
              <h3>{kpi.label}</h3>
              <div className="analytics-kpi-value">{kpi.value}</div>
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
                  <div style={{ width: '100%', height: 300 }}>
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
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Sales by Category</h3>
                  <div style={{ width: '100%', height: 300 }}>
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
                </div>
              </>
            )}
            {/* Inventory Analytics: Inventory Levels */}
            {activeTab === 'inventory' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Inventory Levels by Category</h3>
                  <div style={{ width: '100%', height: 300 }}>
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
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Low Stock Items</h3>
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
              </>
            )}
            {/* Cart Analytics: Cart Status Distribution, Cart Usage */}
            {activeTab === 'carts' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Status Distribution</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie data={cartStatusData} dataKey="value" nameKey="name" outerRadius={100} fill="#3f51b5" label />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Cart Usage</h3>
                  <div style={{ width: '100%', height: 300 }}>
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
                </div>
              </>
            )}
            {/* Session Analytics: Average Session Value, Hourly Session Activity */}
            {activeTab === 'sessions' && (
              <>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Average Session Value (Last 7 Days)</h3>
                  <div style={{ width: '100%', height: 300 }}>
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
                </div>
                <div className="chart-container">
                  <h3 style={{ marginBottom: 8 }}>Hourly Session Activity</h3>
                  <div style={{ width: '100%', height: 300 }}>
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