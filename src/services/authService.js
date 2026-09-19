import { apiRequest, tokenStore } from './apiClient';

export const authService = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login/', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    tokenStore.set({ access: data.access, refresh: data.refresh });
    return data.user;
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register/', {
      method: 'POST',
      auth: false,
      body: userData,
    });
    tokenStore.set({ access: data.access, refresh: data.refresh });
    return data.user;
  },

  resetPassword: async (email) => {
    return apiRequest('/auth/reset-password/', {
      method: 'POST',
      auth: false,
      body: { email },
    });
  },

  me: async () => apiRequest('/auth/me/'),

  logout: () => tokenStore.clear(),
};
