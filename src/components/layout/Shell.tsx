import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Shell() {
  return (
    <div className="min-h-full">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
