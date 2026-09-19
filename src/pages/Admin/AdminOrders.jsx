import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { menuService, orderService } from '../../services/menuService';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../components/Toast';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Search, ChevronDown, Eye, UserCheck, UserX } from 'lucide-react';

const ORDER_STATUSES = ['Placed','Confirmed','Preparing','Ready','Ready for Pickup','Out for Delivery','Delivered','Collected','Cancelled'];

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const { state: orderState, dispatch: orderDispatch } = useOrders();
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      adminService.getUsers()
    ]).then(([ords, usrs]) => {
      setOrders(ords);
      orderDispatch({ type: 'SET_ORDERS', payload: ords });
      setDeliveryStaff(usrs.filter(u => u.role === 'delivery'));
      setLoading(false);
    });
  }, []);

  // Merge with live context
  const mergedOrders = orders.map(o => orderState.orders.find(co => co.id === o.id) || o);
  const sessionOrders = orderState.orders.filter(o => !mergedOrders.find(mo => mo.id === o.id));
  const allOrders = [...sessionOrders, ...mergedOrders];

  const filtered = allOrders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      orderDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status: newStatus } });
      addToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
      if (selectedOrder?.id === orderId) setSelectedOrder(p => ({ ...p, status: newStatus }));
    } catch {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleAssignDelivery = async (orderId, staffId) => {
    const o = allOrders.find(o => o.id === orderId);
    if (!o) return;
    try {
      await orderService.assignDeliveryStaff(orderId, staffId);
      orderDispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status: o.status, deliveryStaffId: staffId } });
      addToast(`Delivery staff assigned`, 'success');
      if (selectedOrder?.id === orderId) setSelectedOrder(p => ({ ...p, deliveryStaffId: staffId }));
    } catch {
      addToast('Failed to assign delivery staff', 'error');
    }
  };

  if (loading) return <LoadingState message="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-text">Order Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input placeholder="Search by ID or customer..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50 bg-white" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders found" message="No orders match your search." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Type', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-secondary-gray">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-dark-text whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3 text-secondary-gray whitespace-nowrap">{order.customerName}</td>
                    <td className="px-4 py-3 text-secondary-gray max-w-[160px] truncate">{order.items.map(i => i.name).join(', ')}</td>
                    <td className="px-4 py-3 font-semibold text-dark-text">₹{order.total}</td>
                    <td className="px-4 py-3 capitalize text-secondary-gray">{order.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(allOrders.find(o => o.id === order.id))}
                          className="p-1.5 text-secondary-gray hover:text-primary-orange hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-orange cursor-pointer appearance-none pr-6">
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary-gray pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={true} onClose={() => setSelectedOrder(null)} title={`Order — ${selectedOrder.id}`} maxWidth="max-w-lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-secondary-gray">Customer</p><p className="font-semibold">{selectedOrder.customerName}</p></div>
              <div><p className="text-secondary-gray">Type</p><p className="font-semibold capitalize">{selectedOrder.type}</p></div>
              <div><p className="text-secondary-gray">Payment</p><p className="font-semibold">{selectedOrder.paymentMethod}</p></div>
              <div><p className="text-secondary-gray">Status</p><StatusBadge status={selectedOrder.status} /></div>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold text-dark-text mb-3">Items</p>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-gray">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold mt-2">
                <span>Total</span><span>₹{selectedOrder.total}</span>
              </div>
            </div>
            {selectedOrder.type === 'delivery' && (
              <div className="border-t pt-4">
                <p className="font-semibold text-dark-text mb-2">Assign Delivery Staff</p>
                <select
                  value={selectedOrder.deliveryStaffId || ''}
                  onChange={e => handleAssignDelivery(selectedOrder.id, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50">
                  <option value="">-- Select staff --</option>
                  {deliveryStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
