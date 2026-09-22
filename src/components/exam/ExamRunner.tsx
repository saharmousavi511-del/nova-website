import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  Flag,
  ListChecks,
  LogOut,
  TimerReset,
  TriangleAlert,
} from 'lucide-react';
import type { Exam } from '@/data/exams';
import { examQuestionCount } from '@/data/exams';
import { buildPaper, scorePaper } from '@/lib/exam';
import type { AnswerRecord, ExamResult } from '@/lib/types';
import { uid } from '@/lib/storage';
import { getExamResults } from '@/lib/api';
import { formatClock, formatDurationWords, toFa } from '@/lib/fa';
import { QuestionCard } from './QuestionCard';
import { AnswerSheet } from './AnswerSheet';
import { Modal } from '@/components/ui/Modal';

export interface Candidate {
  code: string;
  name: string;
  major: string;
}

interface ExamRunnerProps {
  exam: Exam;
  candidate: Candidate;
  onExit: () => void;
  onFinish: (result: ExamResult) => void;
}

type ModalKind = 'stage-submit' | 'exit' | 'timeout' | null;

export function ExamRunner({ exam, candidate, onExit, onFinish }: ExamRunnerProps) {
  /** شماره دفعه: اگر همین داوطلب قبلاً همین آزمون را داده باشد، برگه تازه‌ای می‌گیرد */
  const attempt = useMemo(
    () => getExamResults().filter((item) => item.candidateCode === candidate.code && item.examId === exam.id).length,
    [candidate.code, exam.id],
  );
  const paper = useMemo(() => buildPaper(exam, candidate.code, attempt), [exam, candidate.code, attempt]);
  const allQuestions = useMemo(() => paper.flatMap((stage) => stage.questions), [paper]);

  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [questionSeconds, setQuestionSeconds] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(paper[0]?.seconds ?? 0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [stageLog, setStageLog] = useState<{ stageId: string; title: string; answers: AnswerRecord[]; secondsUsed: number; secondsLimit: number }[]>([]);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stage = paper[stageIndex];
  const question = stage?.questions[questionIndex];
  const isLastStage = stageIndex === paper.length - 1;
  const finishedRef = useRef(false);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const buildResult = useCallback(
    (log: typeof stageLog) => {
      const summary = scorePaper(paper, answers, questionSeconds);
      const result: ExamResult = {
        id: uid('exam-'),
        createdAt: new Date().toISOString(),
        examId: exam.id,
        examTitle: exam.title,
        attempt,
        candidateCode: candidate.code,
        candidateName: candidate.name,
        major: candidate.major,
        totalSeconds: totalElapsed,
        stages: log,
        subjectScores: summary.subjectScores,
        correct: summary.correct,
        wrong: summary.wrong,
        blank: summary.blank,
        percent: summary.percent,
        score: summary.taraz,
        rawScore: summary.rawScore,
        level: summary.level,
      };
      return result;
    },
    [paper, answers, questionSeconds, exam, candidate, totalElapsed, attempt],
  );

  const currentStageAnswers = useCallback(
    (): AnswerRecord[] =>
      stage.questions.map((q) => ({
        questionId: q.id,
        selected: answers[q.id] ?? null,
        seconds: questionSeconds[q.id] ?? 0,
      })),
    [stage, answers, questionSeconds],
  );

  const finalizeStage = useCallback(
    (auto: boolean) => {
      if (!stage) return;
      const secondsUsed = Math.max(0, stage.seconds - secondsLeft);
      const logEntry = {
        stageId: stage.id,
        title: stage.title,
        answers: currentStageAnswers(),
        secondsUsed,
        secondsLimit: stage.seconds,
      };
      const nextLog = [...stageLog, logEntry];

      if (isLastStage) {
        if (finishedRef.current) return;
        finishedRef.current = true;
        setStageLog(nextLog);
        setModal(null);
        onFinish(buildResult(nextLog));
        return;
      }

      setStageLog(nextLog);
      setStageIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setSecondsLeft(paper[stageIndex + 1]?.seconds ?? 0);
      setModal(null);
      showToast(
        auto
          ? `زمان مرحله ${toFa(stageIndex + 1)} تمام شد؛ پاسخ‌ها ثبت شد.`
          : `پاسخ‌های مرحله ${toFa(stageIndex + 1)} ثبت شد.`,
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [stage, secondsLeft, currentStageAnswers, stageLog, isLastStage, onFinish, buildResult, paper, stageIndex, showToast],
  );

  /* ------------------------------ زمان‌سنج ------------------------------ */
  const questionRef = useRef(question);
  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    if (modal === 'exit' || modal === 'timeout') return;
    const timer = window.setInterval(() => {
      setTotalElapsed((t) => t + 1);
      const currentId = questionRef.current?.id;
      if (currentId) setQuestionSeconds((prev) => ({ ...prev, [currentId]: (prev[currentId] ?? 0) + 1 }));
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stageIndex, modal]);

  useEffect(() => {
    if (secondsLeft === 0 && !finishedRef.current) setModal('timeout');
  }, [secondsLeft]);

  /* ------------------------------ میان‌برها ------------------------------ */
  const selectOption = useCallback(
    (optionIndex: number) => {
      if (!question) return;
      setAnswers((prev) => ({ ...prev, [question.id]: prev[question.id] === optionIndex ? null : optionIndex }));
    },
    [question],
  );

  const goNext = useCallback(() => {
    if (!stage) return;
    if (questionIndex < stage.questions.length - 1) setQuestionIndex((i) => i + 1);
    else setModal('stage-submit');
  }, [questionIndex, stage]);

  const goPrev = useCallback(() => {
    setQuestionIndex((i) => Math.max(0, i - 1));
  }, []);

  const toggleFlag = useCallback(() => {
    if (!question) return;
    setFlagged((prev) => (prev.includes(question.id) ? prev.filter((id) => id !== question.id) : [...prev, question.id]));
  }, [question]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (modal) return;
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (['1', '2', '3', '4'].includes(event.key)) {
        selectOption(Number(event.key) - 1);
      } else if (event.key === 'ArrowLeft') {
        goNext();
      } else if (event.key === 'ArrowRight') {
        goPrev();
      } else if (event.key.toLowerCase() === 'f') {
        toggleFlag();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        setModal('stage-submit');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, selectOption, goNext, goPrev, toggleFlag]);

  if (!stage || !question) return null;

  const answeredInStage = stage.questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;
  const totalAnswered = allQuestions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;

  return (
    <div className="pb-32 lg:pb-10">
      {/* نوار بالای آزمون */}
      <div className="glass mb-5 rounded-4xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-3xl bg-gradient-to-br ${exam.gradient} p-3 text-space-950`}>
              <exam.icon size={20} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-[0.98rem] font-black text-ink-100">{exam.title}</h2>
              <p className="text-[0.74rem] text-ink-400">
                داوطلب: <span className="font-bold text-ink-200">{candidate.name}</span> — کد{' '}
                <span dir="ltr" className="font-bold tabular-nums text-nova-200">
                  {candidate.code}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip !text-ink-300">
              <ListChecks size={12} className="text-nebula-300" />
              پاسخ داده: {toFa(totalAnswered)} از {toFa(examQuestionCount(exam))}
            </span>
            <button type="button" onClick={() => setModal('exit')} className="btn btn-ghost !px-4 !py-2 text-xs">
              <LogOut size={14} />
              انصراف از آزمون
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {paper.map((item, index) => {
            const state = index === stageIndex ? 'current' : index < stageIndex ? 'done' : 'todo';
            return (
              <span
                key={item.id}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.72rem] font-bold transition-colors ${
                  state === 'current'
                    ? 'border-nova-300/55 bg-nova-400/12 text-nova-200'
                    : state === 'done'
                      ? 'border-mint-400/35 bg-mint-400/10 text-mint-400'
                      : 'border-white/10 bg-white/[0.03] text-ink-400'
                }`}
              >
                <span className="grid h-4 w-4 place-items-center rounded-full bg-white/12 text-[0.6rem]">{toFa(index + 1)}</span>
                {state === 'done' ? 'ثبت شد' : item.title.replace(/^مرحله \S+ — /, '')}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19.5rem] lg:items-start">
        <div className="flex flex-col gap-5">
          <div key={question.id} className="animate-rise">
            <QuestionCard
              question={question}
              index={questionIndex}
              total={stage.questions.length}
              selected={answers[question.id] ?? null}
              flagged={flagged.includes(question.id)}
              secondsSpent={questionSeconds[question.id] ?? 0}
              onSelect={selectOption}
              onToggleFlag={toggleFlag}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={goPrev} disabled={questionIndex === 0} className="btn btn-ghost !px-5 !py-3 text-sm">
              <ArrowRight size={16} />
              سؤال قبلی
            </button>

            <span className="hidden text-[0.76rem] text-ink-400 sm:block">
              {toFa(answeredInStage)} از {toFa(stage.questions.length)} سؤال این مرحله پاسخ داده شد
            </span>

            <button type="button" onClick={goNext} className="btn btn-primary !px-5 !py-3 text-sm">
              {questionIndex === stage.questions.length - 1 ? 'ثبت و مرحله بعد' : 'سؤال بعدی'}
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <AnswerSheet
            questions={stage.questions}
            answers={answers}
            flagged={flagged}
            currentIndex={questionIndex}
            onJump={setQuestionIndex}
            secondsLeft={secondsLeft}
            title={stage.title}
            subtitle={stage.subtitle}
          />
        </div>
      </div>

      {/* پاسخ‌نامه موبایل */}
      <div className="mt-5 lg:hidden">
        <AnswerSheet
          questions={stage.questions}
          answers={answers}
          flagged={flagged}
          currentIndex={questionIndex}
          onJump={(index) => {
            setQuestionIndex(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          secondsLeft={secondsLeft}
          title={stage.title}
          subtitle={stage.subtitle}
        />
      </div>

      {/* نوار چسبان پایین (موبایل) */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-space-950/92 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-black tabular-nums text-nova-200">
            <TimerReset size={15} />
            {formatClock(secondsLeft)}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={goPrev} disabled={questionIndex === 0} className="btn btn-ghost !px-4 !py-2.5 text-xs">
              <ArrowRight size={14} />
            </button>
            <button type="button" onClick={goNext} className="btn btn-primary !px-4 !py-2.5 text-xs">
              {questionIndex === stage.questions.length - 1 ? (
                <>
                  <CheckCheck size={14} />
                  ثبت مرحله
                </>
              ) : (
                <>
                  سؤال بعد
                  <ArrowLeft size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* پیام کوتاه */}
      {toast ? (
        <div className="no-print fixed bottom-24 start-1/2 z-50 -translate-x-1/2 animate-pop lg:bottom-8">
          <div className="glass flex items-center gap-2.5 rounded-full px-5 py-3 text-[0.82rem] font-bold text-mint-400">
            <CheckCheck size={16} />
            {toast}
          </div>
        </div>
      ) : null}

      {/* گفتگوها */}
      <Modal
        open={modal === 'stage-submit'}
        title={isLastStage ? 'پایان آزمون و ثبت پاسخ‌ها' : 'ثبت و رفتن به مرحله بعد'}
        onClose={() => setModal(null)}
        icon={<CheckCheck size={26} />}
        footer={
          <>
            <button type="button" onClick={() => setModal(null)} className="btn btn-ghost !px-5 !py-2.5 text-sm">
              انصراف
            </button>
            <button type="button" onClick={() => finalizeStage(false)} className="btn btn-primary !px-5 !py-2.5 text-sm">
              تایید
            </button>
          </>
        }
      >
        <p>
          در این مرحله به <span className="font-black text-nova-200">{toFa(stage.questions.length - answeredInStage)}</span> سؤال
          پاسخ نداده‌ای. با ثبت، زمان‌سنج این مرحله بسته می‌شود و دیگر نمی‌توانی پاسخ‌هایت را تغییر دهی.
        </p>
        {isLastStage ? (
          <p className="mt-3 rounded-2xl border border-nova-300/30 bg-nova-400/10 p-3 text-[0.84rem] text-nova-100">
            این آخرین مرحله است؛ پس از تایید، کارنامه کامل با پاسخ تشریحی همه سؤالات نمایش داده می‌شود.
          </p>
        ) : (
          <p className="mt-3 text-[0.84rem] text-ink-400">
            مرحله بعد: {paper[stageIndex + 1]?.title} — زمان {toFa((paper[stageIndex + 1]?.seconds ?? 0) / 60)} دقیقه
          </p>
        )}
      </Modal>

      <Modal
        open={modal === 'timeout'}
        title="زمان این مرحله به پایان رسید"
        tone="danger"
        icon={<Flag size={26} />}
        onClose={() => finalizeStage(true)}
        footer={
          <button type="button" onClick={() => finalizeStage(true)} className="btn btn-primary !px-5 !py-2.5 text-sm">
            {isLastStage ? 'مشاهده کارنامه' : 'رفتن به مرحله بعد'}
          </button>
        }
      >
        <p>
          تایمر مرحله جاری صفر شد. پاسخ‌های ثبت‌شده تا همین لحظه محفوظ می‌ماند و سؤالات بی‌پاسخ، نزده حساب می‌شوند — دقیقاً
          مثل روز کنکور.
        </p>
      </Modal>

      <Modal
        open={modal === 'exit'}
        title="انصراف از آزمون"
        tone="danger"
        icon={<TriangleAlert size={26} />}
        onClose={() => setModal(null)}
        footer={
          <>
            <button type="button" onClick={() => setModal(null)} className="btn btn-ghost !px-5 !py-2.5 text-sm">
              بازگشت به آزمون
            </button>
            <button
              type="button"
              onClick={() => {
                setModal(null);
                onExit();
              }}
              className="btn btn-primary !px-5 !py-2.5 text-sm"
            >
              تایید انصراف
            </button>
          </>
        }
      >
        <p>
          با انصراف، زمان‌سنج متوقف و پاسخ‌های داده‌شده از بین می‌رود. اگر می‌خواهی کارنامه‌ات صادر شود، تا پایان مرحله
          آخر ادامه بده.
        </p>
        <p className="mt-3 text-[0.82rem] text-ink-400">
          زمان صرف‌شده تاکنون: {formatDurationWords(totalElapsed)}
        </p>
      </Modal>
    </div>
  );
}
