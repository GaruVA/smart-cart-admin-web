import axios from 'axios';
import { auth } from './firebase';

// Create axios instance with base URL for API requests
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api/v1' // In production, use relative path
    : 'http://localhost:5000/api/v1' // In development, use backend server URL
});

// Add an interceptor to attach Firebase auth token to each request
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// // API service for items
// export const itemsService = {
//   // Get all items with pagination and filtering
//   getItems: (page = 1, limit = 20, search = '', category = '') => {
//     return api.get(`/items?page=${page}&limit=${limit}&search=${search}&category=${category}`);
//   },
  
//   // Get a single item
//   getItem: (id) => {
//     return api.get(`/items/${id}`);
//   },
  
//   // Create a new item
//   createItem: (itemData) => {
//     return api.post('/items', itemData);
//   },
  
//   // Update an item
//   updateItem: (id, itemData) => {
//     return api.put(`/items/${id}`, itemData);
//   },
  
//   // Delete an item
//   deleteItem: (id) => {
//     return api.delete(`/items/${id}`);
//   }
// };

// // API service for carts
// export const cartsService = {
//   // Get all carts with filtering
//   getCarts: (status = 'all', page = 1, limit = 20) => {
//     return api.get(`/carts?status=${status}&page=${page}&limit=${limit}`);
//   },
  
//   // Get a single cart
//   getCart: (id) => {
//     return api.get(`/carts/${id}`);
//   },
  
//   // Create a new cart
//   createCart: (cartData) => {
//     return api.post('/carts', cartData);
//   },
  
//   // Update a cart
//   updateCart: (id, cartData) => {
//     return api.put(`/carts/${id}`, cartData);
//   },
  
//   // Delete a cart
//   deleteCart: (id) => {
//     return api.delete(`/carts/${id}`);
//   }
// };

// // API service for analytics
// export const analyticsService = {
//   // Get inventory analytics
//   getInventoryAnalytics: () => {
//     return api.get('/analytics/inventory');
//   },
  
//   // Get sales analytics
//   getSalesAnalytics: () => {
//     return api.get('/analytics/sales');
//   },
  
//   // Get cart activity analytics
//   getCartAnalytics: () => {
//     return api.get('/analytics/carts');
//   }
// };

export default api;