import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

export const getMe = (token) => axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
});
