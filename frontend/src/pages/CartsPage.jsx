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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await cartsService.getCarts();
        setCarts(response.data); // Assuming backend sends { data: [...] }
      } catch (error) {
        console.error('Failed to fetch carts:', error);
        alert('Error loading carts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const handleViewChange = (newView, cartId = null) => {
    setView(newView);
    if (cartId !== null) setSelectedCartId(cartId);
  };

  const handleAddCart = async (newCart) => {
    try {
      const response = await cartsService.createCart(newCart);
      setCarts([...carts, response.data]);
      handleViewChange('list');
    } catch (error) {
      console.error('Failed to add cart:', error);
      alert('Error adding cart. Please try again.');
    }
  };

  const handleUpdateCart = async (updatedCart) => {
    try {
      const response = await cartsService.updateCart(updatedCart.cartId, updatedCart);
      setCarts(carts.map(c => c.cartId === updatedCart.cartId ? response.data : c));
      handleViewChange('list');
    } catch (error) {
      console.error('Failed to update cart:', error);
      alert('Error updating cart. Please try again.');
    }
  };

  const handleDeleteCart = async (cartId) => {
    if (!window.confirm('Are you sure you want to delete this cart?')) return;
    try {
      await cartsService.deleteCart(cartId);
      setCarts(prev => prev.filter(c => c.cartId !== cartId));
    } catch (error) {
      console.error('Failed to delete cart:', error);
      alert('Error deleting cart. Please try again.');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'detail':
        return (
          <CartDetail 
            cartId={selectedCartId} 
            onBack={() => handleViewChange('list')} 
            onEdit={() => handleViewChange('edit', selectedCartId)}
          />
        );
      case 'add':
        return (
          <CartForm 
            onSave={handleAddCart} 
            onCancel={() => handleViewChange('list')} 
          />
        );
      case 'edit':
        return (
          <CartForm 
            cartId={selectedCartId}
            onSave={handleUpdateCart} 
            onCancel={() => handleViewChange('list')} 
          />
        );
      case 'list':
      default:
        return (
          <CartsList 
            carts={carts} // <-- Pass the carts here
            onViewDetail={(id) => handleViewChange('detail', id)}
            onAddNew={() => handleViewChange('add')}
            onEditCart={(id) => handleViewChange('edit', id)}
            onDeleteCart={handleDeleteCart}
          />
        );
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
