import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { FoodDetailModal } from './components/FoodDetailModal';
import { Search, SlidersHorizontal, Star, Leaf } from 'lucide-react';

export function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const activeCategory = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const vegOnly = searchParams.get('veg') === 'true';
  const sortBy = searchParams.get('sort') || 'rating';

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) newParams.set(key, val);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    menuService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    menuService.getMenuItems({ categoryId: activeCategory, search, isVeg: vegOnly || undefined, sortBy })
      .then(data => { setItems(data); setLoading(false); });
  }, [activeCategory, search, vegOnly, sortBy]);

  return (
    <div className="py-6 space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-gray" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={e => updateParams({ search: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5">
          <SlidersHorizontal className="w-4 h-4 text-secondary-gray" />
          <select value={sortBy} onChange={e => updateParams({ sort: e.target.value })}
            className="text-sm font-medium text-dark-text bg-transparent focus:outline-none cursor-pointer">
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button onClick={() => updateParams({ category: '' })}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory ? 'bg-primary-orange text-white shadow-md shadow-orange-100' : 'bg-white border border-gray-200 text-secondary-gray hover:border-gray-300'}`}>
          All
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => updateParams({ category: cat.id })}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-primary-orange text-white shadow-md shadow-orange-100' : 'bg-white border border-gray-200 text-secondary-gray hover:border-gray-300'}`}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        <button onClick={() => updateParams({ veg: vegOnly ? '' : 'true' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${vegOnly ? 'bg-success-green/10 border-success-green text-success-green' : 'bg-white border-gray-200 text-secondary-gray hover:border-gray-300'}`}>
          <Leaf className="w-4 h-4" /> Veg Only
        </button>
        <span className="text-sm text-secondary-gray">{items.length} items found</span>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <LoadingState message="Loading menu..." />
      ) : items.length === 0 ? (
        <EmptyState title="No food items found" message="Try adjusting your search or filters." onAction={() => setSearchParams({})} actionText="Clear Filters" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <button key={item.id} onClick={() => setSelectedItem(item)}
              disabled={!item.available}
              className={`text-left bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all shadow-sm ${item.available ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-60 cursor-not-allowed'}`}>
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-dark-text text-sm font-bold px-3 py-1 rounded-full">Not Available</span>
                  </div>
                )}
                <div className={`absolute top-2 left-2 w-6 h-6 border-2 flex items-center justify-center rounded-sm bg-white ${item.isVeg ? 'border-success-green' : 'border-red-500'}`}>
                  <div className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-success-green' : 'bg-red-500'}`} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-dark-text truncate">{item.name}</p>
                <p className="text-sm text-secondary-gray mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-lg text-dark-text">₹{item.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span className="text-sm font-semibold text-amber-600">{item.rating}</span>
                    <span className="text-xs text-secondary-gray">({item.reviews})</span>
                  </div>
                </div>
                {item.available && (
                  <div className="mt-3 w-full text-center py-2 bg-orange-50 text-primary-orange rounded-lg text-sm font-semibold">
                    Add to Cart
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedItem && <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
