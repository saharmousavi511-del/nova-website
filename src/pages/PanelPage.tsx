import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ClipboardList,
  Database,
  Download,
  FileSpreadsheet,
  Inbox,
  Mail,
  Phone,
  Send,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { deleteExamResult, deleteRegistration, getExamResults, getRegistrations, updateRegistrationStatus } from '@/lib/api';
import { STORAGE_KEYS, readList } from '@/lib/storage';
import type { ExamResult, Registration } from '@/lib/types';
import { faDateTime, faPercent, toEn, toFa } from '@/lib/fa';

interface MessageRow {
  id: string;
  name: string;
  mobile: string;
  subject: string;
  text: string;
  at: string;
}

interface Subscriber {
  mobile: string;
  at: string;
}

type Tab = 'registrations' | 'results' | 'messages' | 'newsletter';

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'registrations', label: 'درخواست‌های مشاوره', icon: Users },
  { id: 'results', label: 'کارنامه آزمون‌ها', icon: Trophy },
  { id: 'messages', label: 'پیام‌های تماس', icon: Inbox },
  { id: 'newsletter', label: 'اعضای اطلاع‌رسانی', icon: Send },
];

const STATUSES: Registration['status'][] = ['جدید', 'بررسی‌شده', 'هماهنگ‌شده', 'بایگانی'];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (value: string | number) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = rows.map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PanelPage() {
  const [tab, setTab] = useState<Tab>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'داشبورد نووا | مدیریت درخواست‌ها و کارنامه‌ها';
  }, []);

  const refresh = () => {
    setRegistrations(getRegistrations());
    setResults(getExamResults());
    setMessages(readList<MessageRow>(STORAGE_KEYS.messages));
    setSubscribers(readList<Subscriber>(STORAGE_KEYS.newsletter));
  };

  useEffect(refresh, []);

  const stats = useMemo(
    () => [
      { label: 'درخواست مشاوره', value: registrations.length, icon: Users, color: 'text-nova-200', bg: 'bg-nova-400/12' },
      { label: 'کارنامه صادرشده', value: results.length, icon: Trophy, color: 'text-mint-400', bg: 'bg-mint-400/12' },
      { label: 'پیام تماس', value: messages.length, icon: Inbox, color: 'text-nebula-300', bg: 'bg-nebula-400/12' },
      { label: 'عضو اطلاع‌رسانی', value: subscribers.length, icon: Send, color: 'text-comet-300', bg: 'bg-comet-400/12' },
    ],
    [registrations.length, results.length, messages.length, subscribers.length],
  );

  const averagePercent = results.length ? results.reduce((s, r) => s + r.percent, 0) / results.length : 0;
  const newRegistrations = registrations.filter((r) => r.status === 'جدید').length;

  const exportRegistrations = () =>
    downloadCsv('nova-registrations.csv', [
      ['کد رهگیری', 'نام', 'موبایل', 'موبایل والدین', 'شهر', 'پایه', 'رشته', 'معدل', 'ساعت مطالعه', 'هدف', 'درس قوی', 'درس ضعیف', 'مشکل اصلی', 'اولویت‌ها', 'طرح', 'وضعیت', 'تاریخ'],
      ...registrations.map((r) => [
        r.trackingCode,
        r.fullName,
        r.mobile,
        r.parentMobile,
        r.city,
        r.grade,
        r.major,
        r.lastGpa,
        r.dailyStudyHours,
        r.goal,
        r.strongSubjects,
        r.weakSubjects,
        r.mainProblem,
        r.focusAreas.join(' | '),
        r.planInterest ?? '',
        r.status,
        new Date(r.createdAt).toLocaleString('fa-IR'),
      ]),
    ]);

  const exportResults = () =>
    downloadCsv('nova-exam-results.csv', [
      ['شناسه', 'کد داوطلبی', 'نام', 'آزمون', 'درصد کل', 'تراز', 'سطح', 'درست', 'غلط', 'نزده', 'زمان (ثانیه)', 'تاریخ'],
      ...results.map((r) => [
        r.id,
        r.candidateCode,
        r.candidateName,
        r.examTitle,
        r.percent.toFixed(1),
        r.score,
        r.level,
        r.correct,
        r.wrong,
        r.blank,
        r.totalSeconds,
        new Date(r.createdAt).toLocaleString('fa-IR'),
      ]),
    ]);

  const exportMessages = () =>
    downloadCsv('nova-messages.csv', [
      ['نام', 'موبایل', 'موضوع', 'متن', 'تاریخ'],
      ...messages.map((m) => [m.name, m.mobile, m.subject, m.text, new Date(m.at).toLocaleString('fa-IR')]),
    ]);

  const list = TABS.find((t) => t.id === tab)!;
  const isEmpty =
    (tab === 'registrations' && registrations.length === 0) ||
    (tab === 'results' && results.length === 0) ||
    (tab === 'messages' && messages.length === 0) ||
    (tab === 'newsletter' && subscribers.length === 0);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'داشبورد نووا' }]}
        eyebrow="داشبورد داخلی"
        title="مدیریت درخواست‌ها و کارنامه‌ها"
        description="این صفحه داده‌های ثبت‌شده در همین مرورگر را نشان می‌دهد: درخواست‌های مشاوره، کارنامه آزمون‌ها، پیام‌های فرم تماس و اعضای اطلاع‌رسانی. برای اتصال به یک پایگاه داده مرکزی، متغیر VITE_SUBMISSIONS_URL را در فایل .env تنظیم کن."
      >
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="glass-soft flex items-center gap-3 rounded-3xl p-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon size={19} />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-black leading-none tabular-nums text-ink-100">{toFa(item.value)}</span>
                <span className="mt-1 text-[0.74rem] text-ink-400">{item.label}</span>
              </span>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="pb-24">
        <div className="container-nova flex flex-col gap-5">
          <Reveal>
            <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-4xl p-4 sm:p-5">
              <div className="flex flex-wrap gap-2">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-bold transition-all ${
                      tab === item.id
                        ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                        : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={refresh} className="btn btn-ghost !px-4 !py-2 text-xs">
                  <Database size={14} />
                  تازه‌سازی
                </button>
                {tab === 'registrations' && registrations.length ? (
                  <button type="button" onClick={exportRegistrations} className="btn btn-outline !px-4 !py-2 text-xs">
                    <FileSpreadsheet size={14} />
                    خروجی CSV
                  </button>
                ) : null}
                {tab === 'results' && results.length ? (
                  <button type="button" onClick={exportResults} className="btn btn-outline !px-4 !py-2 text-xs">
                    <FileSpreadsheet size={14} />
                    خروجی CSV
                  </button>
                ) : null}
                {tab === 'messages' && messages.length ? (
                  <button type="button" onClick={exportMessages} className="btn btn-outline !px-4 !py-2 text-xs">
                    <FileSpreadsheet size={14} />
                    خروجی CSV
                  </button>
                ) : null}
              </div>
            </div>
          </Reveal>

          {tab === 'registrations' && newRegistrations > 0 ? (
            <div className="glass-soft flex items-center gap-3 rounded-4xl border-nova-300/25 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-nova-400/15 text-nova-200">
                <ClipboardList size={18} />
              </span>
              <p className="text-[0.84rem] text-ink-300">
                <span className="font-black text-nova-200">{toFa(newRegistrations)}</span> درخواست تازه در انتظار بررسی است.
                میانگین درصد آزمون‌های ثبت‌شده: <span className="font-black text-ink-100">{faPercent(averagePercent)}</span>
              </p>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="glass flex flex-col items-center gap-4 rounded-5xl px-6 py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-white/6 text-ink-400">
                <Database size={26} />
              </span>
              <div>
                <p className="text-[1rem] font-bold text-ink-200">هنوز داده‌ای در «{list.label}» ثبت نشده است</p>
                <p className="mt-2 max-w-lg text-[0.84rem] leading-loose text-ink-400">
                  داده‌ها در حافظه همین مرورگر (localStorage) ذخیره می‌شوند. یک فرم ثبت‌نام یا یک آزمون آنلاین انجام بده تا
                  نتیجه‌اش اینجا ظاهر شود.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register" className="btn btn-primary !px-5 !py-2.5 text-sm">
                  پر کردن فرم ثبت‌نام
                </Link>
                <Link to="/exam" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                  انجام آزمون آنلاین
                </Link>
              </div>
            </div>
          ) : null}

          {/* درخواست‌ها */}
          {tab === 'registrations' && registrations.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {registrations.map((item) => {
                const open = openId === item.id;
                return (
                  <li key={item.id} className="glass overflow-hidden rounded-4xl">
                    <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-nova-400/12 text-[0.68rem] font-black text-nova-200">
                        {item.trackingCode.slice(-4)}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[0.95rem] font-extrabold text-ink-100">{item.fullName}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.74rem] text-ink-400">
                          <span className="flex items-center gap-1">
                            <Phone size={11} />
                            <span dir="ltr" className="tabular-nums">
                              {toFa(item.mobile)}
                            </span>
                          </span>
                          <span>
                            {item.city} — {item.grade} {item.major}
                          </span>
                          <span>{faDateTime(new Date(item.createdAt))}</span>
                        </span>
                      </div>
                      <span
                        dir="ltr"
                        className="hidden shrink-0 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.7rem] font-black tracking-wider text-ink-300 sm:block"
                      >
                        {item.trackingCode}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => {
                          updateRegistrationStatus(item.id, e.target.value as Registration['status']);
                          refresh();
                        }}
                        className="field !w-auto !rounded-2xl !py-2 !text-[0.78rem]"
                        aria-label="وضعیت درخواست"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <div className="flex shrink-0 items-center gap-2">
                        <a href={`tel:${toEn(item.mobile)}`} className="btn btn-ghost !px-3 !py-2" aria-label="تماس">
                          <Phone size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            deleteRegistration(item.id);
                            refresh();
                          }}
                          className="btn btn-ghost !px-3 !py-2 hover:!border-rose-400/40 hover:!text-rose-400"
                          aria-label="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button type="button" onClick={() => setOpenId(open ? null : item.id)} className="btn btn-ghost !px-3 !py-2" aria-label="جزئیات">
                          <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {open ? (
                      <div className="animate-rise border-t border-white/8 bg-space-950/40 p-5">
                        <dl className="grid gap-x-6 gap-y-3 text-[0.82rem] sm:grid-cols-2 lg:grid-cols-3">
                          {[
                            ['معدل سال گذشته', item.lastGpa],
                            ['ساعت مطالعه روزانه', item.dailyStudyHours],
                            ['هدف و رشته موردنظر', item.goal],
                            ['آخرین تراز یا رتبه', item.lastExamScore || '—'],
                            ['درس‌های قوی', item.strongSubjects],
                            ['درس‌های ضعیف', item.weakSubjects],
                            ['نوع مدرسه', item.schoolType || '—'],
                            ['ساعت خواب', item.sleepTime],
                            ['ساعت بیداری', item.wakeTime],
                            ['استفاده از موبایل', item.phoneUsage],
                            ['حواس‌پرتی (از ۱۰)', toFa(item.distractionLevel)],
                            ['شماره والدین', toFa(item.parentMobile)],
                            ['رایانامه', item.email || '—'],
                            ['روش تماس ترجیحی', item.contactPreference || '—'],
                            ['طرح مورد علاقه', item.planInterest || '—'],
                            ['بازه بودجه', item.budget || '—'],
                          ].map(([key, value]) => (
                            <div key={key} className="flex items-start justify-between gap-3 border-b border-white/6 pb-2">
                              <dt className="shrink-0 text-ink-400">{key}</dt>
                              <dd className="text-end font-bold text-ink-200">{value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-5 grid gap-3 lg:grid-cols-2">
                          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                            <p className="text-[0.76rem] font-black text-nova-200">بزرگ‌ترین مشکل درسی</p>
                            <p className="mt-1.5 text-[0.84rem] leading-loose text-ink-300">{item.mainProblem}</p>
                          </div>
                          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                            <p className="text-[0.76rem] font-black text-nova-200">انتظار از دوره</p>
                            <p className="mt-1.5 text-[0.84rem] leading-loose text-ink-300">{item.expectation}</p>
                          </div>
                          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 lg:col-span-2">
                            <p className="text-[0.76rem] font-black text-nova-200">اولویت‌های انتخاب‌شده</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.focusAreas.map((area) => (
                                <span key={area} className="chip">
                                  {area}
                                </span>
                              ))}
                            </div>
                            {item.note ? <p className="mt-3 text-[0.82rem] leading-loose text-ink-300">{item.note}</p> : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}

          {/* کارنامه‌ها */}
          {tab === 'results' && results.length > 0 ? (
            <ul className="grid gap-3 lg:grid-cols-2">
              {results.map((item) => (
                <li key={item.id} className="glass flex items-center gap-4 rounded-4xl p-4">
                  <span
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl text-[0.8rem] font-black tabular-nums ${
                      item.percent >= 55 ? 'bg-mint-400/18 text-mint-400' : item.percent >= 30 ? 'bg-nova-400/18 text-nova-200' : 'bg-rose-400/18 text-rose-400'
                    }`}
                  >
                    {faPercent(item.percent, 0)}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[0.9rem] font-bold text-ink-100">{item.examTitle}</span>
                    <span className="truncate text-[0.74rem] text-ink-400">
                      {item.candidateName} — <span dir="ltr">{item.candidateCode}</span> — {faDateTime(new Date(item.createdAt))}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      <span className="chip !px-2 !py-0.5 !text-[0.66rem]">تراز {toFa(item.score)}</span>
                      <span className="chip !px-2 !py-0.5 !text-[0.66rem]">{item.level}</span>
                      <span className="chip !px-2 !py-0.5 !text-[0.66rem]">
                        درست {toFa(item.correct)} / غلط {toFa(item.wrong)} / نزده {toFa(item.blank)}
                      </span>
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <Link to={`/exam/${item.examId}?result=${item.id}`} className="btn btn-ghost !px-3 !py-2 text-xs">
                      کارنامه
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        deleteExamResult(item.id);
                        refresh();
                      }}
                      className="btn btn-ghost !px-3 !py-2 hover:!border-rose-400/40 hover:!text-rose-400"
                      aria-label="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {/* پیام‌ها */}
          {tab === 'messages' && messages.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {messages.map((item) => (
                <li key={item.id} className="glass rounded-4xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[0.92rem] font-extrabold text-ink-100">{item.name}</span>
                    <span className="chip">{item.subject}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-ink-400">
                    <a href={`tel:${toEn(item.mobile)}`} className="flex items-center gap-1.5 transition-colors hover:text-nova-200">
                      <Phone size={12} />
                      <span dir="ltr" className="tabular-nums">
                        {toFa(item.mobile)}
                      </span>
                    </a>
                    <span>{faDateTime(new Date(item.at))}</span>
                  </div>
                  <p className="mt-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-[0.86rem] leading-loose text-ink-300">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {/* خبرنامه */}
          {tab === 'newsletter' && subscribers.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subscribers.map((item) => (
                <li key={item.mobile} className="glass-soft flex items-center gap-3 rounded-3xl p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-comet-400/12 text-comet-300">
                    <Mail size={17} />
                  </span>
                  <span className="flex flex-col">
                    <span dir="ltr" className="text-[0.88rem] font-bold tabular-nums text-ink-100">
                      {toFa(item.mobile)}
                    </span>
                    <span className="text-[0.72rem] text-ink-400">{faDateTime(new Date(item.at))}</span>
                  </span>
                  <a href={`https://wa.me/${toEn(item.mobile).replace(/^0/, '98')}`} className="btn btn-ghost ms-auto !px-3 !py-2" aria-label="پیام">
                    <Download size={14} className="rotate-90" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  );
}
