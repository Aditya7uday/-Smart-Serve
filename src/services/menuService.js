import { apiRequest } from './apiClient';

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const menuService = {
  getCategories: async () => {
    return apiRequest('/categories/');
  },

  getMenuItems: async ({ categoryId, search, isVeg, sortBy } = {}) => {
    return apiRequest(`/menu-items/${buildQuery({ categoryId, search, isVeg, sortBy })}`);
  },

  getMenuItemById: async (id) => {
    return apiRequest(`/menu-items/${id}/`);
  },

  addMenuItem: async (itemData) => {
    return apiRequest('/menu-items/', { method: 'POST', body: itemData });
  },

  updateMenuItem: async (id, updates) => {
    return apiRequest(`/menu-items/${id}/`, { method: 'PATCH', body: updates });
  },

  deleteMenuItem: async (id) => {
    await apiRequest(`/menu-items/${id}/`, { method: 'DELETE' });
    return true;
  },

  toggleAvailability: async (id) => {
    return apiRequest(`/menu-items/${id}/toggle_availability/`, { method: 'PATCH' });
  },

  getReviewsForItem: async (itemId) => {
    return apiRequest(`/menu-items/${itemId}/reviews/`);
  },
};

export const orderService = {
  getOrdersForUser: async () => {
    return apiRequest('/orders/');
  },

  getAllOrders: async () => {
    return apiRequest('/orders/');
  },

  getOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}/`);
  },

  createOrder: async (orderData) => {
    return apiRequest('/orders/', { method: 'POST', body: orderData });
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/orders/${orderId}/`, { method: 'PATCH', body: { status } });
  },

  assignDeliveryStaff: async (orderId, staffId) => {
    return apiRequest(`/orders/${orderId}/`, { method: 'PATCH', body: { deliveryStaffId: staffId } });
  },

  submitReview: async (reviewData) => {
    return apiRequest('/reviews/', { method: 'POST', body: reviewData });
  },

  getReviews: async () => {
    return apiRequest('/reviews/');
  },
};
