import { BookmarkPlus, Bookmark, Clock } from 'lucide-react';
import type { Question } from '@/data/questions';
import { DIFFICULTY_LABEL } from '@/data/questions';
import { formatClock, toFa } from '@/lib/fa';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  flagged: boolean;
  secondsSpent: number;
  onSelect: (optionIndex: number) => void;
  onToggleFlag: () => void;
}

const OPTION_LABELS = ['۱', '۲', '۳', '۴'];

export function QuestionCard({
  question,
  index,
  total,
  selected,
  flagged,
  secondsSpent,
  onSelect,
  onToggleFlag,
}: QuestionCardProps) {
  return (
    <article className="glass flex flex-col gap-6 rounded-5xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-nova-300 to-nova-600 text-sm font-black text-space-950">
            {toFa(index + 1)}
          </span>
          <span className="chip !border-nebula-300/35 !bg-nebula-400/12 !text-nebula-300">{question.subject}</span>
          <span className="chip">{DIFFICULTY_LABEL[question.difficulty]}</span>
          <span className="chip !text-ink-400">
            سؤال {toFa(index + 1)} از {toFa(total)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="chip !text-ink-400" title="زمان صرف‌شده برای این سؤال">
            <Clock size={12} className="text-comet-300" />
            <span className="tabular-nums">{formatClock(secondsSpent)}</span>
          </span>
          <button
            type="button"
            onClick={onToggleFlag}
            aria-pressed={flagged}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold transition-all ${
              flagged
                ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                : 'border-white/12 bg-white/5 text-ink-400 hover:text-ink-200'
            }`}
          >
            {flagged ? <Bookmark size={13} fill="currentColor" /> : <BookmarkPlus size={13} />}
            {flagged ? 'نشان‌دار شد' : 'نشان‌دار کردن'}
          </button>
        </div>
      </div>

      <p className="text-[1.02rem] font-bold leading-[2.1] text-ink-100 sm:text-[1.08rem]">{question.text}</p>

      <ul className="grid gap-3">
        {question.options.map((option, optionIndex) => {
          const active = selected === optionIndex;
          return (
            <li key={optionIndex}>
              <button
                type="button"
                onClick={() => onSelect(optionIndex)}
                aria-pressed={active}
                className={`group flex w-full items-center gap-4 rounded-3xl border px-4 py-3.5 text-start transition-all duration-300 sm:px-5 ${
                  active
                    ? 'border-nova-300/65 bg-nova-400/12 shadow-[0_10px_30px_-16px_rgba(255,138,61,0.9)]'
                    : 'border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-sm font-black transition-colors ${
                    active ? 'bg-nova-300 text-space-950' : 'bg-white/8 text-ink-300 group-hover:text-ink-100'
                  }`}
                >
                  {OPTION_LABELS[optionIndex]}
                </span>
                <span className={`flex-1 text-[0.93rem] leading-relaxed ${active ? 'font-bold text-ink-100' : 'text-ink-200'}`}>
                  {option}
                </span>
                {active ? <span className="text-[0.72rem] font-black text-nova-200">انتخاب شد ✓</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-[0.72rem] text-ink-400">
        راهنما: با کلیدهای <span className="font-bold text-ink-300">۱ تا ۴</span> گزینه را انتخاب کن، با
        <span className="font-bold text-ink-300"> → </span>و<span className="font-bold text-ink-300"> ← </span>
        میان سؤال‌ها جابه‌جا شو و با <span className="font-bold text-ink-300">F</span> سؤال را نشان‌دار کن.
      </p>
    </article>
  );
}
