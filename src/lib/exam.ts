import { QUESTIONS, type Question } from '@/data/questions';
import type { Exam } from '@/data/exams';
import { clamp } from './fa';

export interface PaperStage {
  id: string;
  title: string;
  subtitle: string;
  seconds: number;
  questions: Question[];
}

/* ------------------------------ شبه‌تصادفی ------------------------------ */

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** مولد شبه‌تصادفی mulberry32 — ترتیب سؤالات برای هر داوطلب ثابت و قابل بازتولید است */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rnd: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ------------------------------- ساخت برگه ------------------------------- */

/**
 * ساخت برگه آزمون برای یک داوطلب.
 * ترتیب و گزینش سؤال‌ها بر پایه کد داوطلبی و شماره دفعه (attempt) به‌هم ریخته می‌شود؛
 * پس هر داوطلب برگه متفاوتی می‌بیند و در آزمون دوباره هم سؤال‌ها تکرار نمی‌شوند.
 * در هر صورت هیچ سؤالی دو بار در یک برگه نمی‌آید.
 */
export function buildPaper(exam: Exam, candidateSeed: string, attempt = 0): PaperStage[] {
  const rnd = mulberry32(hashString(`${exam.id}|${candidateSeed.trim().toUpperCase()}|${attempt}`));
  const pool = new Map<string, Question[]>();

  const subjects = new Set<string>();
  exam.stages.forEach((stage) => stage.quota.forEach((q) => subjects.add(q.subject)));
  subjects.forEach((subject) => {
    pool.set(subject, shuffled(QUESTIONS.filter((q) => q.subject === subject), rnd));
  });

  return exam.stages.map((stage) => {
    const questions: Question[] = [];
    stage.quota.forEach((quota) => {
      const bucket = pool.get(quota.subject) ?? [];
      const picked = bucket.splice(0, quota.count);
      picked.forEach((q) => questions.push(quota.label && quota.label !== q.subject ? { ...q, subject: quota.label } : q));
    });
    return {
      id: stage.id,
      title: stage.title,
      subtitle: stage.subtitle,
      seconds: stage.minutes * 60,
      questions,
    };
  });
}

/* -------------------------------- نمره‌دهی -------------------------------- */

export interface SubjectScore {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  percent: number;
}

export type AnswerSheet = Record<string, number | null>;

/** درصد با اعمال نمره منفی (هر ۳ غلط = حذف ۱ درست) */
export function percentWithPenalty(correct: number, wrong: number, total: number): number {
  if (!total) return 0;
  return clamp(((correct - wrong / 3) / total) * 100, -33.33, 100);
}

export interface ScoreSummary {
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  percent: number;
  /** نمره خام از ۱۰۰ با کسر نمره منفی */
  rawScore: number;
  /** تراز تقریبی در بازه ۳۰۰۰ تا ۱۰۰۰۰ */
  taraz: number;
  level: string;
  advice: string;
  subjectScores: SubjectScore[];
}

export function scorePaper(stages: PaperStage[], answers: AnswerSheet, secondsByQuestion: Record<string, number>): ScoreSummary {
  const questions = stages.flatMap((s) => s.questions);
  const bySubject = new Map<string, { total: number; correct: number; wrong: number; blank: number; seconds: number }>();

  let correct = 0;
  let wrong = 0;
  let blank = 0;

  questions.forEach((q) => {
    const selected = answers[q.id];
    const entry = bySubject.get(q.subject) ?? { total: 0, correct: 0, wrong: 0, blank: 0, seconds: 0 };
    entry.total += 1;
    entry.seconds += secondsByQuestion[q.id] ?? 0;

    if (selected === null || selected === undefined) {
      entry.blank += 1;
      blank += 1;
    } else if (selected === q.answer) {
      entry.correct += 1;
      correct += 1;
    } else {
      entry.wrong += 1;
      wrong += 1;
    }
    bySubject.set(q.subject, entry);
  });

  const total = questions.length;
  const percent = percentWithPenalty(correct, wrong, total);
  const rawScore = Math.max(0, correct - wrong / 3);
  const taraz = Math.round(3000 + ((percent + 33.33) / 133.33) * 7000);

  const subjectScores: SubjectScore[] = Array.from(bySubject.entries())
    .map(([subject, e]) => ({
      subject,
      total: e.total,
      correct: e.correct,
      wrong: e.wrong,
      blank: e.blank,
      percent: percentWithPenalty(e.correct, e.wrong, e.total),
    }))
    .sort((a, b) => b.percent - a.percent);

  const { level, advice } = levelOf(percent);

  return { total, correct, wrong, blank, percent, rawScore, taraz, level, advice, subjectScores };
}

export function levelOf(percent: number): { level: string; advice: string } {
  if (percent >= 70) {
    return {
      level: 'درخشان',
      advice:
        'سطح تو در بازه رتبه‌های برتر است. حالا وقت جمع‌بندی هوشمند، تست زمان‌دار و کار روی دقت است؛ نه افزودن منبع جدید.',
    };
  }
  if (percent >= 55) {
    return {
      level: 'خیلی خوب',
      advice: 'پایه قوی داری. با تمرکز روی دو درس ضعیف‌تر و افزایش تست زمان‌دار می‌توانی به بازه درخشان برسی.',
    };
  }
  if (percent >= 40) {
    return {
      level: 'خوب، در حال رشد',
      advice: 'نیمی از مسیر را رفته‌ای. اولویت تو رفع اشکال مبحثی و مرور فاصله‌دار است؛ تست زدن بدون مرور، درجا زدن است.',
    };
  }
  if (percent >= 25) {
    return {
      level: 'نیازمند تقویت',
      advice: 'نیاز به پایه‌سازی داری. پیشنهاد نووا: شروع با درس‌های پرتکرار، خلاصه‌نویسی و تست آموزشی بدون زمان‌بندی.',
    };
  }
  return {
    level: 'شروع از پایه',
    advice: 'نگران نباش؛ این یعنی نقطه شروعت مشخص شد. با یک برنامه منظم و مشاوره تخصصی، مسیر کاملاً قابل جبران است.',
  };
}

/** زمان پیشنهادی هر سؤال (ثانیه) برای نمایش در پاسخ‌نامه */
export function suggestedSecondsPerQuestion(stages: PaperStage[]): number {
  const seconds = stages.reduce((s, st) => s + st.seconds, 0);
  const count = stages.reduce((s, st) => s + st.questions.length, 0) || 1;
  return Math.round(seconds / count);
}
