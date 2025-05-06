import React, { useState, useEffect } from 'react';
import sessionsService from '../../services/sessionsService'; // Import the service

const SessionDetail = ({ sessionId, onBack, onEdit }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: for more specific error handling

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError('No session ID provided.');
      setSession(null);
      return;
    }

    const fetchSessionDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await sessionsService.getSession(sessionId);
        setSession(response.data);
      } catch (err) {
        console.error('Error fetching session details:', err);
        setError(err.message || 'Failed to fetch session details.');
        setSession(null); // Ensure session is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) return <div className="loading">Loading session details...</div>;
  if (error) {
    return (
      <div className="session-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="session-not-found">
        <h3>Session not found</h3>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // Handle Firestore Timestamp (defensive)
    if (dateStr.toDate && typeof dateStr.toDate === 'function') {
      const dObj = dateStr.toDate();
      return !isNaN(dObj.getTime()) ? dObj.toLocaleString() : 'Invalid Date';
    }
    // Handle ISO string or number
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toLocaleString() : 'Invalid Date';
  };

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
            {/* Add a check for totalCost before calling toFixed */}
            <span className="detail-value">
              {typeof session.totalCost === 'number'
                ? `$${session.totalCost.toFixed(2)}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;