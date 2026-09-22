import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'start';
  action?: ReactNode;
  tone?: 'warm' | 'cool';
}

export function SectionHeading({ eyebrow, title, description, align = 'center', action, tone = 'warm' }: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={`flex flex-col gap-5 ${isCenter ? 'items-center text-center' : 'items-start'} ${action ? 'md:flex-row md:items-end md:justify-between md:text-start' : ''}`}>
      <div className={`flex max-w-3xl flex-col gap-4 ${isCenter && action ? 'md:text-start' : ''} ${isCenter ? 'items-center md:items-center' : 'items-start'}`}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className={`text-3xl leading-[1.5] sm:text-4xl lg:text-[2.75rem] ${tone === 'cool' ? 'text-gradient-cool' : 'text-gradient'}`}>{title}</h2>
        {description ? <p className="max-w-2xl text-base leading-loose text-ink-300 sm:text-lg">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
