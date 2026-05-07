import { Hand, MessageCircle, MoreHorizontal, Share2, Trash2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '../../lib/types';
import { api } from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import CategoryPill from './CategoryPill';

interface Props {
  post: Post;
  onDeleted?: (id: number) => void;
}

export default function PostCard({ post: initial, onDeleted }: Props) {
  const { user } = useAuth();
  const [post, setPost] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMine = user?.id === post.userId;

  // Close menu when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function applaud() {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/posts/${post.id}/applaud`);
      setPost({ ...post, applaudCount: data.count, applaudedByMe: data.applauded });
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.userName, text: post.content, url: location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${post.content}\n— ${post.userName} on Sprouty`);
    }
    try {
      const { data } = await api.post(`/posts/${post.id}/share`);
      setPost({ ...post, applaudCount: data.count });
    } catch {}
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await api.delete(`/posts/${post.id}`);
      setDeleted(true);
      onDeleted?.(post.id);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete');
    } finally {
      setBusy(false);
      setConfirming(false);
      setMenuOpen(false);
    }
  }

  if (deleted) return null;

  return (
    <article className="bg-white rounded-2xl border border-ink-100 shadow-card p-5">
      <header className="flex items-start justify-between">
        <div className="flex gap-3 items-start">
          <Link to={`/u/${post.userId}`}>
            <Avatar name={post.userName} src={post.userAvatarUrl} size={40} />
          </Link>
          <div>
            <Link to={`/u/${post.userId}`} className="text-[14px] font-medium text-ink-900 hover:underline">
              {post.userName}
            </Link>
            <div className="text-[11.5px] text-ink-500 mt-0.5">{timeAgo(post.createdAt)}</div>
          </div>
        </div>

        <div className="flex gap-1.5 items-center shrink-0">
          {post.category && <CategoryPill category={post.category} size="xs" />}
          {post.isFromChallenge && (
            <span className="bg-gold-400/20 text-gold-600 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5" />
              {post.challengeDayNumber ? `Day ${post.challengeDayNumber}` : 'Challenge'}
            </span>
          )}

          {/* Owner-only menu */}
          {isMine && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="w-7 h-7 rounded-md hover:bg-ink-50 flex items-center justify-center text-ink-500"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-ink-100 rounded-lg shadow-lg z-10 py-1">
                  <button
                    onClick={() => { setMenuOpen(false); setConfirming(true); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {post.content && <p className="text-[14px] text-ink-900 mt-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>}

      {post.mediaUrl && post.mediaType === 'image' && (
        <img src={post.mediaUrl} alt="" className="mt-3 w-full rounded-xl object-cover max-h-[480px]" />
      )}
      {post.mediaUrl && post.mediaType === 'video' && (
        <video src={post.mediaUrl} controls className="mt-3 w-full rounded-xl max-h-[480px]" />
      )}

      <footer className="flex gap-1 mt-4 pt-3 border-t border-ink-100">
        <button
          onClick={applaud}
          disabled={busy}
          className={`flex-1 h-9 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
            post.applaudedByMe ? 'text-sprout-700 bg-sprout-50' : 'text-ink-700 hover:bg-ink-50'
          }`}
        >
          <Hand className="w-3.5 h-3.5" /> {post.applaudCount} Applaud{post.applaudCount === 1 ? '' : 's'}
        </button>
        <button className="flex-1 h-9 rounded-lg text-xs text-ink-700 hover:bg-ink-50 flex items-center justify-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" /> {post.commentCount} Comment{post.commentCount === 1 ? '' : 's'}
        </button>
        <button onClick={share} className="flex-1 h-9 rounded-lg text-xs text-ink-700 hover:bg-ink-50 flex items-center justify-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </footer>

      {/* Confirm dialog */}
      {confirming && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => !busy && setConfirming(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 grid place-items-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Delete this post?</h3>
                <p className="text-[13px] text-ink-700 mt-1">This can't be undone. Comments and applauds on it will also be removed.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="h-9 px-4 rounded-lg border border-ink-100 text-sm text-ink-900 hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50"
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
