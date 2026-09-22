import { useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface AccordionItem {
  q: ReactNode;
  a: ReactNode;
  tag?: string;
}

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={index}
            className={`glass overflow-hidden rounded-3xl transition-all duration-300 ${isOpen ? 'border-nova-300/35' : ''}`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-white/[0.03] sm:px-6 sm:py-5"
            >
              <span className="flex items-center gap-3">
                {item.tag ? <span className="chip shrink-0 !text-nova-200">{item.tag}</span> : null}
                <span className="text-[0.98rem] font-bold text-ink-100 sm:text-base">{item.q}</span>
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                  isOpen ? 'rotate-180 border-nova-300/60 bg-nova-400/15 text-nova-200' : 'border-white/12 bg-white/5 text-ink-300'
                }`}
              >
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <div
              className="grid transition-all duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="border-t border-white/8 px-5 pb-5 pt-4 text-[0.92rem] leading-loose text-ink-300 sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
