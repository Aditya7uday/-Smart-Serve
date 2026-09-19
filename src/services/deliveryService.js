import { apiRequest } from './apiClient';

export const deliveryService = {
  getAssignedOrders: async () => {
    return apiRequest('/orders/?assigned=me');
  },

  getAllDeliveryOrders: async () => {
    return apiRequest('/orders/');
  },
};
