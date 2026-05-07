import { Link, useNavigate } from 'react-router-dom';
import { Bell, Home, LogOut, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState('');

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        <Link to="/"><Logo size="md" /></Link>

        <form onSubmit={onSearch} className="flex-1 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search creators, posts, challenges..."
            className="w-full h-10 pl-10 pr-4 rounded-[10px] bg-ink-50 border border-ink-100 text-sm focus:outline-none focus:border-sprout-400 focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {/* Home icon */}
          <Link
            to="/"
            title="Home"
            className="w-10 h-10 rounded-[10px] hover:bg-ink-50 flex items-center justify-center text-ink-700"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Notification */}
          <button className="relative w-10 h-10 rounded-[10px] hover:bg-ink-50 flex items-center justify-center text-ink-700">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-[1.5px] border-white" />
          </button>

          <Link to={user ? `/u/${user.id}` : '/login'} className="flex items-center gap-2 h-10 pl-1 pr-3 rounded-[10px] hover:bg-ink-50">
            {user && <Avatar name={user.name} src={user.avatarUrl} size={30} />}
            <span className="text-[13.5px] font-medium text-ink-900 hidden sm:block">{user?.name || 'Guest'}</span>
          </Link>

          <button
            onClick={() => { logout(); nav('/login'); }}
            title="Logout"
            className="w-10 h-10 rounded-[10px] hover:bg-ink-50 flex items-center justify-center text-ink-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
