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
  register: (data: Record<string, string>) => apiClient.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => apiClient.post('/api/auth/login', data),
  logout: () => apiClient.post('/api/auth/logout'),
  getCurrentUser: () => apiClient.get('/api/auth/me'),
  updateProfile: (data: Record<string, unknown>) => apiClient.put('/api/auth/profile', data),
};

// Product endpoints
export const productAPI = {
  getAllProducts: (params?: Record<string, unknown>) => apiClient.get('/api/products', { params }),
  getProductById: (id: string) => apiClient.get(`/api/products/${id}`),
  searchProducts: (query: string) => apiClient.get('/api/products/search', { params: { q: query } }),
  getCategories: () => apiClient.get('/api/products/categories'),
  addReview: (productId: string, data: Record<string, unknown>) => apiClient.post(`/api/products/${productId}/reviews`, data),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => apiClient.get('/api/cart'),
  addToCart: (data: { productId: string; quantity: number }) => apiClient.post('/api/cart/add', data),
  updateCartItem: (id: string, data: { quantity: number }) => apiClient.put(`/api/cart/update/${id}`, data),
  removeFromCart: (id: string) => apiClient.delete(`/api/cart/remove/${id}`),
  clearCart: () => apiClient.post('/api/cart/clear'),
};

// Order endpoints
export const orderAPI = {
  getUserOrders: () => apiClient.get('/api/orders'),
  getOrderById: (id: string) => apiClient.get(`/api/orders/${id}`),
  createOrder: (data: Record<string, unknown>) => apiClient.post('/api/orders', data),
  updateOrderStatus: (id: string, data: Record<string, unknown>) => apiClient.put(`/api/orders/${id}/status`, data),
  cancelOrder: (id: string) => apiClient.post(`/api/orders/${id}/cancel`),
};
