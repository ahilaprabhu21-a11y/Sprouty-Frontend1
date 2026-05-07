import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import type { Post, User, Institution } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import PostCard from '../components/ui/PostCard';

const TABS = ['All', 'Art', 'Music', 'Dance', 'Code', 'Photography', 'Writing', 'Fitness'];

export default function HomePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [suggestedInst, setSuggestedInst] = useState<Institution[]>([]);

  useEffect(() => { loadFeed(); /* eslint-disable-next-line */ }, [tab]);
  useEffect(() => { loadSidebar(); }, []);

  async function loadFeed() {
    setLoading(true);
    try {
      const params: any = {};
      if (tab !== 'All') params.category = tab;
      const { data } = await api.get<Post[]>('/posts', { params });
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadSidebar() {
    try {
      const [u, i] = await Promise.all([
        api.get<User[]>('/users/suggested'),
        api.get<Institution[]>('/institutions'),
      ]);
      setSuggestedUsers(u.data);
      setSuggestedInst(i.data.slice(0, 3));
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-5">
      {/* LEFT NAV */}
      <aside className="hidden lg:block">
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-3 sticky top-20">
          {user && (
            <Link to={`/u/${user.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-50">
              <Avatar name={user.name} src={user.avatarUrl} size={40} />
              <div className="leading-tight min-w-0">
                <div className="text-[14px] font-medium text-ink-900 truncate">{user.name}</div>
                <div className="text-[11px] text-ink-500 truncate">{user.headline || 'Welcome 🌱'}</div>
              </div>
            </Link>
          )}
          <div className="mt-2 border-t border-ink-100 pt-2 flex flex-col">
            <NavLink to="/" label="Home" active />
            <NavLink to="/challenges" label="Challenges" />
            <NavLink to="/institutions" label="Institutions" />
          </div>

     
        </div>
      </aside>

      {/* CENTER */}
      <section className="min-w-0">
        {/* Category tabs */}
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-1.5 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 h-9 px-4 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-sprout-700 text-white shadow-sm'
                  : 'text-ink-500 hover:bg-ink-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Composer — input + Post button only (no Photo/Video icons) */}
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-4 mt-4">
          <div className="flex items-center gap-3">
            {user && <Avatar name={user.name} src={user.avatarUrl} size={40} />}
            <button
              type="button"
              onClick={() => nav('/create')}
              className="flex-1 h-11 px-4 rounded-[10px] bg-ink-50 border border-ink-100 text-left text-sm text-ink-500 hover:bg-white hover:border-sprout-400 transition-colors"
            >
              Share your talent...
            </button>
            <button
              type="button"
              onClick={() => nav('/create')}
              className="h-11 px-6 rounded-[10px] bg-sprout-700 hover:bg-sprout-800 text-white text-sm font-medium shadow-sm transition-colors"
            >
              Post
            </button>
          </div>
        </div>

        {/* Motivational banner */}
        <Link to="/challenges" className="block bg-gradient-to-br from-sprout-50 to-sprout-100 border border-sprout-200 rounded-2xl p-4 mt-4 hover:shadow-card transition-shadow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-sprout-700" />
            </div>
            <div>
              <div className="font-semibold text-ink-900 text-[14px]">Every expert was once a beginner.</div>
              <div className="text-[12.5px] text-ink-700 mt-0.5">Start a 21-day challenge 🚀</div>
            </div>
          </div>
        </Link>

        {/* Feed */}
        <div className="mt-4 flex flex-col gap-3">
          {loading && <FeedSkeleton />}
          {!loading && posts.length === 0 && <EmptyFeed />}
          {!loading && posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>

      {/* RIGHT */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 flex flex-col gap-3">
          <SidebarCard title="Suggested for you" icon={<TrendingUp className="w-3.5 h-3.5 text-sprout-700" />}>
            {suggestedUsers.length === 0 && <Empty text="No suggestions yet" />}
            {suggestedUsers.slice(0, 4).map((u) => (
              <Link key={u.id} to={`/u/${u.id}`} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-ink-50">
                <Avatar name={u.name} src={u.avatarUrl} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink-900 truncate">{u.name}</div>
                  <div className="text-[10.5px] text-ink-500 truncate">{u.headline || 'Creator'}</div>
                </div>
              </Link>
            ))}
          </SidebarCard>

          <SidebarCard title="Discover institutions">
            {suggestedInst.length === 0 && <Empty text="None yet" />}
            {suggestedInst.map((i) => (
              <Link key={i.id} to={`/institutions/${i.id}`} className="block p-2 rounded-lg hover:bg-ink-50">
                <div className="text-[13px] font-medium text-ink-900 truncate">{i.name}</div>
                <div className="text-[10.5px] text-ink-500 truncate">{i.location} · {i.memberCount} members</div>
              </Link>
            ))}
          </SidebarCard>
        </div>
      </aside>
    </div>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? 'text-sprout-800 font-semibold bg-sprout-50' : 'text-ink-500 hover:bg-ink-50'
      }`}
    >
      {label}
    </Link>
  );
}

function SidebarCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-3">
      <div className="text-[13px] font-semibold text-ink-900 mb-2 px-1 flex items-center gap-1.5">
        {icon}{title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-[11px] text-ink-500 px-2 py-1">{text}</div>;
}

function FeedSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white border border-ink-100 rounded-2xl p-5">
          <div className="flex gap-3 items-center mb-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-3 w-1/3 mb-2" />
              <div className="skeleton h-2.5 w-1/4" />
            </div>
          </div>
          <div className="skeleton h-2.5 w-full mb-1.5" />
          <div className="skeleton h-2.5 w-4/5" />
        </div>
      ))}
    </>
  );
}

function EmptyFeed() {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sprout-100 to-sprout-300 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-sprout-700" />
      </div>
      <div className="text-base font-semibold text-ink-900">No posts yet in this category</div>
      <div className="text-[13px] text-ink-500 mt-1">Be the first to share something!</div>
    </div>
  );
}
