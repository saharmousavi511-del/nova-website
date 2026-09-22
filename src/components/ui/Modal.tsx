import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  tone?: 'warm' | 'danger' | 'cool';
  icon?: ReactNode;
}

export function Modal({ open, title, children, onClose, footer, tone = 'warm', icon }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const toneRing =
    tone === 'danger'
      ? 'border-rose-400/40 shadow-[0_30px_90px_-30px_rgba(255,107,138,0.45)]'
      : tone === 'cool'
        ? 'border-nebula-300/35 shadow-[0_30px_90px_-30px_rgba(139,123,255,0.45)]'
        : 'border-nova-300/35 shadow-[0_30px_90px_-30px_rgba(255,138,61,0.45)]';

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-space-950/85 backdrop-blur-sm" onClick={onClose} />
      <div className={`glass relative w-full max-w-lg animate-pop rounded-5xl border p-6 sm:p-8 ${toneRing}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="absolute end-5 top-5 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-ink-300 transition-colors hover:text-nova-200"
        >
          <X size={16} />
        </button>

        {icon ? <div className="mb-4 text-nova-200">{icon}</div> : null}
        <h3 className="text-xl font-black text-ink-100">{title}</h3>
        <div className="mt-4 text-[0.9rem] leading-loose text-ink-300">{children}</div>
        {footer ? <div className="mt-7 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
