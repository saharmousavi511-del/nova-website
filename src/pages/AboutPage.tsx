import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, HeartHandshake, ScanSearch, Sparkles, Target, Telescope } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { STATS, COUNTER_FACTS } from '@/data/stats';
import { Counter } from '@/components/ui/Counter';
import { CONSULTANTS } from '@/data/consultants';
import { Avatar } from '@/components/ui/Avatar';
import { SITE } from '@/data/site';
import { toFa } from '@/lib/fa';

const VALUES = [
  {
    icon: ScanSearch,
    title: 'داده، نه حدس',
    text: 'هیچ برنامه‌ای بدون گزارش واقعی نوشته نمی‌شود. ما اول اندازه می‌گیریم، بعد تصمیم می‌گیریم.',
  },
  {
    icon: HeartHandshake,
    title: 'صداقت، حتی وقتی تلخ است',
    text: 'اگر هدفت با وضعیت فعلی‌ات فاصله زیادی داشته باشد، می‌گوییم و مسیر جایگزین پیشنهاد می‌دهیم. وعده رتبه ۱۰۰ نمی‌دهیم.',
  },
  {
    icon: Target,
    title: 'پیوستگی، نه انفجار',
    text: 'موفقیت در کنکور نتیجه هزار روز معمولیِ منظم است، نه یک شب استثنایی. برنامه‌های ما برای دوام طراحی می‌شوند.',
  },
  {
    icon: Compass,
    title: 'مسیر شخصی',
    text: 'هیچ دو دانش‌آموزی مثل هم نیستند؛ نه در توانایی، نه در ساعت آزاد، نه در شرایط خانه. پس برنامه هم یکی نیست.',
  },
];

const TIMELINE = [
  { year: '۱۳۹۷', title: 'شروع با چهار دانش‌آموز', text: 'نووا از یک گروه چهار نفره مشاوره در تهران شروع شد؛ سه رتبه برتر کنکور و یک دانش‌آموز پشت کنکور.' },
  { year: '۱۳۹۹', title: 'اولین سامانه گزارش‌گیری', text: 'پنل گزارش روزانه راه افتاد تا مشاوران بر پایه داده واقعی برنامه بنویسند، نه بر اساس حافظه جلسه.' },
  { year: '۱۴۰۱', title: 'گسترش به همه رشته‌ها', text: 'تیم مشاوره انسانی و ریاضی کامل شد و نووا از یک گروه تجربی به یک تیم سه‌رشته‌ای تبدیل شد.' },
  { year: '۱۴۰۳', title: 'آزمون‌های آنلاین شبیه‌ساز', text: 'بانک سؤال و سامانه آزمون آنلاین با نمره منفی و کارنامه درس‌به‌درس راه‌اندازی شد.' },
  { year: '۱۴۰۵', title: 'کهکشان نووا', text: 'امروز ۴۲ مشاور فعال، بیش از ۳۸۰۰ دانش‌آموز همراهی‌شده و ۱۴۸ رتبه برتر در یک سال.' },
];

export function AboutPage() {
  useEffect(() => {
    document.title = 'درباره نووا | گروه مشاوره کنکور';
  }, []);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'درباره ما' }]}
        eyebrow="درباره نووا"
        title="نووا یعنی ستاره‌ای که ناگهان روشن می‌شود"
        description="در اخترشناسی، نوا ستاره‌ای است که ناگهان هزاران برابر درخشان‌تر می‌شود. ما باور داریم درخشش یک دانش‌آموز هم اتفاقی نیست؛ نتیجه فشار منظم، سوخت درست و زمان‌بندی دقیق است."
      />

      {/* داستان */}
      <section className="pb-16">
        <div className="container-nova grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <Reveal>
            <div className="glass rounded-5xl p-7 sm:p-9">
              <h2 className="mb-5 text-xl font-black text-ink-100 sm:text-2xl">داستان ما</h2>
              <div className="flex flex-col gap-5 text-[0.95rem] leading-[2.3] text-ink-300">
                <p>
                  نووا در مهر {toFa(1397)} با یک پرسش ساده شروع شد: چرا دانش‌آموزی که روزی ده ساعت مطالعه می‌کند، نتیجه
                  نمی‌گیرد و دیگری با شش ساعت مطالعه، رتبه بهتری می‌آورد؟ جواب هیچ‌وقت «تلاش بیشتر» نبود؛ جواب «روش درست،
                  داده واقعی و همراهی مستمر» بود.
                </p>
                <p>
                  ما خودمان رتبه‌های برتر کنکور بودیم و دیدیم که در بازار مشاوره، بیشتر بسته‌ها یک برنامه آماده به همه
                  می‌دهند. برای همین تصمیم گرفتیم نووا را جور دیگری بسازیم: اول گزارش روزانه، بعد تحلیل، بعد برنامه. یعنی
                  برعکس روش رایج.
                </p>
                <p>
                  امروز تیم نووا {toFa(CONSULTANTS.length)} مشاور فعال دارد که همه‌شان خودشان کنکور داده‌اند و در همان
                  رشته‌ای مشاوره می‌دهند که قبول شده‌اند. ما در {toFa(240)} شهر دانش‌آموز داریم و بیشترشان را هرگز حضوری
                  ندیده‌ایم؛ ولی گزارش شبانه‌شان را هر روز خوانده‌ایم.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {COUNTER_FACTS.map((fact) => (
                  <div key={fact.label} className="glass-soft rounded-3xl p-4">
                    <p className="text-xl font-black text-gradient tabular-nums">{fact.value}</p>
                    <p className="mt-1 text-[0.74rem] leading-relaxed text-ink-400">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex flex-col gap-5">
              <div className="glass relative overflow-hidden rounded-5xl p-7">
                <span
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen"
                  style={{ backgroundImage: "url('/og-cover.jpg')" }}
                  aria-hidden
                />
                <span className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-nova-500/20 blur-[70px]" />
                <span className="relative grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-nova-300/25 to-nebula-400/25 text-nova-200">
                  <Telescope size={26} />
                </span>
                <h3 className="relative mt-5 text-lg font-extrabold text-ink-100">چشم‌انداز نووا</h3>
                <p className="relative mt-3 text-[0.88rem] leading-loose text-ink-300">
                  می‌خواهیم تا {toFa(1408)} هیچ دانش‌آموزی در ایران به دلیل نبود دسترسی به مشاوره درست، مسیر تحصیلی‌اش را
                  با حدس انتخاب نکند. آزمون‌های آنلاین رایگان و مطالب بلاگ، سهم ما از این هدف است.
                </p>
              </div>

              <div className="glass rounded-5xl p-7">
                <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-ink-100">
                  <Sparkles size={17} className="text-nova-300" />
                  تیم مشاوره
                </h3>
                <div className="flex -space-x-3 space-x-reverse">
                  {CONSULTANTS.slice(0, 6).map((consultant) => (
                    <Link key={consultant.id} to={`/consultants/${consultant.slug}`} title={consultant.name}>
                      <Avatar name={consultant.name} gradient={consultant.gradient} size="md" className="ring-2 ring-space-900" />
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-400">
                  {toFa(CONSULTANTS.length)} مشاور فعال در سه گروه تجربی، ریاضی و انسانی — همه از رتبه‌های برتر کنکور
                  سراسری.
                </p>
                <Link to="/consultants" className="btn btn-ghost mt-4 w-full !py-2.5 text-sm">
                  دیدن همه مشاوران
                  <ArrowLeft size={15} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ارزش‌ها */}
      <section className="pb-20">
        <div className="container-nova flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="ارزش‌های ما" title="چهار اصلی که زیر بارش نمی‌رویم" tone="cool" />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <article className="glass group flex h-full flex-col gap-4 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5">
                  <span className="grid h-12 w-12 place-items-center rounded-3xl bg-white/6 text-nova-200 transition-colors group-hover:bg-nova-400/15">
                    <value.icon size={21} />
                  </span>
                  <h3 className="text-[1.05rem] font-extrabold text-ink-100">{value.title}</h3>
                  <p className="text-[0.86rem] leading-loose text-ink-300">{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* آمار */}
      <section className="pb-20">
        <div className="container-nova">
          <Reveal>
            <div className="glass grid gap-6 rounded-5xl p-8 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <stat.icon size={22} className="mb-1 text-nova-300" />
                  <span className="text-[2.3rem] font-black leading-none text-ink-100">
                    <Counter value={stat.value} suffix={stat.suffix ?? ''} />
                  </span>
                  <span className="text-sm font-bold text-nova-200">{stat.label}</span>
                  <span className="text-xs text-ink-400">{stat.note}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* تاریخچه */}
      <section className="pb-24">
        <div className="container-nova flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="مسیر نووا" title="از چهار دانش‌آموز تا یک کهکشان" />
          </Reveal>

          <ol className="relative flex flex-col gap-6 border-s-2 border-white/8 ps-8">
            {TIMELINE.map((item, index) => (
              <Reveal key={item.year} delay={index * 80} as="li">
                <span className="absolute -start-[0.68rem] mt-7 grid h-5 w-5 place-items-center rounded-full border-2 border-nova-300 bg-space-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-nova-300" />
                </span>
                <div className="glass rounded-4xl p-6">
                  <span className="chip !border-nova-300/40 !bg-nova-400/12 !text-nova-200">{item.year}</span>
                  <h3 className="mt-3 text-lg font-extrabold text-ink-100">{item.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-loose text-ink-300">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="glass relative overflow-hidden rounded-5xl p-8 text-center sm:p-12">
              <span className="pointer-events-none absolute -bottom-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-nebula-500/20 blur-[90px]" />
              <h2 className="relative text-2xl font-black text-ink-100">با نووا هم‌مسیر شو</h2>
              <p className="relative mx-auto mt-3 max-w-xl text-[0.92rem] leading-loose text-ink-300">
                {SITE.description}
              </p>
              <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/register" className="btn btn-primary !px-7 !py-3.5 text-sm">
                  ثبت‌نام مشاوره
                  <ArrowLeft size={16} />
                </Link>
                <Link to="/services" className="btn btn-ghost !px-6 !py-3.5 text-sm">
                  دیدن طرح‌ها و هزینه‌ها
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
