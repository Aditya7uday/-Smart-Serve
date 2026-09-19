import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-light-bg text-dark-text">
      <Sidebar role="admin" />
      <main className="flex-grow p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
