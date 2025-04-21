import React, { useState, useEffect } from 'react';

// Mock data lookup for sessions
const getMockSession = (id) => {
  const mockSessions = [
    { sessionId: 's1', cartId: '1', status: 'active', startedAt: '2025-04-19T09:30:00Z', endedAt: null, totalCost: 7.47 },
    { sessionId: 's2', cartId: '2', status: 'completed', startedAt: '2025-04-18T15:15:00Z', endedAt: '2025-04-18T15:40:00Z', totalCost: 18.46 },
    { sessionId: 's3', cartId: '3', status: 'abandoned', startedAt: '2025-04-18T11:20:00Z', endedAt: null, totalCost: 5.98 }
  ];
  return mockSessions.find(s => s.sessionId === id);
};

const SessionDetail = ({ sessionId, onBack, onEdit }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetched = getMockSession(sessionId);
    setSession(fetched);
    setLoading(false);
  }, [sessionId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!session) {
    return (
      <div className="session-not-found">
        <h3>Session not found</h3>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
  }

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : 'N/A';

  return (
    <div className="session-detail">
      <div className="detail-header">
        <button onClick={onBack} className="btn btn-secondary">Back</button>
        <h2>Session {session.sessionId} Details</h2>
        <button onClick={onEdit} className="btn btn-primary">Edit</button>
      </div>
      <div className="detail-content">
        <div className="detail-section">
          <div className="detail-row">
            <span className="detail-label">Session ID:</span>
            <span className="detail-value">{session.sessionId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Cart ID:</span>
            <span className="detail-value">{session.cartId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">{session.status}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Started At:</span>
            <span className="detail-value">{formatDate(session.startedAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ended At:</span>
            <span className="detail-value">{formatDate(session.endedAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Cost:</span>
            <span className="detail-value">${session.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;