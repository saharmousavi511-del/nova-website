export type Grade = 'دهم' | 'یازدهم' | 'دوازدهم' | 'فارغ‌التحصیل' | 'سایر';
export type Major = 'تجربی' | 'ریاضی' | 'انسانی' | 'هنر' | 'زبان' | 'سایر';

/** اطلاعات ثبت‌شده در فرم درخواست مشاوره */
export interface Registration {
  id: string;
  trackingCode: string;
  createdAt: string;
  updatedAt?: string;
  status: 'جدید' | 'بررسی‌شده' | 'هماهنگ‌شده' | 'بایگانی';

  // مرحله ۱ — اطلاعات فردی
  fullName: string;
  mobile: string;
  parentMobile: string;
  city: string;
  grade: Grade | '';
  major: Major | '';
  email?: string;

  // مرحله ۲ — وضعیت درسی
  lastGpa: string;
  dailyStudyHours: string;
  goal: string;
  lastExamScore?: string;
  strongSubjects: string;
  weakSubjects: string;
  schoolType?: string;

  // مرحله ۳ — سبک زندگی و تمرکز
  sleepTime: string;
  wakeTime: string;
  phoneUsage: string;
  mainProblem: string;
  distractionLevel: number;

  // مرحله ۴ — انتظارات
  expectation: string;
  focusAreas: string[];
  planInterest?: string;
  budget?: string;
  contactPreference?: string;
  note?: string;
  agreement: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selected: number | null;
  seconds: number;
}

export interface StageResult {
  stageId: string;
  title: string;
  answers: AnswerRecord[];
  secondsUsed: number;
  secondsLimit: number;
}

/** نتیجه یک آزمون آنلاین */
export interface ExamResult {
  id: string;
  createdAt: string;
  examId: string;
  examTitle: string;
  /** شماره دفعه‌ای که همین داوطلب همین آزمون را داده (از صفر) */
  attempt: number;
  candidateCode: string;
  candidateName: string;
  major: string;
  totalSeconds: number;
  stages: StageResult[];
  subjectScores: {
    subject: string;
    total: number;
    correct: number;
    wrong: number;
    blank: number;
    percent: number;
  }[];
  correct: number;
  wrong: number;
  blank: number;
  percent: number;
  score: number;
  rawScore: number;
  level: string;
}
