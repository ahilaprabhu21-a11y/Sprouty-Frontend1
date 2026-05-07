import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Plus, Sparkles, Users } from 'lucide-react';
import { api } from '../lib/api';
import type { Institution } from '../lib/types';
import { CATEGORIES } from '../lib/types';
import Button from '../components/ui/Button';
import { initials } from '../lib/utils';
import CategoryPill from '../components/ui/CategoryPill';

const TABS = ['All', ...CATEGORIES];

export default function InstitutionsPage() {
  const [items, setItems] = useState<Institution[]>([]);
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<Institution[]>('/institutions', {
        params: tab === 'All' ? {} : { category: tab },
      });
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2.5">
        <Building2 className="w-6 h-6 text-sprout-700" />
        <h1 className="text-2xl font-display font-bold text-ink-900">Institutions</h1>
      </div>
      <p className="text-sm text-ink-500 mt-1">Discover academies and communities near you.</p>

      <div className="flex gap-2 mt-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 h-9 rounded-full text-xs font-medium border transition-colors ${
              tab === t
                ? 'bg-sprout-700 border-sprout-700 text-white shadow-sm'
                : 'bg-white border-ink-100 text-ink-700 hover:bg-ink-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="text-sm text-ink-500">Loading…</div>
        ) : items.length === 0 ? (
          <EmptyState category={tab} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((i) => <Card key={i.id} i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ i }: { i: Institution }) {
  return (
    <Link
      to={`/institutions/${i.id}`}
      className="bg-white border border-ink-100 rounded-2xl p-4 hover:border-sprout-300 hover:shadow-card transition shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
          {initials(i.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-ink-900 truncate">{i.name}</div>
          <div className="mt-1"><CategoryPill category={i.category} size="xs" /></div>
        </div>
      </div>
      <p className="text-[12.5px] text-ink-700 mt-3 line-clamp-2">{i.description}</p>
      <div className="flex items-center gap-3 mt-3 text-[11.5px] text-ink-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {i.location}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {i.memberCount} members</span>
      </div>
    </Link>
  );
}

function EmptyState({ category }: { category: string }) {
  const isAll = category === 'All';
  return (
    <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-12 text-center">
      <div className="flex justify-center mb-5">
        <div className="relative">
          <div className="rounded-2xl bg-gradient-to-br from-sprout-100 to-sprout-300 flex items-center justify-center" style={{ width: 88, height: 88 }}>
            <Building2 className="w-10 h-10 text-sprout-700" strokeWidth={1.8} />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-gold-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
      <h2 className="text-base font-semibold text-ink-900">
        {isAll ? 'No institutions yet' : `No institutions in ${category}`}
      </h2>
      <p className="text-[13px] text-ink-500 mt-1.5 max-w-sm mx-auto">
        {isAll
          ? 'Be the first to add an academy or community to Sprouty. Help others find their tribe.'
          : `We don't have any ${category} academies yet. Be the first to add one.`}
      </p>
      <div className="flex justify-center gap-2 mt-5">
        <Button>
          <Plus className="w-4 h-4" /> Add an institution
        </Button>
        <Button variant="secondary">Suggest one</Button>
      </div>
    </div>
  );
}
