import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { Search, UserCheck, UserX } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    adminService.getUsers().then(data => { setUsers(data.map(u => ({ ...u, active: u.active !== false }))); setLoading(false); });
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    const user = users.find(u => u.id === id);
    addToast(`${user.name} has been ${user.active ? 'deactivated' : 'activated'}`, 'info');
  };

  if (loading) return <LoadingState message="Loading users..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-text">User Management</h1>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50 bg-white" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange/50">
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="delivery">Delivery Staff</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState title="No users found" message="Try adjusting your search or filter." /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-secondary-gray">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-primary-orange font-bold text-sm">{user.name[0]}</div>
                        <span className="font-medium text-dark-text">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary-gray">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${user.role === 'delivery' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{user.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(user.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${user.active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                        {user.active ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
