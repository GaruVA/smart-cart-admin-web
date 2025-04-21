import React, { useState, useEffect } from 'react';

// Mock data lookup for carts
const getMockCart = (id) => {
  const mockCarts = [
    { cartId: '1', status: 'online', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-19T08:45:00Z' },
    { cartId: '2', status: 'offline', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-18T16:22:00Z' },
    { cartId: '3', status: 'maintenance', createdAt: '2025-02-20T00:00:00Z', updatedAt: '2025-04-17T11:30:00Z' }
  ];
  return mockCarts.find(c => c.cartId === id);
};

const CartForm = ({ cartId, onSave, onCancel }) => {
  const initialState = { cartId: '', status: '' };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const isEditing = !!cartId;

  useEffect(() => {
    if (isEditing) {
      const cart = getMockCart(cartId);
      if (cart) setFormData({ cartId: cart.cartId, status: cart.status });
    }
  }, [cartId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cartId.trim()) newErrors.cartId = 'Cart ID is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  return (
    <div className="cart-form">
      <h2>{isEditing ? 'Edit Cart' : 'Add New Cart'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cartId">Cart ID</label>
          <input
            type="text"
            id="cartId"
            name="cartId"
            value={formData.cartId}
            onChange={handleChange}
            className={`form-control ${errors.cartId ? 'is-invalid' : ''}`}
            disabled={isEditing}
          />
          {errors.cartId && <div className="invalid-feedback">{errors.cartId}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
          >
            <option value="">Select status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status}</div>}
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Update Cart' : 'Add Cart'}</button>
        </div>
      </form>
    </div>
  );
};

export default CartForm;