import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  Copy,
  HeartHandshake,
  Loader2,
  PhoneCall,
  Save,
  Sparkles,
  Target,
  Timer,
  UserRound,
} from 'lucide-react';
import { ChipGroupField, RadioGroupField, RangeField, SelectField, TextAreaField, TextField } from './Fields';
import { PLANS } from '@/data/services';
import { submitRegistration } from '@/lib/api';
import { STORAGE_KEYS, readValue, removeKey, writeValue } from '@/lib/storage';
import type { Grade, Major, Registration } from '@/lib/types';
import { SITE } from '@/data/site';
import { isValidEmail, isValidMobile, normalizeMobile, toEn, toFa } from '@/lib/fa';

type FormData = Omit<Registration, 'id' | 'trackingCode' | 'createdAt' | 'status'>;

const EMPTY: FormData = {
  fullName: '',
  mobile: '',
  parentMobile: '',
  city: '',
  grade: '',
  major: '',
  email: '',
  lastGpa: '',
  dailyStudyHours: '',
  goal: '',
  lastExamScore: '',
  strongSubjects: '',
  weakSubjects: '',
  schoolType: '',
  sleepTime: '',
  wakeTime: '',
  phoneUsage: '',
  mainProblem: '',
  distractionLevel: 5,
  expectation: '',
  focusAreas: [],
  planInterest: '',
  budget: '',
  contactPreference: '',
  note: '',
  agreement: false,
};

const STEPS = [
  {
    id: 'personal',
    label: 'مرحله اول',
    title: 'اول با خودت آشنا بشیم',
    subtitle: 'اطلاعات تماس را دقیق وارد کن تا برای هماهنگی بتوانیم با تو در ارتباط باشیم.',
    icon: UserRound,
  },
  {
    id: 'study',
    label: 'مرحله دوم',
    title: 'وضعیت درسی فعلی',
    subtitle: 'جواب‌ها قرار نیست بی‌نقص باشند؛ فقط واقعی و دقیق بنویس تا برنامه بر همان واقعیت نوشته شود.',
    icon: ClipboardList,
  },
  {
    id: 'lifestyle',
    label: 'مرحله سوم',
    title: 'سبک زندگی و تمرکز',
    subtitle: 'کیفیت خواب، موبایل و تمرکز مستقیماً روی نتیجه درسی اثر می‌گذارند.',
    icon: Brain,
  },
  {
    id: 'expectation',
    label: 'مرحله چهارم',
    title: 'انتظارات از دوره',
    subtitle: 'این بخش کمک می‌کند اولویت شروع همکاری و طرح پیشنهادی را دقیق‌تر مشخص کنیم.',
    icon: Target,
  },
] as const;

const GRADES: Grade[] = ['دهم', 'یازدهم', 'دوازدهم', 'فارغ‌التحصیل', 'سایر'];
const MAJORS: Major[] = ['تجربی', 'ریاضی', 'انسانی', 'هنر', 'زبان', 'سایر'];

const FOCUS_AREAS = [
  'افزایش ساعت مطالعه',
  'برنامه‌ریزی شخصی',
  'رفع اهمال‌کاری',
  'افزایش تمرکز',
  'مدیریت زمان',
  'تست‌زنی',
  'جمع‌بندی',
  'کاهش استرس',
  'ایجاد نظم',
  'اصلاح خواب',
];

const PHONE_USAGE = [
  'کمتر از یک ساعت',
  '۱ تا ۲ ساعت',
  '۲ تا ۴ ساعت',
  '۴ تا ۶ ساعت',
  'بیشتر از ۶ ساعت',
];

const SCHOOL_TYPES = ['دولتی', 'نمونه دولتی', 'تیزهوشان', 'غیرانتفاعی', 'شبانه‌روزی', 'از راه دور'];

const BUDGETS = [
  'تا ۱.۵ میلیون تومان در ماه',
  '۱.۵ تا ۳ میلیون تومان در ماه',
  '۳ تا ۵ میلیون تومان در ماه',
  'پرداخت سه‌ماهه با تخفیف',
  'نیاز به راهنمایی درباره هزینه دارم',
];

type Errors = Partial<Record<keyof FormData, string>>;

function validateStep(step: number, data: FormData): Errors {
  const errors: Errors = {};

  if (step === 0) {
    if (data.fullName.trim().length < 4) errors.fullName = 'نام و نام خانوادگی را کامل وارد کن.';
    else if (data.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'نام و نام خانوادگی را با هم بنویس.';

    if (!isValidMobile(data.mobile)) errors.mobile = 'شماره موبایل معتبر ۱۱ رقمی وارد کن (مثل ۰۹۱۲۳۴۵۶۷۸۹).';
    if (!isValidMobile(data.parentMobile)) errors.parentMobile = 'شماره موبایل معتبر ۱۱ رقمی وارد کن.';
    else if (normalizeMobile(data.parentMobile) === normalizeMobile(data.mobile))
      errors.parentMobile = 'شماره دوم باید با شماره دانش‌آموز متفاوت باشد.';

    if (!data.city.trim()) errors.city = 'شهر محل سکونت را وارد کن.';
    if (!data.grade) errors.grade = 'پایه تحصیلی را انتخاب کن.';
    if (!data.major) errors.major = 'رشته تحصیلی را انتخاب کن.';
    if (data.email && !isValidEmail(data.email)) errors.email = 'رایانامه معتبر نیست.';
  }

  if (step === 1) {
    const gpa = Number(toEn(data.lastGpa));
    if (!data.lastGpa.trim()) errors.lastGpa = 'معدل سال گذشته را وارد کن.';
    else if (Number.isNaN(gpa) || gpa < 0 || gpa > 20) errors.lastGpa = 'معدل باید عددی بین ۰ تا ۲۰ باشد.';

    const hours = Number(toEn(data.dailyStudyHours));
    if (!data.dailyStudyHours.trim()) errors.dailyStudyHours = 'میانگین ساعت مطالعه را وارد کن.';
    else if (Number.isNaN(hours) || hours < 0 || hours > 20) errors.dailyStudyHours = 'ساعت مطالعه باید عددی بین ۰ تا ۲۰ باشد.';

    if (data.goal.trim().length < 4) errors.goal = 'هدف تحصیلی خودت را بنویس (مثلاً پزشکی دانشگاه تهران).';
    if (!data.strongSubjects.trim()) errors.strongSubjects = 'حداقل یک درس قوی را بنویس.';
    if (!data.weakSubjects.trim()) errors.weakSubjects = 'حداقل یک درس ضعیف را بنویس.';
  }

  if (step === 2) {
    if (!data.sleepTime) errors.sleepTime = 'ساعت خواب را وارد کن.';
    if (!data.wakeTime) errors.wakeTime = 'ساعت بیداری را وارد کن.';
    if (!data.phoneUsage) errors.phoneUsage = 'میزان استفاده از موبایل را انتخاب کن.';
    if (data.mainProblem.trim().length < 10) errors.mainProblem = 'بزرگ‌ترین مشکل درسی را کمی کامل‌تر توضیح بده.';
  }

  if (step === 3) {
    if (data.expectation.trim().length < 12) errors.expectation = 'انتظارت از دوره را در یک جمله کامل بنویس.';
    if (data.focusAreas.length === 0) errors.focusAreas = 'حداقل یک مورد را انتخاب کن.';
    if (!data.contactPreference) errors.contactPreference = 'روش تماس ترجیحی را انتخاب کن.';
    if (!data.agreement) errors.agreement = 'برای ارسال درخواست، پذیرش این مورد لازم است.';
  }

  return errors;
}

interface RegisterFormProps {
  initialPlan?: string;
}

export function RegisterForm({ initialPlan }: RegisterFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(() => ({
    ...EMPTY,
    planInterest: initialPlan ?? '',
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ code: string; synced: boolean } | null>(null);
  const [restored, setRestored] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  /* بازیابی پیش‌نویس ذخیره‌شده */
  useEffect(() => {
    const draft = readValue<FormData>(STORAGE_KEYS.formDraft);
    if (draft && typeof draft === 'object' && draft.fullName) {
      setData({ ...EMPTY, ...draft, planInterest: initialPlan ?? draft.planInterest ?? '' });
      setRestored(true);
      window.setTimeout(() => setRestored(false), 6000);
    }
  }, [initialPlan]);

  /* ذخیره خودکار پیش‌نویس */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (result) return;
      const hasContent = data.fullName || data.mobile || data.goal;
      if (hasContent) {
        writeValue(STORAGE_KEYS.formDraft, data);
        setDraftSaved(true);
        window.setTimeout(() => setDraftSaved(false), 2500);
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [data, result]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const completedSteps = useMemo(() => {
    return STEPS.map((_, index) => index < step && Object.keys(validateStep(index, data)).length === 0);
  }, [step, data]);

  const progress = ((step + (result ? 1 : 0)) / STEPS.length) * 100;

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      const firstKey = Object.keys(stepErrors)[0];
      document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      scrollToTop();
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setErrors({});
      setStep(step - 1);
      scrollToTop();
    }
  };

  const submit = async () => {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setSubmitting(true);
    try {
      const outcome = await submitRegistration({
        ...data,
        mobile: normalizeMobile(data.mobile),
        parentMobile: normalizeMobile(data.parentMobile),
      });
      setResult({ code: outcome.code, synced: outcome.synced });
      removeKey(STORAGE_KEYS.formDraft);
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFocus = (value: string) => {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(value) ? prev.focusAreas.filter((v) => v !== value) : [...prev.focusAreas, value],
    }));
    setErrors((prev) => ({ ...prev, focusAreas: undefined }));
  };

  /* ------------------------------ صفحه موفقیت ------------------------------ */
  if (result) {
    return (
      <div className="glass relative mx-auto max-w-3xl overflow-hidden rounded-5xl p-8 text-center sm:p-12">
        <span className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-mint-400/20 blur-[80px]" />
        <span className="relative mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-mint-400/15 text-mint-400">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint-400/25" />
          <CheckCircle2 size={46} />
        </span>

        <h2 className="relative text-2xl font-black text-ink-100 sm:text-3xl">درخواستت ثبت شد 🧡</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[0.95rem] leading-loose text-ink-300">
          ممنون که با دقت فرم را تکمیل کردی، {data.fullName.split(' ')[0]} جان. اطلاعاتت توسط تیم نووا بررسی می‌شود و
          حداکثر تا ۲۴ ساعت کاری با شماره <span className="font-bold tabular-nums text-ink-100">{toFa(data.mobile)}</span> تماس
          می‌گیریم.
        </p>

        <div className="relative mx-auto mt-8 max-w-md rounded-4xl border border-dashed border-nova-300/40 bg-nova-400/[0.07] p-6">
          <p className="text-[0.76rem] font-bold text-ink-400">کد رهگیری و کد داوطلبی تو</p>
          <p className="mt-2 text-3xl font-black tracking-[0.12em] text-gradient tabular-nums" dir="ltr">
            {result.code}
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-300">
            این کد را نگه دار؛ با آن می‌توانی وارد آزمون‌های آنلاین نووا شوی و نتیجه‌ات به‌صورت خودکار در پرونده‌ات ثبت
            می‌شود.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(result.code)}
              className="btn btn-ghost !px-4 !py-2 text-xs"
            >
              <Copy size={14} />
              کپی کد
            </button>
            <Link to={`/exam?code=${result.code}`} className="btn btn-primary !px-4 !py-2 text-xs">
              <Timer size={14} />
              ورود به آزمون آنلاین
            </Link>
          </div>
          {result.synced ? (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.72rem] font-bold text-mint-400">
              <Sparkles size={12} />
              برای تیم مشاوره ارسال شد
            </p>
          ) : (
            <p className="mt-3 text-[0.72rem] text-ink-400">
              درخواست در این مرورگر ذخیره شد و از «داشبورد نووا» قابل مشاهده است.
            </p>
          )}
        </div>

        <ol className="relative mx-auto mt-8 grid max-w-2xl gap-3 text-start sm:grid-cols-3">
          {[
            { icon: ClipboardList, title: 'بررسی پرونده', text: 'کارشناس آموزشی فرم تو را می‌خواند و سطح درسی‌ات را دسته‌بندی می‌کند.' },
            { icon: PhoneCall, title: 'تماس هماهنگی', text: 'برای جلسه تعیین سطح رایگان با تو تماس می‌گیریم.' },
            { icon: HeartHandshake, title: 'شروع همکاری', text: 'مشاور و طرح مناسب معرفی می‌شود و اولین برنامه هفتگی را می‌گیری.' },
          ].map((item, index) => (
            <li key={item.title} className="glass-soft rounded-3xl p-4">
              <span className="mb-2 flex items-center gap-2 text-nova-200">
                <item.icon size={16} />
                <span className="text-[0.8rem] font-black">{item.title}</span>
              </span>
              <p className="text-[0.76rem] leading-relaxed text-ink-400">{item.text}</p>
              <span className="mt-2 block text-[0.65rem] font-bold text-ink-400">گام {toFa(index + 1)}</span>
            </li>
          ))}
        </ol>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-ghost !px-5 !py-3 text-sm">
            <ArrowRight size={16} />
            بازگشت به خانه
          </Link>
          <Link to="/services" className="btn btn-outline !px-5 !py-3 text-sm">
            مرور طرح‌های مشاوره
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setData({ ...EMPTY });
              setStep(0);
            }}
            className="text-[0.8rem] font-bold text-ink-400 underline-offset-4 transition-colors hover:text-nova-200 hover:underline"
          >
            ثبت درخواست جدید برای فرد دیگر
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- فرم اصلی -------------------------------- */
  return (
    <div ref={topRef} className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
      {/* ------------------------- کارت فرم ------------------------- */}
      <form
        className="glass overflow-hidden rounded-5xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === STEPS.length - 1) void submit();
          else goNext();
        }}
        noValidate
      >
        {/* نوار پیشرفت */}
        <div className="border-b border-white/8 bg-space-950/40 px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[0.78rem] font-bold text-nova-200">
              <Save size={14} />
              {restored ? 'پیش‌نویس قبلی بازیابی شد' : draftSaved ? 'پیش‌نویس ذخیره شد' : 'اطلاعات فردی'}
            </span>
            <span className="text-[0.78rem] font-bold text-ink-300">
              مرحله {toFa(step + 1)} از {toFa(STEPS.length)}
            </span>
          </div>
          <div className="progress-track mt-3 h-1.5">
            <div className="progress-bar" style={{ width: `${Math.max(progress, 4)}%` }} />
          </div>

          <ol className="mt-5 hidden grid-cols-4 gap-2 sm:grid">
            {STEPS.map((item, index) => {
              const state = index === step ? 'current' : completedSteps[index] ? 'done' : 'todo';
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={index > step}
                    onClick={() => {
                      if (index < step) {
                        setErrors({});
                        setStep(index);
                      }
                    }}
                    className={`flex w-full flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-all duration-300 ${
                      state === 'current'
                        ? 'border-nova-300/50 bg-nova-400/12'
                        : state === 'done'
                          ? 'border-mint-400/30 bg-mint-400/[0.07] hover:border-mint-400/50'
                          : 'border-white/8 bg-white/[0.02] opacity-60'
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full text-[0.75rem] font-black ${
                        state === 'current'
                          ? 'bg-nova-300 text-space-950'
                          : state === 'done'
                            ? 'bg-mint-400/25 text-mint-400'
                            : 'bg-white/8 text-ink-400'
                      }`}
                    >
                      {state === 'done' ? '✓' : toFa(index + 1)}
                    </span>
                    <span className={`text-[0.7rem] font-bold ${state === 'current' ? 'text-nova-200' : 'text-ink-400'}`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ------------------------- بدنه مرحله ------------------------- */}
        <div className={`px-5 py-7 sm:px-8 ${shake ? 'animate-shake' : ''}`}>
          <header className="mb-7 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-nova-300/20 to-nebula-400/20 text-nova-200">
              {(() => {
                const Icon = STEPS[step].icon;
                return <Icon size={22} />;
              })()}
            </span>
            <div>
              <span className="text-[0.72rem] font-bold text-nova-300">{STEPS[step].label}</span>
              <h2 className="text-xl font-black text-ink-100 sm:text-2xl">{STEPS[step].title}</h2>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-300">{STEPS[step].subtitle}</p>
            </div>
          </header>

          {/* مرحله ۱ */}
          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="fullName" className="sm:col-span-2">
                <TextField
                  name="fullName"
                  label="نام و نام خانوادگی"
                  required
                  value={data.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  placeholder="مثلاً زهرا محمدی"
                  error={errors.fullName}
                  hint="نام و نام خانوادگی را وارد کن."
                  autoComplete="name"
                />
              </div>

              <div data-field="mobile">
                <TextField
                  name="mobile"
                  label="شماره تماس دانش‌آموز"
                  required
                  value={data.mobile}
                  onChange={(e) => set('mobile', e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  inputMode="tel"
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.mobile}
                  hint="شماره موبایل معتبر ۱۱ رقمی وارد کن."
                  autoComplete="tel"
                />
              </div>

              <div data-field="parentMobile">
                <TextField
                  name="parentMobile"
                  label="شماره والدین یا شماره دوم"
                  required
                  value={data.parentMobile}
                  onChange={(e) => set('parentMobile', e.target.value)}
                  placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                  inputMode="tel"
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.parentMobile}
                  hint="برای هماهنگی‌های ضروری با والدین تماس می‌گیریم."
                />
              </div>

              <div data-field="city">
                <TextField
                  name="city"
                  label="شهر محل سکونت"
                  required
                  value={data.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="مثلاً اصفهان"
                  error={errors.city}
                  hint="شهر محل سکونت را وارد کن."
                />
              </div>

              <div data-field="email">
                <TextField
                  name="email"
                  label="رایانامه (اختیاری)"
                  value={data.email ?? ''}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="text-start"
                  error={errors.email}
                  hint="برای ارسال کارنامه آزمون‌ها و برنامه هفتگی."
                  autoComplete="email"
                />
              </div>

              <div data-field="grade">
                <SelectField
                  name="grade"
                  label="پایه تحصیلی"
                  required
                  value={data.grade}
                  onChange={(e) => set('grade', e.target.value as Grade)}
                  options={GRADES.map((g) => ({ value: g, label: g }))}
                  error={errors.grade}
                  hint="پایه تحصیلی را انتخاب کن."
                />
              </div>

              <div data-field="major">
                <SelectField
                  name="major"
                  label="رشته تحصیلی"
                  required
                  value={data.major}
                  onChange={(e) => set('major', e.target.value as Major)}
                  options={MAJORS.map((m) => ({ value: m, label: m }))}
                  error={errors.major}
                  hint="رشته تحصیلی را انتخاب کن."
                />
              </div>
            </div>
          ) : null}

          {/* مرحله ۲ */}
          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="lastGpa">
                <TextField
                  name="lastGpa"
                  label="معدل سال گذشته"
                  required
                  value={data.lastGpa}
                  onChange={(e) => set('lastGpa', e.target.value)}
                  placeholder="مثلاً ۱۸.۴۵"
                  inputMode="decimal"
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.lastGpa}
                  hint="معدل سال گذشته را وارد کن (از ۲۰)."
                />
              </div>

              <div data-field="dailyStudyHours">
                <TextField
                  name="dailyStudyHours"
                  label="میانگین ساعت مطالعه روزانه"
                  required
                  value={data.dailyStudyHours}
                  onChange={(e) => set('dailyStudyHours', e.target.value)}
                  placeholder="مثلاً ۵.۵"
                  inputMode="decimal"
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.dailyStudyHours}
                  hint="میانگین واقعی روزهای مدرسه را بنویس، نه ایده‌آلت را."
                />
              </div>

              <div data-field="goal" className="sm:col-span-2">
                <TextField
                  name="goal"
                  label="هدف و رشته موردنظر"
                  required
                  value={data.goal}
                  onChange={(e) => set('goal', e.target.value)}
                  placeholder="مثلاً پزشکی دانشگاه علوم پزشکی تهران"
                  error={errors.goal}
                  hint="هدف تحصیلی خودت را بنویس؛ اگر مطمئن نیستی بنویس «در حال بررسی»."
                />
              </div>

              <div data-field="lastExamScore">
                <TextField
                  name="lastExamScore"
                  label="آخرین تراز یا رتبه آزمون (اختیاری)"
                  value={data.lastExamScore ?? ''}
                  onChange={(e) => set('lastExamScore', e.target.value)}
                  placeholder="مثلاً تراز ۶۲۰۰ قلم‌چی"
                  dir="ltr"
                  className="text-start"
                  hint="اگر در آزمون آزمایشی شرکت کرده‌ای، آخرین تراز یا رتبه‌ات را بنویس."
                />
              </div>

              <div data-field="schoolType">
                <SelectField
                  name="schoolType"
                  label="نوع مدرسه (اختیاری)"
                  value={data.schoolType ?? ''}
                  onChange={(e) => set('schoolType', e.target.value)}
                  options={SCHOOL_TYPES.map((s) => ({ value: s, label: s }))}
                  hint="برای تنظیم برنامه با ساعات مدرسه."
                />
              </div>

              <div data-field="strongSubjects">
                <TextField
                  name="strongSubjects"
                  label="درس‌های قوی"
                  required
                  value={data.strongSubjects}
                  onChange={(e) => set('strongSubjects', e.target.value)}
                  placeholder="مثلاً زیست، ادبیات"
                  error={errors.strongSubjects}
                  hint="حداقل یک درس قوی را بنویس."
                />
              </div>

              <div data-field="weakSubjects">
                <TextField
                  name="weakSubjects"
                  label="درس‌های ضعیف"
                  required
                  value={data.weakSubjects}
                  onChange={(e) => set('weakSubjects', e.target.value)}
                  placeholder="مثلاً شیمی مسئله‌دار، حسابان"
                  error={errors.weakSubjects}
                  hint="حداقل یک درس ضعیف را بنویس."
                />
              </div>
            </div>
          ) : null}

          {/* مرحله ۳ */}
          {step === 2 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="sleepTime">
                <TextField
                  name="sleepTime"
                  type="time"
                  label="ساعت معمول خواب"
                  required
                  value={data.sleepTime}
                  onChange={(e) => set('sleepTime', e.target.value)}
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.sleepTime}
                  hint="ساعتی که معمولاً می‌خوابی."
                />
              </div>

              <div data-field="wakeTime">
                <TextField
                  name="wakeTime"
                  type="time"
                  label="ساعت معمول بیداری"
                  required
                  value={data.wakeTime}
                  onChange={(e) => set('wakeTime', e.target.value)}
                  dir="ltr"
                  className="text-start tabular-nums"
                  error={errors.wakeTime}
                  hint="ساعتی که معمولاً از خواب بیدار می‌شوی."
                />
              </div>

              <div data-field="phoneUsage" className="sm:col-span-2">
                <SelectField
                  name="phoneUsage"
                  label="روزانه چند ساعت از موبایل استفاده می‌کنی؟"
                  required
                  value={data.phoneUsage}
                  onChange={(e) => set('phoneUsage', e.target.value)}
                  options={PHONE_USAGE.map((p) => ({ value: p, label: p }))}
                  error={errors.phoneUsage}
                  hint="میزان استفاده از موبایل را صادقانه انتخاب کن؛ کسی قضاوتت نمی‌کند."
                />
              </div>

              <div data-field="mainProblem" className="sm:col-span-2">
                <TextAreaField
                  name="mainProblem"
                  label="بزرگ‌ترین مشکل درسی تو چیست؟"
                  required
                  value={data.mainProblem}
                  onChange={(e) => set('mainProblem', e.target.value)}
                  placeholder="مثلاً هر شب برنامه می‌نویسم ولی فردا اجرا نمی‌کنم؛ یا در تست‌زنی زمان کم می‌آورم..."
                  error={errors.mainProblem}
                  hint="بزرگ‌ترین مشکل درسی را توضیح بده."
                />
              </div>

              <div data-field="distractionLevel" className="sm:col-span-2">
                <RangeField
                  label="میزان حواس‌پرتی هنگام مطالعه"
                  value={data.distractionLevel}
                  min={1}
                  max={10}
                  onChange={(value) => set('distractionLevel', value)}
                  rightLabel="کم (۱)"
                  leftLabel="زیاد (۱۰)"
                  hint="از ۱ تا ۱۰؛ هرچه بیشتر، یعنی تمرکزت سریع‌تر از دست می‌رود."
                />
              </div>
            </div>
          ) : null}

          {/* مرحله ۴ */}
          {step === 3 ? (
            <div className="flex flex-col gap-6">
              <div data-field="expectation">
                <TextAreaField
                  name="expectation"
                  label="از این دوره چه انتظاری داری؟"
                  required
                  value={data.expectation}
                  onChange={(e) => set('expectation', e.target.value)}
                  placeholder="مثلاً می‌خواهم ساعت مطالعه‌ام به ۸ ساعت برسد و شیمی را از ۳۰ به ۶۰ درصد برسانم..."
                  error={errors.expectation}
                  hint="انتظارت از دوره را بنویس."
                />
              </div>

              <div data-field="focusAreas">
                <ChipGroupField
                  label="دوست داری اول روی چه بخش‌هایی کار کنیم؟"
                  options={FOCUS_AREAS}
                  selected={data.focusAreas}
                  onToggle={toggleFocus}
                  required
                  max={4}
                  error={errors.focusAreas}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div data-field="planInterest">
                  <SelectField
                    name="planInterest"
                    label="طرح مورد علاقه (اختیاری)"
                    value={data.planInterest ?? ''}
                    onChange={(e) => set('planInterest', e.target.value)}
                    options={PLANS.map((plan) => ({ value: plan.id, label: `${plan.name} — ${toFa(plan.price)} تومان` }))}
                    hint="اگر نمی‌دانی، خالی بگذار تا مشاور پیشنهاد دهد."
                  />
                </div>

                <div data-field="budget">
                  <SelectField
                    name="budget"
                    label="بازه بودجه ماهانه (اختیاری)"
                    value={data.budget ?? ''}
                    onChange={(e) => set('budget', e.target.value)}
                    options={BUDGETS.map((b) => ({ value: b, label: b }))}
                    hint="برای پیشنهاد طرح متناسب با توان خانواده."
                  />
                </div>
              </div>

              <div data-field="contactPreference">
                <RadioGroupField<string>
                  label="روش تماس ترجیحی"
                  required
                  value={data.contactPreference ?? ''}
                  onChange={(value) => set('contactPreference', value)}
                  options={[
                    { value: 'تماس تلفنی', label: 'تماس تلفنی', hint: 'ساعات ۹ تا ۲۱' },
                    { value: 'پیامک', label: 'پیامک', hint: 'ارسال لینک هماهنگی' },
                    { value: 'واتساپ یا تلگرام', label: 'واتساپ / تلگرام', hint: 'پیام صوتی و متنی' },
                    { value: 'تماس با والدین', label: 'تماس با والدین', hint: 'شماره دوم' },
                  ]}
                  error={errors.contactPreference}
                />
              </div>

              <div data-field="note">
                <TextAreaField
                  name="note"
                  label="توضیح تکمیلی (اختیاری)"
                  rows={3}
                  value={data.note ?? ''}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder="هر نکته‌ای که فکر می‌کنی مشاور باید بداند..."
                />
              </div>

              {/* خلاصه */}
              <div className="glass-soft rounded-4xl p-5">
                <p className="mb-3 flex items-center gap-2 text-[0.85rem] font-black text-ink-100">
                  <ClipboardList size={16} className="text-nova-300" />
                  خلاصه درخواست تو
                </p>
                <dl className="grid gap-x-6 gap-y-2.5 text-[0.8rem] sm:grid-cols-2">
                  {[
                    ['نام', data.fullName || '—'],
                    ['شماره تماس', data.mobile ? toFa(data.mobile) : '—'],
                    ['پایه و رشته', `${data.grade || '—'} / ${data.major || '—'}`],
                    ['شهر', data.city || '—'],
                    ['معدل', data.lastGpa || '—'],
                    ['ساعت مطالعه روزانه', data.dailyStudyHours ? `${toFa(data.dailyStudyHours)} ساعت` : '—'],
                    ['هدف', data.goal || '—'],
                    ['اولویت‌ها', data.focusAreas.length ? data.focusAreas.slice(0, 3).join('، ') : '—'],
                  ].map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-3 border-b border-white/6 pb-2">
                      <dt className="shrink-0 text-ink-400">{key}</dt>
                      <dd className="truncate font-bold text-ink-200">{value}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    scrollToTop();
                  }}
                  className="mt-4 text-[0.78rem] font-bold text-nova-300 underline-offset-4 transition-colors hover:underline"
                >
                  ویرایش اطلاعات مرحله‌های قبل
                </button>
              </div>

              <label
                data-field="agreement"
                className={`flex cursor-pointer items-start gap-3 rounded-3xl border p-4 transition-colors ${
                  errors.agreement ? 'border-rose-400/60 bg-rose-400/[0.06]' : 'border-white/10 bg-white/[0.03] hover:border-white/22'
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.agreement}
                  onChange={(e) => set('agreement', e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#ffab2e]"
                />
                <span className="text-[0.82rem] leading-relaxed text-ink-300">
                  با ثبت این فرم، اطلاعات فقط برای بررسی درخواست مشاوره نووا استفاده می‌شود و در اختیار شخص ثالثی قرار
                  نمی‌گیرد. می‌پذیرم که کارشناسان نووا برای هماهنگی با من تماس بگیرند.
                  {errors.agreement ? <span className="mt-1 block font-bold text-rose-400">{errors.agreement}</span> : null}
                </span>
              </label>
            </div>
          ) : null}
        </div>

        {/* ------------------------- پانویس فرم ------------------------- */}
        <footer className="flex flex-col-reverse items-stretch gap-3 border-t border-white/8 bg-space-950/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button type="button" onClick={goPrev} disabled={step === 0} className="btn btn-ghost !px-6 !py-3 text-sm">
            <ArrowRight size={16} />
            قبلی
          </button>

          <p className="text-center text-[0.74rem] text-ink-400 sm:text-start">
            با ثبت این فرم، اطلاعات فقط برای بررسی درخواست مشاوره نووا استفاده می‌شود.
          </p>

          {step === STEPS.length - 1 ? (
            <button type="submit" disabled={submitting} className="btn btn-primary !px-7 !py-3 text-sm">
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
              {submitting ? 'در حال ثبت...' : 'ثبت نهایی درخواست'}
            </button>
          ) : (
            <button type="submit" className="btn btn-primary !px-7 !py-3 text-sm">
              مرحله بعد
              <ArrowLeft size={17} />
            </button>
          )}
        </footer>
      </form>

      {/* ------------------------- ستون کناری ------------------------- */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
        <div className="glass rounded-4xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
            <Sparkles size={17} className="text-nova-300" />
            چرا این فرم چهار مرحله‌ای است؟
          </h3>
          <ul className="flex flex-col gap-3.5 text-[0.83rem] leading-relaxed text-ink-300">
            {[
              'بدون شناخت دقیق، هیچ برنامه‌ای شخصی نمی‌شود؛ این فرم داده اولیه مشاور توست.',
              'سبک زندگی و خواب، سهم واقعی ساعت مطالعه قابل دستیابی را مشخص می‌کند.',
              'اولویت‌ها به مشاور می‌گوید از کدام نقطه ضعف شروع کند تا سریع‌تر نتیجه بگیری.',
              'کمتر از ۵ دقیقه طول می‌کشد و هر لحظه می‌توانی ذخیره‌اش کنی و بعداً ادامه بدهی.',
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-nova-400/15 text-[0.65rem] font-black text-nova-200">
                  {toFa(index + 1)}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-4xl p-6">
          <h3 className="mb-3 text-base font-extrabold text-ink-100">ترجیح می‌دهی حرف بزنی؟</h3>
          <p className="mb-4 text-[0.82rem] leading-relaxed text-ink-300">
            می‌توانی مستقیم تماس بگیری یا در واتساپ پیام بدهی؛ کارشناسان نووا پاسخ می‌دهند.
          </p>
          <div className="flex flex-col gap-2.5">
            <a href={`tel:${SITE.contact.phoneRaw}`} className="btn btn-outline w-full !py-3 text-sm">
              <PhoneCall size={16} />
              <span className="tabular-nums">{SITE.contact.phone}</span>
            </a>
            <a
              href={`https://wa.me/${SITE.contact.mobileRaw.replace('+', '')}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost w-full !py-3 text-sm"
            >
              گفتگو در واتساپ
            </a>
          </div>
          <p className="mt-4 text-[0.72rem] text-ink-400">{SITE.contact.hours}</p>
        </div>

        <div className="glass-soft flex items-center gap-3 rounded-4xl p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-400/15 text-mint-400">
            <CheckCircle2 size={20} />
          </span>
          <p className="text-[0.78rem] leading-relaxed text-ink-300">
            جلسه تعیین سطح و مشاوره اولیه <span className="font-black text-mint-400">کاملاً رایگان</span> است و هیچ
            تعهدی برای خرید ایجاد نمی‌کند.
          </p>
        </div>
      </aside>
    </div>
  );
}
