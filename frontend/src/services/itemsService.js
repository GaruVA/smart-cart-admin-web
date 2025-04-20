// src/services/itemsService.js
import api from './api';

// API service for items
const itemsService = {
  // Get all items with pagination and filtering
  getItems: (page = 1, limit = 20, search = '', category = '') => {
    return api.get(`/items?page=${page}&limit=${limit}&search=${search}&category=${category}`);
  },
  
  // Get a single item
  getItem: (id) => {
    return api.get(`/items/${id}`);
  },
  
  // Create a new item
  createItem: (itemData) => {
    return api.post('/items', itemData);
  },
  
  // Update an item
  updateItem: (id, itemData) => {
    return api.put(`/items/${id}`, itemData);
  },
  
  // Delete an item
  deleteItem: (id) => {
    return api.delete(`/items/${id}`);
  }
};

export default itemsService;