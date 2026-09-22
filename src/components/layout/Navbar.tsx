import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ClipboardCheck, Menu, Phone, X } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/data/site';
import { daysUntil, toFa } from '@/lib/fa';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const days = daysUntil(new Date(SITE.konkurDate.year, SITE.konkurDate.month - 1, SITE.konkurDate.day));

  return (
    <>
      {/* نوار اطلاع‌رسانی بالایی */}
      <div className="relative z-50 hidden border-b border-white/8 bg-space-950/80 text-[0.76rem] text-ink-300 backdrop-blur md:block">
        <div className="container-nova flex h-10 items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint-400" />
            تا {SITE.konkurDate.label}
            <span className="font-black text-nova-300">{toFa(days)}</span>
            روز باقی مانده است
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${SITE.contact.phoneRaw}`} className="flex items-center gap-1.5 transition-colors hover:text-nova-200">
              <Phone size={13} />
              <span className="tabular-nums">{SITE.contact.phone}</span>
            </a>
            <span className="hidden h-3 w-px bg-white/15 lg:block" />
            <span className="hidden lg:inline">{SITE.contact.hours}</span>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/10 bg-space-950/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="container-nova flex h-[4.6rem] items-center justify-between gap-4">
          <Link to="/" className="shrink-0" aria-label="صفحه اصلی نووا">
            <Logo size={scrolled ? 38 : 42} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-[0.86rem] font-bold transition-colors ${
                      isActive ? 'text-nova-200' : 'text-ink-300 hover:text-ink-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-l from-nova-300 to-nebula-400 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link to="/exam" className="btn btn-ghost hidden !px-4 !py-2 text-[0.82rem] md:inline-flex">
              <ClipboardCheck size={16} />
              آزمون آنلاین
            </Link>
            <Link to="/register" className="btn btn-primary !px-5 !py-2.5 text-[0.85rem]">
              ثبت‌نام مشاوره
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/5 text-ink-100 transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* منوی موبایل */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-space-950/80 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          style={{ transform: open ? 'translateX(0)' : 'translateX(-105%)' }}
          className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col gap-6 border-s border-white/10 bg-space-900/95 p-6 shadow-2xl shadow-black/60 transition-transform duration-500 ease-out"
        >
          <div className="flex items-center justify-between">
            <Logo size={38} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن منو"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-ink-200"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-bold transition-colors ${
                      isActive ? 'bg-nova-400/12 text-nova-200' : 'text-ink-200 hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                  <span className="text-xs text-ink-400">←</span>
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-bold transition-colors ${
                    isActive ? 'bg-nova-400/12 text-nova-200' : 'text-ink-200 hover:bg-white/5'
                  }`
                }
              >
                تماس با ما
                <span className="text-xs text-ink-400">←</span>
              </NavLink>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <Link to="/register" className="btn btn-primary w-full !py-3">
              ثبت‌نام مشاوره
            </Link>
            <Link to="/exam" className="btn btn-ghost w-full !py-3">
              <ClipboardCheck size={17} />
              ورود به آزمون آنلاین
            </Link>
            <a href={`tel:${SITE.contact.phoneRaw}`} className="text-center text-sm text-ink-300">
              تماس مستقیم: <span className="tabular-nums text-nova-200">{SITE.contact.phone}</span>
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
