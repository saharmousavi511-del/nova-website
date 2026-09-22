import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, PhoneCall, Sparkles } from 'lucide-react';
import { SITE } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';

export function CtaBanner() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="container-nova">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl border border-nova-300/25 bg-gradient-to-br from-space-850 via-space-900 to-space-950 px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <span className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-nova-500/22 blur-[90px]" />
            <span className="pointer-events-none absolute -bottom-28 -start-20 h-80 w-80 rounded-full bg-nebula-500/22 blur-[100px]" />
            <span
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen"
              style={{ backgroundImage: "url('/og-cover.jpg')" }}
              aria-hidden
            />
            <span className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-start">
              <div className="flex max-w-2xl flex-col items-center gap-4 lg:items-start">
                <span className="eyebrow">
                  <Sparkles size={14} />
                  ظرفیت محدود ترم پاییز
                </span>
                <h2 className="text-2xl leading-snug sm:text-3xl lg:text-[2.4rem]">
                  همین حالا به جمع <span className="text-gradient">نوانَوردها</span> اضافه شو
                </h2>
                <p className="max-w-xl text-[0.95rem] leading-loose text-ink-300">
                  برای موفقیت آماده‌ای؟ نگران هزینه نباش. فرم را پر کن تا کارشناسان نووا حداکثر تا ۲۴ ساعت کاری با تو تماس
                  بگیرند و جلسه تعیین سطح رایگان را هماهنگ کنند.
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8rem] text-ink-400 lg:justify-start">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                    بدون پیش‌پرداخت
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-nova-300" />
                    ضمانت بازگشت وجه ۱۴ روزه
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-comet-300" />
                    جلسه اول کاملاً رایگان
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[17rem]">
                <Link to="/register" className="btn btn-primary w-full !py-4 text-[0.98rem]">
                  ثبت‌نام مشاوره رایگان
                  <ArrowLeft size={18} />
                </Link>
                <Link to="/exam" className="btn btn-ghost w-full !py-4 text-[0.95rem]">
                  <ClipboardCheck size={17} className="text-nova-300" />
                  اول یک آزمون بده
                </Link>
                <a href={`tel:${SITE.contact.phoneRaw}`} className="btn btn-outline w-full !py-4 text-[0.95rem]">
                  <PhoneCall size={17} />
                  <span className="tabular-nums">{SITE.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
