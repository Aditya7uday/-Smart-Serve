import { db } from '../data/db';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  getCategories: async () => {
    await delay(300);
    return db.get('categories');
  },

  getMenuItems: async ({ categoryId, search, isVeg, sortBy } = {}) => {
    await delay(400);
    let items = db.get('menuItems');
    if (categoryId) items = items.filter(i => i.categoryId === categoryId);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (isVeg === true) items = items.filter(i => i.isVeg);
    if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);
    return items;
  },

  getMenuItemById: async (id) => {
    await delay(200);
    const item = db.get('menuItems').find(i => i.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  },

  // Admin CRUD operations
  addMenuItem: async (itemData) => {
    await delay(300);
    const items = db.get('menuItems');
    const newItem = { id: `m${Date.now()}`, ...itemData, rating: 0, reviews: 0, customizations: [] };
    items.unshift(newItem);
    db.set('menuItems', items);
    return newItem;
  },

  updateMenuItem: async (id, updates) => {
    await delay(300);
    const items = db.get('menuItems');
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    const updatedItem = { ...items[idx], ...updates };
    items[idx] = updatedItem;
    db.set('menuItems', items);
    return updatedItem;
  },

  deleteMenuItem: async (id) => {
    await delay(300);
    const items = db.get('menuItems');
    const newItems = items.filter(i => i.id !== id);
    db.set('menuItems', newItems);
    return true;
  },

  toggleAvailability: async (id) => {
    await delay(200);
    const items = db.get('menuItems');
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    items[idx].available = !items[idx].available;
    db.set('menuItems', items);
    return items[idx];
  },

  getReviewsForItem: async (itemId) => {
    await delay(300);
    return db.get('reviews').filter(r => r.itemId === itemId);
  }
};

export const orderService = {
  getOrdersForUser: async (userId) => {
    await delay(500);
    return db.get('sampleOrders').filter(o => o.customerId === userId);
  },

  getAllOrders: async () => {
    await delay(500);
    return db.get('sampleOrders');
  },

  createOrder: async (orderData) => {
    await delay(1000);
    const orders = db.get('sampleOrders');
    const newOrder = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Placed',
      deliveryStaffId: null,
      ...orderData
    };
    orders.unshift(newOrder);
    db.set('sampleOrders', orders);
    return newOrder;
  },

  updateOrderStatus: async (orderId, status) => {
    await delay(400);
    const orders = db.get('sampleOrders');
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    db.set('sampleOrders', orders);
    return order;
  },

  submitReview: async (reviewData) => {
    await delay(500);
    const reviews = db.get('reviews');
    const newReview = { id: `r${Date.now()}`, date: new Date().toISOString(), ...reviewData };
    reviews.push(newReview);
    db.set('reviews', reviews);
    return newReview;
  }
};
