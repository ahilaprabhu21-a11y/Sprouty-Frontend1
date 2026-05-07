import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Flame, ImageIcon, Lightbulb, Lock, Plus, Sparkles, Star, Target, TrendingUp, Trophy, Video,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Challenge, ChallengeEntry } from '../lib/types';
import Button from '../components/ui/Button';
import CategoryPill from '../components/ui/CategoryPill';

const VISUAL_CATS = new Set(['Art', 'Fitness', 'Dance', 'Photography']);

const REWARDS = [
  { day: 1, name: 'First Step' },
  { day: 7, name: 'Week Warrior' },
  { day: 14, name: 'Halfway Hero' },
  { day: 21, name: 'Champion' },
];

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [entries, setEntries] = useState<ChallengeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/challenges/${id}`);
      setChallenge(data.challenge);
      setEntries(data.entries);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !challenge) return <div className="text-sm text-ink-500 p-8">Loading…</div>;

  const day1 = entries.find((e) => e.dayNumber === 1);
  const latest = [...entries].sort((a, b) => b.dayNumber - a.dayNumber)[0];
  const showComparison = VISUAL_CATS.has(challenge.category) && day1 && latest && day1.id !== latest.id;
  const completedDayNumbers = new Set(entries.map((e) => e.dayNumber));

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <Link to="/challenges" className="flex items-center gap-1.5 text-sm text-sprout-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to my challenges
      </Link>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CategoryPill category={challenge.category} />
          <h1 className="text-2xl font-display font-bold text-ink-900 mt-2">{challenge.title}</h1>
          {challenge.description && <p className="text-sm text-ink-700 mt-1">{challenge.description} 🌱</p>}

          <div className="flex items-center gap-2 mt-4 text-sm flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sprout-50 text-sprout-800 rounded-md">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Day {challenge.currentDay} of {challenge.durationDays}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-medium">{challenge.streakDays} day streak</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-ink-700 font-medium">Progress</span>
              <span className="text-sprout-700 font-semibold">{challenge.progressPercent}% complete</span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sprout-500 to-sprout-700 rounded-full" style={{ width: `${challenge.progressPercent}%` }} />
            </div>
          </div>

          <Button onClick={() => nav(`/challenges/${challenge.id}/add`)} className="mt-5 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Day Entry
          </Button>

          {/* Rewards */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {REWARDS.map((r) => {
              const earned = challenge.completedDays >= r.day;
              return (
                <div key={r.day} className={`p-3 rounded-lg border ${earned ? 'bg-gold-400/10 border-gold-400/40' : 'bg-ink-50 border-ink-100'}`}>
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${earned ? 'text-gold-600' : 'text-ink-300'}`} />
                    <div>
                      <div className={`text-[11px] ${earned ? 'text-gold-700 font-semibold' : 'text-ink-500'}`}>Day {r.day}</div>
                      <div className={`text-[12px] font-medium ${earned ? 'text-ink-900' : 'text-ink-500'}`}>{r.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink-900 mb-2">21-Day Progress</div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: challenge.durationDays }, (_, i) => i + 1).map((day) => {
              const completed = completedDayNumbers.has(day);
              const current = day === challenge.currentDay;
              const locked = day > challenge.currentDay;
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium border ${
                    completed
                      ? 'bg-gradient-to-br from-sprout-500 to-sprout-700 text-white border-transparent shadow-sm'
                      : current
                      ? 'bg-gold-400/20 text-gold-700 border-gold-400'
                      : 'bg-ink-50 text-ink-500 border-transparent'
                  }`}
                >
                  <span className="text-[13px]">{day}</span>
                  {locked && !current && <Lock className="w-2.5 h-2.5 mt-0.5" />}
                  {current && <Star className="w-2.5 h-2.5 mt-0.5 fill-current" />}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-ink-500">
            <Legend color="bg-sprout-600" label="Completed" />
            <Legend color="bg-gold-400" label="Current" />
            <Legend color="bg-ink-300" label="Locked" />
          </div>
        </div>
      </div>

      {showComparison && (
        <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <h2 className="text-base font-semibold text-ink-900">
                Smart Visual Comparison: Day 1 vs Day {latest!.dayNumber}
              </h2>
            </div>
            <p className="text-xs text-ink-500 mb-4">See how you're improving</p>

            <div className="flex items-center gap-3">
              <ComparisonImage label="Day 1" subtitle="Where you started" entry={day1!} />
              <div className="text-xs font-bold text-ink-500 px-2 py-1 bg-ink-50 rounded-full">VS</div>
              <ComparisonImage
                label={`Day ${latest!.dayNumber}`}
                subtitle="Here is your current"
                entry={latest!}
              />
            </div>
          </div>

          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-violet-700" />
              <span className="text-sm font-semibold text-violet-900">Insights</span>
            </div>
            <Insight icon={<TrendingUp className="w-4 h-4 text-emerald-600" />} title="Great start!" body="You've been consistent." />
            <Insight icon={<Star className="w-4 h-4 text-amber-500 fill-current" />} title="Keep going" body="Small steps, big progress." />
            <Insight icon={<Target className="w-4 h-4 text-violet-700" />} title="Tip" body="Focus on details and shading." />
          </div>
        </div>
      )}

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Your Entries</h2>
            <p className="text-xs text-ink-500">Track your daily progress</p>
          </div>
          <select className="h-8 px-2 text-xs rounded-md border border-ink-100 bg-white">
            <option>Latest first</option>
          </select>
        </div>

        {entries.length === 0 ? (
          <div className="text-center text-sm text-ink-500 py-8">
            No entries yet. Add your first one to start tracking progress!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <div key={e.id} className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sprout-500 to-sprout-700 text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-sm">
                  {e.dayNumber}
                </div>
                <div className="flex-1 flex gap-3 items-start">
                  <div className="w-24 h-20 rounded-lg bg-ink-100 overflow-hidden shrink-0 grid place-items-center">
                    {e.mediaType === 'image' && e.mediaUrl ? (
                      <img src={e.mediaUrl} alt="" className="w-full h-full object-cover" />
                    ) : e.mediaType === 'video' && e.mediaUrl ? (
                      <video src={e.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-ink-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink-900">Day {e.dayNumber}</span>
                      <span className="text-[11px] text-ink-500">
                        · {new Date(e.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    {e.mediaType !== 'none' && (
                      <span className="inline-block bg-sprout-100 text-sprout-700 text-[10px] font-medium px-2 py-0.5 rounded mt-1">
                        {e.mediaType === 'image' ? 'Image' : 'Video'}
                      </span>
                    )}
                    {e.note && <p className="text-[12.5px] text-ink-700 mt-1">{e.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function ComparisonImage({ label, subtitle, entry }: { label: string; subtitle: string; entry: ChallengeEntry }) {
  return (
    <div className="flex-1">
      <div className="mb-1.5">
        <span className="text-sm font-semibold text-sprout-700">{label}</span>
        <span className="text-xs text-ink-500"> — {subtitle}</span>
      </div>
      <div className="aspect-video rounded-lg bg-ink-50 border border-ink-100 grid place-items-center overflow-hidden relative">
        {entry.mediaType === 'image' && entry.mediaUrl ? (
          <img src={entry.mediaUrl} className="w-full h-full object-cover" />
        ) : entry.mediaType === 'video' && entry.mediaUrl ? (
          <video src={entry.mediaUrl} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-7 h-7 text-ink-500" />
        )}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
          {entry.mediaType === 'video' ? 'Video' : 'Image'}
        </span>
      </div>
    </div>
  );
}

function Insight({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <div className="w-7 h-7 rounded-md bg-white grid place-items-center shrink-0 shadow-sm">{icon}</div>
      <div>
        <div className="text-[12.5px] font-semibold text-ink-900">{title}</div>
        <div className="text-[11px] text-ink-700">{body}</div>
      </div>
    </div>
  );
}
