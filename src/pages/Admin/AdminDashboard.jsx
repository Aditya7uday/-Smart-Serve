import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/menuService';
import { LoadingState } from '../../components/LoadingState';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrders } from '../../context/OrderContext';
import { Users, ShoppingBag, Clock, DollarSign, AlertTriangle, Star, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-secondary-gray font-medium">{label}</p>
        <p className="text-2xl font-bold text-dark-text mt-0.5">{value}</p>
        {sub && <p className="text-xs text-secondary-gray mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state: orderState } = useOrders();

  useEffect(() => {
    async function load() {
      const [s, orders, inv] = await Promise.all([
        adminService.getStats(),
        orderService.getAllOrders(),
        adminService.getInventory(),
      ]);
      setStats(s);
      setRecentOrders(orders.slice(0, 5));
      setLowStock(inv.filter(i => i.status !== 'In Stock'));
      setLoading(false);
    }
    load();
  }, []);

  // Merge with live context orders
  const liveOrders = orderState.orders.length > 0
    ? [...orderState.orders, ...recentOrders.filter(o => !orderState.orders.find(co => co.id === o.id))].slice(0, 5)
    : recentOrders;

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const statusDistribution = liveOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Admin Dashboard</h1>
        <p className="text-secondary-gray mt-1">Overview of canteen operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard icon={ShoppingBag} label="Today's Orders" value={stats.todayOrders} color="bg-primary-orange" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} sub="Needs attention" color="bg-yellow-500" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${stats.revenue}`} sub="Completed orders" color="bg-success-green" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats.lowStockCount} sub="Items" color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-dark-text">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-orange hover:underline font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {liveOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="font-semibold text-dark-text text-sm">{order.id}</p>
                  <p className="text-xs text-secondary-gray mt-0.5">{order.customerName} · ₹{order.total}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-dark-text">Low Stock Alerts</h2>
            <Link to="/admin/inventory" className="text-sm text-primary-orange hover:underline font-medium">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="p-8 text-center text-secondary-gray text-sm">All stock levels are healthy ✓</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark-text text-sm">{item.name}</p>
                    <p className="text-xs text-secondary-gray">{item.currentStock} / {item.minStock} {item.unit}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-dark-text mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-orange" /> Order Status Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusDistribution).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <StatusBadge status={status} />
              <span className="text-sm font-bold text-dark-text">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
