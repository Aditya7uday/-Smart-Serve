import { apiRequest } from './apiClient';

export const paymentService = {
  createRazorpayOrder: async (amount) => {
    return apiRequest('/payments/create-order/', { method: 'POST', body: { amount } });
  },
};
