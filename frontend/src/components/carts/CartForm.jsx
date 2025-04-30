import React, { useState, useEffect } from 'react';
import cartsService from '../../services/cartsService';

const CartForm = ({ cartId, onSave, onCancel }) => {
  const initialState = { status: '' };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const isEditing = !!cartId;

  useEffect(() => {
    if (isEditing) {
      (async () => {
        try {
          const response = await cartsService.getCart(cartId);
          setFormData({ status: response.data.status });
        } catch (error) {
          console.error('Error fetching cart for edit:', error);
        }
      })();
    }
  }, [cartId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditing) {
        onSave({ cartId, status: formData.status });
      } else {
        onSave({ status: formData.status });
      }
    }
  };

  return (
    <div className="cart-form">
      <h2>{isEditing ? 'Edit Cart' : 'Add New Cart'}</h2>
      <form onSubmit={handleSubmit}>
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