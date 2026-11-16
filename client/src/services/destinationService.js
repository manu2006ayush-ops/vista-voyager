import api from './api';

export const fetchDestinations = (params) => api.get('/destinations', { params });
export const fetchDestinationBySlug = (slug) => api.get(`/destinations/${slug}`);
export const fetchFeaturedDestinations = () => api.get('/destinations/featured/top');
export const fetchFilterMeta = () => api.get('/destinations/meta/filters');
export const fetchRecommendations = () => api.get('/destinations/recommendations/for-you');
export const createDestination = (payload) => api.post('/destinations', payload);
export const updateDestination = (id, payload) => api.put(`/destinations/${id}`, payload);
export const deleteDestination = (id) => api.delete(`/destinations/${id}`);
