import React, { useState, useEffect } from 'react';
import cartsService from '../services/cartsService';
import CartsList from '../components/carts/CartsList';
import CartDetail from '../components/carts/CartDetail';
import CartForm from '../components/carts/CartForm';
import '../styles/carts.css';
import AdminLayout from '../layouts/AdminLayout';

const CartsPage = () => {
  const [view, setView] = useState('list');
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [carts, setCarts] = useState([]);

  // Mock data for initial development
  const mockCarts = [
    { cartId: '1', status: 'online', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-19T08:45:00Z' },
    { cartId: '2', status: 'offline', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-18T16:22:00Z' },
    { cartId: '3', status: 'maintenance', createdAt: '2025-02-20T00:00:00Z', updatedAt: '2025-04-17T11:30:00Z' }
  ];

  useEffect(() => {
    setCarts(mockCarts);
  }, []);

  const handleViewChange = (newView, cartId = null) => {
    setView(newView);
    if (cartId !== null) setSelectedCartId(cartId);
  };

  const handleAddCart = (newCart) => {
    setCarts([...carts, newCart]);
    handleViewChange('list');
  };

  const handleUpdateCart = (updatedCart) => {
    setCarts(carts.map(c => c.cartId === updatedCart.cartId ? updatedCart : c));
    handleViewChange('list');
  };

  const handleDeleteCart = async (cartId) => {
    if (!window.confirm('Are you sure you want to delete this cart?')) return;
    try {
      await cartsService.deleteCart(cartId);
      setCarts(prev => prev.filter(c => c.cartId !== cartId));
    } catch (err) {
      console.error('Failed to delete cart:', err);
      alert('Error deleting cart. Please try again.');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'detail':
        return <CartDetail 
                 cartId={selectedCartId} 
                 onBack={() => handleViewChange('list')} 
                 onEdit={() => handleViewChange('edit', selectedCartId)}
               />;
      case 'add':
        return <CartForm 
                 onSave={handleAddCart} 
                 onCancel={() => handleViewChange('list')} 
               />;
      case 'edit':
        return <CartForm 
                 cartId={selectedCartId}
                 onSave={handleUpdateCart} 
                 onCancel={() => handleViewChange('list')} 
               />;
      case 'list':
      default:
        return <CartsList 
                 onViewDetail={(id) => handleViewChange('detail', id)}
                 onAddNew={() => handleViewChange('add')}
                 onEditCart={(id) => handleViewChange('edit', id)}
                 onDeleteCart={handleDeleteCart}
               />;
    }
  };

  return (
    <AdminLayout>
      <div className="carts-page">
        <div className="page-header">
          <h1>Carts Management</h1>
          <button className="btn btn-primary" onClick={() => handleViewChange('add')}>
            <i className="fas fa-plus"></i> Add New Cart
          </button>
        </div>
        {renderView()}
      </div>
    </AdminLayout>
  );
};

export default CartsPage;