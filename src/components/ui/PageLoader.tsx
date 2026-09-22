import { Logo } from './Logo';

/** لودر برند نووا — هنگام بارگیری تنبل صفحات نمایش داده می‌شود */
export function PageLoader({ label = 'در حال بارگذاری نووا...' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20">
      <div className="relative">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-nova-400/25" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-nebula-400/20 [animation-delay:1.1s]" />
        <div className="relative animate-float">
          <Logo size={62} showText={false} />
        </div>
      </div>
      <p className="text-[0.84rem] font-bold text-ink-400">{label}</p>
      <div className="progress-track h-1 w-40 overflow-hidden">
        <div className="h-full w-1/2 animate-marquee rounded-full bg-gradient-to-l from-nova-300 to-nebula-400" />
      </div>
    </div>
  );
}
