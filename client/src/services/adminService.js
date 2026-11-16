import api from './api';

export const fetchAnalytics = () => api.get('/admin/analytics');
export const fetchAllUsers = (params) => api.get('/admin/users', { params });
export const updateUserAdmin = (id, payload) => api.put(`/admin/users/${id}`, payload);
export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);
export const fetchAllDestinationsAdmin = () => api.get('/admin/destinations');
