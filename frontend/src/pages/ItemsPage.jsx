// src/pages/ItemsPage.jsx
import React, { useState, useEffect } from 'react';
import ItemsList from '../components/items/ItemsList';
import ItemDetail from '../components/items/ItemDetail';
import ItemForm from '../components/items/ItemForm';
import '../styles/items.css';
import AdminLayout from '../layouts/AdminLayout';

// In future, import the actual service
// import itemsService from '../services/itemsService';

const ItemsPage = () => {
  // State management
  const [view, setView] = useState('list'); // 'list', 'detail', 'add', 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  
  // Mock data for initial development
  const mockItems = [
    { id: '8901234567890', name: 'Apple', category: 'Fruits', price: 2.99, stockQuantity: 150, description: 'Fresh red apples' },
    { id: '8901234567891', name: 'Milk', category: 'Dairy', price: 3.49, stockQuantity: 75, description: '1 gallon whole milk' },
    { id: '8901234567892', name: 'Bread', category: 'Bakery', price: 2.50, stockQuantity: 50, description: 'Whole wheat bread' },
    { id: '8901234567893', name: 'Chicken', category: 'Meat', price: 7.99, stockQuantity: 30, description: 'Boneless chicken breast' },
    { id: '8901234567894', name: 'Rice', category: 'Grains', price: 4.99, stockQuantity: 100, description: 'Basmati rice 2kg' }
  ];
  
  // Load items on component mount
  useEffect(() => {
    // In future, this would be an API call
    // const fetchItems = async () => {
    //   try {
    //     const response = await itemsService.getItems();
    //     setItems(response.data);
    //   } catch (error) {
    //     console.error('Error fetching items:', error);
    //   }
    // };
    // fetchItems();
    
    setItems(mockItems);
  }, []);
  
  // Function to handle view changes
  const handleViewChange = (newView, itemId = null) => {
    setView(newView);
    if (itemId !== null) {
      setSelectedItemId(itemId);
    }
  };
  
  // Handle item operations
  const handleAddItem = (newItem) => {
    // In future, this would be an API call
    // const addItem = async (item) => {
    //   try {
    //     const response = await itemsService.createItem(item);
    //     setItems([...items, response.data]);
    //   } catch (error) {
    //     console.error('Error adding item:', error);
    //   }
    // };
    // addItem(newItem);
    
    setItems([...items, newItem]);
    handleViewChange('list');
  };
  
  const handleUpdateItem = (updatedItem) => {
    // In future, this would be an API call
    // const updateItem = async (item) => {
    //   try {
    //     await itemsService.updateItem(item.id, item);
    //     setItems(items.map(i => i.id === item.id ? item : i));
    //   } catch (error) {
    //     console.error('Error updating item:', error);
    //   }
    // };
    // updateItem(updatedItem);
    
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    handleViewChange('list');
  };
  
  const handleDeleteItem = (itemId) => {
    // In future, this would be an API call
    // const deleteItem = async (id) => {
    //   try {
    //     await itemsService.deleteItem(id);
    //     setItems(items.filter(item => item.id !== id));
    //   } catch (error) {
    //     console.error('Error deleting item:', error);
    //   }
    // };
    // deleteItem(itemId);
    
    setItems(items.filter(item => item.id !== itemId));
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