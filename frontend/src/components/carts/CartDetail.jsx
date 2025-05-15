import React, { useState, useEffect } from 'react';
import cartsService from '../../services/cartsService';

const CartDetail = ({ cartId, onBack, onEdit }) => {  const [cart, setCart] = useState(null);
  const [cartLogs, setCartLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartsService.getCart(cartId);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartLogs = async () => {
    setLoadingLogs(true);
    setLogsError(null);
    try {
      const response = await cartsService.getCartLogs(cartId);
      setCartLogs(response.data || []);
    } catch (error) {
      console.error('Error fetching cart logs:', error);
      setLogsError('Failed to load cart logs. Please try again.');
      setCartLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCartLogs();
  }, [cartId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!cart) {
    return (
      <div className="cart-not-found">
        <h3>Cart not found</h3>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
  }
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();
  
  // Helper function to display item details in a readable format
  const formatItemDetails = (details) => {
    if (!details) return 'No details available';
    
    if (details.itemId && details.name) {
      return `${details.name} (${details.itemId})${details.quantity ? ` × ${details.quantity}` : ''}`;
    } else if (details.itemCount) {
      return `Items: ${details.itemCount}, Value: $${details.totalValue?.toFixed(2) || '0.00'}`;
    }
    
    return JSON.stringify(details);
  };

  return (
    <div className="cart-detail">
      <div className="detail-header">
        <button onClick={onBack} className="btn btn-secondary">Back</button>
        <h2>Cart {cart.cartId} Details</h2>
        <button onClick={onEdit} className="btn btn-primary">Edit</button>
      </div>
      <div className="detail-content">
        <div className="detail-section">
          <div className="detail-row">
            <span className="detail-label">Cart ID:</span>
            <span className="detail-value">{cart.cartId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">{cart.status}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(cart.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Updated:</span>
            <span className="detail-value">{formatDate(cart.updatedAt)}</span>
          </div>
        </div>
          <div className="logs-section">
          <div className="logs-header-row">
            <h3 className="logs-header">Cart Activity Logs</h3>
            {!loadingLogs && logsError && (
              <button onClick={fetchCartLogs} className="btn btn-sm btn-outline-primary refresh-logs">
                <i className="icon-refresh"></i> Retry
              </button>
            )}
          </div>
          
          {loadingLogs ? (
            <div className="loading-logs">Loading cart logs...</div>
          ) : logsError ? (
            <div className="logs-error">
              <p>{logsError}</p>
            </div>
          ) : cartLogs.length === 0 ? (
            <div className="no-logs">No activity logs found for this cart</div>
          ) : (
            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {cartLogs.map((log) => (
                    <tr key={log.logId}>
                      <td data-label="Timestamp">{formatDate(log.timestamp)}</td>
                      <td data-label="Action">
                        <span className={`action-badge ${log.action ? log.action.toLowerCase() : 'unknown'}`}>
                          {log.action ? log.action.replace(/_/g, ' ') : 'Unknown'}
                        </span>
                      </td>
                      <td data-label="Details">{formatItemDetails(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDetail;