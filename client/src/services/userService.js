import api from './api';

export const updateProfile = (payload) => api.put('/users/profile', payload);
export const fetchDashboard = () => api.get('/users/dashboard');
