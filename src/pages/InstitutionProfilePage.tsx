import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Building2, Check, MapPin, Star, Trophy, Users } from 'lucide-react';
import { api } from '../lib/api';
import type { Institution } from '../lib/types';
import Button from '../components/ui/Button';
import CategoryPill from '../components/ui/CategoryPill';
import { initials } from '../lib/utils';

export default function InstitutionProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [inst, setInst] = useState<Institution | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function load() {
    if (!id) return;
    const { data } = await api.get<Institution>(`/institutions/${id}`);
    setInst(data);
  }

  async function toggleJoin() {
    if (!inst || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/institutions/${inst.id}/join`);
      setInst({ ...inst, joinedByMe: data.joined, memberCount: data.memberCount });
    } finally { setBusy(false); }
  }

  if (!inst) return <div className="text-sm text-ink-500 p-8">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <Link to="/institutions" className="flex items-center gap-1.5 text-sm text-sprout-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to institutions
      </Link>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6 flex items-start gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-elevated">
          {initials(inst.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-sprout-700" />
            <CategoryPill category={inst.category} size="xs" />
          </div>
          <h1 className="text-2xl font-display font-bold text-ink-900">{inst.name}</h1>
          <p className="text-[13.5px] text-ink-700 mt-1">{inst.description}</p>
          <div className="flex items-center gap-4 mt-2 text-[12.5px] text-ink-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {inst.location}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {inst.memberCount} members</span>
          </div>
        </div>
        <Button onClick={toggleJoin} disabled={busy} variant={inst.joinedByMe ? 'secondary' : 'primary'}>
          {busy ? '…' : inst.joinedByMe ? <><Check className="w-3.5 h-3.5" /> Joined</> : 'Join'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={<BookOpen className="w-4 h-4 text-sprout-700" />} title="Courses">
          {inst.courses.length === 0 ? (
            <Empty text="No courses listed" />
          ) : (
            <ul className="flex flex-col gap-1.5">
              {inst.courses.map((c) => (
                <li key={c} className="bg-ink-50 px-3 py-2 rounded-md text-sm text-ink-900">{c}</li>
              ))}
            </ul>
          )}
        </Section>

        <Section icon={<Award className="w-4 h-4 text-gold-600" />} title="Achievements">
          {inst.achievements.length === 0 ? (
            <Empty text="No achievements yet" />
          ) : (
            <ul className="flex flex-col gap-1.5">
              {inst.achievements.map((a) => (
                <li key={a} className="bg-gold-400/10 px-3 py-2 rounded-md text-sm text-ink-900 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section icon={<Star className="w-4 h-4 text-violet-600" />} title="Success Stories">
        {inst.successStories.length === 0 ? (
          <Empty text="No stories yet" />
        ) : (
          <ul className="flex flex-col gap-1.5">
            {inst.successStories.map((s) => (
              <li key={s} className="bg-violet-50 px-3 py-2 rounded-md text-sm text-ink-900 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-ink-500">{text}</div>;
}
