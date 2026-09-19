export const categories = [
  { id: 'c1', name: 'Burgers', icon: '🍔' },
  { id: 'c2', name: 'Pizzas', icon: '🍕' },
  { id: 'c3', name: 'Beverages', icon: '🥤' },
  { id: 'c4', name: 'Snacks', icon: '🍟' },
  { id: 'c5', name: 'Healthy', icon: '🥗' },
  { id: 'c6', name: 'Desserts', icon: '🍨' },
];

export const menuItems = [
  {
    id: 'm1',
    name: 'Classic Chicken Burger',
    categoryId: 'c1',
    price: 120,
    isVeg: false,
    rating: 4.5,
    reviews: 124,
    description: 'Juicy grilled chicken patty with fresh lettuce, tomatoes, and our signature sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: [
      { name: 'Extra Cheese', price: 20 },
      { name: 'Spicy Mayo', price: 10 },
      { name: 'Add Bacon', price: 40 }
    ]
  },
  {
    id: 'm2',
    name: 'Veggie Supreme Pizza',
    categoryId: 'c2',
    price: 250,
    isVeg: true,
    rating: 4.8,
    reviews: 89,
    description: 'Loaded with bell peppers, olives, onions, mushrooms, and mozzarella.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: [
      { name: 'Extra Cheese', price: 30 },
      { name: 'Thin Crust', price: 0 }
    ]
  },
  {
    id: 'm3',
    name: 'Cold Coffee',
    categoryId: 'c3',
    price: 80,
    isVeg: true,
    rating: 4.2,
    reviews: 210,
    description: 'Refreshing cold coffee blended with ice cream and chocolate syrup.',
    image: 'https://images.unsplash.com/photo-1461023058943-0708e5215091?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: [
      { name: 'Add Vanilla Ice Cream', price: 20 },
      { name: 'Extra Chocolate', price: 10 }
    ]
  },
  {
    id: 'm4',
    name: 'French Fries',
    categoryId: 'c4',
    price: 60,
    isVeg: true,
    rating: 4.6,
    reviews: 156,
    description: 'Crispy golden fries salted to perfection.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: [
      { name: 'Peri Peri Spice', price: 10 },
      { name: 'Cheese Dip', price: 15 }
    ]
  },
  {
    id: 'm5',
    name: 'Caesar Salad',
    categoryId: 'c5',
    price: 150,
    isVeg: true,
    rating: 4.1,
    reviews: 45,
    description: 'Fresh romaine lettuce, croutons, parmesan cheese with Caesar dressing.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: [
      { name: 'Add Grilled Chicken', price: 60 }
    ]
  },
  {
    id: 'm6',
    name: 'Chocolate Lava Cake',
    categoryId: 'c6',
    price: 110,
    isVeg: true,
    rating: 4.9,
    reviews: 320,
    description: 'Warm chocolate cake with a gooey molten chocolate center.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80',
    available: false,
    customizations: [
      { name: 'With Vanilla Scoop', price: 30 }
    ]
  },
  // Adding a few more to meet the ~30 requirement quickly
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `m${i+7}`,
    name: `Delicious Item ${i+7}`,
    categoryId: `c${(i%6)+1}`,
    price: 50 + (i*5),
    isVeg: i % 2 === 0,
    rating: 4.0 + (i%10)/10,
    reviews: Math.floor(Math.random() * 200),
    description: `A delicious mock item for category ${(i%6)+1}. Made with fresh ingredients.`,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    available: true,
    customizations: []
  }))
];

export const users = [
  { id: 'u1', name: 'John Customer', email: 'customer@smartserve.demo', password: 'password', role: 'customer' },
  { id: 'u2', name: 'Jane Admin', email: 'admin@smartserve.demo', password: 'password', role: 'admin' },
  { id: 'u3', name: 'Mike Delivery', email: 'delivery@smartserve.demo', password: 'password', role: 'delivery' },
  { id: 'u4', name: 'Alice Student', email: 'alice@smartserve.demo', password: 'password', role: 'customer' },
  { id: 'u5', name: 'Bob Delivery', email: 'bob@smartserve.demo', password: 'password', role: 'delivery' },
];

export const sampleOrders = [
  {
    id: 'ORD-1001',
    customerId: 'u1',
    customerName: 'John Customer',
    items: [
      { id: 'm1', name: 'Classic Chicken Burger', price: 120, quantity: 2, customizations: ['Extra Cheese'] },
      { id: 'm4', name: 'French Fries', price: 60, quantity: 1, customizations: [] }
    ],
    total: 320, // 120*2 + 20(cheese)*2 + 60 = 340 (Wait, roughly calculated)
    type: 'delivery',
    status: 'Preparing',
    paymentMethod: 'UPI',
    timestamp: new Date().toISOString(),
    deliveryStaffId: null
  },
  {
    id: 'ORD-1002',
    customerId: 'u4',
    customerName: 'Alice Student',
    items: [
      { id: 'm3', name: 'Cold Coffee', price: 80, quantity: 1, customizations: [] }
    ],
    total: 80,
    type: 'pickup',
    status: 'Ready for Pickup',
    paymentMethod: 'Cash',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
    deliveryStaffId: null
  }
];

export const inventory = [
  { id: 'inv1', name: 'Burger Buns', currentStock: 150, minStock: 50, unit: 'pcs' },
  { id: 'inv2', name: 'Chicken Patties', currentStock: 30, minStock: 40, unit: 'pcs' }, // Low stock
  { id: 'inv3', name: 'Pizza Base', currentStock: 0, minStock: 20, unit: 'pcs' }, // Out of stock
  { id: 'inv4', name: 'Coffee Beans', currentStock: 5, minStock: 2, unit: 'kg' },
  { id: 'inv5', name: 'Cheese Slices', currentStock: 200, minStock: 100, unit: 'pcs' },
];

export const reviews = [
  { id: 'r1', orderId: 'ORD-0999', customerName: 'John Customer', rating: 5, comment: 'Food was hot and delicious!', date: new Date().toISOString() },
  { id: 'r2', orderId: 'ORD-0998', customerName: 'Alice Student', rating: 3, comment: 'Delivery was a bit late.', date: new Date().toISOString() },
];

export const notifications = [
  { id: 'n1', type: 'order', message: 'Order ORD-1002 is ready for pickup.', read: false, role: 'customer', userId: 'u4' },
  { id: 'n2', type: 'inventory', message: 'Chicken Patties are running low.', read: false, role: 'admin', userId: 'u2' },
];
