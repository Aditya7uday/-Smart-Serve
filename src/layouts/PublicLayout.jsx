import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-dark-text">
      <Navbar role="public" />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="p-4 text-center text-secondary-gray text-sm">
        &copy; {new Date().getFullYear()} Smart Serve
      </footer>
    </div>
  );
}
