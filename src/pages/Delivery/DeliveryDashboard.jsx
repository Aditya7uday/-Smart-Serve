import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { deliveryService } from '../../services/deliveryService';
import { orderService } from '../../services/menuService';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { Package, CheckCircle2, Clock, Truck, ArrowRight, ChevronRight } from 'lucide-react';

const STATUS_CHAIN = ['Accepted', 'Picked Up', 'Out for Delivery', 'Delivered'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-secondary-gray">{label}</p>
        <p className="text-2xl font-bold text-dark-text">{value}</p>
      </div>
    </div>
  );
}

export function DeliveryDashboard() {
  const { state: authState } = useAuth();
  const { state: orderState, dispatch: orderDispatch } = useOrders();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    deliveryService.getAllDeliveryOrders(authState.user?.id).then(data => {
      setOrders(data);
      orderDispatch({ type: 'SET_ORDERS', payload: data });
      setLoading(false);
    });
  }, [authState.user?.id]);

  // Merge with context for live updates
  const mergedOrders = orders.map(o => orderState.orders.find(co => co.id === o.id) || o);
  const contextDeliveryOrders = orderState.orders.filter(o => o.type === 'delivery' && !mergedOrders.find(mo => mo.id === o.id));
  const allOrders = [...contextDeliveryOrders, ...mergedOrders];

  const assignedOrders = allOrders.filter(o => !['Delivered', 'Cancelled', 'Collected'].includes(o.status));
  const completedOrders = allOrders.filter(o => o.status === 'Delivered');

  const handleStatusUpdate = async (orderId, nextStatus) => {
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      orderDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status: nextStatus } });
      addToast(`Order updated to "${nextStatus}"`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    const idx = STATUS_CHAIN.indexOf(currentStatus);
    if (idx === -1) return STATUS_CHAIN[0]; // Start chain
    if (idx >= STATUS_CHAIN.length - 1) return null; // Already delivered
    return STATUS_CHAIN[idx + 1];
  };

  if (loading) return <LoadingState message="Loading your deliveries..." />;

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Delivery Dashboard</h1>
        <p className="text-secondary-gray mt-1">Welcome back, {authState.user?.name?.split(' ')[0]} 🚚</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Assigned" value={assignedOrders.length} color="bg-primary-orange" />
        <StatCard icon={Truck} label="In Transit" value={allOrders.filter(o => o.status === 'Out for Delivery').length} color="bg-purple-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={completedOrders.length} color="bg-success-green" />
        <StatCard icon={Clock} label="Total Today" value={allOrders.length} color="bg-blue-500" />
      </div>

      {/* Active Deliveries */}
      <div>
        <h2 className="text-lg font-bold text-dark-text mb-4">Active Deliveries</h2>
        {assignedOrders.length === 0 ? (
          <EmptyState icon={Package} title="No active deliveries" message="You're all caught up! Check back later for new assignments." />
        ) : (
          <div className="space-y-4">
            {assignedOrders.map(order => {
              const nextStatus = getNextStatus(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-dark-text">{order.id}</p>
                      <p className="text-sm text-secondary-gray mt-0.5">Customer: {order.customerName}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-sm text-secondary-gray mb-4">
                    <span className="font-medium text-dark-text">Items: </span>
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </div>
                  {nextStatus && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, nextStatus)}
                      disabled={updating === order.id}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-70">
                      {updating === order.id ? 'Updating...' : `Mark as "${nextStatus}"`}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Deliveries */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-dark-text mb-4">Completed Today</h2>
          <div className="space-y-3">
            {completedOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4 opacity-80">
                <div>
                  <p className="font-semibold text-dark-text">{order.id}</p>
                  <p className="text-sm text-secondary-gray">{order.customerName} · ₹{order.total}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
