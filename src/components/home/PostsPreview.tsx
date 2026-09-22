import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame } from 'lucide-react';
import { POSTS } from '@/data/posts';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faDate, toFa } from '@/lib/fa';

export function PostsPreview() {
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p.slug !== featured.slug).slice(0, 4);

  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="مطالب داغ کنکوری"
            title="به‌روزترین تحلیل‌ها و راهنماهای کنکور"
            description="هرچه را درباره برنامه‌ریزی، تست‌زنی، امتحان نهایی و انتخاب رشته لازم داری، اینجا ساده و کاربردی نوشته‌ایم."
            action={
              <Link to="/blog" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                <Flame size={16} className="text-nova-300" />
                همه مطالب
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="glass edge-glow group flex h-full flex-col overflow-hidden rounded-5xl transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${featured.gradient} sm:h-64`}>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                <featured.icon size={92} strokeWidth={1.3} className="relative text-space-950/70 transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute bottom-4 start-5 rounded-full bg-space-950/70 px-3 py-1 text-[0.72rem] font-bold text-nova-200 backdrop-blur">
                  {featured.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-xl font-extrabold leading-relaxed text-ink-100 transition-colors group-hover:text-nova-200">
                  {featured.title}
                </h3>
                <p className="flex-1 text-[0.88rem] leading-loose text-ink-300">{featured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 border-t border-white/8 pt-4 text-[0.74rem] text-ink-400">
                  <span>{faDate(featured.date)}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {toFa(featured.readMinutes)} دقیقه مطالعه
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-nova-300">
                    {featured.author}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-4">
            {rest.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="glass group flex items-center gap-4 rounded-4xl p-4 transition-all duration-400 hover:-translate-y-1 hover:border-nova-300/30"
                >
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ${post.gradient} p-3 text-space-950`}>
                    <post.icon size={22} strokeWidth={2.1} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2 text-[0.7rem] font-bold text-nova-300">
                      {post.category}
                      <span className="h-1 w-1 rounded-full bg-white/25" />
                      <span className="text-ink-400">{faDate(post.date)}</span>
                    </span>
                    <span className="line-clamp-2 text-[0.9rem] font-bold leading-relaxed text-ink-100 transition-colors group-hover:text-nova-200">
                      {post.title}
                    </span>
                  </span>
                  <ArrowLeft size={17} className="shrink-0 text-ink-400 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-nova-200" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
