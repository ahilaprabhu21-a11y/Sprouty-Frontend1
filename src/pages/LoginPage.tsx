import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { readableError } from '../lib/utils';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email, password);
      nav('/');
    } catch (e: any) {
      setErr(readableError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-br from-sprout-50 via-white to-ink-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>

        <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-7">
          <h1 className="text-xl font-display font-bold text-ink-900">Welcome back</h1>
          <p className="text-sm text-ink-500 mt-1">Sign in to continue your journey 🌿</p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <Field label="Email" type="email" v={email} onChange={setEmail} required />
            <Field label="Password" type="password" v={password} onChange={setPassword} required />
            {err && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{err}</div>}
            <Button type="submit" disabled={busy} className="w-full mt-2">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center text-xs text-ink-500 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sprout-700 font-semibold hover:underline">Sign up</Link>
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
