import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Check, CircleHelp, PhoneCall, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { PLANS, ROADMAP, SERVICES } from '@/data/services';
import { FAQS } from '@/data/faqs';
import { SITE } from '@/data/site';
import { faNumber, toFa } from '@/lib/fa';

const INCLUDED = [
  'جلسه تعیین سطح و شناخت هدف (رایگان)',
  'دسترسی به پنل برنامه و گزارش‌گیری روزانه',
  'بانک آزمون‌های آنلاین شبیه‌ساز',
  'ضمانت بازگشت وجه تا ۱۴ روز',
  'امکان ارتقا یا تغییر طرح در طول دوره',
  'پشتیبانی در روز کنکور و زمان انتخاب رشته',
];

export function ServicesPage() {
  useEffect(() => {
    document.title = 'مشاوره کنکور و طرح‌های نووا | خدمات و هزینه‌ها';
  }, []);

  const faqItems = FAQS.filter((f) => f.category === 'مشاوره' || f.category === 'هزینه').map((f) => ({ q: f.q, a: f.a, tag: f.category }));

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'مشاوره کنکور' }]}
        eyebrow="خدمات و طرح‌های نووا"
        title="مشاوره کنکور نووا؛ نقشه‌ای که برای تو کشیده می‌شود"
        description="ما بسته‌های آماده نمی‌فروشیم. هر طرح یک چارچوب است که با داده‌های واقعی تو — پایه، رشته، معدل، ساعت آزاد و نقطه ضعف‌ها — پر می‌شود."
      >
        <div className="mt-2 flex flex-wrap gap-2.5">
          {INCLUDED.map((item) => (
            <span key={item} className="chip !py-1.5">
              <BadgeCheck size={13} className="text-mint-400" />
              {item}
            </span>
          ))}
        </div>
      </PageHeader>

      {/* خدمات */}
      <section className="pb-20">
        <div className="container-nova grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 60}>
              <article className="glass edge-glow flex h-full flex-col gap-4 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5">
                <span className="grid h-13 w-13 place-items-center rounded-3xl bg-gradient-to-br from-nova-300/20 to-nebula-400/20 p-3.5 text-nova-200">
                  <service.icon size={23} />
                </span>
                <h2 className="text-lg font-extrabold text-ink-100">{service.title}</h2>
                <p className="text-[0.88rem] leading-loose text-ink-300">{service.text}</p>
                <ul className="mt-auto flex flex-col gap-2 border-t border-white/8 pt-4">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[0.82rem] text-ink-200">
                      <Check size={14} className="mt-1.5 shrink-0 text-mint-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn btn-ghost mt-2 w-full !py-2.5 text-sm">
                  درخواست این خدمت
                  <ArrowLeft size={15} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* مقایسه طرح‌ها */}
      <section className="pb-20 lg:pb-28">
        <div className="container-nova flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="طرح‌ها و هزینه‌ها"
              title="کدام طرح برای تو مناسب‌تر است؟"
              description="قیمت‌ها ماهانه و به تومان است. پرداخت سه‌ماهه و شش‌ماهه با تخفیف ۵ تا ۱۲ درصد امکان‌پذیر است."
            />
          </Reveal>

          <Reveal>
            <div className="glass overflow-hidden rounded-5xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] border-collapse text-start text-[0.84rem]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                      <th className="px-5 py-4 text-start font-black text-ink-300">امکانات</th>
                      {PLANS.map((plan) => (
                        <th key={plan.id} className="px-4 py-4 text-center">
                          <span className={`block text-[0.92rem] font-black ${plan.popular ? 'text-nova-200' : 'text-ink-100'}`}>{plan.name}</span>
                          <span className="mt-1 block text-[0.7rem] font-bold tabular-nums text-ink-400">{faNumber(plan.price)} تومان</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'برنامه هفتگی شخصی‌سازی‌شده', values: [true, true, true, true] },
                      { label: 'چک‌لیست و گزارش روزانه', values: [true, true, true, true] },
                      { label: 'تماس منظم با مشاور', values: ['—', 'هفتگی', 'روزانه', 'ماهانه'] },
                      { label: 'بازخورد صوتی روزانه', values: [false, true, true, false] },
                      { label: 'تحلیل کامل کارنامه آزمون', values: ['خلاصه', true, true, false] },
                      { label: 'آزمون آنلاین شبیه‌ساز', values: ['۲ در ماه', 'نامحدود', 'نامحدود', 'شبیه‌ساز نهایی'] },
                      { label: 'برنامه موازی امتحان نهایی', values: [false, true, true, true] },
                      { label: 'منتور درسی تخصصی', values: [false, false, '۲ درس', false] },
                      { label: 'جلسه با خانواده', values: [false, 'ماهانه', 'هفتگی', 'ماهانه'] },
                      { label: 'انتخاب رشته تخصصی', values: [false, 'با تخفیف', true, '—'] },
                      { label: 'ضمانت بازگشت وجه', values: ['۱۴ روز', '۱۴ روز', '۶۰ روز', '۱۴ روز'] },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-white/6 transition-colors hover:bg-white/[0.025]">
                        <td className="px-5 py-3.5 font-bold text-ink-200">{row.label}</td>
                        {row.values.map((value, index) => (
                          <td key={index} className="px-4 py-3.5 text-center text-ink-300">
                            {value === true ? (
                              <Check size={17} className="mx-auto text-mint-400" />
                            ) : value === false ? (
                              <span className="text-ink-400">—</span>
                            ) : (
                              <span className="text-[0.78rem] font-bold text-ink-200">{value as string}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-5 py-5 font-black text-ink-100">شروع همکاری</td>
                      {PLANS.map((plan) => (
                        <td key={plan.id} className="px-4 py-5 text-center">
                          <Link to={`/register?plan=${plan.id}`} className={`btn ${plan.popular ? 'btn-primary' : 'btn-ghost'} !px-4 !py-2 text-xs`}>
                            انتخاب
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="glass flex flex-col items-start gap-4 rounded-4xl p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CircleHelp size={20} className="mt-1 shrink-0 text-nova-300" />
                <p className="max-w-2xl text-[0.88rem] leading-loose text-ink-300">
                  نمی‌دانی کدام طرح را انتخاب کنی؟ لازم نیست الان تصمیم بگیری. فرم را پر کن تا مشاور بعد از دیدن
                  وضعیت درسی‌ات، مناسب‌ترین طرح را پیشنهاد دهد — بدون هیچ هزینه‌ای.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto">
                <Link to="/register" className="btn btn-primary !px-6 !py-3 text-sm">
                  <Sparkles size={16} />
                  دریافت پیشنهاد رایگان
                </Link>
                <a href={`tel:${SITE.contact.phoneRaw}`} className="btn btn-ghost !px-6 !py-3 text-sm">
                  <PhoneCall size={16} />
                  <span className="tabular-nums">{SITE.contact.phone}</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* مسیر همکاری */}
      <section className="pb-20 lg:pb-28">
        <div className="container-nova flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="فرایند همکاری" title="از فرم تا روز کنکور" tone="cool" />
          </Reveal>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ROADMAP.map((step, index) => (
              <Reveal key={step.step} delay={index * 60} as="li">
                <div className="glass flex h-full items-start gap-4 rounded-4xl p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-space-700 to-space-850 text-sm font-black text-nova-200 ring-1 ring-white/10">
                    {toFa(index + 1)}
                  </span>
                  <div>
                    <h3 className="text-[0.98rem] font-extrabold text-ink-100">{step.title}</h3>
                    <p className="mt-1.5 text-[0.84rem] leading-loose text-ink-300">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* پرسش‌ها */}
      <section className="pb-24">
        <div className="container-nova grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading align="start" eyebrow="پرسش‌های متداول" title="پرسش‌های مشاوره و هزینه" />
          </Reveal>
          <Reveal delay={100}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
