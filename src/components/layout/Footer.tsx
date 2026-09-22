import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { SITE } from '@/data/site';
import { POSTS } from '@/data/posts';
import { SOCIAL_ICONS } from '@/components/ui/SocialIcons';
import { Logo } from '@/components/ui/Logo';
import { STORAGE_KEYS, readList, writeList } from '@/lib/storage';
import { isValidMobile, normalizeMobile, toFa } from '@/lib/fa';

export function Footer() {
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'error'>('idle');

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizeMobile(mobile);
    if (!isValidMobile(normalized)) {
      setState('error');
      return;
    }
    const list = readList<{ mobile: string; at: string }>(STORAGE_KEYS.newsletter);
    if (!list.some((item) => item.mobile === normalized)) {
      list.push({ mobile: normalized, at: new Date().toISOString() });
      writeList(STORAGE_KEYS.newsletter, list);
    }
    setState('ok');
    setMobile('');
  };

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-space-950/70 pt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-l from-transparent via-nova-400/50 to-transparent" />

      <div className="container-nova grid gap-12 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Logo size={46} />
          <p className="max-w-sm text-sm leading-loose text-ink-300">{SITE.description}</p>
          <div className="flex items-center gap-2.5">
            {SITE.social.map((item) => {
              const Icon = SOCIAL_ICONS[item.icon];
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={`${item.label} — ${item.handle}`}
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-ink-300 transition-all duration-300 hover:-translate-y-1 hover:border-nova-300/50 hover:text-nova-200"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
          <div className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-400/15 text-mint-400">
              <CheckCircle2 size={18} />
            </span>
            <p className="text-xs leading-relaxed text-ink-300">
              نماد اعتماد و ضمانت بازگشت وجه تا ۱۴ روز
              <br />
              <span className="text-ink-400">برای همه طرح‌های مشاوره نووا</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-ink-100">دسترسی سریع</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-300">
            {[
              { to: '/services', label: 'طرح‌های مشاوره کنکور' },
              { to: '/consultants', label: 'مشاوران نووا' },
              { to: '/toppers', label: 'کارنامه رتبه‌برترها' },
              { to: '/exam', label: 'آزمون آنلاین' },
              { to: '/register', label: 'فرم ثبت‌نام' },
              { to: '/about', label: 'درباره نووا' },
              { to: '/contact', label: 'تماس با ما' },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="group inline-flex items-center gap-2 transition-colors hover:text-nova-200">
                  <span className="h-1 w-1 rounded-full bg-nova-400/60 transition-all group-hover:w-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-ink-100">تازه‌ترین مطالب</h3>
          <ul className="flex flex-col gap-3 text-sm">
            {POSTS.slice(0, 4).map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="group flex flex-col gap-1">
                  <span className="line-clamp-2 leading-relaxed text-ink-300 transition-colors group-hover:text-nova-200">{post.title}</span>
                  <span className="text-[0.7rem] text-ink-400">{post.category}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/blog" className="text-sm font-bold text-nova-300 transition-colors hover:text-nova-200">
            همه مطالب ←
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-base font-extrabold text-ink-100">ارتباط با نووا</h3>
          <ul className="flex flex-col gap-3 text-sm text-ink-300">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-1.5 shrink-0 text-nova-300" />
              <span className="flex flex-col">
                <a href={`tel:${SITE.contact.phoneRaw}`} className="tabular-nums transition-colors hover:text-nova-200">
                  {SITE.contact.phone}
                </a>
                <a href={`tel:${SITE.contact.mobileRaw}`} className="tabular-nums transition-colors hover:text-nova-200">
                  {SITE.contact.mobile}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-1.5 shrink-0 text-nova-300" />
              <a href={`mailto:${SITE.contact.email}`} dir="ltr" className="transition-colors hover:text-nova-200">
                {SITE.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-1.5 shrink-0 text-nova-300" />
              <span>{SITE.contact.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-1.5 shrink-0 text-nova-300" />
              <span>{SITE.contact.hours}</span>
            </li>
          </ul>

          <form onSubmit={subscribe} className="glass flex flex-col gap-3 rounded-3xl p-4">
            <label htmlFor="newsletter" className="text-xs font-bold text-ink-200">
              عضویت در اطلاع‌رسانی آزمون‌ها و مهلت‌های کنکور
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setState('idle');
                }}
                inputMode="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className={`field !rounded-2xl !py-2.5 text-sm ${state === 'error' ? 'field-error' : ''}`}
              />
              <button type="submit" className="btn btn-primary !rounded-2xl !px-4" aria-label="عضویت">
                <Send size={16} />
              </button>
            </div>
            {state === 'ok' ? <p className="text-xs font-bold text-mint-400">عضو شدی! قبل از هر آزمون پیامک می‌گیری.</p> : null}
            {state === 'error' ? <p className="error-text !mt-0">شماره موبایل معتبر ۱۱ رقمی وارد کن.</p> : null}
            <p className="text-[0.68rem] text-ink-400">شماره تو فقط برای اطلاع‌رسانی آزمون‌های نووا استفاده می‌شود.</p>
          </form>
        </div>
      </div>

      <div className="divider-galaxy" />

      <div className="container-nova flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-400 sm:flex-row">
        <p>
          © {toFa(1405)} همه حقوق برای گروه مشاوره <span className="font-bold text-ink-200">نووا</span> محفوظ است.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/panel" className="transition-colors hover:text-nova-200">
            داشبورد نووا
          </Link>
          <span className="h-3 w-px bg-white/15" />
          <Link to="/faq" className="transition-colors hover:text-nova-200">
            پرسش‌های متداول
          </Link>
          <span className="h-3 w-px bg-white/15" />
          <span>ساخته‌شده با ♥ برای کنکوری‌ها</span>
        </div>
      </div>
    </footer>
  );
}
