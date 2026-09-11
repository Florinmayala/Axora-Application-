import { AlertTriangle, RefreshCw, Wrench } from 'lucide-react';

export type SystemState = 'loading' | 'maintenance' | 'error';

const content: Record<SystemState, { title: string; description: string; action: string }> = {
  loading: { title: 'Chargement en cours', description: 'Nous préparons votre expérience Axora.', action: 'Continuer' },
  maintenance: { title: 'Maintenance en cours', description: 'Axora revient bientôt. Vos données locales restent protégées.', action: 'Réessayer' },
  error: { title: 'Service indisponible', description: 'Une erreur a empêché le chargement de cet écran.', action: 'Réessayer' },
};

export default function SystemStateOverlay({ state, onClose }: { state: SystemState | null; onClose: () => void }) {
  if (!state) return null;
  const current = content[state];
  const iconClass = state === 'error' ? 'bg-red-500/15 text-red-500' : state === 'maintenance' ? 'bg-amber-500/15 text-amber-500' : 'bg-cyan-500/15 text-cyan-500';
  return <section role="dialog" aria-modal="true" aria-labelledby="system-state-title" className="absolute inset-0 z-[170] flex items-center justify-center bg-[var(--axo-overlay)] p-6 text-center text-[var(--axo-text)] backdrop-blur-md">
    <div className="w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-7 shadow-2xl">
      <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${iconClass}`}>{state === 'error' ? <AlertTriangle className="h-8 w-8" /> : state === 'maintenance' ? <Wrench className="h-8 w-8" /> : <RefreshCw className="h-8 w-8 animate-spin" />}</span>
      <p className="mt-7 text-[10px] font-black tracking-[0.24em] text-[var(--axo-text-muted)]">ÉTAT SYSTÈME</p>
      <h1 id="system-state-title" className="mt-3 text-2xl font-black">{current.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--axo-text-muted)]">{current.description}</p>
      <button type="button" onClick={onClose} className="mt-7 min-h-11 rounded-xl bg-[#FF2D55] px-5 py-3 text-xs font-black text-white">{current.action}</button>
    </div>
  </section>;
}
