import { Brain, ClipboardList, Gauge, GraduationCap, Layers, NotebookPen, Orbit, Telescope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StageQuota {
  /** نام درس در بانک سؤال */
  subject: string;
  /** تعداد سؤال از آن درس */
  count: number;
  /** نام نمایشی درس در کارنامه (اختیاری) */
  label?: string;
}

export interface ExamStage {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  quota: StageQuota[];
}

export interface Exam {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  majors: string[];
  level: string;
  badge?: string;
  gradient: string;
  icon: LucideIcon;
  participants: string;
  recommendedFor: string;
  stages: ExamStage[];
}

export const EXAMS: Exam[] = [
  {
    id: 'placement-tajrobi',
    title: 'آزمون تعیین سطح گروه تجربی',
    subtitle: 'زیست، شیمی، فیزیک و ریاضی',
    description:
      'نقطه شروع دقیق برای دانش‌آموزان تجربی. با این آزمون می‌فهمیم در کدام درس پایه قوی داری و کجا باید از پایه‌سازی شروع کنیم.',
    majors: ['تجربی'],
    level: 'تعیین سطح',
    badge: 'پرطرفدارترین',
    gradient: 'from-nova-300 via-nova-500 to-nova-700',
    icon: Telescope,
    participants: '۲٬۴۸۰ داوطلب',
    recommendedFor: 'دهم، یازدهم، دوازدهم و فارغ‌التحصیل گروه تجربی',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — زیست و شیمی',
        subtitle: 'تمرکز بر مفاهیم پایه و حفظیات مفهومی',
        minutes: 18,
        quota: [
          { subject: 'زیست‌شناسی', count: 8 },
          { subject: 'شیمی', count: 7 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — فیزیک و ریاضی',
        subtitle: 'تمرکز بر حل مسئله و محاسبات',
        minutes: 17,
        quota: [
          { subject: 'فیزیک', count: 8 },
          { subject: 'ریاضیات', count: 7 },
        ],
      },
    ],
  },
  {
    id: 'placement-riazi',
    title: 'آزمون تعیین سطح گروه ریاضی',
    subtitle: 'حسابان، هندسه و گسسته، فیزیک و شیمی',
    description:
      'برای دانش‌آموزان ریاضی که می‌خواهند بدانند در دروس اختصاصی چقدر آماده‌اند و برنامه خود را بر چه اولویتی بچینند.',
    majors: ['ریاضی'],
    level: 'تعیین سطح',
    gradient: 'from-comet-300 via-comet-500 to-nebula-500',
    icon: Orbit,
    participants: '۱٬۹۳۰ داوطلب',
    recommendedFor: 'دهم، یازدهم، دوازدهم و فارغ‌التحصیل گروه ریاضی',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — ریاضیات و گسسته',
        subtitle: 'تابع، مشتق، دنباله، شمارش و گراف',
        minutes: 20,
        quota: [
          { subject: 'ریاضیات', count: 10 },
          { subject: 'هندسه و گسسته', count: 5 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — فیزیک و شیمی',
        subtitle: 'مکانیک، الکتریسیته، مفاهیم و مسائل شیمی',
        minutes: 20,
        quota: [
          { subject: 'فیزیک', count: 9 },
          { subject: 'شیمی', count: 6 },
        ],
      },
    ],
  },
  {
    id: 'placement-ensani',
    title: 'آزمون تعیین سطح گروه انسانی',
    subtitle: 'ادبیات تخصصی، عربی، آمار و دروس پایه انسانی',
    description:
      'دروس انسانی روش مطالعه متفاوتی دارند. این آزمون مشخص می‌کند مهارت تحلیلی تو در ادبیات و عربی و تسلط مفهومی‌ات در دروس حفظی-تحلیلی چگونه است.',
    majors: ['انسانی'],
    level: 'تعیین سطح',
    gradient: 'from-nebula-300 via-nebula-500 to-rose-400',
    icon: GraduationCap,
    participants: '۱٬۲۴۰ داوطلب',
    recommendedFor: 'دهم، یازدهم، دوازدهم و فارغ‌التحصیل گروه انسانی',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — ادبیات، عربی و آمار',
        subtitle: 'آرایه‌ها، قواعد و ترجمه، آمار توصیفی',
        minutes: 17,
        quota: [
          { subject: 'علوم و فنون ادبی', count: 6 },
          { subject: 'عربی تخصصی', count: 5 },
          { subject: 'ریاضی و آمار', count: 4 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — دروس پایه انسانی',
        subtitle: 'اقتصاد، منطق و فلسفه، روان‌شناسی، جامعه‌شناسی و تاریخ',
        minutes: 18,
        quota: [
          { subject: 'اقتصاد', count: 3 },
          { subject: 'منطق و فلسفه', count: 3 },
          { subject: 'روان‌شناسی', count: 3 },
          { subject: 'جامعه‌شناسی', count: 3 },
          { subject: 'تاریخ و جغرافیا', count: 3 },
        ],
      },
    ],
  },
  {
    id: 'final-exam-simulator',
    title: 'شبیه‌ساز امتحان نهایی (دروس عمومی)',
    subtitle: 'ادبیات فارسی، دین و زندگی، عربی و زبان انگلیسی',
    description:
      'با تأثیر قطعی سوابق تحصیلی، امتحان نهایی بخشی از نمره کل توست. این آزمون مهارت تشریحی‌خوانی و تسلطت بر دروس عمومی را می‌سنجد.',
    majors: ['همه رشته‌ها'],
    level: 'شبیه‌ساز نهایی',
    badge: 'ویژه دوازدهمی‌ها',
    gradient: 'from-mint-400 via-comet-400 to-comet-500',
    icon: NotebookPen,
    participants: '۳٬۱۲۰ داوطلب',
    recommendedFor: 'پایه دوازدهم و فارغ‌التحصیلان همه گروه‌ها',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — ادبیات فارسی و دین و زندگی',
        subtitle: 'معنا و مفاهیم، تاریخ ادبیات و آرایه‌ها',
        minutes: 15,
        quota: [
          { subject: 'ادبیات فارسی', count: 5 },
          { subject: 'دین و زندگی', count: 5 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — عربی و زبان انگلیسی',
        subtitle: 'ترجمه، قواعد و درک مطلب',
        minutes: 15,
        quota: [
          { subject: 'عربی تخصصی', count: 5, label: 'عربی' },
          { subject: 'زبان انگلیسی', count: 5 },
        ],
      },
    ],
  },
  {
    id: 'aptitude',
    title: 'آزمون استعداد تحصیلی و هوش',
    subtitle: 'درک مطلب، استدلال منطقی، هوش عددی و کلامی',
    description:
      'استعداد تحصیلی در آزمون‌های دکتری، ارشد و برخی سنجش‌های ویژه نقش تعیین‌کننده دارد و مهارتش کاملاً تمرین‌کردنی است.',
    majors: ['همه رشته‌ها'],
    level: 'مهارت‌سنجی',
    gradient: 'from-nova-200 via-nebula-400 to-nebula-600',
    icon: Brain,
    participants: '۴٬۶۵۰ داوطلب',
    recommendedFor: 'همه داوطلبان، به‌ویژه کسانی که می‌خواهند مهارت تحلیلی خود را بسنجند',
    stages: [
      {
        id: 's1',
        title: 'مرحله یگانه — استعداد تحصیلی',
        subtitle: '۱۰ سؤال تحلیلی با زمان محدود',
        minutes: 12,
        quota: [{ subject: 'استعداد تحصیلی', count: 10 }],
      },
    ],
  },
  {
    id: 'quick-diagnostic',
    title: 'آزمون سریع ۱۰ سؤالی',
    subtitle: 'یک محک کوتاه و فوری از همه دروس',
    description:
      'اگر فقط ده دقیقه وقت داری و می‌خواهی همین حالا یک نمای کلی از وضعیت درسی‌ات ببینی، از این آزمون شروع کن.',
    majors: ['همه رشته‌ها'],
    level: 'سریع',
    badge: 'شروع فوری',
    gradient: 'from-rose-400 via-nova-400 to-nova-300',
    icon: Gauge,
    participants: '۶٬۲۸۰ داوطلب',
    recommendedFor: 'همه داوطلبانی که می‌خواهند سریع یک ارزیابی اولیه داشته باشند',
    stages: [
      {
        id: 's1',
        title: 'مرحله یگانه — محک سریع',
        subtitle: 'دو سؤال از هر درس اصلی',
        minutes: 8,
        quota: [
          { subject: 'زیست‌شناسی', count: 2 },
          { subject: 'شیمی', count: 2 },
          { subject: 'فیزیک', count: 2 },
          { subject: 'ریاضیات', count: 2 },
          { subject: 'استعداد تحصیلی', count: 2 },
        ],
      },
    ],
  },
  {
    id: 'comprehensive-1406',
    title: 'آزمون جامع شبیه‌ساز ۱۴۰۶',
    subtitle: 'سه مرحله، ۴۵ سؤال، ۶۰ دقیقه',
    description:
      'نزدیک‌ترین تجربه به روز کنکور: چند مرحله‌ای، زمان‌بندی سخت‌گیرانه، نمره منفی و کارنامه درس‌به‌درس با پاسخ تشریحی.',
    majors: ['تجربی', 'ریاضی', 'انسانی'],
    level: 'جامع و چالشی',
    badge: 'سطح پیشرفته',
    gradient: 'from-nebula-400 via-nova-400 to-nova-600',
    icon: Layers,
    participants: '۱٬۱۱۰ داوطلب',
    recommendedFor: 'دانش‌آموزانی که حداقل یک دوره مطالعاتی کامل را گذرانده‌اند',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — استعداد و ریاضیات',
        subtitle: 'استعداد تحصیلی، ریاضیات و علوم و فنون ادبی',
        minutes: 20,
        quota: [
          { subject: 'استعداد تحصیلی', count: 6 },
          { subject: 'ریاضیات', count: 6 },
          { subject: 'علوم و فنون ادبی', count: 3 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — علوم پایه',
        subtitle: 'زیست‌شناسی، شیمی و فیزیک',
        minutes: 20,
        quota: [
          { subject: 'زیست‌شناسی', count: 5 },
          { subject: 'شیمی', count: 5 },
          { subject: 'فیزیک', count: 5 },
        ],
      },
      {
        id: 's3',
        title: 'مرحله سوم — دروس تکمیلی',
        subtitle: 'هندسه و گسسته، دروس انسانی و ادبیات فارسی',
        minutes: 20,
        quota: [
          { subject: 'هندسه و گسسته', count: 3 },
          { subject: 'اقتصاد', count: 2 },
          { subject: 'منطق و فلسفه', count: 2 },
          { subject: 'روان‌شناسی', count: 2 },
          { subject: 'جامعه‌شناسی', count: 2 },
          { subject: 'تاریخ و جغرافیا', count: 2 },
          { subject: 'ادبیات فارسی', count: 2 },
        ],
      },
    ],
  },
  {
    id: 'consulting-fit',
    title: 'آزمون سبک مطالعه و مدیریت زمان',
    subtitle: 'خودارزیابی رفتاری برای طراحی برنامه شخصی',
    description:
      'این آزمون سطح علمی تو را نمی‌سنجد؛ عادت‌های مطالعه، تمرکز و مدیریت زمانت را مشخص می‌کند تا مشاور بتواند برنامه را دقیق‌تر بنویسد.',
    majors: ['همه رشته‌ها'],
    level: 'خودارزیابی',
    badge: 'رایگان',
    gradient: 'from-nova-300 via-rose-400 to-nebula-500',
    icon: ClipboardList,
    participants: '۵٬۴۷۰ داوطلب',
    recommendedFor: 'همه داوطلبان، به‌ویژه کسانی که با اهمال‌کاری و بی‌نظمی دست‌وپنجه نرم می‌کنند',
    stages: [
      {
        id: 's1',
        title: 'مرحله اول — عادت‌های مطالعه',
        subtitle: 'هوش تحصیلی و روش‌های یادگیری',
        minutes: 10,
        quota: [
          { subject: 'استعداد تحصیلی', count: 4 },
          { subject: 'ریاضی و آمار', count: 3 },
        ],
      },
      {
        id: 's2',
        title: 'مرحله دوم — استدلال و تمرکز',
        subtitle: 'منطق، روان‌شناسی و درک مطلب',
        minutes: 10,
        quota: [
          { subject: 'منطق و فلسفه', count: 2 },
          { subject: 'روان‌شناسی', count: 2 },
          { subject: 'علوم و فنون ادبی', count: 3 },
        ],
      },
    ],
  },
];

export function getExam(id: string): Exam | undefined {
  return EXAMS.find((e) => e.id === id);
}

export function examQuestionCount(exam: Exam): number {
  return exam.stages.reduce((sum, stage) => sum + stage.quota.reduce((s, q) => s + q.count, 0), 0);
}

export function examTotalMinutes(exam: Exam): number {
  return exam.stages.reduce((sum, stage) => sum + stage.minutes, 0);
}

export function examSubjects(exam: Exam): string[] {
  const set = new Set<string>();
  exam.stages.forEach((stage) => stage.quota.forEach((q) => set.add(q.label ?? q.subject)));
  return Array.from(set);
}
