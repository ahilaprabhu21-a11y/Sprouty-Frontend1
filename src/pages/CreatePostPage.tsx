import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { CATEGORIES } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { readableError } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import FileUploader from '../components/ui/FileUploader';

export default function CreatePostPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' | 'none' }>({ url: '', type: 'none' });
  const [category, setCategory] = useState(user?.categories?.[0] || 'Art');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!content.trim()) {
      setErr('Please write something');
      return;
    }
    setBusy(true);
    try {
      await api.post('/posts', {
        content: content.trim(),
        mediaUrl: media.url,
        mediaType: media.type,
        category,
        challengeId: null,
        isFromChallenge: false,
      });
      nav('/');
    } catch (e: any) {
      setErr(readableError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-sm text-sprout-700 mb-3 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-ink-100 shadow-card rounded-2xl p-6">
        <h1 className="text-xl font-display font-bold text-ink-900">Share your talent</h1>
        <p className="text-sm text-ink-500 mt-1">Show the world what you're working on.</p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div className="flex gap-3">
            {user && <Avatar name={user.name} src={user.avatarUrl} size={42} />}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="flex-1 px-3 py-2.5 rounded-[10px] bg-ink-50 border border-ink-100 text-sm focus:outline-none focus:border-sprout-500 focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 h-8 rounded-full text-xs font-medium border transition-colors ${
                    category === c
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
            <label className="block text-xs font-medium text-ink-700 mb-1.5">Add media (optional)</label>
            <FileUploader value={media} onChange={setMedia} subfolder="posts" />
          </div>

          {err && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{err}</div>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => nav(-1)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Posting…' : 'Post'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
