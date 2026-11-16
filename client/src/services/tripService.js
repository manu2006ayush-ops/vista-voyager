import api from './api';

export const createTrip = (payload) => api.post('/trips', payload);
export const fetchMyTrips = (params) => api.get('/trips', { params });
export const fetchTripById = (id) => api.get(`/trips/${id}`);
export const updateTrip = (id, payload) => api.put(`/trips/${id}`, payload);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);
export const estimateBudget = (payload) => api.post('/trips/estimate-budget', payload);
