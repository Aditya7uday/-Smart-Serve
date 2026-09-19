import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/menuService';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { Star, Eye, EyeOff } from 'lucide-react';

// ── Payments ──────────────────────────────────────────────────────────────────

export function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAllOrders().then(data => { setOrders(data); setLoading(false); });
  }, []);

  const totalRevenue = orders.filter(o => ['Delivered','Collected'].includes(o.status)).reduce((s, o) => s + o.total, 0);

  if (loading) return <LoadingState message="Loading payments..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-text">Payment Monitoring</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-success-green font-bold text-xl">₹</div>
        <div>
          <p className="text-secondary-gray text-sm">Total Completed Revenue</p>
          <p className="text-2xl font-bold text-dark-text">₹{totalRevenue}</p>
        </div>
      </div>
      {orders.length === 0 ? <EmptyState title="No payments" message="No transactions yet." /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Order ID','Customer','Amount','Method','Order Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-secondary-gray">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-dark-text">{o.id}</td>
                    <td className="px-4 py-3 text-secondary-gray">{o.customerName}</td>
                    <td className="px-4 py-3 font-bold text-dark-text">₹{o.total}</td>
                    <td className="px-4 py-3 text-secondary-gray uppercase text-xs font-medium">{o.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${['Delivered','Collected'].includes(o.status) ? 'bg-green-100 text-green-700' : o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {['Delivered','Collected'].includes(o.status) ? 'Paid' : o.status === 'Cancelled' ? 'Refunded' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export function AdminFeedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    adminService.getFeedback().then(data => { setReviews(data); setLoading(false); });
  }, []);

  const toggleHide = async (id) => {
    const updated = await adminService.hideFeedback(id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: updated.hidden } : r));
    addToast(updated.hidden ? 'Review hidden' : 'Review visible', 'info');
  };

  if (loading) return <LoadingState message="Loading feedback..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-text">Feedback Moderation</h1>
      {reviews.length === 0 ? <EmptyState title="No feedback yet" message="Customer reviews will appear here." /> : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-opacity ${review.hidden ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-200'}`} />)}</div>
                    <span className="font-semibold text-dark-text text-sm">{review.customerName}</span>
                    {review.hidden && <span className="text-xs bg-gray-100 text-secondary-gray px-2 py-0.5 rounded-full">Hidden</span>}
                  </div>
                  <p className="text-secondary-gray text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => toggleHide(review.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border shrink-0 transition-colors ${review.hidden ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-secondary-gray hover:bg-gray-50'}`}>
                  {review.hidden ? <><Eye className="w-3.5 h-3.5" /> Show</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
