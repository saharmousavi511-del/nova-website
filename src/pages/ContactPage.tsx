import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SelectField, TextAreaField, TextField } from '@/components/register/Fields';
import { SOCIAL_ICONS } from '@/components/ui/SocialIcons';
import { SITE } from '@/data/site';
import { STORAGE_KEYS, readList, uid, writeList } from '@/lib/storage';
import { isValidMobile, normalizeMobile, toFa } from '@/lib/fa';

interface Message {
  id: string;
  name: string;
  mobile: string;
  subject: string;
  text: string;
  at: string;
}

const SUBJECTS = ['مشاوره و ثبت‌نام', 'پشتیبانی آزمون آنلاین', 'همکاری و تدریس', 'انتخاب رشته', 'پیشنهاد یا انتقاد', 'سایر'];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', subject: '', text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    document.title = 'تماس با نووا | راه‌های ارتباطی';
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = 'نام خودت را بنویس.';
    if (!isValidMobile(form.mobile)) next.mobile = 'شماره موبایل معتبر ۱۱ رقمی وارد کن.';
    if (!form.subject) next.subject = 'موضوع پیام را انتخاب کن.';
    if (form.text.trim().length < 10) next.text = 'پیامت را کمی کامل‌تر بنویس (حداقل ۱۰ نویسه).';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('sending');
    const record: Message = {
      id: uid('msg-'),
      name: form.name.trim(),
      mobile: normalizeMobile(form.mobile),
      subject: form.subject,
      text: form.text.trim(),
      at: new Date().toISOString(),
    };
    const list = readList<Message>(STORAGE_KEYS.messages);
    list.push(record);
    writeList(STORAGE_KEYS.messages, list);
    window.setTimeout(() => {
      setState('sent');
      setForm({ name: '', mobile: '', subject: '', text: '' });
    }, 700);
  };

  const channels = [
    { icon: Phone, title: 'تلفن ثابت', value: SITE.contact.phone, href: `tel:${SITE.contact.phoneRaw}`, note: 'شنبه تا پنجشنبه، ۹ تا ۲۱' },
    { icon: MessageCircle, title: 'واتساپ و تلگرام', value: SITE.contact.whatsapp, href: `https://wa.me/${SITE.contact.mobileRaw.replace('+', '')}`, note: 'پاسخ معمولاً زیر یک ساعت' },
    { icon: Mail, title: 'رایانامه', value: SITE.contact.email, href: `mailto:${SITE.contact.email}`, note: 'برای ارسال مدارک و کارنامه' },
    { icon: Clock, title: 'ساعات پاسخگویی', value: SITE.contact.hours, note: 'در روزهای آزمون، پشتیبانی تا ۲۳ فعال است' },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'تماس با ما' }]}
        eyebrow="ارتباط با نووا"
        title="یک پیام بده؛ بقیه‌اش با ما"
        description="سؤال، ابهام یا حتی یک مشورت کوتاه؟ هر راهی که راحت‌تری انتخاب کن. تیم نووا در ساعات کاری پاسخ می‌دهد و اگر خارج از ساعت پیام بدهی، اول وقت روز بعد جواب می‌گیری."
      />

      <section className="pb-24">
        <div className="container-nova grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* راه‌های ارتباطی */}
          <div className="flex flex-col gap-5">
            {channels.map((channel, index) => (
              <Reveal key={channel.title} delay={index * 60}>
                <div className="glass flex items-start gap-4 rounded-4xl p-5 transition-all duration-400 hover:-translate-y-1 hover:border-nova-300/35">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-nova-300/20 to-nebula-400/20 text-nova-200">
                    <channel.icon size={21} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[0.74rem] font-bold text-ink-400">{channel.title}</span>
                    {channel.href ? (
                      <a href={channel.href} target={channel.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener" className="text-[0.95rem] font-extrabold text-ink-100 transition-colors hover:text-nova-200">
                        {channel.value}
                      </a>
                    ) : (
                      <span className="text-[0.95rem] font-extrabold text-ink-100">{channel.value}</span>
                    )}
                    <span className="mt-1 text-[0.75rem] text-ink-400">{channel.note}</span>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={240}>
              <div className="glass rounded-4xl p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
                  <MapPin size={17} className="text-nova-300" />
                  دفتر نووا
                </h2>
                <p className="text-[0.86rem] leading-loose text-ink-300">{SITE.contact.address}</p>

                <div className="relative mt-5 h-44 overflow-hidden rounded-3xl border border-white/8 bg-space-950/60">
                  <svg viewBox="0 0 400 180" className="h-full w-full" aria-hidden>
                    <defs>
                      <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
                        <path d="M26 0 L0 0 0 26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="400" height="180" fill="url(#grid)" />
                    <path d="M0 120 C 90 100, 150 140, 220 105 S 340 70, 400 95" fill="none" stroke="rgba(139,123,255,0.45)" strokeWidth="3" />
                    <path d="M60 0 C 80 60, 140 90, 150 180" fill="none" stroke="rgba(255,171,46,0.35)" strokeWidth="2.5" />
                    <circle cx="220" cy="105" r="9" fill="#ffab2e" />
                    <circle cx="220" cy="105" r="18" fill="rgba(255,171,46,0.22)">
                      <animate attributeName="r" values="12;26;12" dur="2.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                  <span className="absolute bottom-3 start-4 rounded-full bg-space-950/80 px-3 py-1 text-[0.7rem] font-bold text-nova-200 backdrop-blur">
                    میدان ونک — ملاصدرا
                  </span>
                </div>

                <p className="mt-4 text-[0.76rem] leading-relaxed text-ink-400">
                  مراجعه حضوری فقط با هماهنگی قبلی؛ ظرفیت جلسات حضوری محدود است.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="glass rounded-4xl p-6">
                <h2 className="mb-4 text-base font-extrabold text-ink-100">ما را دنبال کن</h2>
                <div className="flex flex-wrap gap-2.5">
                  {SITE.social.map((item) => {
                    const Icon = SOCIAL_ICONS[item.icon];
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-[0.8rem] font-bold text-ink-200 transition-all hover:-translate-y-0.5 hover:border-nova-300/45 hover:text-nova-200"
                      >
                        <Icon size={16} />
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* فرم تماس */}
          <Reveal delay={100}>
            <div className="glass rounded-5xl p-6 sm:p-8">
              {state === 'sent' ? (
                <div className="flex flex-col items-center gap-4 py-14 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-mint-400/15 text-mint-400">
                    <CheckCircle2 size={38} />
                  </span>
                  <h2 className="text-xl font-black text-ink-100">پیامت رسید</h2>
                  <p className="max-w-md text-[0.9rem] leading-loose text-ink-300">
                    ممنون که نوشتی. تیم نووا در اولین ساعت کاری پاسخ می‌دهد. اگر عجله داری، مستقیم تماس بگیر.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => setState('idle')} className="btn btn-ghost !px-5 !py-2.5 text-sm">
                      ارسال پیام دیگر
                    </button>
                    <Link to="/register" className="btn btn-primary !px-5 !py-2.5 text-sm">
                      ثبت درخواست مشاوره
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                  <div className="mb-1">
                    <h2 className="text-xl font-black text-ink-100">فرم تماس با نووا</h2>
                    <p className="mt-1.5 text-[0.84rem] text-ink-400">
                      این فرم برای پرسش‌های کوتاه است. برای شروع مشاوره، فرم چهارمرحله‌ای ثبت‌نام را پر کن.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div data-field="name">
                      <TextField
                        label="نام و نام خانوادگی"
                        required
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        placeholder="مثلاً علی رضایی"
                        error={errors.name}
                      />
                    </div>
                    <div data-field="mobile">
                      <TextField
                        label="شماره تماس"
                        required
                        value={form.mobile}
                        onChange={(e) => {
                          setForm({ ...form, mobile: e.target.value });
                          setErrors((prev) => ({ ...prev, mobile: '' }));
                        }}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        dir="ltr"
                        className="text-start tabular-nums"
                        inputMode="tel"
                        error={errors.mobile}
                      />
                    </div>
                  </div>

                  <div data-field="subject">
                    <SelectField
                      label="موضوع پیام"
                      required
                      value={form.subject}
                      onChange={(e) => {
                        setForm({ ...form, subject: e.target.value });
                        setErrors((prev) => ({ ...prev, subject: '' }));
                      }}
                      options={SUBJECTS.map((s) => ({ value: s, label: s }))}
                      error={errors.subject}
                    />
                  </div>

                  <div data-field="text">
                    <TextAreaField
                      label="متن پیام"
                      required
                      rows={6}
                      value={form.text}
                      onChange={(e) => {
                        setForm({ ...form, text: e.target.value });
                        setErrors((prev) => ({ ...prev, text: '' }));
                      }}
                      placeholder="پیامت را بنویس..."
                      error={errors.text}
                      hint={`تاکنون ${toFa(form.text.trim().length)} نویسه نوشته‌ای.`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5">
                    <p className="text-[0.76rem] text-ink-400">
                      با ارسال پیام، اجازه می‌دهی تیم نووا برای پاسخ با تو تماس بگیرد.
                    </p>
                    <button type="submit" disabled={state === 'sending'} className="btn btn-primary !px-7 !py-3 text-sm">
                      {state === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      ارسال پیام
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
