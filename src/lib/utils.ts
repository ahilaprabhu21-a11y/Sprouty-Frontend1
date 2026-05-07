export function initials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function categoryColor(cat: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Art:         { bg: 'bg-sprout-50',   text: 'text-sprout-700' },
    Music:       { bg: 'bg-violet-100',  text: 'text-violet-700' },
    Dance:       { bg: 'bg-rose-100',    text: 'text-rose-700' },
    Code:        { bg: 'bg-blue-100',    text: 'text-blue-700' },
    Photography: { bg: 'bg-amber-100',   text: 'text-amber-700' },
    Writing:     { bg: 'bg-orange-100',  text: 'text-orange-700' },
    Fitness:     { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Cooking:     { bg: 'bg-red-100',     text: 'text-red-700' },
  };
  return map[cat] || { bg: 'bg-ink-100', text: 'text-ink-700' };
}

export function readableError(err: any): string {
  const data = err?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.errors) {
    const flat = Object.values(data.errors as Record<string, string[]>).flat();
    if (flat.length) return flat.join(' ');
  }
  if (data?.title) return data.title;
  return err?.message || 'Something went wrong';
}
