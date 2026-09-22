import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Compass,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { MATCH_QUESTIONS, computeMatch } from '@/data/match';
import { getExam } from '@/data/exams';
import { Reveal } from '@/components/ui/Reveal';
import { toFa } from '@/lib/fa';

export function MatchPage() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => MATCH_QUESTIONS.map(() => null));

  useEffect(() => {
    document.title = 'نوامچ | تست انتخاب رشته و گروه آزمایشی نووا';
  }, []);

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / MATCH_QUESTIONS.length) * 100;
  const outcome = useMemo(() => computeMatch(answers), [answers]);
  const finished = started && answeredCount === MATCH_QUESTIONS.length;
  const question = MATCH_QUESTIONS[index];

  const choose = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
    window.setTimeout(() => {
      if (index < MATCH_QUESTIONS.length - 1) setIndex(index + 1);
    }, 260);
  };

  const restart = () => {
    setAnswers(MATCH_QUESTIONS.map(() => null));
    setIndex(0);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recommendedExam = finished ? getExam(outcome.primary.recommendedExam) : undefined;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'نوامچ' }]}
        eyebrow="تست انتخاب رشته نووا"
        title="نوامچ؛ کدام رشته برای تو ساخته شده؟"
        description="هشت پرسش کوتاه، بدون جواب درست و غلط. نتیجه، یک پیشنهاد صادقانه بر اساس علایق و توانمندی‌های توست — نه یک برچسب قطعی."
      />

      <section className="pb-24">
        <div className="container-nova max-w-4xl">
          {/* صفحه شروع */}
          {!started ? (
            <Reveal>
              <div className="glass relative overflow-hidden rounded-5xl p-7 text-center sm:p-12">
                <span className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-nebula-500/20 blur-[90px]" />
                <span className="relative mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[2rem] bg-gradient-to-br from-nebula-300/25 to-nova-400/25 text-nebula-300">
                  <Compass size={34} />
                </span>
                <h2 className="relative text-2xl font-black text-ink-100 sm:text-3xl">آماده‌ای خودت را بهتر بشناسی؟</h2>
                <p className="relative mx-auto mt-4 max-w-xl text-[0.94rem] leading-loose text-ink-300">
                  نوا‌مچ هشت پرسش کوتاه دارد و کمتر از شش دقیقه طول می‌کشد. در پایان، گروه آزمایشی متناسب با تو، رشته‌های
                  پیشنهادی، نقاط قوت و هشدارهای همان مسیر را می‌بینی.
                </p>

                <ul className="relative mx-auto mt-8 grid max-w-2xl gap-3 text-start sm:grid-cols-3">
                  {[
                    { icon: GraduationCap, title: 'گروه آزمایشی', text: 'تجربی، ریاضی، انسانی، هنر یا زبان' },
                    { icon: Briefcase, title: 'رشته و شغل', text: 'فهرست رشته‌ها و مسیرهای شغلی هم‌راستا' },
                    { icon: Lightbulb, title: 'توصیه مشاوره', text: 'نقطه قوت و هشدار واقعی همان مسیر' },
                  ].map((item) => (
                    <li key={item.title} className="glass-soft rounded-3xl p-4">
                      <item.icon size={19} className="mb-2 text-nova-300" />
                      <p className="text-[0.86rem] font-extrabold text-ink-100">{item.title}</p>
                      <p className="mt-1 text-[0.76rem] leading-relaxed text-ink-400">{item.text}</p>
                    </li>
                  ))}
                </ul>

                <button type="button" onClick={() => setStarted(true)} className="btn btn-nebula relative mt-9 !px-8 !py-4 text-[0.95rem]">
                  <Sparkles size={18} />
                  شروع تست نوا‌مچ
                </button>
              </div>
            </Reveal>
          ) : null}

          {/* پرسش‌ها */}
          {started && !finished && question ? (
            <div className="glass rounded-5xl p-6 sm:p-9">
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="text-[0.8rem] font-bold text-nebula-300">
                  پرسش {toFa(index + 1)} از {toFa(MATCH_QUESTIONS.length)}
                </span>
                <span className="text-[0.78rem] font-black tabular-nums text-ink-300">{toFa(Math.round(progress))}٪</span>
              </div>
              <div className="progress-track mb-9 h-1.5">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <h2 className="text-xl font-black leading-relaxed text-ink-100 sm:text-2xl">{question.text}</h2>
              {question.hint ? <p className="mt-2 text-[0.82rem] text-ink-400">{question.hint}</p> : null}

              <ul className="mt-7 grid gap-3">
                {question.options.map((option, optionIndex) => {
                  const active = answers[index] === optionIndex;
                  return (
                    <li key={option.text}>
                      <button
                        type="button"
                        onClick={() => choose(optionIndex)}
                        className={`group flex w-full items-center gap-4 rounded-3xl border px-5 py-4 text-start transition-all duration-300 ${
                          active
                            ? 'border-nebula-300/60 bg-nebula-400/14'
                            : 'border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-sm font-black transition-colors ${
                            active ? 'bg-nebula-400 text-space-950' : 'bg-white/8 text-ink-300'
                          }`}
                        >
                          {['الف', 'ب', 'ج', 'د'][optionIndex]}
                        </span>
                        <span className={`flex-1 text-[0.92rem] leading-relaxed ${active ? 'font-bold text-ink-100' : 'text-ink-200'}`}>
                          {option.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/8 pt-6">
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="btn btn-ghost !px-5 !py-2.5 text-sm"
                >
                  <ArrowRight size={15} />
                  پرسش قبلی
                </button>
                <div className="flex items-center gap-1.5">
                  {MATCH_QUESTIONS.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndex(itemIndex)}
                      aria-label={`پرسش ${toFa(itemIndex + 1)}`}
                      className={`h-2 rounded-full transition-all ${
                        itemIndex === index ? 'w-7 bg-nova-300' : answers[itemIndex] !== null ? 'w-2 bg-nebula-400' : 'w-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(MATCH_QUESTIONS.length - 1, i + 1))}
                  disabled={index === MATCH_QUESTIONS.length - 1}
                  className="btn btn-primary !px-5 !py-2.5 text-sm"
                >
                  پرسش بعدی
                  <ArrowLeft size={15} />
                </button>
              </div>
            </div>
          ) : null}

          {/* نتیجه */}
          {finished ? (
            <div className="flex flex-col gap-5">
              <div className={`relative overflow-hidden rounded-5xl border border-white/10 bg-gradient-to-br ${outcome.primary.gradient} p-7 sm:p-10`}>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.4),transparent_55%)]" />
                <div className="relative flex flex-col gap-6 text-space-950 sm:flex-row sm:items-center">
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[2rem] bg-space-950/15">
                    <outcome.primary.icon size={38} strokeWidth={1.8} />
                  </span>
                  <div className="flex-1">
                    <p className="text-[0.76rem] font-black uppercase tracking-[0.22em] opacity-70">نتیجه نوا‌مچ</p>
                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">{outcome.primary.title}</h2>
                    <p className="mt-1.5 text-[0.9rem] font-bold opacity-80">{outcome.primary.subtitle}</p>
                  </div>
                  <div className="rounded-4xl bg-space-950/15 px-6 py-4 text-center">
                    <p className="text-3xl font-black tabular-nums">{toFa(outcome.matchPercent[outcome.primary.key])}٪</p>
                    <p className="text-[0.7rem] font-bold opacity-75">هم‌خوانی با تو</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="flex flex-col gap-5">
                  <div className="glass rounded-5xl p-6 sm:p-7">
                    <h3 className="mb-4 text-lg font-extrabold text-ink-100">چرا این گروه؟</h3>
                    <p className="text-[0.93rem] leading-[2.2] text-ink-300">{outcome.primary.description}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-mint-400/30 bg-mint-400/[0.07] p-4">
                        <p className="flex items-center gap-2 text-[0.82rem] font-black text-mint-400">
                          <CheckCircle2 size={16} />
                          نقطه قوت تو در این مسیر
                        </p>
                        <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-200">{outcome.primary.strength}</p>
                      </div>
                      <div className="rounded-3xl border border-nova-300/30 bg-nova-400/[0.07] p-4">
                        <p className="flex items-center gap-2 text-[0.82rem] font-black text-nova-200">
                          <TriangleAlert size={16} />
                          هشداری که باید جدی بگیری
                        </p>
                        <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-200">{outcome.primary.caution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-5xl p-6 sm:p-7">
                    <h3 className="mb-4 text-lg font-extrabold text-ink-100">پراکندگی پاسخ‌های تو</h3>
                    <ul className="flex flex-col gap-3.5">
                      {outcome.ranking.map((key) => (
                        <li key={key}>
                          <div className="mb-1.5 flex items-center justify-between text-[0.82rem]">
                            <span className="font-bold text-ink-200">{key}</span>
                            <span className="font-black tabular-nums text-ink-300">{toFa(outcome.matchPercent[key])}٪</span>
                          </div>
                          <div className="progress-track h-2.5">
                            <div className="progress-bar" style={{ width: `${outcome.matchPercent[key]}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[0.78rem] leading-relaxed text-ink-400">
                      انتخاب دوم تو «{outcome.secondary.title}» است؛ اگر در مسیر اول ظرفیت یا علاقه کافی پیدا نکردی، این
                      مسیر هم ارزش بررسی دارد.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="glass rounded-5xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
                      <GraduationCap size={17} className="text-nova-300" />
                      رشته‌های پیشنهادی
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {outcome.primary.majors.map((major) => (
                        <span key={major} className="chip !py-1.5">
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-5xl p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
                      <Briefcase size={17} className="text-nebula-300" />
                      مسیرهای شغلی
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {outcome.primary.careers.map((career) => (
                        <li key={career} className="flex items-start gap-2 text-[0.84rem] text-ink-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula-400" />
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass rounded-5xl p-6">
                    <h3 className="mb-3 text-base font-extrabold text-ink-100">قدم بعدی چیست؟</h3>
                    <p className="text-[0.84rem] leading-loose text-ink-300">
                      نوا‌مچ جهت را نشان می‌دهد؛ حالا باید سطح واقعی‌ات در دروس همان گروه را بسنجی.
                    </p>
                    <div className="mt-4 flex flex-col gap-2.5">
                      {recommendedExam ? (
                        <Link to={`/exam/${recommendedExam.id}`} className="btn btn-primary w-full !py-3 text-sm">
                          آزمون تعیین سطح {outcome.primary.key}
                        </Link>
                      ) : null}
                      <Link to="/register" className="btn btn-ghost w-full !py-3 text-sm">
                        مشاوره انتخاب رشته
                      </Link>
                      <button type="button" onClick={restart} className="btn btn-outline w-full !py-3 text-sm">
                        <RotateCcw size={15} />
                        انجام دوباره تست
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
