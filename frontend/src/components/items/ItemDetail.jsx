// src/components/items/ItemDetail.jsx
import React, { useState, useEffect } from 'react';
import itemsService from '../../services/itemsService';

const ItemDetail = ({ itemId, onBack, onEdit }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await itemsService.getItem(itemId);
        setItem(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [itemId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="item-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={onBack} className="btn btn-primary">Back to List</button>
      </div>
    );
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
    // Handle Firestore timestamp objects
    if (dateString && typeof dateString === 'object' && dateString.seconds) {
      const date = new Date(dateString.seconds * 1000);
      return date.toLocaleString();
    }
    // Handle ISO strings
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
          </div>            <div className="detail-row">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{item.weight ? `${item.weight} kg` : 'N/A'}</span>
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