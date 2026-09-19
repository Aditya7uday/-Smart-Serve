import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function DeliveryLayout() {
  return (
    <div className="min-h-screen flex bg-light-bg text-dark-text">
      <Sidebar role="delivery" />
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
