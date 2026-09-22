import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { RegisterForm } from '@/components/register/RegisterForm';
import { Reveal } from '@/components/ui/Reveal';
import { toFa } from '@/lib/fa';

const TRUST_ITEMS = [
  { icon: Clock, title: 'پاسخ زیر ۲۴ ساعت', text: 'کارشناسان نووا حداکثر تا یک روز کاری تماس می‌گیرند.' },
  { icon: ShieldCheck, title: 'حریم اطلاعات', text: 'اطلاعات تو فقط در اختیار تیم مشاوره خودت قرار می‌گیرد.' },
  { icon: Users, title: 'مشاور هم‌رشته', text: 'مشاورت از همان رشته و همان مسیری است که تو می‌خواهی بروی.' },
  { icon: Sparkles, title: 'جلسه اول رایگان', text: 'تعیین سطح و مشاوره اولیه هیچ هزینه‌ای ندارد.' },
];

export function RegisterPage() {
  const [params] = useSearchParams();
  const plan = params.get('plan') ?? undefined;

  useEffect(() => {
    document.title = 'ثبت‌نام و درخواست مشاوره | نووا';
  }, []);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'ثبت‌نام مشاوره' }]}
        eyebrow="فرم درخواست مشاوره"
        title="اولین قدم، شناخت دقیق توست"
        description="این فرم چهار مرحله‌ای، پایه طراحی برنامه شخصی‌سازی‌شده توست. هر چه دقیق‌تر بنویسی، برنامه‌ای که می‌گیری واقعی‌تر و قابل اجرا‌تر خواهد بود."
      >
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="glass-soft flex items-start gap-3 rounded-3xl p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-nova-400/12 text-nova-200">
                <item.icon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="text-[0.84rem] font-extrabold text-ink-100">{item.title}</span>
                <span className="text-[0.74rem] leading-relaxed text-ink-400">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="pb-24">
        <div className="container-nova">
          <Reveal>
            <RegisterForm initialPlan={plan} />
          </Reveal>

          <p className="mt-8 text-center text-[0.78rem] text-ink-400">
            تا امروز {toFa(3800)} دانش‌آموز از {toFa(240)} شهر با این فرم به نووا پیوسته‌اند.
          </p>
        </div>
      </section>
    </>
  );
}
