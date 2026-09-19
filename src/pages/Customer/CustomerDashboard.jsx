import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { menuService, orderService } from '../../services/menuService';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { FoodDetailModal } from './components/FoodDetailModal';
import { ShoppingBag, Clock, Star, ArrowRight, Search } from 'lucide-react';

export function CustomerDashboard() {
  const { state: authState } = useAuth();
  const { state: cartState } = useCart();
  const { state: orderState } = useOrders();
  const [categories, setCategories] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [cats, items, orders] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems({ sortBy: 'rating' }),
        orderService.getOrdersForUser(authState.user?.id)
      ]);
      setCategories(cats);
      setPopularItems(items.slice(0, 4));
      setMyOrders(orders);
      setLoading(false);
    }
    load();
  }, [authState.user?.id]);

  // Sync with order context (for live updates)
  const activeOrderFromContext = orderState.orders.find(
    o => o.customerId === authState.user?.id && !['Delivered', 'Collected', 'Cancelled'].includes(o.status)
  );
  const activeOrder = activeOrderFromContext || myOrders.find(
    o => !['Delivered', 'Collected', 'Cancelled'].includes(o.status)
  );

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <LoadingState message="Loading your dashboard..." />;

  return (
    <div className="py-6 space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">
            {greetingTime()}, {authState.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-secondary-gray mt-1">What would you like to eat today?</p>
        </div>
        <Link to="/customer/menu" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-orange text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md shadow-orange-100">
          <Search className="w-4 h-4" /> Browse Menu
        </Link>
      </div>

      {/* Active Order Banner */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-orange-100 font-medium">Active Order</p>
              <p className="text-lg font-bold">{activeOrder.id}</p>
              <p className="text-sm text-orange-100">{activeOrder.status}</p>
            </div>
          </div>
          <Link to={`/customer/orders/${activeOrder.id}`} className="flex items-center gap-1 bg-white text-primary-orange rounded-full px-4 py-2 text-sm font-bold hover:shadow-lg transition-shadow">
            Track <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Cart Summary Banner */}
      {cartState.items.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-orange" />
            </div>
            <div>
              <p className="text-sm text-secondary-gray">Your cart</p>
              <p className="font-semibold text-dark-text">{cartState.items.length} item{cartState.items.length > 1 ? 's' : ''} · ₹{cartState.total}</p>
            </div>
          </div>
          <Link to="/customer/cart" className="px-4 py-2 bg-primary-orange text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
            View Cart
          </Link>
        </div>
      )}

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark-text">Categories</h2>
          <Link to="/customer/menu" className="text-sm text-primary-orange font-medium hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/customer/menu?category=${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all shadow-sm hover:shadow-md">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-dark-text text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark-text">Popular Right Now</h2>
          <Link to="/customer/menu" className="text-sm text-primary-orange font-medium hover:underline">See all</Link>
        </div>
        {popularItems.length === 0 ? (
          <EmptyState title="No popular items" message="Check back soon!" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularItems.map(item => (
              <button key={item.id} onClick={() => setSelectedItem(item)}
                className="text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all shadow-sm">
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-2 left-2 w-5 h-5 border-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-success-green bg-white' : 'border-red-500 bg-white'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-success-green' : 'bg-red-500'}`} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-dark-text truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-dark-text">₹{item.price}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {item.rating}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark-text">Recent Orders</h2>
          <Link to="/customer/orders" className="text-sm text-primary-orange font-medium hover:underline">See all</Link>
        </div>
        {myOrders.length === 0 ? (
          <EmptyState title="No orders yet" message="Place your first order!" actionText="Explore Menu" actionHref="/customer/menu" />
        ) : (
          <div className="space-y-3">
            {myOrders.slice(0, 3).map(order => (
              <Link key={order.id} to={`/customer/orders/${order.id}`}
                className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-dark-text">{order.id}</p>
                  <p className="text-sm text-secondary-gray mt-0.5">{order.items.map(i => i.name).join(', ')}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="text-sm font-bold text-dark-text mt-1">₹{order.total}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {selectedItem && <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
