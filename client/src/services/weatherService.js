import api from './api';

export const fetchWeather = (slug) => api.get(`/weather/${slug}`);
