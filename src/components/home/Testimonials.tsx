import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';
import { Avatar } from '@/components/ui/Avatar';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { toFa } from '@/lib/fa';

export function Testimonials() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="تجربه دانش‌آموزان"
            title="صدای کسانی که این مسیر را با نووا رفته‌اند"
            description="این نظرات را دانش‌آموزان و خانواده‌هایشان بعد از پایان دوره برایمان نوشته‌اند."
            tone="cool"
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <figure className="glass group flex h-full flex-col gap-5 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-nebula-300/30">
                <div className="flex items-center justify-between">
                  <Quote size={26} className="text-nebula-400/45 transition-colors group-hover:text-nebula-300/70" />
                  <span className="flex items-center gap-0.5" aria-label={`امتیاز ${toFa(item.rating)} از ۵`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(item.rating) ? 'text-nova-300' : 'text-white/15'}
                        fill={i < Math.round(item.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </span>
                </div>

                <blockquote className="flex-1 text-[0.88rem] leading-[2.1] text-ink-200">{item.text}</blockquote>

                <figcaption className="flex items-center gap-3 border-t border-white/8 pt-4">
                  <Avatar name={item.name} gradient={item.gradient} size="sm" />
                  <span className="flex flex-col">
                    <span className="text-[0.86rem] font-bold text-ink-100">{item.name}</span>
                    <span className="text-[0.72rem] text-ink-400">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
