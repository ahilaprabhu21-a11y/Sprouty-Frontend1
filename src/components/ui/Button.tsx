import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm' };
  const variants = {
    primary: 'bg-sprout-700 hover:bg-sprout-800 text-white shadow-sm hover:shadow',
    secondary: 'bg-white border border-ink-100 text-ink-900 hover:bg-ink-50',
    ghost: 'bg-transparent hover:bg-ink-100 text-ink-700',
    gold: 'bg-gold-500 hover:bg-gold-600 text-white shadow-sm',
  };
  return (
    <button {...rest} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
