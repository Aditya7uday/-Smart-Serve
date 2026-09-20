import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu, X } from 'lucide-react';

export function DeliveryLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-light-bg text-dark-text">
      {/* Mobile Top Navbar with Right Hamburger Icon */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <Link to="/delivery/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
          <div>
            <span className="font-bold text-lg text-dark-text leading-tight block">Smart Serve</span>
            <span className="text-[10px] font-semibold text-secondary-gray uppercase tracking-wider block -mt-1">Delivery Portal</span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 text-dark-text hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <Sidebar role="delivery" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-grow max-w-4xl mx-auto w-full p-4 sm:p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
