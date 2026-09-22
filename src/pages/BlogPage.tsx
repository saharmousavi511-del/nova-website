import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { POSTS, POST_CATEGORIES } from '@/data/posts';
import { faDate, toFa } from '@/lib/fa';

export function BlogPage() {
  const [category, setCategory] = useState<string>('همه');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'بلاگ کنکور نووا | مطالب آموزشی و خبرهای کنکور';
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return POSTS.filter((post) => {
      const byCategory = category === 'همه' || post.category === category;
      const byQuery = !needle || post.title.includes(needle) || post.excerpt.includes(needle) || post.category.includes(needle);
      return byCategory && byQuery;
    });
  }, [category, query]);

  const categories = ['همه', ...POST_CATEGORIES];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'بلاگ' }]}
        eyebrow="مطالب داغ کنکوری"
        title="بلاگ نووا؛ راهنمای عملی کنکور"
        description="تحلیل روش‌های مطالعه، نکات تست‌زنی، قوانین انتخاب رشته و خبرهای مهم کنکور — همه به زبان ساده و بدون حاشیه."
      >
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <span className="chip !py-2">
            <Flame size={13} className="text-nova-300" />
            {toFa(POSTS.length)} مطلب منتشرشده
          </span>
          <span className="chip !py-2">{toFa(POST_CATEGORIES.length)} دسته‌بندی</span>
          <span className="chip !py-2">به‌روزرسانی هفتگی</span>
        </div>
      </PageHeader>

      <section className="pb-24">
        <div className="container-nova flex flex-col gap-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-[0.8rem] font-bold transition-all ${
                    category === item
                      ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                      : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search size={16} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در مطالب..."
                className="field !pe-11"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="glass flex flex-col items-center gap-3 rounded-5xl px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/6 text-ink-400">
                <Search size={22} />
              </span>
              <p className="text-[0.95rem] font-bold text-ink-200">مطلبی با این مشخصات پیدا نشد</p>
              <p className="max-w-md text-[0.82rem] text-ink-400">دسته‌بندی را تغییر بده یا عبارت کوتاه‌تری جستجو کن.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((post, index) => (
                <Reveal key={post.slug} delay={index * 55}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="glass edge-glow group flex h-full flex-col overflow-hidden rounded-5xl transition-all duration-500 hover:-translate-y-1.5"
                  >
                    <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${post.gradient}`}>
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.32),transparent_60%)]" />
                      <post.icon size={64} strokeWidth={1.4} className="relative text-space-950/70 transition-transform duration-700 group-hover:scale-110" />
                      <span className="absolute bottom-3 start-4 rounded-full bg-space-950/70 px-3 py-1 text-[0.68rem] font-bold text-nova-200 backdrop-blur">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <h2 className="line-clamp-2 text-[1.02rem] font-extrabold leading-relaxed text-ink-100 transition-colors group-hover:text-nova-200">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3 flex-1 text-[0.83rem] leading-loose text-ink-300">{post.excerpt}</p>
                      <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3.5 text-[0.72rem] text-ink-400">
                        <span>{faDate(post.date)}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {toFa(post.readMinutes)} دقیقه
                        </span>
                        <ArrowLeft size={14} className="text-nova-300 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
