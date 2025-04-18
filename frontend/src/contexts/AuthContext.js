import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Create the context
export const AuthContext = createContext();

// Create a hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the context provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign in method
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
      throw error;
    }
  };

  // Sign out method
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError('Failed to sign out: ' + error.message);
      throw error;
    }
  };

  // Observer for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // The value to be provided to consumers
  const value = {
    currentUser,
    login,
    logout,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};