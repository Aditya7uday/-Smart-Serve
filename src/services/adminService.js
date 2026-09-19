import { apiRequest } from './apiClient';

export const adminService = {
  getStats: async () => {
    return apiRequest('/admin/stats/');
  },

  getInventory: async () => {
    return apiRequest('/inventory/');
  },

  updateInventoryStock: async (id, newStock) => {
    return apiRequest(`/inventory/${id}/`, { method: 'PATCH', body: { currentStock: newStock } });
  },

  getUsers: async () => {
    return apiRequest('/users/');
  },

  getFeedback: async () => {
    return apiRequest('/reviews/');
  },

  hideFeedback: async (id) => {
    return apiRequest(`/reviews/${id}/toggle_hidden/`, { method: 'PATCH' });
  },
};
