import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardCheck,
  Clock,
  History,
  Layers,
  ListChecks,
  PlayCircle,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react';
import { EXAMS, examQuestionCount, examTotalMinutes, getExam } from '@/data/exams';
import { QUESTIONS } from '@/data/questions';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ExamGate } from '@/components/exam/ExamGate';
import { ExamRunner, type Candidate } from '@/components/exam/ExamRunner';
import { ExamResultView } from '@/components/exam/ExamResultView';
import { deleteExamResult, getExamResults, submitExamResult } from '@/lib/api';
import type { ExamResult } from '@/lib/types';
import { faDate, faPercent, formatDurationWords, toFa } from '@/lib/fa';

type Phase = 'list' | 'gate' | 'running' | 'result';
const FILTERS = ['همه رشته‌ها', 'تجربی', 'ریاضی', 'انسانی', 'همه رشته‌ها (عمومی)'] as const;

export function ExamPage() {
  const { examId } = useParams();
  const [params] = useSearchParams();
  const initialCode = params.get('code') ?? '';
  const resultParam = params.get('result');

  const [phase, setPhase] = useState<Phase>('list');
  const [selectedId, setSelectedId] = useState<string | null>(examId ?? null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('همه رشته‌ها');
  const [history, setHistory] = useState<ExamResult[]>(() => getExamResults());

  const exam = useMemo(() => (selectedId ? getExam(selectedId) : undefined), [selectedId]);

  useEffect(() => {
    if (examId && getExam(examId)) {
      setSelectedId(examId);
      setPhase('gate');
    }
  }, [examId]);

  /* نمایش کارنامه ذخیره‌شده از طریق پیوند */
  useEffect(() => {
    if (!resultParam) return;
    const stored = getExamResults().find((item) => item.id === resultParam);
    if (stored) {
      setSelectedId(stored.examId);
      setResult(stored);
      setCandidate({ code: stored.candidateCode, name: stored.candidateName, major: stored.major });
      setPhase('result');
    }
  }, [resultParam]);

  useEffect(() => {
    document.title = phase === 'running' && exam ? `در حال آزمون: ${exam.title} | نووا` : 'آزمون آنلاین کنکور | نووا';
  }, [phase, exam]);

  const visibleExams = useMemo(() => {
    if (filter === 'همه رشته‌ها') return EXAMS;
    if (filter === 'همه رشته‌ها (عمومی)') return EXAMS.filter((item) => item.majors.includes('همه رشته‌ها'));
    return EXAMS.filter((item) => item.majors.includes(filter) || item.majors.includes('همه رشته‌ها'));
  }, [filter]);

  const startExam = (nextCandidate: Candidate) => {
    setCandidate(nextCandidate);
    setPhase('running');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const finishExam = async (examResult: ExamResult) => {
    setResult(examResult);
    setPhase('result');
    setHistory(getExamResults());
    await submitExamResult(examResult);
    setHistory(getExamResults());
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const backToList = () => {
    setPhase('list');
    setSelectedId(null);
    setResult(null);
    setCandidate(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  /* -------------------------------- فاز اجرا -------------------------------- */
  if (phase === 'running' && exam && candidate) {
    return (
      <div className="py-8 lg:py-12">
        <div className="container-nova">
          <ExamRunner
            exam={exam}
            candidate={candidate}
            onExit={backToList}
            onFinish={(examResult) => {
              void finishExam(examResult);
            }}
          />
        </div>
      </div>
    );
  }

  /* ------------------------------- فاز کارنامه ------------------------------- */
  if (phase === 'result' && exam && result) {
    return (
      <>
        <PageHeader
          breadcrumb={[{ label: 'آزمون آنلاین', to: '/exam' }, { label: 'کارنامه' }]}
          eyebrow="کارنامه آزمون"
          title="پاسخ‌های تو با موفقیت ثبت گردید. خسته نباشید!"
          description="کارنامه کامل با درصد درس‌به‌درس، تراز تقریبی، تحلیل مرحله‌ها و پاسخ تشریحی همه سؤالات."
        />
        <section className="pb-24">
          <div className="container-nova">
            <ExamResultView
              exam={exam}
              result={result}
              candidateCode={result.candidateCode}
              onRestart={() => {
                setResult(null);
                setPhase('gate');
              }}
            />
          </div>
        </section>
      </>
    );
  }

  /* -------------------------------- فاز ورود -------------------------------- */
  if (phase === 'gate' && exam) {
    return (
      <>
        <PageHeader
          breadcrumb={[{ label: 'آزمون آنلاین', to: '/exam' }, { label: exam.title }]}
          eyebrow="آزمون آنلاین نووا"
          title={exam.title}
          description={exam.subtitle}
        />
        <section className="pb-24">
          <div className="container-nova">
            <ExamGate exam={exam} initialCode={initialCode} onStart={startExam} onBack={backToList} />
          </div>
        </section>
      </>
    );
  }

  /* -------------------------------- فهرست آزمون‌ها -------------------------------- */
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'آزمون آنلاین' }]}
        eyebrow="آزمون آنلاین نووا"
        title="دفترچه آزمون را انتخاب کن و زمان‌سنج را به راه بینداز"
        description="همه آزمون‌های نووا رایگان‌اند و دقیقاً با منطق کنکور سراسری ساخته شده‌اند: زمان‌بندی هر دفترچه، پاسخ‌نامه، نمره منفی و کارنامه درس‌به‌درس با پاسخ تشریحی."
      >
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { icon: ListChecks, label: 'سؤال در بانک نووا', value: toFa(QUESTIONS.length) },
            { icon: ClipboardCheck, label: 'دفترچه آزمون آماده', value: toFa(EXAMS.length) },
            { icon: Trophy, label: 'کارنامه صادرشده', value: toFa(history.length) },
          ].map((item) => (
            <div key={item.label} className="glass-soft flex items-center gap-3 rounded-3xl p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-nova-400/12 text-nova-200">
                <item.icon size={19} />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-black leading-none text-ink-100">{item.value}</span>
                <span className="mt-1 text-[0.74rem] text-ink-400">{item.label}</span>
              </span>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="pb-16">
        <div className="container-nova flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 text-[0.8rem] font-bold transition-all ${
                  filter === item
                    ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                    : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleExams.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <article className="glass edge-glow group flex h-full flex-col overflow-hidden rounded-5xl transition-all duration-500 hover:-translate-y-1.5">
                  <div className={`relative flex items-center gap-3 bg-gradient-to-l ${item.gradient} px-5 py-4 text-space-950`}>
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.45),transparent_55%)]" />
                    <item.icon size={22} strokeWidth={2.2} className="relative" />
                    <h2 className="relative flex-1 text-[0.98rem] font-black leading-snug">{item.title}</h2>
                    {item.badge ? (
                      <span className="relative rounded-full bg-space-950/25 px-2.5 py-1 text-[0.64rem] font-black">{item.badge}</span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                    <p className="text-[0.83rem] font-bold text-ink-200">{item.subtitle}</p>
                    <p className="text-[0.84rem] leading-loose text-ink-300">{item.description}</p>

                    <div className="flex flex-wrap gap-2">
                      <span className="chip">
                        <ListChecks size={12} className="text-nova-300" />
                        {toFa(examQuestionCount(item))} سؤال
                      </span>
                      <span className="chip">
                        <Clock size={12} className="text-comet-300" />
                        {toFa(examTotalMinutes(item))} دقیقه
                      </span>
                      <span className="chip">
                        <Layers size={12} className="text-nebula-300" />
                        {toFa(item.stages.length)} دفترچه
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 border-t border-white/8 pt-4">
                      <div className="flex items-center justify-between text-[0.72rem] text-ink-400">
                        <span>{item.participants}</span>
                        <span className="font-bold text-ink-300">{item.level}</span>
                      </div>
                      <Link to={`/exam/${item.id}`} className="btn btn-primary w-full !py-3 text-sm">
                        <PlayCircle size={17} />
                        ورود و شروع آزمون
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* تاریخچه */}
      <section className="pb-24">
        <div className="container-nova">
          <Reveal>
            <div className="glass rounded-5xl p-6 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-100">
                  <History size={19} className="text-nova-300" />
                  کارنامه‌های اخیر تو
                </h2>
                {history.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      history.forEach((item) => deleteExamResult(item.id));
                      setHistory([]);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-[0.74rem] font-bold text-ink-400 transition-colors hover:border-rose-400/40 hover:text-rose-400"
                  >
                    <Trash2 size={13} />
                    پاک کردن تاریخچه
                  </button>
                ) : null}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-4xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-10 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-3xl bg-nova-400/12 text-nova-200">
                    <Sparkles size={24} />
                  </span>
                  <p className="text-[0.9rem] font-bold text-ink-200">هنوز آزمونی نداده‌ای</p>
                  <p className="max-w-md text-[0.8rem] leading-relaxed text-ink-400">
                    با «آزمون سریع ۱۰ سؤالی» شروع کن؛ کمتر از ده دقیقه طول می‌کشد و یک نمای اولیه از وضعیت درسی‌ات
                    می‌دهد.
                  </p>
                  <Link to="/exam/quick-diagnostic" className="btn btn-outline mt-1 !px-5 !py-2.5 text-sm">
                    شروع آزمون سریع
                    <ArrowLeft size={15} />
                  </Link>
                </div>
              ) : (
                <ul className="grid gap-3 lg:grid-cols-2">
                  {history.map((item) => (
                    <li key={item.id} className="glass-soft flex items-center gap-4 rounded-4xl p-4">
                      <span
                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl text-[0.8rem] font-black ${
                          item.percent >= 55
                            ? 'bg-mint-400/18 text-mint-400'
                            : item.percent >= 30
                              ? 'bg-nova-400/18 text-nova-200'
                              : 'bg-rose-400/18 text-rose-400'
                        }`}
                      >
                        {faPercent(item.percent, 0)}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[0.9rem] font-bold text-ink-100">{item.examTitle}</span>
                        <span className="truncate text-[0.74rem] text-ink-400">
                          {item.candidateName} — {faDate(new Date(item.createdAt))} — {formatDurationWords(item.totalSeconds)}
                        </span>
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          <span className="chip !px-2 !py-0.5 !text-[0.66rem]">تراز {toFa(item.score)}</span>
                          <span className="chip !px-2 !py-0.5 !text-[0.66rem]">{item.level}</span>
                          <span className="chip !px-2 !py-0.5 !text-[0.66rem]">
                            درست {toFa(item.correct)} / غلط {toFa(item.wrong)} / نزده {toFa(item.blank)}
                          </span>
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(item.examId);
                          setResult(item);
                          setPhase('result');
                          window.scrollTo({ top: 0, behavior: 'auto' });
                        }}
                        className="btn btn-ghost shrink-0 !px-4 !py-2 text-xs"
                      >
                        مشاهده کارنامه
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
