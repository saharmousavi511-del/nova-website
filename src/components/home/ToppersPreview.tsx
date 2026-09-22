import { Link } from 'react-router-dom';
import { MapPin, Quote, Trophy } from 'lucide-react';
import { TOPPERS } from '@/data/toppers';
import { Avatar } from '@/components/ui/Avatar';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ToppersPreview({ limit = 6 }: { limit?: number }) {
  const toppers = TOPPERS.slice(0, limit);

  return (
    <section className="relative py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-80 max-w-5xl rounded-full bg-nova-500/8 blur-[120px]" />
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="رتبه‌برترهای نووا"
            title="می‌دانی چند نوانَورد روی سیاره موردعلاقه‌شان فرود آمده‌اند؟"
            description="این‌ها کارنامه‌های واقعی دانش‌آموزانی است که با برنامه نووا مسیرشان را پیدا کردند. نام‌ها با اجازه خودشان منتشر شده است."
            action={
              <Link to="/toppers" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                <Trophy size={16} className="text-nova-300" />
                همه قبولی‌ها
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {toppers.map((topper, index) => (
            <Reveal key={topper.id} delay={index * 70}>
              <article className="glass edge-glow group flex h-full flex-col gap-4 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <Avatar name={topper.name} gradient={topper.gradient} size="lg" />
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="rounded-2xl bg-gradient-to-l from-nova-300 to-nova-500 px-3 py-1 text-[0.78rem] font-black text-space-950 shadow-md">
                      {topper.rank}
                    </span>
                    <span className="chip !text-[0.66rem]">{topper.field}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-ink-100">{topper.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.76rem] text-ink-400">
                    <MapPin size={13} className="text-nebula-300" />
                    {topper.city} — سهمیه {topper.quota}
                  </p>
                </div>

                <p className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-[0.83rem] leading-loose text-ink-200">
                  <Quote size={14} className="mb-1.5 inline-block text-nova-300" />
                  {topper.quote}
                </p>

                <div className="mt-auto flex flex-col gap-2 border-t border-white/8 pt-4">
                  <span className="text-[0.78rem] font-bold text-mint-400">{topper.accepted}</span>
                  <span className="text-[0.72rem] text-ink-400">
                    کنکور {topper.year} — {topper.studyHours}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
