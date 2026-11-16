import api from './api';

export const generateItinerary = (payload) => api.post('/itineraries/generate', payload);
export const fetchMyItineraries = () => api.get('/itineraries');
export const fetchItineraryById = (id) => api.get(`/itineraries/${id}`);
export const updateItinerary = (id, payload) => api.put(`/itineraries/${id}`, payload);
export const deleteItinerary = (id) => api.delete(`/itineraries/${id}`);
