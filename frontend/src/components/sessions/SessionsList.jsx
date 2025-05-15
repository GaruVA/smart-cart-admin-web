import React, { useState, useEffect } from 'react';

const SessionsList = ({ sessions, loading, onViewDetail, onAddNew, onEditSession, onDeleteSession }) => {
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sessionId', direction: 'ascending' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSession, setNewSession] = useState({
    status: 'active',
    cartId: '',
    items: [{ itemId: '', quantity: 1 }]
  });

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

  const handleAddSession = () => {
    if (onAddNew) onAddNew(newSession);
    setShowAddModal(false);
    setNewSession({
      status: 'active',
      cartId: '',
      items: [{ itemId: '', quantity: 1 }]
    });
  };

  const handleItemChange = (idx, field, value) => {
    const updatedItems = [...newSession.items];
    updatedItems[idx][field] = value;
    setNewSession({ ...newSession, items: updatedItems });
  };

  const addItemRow = () => {
    setNewSession({ ...newSession, items: [...newSession.items, { itemId: '', quantity: 1 }] });
  };

  const removeItemRow = (idx) => {
    const updatedItems = newSession.items.filter((_, i) => i !== idx);
    setNewSession({ ...newSession, items: updatedItems });
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
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-outline-primary"
          style={{ marginLeft: '8px' }}
        >
          Add New Session
        </button>
      </div>
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 350 }}>
            <h3>Add New Session</h3>
            <div>
              <label>Status:&nbsp;</label>
              <select
                value={newSession.status}
                onChange={e => setNewSession({ ...newSession, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Cart ID:&nbsp;</label>
              <input
                type="text"
                value={newSession.cartId}
                onChange={e => setNewSession({ ...newSession, cartId: e.target.value })}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Items:</label>
              <table style={{ width: '100%', marginTop: 4 }}>
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {newSession.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          value={item.itemId}
                          onChange={e => handleItemChange(idx, 'itemId', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                        />
                      </td>
                      <td>
                        {newSession.items.length > 1 && (
                          <button type="button" onClick={() => removeItemRow(idx)}>Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addItemRow} style={{ marginTop: 4 }}>Add Item</button>
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-success" onClick={handleAddSession}>Add Session</button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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