import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const CartPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  // This would come from your API in a real application
  const mockCarts = [
    {
      cartId: 'CART-001',
      status: 'online',
      createdAt: '2025-01-15 09:30',
      updatedAt: '2025-04-19 08:45'
    },
    {
      cartId: 'CART-002',
      status: 'offline',
      createdAt: '2025-01-15 09:30',
      updatedAt: '2025-04-18 16:22'
    },
    {
      cartId: 'CART-003',
      status: 'maintenance',
      createdAt: '2025-02-20 14:15',
      updatedAt: '2025-04-17 11:30'
    },
    {
      cartId: 'CART-004',
      status: 'online',
      createdAt: '2025-03-05 10:00',
      updatedAt: '2025-04-19 09:12'
    }
  ];

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredCarts = statusFilter === 'all' 
    ? mockCarts 
    : mockCarts.filter(cart => cart.status === statusFilter);

  const getStatusClass = (status) => {
    switch(status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  return (
    <AdminLayout>
      <div className="carts-page">
        <div className="carts-header">
          <h2>Smart Cart Devices</h2>
          <button className="btn btn-primary">Register New Cart</button>
        </div>
        
        <div className="carts-filters">
          <select className="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="all">All Carts</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <div className="carts-table-container">
          <table className="carts-table">
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.map(cart => (
                <tr key={cart.cartId}>
                  <td>{cart.cartId}</td>
                  <td><span className={`status-badge ${getStatusClass(cart.status)}`}>{cart.status}</span></td>
                  <td>{cart.createdAt}</td>
                  <td>{cart.updatedAt}</td>
                  <td>
                    <button className="btn-view">View</button>
                    <button className="btn-edit">Edit</button>
                    {cart.status !== 'maintenance' && (
                      <button className="btn-maintenance">Set to Maintenance</button>
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

export default CartPage;