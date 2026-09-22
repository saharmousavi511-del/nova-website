import { useEffect, useState } from 'react';
import { SITE } from '@/data/site';
import { toFa, pad2 } from '@/lib/fa';

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getParts(target: Date): Parts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const konkorDate = new Date(SITE.konkurDate.year, SITE.konkurDate.month - 1, SITE.konkurDate.day, 8, 0, 0);

/** شمارش معکوس زنده تا روز کنکور سراسری */
export function Countdown({ compact = false }: { compact?: boolean }) {
  const [parts, setParts] = useState<Parts>(() => getParts(konkorDate));

  useEffect(() => {
    const timer = window.setInterval(() => setParts(getParts(konkorDate)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const cells: { label: string; value: string }[] = [
    { label: 'روز', value: toFa(parts.days) },
    { label: 'ساعت', value: toFa(pad2(parts.hours)) },
    { label: 'دقیقه', value: toFa(pad2(parts.minutes)) },
    { label: 'ثانیه', value: toFa(pad2(parts.seconds)) },
  ];

  return (
    <div className={`flex items-stretch gap-2 ${compact ? 'text-center' : ''}`}>
      {cells.map((cell, index) => (
        <div key={cell.label} className="flex items-stretch gap-2">
          <div
            className={`glass flex flex-col items-center justify-center rounded-2xl tabular-nums ${
              compact ? 'min-w-[3.1rem] px-2 py-1.5' : 'min-w-[4.2rem] px-3 py-2.5'
            }`}
          >
            <span className={`font-black text-nova-200 ${compact ? 'text-base' : 'text-2xl'}`}>{cell.value}</span>
            <span className={`text-ink-400 ${compact ? 'text-[0.6rem]' : 'text-[0.68rem]'}`}>{cell.label}</span>
          </div>
          {index < cells.length - 1 ? <span className="self-center text-ink-400">:</span> : null}
        </div>
      ))}
    </div>
  );
}
