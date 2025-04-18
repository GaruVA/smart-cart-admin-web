import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to dashboard after login
  const from = location.state?.from || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirect to the dashboard
      navigate(from);
    } catch (err) {
      console.error('Login error:', err);
      
      // Provide specific error messages
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No admin account found with this email');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError('Failed to log in. Please check your credentials and try again.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-logo">
          <h1>Smart Cart Admin</h1>
        </div>
        
        <div className="admin-login-form-container">
          <h2>Admin Login</h2>
          
          {error && <div className="admin-login-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary admin-login-submit" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="admin-login-footer">
            <p>Admin Portal for Smart Cart Supermarket System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;