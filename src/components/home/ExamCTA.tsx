import { Link } from 'react-router-dom';
import { ArrowLeft, CircleDot, Clock, Layers, ListChecks, PenLine, Timer } from 'lucide-react';
import { EXAMS, examQuestionCount, examTotalMinutes } from '@/data/exams';
import { QUESTIONS } from '@/data/questions';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { toFa } from '@/lib/fa';

const SAMPLE = QUESTIONS.find((q) => q.id === 'z4')!;

export function ExamCTA() {
  const featured = EXAMS.slice(0, 3);

  return (
    <section id="exam-section" className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="آزمون آنلاین نووا"
            title="قبل از کنکور، چند بار کنکور بده"
            description="آزمون‌های آنلاین نووا با زمان‌بندی واقعی، پاسخ‌نامه، نمره منفی و کارنامه درس‌به‌درس ساخته شده‌اند تا روز اصلی هیچ چیز برایت تازه نباشد."
            action={
              <Link to="/exam" className="btn btn-primary !px-6 !py-3 text-sm">
                ورود به آزمون آنلاین
                <ArrowLeft size={17} />
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* پیش‌نمایش دفترچه‌ها */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              {featured.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exam/${exam.id}`}
                  className="glass edge-glow group flex items-center gap-4 rounded-4xl p-5 transition-all duration-500 hover:-translate-y-1"
                >
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${exam.gradient} p-3.5 text-space-950`}>
                    <exam.icon size={24} strokeWidth={2.1} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.98rem] font-extrabold text-ink-100">{exam.title}</span>
                      {exam.badge ? <span className="chip !border-nova-300/40 !bg-nova-400/12 !text-nova-200">{exam.badge}</span> : null}
                    </span>
                    <span className="truncate text-[0.8rem] text-ink-400">{exam.subtitle}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.74rem] font-bold text-ink-300">
                      <span className="flex items-center gap-1.5">
                        <ListChecks size={14} className="text-nova-300" />
                        {toFa(examQuestionCount(exam))} سؤال
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-comet-300" />
                        {toFa(examTotalMinutes(exam))} دقیقه
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers size={14} className="text-nebula-300" />
                        {toFa(exam.stages.length)} مرحله
                      </span>
                    </span>
                  </span>
                  <ArrowLeft size={18} className="shrink-0 text-ink-400 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-nova-200" />
                </Link>
              ))}

              <Link to="/exam" className="glass-soft flex items-center justify-center gap-2 rounded-4xl px-5 py-4 text-sm font-bold text-ink-200 transition-colors hover:border-nova-300/40 hover:text-nova-200">
                <Timer size={16} />
                مشاهده همه {toFa(EXAMS.length)} آزمون آنلاین
              </Link>
            </div>
          </Reveal>

          {/* نمونه سؤال */}
          <Reveal delay={120}>
            <div className="glass flex h-full flex-col gap-5 rounded-5xl p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="chip !border-nebula-300/35 !bg-nebula-400/12 !text-nebula-300">
                  <PenLine size={12} />
                  نمونه سؤال
                </span>
                <span className="chip">{SAMPLE.subject}</span>
              </div>

              <p className="text-[0.95rem] font-bold leading-loose text-ink-100">{SAMPLE.text}</p>

              <ul className="flex flex-col gap-2.5">
                {SAMPLE.options.map((option, index) => {
                  const isCorrect = index === SAMPLE.answer;
                  const label = ['۱', '۲', '۳', '۴'][index];
                  return (
                    <li
                      key={option}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-[0.85rem] transition-all ${
                        isCorrect
                          ? 'border-mint-400/45 bg-mint-400/10 text-ink-100'
                          : 'border-white/8 bg-white/[0.03] text-ink-300'
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.72rem] font-black ${
                          isCorrect ? 'bg-mint-400/25 text-mint-400' : 'bg-white/8 text-ink-400'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-[0.7rem] font-bold text-mint-400">
                          <CircleDot size={13} />
                          پاسخ درست
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto rounded-3xl border border-nova-300/25 bg-nova-400/[0.07] p-4">
                <p className="text-[0.76rem] font-bold text-nova-200">پاسخ تشریحی</p>
                <p className="mt-1.5 text-[0.83rem] leading-loose text-ink-300">{SAMPLE.explanation}</p>
              </div>

              <p className="text-center text-[0.74rem] text-ink-400">
                بانک سؤال نووا: {toFa(QUESTIONS.length)} سؤال در {toFa(new Set(QUESTIONS.map((q) => q.subject)).size)} درس
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
