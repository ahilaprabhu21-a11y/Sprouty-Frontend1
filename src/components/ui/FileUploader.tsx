import { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Video, X } from 'lucide-react';
import { uploadFile } from '../../lib/api';

interface Props {
  value?: { url: string; type: 'image' | 'video' | 'none' };
  onChange: (v: { url: string; type: 'image' | 'video' | 'none' }) => void;
  subfolder?: string;
  /** Max video duration in seconds. Defaults to 60 (used by posts). Pass 30 for challenge entries. */
  maxVideoSeconds?: number;
}

export default function FileUploader({
  value,
  onChange,
  subfolder = 'media',
  maxVideoSeconds = 60,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  /** Reads video metadata to get duration in seconds */
  function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Could not read video metadata'));
      };
      video.src = URL.createObjectURL(file);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    setErr('');

    // Video duration check (frontend gate)
    if (f.type.startsWith('video/')) {
      try {
        const duration = await getVideoDuration(f);
        if (duration > maxVideoSeconds) {
          const got = Math.ceil(duration);
          setErr(
            `Video is too long (${got}s). Max allowed is ${maxVideoSeconds} seconds. Please trim and try again.`
          );
          if (ref.current) ref.current.value = '';
          return;
        }
      } catch {
        setErr('Could not read this video. Please try a different file.');
        if (ref.current) ref.current.value = '';
        return;
      }
    }

    setBusy(true);
    try {
      const res = await uploadFile(f, subfolder);
      onChange({ url: res.url, type: res.mediaType });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }

  function clear() {
    onChange({ url: '', type: 'none' });
    setErr('');
  }

  return (
    <div>
      <input
        type="file"
        ref={ref}
        accept="image/*,video/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {(!value || value.type === 'none' || !value.url) ? (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] border border-dashed border-ink-300 hover:border-sprout-400 hover:bg-sprout-50 text-sm text-ink-700 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {busy ? 'Uploading…' : 'Photo'}
            </button>
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] border border-dashed border-ink-300 hover:border-sprout-400 hover:bg-sprout-50 text-sm text-ink-700 disabled:opacity-50"
            >
              <Video className="w-4 h-4" /> Video
            </button>
          </div>

          {/* Hint about video limit */}
          <div className="text-[11px] text-ink-500 mt-1.5">
            Videos must be {maxVideoSeconds} seconds or less.
          </div>
        </>
      ) : (
        <div className="relative inline-block">
          {value.type === 'image' ? (
            <img src={value.url} alt="" className="rounded-lg max-h-48 object-cover" />
          ) : (
            <video src={value.url} controls className="rounded-lg max-h-48" />
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-ink-100 shadow-sm flex items-center justify-center text-ink-700 hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {err && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <span className="font-medium shrink-0">⚠</span>
          <span>{err}</span>
        </div>
      )}
    </div>
  );
}
