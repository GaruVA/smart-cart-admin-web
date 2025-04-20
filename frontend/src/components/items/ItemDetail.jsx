// src/components/items/ItemDetail.jsx
import React, { useState, useEffect } from 'react';

// Temporary mock data lookup function
const getMockItem = (id) => {
  const mockItems = [
    { id: '8901234567890', name: 'Apple', category: 'Fruits', price: 2.99, stockQuantity: 150, description: 'Fresh red apples', createdAt: '2023-04-15T12:00:00Z', updatedAt: '2023-06-20T14:30:00Z' },
    { id: '8901234567891', name: 'Milk', category: 'Dairy', price: 3.49, stockQuantity: 75, description: '1 gallon whole milk', createdAt: '2023-03-10T09:00:00Z', updatedAt: '2023-07-05T16:45:00Z' },
    { id: '8901234567892', name: 'Bread', category: 'Bakery', price: 2.50, stockQuantity: 50, description: 'Whole wheat bread', createdAt: '2023-05-22T10:15:00Z', updatedAt: '2023-06-18T11:20:00Z' },
    { id: '8901234567893', name: 'Chicken', category: 'Meat', price: 7.99, stockQuantity: 30, description: 'Boneless chicken breast', createdAt: '2023-02-28T14:30:00Z', updatedAt: '2023-07-10T09:30:00Z' },
    { id: '8901234567894', name: 'Rice', category: 'Grains', price: 4.99, stockQuantity: 100, description: 'Basmati rice 2kg', createdAt: '2023-01-15T11:45:00Z', updatedAt: '2023-06-30T13:15:00Z' }
  ];
  return mockItems.find(item => item.id === id);
};

const ItemDetail = ({ itemId, onBack, onEdit }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch item details
  useEffect(() => {
    // In future this would be an API call
    const fetchedItem = getMockItem(itemId);
    setItem(fetchedItem);
    setLoading(false);
  }, [itemId]);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!item) {
    return (
      <div className="item-not-found">
        <h3>Item not found</h3>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
  }
  
  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="item-detail">
      <div className="detail-header">
        <button onClick={onBack} className="btn btn-secondary">Back</button>
        <h2>{item.name} Details</h2>
        <button onClick={onEdit} className="btn btn-primary">Edit</button>
      </div>
      
      <div className="detail-content">
        <div className="detail-section">
          <div className="detail-row">
            <span className="detail-label">Barcode ID:</span>
            <span className="detail-value">{item.id}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{item.name}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{item.category}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Price:</span>
            <span className="detail-value">${item.price.toFixed(2)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Stock Quantity:</span>
            <span className="detail-value">{item.stockQuantity}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{item.description}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(item.createdAt)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Last Updated:</span>
            <span className="detail-value">{formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;