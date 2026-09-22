import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { PLANS } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faNumber } from '@/lib/fa';

export function Plans({ limit }: { limit?: number }) {
  const plans = limit ? PLANS.slice(0, limit) : PLANS;

  return (
    <section className="relative py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-nebula-500/10 blur-[110px]" />
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="طرح‌های مشاوره"
            title="چهار طرح، متناسب با هدف و بودجه تو"
            description="هیچ طرحی بهتر از دیگری نیست؛ مناسب‌تر است. همه طرح‌ها با ضمانت بازگشت وجه ۱۴ روزه ارائه می‌شوند."
            action={
              limit ? (
                <Link to="/services" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                  مشاهده همه خدمات
                </Link>
              ) : undefined
            }
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 80}>
              <article
                className={`relative flex h-full flex-col gap-5 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular
                    ? 'border border-nova-300/45 bg-gradient-to-b from-nova-400/[0.14] via-space-900/60 to-space-900/80 shadow-[0_30px_80px_-30px_rgba(255,138,61,0.5)]'
                    : 'glass'
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 start-6 flex items-center gap-1 rounded-full bg-gradient-to-l from-nova-300 to-nova-500 px-3.5 py-1 text-[0.7rem] font-black text-space-950 shadow-lg">
                    <Star size={12} fill="currentColor" />
                    محبوب‌ترین طرح
                  </span>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-3xl ${
                      plan.popular ? 'bg-nova-400/22 text-nova-200' : 'bg-white/6 text-ink-200'
                    }`}
                  >
                    <plan.icon size={22} />
                  </span>
                  <span className="text-[0.64rem] font-black tracking-[0.18em] text-ink-400">{plan.nameEn}</span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-ink-100">{plan.name}</h3>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-ink-300">{plan.tagline}</p>
                </div>

                <div className="rounded-3xl border border-white/8 bg-space-950/50 p-4">
                  <p className="flex items-end gap-1.5">
                    <span className="text-[1.7rem] font-black leading-none text-gradient tabular-nums">{faNumber(plan.price)}</span>
                    <span className="pb-0.5 text-xs text-ink-300">تومان / {plan.priceLabel}</span>
                  </p>
                  <p className="mt-2 text-[0.72rem] text-ink-400">{plan.capacity}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[0.83rem] leading-relaxed text-ink-200">
                      <Check size={15} className={`mt-1.5 shrink-0 ${plan.popular ? 'text-nova-300' : 'text-mint-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 border-t border-white/8 pt-4">
                  <p className="text-[0.72rem] leading-relaxed text-ink-400">
                    <span className="font-bold text-ink-300">مناسب برای: </span>
                    {plan.bestFor}
                  </p>
                  <Link
                    to={`/register?plan=${plan.id}`}
                    className={`btn w-full !py-3 text-sm ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    درخواست این طرح
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
