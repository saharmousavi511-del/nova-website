import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ServicesPreview() {
  return (
    <section id="services" className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="خدمات نووا"
            title="همه چیزی که برای یک سال کنکور لازم داری"
            description="از برنامه‌ریزی و تحلیل آزمون تا امتحان نهایی و انتخاب رشته؛ نووا در هر ایستگاه این مسیر کنار توست."
            action={
              <Link to="/services" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                جزئیات خدمات
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 70}>
              <article className="glass group flex h-full flex-col gap-4 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-nova-300/30">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-space-700 to-space-850 text-nova-200 ring-1 ring-white/10 transition-all duration-500 group-hover:from-nova-300/25 group-hover:to-nebula-400/25">
                    <service.icon size={21} />
                  </span>
                  <h3 className="text-[1.05rem] font-extrabold leading-snug text-ink-100">{service.title}</h3>
                </div>
                <p className="text-[0.87rem] leading-loose text-ink-300">{service.text}</p>
                <ul className="mt-auto flex flex-col gap-2 border-t border-white/8 pt-4">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[0.8rem] text-ink-200">
                      <Check size={14} className="mt-1.5 shrink-0 text-mint-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
