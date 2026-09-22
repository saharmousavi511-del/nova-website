import { ROADMAP } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Roadmap() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="مسیر همکاری"
            title="از اولین تماس تا روز کنکور، شش قدم"
            description="همه چیز شفاف و قابل پیش‌بینی است؛ می‌دانی در هر مرحله چه اتفاقی می‌افتد و از ما چه انتظاری داشته باشی."
            tone="cool"
          />
        </Reveal>

        <div className="relative">
          <span className="absolute inset-x-8 top-16 hidden h-px bg-gradient-to-l from-nova-400/10 via-nebula-400/40 to-comet-400/10 lg:block" aria-hidden />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP.map((step, index) => (
              <Reveal key={step.step} delay={index * 80} as="li">
                <div className="glass group relative h-full overflow-hidden rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-nova-300/35">
                  <span className="pointer-events-none absolute -end-6 -top-8 text-[6.5rem] font-black leading-none text-white/[0.045] transition-all duration-500 group-hover:text-nova-400/10">
                    {step.step}
                  </span>
                  <div className="relative flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-space-700 to-space-850 text-nova-200 ring-1 ring-white/10">
                      <step.icon size={21} />
                    </span>
                    <div>
                      <span className="text-[0.68rem] font-bold text-ink-400">گام {step.step}</span>
                      <h3 className="text-base font-extrabold text-ink-100">{step.title}</h3>
                    </div>
                  </div>
                  <p className="relative mt-4 text-[0.88rem] leading-loose text-ink-300">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
