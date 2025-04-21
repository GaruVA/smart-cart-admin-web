import React, { useState, useEffect } from 'react';

// Mock data for sessions
const mockSessions = [
  { sessionId: 's1', cartId: '1', status: 'active', startedAt: '2025-04-19T09:30:00Z', endedAt: null, totalCost: 7.47 },
  { sessionId: 's2', cartId: '2', status: 'completed', startedAt: '2025-04-18T15:15:00Z', endedAt: '2025-04-18T15:40:00Z', totalCost: 18.46 },
  { sessionId: 's3', cartId: '3', status: 'abandoned', startedAt: '2025-04-18T11:20:00Z', endedAt: null, totalCost: 5.98 }
];

const SessionsList = ({ onViewDetail }) => {
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sessionId', direction: 'ascending' });

  useEffect(() => {
    setSessions(mockSessions);
    setFiltered(mockSessions);
  }, []);

  useEffect(() => {
    let results = statusFilter ? sessions.filter(s => s.status === statusFilter) : sessions;
    results = sortItems(results);
    setFiltered(results);
  }, [statusFilter, sessions, sortConfig]);

  const clearFilter = () => setStatusFilter('');

  const formatDate = dt => dt ? new Date(dt).toLocaleString() : 'N/A';

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
        {/* No add option for sessions */}
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
              <td>${s.totalCost.toFixed(2)}</td>
              <td className="action-buttons">
                <button onClick={() => onViewDetail(s.sessionId)} className="btn btn-sm btn-info">View</button>
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