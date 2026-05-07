import { initials } from '../../lib/utils';

interface Props {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

const GRADIENTS = [
  'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700',
  'from-blue-500 to-blue-700',
  'from-violet-500 to-violet-700',
  'from-amber-500 to-amber-700',
  'from-pink-500 to-pink-700',
  'from-teal-500 to-teal-700',
];

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

export default function Avatar({ name, src, size = 40, className = '' }: Props) {
  const fontSize = Math.max(10, size * 0.35);
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize }}
      className={`rounded-full bg-gradient-to-br ${gradientFor(name)} flex items-center justify-center text-white font-medium ${className}`}
    >
      {initials(name)}
    </div>
  );
}
