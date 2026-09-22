import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, FileText, MapPin, Quote, Sparkles, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Avatar } from '@/components/ui/Avatar';
import { REPORT_CARDS, TOPPERS } from '@/data/toppers';
import { COUNTER_FACTS } from '@/data/stats';
import { toFa } from '@/lib/fa';

const YEAR_FILTERS = ['همه', '۱۴۰۵', '۱۴۰۴'] as const;

export function ToppersPage() {
  const [year, setYear] = useState<(typeof YEAR_FILTERS)[number]>('همه');

  useEffect(() => {
    document.title = 'کارنامه و رتبه‌برترهای نووا | قبولی‌های کنکور';
  }, []);

  const filtered = useMemo(() => (year === 'همه' ? TOPPERS : TOPPERS.filter((t) => t.year === year)), [year]);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'رتبه‌برترها' }]}
        eyebrow="کارنامه‌های درخشان"
        title="۳۰۰+ کارنامه؛ داستان آدم‌هایی که برنامه داشتند"
        description="این صفحه ویترین تبلیغاتی نیست؛ گزارش مسیر است. هر کارت نشان می‌دهد یک دانش‌آموز از کجا شروع کرد، چه چیزی را عوض کرد و به کجا رسید."
      >
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTER_FACTS.map((fact) => (
            <div key={fact.label} className="glass-soft rounded-3xl p-4">
              <p className="text-xl font-black text-gradient tabular-nums">{fact.value}</p>
              <p className="mt-1 text-[0.74rem] leading-relaxed text-ink-400">{fact.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* کارنامه‌ها */}
      <section className="pb-16">
        <div className="container-nova flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-xl font-black text-ink-100">
              <FileText size={20} className="text-nova-300" />
              نمونه کارنامه رتبه‌برترها
            </h2>
            <div className="flex flex-wrap gap-2">
              {YEAR_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setYear(item)}
                  className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold transition-all ${
                    year === item
                      ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                      : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {REPORT_CARDS.map((card, index) => (
              <Reveal key={card.id} delay={index * 70}>
                <article className="glass edge-glow flex h-full flex-col gap-5 rounded-5xl p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-ink-100">{card.name}</h3>
                      <p className="mt-0.5 text-[0.78rem] text-ink-400">
                        کنکور {card.year} — {card.field}
                      </p>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-nova-400/15 text-nova-200">
                      <Trophy size={20} />
                    </span>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 rounded-4xl border border-white/8 bg-white/[0.03] p-4 text-center">
                    {[
                      { k: 'معدل کتبی', v: card.gpa },
                      { k: 'رتبه', v: card.rank },
                      { k: 'سهمیه', v: card.quota },
                    ].map((item) => (
                      <div key={item.k}>
                        <dt className="text-[0.66rem] text-ink-400">{item.k}</dt>
                        <dd className="mt-1 text-[0.84rem] font-black text-ink-100">{item.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="flex flex-1 flex-col gap-3">
                    {card.subjects.map((subject) => (
                      <li key={subject.name}>
                        <div className="mb-1 flex items-center justify-between text-[0.78rem]">
                          <span className="font-bold text-ink-200">{subject.name}</span>
                          <span className="font-black tabular-nums text-nova-200">٪{toFa(subject.percent)}</span>
                        </div>
                        <div className="progress-track h-2">
                          <div className="progress-bar" style={{ width: `${subject.percent}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-[0.72rem] leading-relaxed text-ink-400">
                    درصدها بر اساس کارنامه اعلامی داوطلب ثبت شده و با اجازه او منتشر می‌شود.
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* پذیرفته‌شدگان */}
      <section className="pb-24">
        <div className="container-nova flex flex-col gap-6">
          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-black text-ink-100">
              <Award size={20} className="text-nova-300" />
              پذیرفته‌شدگان نووا ({toFa(filtered.length)} نفر)
            </h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((topper, index) => (
              <Reveal key={topper.id} delay={index * 55}>
                <article className="glass group flex h-full flex-col gap-4 rounded-5xl p-6 transition-all duration-500 hover:-translate-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <Avatar name={topper.name} gradient={topper.gradient} size="lg" />
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-2xl bg-gradient-to-l from-nova-300 to-nova-500 px-3 py-1 text-[0.76rem] font-black text-space-950">
                        {topper.rank}
                      </span>
                      {topper.badge ? <span className="chip !text-[0.64rem] !text-nebula-300">{topper.badge}</span> : null}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-ink-100">{topper.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[0.75rem] text-ink-400">
                      <MapPin size={12} className="text-nebula-300" />
                      {topper.city} — {topper.field} — سهمیه {topper.quota}
                    </p>
                  </div>

                  <p className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-[0.83rem] leading-loose text-ink-200">
                    <Quote size={14} className="mb-1 inline-block text-nova-300" />
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

          <Reveal>
            <div className="glass flex flex-col items-center gap-4 rounded-5xl px-6 py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-nova-400/12 text-nova-200">
                <Sparkles size={24} />
              </span>
              <h3 className="text-xl font-black text-ink-100">نفر بعدی این فهرست، تو باش</h3>
              <p className="max-w-xl text-[0.88rem] leading-loose text-ink-300">
                هیچ‌کدام از این دانش‌آموزان از روز اول رتبه برتر نبودند. تفاوتشان این بود که مسیرشان را با داده و برنامه
                طی کردند، نه با حدس و فشار بی‌هدف.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register" className="btn btn-primary !px-6 !py-3 text-sm">
                  ثبت‌نام مشاوره
                  <ArrowLeft size={16} />
                </Link>
                <Link to="/exam" className="btn btn-ghost !px-6 !py-3 text-sm">
                  اول یک آزمون تعیین سطح بده
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
