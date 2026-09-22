import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, ClipboardCheck, Flame, ShieldCheck, Sparkles, Star, Timer, TrendingUp } from 'lucide-react';
import { Countdown } from '@/components/ui/Countdown';
import { SITE } from '@/data/site';
import { FA_WEEKDAYS, faDate, toFa } from '@/lib/fa';

const TASKS = [
  { subject: 'زیست‌شناسی', topic: 'فصل ۳ — گوارش و جذب مواد', minutes: 90, done: true },
  { subject: 'شیمی', topic: 'تست اسید و باز (۴۰ تست)', minutes: 60, done: true },
  { subject: 'ریاضی', topic: 'مرور حد و پیوستگی', minutes: 45, done: false },
  { subject: 'فیزیک', topic: 'شبیه‌ساز الکتریسیته ساکن', minutes: 30, done: false },
];

const CITIES = [
  'تهران',
  'مشهد',
  'اصفهان',
  'شیراز',
  'تبریز',
  'کرج',
  'اهواز',
  'قم',
  'کرمانشاه',
  'ارومیه',
  'رشت',
  'زاهدان',
  'کرمان',
  'همدان',
  'یزد',
  'اردبیل',
  'بندرعباس',
  'سنندج',
];

export function Hero() {
  const doneCount = TASKS.filter((t) => t.done).length;
  const totalMinutes = TASKS.reduce((s, t) => s + t.minutes, 0);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* حلقه‌های مداری تزئینی */}
      <div className="pointer-events-none absolute -top-40 start-[-18rem] h-[42rem] w-[42rem] opacity-40">
        <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-white/10" />
        <div className="absolute inset-16 animate-spin-slow rounded-full border border-nova-400/15" />
        <div className="absolute inset-32 rounded-full border border-nebula-400/20" />
      </div>
      <div className="pointer-events-none absolute -bottom-56 end-[-14rem] h-[36rem] w-[36rem] rounded-full bg-nebula-500/12 blur-[110px]" />
      <div className="pointer-events-none absolute end-1/3 top-0 h-72 w-72 rounded-full bg-nova-500/12 blur-[90px]" />

      <div className="container-nova grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        {/* ----------------------------- سمت متن ----------------------------- */}
        <div className="relative flex flex-col items-start gap-7">
          <span className="eyebrow animate-rise">
            <Sparkles size={14} />
            گروه مشاوره تخصصی کنکور سراسری
          </span>

          <h1 className="animate-rise text-[2.1rem] leading-[1.45] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.35]" style={{ animationDelay: '80ms' }}>
            رتبه برتر شدن، تصادفی نیست؛
            <br />
            <span className="text-gradient">یک انفجارِ برنامه‌ریزی‌شده است</span>
          </h1>

          <p className="max-w-xl animate-rise text-[0.98rem] leading-[2.1] text-ink-300 sm:text-lg" style={{ animationDelay: '160ms' }}>
            نووا تیمی از رتبه‌های برتر کنکور است که مسیرت را از امروز تا روز آزمون روشن می‌کند: برنامه شخصی‌سازی‌شده،
            گزارش‌گیری روزانه، تحلیل کارنامه و آزمون‌های آنلاین شبیه‌ساز — همه در یک کهکشان.
          </p>

          <div className="flex animate-rise flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
            <Link to="/register" className="btn btn-primary !px-7 !py-3.5 text-[0.95rem]">
              ثبت‌نام مشاوره رایگان
              <ArrowLeft size={18} />
            </Link>
            <Link to="/exam" className="btn btn-ghost !px-6 !py-3.5 text-[0.95rem]">
              <ClipboardCheck size={18} className="text-nova-300" />
              آزمون تعیین سطح آنلاین
            </Link>
          </div>

          <ul className="flex animate-rise flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem] text-ink-300" style={{ animationDelay: '300ms' }}>
            {[
              { icon: BadgeCheck, text: 'مشاوران همگی رتبه برتر کنکور' },
              { icon: ShieldCheck, text: 'ضمانت بازگشت وجه ۱۴ روزه' },
              { icon: Flame, text: `${toFa(3800)} دانش‌آموز همراه‌شده` },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-1.5">
                <item.icon size={15} className="text-mint-400" />
                {item.text}
              </li>
            ))}
          </ul>

          <div className="glass animate-rise flex w-full flex-col gap-4 rounded-4xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" style={{ animationDelay: '380ms' }}>
            <div className="flex flex-col gap-1">
              <span className="text-[0.72rem] font-bold text-ink-400">شمارش معکوس</span>
              <span className="text-sm font-extrabold text-ink-100">{SITE.konkurDate.label}</span>
            </div>
            <Countdown />
          </div>
        </div>

        {/* ---------------------------- سمت تصویر ---------------------------- */}
        <div className="relative animate-rise" style={{ animationDelay: '200ms' }}>
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-nova-400/18 via-transparent to-nebula-500/22 blur-3xl" />

          {/* کارت اصلی: برنامه امروز */}
          <div className="glass edge-glow relative rounded-5xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <p className="text-[0.7rem] text-ink-400">پنل دانش‌آموز نووا</p>
                <h3 className="text-lg font-extrabold text-ink-100">برنامه امروز</h3>
              </div>
              <span className="chip !border-nova-300/35 !bg-nova-400/12 !text-nova-200">
                <Star size={12} />
                {`${FA_WEEKDAYS[new Date().getDay()]} ${faDate()}`}
              </span>
            </div>

            <ul className="flex flex-col gap-3 py-5">
              {TASKS.map((task, index) => (
                <li
                  key={task.subject}
                  className={`flex items-center gap-3 rounded-3xl border p-3 transition-colors ${
                    task.done ? 'border-mint-400/25 bg-mint-400/[0.06]' : 'border-white/8 bg-white/[0.03]'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-xs font-black ${
                      task.done ? 'bg-mint-400/18 text-mint-400' : 'bg-white/8 text-ink-300'
                    }`}
                  >
                    {task.done ? '✓' : toFa(index + 1)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[0.88rem] font-bold text-ink-100">{task.subject}</span>
                    <span className="truncate text-[0.74rem] text-ink-400">{task.topic}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[0.74rem] font-bold text-ink-300">
                    <Timer size={13} className="text-nova-300" />
                    <span className="tabular-nums">{toFa(task.minutes)}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[0.76rem] text-ink-300">
                <span>پیشرفت امروز</span>
                <span className="font-bold text-ink-100">
                  {toFa(doneCount)} از {toFa(TASKS.length)} بلوک — {toFa(totalMinutes)} دقیقه
                </span>
              </div>
              <div className="progress-track h-2">
                <div className="progress-bar" style={{ width: `${(doneCount / TASKS.length) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="chip !text-mint-400">گزارش شبانه ارسال شد</span>
                <span className="text-[0.72rem] text-ink-400">مشاور: آرش کیانی</span>
              </div>
            </div>
          </div>

          {/* کارت شناور تراز */}
          <div className="glass absolute -top-6 -start-4 hidden animate-float rounded-3xl p-4 sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-nebula-400/18 text-nebula-300">
                <TrendingUp size={19} />
              </span>
              <div className="flex flex-col">
                <span className="text-[0.66rem] text-ink-400">تراز آخرین آزمون</span>
                <span className="text-base font-black tabular-nums text-ink-100">{toFa(7240)}</span>
              </div>
              <span className="chip !border-mint-400/35 !bg-mint-400/12 !text-mint-400">+۳۴۰</span>
            </div>
            <svg viewBox="0 0 120 34" className="mt-3 h-8 w-32" aria-hidden>
              <defs>
                <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b7bff" />
                  <stop offset="100%" stopColor="#ffab2e" />
                </linearGradient>
              </defs>
              <path d="M2 28 L18 24 L34 26 L50 17 L66 19 L82 10 L98 12 L118 4" fill="none" stroke="url(#spark)" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>

          {/* کارت شناور آزمون */}
          <div className="glass absolute -bottom-7 -end-3 hidden animate-float-slow rounded-3xl p-4 sm:block">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-nova-400/18 text-nova-300">
                <Timer size={20} />
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-nova-400/25" />
              </span>
              <div className="flex flex-col">
                <span className="text-[0.66rem] text-ink-400">آزمون آنلاین در جریان</span>
                <span className="text-lg font-black tabular-nums text-nova-200">۱۴:۳۲</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نوار شهرها */}
      <div className="mt-20 overflow-hidden border-y border-white/8 bg-white/[0.02] py-3.5 lg:mt-24">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
          {[...CITIES, ...CITIES].map((city, index) => (
            <span key={`${city}-${index}`} className="flex items-center gap-8 text-[0.82rem] font-bold text-ink-400">
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="text-nova-400/70" />
                دانش‌آموزان نووا در {city}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
