import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, GraduationCap, Microscope, Palette, Scale } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const FIELDS = [
  { icon: Microscope, label: 'تجربی', color: 'text-mint-400', bg: 'bg-mint-400/12' },
  { icon: Compass, label: 'ریاضی', color: 'text-comet-300', bg: 'bg-comet-300/12' },
  { icon: Scale, label: 'انسانی', color: 'text-nebula-300', bg: 'bg-nebula-300/12' },
  { icon: Palette, label: 'هنر', color: 'text-rose-400', bg: 'bg-rose-400/12' },
];

export function MatchBanner() {
  return (
    <section className="relative py-10 lg:py-16">
      <div className="container-nova">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-5xl p-7 sm:p-10">
            <span className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-nebula-500/20 blur-[80px]" />
            <span className="pointer-events-none absolute -bottom-20 start-1/4 h-52 w-52 rounded-full bg-nova-500/15 blur-[80px]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="flex flex-col items-start gap-4">
                <span className="eyebrow !border-nebula-300/30 !bg-nebula-400/10 !text-nebula-300">
                  <GraduationCap size={14} />
                  نوا‌مچ — تست انتخاب رشته
                </span>
                <h2 className="text-2xl leading-snug sm:text-3xl">
                  کدام رشته برای <span className="text-gradient-cool">تو</span> ساخته شده؟
                </h2>
                <p className="max-w-xl text-[0.92rem] leading-loose text-ink-300">
                  چند دقیقه وقت بگذار و به هشت پرسش ساده پاسخ بده. اینجا جواب درست و غلطی وجود ندارد؛ هدف این است که
                  ببینیم علایق، توانمندی‌ها و سبک زندگی تو با کدام گروه آزمایشی و چه رشته‌هایی هم‌خوانی بیشتری دارد.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {FIELDS.map((field) => (
                    <span key={field.label} className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-[0.8rem] font-bold ${field.bg} ${field.color}`}>
                      <field.icon size={15} />
                      {field.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <div className="glass-soft w-full rounded-4xl p-5 text-center lg:max-w-xs">
                  <p className="text-[0.7rem] font-bold text-ink-400">زمان تقریبی</p>
                  <p className="text-3xl font-black text-ink-100">۶ دقیقه</p>
                  <div className="divider-galaxy my-4" />
                  <p className="text-[0.7rem] font-bold text-ink-400">تعداد پرسش</p>
                  <p className="text-3xl font-black text-ink-100">۸ پرسش</p>
                  <div className="divider-galaxy my-4" />
                  <p className="text-[0.72rem] leading-relaxed text-ink-400">کاملاً رایگان و بدون ثبت‌نام</p>
                </div>
                <Link to="/match" className="btn btn-nebula w-full !py-3.5 text-[0.92rem] lg:w-auto lg:px-8">
                  شروع تست نوا‌مچ
                  <ArrowLeft size={17} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
