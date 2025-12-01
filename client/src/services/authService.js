import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api/auth`;

const authService = {
  signup: (username, email, password) => {
    return axios.post(`${API_URL}/signup`, {
      username,
      email,
      password
    });
  },

  login: (email, password) => {
    return axios.post(`${API_URL}/login`, {
      email,
      password
    });
  },

  getCurrentUser: (token) => {
    return axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
