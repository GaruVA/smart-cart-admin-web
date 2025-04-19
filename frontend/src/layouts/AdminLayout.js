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
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Please log in to access the admin portal...</p>
      </div>
    );
  }

  // Map of navigation items with their icons
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/items', label: 'Inventory', icon: '📦' },
    { path: '/admin/carts', label: 'Carts', icon: '🛒' },
    { path: '/admin/sessions', label: 'Sessions', icon: '🔄' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-header-logo">
            <h1>
              <span className="logo-icon">🛒</span>
              <span className="logo-text">Smart-Cart Admin Portal</span>
            </h1>
          </div>
        </div>
        <div className="admin-header-user">
          <div className="user-info">
            <span className="user-email">{currentUser.email}</span>
            <span className="user-role">Administrator</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={
                      (item.path === '/admin/dashboard' && 
                       (location.pathname === '/admin/dashboard' || location.pathname === '/admin')) ||
                      (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
                        ? 'active'
                        : ''
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="sidebar-footer">
            <div className="app-version">v1.2.0</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;