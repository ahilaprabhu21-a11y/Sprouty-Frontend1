import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../lib/api';
import type { User } from '../lib/types';
import Avatar from '../components/ui/Avatar';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { run(); /* eslint-disable-next-line */ }, [q]);

  async function run() {
    setLoading(true);
    try {
      const { data } = await api.get<User[]>('/users/search', { params: { q } });
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-ink-700 mb-3">
        <Search className="w-4 h-4" />
        <h1 className="text-base font-semibold">Search results for "{q}"</h1>
      </div>
      {loading ? (
        <div className="text-sm text-ink-500">Searching…</div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-8 text-center text-sm text-ink-500">
          No users matched.
        </div>
      ) : (
        <div className="bg-white border border-ink-100 shadow-card rounded-2xl divide-y divide-ink-100">
          {users.map((u) => (
            <Link key={u.id} to={`/u/${u.id}`} className="flex items-center gap-3 p-3 hover:bg-ink-50">
              <Avatar name={u.name} src={u.avatarUrl} size={42} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink-900 truncate">{u.name}</div>
                <div className="text-xs text-ink-500 truncate">{u.headline || 'No bio'}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
