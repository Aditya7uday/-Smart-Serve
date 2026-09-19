import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { DeliveryLayout } from './layouts/DeliveryLayout';

import { Landing } from './pages/Landing/Landing';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { CustomerDashboard } from './pages/Customer/CustomerDashboard';
import { Menu } from './pages/Customer/Menu';
import { Cart } from './pages/Customer/Cart';
import { Checkout } from './pages/Customer/Checkout';
import { OrderStatus } from './pages/Customer/OrderStatus';
import { MyOrders } from './pages/Customer/MyOrders';
import { Profile } from './pages/Customer/Profile';

import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminMenu } from './pages/Admin/AdminMenu';
import { AdminOrders } from './pages/Admin/AdminOrders';
import { AdminInventory } from './pages/Admin/AdminInventory';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminPayments, AdminFeedback } from './pages/Admin/AdminPaymentsFeedback';

import { DeliveryDashboard } from './pages/Delivery/DeliveryDashboard';
import { DeliveryProfile } from './pages/Delivery/DeliveryProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={<OrderStatus />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>
        </Route>

        {/* Delivery Routes */}
        <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="profile" element={<DeliveryProfile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
