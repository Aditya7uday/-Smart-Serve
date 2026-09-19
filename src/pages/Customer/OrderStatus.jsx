import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { orderService } from '../../services/menuService';
import { useToast } from '../../components/Toast';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

const DELIVERY_STEPS = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
const PICKUP_STEPS = ['Placed', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Collected'];
const CANCELLABLE_STATUSES = ['Placed', 'Confirmed', 'Preparing'];
const TERMINAL_STATUSES = ['Delivered', 'Collected', 'Cancelled'];
const POLL_INTERVAL_MS = 5000;

export function OrderStatus() {
  const { orderId } = useParams();
  const { dispatch: orderDispatch } = useOrders();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const lastStatusRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let interval = null;

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        if (cancelled) return;
        if (lastStatusRef.current && lastStatusRef.current !== data.status) {
          addToast(`Order status updated: ${data.status}`, 'info');
        }
        lastStatusRef.current = data.status;
        setOrder(data);
        orderDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: data.id, status: data.status, deliveryStaffId: data.deliveryStaffId } });
        if (TERMINAL_STATUSES.includes(data.status) && interval) {
          clearInterval(interval);
        }
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrder();
    interval = setInterval(fetchOrder, POLL_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.updateOrderStatus(orderId, 'Cancelled');
      setOrder(updated);
      orderDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: updated.id, status: updated.status } });
      addToast('Order cancelled.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingState message="Loading order status..." />;
  if (!order) return (
    <div className="py-12">
      <EmptyState title="Order not found" message="We couldn't find this order." actionText="My Orders" actionHref="/customer/orders" />
    </div>
  );

  const steps = order.type === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="py-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Order Status</h1>
          <p className="text-secondary-gray mt-0.5">{order.id}</p>
        </div>
        <Link to="/customer/orders" className="text-sm text-primary-orange font-medium hover:underline">← All Orders</Link>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {isCancelled ? (
          <div className="text-center py-4 text-red-500">
            <div className="text-4xl mb-3">❌</div>
            <p className="font-bold text-lg text-red-700">Order Cancelled</p>
            <p className="text-red-500 text-sm mt-1">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isCompleted = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              const isFuture = i > currentStepIndex;
              return (
                <div key={step} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isCompleted ? 'bg-success-green' : isCurrent ? 'bg-primary-orange ring-4 ring-orange-100' : 'bg-gray-100'}`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : isCurrent ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Circle className="w-5 h-5 text-gray-300" />}
                    </div>
                    {i < steps.length - 1 && <div className={`w-0.5 h-10 mt-1 ${isCompleted ? 'bg-success-green' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="pb-6">
                    <p className={`font-semibold ${isCompleted ? 'text-success-green' : isCurrent ? 'text-primary-orange' : 'text-gray-300'}`}>{step}</p>
                    {isCurrent && <p className="text-xs text-secondary-gray mt-0.5 animate-pulse">In progress...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-dark-text mb-4">Order Details</h2>
        <div className="space-y-2 text-sm mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-secondary-gray">{item.name} × {item.quantity}</span>
              <span className="font-medium text-dark-text">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-secondary-gray"><span>Type</span><span className="capitalize font-medium text-dark-text">{order.type}</span></div>
          <div className="flex justify-between font-bold text-dark-text text-base pt-1"><span>Total</span><span>₹{order.total}</span></div>
        </div>
      </div>

      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  );
}
