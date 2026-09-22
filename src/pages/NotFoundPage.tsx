import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { NAV_LINKS } from '@/data/site';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'صفحه پیدا نشد | نووا';
  }, []);

  return (
    <section className="relative flex min-h-[70vh] items-center py-20">
      <span className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-nebula-500/12 blur-[110px]" />
      <div className="container-nova flex flex-col items-center gap-7 text-center">
        <p className="text-[6.5rem] font-black leading-none text-gradient sm:text-[9rem]">۴۰۴</p>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-black text-ink-100 sm:text-3xl">این ستاره در کهکشان ما پیدا نشد</h1>
          <p className="max-w-xl text-[0.95rem] leading-loose text-ink-300">
            صفحه‌ای که دنبالش بودی وجود ندارد یا جابه‌جا شده است. از مسیرهای زیر ادامه بده؛ یا مستقیم برو سر اصل مطلب:
            آزمون آنلاین و ثبت‌نام مشاوره.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary !px-6 !py-3 text-sm">
            <Home size={16} />
            بازگشت به خانه
          </Link>
          <Link to="/exam" className="btn btn-ghost !px-6 !py-3 text-sm">
            <Search size={16} />
            آزمون آنلاین
          </Link>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="chip !py-2 transition-colors hover:border-nova-300/40 hover:text-nova-200">
                {link.label}
                <ArrowLeft size={12} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
