import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Quote, Sparkles, Star, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Reveal } from '@/components/ui/Reveal';
import { CONSULTANTS } from '@/data/consultants';
import { NotFoundPage } from './NotFoundPage';
import { toFa } from '@/lib/fa';

export function ConsultantPage() {
  const { slug } = useParams();
  const consultant = CONSULTANTS.find((item) => item.slug === slug);

  useEffect(() => {
    if (consultant) document.title = `${consultant.name} — مشاور ${consultant.field} نووا`;
  }, [consultant]);

  if (!consultant) return <NotFoundPage />;

  const peers = CONSULTANTS.filter((item) => item.field === consultant.field && item.id !== consultant.id).slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'مشاوران', to: '/consultants' }, { label: consultant.name }]}
        eyebrow={`مشاور گروه ${consultant.field}`}
        title={consultant.name}
        description={consultant.role}
      >
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="chip !py-2 !border-nebula-300/35 !bg-nebula-400/12 !text-nebula-300">{consultant.field}</span>
          <span className={`chip !py-2 ${consultant.available ? '!text-mint-400' : ''}`}>
            {consultant.available ? `ظرفیت خالی: ${toFa(consultant.capacity)} نفر` : 'ظرفیت این دوره تکمیل است'}
          </span>
          <span className="chip !py-2">
            <Star size={13} fill="currentColor" className="text-nova-300" />
            امتیاز {toFa(consultant.rating)} از ۵
          </span>
        </div>
      </PageHeader>

      <section className="pb-20">
        <div className="container-nova grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <Reveal>
            <div className="glass flex flex-col items-center gap-5 rounded-5xl p-7 text-center">
              <Avatar name={consultant.name} gradient={consultant.gradient} size="xl" className="!h-28 !w-28 !rounded-[2rem] !text-3xl" />
              <div>
                <h2 className="text-xl font-black text-ink-100">{consultant.name}</h2>
                <p className="mt-1 text-[0.82rem] font-bold text-nova-200">{consultant.role}</p>
              </div>

              <ul className="flex w-full flex-col gap-2.5 text-start">
                <li className="flex items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <GraduationCap size={17} className="mt-1 shrink-0 text-nova-300" />
                  <span className="flex flex-col">
                    <span className="text-[0.82rem] font-bold text-ink-100">{consultant.education}</span>
                    <span className="text-[0.76rem] text-ink-400">{consultant.university}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <Star size={17} className="mt-1 shrink-0 text-nova-300" />
                  <span className="flex flex-col">
                    <span className="text-[0.82rem] font-bold text-ink-100">{consultant.rank}</span>
                    <span className="text-[0.76rem] text-ink-400">{consultant.year}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <Users size={17} className="mt-1 shrink-0 text-nova-300" />
                  <span className="flex flex-col">
                    <span className="text-[0.82rem] font-bold text-ink-100">{toFa(consultant.students)} دانش‌آموز</span>
                    <span className="text-[0.76rem] text-ink-400">{toFa(consultant.experience)} سال سابقه مشاوره</span>
                  </span>
                </li>
              </ul>

              <div className="flex w-full flex-wrap gap-2">
                {consultant.tags.map((tag) => (
                  <span key={tag} className="chip flex-1 justify-center">
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/register?consultant=${consultant.slug}`}
                className={`btn w-full !py-3.5 text-sm ${consultant.available ? 'btn-primary' : 'btn-ghost'}`}
              >
                {consultant.available ? 'درخواست مشاوره با این مشاور' : 'عضویت در فهرست انتظار'}
                <ArrowLeft size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="glass rounded-5xl p-7">
                <h2 className="mb-4 text-lg font-extrabold text-ink-100">درباره {consultant.name.split(' ')[0]}</h2>
                <p className="text-[0.92rem] leading-[2.2] text-ink-300">{consultant.bio}</p>
                <blockquote className="mt-6 flex items-start gap-3 rounded-4xl border border-nova-300/25 bg-nova-400/[0.07] p-5">
                  <Quote size={20} className="mt-1 shrink-0 text-nova-300" />
                  <p className="text-[0.92rem] font-bold leading-loose text-ink-100">«{consultant.quote}»</p>
                </blockquote>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="glass rounded-5xl p-7">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink-100">
                  <Sparkles size={18} className="text-nova-300" />
                  سبک کاری و تخصص
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    'بازبینی گزارش شبانه و بازخورد صوتی تا پیش از ساعت ۹ صبح',
                    'طراحی برنامه بر پایه داده واقعی ساعت مطالعه، نه آرزو',
                    'تمرکز ویژه روی دروس اختصاصی گروه ' + consultant.field,
                    'تحلیل کارنامه آزمون‌های آزمایشی به‌صورت سؤال‌به‌سؤال',
                    'جلسه ماهانه با خانواده برای هماهنگ‌سازی انتظارات',
                    'همراهی در دوران جمع‌بندی و شبیه‌سازی روز کنکور',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-[0.83rem] leading-relaxed text-ink-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nova-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {peers.length > 0 ? (
              <Reveal delay={140}>
                <div className="glass rounded-5xl p-7">
                  <h2 className="mb-4 text-lg font-extrabold text-ink-100">سایر مشاوران گروه {consultant.field}</h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {peers.map((peer) => (
                      <Link
                        key={peer.id}
                        to={`/consultants/${peer.slug}`}
                        className="glass-soft group flex items-center gap-3 rounded-3xl p-3.5 transition-all hover:-translate-y-1 hover:border-nova-300/35"
                      >
                        <Avatar name={peer.name} gradient={peer.gradient} size="sm" />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-[0.84rem] font-bold text-ink-100">{peer.name}</span>
                          <span className="truncate text-[0.7rem] text-ink-400">{peer.education}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
