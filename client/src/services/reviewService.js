import api from './api';

export const fetchReviews = (destinationId) => api.get(`/reviews/destination/${destinationId}`);
export const createReview = (destinationId, payload) => api.post(`/reviews/destination/${destinationId}`, payload);
export const updateReview = (id, payload) => api.put(`/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
