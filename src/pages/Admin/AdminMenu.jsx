import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { menuService } from '../../services/menuService';
import { useToast } from '../../components/Toast';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const emptyItem = { name: '', price: '', categoryId: '', description: '', image: '', isVeg: true, available: true };
const NEW_CATEGORY_VALUE = '__new__';

export function AdminMenu() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(emptyItem);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([menuService.getMenuItems(), menuService.getCategories()])
      .then(([its, c]) => { setItems(its); setCats(c); setLoading(false); });
  }, []);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditItem(null); setFormData(emptyItem); setNewCategoryName(''); setNewCategoryIcon(''); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setFormData({ ...item, price: String(item.price) }); setNewCategoryName(''); setNewCategoryIcon(''); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let categoryId = formData.categoryId;
      if (categoryId === NEW_CATEGORY_VALUE) {
        if (!newCategoryName.trim()) {
          addToast('Enter a name for the new category', 'error');
          return;
        }
        const newCat = await menuService.addCategory({ name: newCategoryName.trim(), icon: newCategoryIcon.trim() });
        setCats(prev => [...prev, newCat]);
        categoryId = newCat.id;
      }

      const payload = { ...formData, categoryId, price: Number(formData.price) };
      if (editItem) {
        const updated = await menuService.updateMenuItem(editItem.id, payload);
        setItems(prev => prev.map(i => i.id === editItem.id ? updated : i));
        addToast('Item updated!', 'success');
      } else {
        const newItem = await menuService.addMenuItem(payload);
        setItems(prev => [newItem, ...prev]);
        addToast('Item added!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save item', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      addToast('Item deleted', 'info');
      setConfirmDelete(null);
    } catch {
      addToast('Failed to delete item', 'error');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const updated = await menuService.toggleAvailability(item.id);
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      addToast(`${item.name} is now ${updated.available ? 'available' : 'unavailable'}`, 'info');
    } catch {
      addToast('Failed to update availability', 'error');
    }
  };

  if (loading) return <LoadingState message="Loading menu..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-text">Menu Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
            <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50 bg-white" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-orange text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState title="No menu items" message="Add your first item." onAction={openAdd} actionText="Add Item" /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Item', 'Category', 'Price', 'Type', 'Status', 'Available', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-secondary-gray">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-dark-text max-w-[140px] truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary-gray">{cats.find(c => c.id === item.categoryId)?.name || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-dark-text">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.available ? 'In Stock' : 'Out of Stock'} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvailability(item)} className="text-secondary-gray hover:text-primary-orange transition-colors">
                        {item.available ? <ToggleRight className="w-6 h-6 text-success-green" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDelete(item)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Item' : 'Add New Item'} maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput label="Item Name" id="item-name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Price (₹)" id="item-price" type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">Category <span className="text-red-500">*</span></label>
              <select value={formData.categoryId} onChange={e => setFormData(p => ({ ...p, categoryId: e.target.value }))} required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange bg-white text-sm">
                <option value="">Select category</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value={NEW_CATEGORY_VALUE}>+ Other (add new category)</option>
              </select>
            </div>
          </div>
          {formData.categoryId === NEW_CATEGORY_VALUE && (
            <div className="grid grid-cols-[1fr_auto] gap-3 -mt-2 p-3 bg-orange-50 border border-orange-100 rounded-lg">
              <FormInput label="New Category Name" id="new-category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Wraps" required />
              <FormInput label="Icon" id="new-category-icon" value={newCategoryIcon} onChange={e => setNewCategoryIcon(e.target.value)} placeholder="🌯" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange resize-none text-sm" />
          </div>
          <FormInput label="Image URL" id="item-image" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isVeg} onChange={e => setFormData(p => ({ ...p, isVeg: e.target.checked }))} className="accent-success-green w-4 h-4" />
              <span className="text-sm font-medium text-dark-text">Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.available} onChange={e => setFormData(p => ({ ...p, available: e.target.checked }))} className="accent-primary-orange w-4 h-4" />
              <span className="text-sm font-medium text-dark-text">Available</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-secondary-gray rounded-xl font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">{editItem ? 'Update Item' : 'Add Item'}</button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <Modal isOpen={true} onClose={() => setConfirmDelete(null)} title="Delete Item?" maxWidth="max-w-sm">
          <p className="text-secondary-gray mb-6">Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-200 text-secondary-gray rounded-xl font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
