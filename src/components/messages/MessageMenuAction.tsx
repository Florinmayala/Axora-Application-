import type React from 'react';

export default function MessageMenuAction({ icon, label, onClick, danger = false }: { icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-bold transition hover:bg-[var(--axo-surface-muted)] ${danger ? 'text-[var(--axo-accent)]' : ''}`}>{icon}{label}</button>;
}
