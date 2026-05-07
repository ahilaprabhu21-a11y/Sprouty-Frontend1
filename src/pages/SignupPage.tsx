import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../lib/types';
import { readableError } from '../lib/utils';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', headline: '', location: '',
  });
  const [cats, setCats] = useState<string[]>([]);
  const [other, setOther] = useState('');

  function toggle(c: string) {
    setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const all = [...cats];
    if (other.trim()) all.push(other.trim());
    try {
      await signup({ ...form, categories: all.join(',') });
      nav('/');
    } catch (e: any) {
      setErr(readableError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-br from-sprout-50 via-white to-ink-50">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>

        <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-7">
          <h1 className="text-xl font-display font-bold text-ink-900">Create your account</h1>
          <p className="text-sm text-ink-500 mt-1">Start your 21-day journey 🌱</p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <Field label="Name" v={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" v={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Password (min 6 chars)" type="password" v={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
            <Field label="Headline (short bio)" v={form.headline} onChange={(v) => setForm({ ...form, headline: v })} />
            <Field label="Location" v={form.location} onChange={(v) => setForm({ ...form, location: v })} />

            <div>
              <span className="text-xs font-medium text-ink-700">Categories</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORIES.map((c) => {
                  const active = cats.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggle(c)}
                      className={`px-3.5 h-8 rounded-full text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-sprout-700 border-sprout-700 text-white'
                          : 'bg-white border-ink-100 text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <input
                value={other}
                onChange={(e) => setOther(e.target.value)}
                placeholder='Other (e.g. "Pottery")'
                className="mt-2 w-full h-9 px-3 rounded-[10px] border border-ink-100 bg-ink-50 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white"
              />
            </div>

            {err && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{err}</div>}

            <Button type="submit" disabled={busy} className="w-full mt-2">
              {busy ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <div className="text-center text-xs text-ink-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-sprout-700 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, v, onChange, type = 'text', required,
}: { label: string; v: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-700">{label}</span>
      <input
        value={v}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        className="mt-1 w-full h-10 px-3 rounded-[10px] border border-ink-100 bg-ink-50 focus:outline-none focus:border-sprout-500 focus:bg-white text-sm transition-colors"
      />
    </label>
  );
}
