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
import { Modal } from '../../components/Modal';
import { RefreshCcw, Eye, Star, Loader2 } from 'lucide-react';

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
  const [reviewedOrderIds, setReviewedOrderIds] = useState(new Set());
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      orderService.getOrdersForUser(authState.user?.id),
      orderService.getReviews(),
    ]).then(([data, reviews]) => {
      setOrders(data);
      orderDispatch({ type: 'SET_ORDERS', payload: data });
      setReviewedOrderIds(new Set(reviews.filter(r => r.orderId).map(r => r.orderId)));
      setLoading(false);
    });
  }, [authState.user?.id]);

  const openReviewModal = (order) => {
    setReviewOrder(order);
    setRating(5);
    setComment('');
  };

  const submitReview = async () => {
    setSubmittingReview(true);
    try {
      await orderService.submitReview({
        orderId: reviewOrder.id,
        customerName: authState.user?.name,
        rating,
        comment,
      });
      setReviewedOrderIds(prev => new Set(prev).add(reviewOrder.id));
      addToast('Thanks for your feedback!', 'success');
      setReviewOrder(null);
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

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
                    <>
                      {reviewedOrderIds.has(order.id) ? (
                        <span className="flex items-center gap-1 px-3 py-1.5 text-sm text-amber-600">
                          <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" /> Reviewed
                        </span>
                      ) : (
                        <button onClick={() => openReviewModal(order)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                          <Star className="w-4 h-4" /> Rate Order
                        </button>
                      )}
                      <button onClick={() => handleReorder(order)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                        <RefreshCcw className="w-4 h-4" /> Reorder
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewOrder && (
        <Modal isOpen={true} onClose={() => setReviewOrder(null)} title={`Rate Order — ${reviewOrder.id}`} maxWidth="max-w-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-dark-text mb-2">How was your order?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)} className="p-0.5">
                    <Star className={`w-8 h-8 ${n <= rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                placeholder="Tell us about the food, packaging, or delivery..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setReviewOrder(null)} className="flex-1 py-2.5 border border-gray-200 text-secondary-gray rounded-xl font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={submitReview} disabled={submittingReview} className="flex-1 py-2.5 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
