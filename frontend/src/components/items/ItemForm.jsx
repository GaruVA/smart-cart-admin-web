// src/components/items/ItemForm.jsx
import React, { useState, useEffect } from 'react';
import itemsService from '../../services/itemsService';

const ItemForm = ({ itemId, onSave, onCancel }) => {
  // Initial empty form state
  const initialFormState = {
    id: '',
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    weight: '',
    description: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(!!itemId);
  const [loading, setLoading] = useState(false);
  
  // Load item data if editing
  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          setLoading(true);
          const response = await itemsService.getItem(itemId);
          setFormData({
            ...response.data,
            // Convert to strings for form inputs
            price: response.data.price.toString(),
            stockQuantity: response.data.stockQuantity.toString()
          });
        } catch (err) {
          console.error('Error fetching item for edit:', err);
          alert('Failed to load item data. Please try again.');
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      
      fetchItem();
    }
  }, [itemId, onCancel]);
  
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
    
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    try {
      setLoading(true);
      
      // Convert string values to numbers
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        weight: formData.weight ? parseInt(formData.weight) : null
      };
      
      await onSave(itemData);
    } catch (err) {
      console.error('Error saving item:', err);
    } finally {
      setLoading(false);
    }
  }
};

if (loading && isEditing) {
  return <div className="loading">Loading...</div>;
}
  
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
          <label htmlFor="weight">Weight (grams)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="1"
            min="0"
            className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
          />
          {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
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