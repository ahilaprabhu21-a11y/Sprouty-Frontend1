import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, UserMinus, UserPlus, UserX } from 'lucide-react';
import { api } from '../lib/api';
import type { FollowListItem } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';

interface Props {
  mode: 'followers' | 'following';
}

export default function FollowListPage({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();
  const nav = useNavigate();
  const [list, setList] = useState<FollowListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [profileName, setProfileName] = useState('');

  const isMyProfile = me?.id === Number(id);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id, mode]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const [listRes, profileRes] = await Promise.all([
        api.get<FollowListItem[]>(`/follows/${id}/${mode}`),
        api.get(`/users/${id}`),
      ]);
      setList(listRes.data);
      setProfileName(profileRes.data.user.name);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow(item: FollowListItem) {
    setBusyId(item.id);
    try {
      if (item.iFollowThem) {
        await api.delete(`/follows/${item.id}`);
      } else {
        await api.post(`/follows/${item.id}`);
      }
      setList((prev) => prev.map((x) => x.id === item.id ? { ...x, iFollowThem: !x.iFollowThem } : x));
    } finally {
      setBusyId(null);
    }
  }

  async function unfollow(item: FollowListItem) {
    if (!confirm(`Unfollow ${item.name}?`)) return;
    setBusyId(item.id);
    try {
      await api.delete(`/follows/${item.id}`);
      setList((prev) => prev.filter((x) => x.id !== item.id));
    } finally {
      setBusyId(null);
    }
  }

  async function removeFollower(item: FollowListItem) {
    if (!confirm(`Remove ${item.name} from your followers? They won't be notified.`)) return;
    setBusyId(item.id);
    try {
      await api.delete(`/follows/remove-follower/${item.id}`);
      setList((prev) => prev.filter((x) => x.id !== item.id));
    } finally {
      setBusyId(null);
    }
  }

  const title = mode === 'followers' ? 'Followers' : 'Following';

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-sm text-sprout-700 mb-3 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100">
          <h1 className="text-lg font-display font-bold text-ink-900">{title}</h1>
          <p className="text-xs text-ink-500 mt-0.5">
            {mode === 'followers' ? `People who follow ${isMyProfile ? 'you' : profileName}` : `People ${isMyProfile ? 'you' : profileName} follow${isMyProfile ? '' : 's'}`}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-ink-500">Loading…</div>
        ) : list.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-50 flex items-center justify-center mb-3">
              {mode === 'followers' ? (
                <UserPlus className="w-6 h-6 text-ink-500" />
              ) : (
                <UserX className="w-6 h-6 text-ink-500" />
              )}
            </div>
            <div className="text-sm font-semibold text-ink-900">
              {mode === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </div>
            <div className="text-[12.5px] text-ink-500 mt-1">
              {mode === 'followers' ? 'Share posts to grow your audience.' : 'Discover creators to start following.'}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {list.map((item) => (
              <li key={item.id} className="px-5 py-3 flex items-center gap-3">
                <Link to={`/u/${item.id}`} className="shrink-0">
                  <Avatar name={item.name} src={item.avatarUrl} size={42} />
                </Link>
                <Link to={`/u/${item.id}`} className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate hover:underline">{item.name}</div>
                  <div className="text-[11.5px] text-ink-500 truncate">{item.headline || 'Creator'}</div>
                </Link>

                {/* Action buttons */}
                {item.id !== me?.id && (
                  <div className="flex gap-2 shrink-0">
                    {/* Followers list, viewing own profile → "Remove" button */}
                    {mode === 'followers' && isMyProfile && (
                      <button
                        onClick={() => removeFollower(item)}
                        disabled={busyId === item.id}
                        title="Remove follower"
                        className="h-8 px-3 rounded-lg border border-ink-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-xs font-medium text-ink-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <UserMinus className="w-3 h-3" /> Remove
                      </button>
                    )}

                    {/* Following list, viewing own profile → "Unfollow" */}
                    {mode === 'following' && isMyProfile && (
                      <button
                        onClick={() => unfollow(item)}
                        disabled={busyId === item.id}
                        className="h-8 px-3 rounded-lg border border-ink-100 hover:bg-ink-50 text-xs font-medium text-ink-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Following
                      </button>
                    )}

                    {/* Anyone else's list → Follow / Following toggle */}
                    {!isMyProfile && (
                      <button
                        onClick={() => toggleFollow(item)}
                        disabled={busyId === item.id}
                        className={`h-8 px-3 rounded-lg text-xs font-medium disabled:opacity-50 flex items-center gap-1 ${
                          item.iFollowThem
                            ? 'border border-ink-100 bg-white text-ink-700 hover:bg-ink-50'
                            : 'bg-sprout-700 hover:bg-sprout-800 text-white'
                        }`}
                      >
                        {item.iFollowThem ? (
                          <><Check className="w-3 h-3" /> Following</>
                        ) : (
                          <><UserPlus className="w-3 h-3" /> Follow</>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
