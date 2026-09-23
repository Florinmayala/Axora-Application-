import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

export default function MessageDialog({ title, onClose, children, wide = false }: {
  title: string; onClose: () => void; children: ReactNode; wide?: boolean;
}) {
  const heading = useId();
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('button')?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close.current(); }
      if (event.key !== 'Tab') return;
      const items: HTMLElement[] = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea, a[href], audio[controls], video[controls], [tabindex="0"]') || []) as HTMLElement[];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', onKey, true); previous?.focus(); };
  }, []);
  return createPortal(<div className="message-dialog fixed inset-0 z-[200] flex items-end justify-center bg-black/65 p-3 text-[var(--axo-text)] sm:items-center" onClick={onClose}>
    <motion.section ref={panel} role="dialog" aria-modal="true" aria-labelledby={heading}
      initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}
      onClick={event => event.stopPropagation()}
      className={`max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-3xl border border-[var(--axo-border)] bg-[var(--axo-bg)] p-4 shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-md'}`}>
      <header className="mb-4 flex items-center justify-between gap-3"><h2 id={heading} className="text-base font-bold">{title}</h2><button type="button" className="message-icon" aria-label="Fermer" onClick={onClose}><X size={20} /></button></header>
      {children}
    </motion.section>
  </div>, document.body);
}
