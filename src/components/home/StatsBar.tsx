import { STATS } from '@/data/stats';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';

export function StatsBar() {
  return (
    <section className="relative py-14 lg:py-20">
      <div className="container-nova">
        <Reveal>
          <div className="glass grid gap-6 rounded-5xl p-7 sm:grid-cols-2 lg:grid-cols-4 lg:p-9">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative flex flex-col gap-1.5 px-2 ${index > 0 ? 'lg:border-s lg:border-white/8' : ''} ${
                  index > 1 ? 'sm:border-s sm:border-white/8' : ''
                }`}
              >
                <span className="mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-nova-300/20 to-nebula-400/20 text-nova-200">
                  <stat.icon size={20} />
                </span>
                <span className="text-[2.4rem] font-black leading-none text-ink-100">
                  <Counter value={stat.value} suffix={stat.suffix ?? ''} />
                </span>
                <span className="text-sm font-bold text-nova-200">{stat.label}</span>
                <span className="text-xs leading-relaxed text-ink-400">{stat.note}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
