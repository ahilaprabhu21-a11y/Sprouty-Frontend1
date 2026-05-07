import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Plus, Sparkles, Trophy } from 'lucide-react';
import { api } from '../lib/api';
import type { Challenge } from '../lib/types';
import { CATEGORIES } from '../lib/types';
import { readableError } from '../lib/utils';
import Button from '../components/ui/Button';
import CategoryPill from '../components/ui/CategoryPill';

export default function MyChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Art', description: '' });
  const [err, setErr] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<Challenge[]>('/challenges');
      setChallenges(data);
    } finally {
      setLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setErr('Title required');
    setBusy(true);
    setErr('');
    try {
      await api.post('/challenges', form);
      setForm({ title: '', category: 'Art', description: '' });
      setShowForm(false);
      load();
    } catch (e: any) {
      setErr(readableError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">My Challenges</h1>
          <p className="text-sm text-ink-500 mt-0.5">21 days to build a habit. Every step counts.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="w-4 h-4" /> New challenge
        </Button>
      </div>

      <div className="bg-gradient-to-br from-sprout-50 to-sprout-100 border border-sprout-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-sprout-700" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-ink-900">Every expert was once a beginner.</div>
          <div className="text-[12.5px] text-ink-700 mt-0.5">Small steps daily lead to massive growth.</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white border border-ink-100 shadow-card rounded-2xl p-5 mb-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-ink-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Draw a plant"
              className="mt-1 w-full h-10 px-3 rounded-[10px] border border-ink-100 bg-ink-50 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-700">Category</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, category: c })}
                  className={`px-3.5 h-8 rounded-full text-xs font-medium border ${
                    form.category === c
                      ? 'bg-sprout-700 border-sprout-700 text-white'
                      : 'bg-white border-ink-100 text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-[10px] border border-ink-100 bg-ink-50 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white resize-none"
            />
          </div>
          {err && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{err}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create challenge'}</Button>
          </div>
        </form>
      )}

      {loading && <div className="text-sm text-ink-500">Loading…</div>}

      {!loading && challenges.length === 0 && (
        <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sprout-100 to-sprout-300 flex items-center justify-center mb-3">
            <Trophy className="w-7 h-7 text-sprout-700" />
          </div>
          <div className="text-base font-semibold text-ink-900">No challenges yet</div>
          <div className="text-[13px] text-ink-500 mt-1">Pick a skill and commit to 21 days.</div>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Start a challenge
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {challenges.map((c) => (
          <Link key={c.id} to={`/challenges/${c.id}`} className="bg-white border border-ink-100 rounded-2xl p-4 hover:border-sprout-300 hover:shadow-card transition shadow-card">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CategoryPill category={c.category} />
              <div className="flex items-center gap-1 text-xs text-gold-600 font-medium">
                <Flame className="w-3 h-3" /> {c.streakDays} day{c.streakDays === 1 ? '' : 's'}
              </div>
            </div>
            <div className="text-base font-semibold text-ink-900">{c.title}</div>
            {c.description && <div className="text-[12.5px] text-ink-500 mt-0.5 line-clamp-2">{c.description}</div>}

            <div className="flex items-center justify-between mt-3 mb-1.5 text-[11.5px] text-ink-500">
              <span>Day {c.currentDay} of {c.durationDays}</span>
              <span className="font-medium text-sprout-700">{c.progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sprout-500 to-sprout-700 rounded-full" style={{ width: `${c.progressPercent}%` }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
