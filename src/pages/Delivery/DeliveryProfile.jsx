import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { UserCircle, Loader2 } from 'lucide-react';

export function DeliveryProfile() {
  const { state: authState, dispatch } = useAuth();
  const { addToast } = useToast();
  const user = authState.user;
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile({ name: form.name, phone: form.phone });
      dispatch({ type: 'LOGIN', payload: { ...user, ...updated } });
      addToast('Profile updated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-dark-text mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-purple-500" />
          </div>
          <div>
            <p className="font-bold text-lg text-dark-text">{user?.name}</p>
            <p className="text-secondary-gray text-sm capitalize">{user?.role}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput label="Full Name" id="dp-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <FormInput label="Email" id="dp-email" type="email" value={user?.email || ''} disabled />
          <FormInput label="Phone" id="dp-phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
