import { Link } from 'react-router-dom';
import { MessageCircleQuestion } from 'lucide-react';
import { FAQS } from '@/data/faqs';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function FaqPreview({ limit = 5 }: { limit?: number }) {
  const items = FAQS.slice(0, limit).map((faq) => ({ q: faq.q, a: faq.a, tag: faq.category }));

  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Reveal>
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-28">
            <SectionHeading
              align="start"
              eyebrow="پرسش‌های متداول"
              title="هر چه می‌خواهی بدانی، قبل از ثبت‌نام"
              description="اگر پاسخت را اینجا پیدا نکردی، مستقیم به ما پیام بده؛ کارشناسان نووا معمولاً زیر یک ساعت جواب می‌دهند."
            />
            <div className="flex flex-wrap gap-3">
              <Link to="/faq" className="btn btn-ghost !px-5 !py-3 text-sm">
                <MessageCircleQuestion size={17} className="text-nova-300" />
                همه پرسش‌ها
              </Link>
              <Link to="/contact" className="btn btn-outline !px-5 !py-3 text-sm">
                پرسش خودت را بپرس
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
