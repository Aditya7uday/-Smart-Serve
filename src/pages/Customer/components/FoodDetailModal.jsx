import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../components/Toast';
import { Star, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';

export function FoodDetailModal({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const { dispatch } = useCart();
  const { addToast } = useToast();

  if (!item) return null;

  const toggleCustomization = (cust) => {
    setSelectedCustomizations(prev =>
      prev.find(c => c.name === cust.name)
        ? prev.filter(c => c.name !== cust.name)
        : [...prev, cust]
    );
  };

  const customizationTotal = selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  const totalPrice = (item.price + customizationTotal) * quantity;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        image: item.image,
        price: item.price + customizationTotal,
        quantity,
        customizations: selectedCustomizations.map(c => c.name),
      }
    });
    addToast(`${item.name} added to cart!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="" maxWidth="max-w-lg">
      <div className="-mx-4 -mt-4">
        <div className="relative h-56 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm bg-white ${item.isVeg ? 'border-success-green' : 'border-red-500'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-success-green' : 'bg-red-500'}`} />
              </div>
              {item.isVeg && <span className="text-xs text-green-300 font-medium flex items-center gap-1"><Leaf className="w-3 h-3" /> Vegetarian</span>}
            </div>
            <h2 className="text-2xl font-bold text-white">{item.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" /> {item.rating} ({item.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-5">
        <p className="text-secondary-gray leading-relaxed">{item.description}</p>

        {item.customizations && item.customizations.length > 0 && (
          <div>
            <h3 className="font-semibold text-dark-text mb-3">Customize your order</h3>
            <div className="space-y-2">
              {item.customizations.map((cust, i) => {
                const selected = !!selectedCustomizations.find(c => c.name === cust.name);
                return (
                  <label key={i} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selected ? 'border-primary-orange bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCustomization(cust)}
                        className="accent-primary-orange w-4 h-4"
                      />
                      <span className="text-sm font-medium text-dark-text">{cust.name}</span>
                    </div>
                    {cust.price > 0 && <span className="text-sm font-semibold text-primary-orange">+₹{cust.price}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <span className="text-secondary-gray font-medium">Quantity</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary-orange hover:text-primary-orange transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-lg text-dark-text">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}
              className="w-9 h-9 rounded-full border-2 border-primary-orange bg-primary-orange text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!item.available}
          className="w-full flex items-center justify-between px-6 py-4 bg-primary-orange text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200">
          <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Cart</span>
          <span>₹{totalPrice}</span>
        </button>
      </div>
    </Modal>
  );
}
