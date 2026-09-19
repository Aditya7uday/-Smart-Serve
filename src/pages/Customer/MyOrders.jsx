import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toast';
import { orderService } from '../../services/menuService';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { RefreshCcw, Eye } from 'lucide-react';

const FILTERS = ['All', 'Active', 'Completed', 'Cancelled'];

export function MyOrders() {
  const { state: authState } = useAuth();
  const { state: orderState, dispatch: orderDispatch } = useOrders();
  const { dispatch: cartDispatch } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    orderService.getOrdersForUser(authState.user?.id).then(data => {
      setOrders(data);
      orderDispatch({ type: 'SET_ORDERS', payload: data });
      setLoading(false);
    });
  }, [authState.user?.id]);

  // Merge with context for live updates
  const mergedOrders = orders.map(o => {
    const fromCtx = orderState.orders.find(co => co.id === o.id);
    return fromCtx || o;
  });
  // Also include orders created in this session
  const sessionOrders = orderState.orders.filter(o => o.customerId === authState.user?.id && !mergedOrders.find(mo => mo.id === o.id));
  const allOrders = [...sessionOrders, ...mergedOrders];

  const filtered = allOrders.filter(o => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return !['Delivered', 'Collected', 'Cancelled'].includes(o.status);
    if (activeFilter === 'Completed') return ['Delivered', 'Collected'].includes(o.status);
    if (activeFilter === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach(item => {
      cartDispatch({ type: 'ADD_ITEM', payload: { ...item, id: `${item.id || item.menuItemId}-${Date.now()}` } });
    });
    addToast('Items added to cart!', 'success');
    navigate('/customer/cart');
  };

  if (loading) return <LoadingState message="Loading your orders..." />;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-dark-text mb-6">My Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === f ? 'bg-primary-orange text-white shadow-md shadow-orange-100' : 'bg-white border border-gray-200 text-secondary-gray hover:border-gray-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders yet" message={`No ${activeFilter.toLowerCase()} orders found.`} actionText="Explore Menu" actionHref="/customer/menu" />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-dark-text">{order.id}</p>
                  <p className="text-xs text-secondary-gray mt-0.5">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="text-sm text-secondary-gray mb-3">
                {order.items.map(i => `${i.name} ×${i.quantity}`).join(' · ')}
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="font-bold text-dark-text">₹{order.total}</span>
                <div className="flex gap-2">
                  <Link to={`/customer/orders/${order.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-secondary-gray hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" /> Track
                  </Link>
                  {['Delivered', 'Collected'].includes(order.status) && (
                    <button onClick={() => handleReorder(order)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                      <RefreshCcw className="w-4 h-4" /> Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
