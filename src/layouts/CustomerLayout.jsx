import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-dark-text">
      <Navbar role="customer" />
      <main className="flex-grow max-w-7xl mx-auto w-full p-4">
        <Outlet />
      </main>
    </div>
  );
}
