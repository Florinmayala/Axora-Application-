import { AlertTriangle, LoaderCircle, Wrench } from 'lucide-react';

type SystemState = 'loading' | 'maintenance' | 'error';
export default function SystemStatusPanel() {
  const activate = (state: SystemState) => window.dispatchEvent(new CustomEvent('axora:system-state', { detail: { state } }));
  return <section className="mt-4 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-4"><h3 className="text-xs font-black">États système</h3><p className="mt-1 text-[10px] text-zinc-500">Prévisualisez les écrans globaux sur n’importe quel onglet.</p><div className="mt-3 grid grid-cols-3 gap-2"><button type="button" onClick={() => activate('loading')} className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-2 text-[9px] font-bold text-cyan-500"><LoaderCircle className="mx-auto mb-1 h-3.5 w-3.5" />Chargement</button><button type="button" onClick={() => activate('maintenance')} className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-2 text-[9px] font-bold text-amber-500"><Wrench className="mx-auto mb-1 h-3.5 w-3.5" />Maintenance</button><button type="button" onClick={() => activate('error')} className="rounded-xl border border-red-500/25 bg-red-500/5 p-2 text-[9px] font-bold text-red-500"><AlertTriangle className="mx-auto mb-1 h-3.5 w-3.5" />Erreur</button></div></section>;
}
