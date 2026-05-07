interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: Props) {
  const map = {
    sm: { box: 34, icon: 18, text: 'text-[17px]' },
    md: { box: 42, icon: 22, text: 'text-[22px]' },
    lg: { box: 64, icon: 34, text: 'text-3xl' },
  };
  const s = map[size];

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div
        style={{ width: s.box, height: s.box }}
        className="rounded-full border-2 border-sprout-500 flex items-center justify-center"
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Stem */}
          <path
            d="M12 22V11"
            stroke="#33691E"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left leaf (darker) */}
          <path
            d="M12 13C8 13 5 11 4 7C8 6 11 8 12 11"
            fill="#558B2F"
          />
          {/* Right leaf (brighter) */}
          <path
            d="M12 13C16 13 19 10 20 5C16 4 13 6 12 11"
            fill="#7CB342"
          />
        </svg>
      </div>

      <span
        className={`font-display font-extrabold tracking-tight leading-none ${s.text}`}
        style={{ color: '#558B2F' }}
      >
        Sprouty
      </span>
    </div>
  );
}
