import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ConsultantCard } from '@/components/home/ConsultantsPreview';
import { CONSULTANTS, FIELD_FILTERS } from '@/data/consultants';
import { toFa } from '@/lib/fa';

export function ConsultantsPage() {
  const [field, setField] = useState<(typeof FIELD_FILTERS)[number]>('همه');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'مشاوران کنکور نووا | رتبه‌های برتر، مشاور تو';
  }, []);

  const filtered = useMemo(() => {
    return CONSULTANTS.filter((consultant) => {
      const byField = field === 'همه' || consultant.field === field;
      const needle = query.trim();
      const byQuery =
        !needle ||
        consultant.name.includes(needle) ||
        consultant.university.includes(needle) ||
        consultant.tags.some((tag) => tag.includes(needle));
      return byField && byQuery;
    });
  }, [field, query]);

  const availableCount = CONSULTANTS.reduce((sum, c) => sum + c.capacity, 0);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'مشاوران' }]}
        eyebrow="تیم مشاوره نووا"
        title="مشاورانی که خودشان این مسیر را رفته‌اند"
        description="هر مشاور نووا یک رتبه برتر کنکور است که حالا همان مسیری را نشان می‌دهد که خودش طی کرده. ظرفیت هر مشاور محدود است تا کیفیت همراهی حفظ شود."
      >
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="chip !py-2">
            <Users size={13} className="text-nova-300" />
            {toFa(CONSULTANTS.length)} مشاور فعال
          </span>
          <span className="chip !py-2 !text-mint-400">{toFa(availableCount)} ظرفیت خالی در این دوره</span>
          <span className="chip !py-2">{toFa(CONSULTANTS.reduce((s, c) => s + c.students, 0))} دانش‌آموز همراهی‌شده</span>
        </div>
      </PageHeader>

      <section className="pb-24">
        <div className="container-nova flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FIELD_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setField(item)}
                  className={`rounded-full border px-4 py-2 text-[0.8rem] font-bold transition-all ${
                    field === item
                      ? 'border-nova-300/55 bg-nova-400/15 text-nova-200'
                      : 'border-white/10 bg-white/[0.03] text-ink-400 hover:text-ink-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی نام، دانشگاه یا تخصص..."
                className="field !pe-11"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="glass flex flex-col items-center gap-3 rounded-5xl px-6 py-14 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/6 text-ink-400">
                <Search size={22} />
              </span>
              <p className="text-[0.95rem] font-bold text-ink-200">مشاوری با این مشخصات پیدا نشد</p>
              <p className="max-w-md text-[0.82rem] text-ink-400">
                فیلتر رشته را عوض کن یا عبارت دیگری جستجو کن. می‌توانی درخواستت را ثبت کنی تا ما مشاور مناسب را به تو معرفی
                کنیم.
              </p>
              <Link to="/register" className="btn btn-primary mt-1 !px-5 !py-2.5 text-sm">
                ثبت درخواست مشاوره
                <ArrowLeft size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((consultant, index) => (
                <Reveal key={consultant.id} delay={index * 60}>
                  <ConsultantCard consultant={consultant} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
