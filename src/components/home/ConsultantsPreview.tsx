import { Link } from 'react-router-dom';
import { GraduationCap, Star, Users } from 'lucide-react';
import { CONSULTANTS } from '@/data/consultants';
import { Avatar } from '@/components/ui/Avatar';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { toFa } from '@/lib/fa';

export function ConsultantCard({ consultant }: { consultant: (typeof CONSULTANTS)[number] }) {
  return (
    <article className="glass edge-glow group flex h-full flex-col gap-4 rounded-4xl p-6 transition-all duration-500 hover:-translate-y-1.5">
      <div className="flex items-start gap-4">
        <Avatar name={consultant.name} gradient={consultant.gradient} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link to={`/consultants/${consultant.slug}`} className="truncate text-lg font-extrabold text-ink-100 transition-colors hover:text-nova-200">
            {consultant.name}
          </Link>
          <span className="text-[0.76rem] font-bold text-nova-200">{consultant.role}</span>
          <span className="mt-1 flex flex-wrap gap-1.5">
            <span className="chip !text-[0.66rem] !text-nebula-300">{consultant.field}</span>
            <span className={`chip !text-[0.66rem] ${consultant.available ? '!text-mint-400' : '!text-ink-400'}`}>
              {consultant.available ? `ظرفیت خالی: ${toFa(consultant.capacity)}` : 'ظرفیت تکمیل'}
            </span>
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2 text-[0.8rem] text-ink-300">
        <li className="flex items-center gap-2">
          <GraduationCap size={15} className="shrink-0 text-nova-300" />
          <span className="truncate">
            {consultant.education} — {consultant.university}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Star size={15} className="shrink-0 text-nova-300" />
          <span className="truncate">{consultant.rank}</span>
        </li>
        <li className="flex items-center gap-2">
          <Users size={15} className="shrink-0 text-nova-300" />
          <span className="truncate">
            {toFa(consultant.students)} دانش‌آموز همراهی‌شده — {toFa(consultant.experience)} سال سابقه
          </span>
        </li>
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-4">
        <span className="flex items-center gap-1 text-[0.78rem] font-bold text-nova-200">
          <Star size={13} fill="currentColor" />
          {toFa(consultant.rating)} از ۵
        </span>
        <Link to={`/consultants/${consultant.slug}`} className="text-[0.8rem] font-bold text-ink-300 transition-colors hover:text-nova-200">
          پروفایل مشاور ←
        </Link>
      </div>
    </article>
  );
}

export function ConsultantsPreview({ limit = 4 }: { limit?: number }) {
  const consultants = CONSULTANTS.slice(0, limit);

  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="مشاوران نووا"
            title="در مسیر رتبه برتر شدن، از رتبه‌برترها کمک بگیر"
            description="همه مشاوران نووا خودشان کنکور داده‌اند و در همان رشته‌ای مشاوره می‌دهند که قبول شده‌اند. مسیر را کسی نشان می‌دهد که رفته است."
            action={
              <Link to="/consultants" className="btn btn-ghost !px-5 !py-2.5 text-sm">
                همه مشاوران
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {consultants.map((consultant, index) => (
            <Reveal key={consultant.id} delay={index * 70}>
              <ConsultantCard consultant={consultant} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
