import { db } from '../data/db';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const deliveryService = {
  getAssignedOrders: async (staffId) => {
    await delay(400);
    return db.get('sampleOrders').filter(o => o.deliveryStaffId === staffId && o.type === 'delivery');
  },

  getAllDeliveryOrders: async (staffId) => {
    await delay(400);
    // Return all delivery orders for demo
    return db.get('sampleOrders').filter(o => o.type === 'delivery');
  }
};
