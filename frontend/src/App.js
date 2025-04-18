import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Pages
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import CartPage from './pages/CartPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkiTRBqyPUEI2vxOWjxpRvMHLnJ7vm9rU",
  authDomain: "smart-cart-e4ff3.firebaseapp.com",
  projectId: "smart-cart-e4ff3",
  storageBucket: "smart-cart-e4ff3.firebasestorage.app",
  messagingSenderId: "327888803071",
  appId: "1:327888803071:web:e705547e4943ed3e41e8ca",
  measurementId: "G-8GV88SHJMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // eslint-disable-line no-unused-vars

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/items" element={
              <ProtectedRoute>
                <ItemsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/carts" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;