import api from './api';

export const fetchWishlist = () => api.get('/wishlist');
export const addToWishlist = (destinationId) => api.post(`/wishlist/${destinationId}`);
export const removeFromWishlist = (destinationId) => api.delete(`/wishlist/${destinationId}`);
