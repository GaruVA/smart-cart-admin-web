import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to match your backend's base URL
});

// API service for sessions
const sessionsService = {
  // Get all sessions with pagination and optional status filtering
  getSessions: (page = 1, limit = 20, status = '') => {
    const statusQuery = status ? `&status=${status}` : '';
    return api.get(`/sessions?page=${page}&limit=${limit}${statusQuery}`);
  },

  // Get a single session by ID
  getSession: (id) => {
    return api.get(`/sessions/${id}`);
  },

  // Create a new session
  createSession: (sessionData) => {
    return api.post('/sessions', sessionData);
  },

  // Update an existing session
  updateSession: (id, sessionData) => {
    return api.put(`/sessions/${id}`, sessionData);
  },

  // Delete a session by ID
  deleteSession: (id) => {
    return api.delete(`/sessions/${id}`);
  }
};

export default sessionsService;