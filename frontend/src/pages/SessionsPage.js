import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const SessionsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // This would come from your API in a real application
  const mockSessions = [
    {
      sessionId: 'SESSION-001',
      cartId: 'CART-001',
      items: [
        { itemId: '5901234123457', quantity: 2, unitPrice: 1.99 },
        { itemId: '4003994155486', quantity: 1, unitPrice: 3.49 }
      ],
      totalCost: 7.47,
      startedAt: '2025-04-19 09:30',
      endedAt: null,
      status: 'active'
    },
    {
      sessionId: 'SESSION-002',
      cartId: 'CART-004',
      items: [
        { itemId: '7622210100146', quantity: 1, unitPrice: 4.99 },
        { itemId: '0041331092609', quantity: 2, unitPrice: 3.99 },
        { itemId: '0023700043171', quantity: 1, unitPrice: 5.49 }
      ],
      totalCost: 18.46,
      startedAt: '2025-04-18 15:15',
      endedAt: '2025-04-18 15:40',
      status: 'completed'
    },
    {
      sessionId: 'SESSION-003',
      cartId: 'CART-002',
      items: [
        { itemId: '5901234123457', quantity: 1, unitPrice: 1.99 },
        { itemId: '0041331092609', quantity: 1, unitPrice: 3.99 }
      ],
      totalCost: 5.98,
      startedAt: '2025-04-18 11:20',
      endedAt: null,
      status: 'abandoned'
    },
    {
      sessionId: 'SESSION-004',
      cartId: 'CART-001',
      items: [
        { itemId: '0796030176614', quantity: 2, unitPrice: 6.99 },
        { itemId: '0074682501756', quantity: 1, unitPrice: 8.99 },
        { itemId: '4003994155486', quantity: 1, unitPrice: 3.49 }
      ],
      totalCost: 26.46,
      startedAt: '2025-04-17 14:10',
      endedAt: '2025-04-17 14:35',
      status: 'completed'
    }
  ];

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value });
  };

  const filteredSessions = statusFilter === 'all' 
    ? mockSessions 
    : mockSessions.filter(session => session.status === statusFilter);

  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'abandoned': return 'status-abandoned';
      default: return '';
    }
  };

  const formatItemCount = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AdminLayout>
      <div className="sessions-page">
        <div className="sessions-header">
          <h2>Shopping Sessions</h2>
        </div>
        
        <div className="sessions-filters">
          <select className="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="all">All Sessions</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
          <div className="date-filters">
            <input 
              type="date" 
              className="date-filter" 
              placeholder="From" 
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
            <input 
              type="date" 
              className="date-filter" 
              placeholder="To" 
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        </div>
        
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Cart ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total Cost</th>
                <th>Started At</th>
                <th>Ended At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => (
                <tr key={session.sessionId}>
                  <td>{session.sessionId}</td>
                  <td>{session.cartId}</td>
                  <td><span className={`status-badge ${getStatusClass(session.status)}`}>{session.status}</span></td>
                  <td>{formatItemCount(session.items)}</td>
                  <td>${session.totalCost.toFixed(2)}</td>
                  <td>{session.startedAt}</td>
                  <td>{session.endedAt || '-'}</td>
                  <td>
                    <button className="btn-view">View Details</button>
                    {session.status === 'active' && (
                      <>
                        <button className="btn-complete">Complete</button>
                        <button className="btn-abandon">Mark Abandoned</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button>&lt;</button>
          <span>Page 1 of 1</span>
          <button>&gt;</button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SessionsPage;