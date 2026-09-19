import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar({ role }) {
  const { state: authState, dispatch } = useAuth();
  const { state: cartState } = useCart();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const cartItemCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={role === 'customer' ? '/customer/dashboard' : '/'} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="font-bold text-xl text-dark-text tracking-tight">Smart Serve</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {role === 'customer' && (
              <>
                <Link to="/customer/menu" className={`text-sm font-medium ${location.pathname.includes('/menu') ? 'text-primary-orange' : 'text-secondary-gray hover:text-primary-orange'}`}>
                  Menu
                </Link>
                <Link to="/customer/orders" className={`text-sm font-medium ${location.pathname.includes('/orders') ? 'text-primary-orange' : 'text-secondary-gray hover:text-primary-orange'}`}>
                  Orders
                </Link>
                <Link to="/customer/profile" className={`text-sm font-medium ${location.pathname.includes('/profile') ? 'text-primary-orange' : 'text-secondary-gray hover:text-primary-orange'}`}>
                  Profile
                </Link>
                <Link to="/customer/cart" className="relative p-2 text-secondary-gray hover:text-primary-orange transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-orange rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {authState.isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:flex items-center gap-2 text-sm text-secondary-gray">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-medium truncate max-w-[120px]">{authState.user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-dark-text hover:text-primary-orange transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 bg-primary-orange text-white rounded-full hover:bg-orange-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
