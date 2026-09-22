import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  Clock,
  Download,
  Gauge,
  Lightbulb,
  Printer,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { Exam } from '@/data/exams';
import { DIFFICULTY_LABEL } from '@/data/questions';
import type { ExamResult } from '@/lib/types';
import { buildPaper, levelOf } from '@/lib/exam';
import { faDate, faPercent, formatDurationWords, toFa } from '@/lib/fa';

const OPTION_LABELS = ['۱', '۲', '۳', '۴'];

interface ExamResultViewProps {
  exam: Exam;
  result: ExamResult;
  candidateCode: string;
  onRestart: () => void;
}

export function ExamResultView({ exam, result, candidateCode, onRestart }: ExamResultViewProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [filter, setFilter] = useState<'همه' | 'درست' | 'غلط' | 'نزده'>('همه');

  const paper = useMemo(() => buildPaper(exam, candidateCode, result.attempt ?? 0), [exam, candidateCode, result.attempt]);
  const allQuestions = useMemo(() => paper.flatMap((stage) => stage.questions), [paper]);

  const answerMap = useMemo(() => {
    const map = new Map<string, number | null>();
    result.stages.forEach((stage) => stage.answers.forEach((a) => map.set(a.questionId, a.selected)));
    return map;
  }, [result]);

  const secondsMap = useMemo(() => {
    const map = new Map<string, number>();
    result.stages.forEach((stage) => stage.answers.forEach((a) => map.set(a.questionId, a.seconds)));
    return map;
  }, [result]);

  const flaggedCount = useMemo(() => allQuestions.filter((q) => (secondsMap.get(q.id) ?? 0) > 45).length, [allQuestions, secondsMap]);

  const visibleQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const selected = answerMap.get(q.id) ?? null;
      if (filter === 'همه') return true;
      if (filter === 'نزده') return selected === null;
      if (selected === null) return false;
      return filter === 'درست' ? selected === q.answer : selected !== q.answer;
    });
  }, [allQuestions, answerMap, filter]);

  const circumference = 2 * Math.PI * 54;
  const percentForRing = Math.max(0, Math.min(100, result.percent));
  const { advice } = levelOf(result.percent);

  const downloadReport = () => {
    const lines: string[] = [
      `کارنامه آزمون آنلاین نووا`,
      `آزمون: ${result.examTitle}`,
      `داوطلب: ${result.candidateName} (${result.candidateCode})`,
      `تاریخ: ${faDate(new Date(result.createdAt))}`,
      `زمان کل: ${formatDurationWords(result.totalSeconds)}`,
      ``,
      `درصد کل با اعمال نمره منفی: ${result.percent.toFixed(1)}`,
      `تراز تقریبی: ${result.score}`,
      `سطح عملکرد: ${result.level}`,
      `درست: ${result.correct} | غلط: ${result.wrong} | نزده: ${result.blank}`,
      ``,
      `--- درس به درس ---`,
      ...result.subjectScores.map(
        (s) => `${s.subject}: درصد ${s.percent.toFixed(1)} | درست ${s.correct} | غلط ${s.wrong} | نزده ${s.blank} از ${s.total}`,
      ),
      ``,
      `--- بررسی سؤال‌ها ---`,
      ...allQuestions.map((q, i) => {
        const selected = answerMap.get(q.id);
        const state = selected === null || selected === undefined ? 'نزده' : selected === q.answer ? 'درست' : 'غلط';
        return `${i + 1}. [${q.subject}] ${q.text} | پاسخ شما: ${selected === null || selected === undefined ? '—' : q.options[selected]} | پاسخ درست: ${q.options[q.answer]} | وضعیت: ${state}`;
      }),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nova-report-${result.candidateCode}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-area flex flex-col gap-6">
      {/* ----------------------------- سربرگ کارنامه ----------------------------- */}
      <div className="glass relative overflow-hidden rounded-5xl p-6 sm:p-8">
        <span className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-nova-500/18 blur-[80px]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-6">
            <div className="relative grid h-36 w-36 shrink-0 place-items-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (percentForRing / 100) * circumference}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffd479" />
                    <stop offset="55%" stopColor="#ff8a3d" />
                    <stop offset="100%" stopColor="#8b7bff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black tabular-nums text-ink-100">{faPercent(result.percent, 0)}</span>
                <span className="text-[0.66rem] text-ink-400">درصد کل</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="chip !w-fit !border-mint-400/40 !bg-mint-400/12 !text-mint-400">
                <BadgeCheck size={12} />
                آزمون پایان یافت ✅
              </span>
              <h2 className="text-xl font-black text-ink-100 sm:text-2xl">{result.examTitle}</h2>
              <p className="text-[0.84rem] text-ink-300">
                {result.candidateName} — کد داوطلبی{' '}
                <span dir="ltr" className="font-bold tabular-nums text-nova-200">
                  {result.candidateCode}
                </span>
              </p>
              <p className="text-[0.76rem] text-ink-400">
                {faDate(new Date(result.createdAt))} — زمان کل {formatDurationWords(result.totalSeconds)}
              </p>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'تراز تقریبی', value: toFa(result.score), icon: Gauge, color: 'text-nebula-300', bg: 'bg-nebula-400/12' },
              { label: 'پاسخ درست', value: toFa(result.correct), icon: CheckCircle2, color: 'text-mint-400', bg: 'bg-mint-400/12' },
              { label: 'پاسخ غلط', value: toFa(result.wrong), icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/12' },
              { label: 'بدون پاسخ', value: toFa(result.blank), icon: CircleSlash, color: 'text-ink-300', bg: 'bg-white/8' },
            ].map((item) => (
              <div key={item.label} className="glass-soft flex flex-col gap-1 rounded-3xl p-4">
                <span className={`mb-1 grid h-9 w-9 place-items-center rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={17} />
                </span>
                <span className="text-xl font-black tabular-nums text-ink-100">{item.value}</span>
                <span className="text-[0.7rem] text-ink-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 rounded-4xl border border-nova-300/25 bg-nova-400/[0.07] p-5">
          <p className="flex items-center gap-2 text-[0.86rem] font-black text-nova-200">
            <Lightbulb size={17} />
            سطح عملکرد: {result.level}
          </p>
          <p className="mt-2 text-[0.88rem] leading-loose text-ink-200">{advice}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link to={`/register?plan=${result.percent >= 55 ? 'supernova' : 'nova-starter'}`} className="btn btn-primary !px-5 !py-2.5 text-sm">
              <Sparkles size={16} />
              مشاوره برای همین نقطه ضعف
            </Link>
            <button type="button" onClick={onRestart} className="btn btn-ghost !px-5 !py-2.5 text-sm">
              <RotateCcw size={16} />
              آزمون دوباره
            </button>
            <Link to="/exam" className="btn btn-ghost !px-5 !py-2.5 text-sm">
              سایر آزمون‌ها
            </Link>
          </div>
        </div>

        <div className="no-print relative mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => window.print()} className="btn btn-outline !px-4 !py-2 text-xs">
            <Printer size={14} />
            چاپ کارنامه
          </button>
          <button type="button" onClick={downloadReport} className="btn btn-outline !px-4 !py-2 text-xs">
            <Download size={14} />
            دریافت فایل گزارش
          </button>
        </div>
      </div>

      {/* ------------------------------ درس به درس ------------------------------ */}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="glass rounded-5xl p-6 sm:p-7">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-ink-100">
            <BarChart3 size={19} className="text-nova-300" />
            تحلیل درس‌به‌درس
          </h3>
          <ul className="flex flex-col gap-4">
            {result.subjectScores.map((subject) => {
              const width = Math.max(0, Math.min(100, subject.percent));
              const tone =
                subject.percent >= 60 ? 'from-mint-400 to-comet-400' : subject.percent >= 30 ? 'from-nova-300 to-nova-500' : 'from-rose-400 to-nova-500';
              return (
                <li key={subject.subject}>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[0.88rem] font-bold text-ink-100">{subject.subject}</span>
                    <span className="flex items-center gap-3 text-[0.72rem] text-ink-400">
                      <span className="text-mint-400">درست {toFa(subject.correct)}</span>
                      <span className="text-rose-400">غلط {toFa(subject.wrong)}</span>
                      <span>نزده {toFa(subject.blank)}</span>
                      <span className="font-black tabular-nums text-ink-200">{faPercent(subject.percent)}</span>
                    </span>
                  </div>
                  <div className="progress-track h-2.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-l ${tone} transition-[width] duration-1000`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="flex flex-col gap-5">
          <section className="glass rounded-5xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
              <Clock size={17} className="text-comet-300" />
              عملکرد مرحله‌ها
            </h3>
            <ul className="flex flex-col gap-3">
              {result.stages.map((stage, index) => {
                const answered = stage.answers.filter((a) => a.selected !== null).length;
                return (
                  <li key={stage.stageId} className="glass-soft rounded-3xl p-4">
                    <p className="flex items-center justify-between gap-2 text-[0.82rem] font-bold text-ink-100">
                      <span>
                        مرحله {toFa(index + 1)}
                      </span>
                      <span className="tabular-nums text-ink-400">
                        {formatDurationWords(stage.secondsUsed)} از {toFa(Math.round(stage.secondsLimit / 60))} دقیقه
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.74rem] text-ink-400">
                      {toFa(answered)} از {toFa(stage.answers.length)} سؤال پاسخ داده شد
                    </p>
                    <div className="progress-track mt-2 h-1.5">
                      <div className="progress-bar" style={{ width: `${(answered / stage.answers.length) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="glass rounded-5xl p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-extrabold text-ink-100">
              <Bookmark size={17} className="text-nova-300" />
              نکته مشاور
            </h3>
            <p className="text-[0.84rem] leading-loose text-ink-300">
              {flaggedCount > 0
                ? `روی ${toFa(flaggedCount)} سؤال بیش از ۴۵ ثانیه وقت گذاشتی. این یعنی یا مبحث را مسلط نبودی یا در خواندن صورت سؤال مکث کرده‌ای؛ هر دو با تمرین زمان‌دار حل می‌شود.`
                : 'سرعت پاسخ‌دهی‌ات متعادل بود. حالا تمرکز را روی دقت بگذار: نسبت غلط به درست را در آزمون بعدی حداقل یک‌سوم کاهش بده.'}
            </p>
          </section>
        </div>
      </div>

      {/* ------------------------------ مرور سؤالات ------------------------------ */}
      <section className="glass rounded-5xl p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink-100">
            <CheckCircle2 size={19} className="text-mint-400" />
            مرور سؤال‌به‌سؤال با پاسخ تشریحی
          </h3>
          <div className="flex flex-wrap gap-2">
            {(['همه', 'درست', 'غلط', 'نزده'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.75rem] font-bold transition-colors ${
                  filter === item
                    ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                    : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {visibleQuestions.map((q, index) => {
            const selected = answerMap.get(q.id) ?? null;
            const state: 'correct' | 'wrong' | 'blank' = selected === null ? 'blank' : selected === q.answer ? 'correct' : 'wrong';
            const isOpen = openQuestion === q.id;
            const seconds = secondsMap.get(q.id) ?? 0;

            return (
              <li key={q.id} className="overflow-hidden rounded-4xl border border-white/8 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setOpenQuestion(isOpen ? null : q.id)}
                  className="flex w-full items-center gap-4 p-4 text-start transition-colors hover:bg-white/[0.04]"
                  aria-expanded={isOpen}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/8 text-[0.78rem] font-black text-ink-300">
                    {toFa(index + 1)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="line-clamp-2 text-[0.88rem] font-bold text-ink-100">{q.text}</span>
                    <span className="flex flex-wrap items-center gap-2 text-[0.7rem] text-ink-400">
                      <span className="chip !px-2 !py-0.5 !text-[0.66rem]">{q.subject}</span>
                      <span>{DIFFICULTY_LABEL[q.difficulty]}</span>
                      <span className="tabular-nums">{toFa(seconds)} ثانیه</span>
                    </span>
                  </span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${
                      state === 'correct' ? 'bg-mint-400/18 text-mint-400' : state === 'wrong' ? 'bg-rose-400/18 text-rose-400' : 'bg-white/8 text-ink-400'
                    }`}
                  >
                    {state === 'correct' ? <CheckCircle2 size={17} /> : state === 'wrong' ? <XCircle size={17} /> : <CircleSlash size={17} />}
                  </span>
                  <ChevronDown size={17} className={`shrink-0 text-ink-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen ? (
                  <div className="animate-rise border-t border-white/8 p-4 sm:p-5">
                    <ul className="grid gap-2">
                      {q.options.map((option, optionIndex) => {
                        const isAnswer = optionIndex === q.answer;
                        const isSelected = optionIndex === selected;
                        return (
                          <li
                            key={optionIndex}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-[0.85rem] ${
                              isAnswer
                                ? 'border-mint-400/45 bg-mint-400/10 text-ink-100'
                                : isSelected
                                  ? 'border-rose-400/45 bg-rose-400/10 text-ink-200'
                                  : 'border-white/8 bg-white/[0.02] text-ink-300'
                            }`}
                          >
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/10 text-[0.68rem] font-black">
                              {OPTION_LABELS[optionIndex]}
                            </span>
                            <span className="flex-1">{option}</span>
                            {isAnswer ? <span className="text-[0.68rem] font-black text-mint-400">پاسخ درست</span> : null}
                            {isSelected && !isAnswer ? <span className="text-[0.68rem] font-black text-rose-400">پاسخ تو</span> : null}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 rounded-3xl border border-nova-300/25 bg-nova-400/[0.07] p-4">
                      <p className="text-[0.76rem] font-black text-nova-200">پاسخ تشریحی</p>
                      <p className="mt-1 text-[0.84rem] leading-loose text-ink-200">{q.explanation}</p>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {visibleQuestions.length === 0 ? (
          <p className="py-8 text-center text-[0.86rem] text-ink-400">سؤالی با این فیلتر پیدا نشد.</p>
        ) : null}
      </section>

      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <Link to="/exam" className="btn btn-primary !px-6 !py-3 text-sm">
          آزمون بعدی
          <ArrowLeft size={16} />
        </Link>
        <Link to="/register" className="btn btn-ghost !px-6 !py-3 text-sm">
          دریافت برنامه شخصی با مشاور
        </Link>
      </div>
    </div>
  );
}
