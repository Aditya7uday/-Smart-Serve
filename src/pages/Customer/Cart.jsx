import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/EmptyState';
import { ShoppingCart, Plus, Minus, X, Trash2 } from 'lucide-react';

export function Cart() {
  const { state: cartState, dispatch } = useCart();
  const navigate = useNavigate();

  const updateQty = (id, quantity) => {
    if (quantity <= 0) dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    else dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const DELIVERY_FEE = 20;
  const PLATFORM_FEE = 5;
  const subtotal = cartState.total;
  const total = subtotal + DELIVERY_FEE + PLATFORM_FEE;

  if (cartState.items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Explore our menu to get started!"
          actionText="Explore Menu"
          actionHref="/customer/menu"
        />
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-dark-text mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartState.items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4">
              <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'} alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-dark-text">{item.name}</p>
                    {item.customizations?.length > 0 && (
                      <p className="text-xs text-secondary-gray mt-0.5">{item.customizations.join(', ')}</p>
                    )}
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                    className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-dark-text">₹{item.price * item.quantity}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors">
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}
            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 mt-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-dark-text text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-secondary-gray">
                <span>Subtotal ({cartState.items.length} items)</span>
                <span className="font-medium text-dark-text">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-secondary-gray">
                <span>Delivery fee</span>
                <span className="font-medium text-dark-text">₹{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between text-secondary-gray">
                <span>Platform fee</span>
                <span className="font-medium text-dark-text">₹{PLATFORM_FEE}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-dark-text text-base">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button onClick={() => navigate('/customer/checkout')}
              className="w-full mt-6 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
