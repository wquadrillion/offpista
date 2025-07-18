import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => localStorage.getItem('token');

// Always set token from localStorage on app load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}
