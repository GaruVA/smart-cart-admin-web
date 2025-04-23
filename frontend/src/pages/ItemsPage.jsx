// src/pages/ItemsPage.jsx
import React, { useState, useEffect } from 'react';
import ItemsList from '../components/items/ItemsList';
import ItemDetail from '../components/items/ItemDetail';
import ItemForm from '../components/items/ItemForm';
import itemsService from '../services/itemsService';
import '../styles/items.css';
import AdminLayout from '../layouts/AdminLayout';


// import itemsService from '../services/itemsService';

const ItemsPage = () => {
  // State management
  const [view, setView] = useState('list'); // 'list', 'detail', 'add', 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemsService.getItems();
        setItems(response.data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  // Function to handle view changes
  const handleViewChange = (newView, itemId = null) => {
    setView(newView);
    if (itemId !== null) {
      setSelectedItemId(itemId);
    }
  };

  // Handle item operations
  const handleAddItem = async (newItem) => {
    try {
      const response = await itemsService.createItem(newItem);
      setItems([...items, response.data]);
      handleViewChange('list');
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      await itemsService.updateItem(updatedItem.id, updatedItem);
      setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
      handleViewChange('list');
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemsService.deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };
  
  // Render the appropriate component based on the view
  const renderView = () => {
    switch (view) {
      case 'detail':
        return <ItemDetail 
                 itemId={selectedItemId}
                 onBack={() => handleViewChange('list')}
                 onEdit={() => handleViewChange('edit', selectedItemId)} 
               />;
      case 'add':
        return <ItemForm 
                 onSave={handleAddItem}
                 onCancel={() => handleViewChange('list')}
               />;
      case 'edit':
        return <ItemForm 
                 itemId={selectedItemId}
                 onSave={handleUpdateItem}
                 onCancel={() => handleViewChange('list')}
               />;
      case 'list':
      default:
        return <ItemsList
          items={items}
          loading={loading}
          error={error}
          onViewDetail={(itemId) => handleViewChange('detail', itemId)}
          onAddNew={() => handleViewChange('add')}
          onEditItem={(itemId) => handleViewChange('edit', itemId)}
          onDeleteItem={handleDeleteItem}
               />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="items-page">
        <div className="page-header">
          <h1>Items Management</h1>
          <button className="btn btn-primary" onClick={() => handleViewChange('add')}>
            <i className="fas fa-plus"></i> Add New Item
          </button>
        </div>
        {renderView()}
      </div>
    </AdminLayout>
  );
};

export default ItemsPage;