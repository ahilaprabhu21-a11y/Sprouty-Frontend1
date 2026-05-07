import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Camera, Check, MapPin, MessageCircle, MoreHorizontal, Pencil, UserPlus } from 'lucide-react';
import { api } from '../lib/api';
import type { Post, ProfileResponse } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import CategoryPill from '../components/ui/CategoryPill';
import PostCard from '../components/ui/PostCard';

const TABS = ['Posts', 'Challenges', 'Saved'] as const;
type Tab = typeof TABS[number];

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<Tab>('Posts');
  const [loading, setLoading] = useState(true);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        api.get<ProfileResponse>(`/users/${id}`),
        api.get<Post[]>('/posts', { params: { userId: id } }),
      ]);
      setData(profileRes.data);
      setPosts(postsRes.data);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow() {
    if (!data || followBusy) return;
    setFollowBusy(true);
    try {
      const res = data.iFollowThem
        ? await api.delete(`/follows/${data.user.id}`)
        : await api.post(`/follows/${data.user.id}`);
      setData({
        ...data,
        iFollowThem: res.data.following,
        stats: { ...data.stats, followers: res.data.followers },
      });
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed');
    } finally {
      setFollowBusy(false);
    }
  }

  if (loading || !data) {
    return <div className="text-sm text-ink-500 p-8">Loading profile…</div>;
  }

  const u = data.user;
  const isMe = me?.id === u.id;
  const joinDate = new Date(u.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-ink-100 shadow-card rounded-2xl overflow-hidden">
        <div
          className="h-36 sm:h-44 relative"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(27,94,32,0.92) 0%, rgba(46,125,50,0.85) 50%, rgba(102,187,106,0.7) 100%)',
          }}
        >
          <svg className="absolute top-0 right-0 opacity-15" width="280" height="180" viewBox="0 0 280 180" fill="none">
            <circle cx="240" cy="40" r="50" fill="white" />
            <circle cx="200" cy="140" r="35" fill="white" />
          </svg>
          {isMe && (
            <div className="absolute top-3 right-3 flex gap-2">
              <button className="h-8 px-3 rounded-lg bg-white/95 text-sprout-700 text-xs font-medium flex items-center gap-1 hover:bg-white">
                <Camera className="w-3 h-3" /> Change cover
              </button>
              <button className="h-8 px-3 rounded-lg bg-white/95 text-sprout-700 text-xs font-medium flex items-center gap-1 hover:bg-white">
                <Pencil className="w-3 h-3" /> Edit profile
              </button>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-6 pb-6 text-center">
          <div className="flex justify-center -mt-14 sm:-mt-16 relative">
            <div className="relative">
              <div className="ring-4 ring-white rounded-full shadow-lg">
                <Avatar name={u.name} src={u.avatarUrl} size={112} />
              </div>
              {isMe && (
                <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border border-ink-100 flex items-center justify-center hover:bg-ink-50 shadow-sm">
                  <Camera className="w-4 h-4 text-sprout-700" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-display font-bold text-ink-900 tracking-tight">{u.name}</h1>
              <span className="bg-gold-400/20 text-gold-600 text-[10px] font-bold px-2 py-0.5 rounded">PRO</span>
            </div>
          </div>

          {u.headline && (
            <p className="text-[13.5px] text-ink-700 mt-2 max-w-md mx-auto leading-relaxed">{u.headline}</p>
          )}

          <div className="flex items-center justify-center gap-4 mt-3 text-[12.5px] text-ink-500 flex-wrap">
            {u.location && (
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {u.location}</div>
            )}
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {joinDate}</div>
          </div>

          {u.categories.length > 0 && (
            <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
              {u.categories.map((c) => <CategoryPill key={c} category={c} />)}
            </div>
          )}

          {!isMe && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                onClick={toggleFollow}
                disabled={followBusy}
                variant={data.iFollowThem ? 'secondary' : 'primary'}
              >
                {data.iFollowThem ? (
                  <><Check className="w-3.5 h-3.5" /> Following</>
                ) : (
                  <><UserPlus className="w-3.5 h-3.5" /> Follow</>
                )}
              </Button>
              <Button variant="secondary"><MessageCircle className="w-3.5 h-3.5" /> Message</Button>
              <button className="w-10 h-10 rounded-[10px] bg-white border border-ink-100 flex items-center justify-center hover:bg-ink-50">
                <MoreHorizontal className="w-4 h-4 text-ink-700" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-ink-100">
            <Stat n={data.stats.posts} label="Posts" />
            <Stat n={data.stats.challenges} label="Challenges" />
            <Stat
              n={data.stats.followers}
              label="Followers"
              href={`/u/${u.id}/followers`}
            />
            <Stat
              n={data.stats.following}
              label="Following"
              href={`/u/${u.id}/following`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-1.5 mt-4 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-sprout-700 text-white shadow-sm' : 'text-ink-500 hover:bg-ink-50'
            }`}
          >
            {t} {t === 'Posts' && <span className="opacity-70 ml-1">{data.stats.posts}</span>}
            {t === 'Challenges' && <span className="opacity-70 ml-1">{data.stats.challenges}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {tab === 'Posts' && (
          <>
            {posts.length === 0 ? (
              <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center text-sm text-ink-500">
                No posts yet.
              </div>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} onDeleted={(id) => setPosts((prev) => prev.filter((x) => x.id !== id))} />)
            )}
          </>
        )}
        {tab === 'Challenges' && (
          <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center">
            <div className="text-sm text-ink-500">View all your active challenges in</div>
            <button onClick={() => nav('/challenges')} className="mt-2 text-sprout-700 text-sm font-semibold hover:underline">
              My Challenges →
            </button>
          </div>
        )}
        {tab === 'Saved' && (
          <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center text-sm text-ink-500">
            Saved posts will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ n, label, href }: { n: number; label: string; href?: string }) {
  const cls = "bg-ink-50 rounded-lg py-2.5 transition-colors";
  const inner = (
    <>
      <div className="text-lg font-semibold text-ink-900">{n}</div>
      <div className="text-[11px] text-ink-500">{label}</div>
    </>
  );
  if (href) {
    return <Link to={href} className={`${cls} hover:bg-ink-100 cursor-pointer block`}>{inner}</Link>;
  }
  return <div className={cls}>{inner}</div>;
}
