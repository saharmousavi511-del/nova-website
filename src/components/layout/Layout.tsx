import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StarField } from '@/components/ui/StarField';
import { SITE } from '@/data/site';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { PageLoader } from '@/components/ui/PageLoader';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="no-print fixed bottom-5 start-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${SITE.contact.mobileRaw.replace('+', '')}`}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex h-13 w-13 items-center gap-2 rounded-full bg-mint-400/15 p-3.5 text-mint-400 shadow-lg shadow-black/40 ring-1 ring-mint-400/30 backdrop-blur transition-all hover:bg-mint-400/25"
        aria-label="گفتگو در واتساپ"
        title="مشاوره سریع در واتساپ"
      >
        <WhatsAppIcon size={22} />
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="بازگشت به بالا"
        className={`grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-space-900/85 text-ink-200 shadow-lg shadow-black/40 backdrop-blur transition-all duration-300 hover:text-nova-200 ${
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}

export function Layout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <StarField />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
