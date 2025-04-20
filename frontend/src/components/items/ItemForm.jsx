// src/components/items/ItemForm.jsx
import React, { useState, useEffect } from 'react';

// Temporary mock data lookup function
const getMockItem = (id) => {
  const mockItems = [
    { id: '8901234567890', name: 'Apple', category: 'Fruits', price: 2.99, stockQuantity: 150, description: 'Fresh red apples' },
    { id: '8901234567891', name: 'Milk', category: 'Dairy', price: 3.49, stockQuantity: 75, description: '1 gallon whole milk' },
    { id: '8901234567892', name: 'Bread', category: 'Bakery', price: 2.50, stockQuantity: 50, description: 'Whole wheat bread' },
    { id: '8901234567893', name: 'Chicken', category: 'Meat', price: 7.99, stockQuantity: 30, description: 'Boneless chicken breast' },
    { id: '8901234567894', name: 'Rice', category: 'Grains', price: 4.99, stockQuantity: 100, description: 'Basmati rice 2kg' }
  ];
  return mockItems.find(item => item.id === id);
};

const ItemForm = ({ itemId, onSave, onCancel }) => {
  // Initial empty form state
  const initialFormState = {
    id: '',
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(!!itemId);
  
  // Load item data if editing
  useEffect(() => {
    if (itemId) {
      // In future this would be an API call
      const itemToEdit = getMockItem(itemId);
      if (itemToEdit) {
        setFormData(itemToEdit);
      }
    }
  }, [itemId]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) {
      newErrors.id = 'Barcode ID is required';
    } else if (!/^\d{13}$/.test(formData.id)) {
      newErrors.id = 'Barcode must be a 13-digit number';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In future this would be an API call
      console.log('Saving item:', formData);
      onSave(formData);
    }
  };
  
  return (
    <div className="item-form">
      <h2>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">Barcode ID</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
            disabled={isEditing} // Can't edit barcode if editing
          />
          {errors.id && <div className="invalid-feedback">{errors.id}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
          />
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="stockQuantity">Stock Quantity</label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
          />
          {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;