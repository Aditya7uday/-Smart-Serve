import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, PackageSearch, Users, CreditCard, MessageSquare, Bike, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ role }) {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu Management' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/inventory', icon: PackageSearch, label: 'Inventory' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  const deliveryLinks = [
    { to: '/delivery/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/delivery/profile', icon: UserCircle, label: 'Profile' },
  ];

  const links = role === 'admin' ? adminLinks : deliveryLinks;

  return (
    <aside className="w-64 bg-white shadow-sm h-screen sticky top-0 flex flex-col flex-shrink-0 z-30 border-r border-gray-100">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
        <span className="font-bold text-xl text-dark-text tracking-tight">Smart Serve</span>
      </div>
      
      <div className="px-6 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {role === 'admin' ? 'Admin Portal' : 'Delivery Portal'}
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto mt-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-orange-50 text-primary-orange' 
                  : 'text-secondary-gray hover:bg-gray-50 hover:text-dark-text'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
