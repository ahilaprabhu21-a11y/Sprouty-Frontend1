import { categoryColor } from '../../lib/utils';

export default function CategoryPill({ category, size = 'sm' }: { category: string; size?: 'sm' | 'xs' }) {
  const c = categoryColor(category);
  const sizing = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';
  return <span className={`${c.bg} ${c.text} font-medium rounded-md ${sizing}`}>{category}</span>;
}
