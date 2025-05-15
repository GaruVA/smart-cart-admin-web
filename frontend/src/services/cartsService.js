import api from './api';

// API service for carts
const cartsService = {
  // Get all carts with pagination and optional status filtering
  getCarts: (page = 1, limit = 20, status = '') => {
    const statusQuery = status ? `&status=${status}` : '';
    return api.get(`/carts?page=${page}&limit=${limit}${statusQuery}`);
  },

  // Get a single cart by ID
  getCart: (id) => {
    return api.get(`/carts/${id}`);
  },

  // Get logs for a specific cart
  getCartLogs: (cartId) => {
    return api.get(`/carts/${cartId}/logs`);
  },

  // Create a new cart
  createCart: (cartData) => {
    return api.post('/carts', cartData);
  },

  // Update an existing cart
  updateCart: (id, cartData) => {
    return api.put(`/carts/${id}`, cartData);
  },

  // Delete a cart by ID
  deleteCart: (id) => {
    return api.delete(`/carts/${id}`);
  }
};

export default cartsService;
