import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar({ role }) {
  const { state: authState, dispatch } = useAuth();
  const { state: cartState } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    dispatch({ type: 'LOGOUT' });
  };

  const cartItemCount = cartState.items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinkClass = (path) =>
    `text-sm font-medium ${location.pathname.includes(path) ? 'text-primary-orange' : 'text-secondary-gray hover:text-primary-orange'}`;

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

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            {role === 'customer' && (
              <>
                <Link to="/customer/menu" className={navLinkClass('/menu')}>Menu</Link>
                <Link to="/customer/orders" className={navLinkClass('/orders')}>Orders</Link>
                <Link to="/customer/profile" className={navLinkClass('/profile')}>Profile</Link>
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
                <div className="flex items-center gap-2 text-sm text-secondary-gray">
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

          {/* Mobile: cart (customer only) + hamburger */}
          <div className="flex sm:hidden items-center gap-1">
            {role === 'customer' && (
              <Link to="/customer/cart" className="relative p-2 text-secondary-gray" onClick={() => setMobileOpen(false)}>
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-orange rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 text-dark-text"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 py-3 space-y-1">
            {role === 'customer' && (
              <>
                <Link to="/customer/menu" onClick={() => setMobileOpen(false)} className={`block px-2 py-2.5 rounded-lg ${navLinkClass('/menu')}`}>Menu</Link>
                <Link to="/customer/orders" onClick={() => setMobileOpen(false)} className={`block px-2 py-2.5 rounded-lg ${navLinkClass('/orders')}`}>Orders</Link>
                <Link to="/customer/profile" onClick={() => setMobileOpen(false)} className={`block px-2 py-2.5 rounded-lg ${navLinkClass('/profile')}`}>Profile</Link>
              </>
            )}

            {authState.isAuthenticated ? (
              <div className="flex items-center justify-between px-2 pt-2 mt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-secondary-gray">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{authState.user?.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-2 pt-2 mt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-dark-text">Log In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium px-4 py-2 bg-primary-orange text-white rounded-full">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
