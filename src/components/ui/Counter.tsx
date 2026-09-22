import { useEffect, useRef, useState } from 'react';
import { toFa } from '@/lib/fa';

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

/** شمارنده عددی که هنگام دیده شدن شروع به شمارش می‌کند */
export function Counter({ value, duration = 1800, suffix = '', prefix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {toFa(display)}
      {suffix}
    </span>
  );
}
