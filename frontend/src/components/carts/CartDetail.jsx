import React, { useState, useEffect } from 'react';

// Mock data lookup function
const getMockCart = (id) => {
  const mockCarts = [
    { cartId: '1', status: 'online', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-19T08:45:00Z' },
    { cartId: '2', status: 'offline', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-18T16:22:00Z' },
    { cartId: '3', status: 'maintenance', createdAt: '2025-02-20T00:00:00Z', updatedAt: '2025-04-17T11:30:00Z' }
  ];
  return mockCarts.find(c => c.cartId === id);
};

const CartDetail = ({ cartId, onBack, onEdit }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetched = getMockCart(cartId);
    setCart(fetched);
    setLoading(false);
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
      </div>
    </div>
  );
};

export default CartDetail;