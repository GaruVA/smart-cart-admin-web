import React, { useState, useEffect } from 'react';

const SessionsList = ({ sessions, loading, onViewDetail, onAddNew, onEditSession, onDeleteSession }) => {
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sessionId', direction: 'ascending' });

  useEffect(() => {
    setFiltered(sessions);
  }, [sessions]);

  useEffect(() => {
    let results = statusFilter ? sessions.filter(s => s.status === statusFilter) : sessions;
    results = sortItems(results);
    setFiltered(results);
  }, [statusFilter, sessions, sortConfig]);

  const clearFilter = () => setStatusFilter('');

  const formatDate = date => {
    if (!date) return 'N/A';
    // Handle Firestore Timestamp (defensive, less likely needed if backend sends ISO)
    if (date.toDate && typeof date.toDate === 'function') {
      const dObj = date.toDate();
      return !isNaN(dObj.getTime()) ? dObj.toLocaleString() : 'Invalid Date';
    }
    // Handle ISO string or number
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toLocaleString() : 'Invalid Date';
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
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div className="sessions-list">
      <div className="sessions-filters">
        <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="abandoned">Abandoned</option>
        </select>
        <button onClick={clearFilter} className="btn btn-outline-secondary">Clear Filter</button>
        <button onClick={() => onAddNew({ name: 'New Session', status: 'active' })} className="btn btn-outline-primary">Add New Session</button>
      </div>
      {/* Carts Table */}
      <div className="sessions-table">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => requestSort('sessionId')}>
              Session ID {sortConfig.key === 'sessionId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('cartId')}>
              Cart ID {sortConfig.key === 'cartId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('startedAt')}>
              Started {sortConfig.key === 'startedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('endedAt')}>
              Ended {sortConfig.key === 'endedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('totalCost')}>
              Total Cost {sortConfig.key === 'totalCost' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.sessionId}>
              <td>{s.sessionId}</td>
              <td>{s.cartId}</td>
              <td>{s.status}</td>
              <td>{formatDate(s.startedAt)}</td>
              <td>{formatDate(s.endedAt)}</td>
              {/* Add a check for totalCost before calling toFixed */}
              <td>
                {typeof s.totalCost === 'number'
                  ? `$${s.totalCost.toFixed(2)}`
                  : 'N/A'}
              </td>
              <td className="action-buttons">
                <button onClick={() => onViewDetail(s.sessionId)} className="btn btn-sm btn-info">View</button>
                <button onClick={() => onEditSession(s.sessionId, { name: 'Updated Name' })} className="btn btn-sm btn-warning">Edit</button>
                <button onClick={() => onDeleteSession(s.sessionId)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default SessionsList;