import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';
import { LoadingState } from '../../components/LoadingState';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { Pencil, Plus } from 'lucide-react';

export function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [newStock, setNewStock] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    adminService.getInventory().then(data => { setInventory(data); setLoading(false); });
  }, []);

  const handleUpdate = async () => {
    if (!editItem || newStock === '') return;
    try {
      const updated = await adminService.updateInventoryStock(editItem.id, Number(newStock));
      setInventory(prev => prev.map(i => i.id === updated.id ? updated : i));
      addToast(`${updated.name} stock updated to ${updated.currentStock} ${updated.unit}`, 'success');
      setEditItem(null);
    } catch {
      addToast('Failed to update stock', 'error');
    }
  };

  if (loading) return <LoadingState message="Loading inventory..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-text">Inventory Management</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Item', 'Current Stock', 'Min Stock', 'Unit', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-secondary-gray">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-dark-text">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${item.currentStock === 0 ? 'text-red-500' : item.currentStock <= item.minStock ? 'text-yellow-600' : 'text-dark-text'}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary-gray">{item.minStock}</td>
                  <td className="px-4 py-3 text-secondary-gray">{item.unit}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setEditItem(item); setNewStock(String(item.currentStock)); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-secondary-gray hover:text-dark-text transition-colors">
                      <Pencil className="w-3 h-3" /> Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editItem && (
        <Modal isOpen={true} onClose={() => setEditItem(null)} title={`Update Stock — ${editItem.name}`} maxWidth="max-w-sm">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="flex justify-between"><span className="text-secondary-gray">Current stock</span><span className="font-bold">{editItem.currentStock} {editItem.unit}</span></div>
              <div className="flex justify-between mt-1"><span className="text-secondary-gray">Minimum stock</span><span className="font-medium">{editItem.minStock} {editItem.unit}</span></div>
              <div className="flex justify-between mt-1"><span className="text-secondary-gray">Status</span><StatusBadge status={editItem.status} /></div>
            </div>
            <FormInput label={`New Stock (${editItem.unit})`} id="new-stock" type="number" value={newStock} onChange={e => setNewStock(e.target.value)} required />
            <div className="flex gap-3">
              <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 border border-gray-200 text-secondary-gray rounded-xl font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 py-2.5 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">Update</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
