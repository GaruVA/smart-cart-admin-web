import React, { useState, useEffect } from 'react';

const CartsList = ({ carts: initialCarts, onViewDetail, onAddNew, onEditCart, onDeleteCart }) => {
  const [carts, setCarts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'cartId', direction: 'ascending' });

  useEffect(() => {
    setCarts(initialCarts);
    setFiltered(initialCarts);
  }, [initialCarts]);

  useEffect(() => {
    let results = statusFilter ? carts.filter(c => c.status === statusFilter) : carts;
    results = sortItems(results);
    setFiltered(results);
  }, [statusFilter, carts, sortConfig]);

  const clearFilter = () => setStatusFilter('');

  const formatDate = date => {
    if (!date) return '';
    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleString();
    }
    // Fallback for ISO string or number
    return new Date(date).toLocaleString();
  };

  // Sorting handlers
  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortItems = itemsToSort => {
    return [...itemsToSort].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <div className="carts-list">
      <div className="carts-filters">
        <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button onClick={clearFilter} className="btn btn-outline-secondary">Clear Filter</button>
      </div>
      {/* Carts Table */}
      <div className="carts-table">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => requestSort('cartId')}>
              Cart ID {sortConfig.key === 'cartId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('createdAt')}>
              Created {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('updatedAt')}>
              Updated {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(cart => (
            <tr key={cart.cartId}>
              <td>{cart.cartId}</td>
              <td>{cart.status}</td>
              <td>{formatDate(cart.createdAt)}</td>
              <td>{formatDate(cart.updatedAt)}</td>
              <td className="action-buttons">
                <button onClick={() => onViewDetail(cart.cartId)} className="btn btn-sm btn-info">View</button>
                <button onClick={() => onEditCart(cart.cartId)} className="btn btn-sm btn-warning">Edit</button>
                <button onClick={() => onDeleteCart(cart.cartId)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default CartsList;