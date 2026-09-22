import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  CircleAlert,
  IdCard,
  Layers,
  ListChecks,
  ShieldAlert,
  Timer,
  UserRound,
} from 'lucide-react';
import type { Exam } from '@/data/exams';
import { examQuestionCount, examSubjects, examTotalMinutes } from '@/data/exams';
import { findRegistration } from '@/lib/api';
import { toFa } from '@/lib/fa';
import { TextField, SelectField } from '@/components/register/Fields';
import type { Candidate } from './ExamRunner';

const MAJOR_OPTIONS = ['تجربی', 'ریاضی', 'انسانی', 'هنر', 'زبان', 'پشت کنکور'];

interface ExamGateProps {
  exam: Exam;
  initialCode?: string;
  onStart: (candidate: Candidate) => void;
  onBack: () => void;
}

export function ExamGate({ exam, initialCode = '', onStart, onBack }: ExamGateProps) {
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [errors, setErrors] = useState<{ code?: string; name?: string; major?: string }>({});
  const [matched, setMatched] = useState<string | null>(null);

  useEffect(() => {
    if (code.trim().length < 4) {
      setMatched(null);
      return;
    }
    const registration = findRegistration(code);
    if (registration) {
      setMatched(registration.fullName);
      setName((prev) => prev || registration.fullName);
      setMajor((prev) => prev || registration.major || '');
    } else {
      setMatched(null);
    }
  }, [code]);

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (code.trim().length < 4) nextErrors.code = 'کد داوطلبی حداقل ۴ کاراکتر است (مثل NOVA-4F72K).';
    if (!name.trim()) nextErrors.name = 'نام و نام خانوادگی را وارد کن تا کارنامه به نام خودت صادر شود.';
    if (!major) nextErrors.major = 'رشته یا وضعیت تحصیلی‌ات را انتخاب کن.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onStart({ code: code.trim().toUpperCase(), name: name.trim(), major });
  };

  const totalQuestions = examQuestionCount(exam);
  const totalMinutes = examTotalMinutes(exam);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      {/* ------------------------------ معرفی دفترچه ------------------------------ */}
      <section className="glass overflow-hidden rounded-5xl">
        <div className={`relative flex items-center gap-4 bg-gradient-to-br ${exam.gradient} p-6 text-space-950`}>
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.4),transparent_60%)]" />
          <span className="relative grid h-14 w-14 place-items-center rounded-3xl bg-space-950/15">
            <exam.icon size={26} strokeWidth={2.1} />
          </span>
          <div className="relative">
            <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] opacity-70">{exam.level}</span>
            <h2 className="text-lg font-black leading-snug sm:text-xl">{exam.title}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-7">
          <p className="text-[0.88rem] leading-loose text-ink-300">{exam.description}</p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'تعداد سؤال‌ها', value: toFa(totalQuestions), icon: ListChecks },
              { label: 'زمان کل', value: `${toFa(totalMinutes)} دقیقه`, icon: Timer },
              { label: 'تعداد دفترچه‌ها', value: toFa(exam.stages.length), icon: Layers },
            ].map((item) => (
              <div key={item.label} className="glass-soft flex flex-col items-center gap-1 rounded-3xl p-4 text-center">
                <item.icon size={17} className="text-nova-300" />
                <span className="text-[1.05rem] font-black text-ink-100">{item.value}</span>
                <span className="text-[0.66rem] text-ink-400">{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-[0.92rem] font-extrabold text-ink-100">
              <ClipboardCheck size={17} className="text-nova-300" />
              دفترچه‌های این آزمون
            </h3>
            <ul className="flex flex-col gap-2.5">
              {exam.stages.map((stage, index) => (
                <li key={stage.id} className="glass-soft flex items-start gap-3 rounded-3xl p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-nova-400/15 text-[0.76rem] font-black text-nova-200">
                    {toFa(index + 1)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[0.85rem] font-bold text-ink-100">{stage.title}</span>
                    <span className="text-[0.74rem] text-ink-400">{stage.subtitle}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {stage.quota.map((quota) => (
                        <span key={quota.subject} className="chip !px-2 !py-0.5 !text-[0.66rem]">
                          {quota.label ?? quota.subject}: {toFa(quota.count)} سؤال
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="ms-auto shrink-0 text-[0.72rem] font-black tabular-nums text-comet-300">
                    {toFa(stage.minutes)} دقیقه
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {examSubjects(exam).map((subject) => (
              <span key={subject} className="chip">
                {subject}
              </span>
            ))}
          </div>

          <p className="text-[0.78rem] leading-relaxed text-ink-400">
            <span className="font-bold text-ink-300">مناسب برای: </span>
            {exam.recommendedFor}
          </p>
        </div>
      </section>

      {/* ------------------------------ ورود به داوطلب ------------------------------ */}
      <section className="flex flex-col gap-5">
        <div className="glass rounded-5xl p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-3xl bg-nebula-400/15 text-nebula-300">
              <IdCard size={22} />
            </span>
            <div>
              <h2 className="text-lg font-black text-ink-100">ورود به داوطلب</h2>
              <p className="text-[0.8rem] text-ink-400">جهت شروع، کد داوطلبی خود را وارد نمایید.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div data-field="code">
              <TextField
                label="کد داوطلبی"
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErrors((prev) => ({ ...prev, code: undefined }));
                }}
                placeholder="NOVA-4F72K"
                dir="ltr"
                className="text-start font-bold tracking-[0.1em] tabular-nums"
                error={errors.code}
                hint={
                  matched ? (
                    <span className="flex items-center gap-1.5 font-bold text-mint-400">
                      <BadgeCheck size={13} />
                      پرونده «{matched}» در نووا پیدا شد
                    </span>
                  ) : (
                    'اگر فرم ثبت‌نام پر کرده‌ای، کد رهگیری همان کد داوطلبی توست. در غیر این صورت می‌توانی یک کد دلخواه (مثل نام خانوادگی) وارد کنی.'
                  )
                }
              />
            </div>

            <div data-field="name">
              <TextField
                label="نام و نام خانوادگی"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="مثلاً زهرا محمدی"
                error={errors.name}
                hint="کارنامه به همین نام صادر می‌شود."
              />
            </div>

            <div data-field="major">
              <SelectField
                label="رشته / وضعیت تحصیلی"
                required
                value={major}
                onChange={(e) => {
                  setMajor(e.target.value);
                  setErrors((prev) => ({ ...prev, major: undefined }));
                }}
                options={MAJOR_OPTIONS.map((m) => ({ value: m, label: m }))}
                error={errors.major}
                hint="برای مقایسه نتیجه با جامعه آماری هم‌رشته‌ای‌ها."
              />
            </div>

            <div className="glass-soft flex items-start gap-3 rounded-3xl p-4">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-nova-300" />
              <p className="text-[0.78rem] leading-loose text-ink-300">
                با کلیک روی «شروع آزمون»، زمان‌سنج محاسبه خواهد شد و دیگر قابل توقف نیست. آزمون را در جایی شروع کن که تا
                پایان، تمرکز و اینترنت پایدار داری.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={submit} className="btn btn-primary flex-1 !px-6 !py-3.5 text-[0.92rem]">
                <Timer size={17} />
                شروع آزمون
              </button>
              <button type="button" onClick={onBack} className="btn btn-ghost !px-5 !py-3.5 text-[0.92rem]">
                <ArrowRight size={16} />
                بازگشت به آزمون‌ها
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-5xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-[0.95rem] font-extrabold text-ink-100">
            <CircleAlert size={17} className="text-rose-400" />
            قوانین آزمون آنلاین نووا
          </h3>
          <ul className="flex flex-col gap-3 text-[0.82rem] leading-relaxed text-ink-300">
            {[
              'تایمر هر دفترچه جداگانه است و با پایان زمان، همان مرحله به‌صورت خودکار ثبت می‌شود.',
              'پس از «ثبت و مرحله بعد»، بازگشت به سؤال‌های مرحله قبل ممکن نیست.',
              'نمره منفی اعمال می‌شود: هر ۳ پاسخ غلط، یک پاسخ درست را از بین می‌برد.',
              'سؤالات نشان‌دار شده را می‌توانی تا پیش از ثبت همان مرحله بازبینی کنی.',
              'کارنامه نهایی شامل درصد درس‌به‌درس، تراز تقریبی و پاسخ تشریحی همه سؤالات است.',
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nova-400" />
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4 text-[0.76rem] text-ink-400">
            <CalendarClock size={15} className="text-comet-300" />
            نتیجه این آزمون در پرونده داوطلبی تو ذخیره می‌شود و مشاور می‌تواند آن را ببیند.
          </div>
        </div>

        <div className="glass-soft flex items-center justify-between gap-4 rounded-4xl p-5">
          <div className="flex items-center gap-3">
            <UserRound size={20} className="text-nebula-300" />
            <p className="text-[0.8rem] leading-relaxed text-ink-300">
              هنوز کد داوطلبی نداری؟ با ثبت فرم مشاوره، هم کد می‌گیری هم جلسه تعیین سطح رایگان.
            </p>
          </div>
          <Link to="/register" className="btn btn-outline shrink-0 !px-4 !py-2 text-xs">
            ثبت‌نام
            <ArrowLeft size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
