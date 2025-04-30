import React, { useState, useEffect } from 'react';
import cartsService from '../../services/cartsService';

const CartDetail = ({ cartId, onBack, onEdit }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchCart();
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