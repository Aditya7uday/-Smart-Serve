import * as mockData from './mockData';

export const db = {
  get: (key) => {
    try {
      const data = localStorage.getItem(`smartserve_${key}`);
      if (data) return JSON.parse(data);
      
      // Initialize if empty
      const initialData = mockData[key];
      localStorage.setItem(`smartserve_${key}`, JSON.stringify(initialData));
      return initialData;
    } catch (e) {
      console.error('DB Read Error:', e);
      return mockData[key];
    }
  },
  set: (key, data) => {
    try {
      localStorage.setItem(`smartserve_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('DB Write Error:', e);
    }
  }
};
