import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const CartPage = () => {
  return (
    <AdminLayout>
      <div className="carts-page">
        <div className="carts-header">
          <h2>Shopping Carts Management</h2>
        </div>
        
        <div className="carts-filters">
          <select className="status-filter">
            <option value="all">All Carts</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
          <div className="date-filters">
            <input type="date" className="date-filter" placeholder="From" />
            <input type="date" className="date-filter" placeholder="To" />
          </div>
        </div>
        
        <div className="carts-table-container">
          <table className="carts-table">
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total Cost</th>
                <th>Started At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CART-001</td>
                <td><span className="status-active">Active</span></td>
                <td>3</td>
                <td>$12.97</td>
                <td>2025-04-18 09:30</td>
                <td>
                  <button className="btn-view">View</button>
                </td>
              </tr>
              <tr>
                <td>CART-002</td>
                <td><span className="status-completed">Completed</span></td>
                <td>7</td>
                <td>$35.45</td>
                <td>2025-04-18 10:15</td>
                <td>
                  <button className="btn-view">View</button>
                </td>
              </tr>
              <tr>
                <td>CART-003</td>
                <td><span className="status-abandoned">Abandoned</span></td>
                <td>2</td>
                <td>$8.48</td>
                <td>2025-04-18 11:20</td>
                <td>
                  <button className="btn-view">View</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button>&lt;</button>
          <span>Page 1 of 3</span>
          <button>&gt;</button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CartPage;