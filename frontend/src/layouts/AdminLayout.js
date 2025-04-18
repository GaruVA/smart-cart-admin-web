import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminStyles.css';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return <div className="loading">Please log in to access the admin portal...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-logo">
          <h1>Smart Cart Admin</h1>
        </div>
        <div className="admin-header-user">
          <span>{currentUser.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/items" 
                  className={location.pathname.startsWith('/admin/items') ? 'active' : ''}
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/carts" 
                  className={location.pathname.startsWith('/admin/carts') ? 'active' : ''}
                >
                  Carts
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/analytics" 
                  className={location.pathname.startsWith('/admin/analytics') ? 'active' : ''}
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;