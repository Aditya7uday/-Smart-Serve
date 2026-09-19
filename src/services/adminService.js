import { db } from '../data/db';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  getStats: async () => {
    await delay(400);
    const today = new Date().toDateString();
    const sampleOrders = db.get('sampleOrders');
    const inventory = db.get('inventory');
    const users = db.get('users');
    
    const todayOrders = sampleOrders.filter(o => new Date(o.timestamp).toDateString() === today);
    const pendingOrders = sampleOrders.filter(o => !['Delivered', 'Collected', 'Cancelled'].includes(o.status));
    const revenue = sampleOrders.filter(o => ['Delivered', 'Collected'].includes(o.status)).reduce((sum, o) => sum + o.total, 0);
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock);
    
    return {
      totalUsers: users.length,
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      revenue,
      lowStockCount: lowStock.length,
    };
  },

  getInventory: async () => {
    await delay(300);
    const inventory = db.get('inventory');
    return inventory.map(item => ({
      ...item,
      status: item.currentStock === 0 ? 'Out of Stock' : item.currentStock <= item.minStock ? 'Low Stock' : 'In Stock',
    }));
  },

  updateInventoryStock: async (id, newStock) => {
    await delay(400);
    const inventory = db.get('inventory');
    const item = inventory.find(i => i.id === id);
    if (!item) throw new Error('Item not found');
    item.currentStock = newStock;
    db.set('inventory', inventory);
    return { ...item, status: newStock === 0 ? 'Out of Stock' : newStock <= item.minStock ? 'Low Stock' : 'In Stock' };
  },

  getUsers: async () => {
    await delay(300);
    const users = db.get('users');
    return users.map(({ password: _, ...u }) => u);
  },

  getFeedback: async () => {
    await delay(300);
    return db.get('reviews');
  },

  hideFeedback: async (id) => {
    await delay(300);
    const reviews = db.get('reviews');
    const review = reviews.find(r => r.id === id);
    if (review) review.hidden = !review.hidden;
    db.set('reviews', reviews);
    return review;
  },
};
