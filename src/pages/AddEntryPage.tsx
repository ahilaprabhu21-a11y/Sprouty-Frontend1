import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import type { Challenge } from '../lib/types';
import { readableError } from '../lib/utils';
import Button from '../components/ui/Button';
import FileUploader from '../components/ui/FileUploader';

export default function AddEntryPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [form, setForm] = useState({
    dayNumber: 1,
    note: '',
    shareToFeed: true,
  });
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' | 'none' }>({ url: '', type: 'none' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function load() {
    if (!id) return;
    const { data } = await api.get(`/challenges/${id}`);
    setChallenge(data.challenge);
    setForm((f) => ({ ...f, dayNumber: data.challenge.currentDay }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await api.post(`/challenges/${id}/entries`, {
        ...form,
        mediaUrl: media.url,
        mediaType: media.type,
      });
      nav(`/challenges/${id}`);
    } catch (e: any) {
      setErr(readableError(e));
    } finally {
      setBusy(false);
    }
  }

  if (!challenge) return <div className="text-sm text-ink-500 p-8">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-sm text-sprout-700 mb-3 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6">
        <h1 className="text-xl font-display font-bold text-ink-900">Add day entry</h1>
        <p className="text-sm text-ink-500 mt-1">{challenge.title}</p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ink-700">Day number</label>
            <input
              type="number"
              min={1}
              max={challenge.durationDays}
              value={form.dayNumber}
              onChange={(e) => setForm({ ...form, dayNumber: Number(e.target.value) })}
              className="mt-1 w-full h-10 px-3 rounded-[10px] border border-ink-100 bg-ink-50 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-700">Note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              placeholder="What did you do today?"
              className="mt-1 w-full px-3 py-2 rounded-[10px] border border-ink-100 bg-ink-50 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-700">Media (optional)</label>
            <div className="mt-1.5">
              {/* 30-second video limit for challenge entries */}
              <FileUploader value={media} onChange={setMedia} subfolder="challenges" maxVideoSeconds={30} />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 bg-sprout-50 border border-sprout-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={form.shareToFeed}
              onChange={(e) => setForm({ ...form, shareToFeed: e.target.checked })}
              className="mt-0.5 accent-sprout-700"
            />
            <div>
              <div className="text-[13px] font-semibold text-ink-900">Share to feed</div>
              <div className="text-[11.5px] text-ink-700">Inspire others doing the same challenge.</div>
            </div>
          </label>

          {err && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{err}</div>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => nav(-1)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save entry'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
