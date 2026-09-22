import { Bookmark, CircleSlash, CheckCircle2, Timer } from 'lucide-react';
import type { Question } from '@/data/questions';
import { formatClock, toFa } from '@/lib/fa';

interface AnswerSheetProps {
  questions: Question[];
  answers: Record<string, number | null>;
  flagged: string[];
  currentIndex: number;
  onJump: (index: number) => void;
  secondsLeft: number;
  title: string;
  subtitle?: string;
}

export function AnswerSheet({
  questions,
  answers,
  flagged,
  currentIndex,
  onJump,
  secondsLeft,
  title,
  subtitle,
}: AnswerSheetProps) {
  const answered = questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;
  const percent = questions.length ? Math.round((answered / questions.length) * 100) : 0;
  const flagCount = flagged.filter((id) => questions.some((q) => q.id === id)).length;
  const urgent = secondsLeft <= 60;
  const warning = secondsLeft <= 300;

  return (
    <aside className="glass flex flex-col gap-5 rounded-5xl p-5 lg:sticky lg:top-28">
      <div>
        <h3 className="text-base font-extrabold text-ink-100">{title}</h3>
        {subtitle ? <p className="mt-1 text-[0.76rem] leading-relaxed text-ink-400">{subtitle}</p> : null}
      </div>

      <div
        className={`flex items-center justify-between gap-3 rounded-3xl border p-4 transition-colors ${
          urgent
            ? 'border-rose-400/50 bg-rose-400/10'
            : warning
              ? 'border-nova-300/45 bg-nova-400/10'
              : 'border-white/10 bg-space-950/50'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Timer size={19} className={urgent ? 'animate-pulse text-rose-400' : warning ? 'text-nova-200' : 'text-comet-300'} />
          <span className="flex flex-col">
            <span className="text-[0.68rem] text-ink-400">زمان باقی‌مانده این مرحله</span>
            <span className={`text-xl font-black tabular-nums ${urgent ? 'text-rose-400' : 'text-ink-100'}`}>
              {formatClock(secondsLeft)}
            </span>
          </span>
        </span>
        {urgent ? <span className="chip !border-rose-400/50 !bg-rose-400/15 !text-rose-400">عجله کن!</span> : null}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-[0.78rem]">
          <span className="font-bold text-ink-200">پاسخ‌نامه</span>
          <span className="font-black tabular-nums text-nova-200">{toFa(percent)}٪</span>
        </div>
        <div className="progress-track h-2">
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
        {questions.map((question, index) => {
          const isAnswered = answers[question.id] !== null && answers[question.id] !== undefined;
          const isFlagged = flagged.includes(question.id);
          const isCurrent = index === currentIndex;
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onJump(index)}
              aria-label={`سؤال ${toFa(index + 1)}`}
              className={`relative grid h-10 w-full place-items-center rounded-xl text-[0.8rem] font-black transition-all duration-200 ${
                isCurrent
                  ? 'scale-105 bg-nova-300 text-space-950 shadow-[0_8px_20px_-8px_rgba(255,171,46,0.9)]'
                  : isAnswered
                    ? 'bg-mint-400/20 text-mint-400 hover:bg-mint-400/30'
                    : isFlagged
                      ? 'bg-nova-400/15 text-nova-200 hover:bg-nova-400/25'
                      : 'bg-white/[0.06] text-ink-400 hover:bg-white/12'
              }`}
            >
              {toFa(index + 1)}
              {isFlagged && !isCurrent ? (
                <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-nova-300" />
              ) : null}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-2 gap-2 border-t border-white/8 pt-4 text-[0.72rem] text-ink-400">
        <li className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-mint-400" />
          پاسخ داده: <span className="font-black text-ink-200">{toFa(answered)}</span>
        </li>
        <li className="flex items-center gap-2">
          <CircleSlash size={14} className="text-ink-400" />
          نزده: <span className="font-black text-ink-200">{toFa(questions.length - answered)}</span>
        </li>
        <li className="flex items-center gap-2">
          <Bookmark size={14} className="text-nova-300" />
          نشان‌دار: <span className="font-black text-ink-200">{toFa(flagCount)}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="grid h-3.5 w-3.5 place-items-center rounded bg-nova-300 text-[0.5rem] font-black text-space-950">۵</span>
          سؤال جاری
        </li>
      </ul>

      <p className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-[0.7rem] leading-relaxed text-ink-400">
        هر ۳ پاسخ غلط، یک پاسخ درست را حذف می‌کند. اگر از گزینه‌ای مطمئن نیستی، نزده گذاشتن امن‌تر است.
      </p>
    </aside>
  );
}
