import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircleQuestion, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { FAQS } from '@/data/faqs';
import { SITE } from '@/data/site';
import { toFa } from '@/lib/fa';

const CATEGORIES = ['همه', 'مشاوره', 'ثبت‌نام', 'آزمون آنلاین', 'هزینه', 'انتخاب رشته'] as const;

export function FaqPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('همه');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'پرسش‌های متداول | نووا';
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return FAQS.filter((faq) => {
      const byCategory = category === 'همه' || faq.category === category;
      const byQuery = !needle || faq.q.includes(needle) || faq.a.includes(needle);
      return byCategory && byQuery;
    });
  }, [category, query]);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'پرسش‌های متداول' }]}
        eyebrow="پرسش‌های متداول"
        title="هر چه قبل از شروع باید بدانی"
        description="پرسش‌هایی که خانواده‌ها و دانش‌آموزان بیشتر از همه می‌پرسند، با پاسخ‌های صریح و بدون ابهام."
      >
        <div className="mt-2 flex flex-wrap gap-2.5">
          {CATEGORIES.slice(1).map((item) => (
            <span key={item} className="chip !py-1.5">
              {item}
              <span className="text-ink-400">({toFa(FAQS.filter((f) => f.category === item).length)})</span>
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="pb-24">
        <div className="container-nova grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <div className="glass rounded-4xl p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
                <Search size={17} className="text-nova-300" />
                جستجو در پرسش‌ها
              </h2>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثلاً نمره منفی، بازگشت وجه، ظرفیت..."
                className="field"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-3.5 py-1.5 text-[0.76rem] font-bold transition-all ${
                      category === item
                        ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                        : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-4xl p-6">
              <span className="grid h-12 w-12 place-items-center rounded-3xl bg-nebula-400/15 text-nebula-300">
                <MessageCircleQuestion size={22} />
              </span>
              <h2 className="mt-4 text-base font-extrabold text-ink-100">پاسخت را پیدا نکردی؟</h2>
              <p className="mt-2 text-[0.84rem] leading-loose text-ink-300">
                سؤالت را بنویس؛ کارشناسان نووا معمولاً زیر یک ساعت در ساعات کاری پاسخ می‌دهند.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link to="/contact" className="btn btn-primary w-full !py-3 text-sm">
                  فرم تماس
                  <ArrowLeft size={15} />
                </Link>
                <a href={`tel:${SITE.contact.phoneRaw}`} className="btn btn-ghost w-full !py-3 text-sm tabular-nums">
                  {SITE.contact.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {filtered.length === 0 ? (
              <div className="glass flex flex-col items-center gap-3 rounded-5xl px-6 py-16 text-center">
                <p className="text-[0.95rem] font-bold text-ink-200">پرسشی با این مشخصات پیدا نشد</p>
                <p className="max-w-md text-[0.82rem] text-ink-400">عبارت کوتاه‌تری جستجو کن یا دسته‌بندی را تغییر بده.</p>
              </div>
            ) : (
              <Reveal>
                <Accordion items={filtered.map((faq) => ({ q: faq.q, a: faq.a, tag: faq.category }))} defaultOpen={0} />
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
