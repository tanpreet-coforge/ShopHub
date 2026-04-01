import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  logout: () => apiClient.post('/api/auth/logout'),
  getCurrentUser: () => apiClient.get('/api/auth/me'),
  updateProfile: (data) => apiClient.put('/api/auth/profile', data),
};

// Product endpoints
export const productAPI = {
  getAllProducts: (params) => apiClient.get('/api/products', { params }),
  getProductById: (id) => apiClient.get(`/api/products/${id}`),
  searchProducts: (query) => apiClient.get('/api/products/search', { params: { q: query } }),
  getCategories: () => apiClient.get('/api/products/categories'),
  addReview: (productId, data) => apiClient.post(`/api/products/${productId}/reviews`, data),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => apiClient.get('/api/cart'),
  addToCart: (data) => apiClient.post('/api/cart/add', data),
  updateCartItem: (id, data) => apiClient.put(`/api/cart/update/${id}`, data),
  removeFromCart: (id) => apiClient.delete(`/api/cart/remove/${id}`),
  clearCart: () => apiClient.post('/api/cart/clear'),
};

// Order endpoints
export const orderAPI = {
  getUserOrders: () => apiClient.get('/api/orders'),
  getOrderById: (id) => apiClient.get(`/api/orders/${id}`),
  createOrder: (data) => apiClient.post('/api/orders', data),
  updateOrderStatus: (id, data) => apiClient.put(`/api/orders/${id}/status`, data),
  cancelOrder: (id) => apiClient.post(`/api/orders/${id}/cancel`),
};
