import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb: { label: string; to?: string }[];
  children?: ReactNode;
  tone?: 'warm' | 'cool';
}

export function PageHeader({ eyebrow, title, description, breadcrumb, children, tone = 'warm' }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pt-12 pb-14 lg:pt-20 lg:pb-20">
      <span className="pointer-events-none absolute -top-32 end-1/4 h-80 w-80 rounded-full bg-nova-500/12 blur-[100px]" />
      <span className="pointer-events-none absolute -bottom-24 start-0 h-72 w-72 rounded-full bg-nebula-500/12 blur-[100px]" />

      <div className="container-nova relative flex flex-col items-start gap-6">
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-[0.76rem] text-ink-400">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-nova-200">
            <Home size={13} />
            خانه
          </Link>
          {breadcrumb.map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <ChevronLeft size={13} className="text-white/25" />
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-nova-200">
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-ink-200">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex max-w-3xl flex-col gap-5">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 className={`text-[2rem] leading-[1.45] sm:text-4xl lg:text-[2.9rem] ${tone === 'cool' ? 'text-gradient-cool' : 'text-gradient'}`}>
            {title}
          </h1>
          {description ? <p className="text-[0.95rem] leading-loose text-ink-300 sm:text-base">{description}</p> : null}
        </div>

        {children ? <div className="w-full">{children}</div> : null}
      </div>
    </header>
  );
}
