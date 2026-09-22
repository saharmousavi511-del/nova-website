import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, PenLine, Quote, Share2, Sparkles, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { getPost, getRelatedPosts, type Block } from '@/data/posts';
import { NotFoundPage } from './NotFoundPage';
import { faDate, toFa } from '@/lib/fa';

function BlockView({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case 'p':
      return <p className="mt-5 text-[0.98rem] leading-[2.35] text-ink-200">{block.text}</p>;
    case 'h2':
      return (
        <h2 className="mt-12 mb-2 flex items-start gap-3 text-xl font-black leading-snug text-ink-100 sm:text-2xl">
          <span className="mt-2.5 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-nova-300 to-nebula-400" />
          {block.text}
        </h2>
      );
    case 'h3':
      return <h3 className="mt-8 mb-1 text-lg font-extrabold text-nova-200">{block.text}</h3>;
    case 'ul':
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.94rem] leading-[2.1] text-ink-200">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-nova-400" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mt-5 flex flex-col gap-3.5">
          {block.items.map((item, itemIndex) => (
            <li key={item} className="flex items-start gap-3.5 text-[0.94rem] leading-[2.1] text-ink-200">
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-nova-300/25 to-nebula-400/25 text-[0.74rem] font-black text-nova-200">
                {toFa(itemIndex + 1)}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="relative mt-8 overflow-hidden rounded-4xl border border-nebula-300/25 bg-nebula-400/[0.07] p-6 sm:p-7">
          <Quote size={26} className="mb-2 text-nebula-300/70" />
          <p className="text-[1rem] font-bold leading-loose text-ink-100">«{block.text}»</p>
          {block.by ? <footer className="mt-3 text-[0.8rem] font-bold text-nebula-300">— {block.by}</footer> : null}
        </blockquote>
      );
    case 'note':
      return (
        <aside
          key={`note-${index}`}
          className="mt-8 flex items-start gap-3.5 rounded-4xl border border-nova-300/30 bg-nova-400/[0.08] p-5 sm:p-6"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-nova-400/18 text-nova-200">
            <Sparkles size={18} />
          </span>
          <p className="text-[0.92rem] leading-loose text-ink-100">{block.text}</p>
        </aside>
      );
    default:
      return null;
  }
}

export function PostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | بلاگ نووا`;
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  if (!post) return <NotFoundPage />;

  const related = getRelatedPosts(post.slug, 3);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[55] h-1 bg-transparent">
        <div className="h-full bg-gradient-to-l from-nova-300 to-nebula-400 transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <PageHeader
        breadcrumb={[{ label: 'بلاگ', to: '/blog' }, { label: post.category }]}
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      >
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-ink-400">
          <span className="flex items-center gap-2">
            <UserRound size={14} className="text-nova-300" />
            {post.author}
          </span>
          <span>{faDate(post.date)}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-comet-300" />
            {toFa(post.readMinutes)} دقیقه مطالعه
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="flex items-center gap-1.5 transition-colors hover:text-nova-200"
          >
            <Share2 size={14} />
            کپی پیوند مطلب
          </button>
        </div>
      </PageHeader>

      <section className="pb-20">
        <div className="container-nova grid gap-8 lg:grid-cols-[1.55fr_0.45fr] lg:items-start">
          <Reveal>
            <article className="glass rounded-5xl p-6 sm:p-9">
              <div className={`mb-8 flex h-48 items-center justify-center rounded-4xl bg-gradient-to-br ${post.gradient} sm:h-60`}>
                <post.icon size={92} strokeWidth={1.2} className="text-space-950/65" />
              </div>

              {post.content.map((block, index) => (
                <BlockView key={index} block={block} index={index} />
              ))}

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[0.86rem] text-ink-300">
                  این مطلب را مفید دیدی؟ آن را برای دوست کنکوری‌ات بفرست.
                </p>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="btn btn-ghost !px-4 !py-2 text-xs"
                  >
                    <Share2 size={14} />
                    اشتراک پیوند
                  </button>
                  <Link to="/blog" className="btn btn-outline !px-4 !py-2 text-xs">
                    مطالب بیشتر
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
            <div className="glass rounded-4xl p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-nova-300/25 to-nebula-400/25 text-nova-200">
                  <PenLine size={20} />
                </span>
                <div>
                  <p className="text-[0.9rem] font-extrabold text-ink-100">{post.author}</p>
                  <p className="text-[0.74rem] text-ink-400">تیم آموزشی نووا</p>
                </div>
              </div>
              <p className="mt-4 text-[0.82rem] leading-loose text-ink-300">
                این مطلب بر اساس تجربه واقعی مشاوران نووا و تحلیل کارنامه صدها دانش‌آموز نوشته شده است. اگر سؤال خاصی
                داری، در جلسه تعیین سطح رایگان می‌توانی مستقیم بپرسی.
              </p>
              <Link to="/register" className="btn btn-primary mt-5 w-full !py-3 text-sm">
                دریافت مشاوره رایگان
                <ArrowLeft size={15} />
              </Link>
            </div>

            <div className="glass rounded-4xl p-6">
              <h2 className="mb-4 text-[0.95rem] font-extrabold text-ink-100">مطالب مرتبط</h2>
              <ul className="flex flex-col gap-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/blog/${item.slug}`} className="group flex items-start gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${item.gradient} p-2.5 text-space-950`}>
                        <item.icon size={17} strokeWidth={2.2} />
                      </span>
                      <span className="flex flex-col">
                        <span className="line-clamp-2 text-[0.82rem] font-bold leading-relaxed text-ink-200 transition-colors group-hover:text-nova-200">
                          {item.title}
                        </span>
                        <span className="mt-0.5 text-[0.68rem] text-ink-400">{item.category}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-soft rounded-4xl p-6 text-center">
              <p className="text-[0.86rem] font-bold text-ink-100">اول یک آزمون بده، بعد برنامه بگیر</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-400">
                آزمون‌های آنلاین نووا رایگان‌اند و کارنامه درس‌به‌درس با پاسخ تشریحی می‌دهند.
              </p>
              <Link to="/exam" className="btn btn-nebula mt-4 w-full !py-2.5 text-sm">
                ورود به آزمون آنلاین
              </Link>
            </div>

            <Link to="/blog" className="flex items-center justify-center gap-2 text-[0.82rem] font-bold text-ink-400 transition-colors hover:text-nova-200">
              <ArrowRight size={15} />
              بازگشت به همه مطالب
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
