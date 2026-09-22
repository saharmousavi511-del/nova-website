import { FEATURES } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function WhyNova() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-nova flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="چرا نووا؟"
            title="چیزی که نووا را از بقیه جدا می‌کند"
            description="ما مشاوره را یک محصول آماده نمی‌دانیم؛ یک فرایند داده‌محور است. هر تصمیمی که برای برنامه تو گرفته می‌شود، بر پایه گزارش واقعی خودت است."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 70}>
              <article className="glass edge-glow group h-full rounded-4xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
                <span className={`mb-5 grid h-13 w-13 place-items-center rounded-3xl bg-gradient-to-br ${feature.accent} p-3.5 text-space-950 shadow-lg shadow-black/30`}>
                  <feature.icon size={24} strokeWidth={2.1} />
                </span>
                <h3 className="mb-2.5 text-lg font-extrabold text-ink-100">{feature.title}</h3>
                <p className="text-[0.9rem] leading-loose text-ink-300">{feature.text}</p>
                <span className="mt-5 block h-px w-full bg-gradient-to-l from-transparent via-white/12 to-transparent" />
                <span className="mt-4 block text-[0.72rem] font-bold text-ink-400">
                  {`۰${index + 1}`} — ویژگی نووا
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
