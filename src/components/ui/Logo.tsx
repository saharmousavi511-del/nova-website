interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

/** نشان نووا: ستاره‌ای در حال انفجار (اَبَرنواختر) با حلقه مدار */
export function Logo({ size = 42, showText = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative inline-flex" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="drop-shadow-[0_6px_18px_rgba(255,138,61,0.45)]">
          <defs>
            <linearGradient id="nova-logo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe9bd" />
              <stop offset="38%" stopColor="#ffab2e" />
              <stop offset="72%" stopColor="#ff6a3d" />
              <stop offset="100%" stopColor="#8b7bff" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.04)" />
          <ellipse
            cx="32"
            cy="32"
            rx="27"
            ry="11"
            fill="none"
            stroke="url(#nova-logo)"
            strokeWidth="1.2"
            opacity="0.55"
            transform="rotate(-24 32 32)"
          />
          <path d="M32 4 L37.2 26.8 L60 32 L37.2 37.2 L32 60 L26.8 37.2 L4 32 L26.8 26.8 Z" fill="url(#nova-logo)" />
          <circle cx="32" cy="32" r="4.6" fill="#fff8ec" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-nova-400/20 blur-xl" aria-hidden />
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span className="text-[1.35rem] font-black tracking-tight text-ink-100">
            نووا
            <span className="ms-1.5 align-middle text-[0.7rem] font-bold tracking-[0.28em] text-nova-300">NOVA</span>
          </span>
          <span className="mt-1 text-[0.66rem] font-medium text-ink-400">کهکشانِ رتبه‌های برتر</span>
        </span>
      ) : null}
    </span>
  );
}
