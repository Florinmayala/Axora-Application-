import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Search, UserCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { VerifiedBadge } from './VerifiedBadge';

export interface ProfileConnection {
  id: string;
  name: string;
  username: string;
  avatar: string;
  detail: string;
  verified?: boolean;
}

interface ProfileConnectionsModalProps {
  mode: 'followers' | 'following';
  count: number;
  people: ProfileConnection[];
  onClose: () => void;
}

export default function ProfileConnectionsModal({ mode, count, people, onClose }: ProfileConnectionsModalProps) {
  const [query, setQuery] = useState('');
  const visiblePeople = useMemo(() => people.filter(person =>
    `${person.name} ${person.username}`.toLowerCase().includes(query.toLowerCase())
  ), [people, query]);
  const title = mode === 'followers' ? 'Followers' : 'Suivis';

  return createPortal(
    <div className="fixed inset-0 z-[95] flex h-[100dvh] justify-center overflow-hidden bg-[var(--axo-bg)] text-[var(--axo-text)]">
      <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-[var(--axo-bg)]">
        <header className="shrink-0 border-b border-[var(--axo-border)] px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center">
            <button type="button" onClick={onClose} className="flex w-max items-center gap-2 rounded-xl py-2 pr-3 text-xs font-black hover:bg-[var(--axo-surface-muted)]"><ArrowLeft className="h-4 w-4" />Retour</button>
            <div className="text-center"><h3 className="text-base font-black">{title}</h3><p className="text-[10px] text-[var(--axo-text-muted)]">{count.toLocaleString('fr-FR')} comptes</p></div>
            <span />
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-bg)] px-3 py-2.5">
            <Search className="h-4 w-4 text-[var(--axo-text-muted)]" />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Rechercher dans les ${title.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {visiblePeople.map(person => (
            <div key={person.id} className="flex items-center gap-3 rounded-2xl p-3 hover:bg-[var(--axo-surface-muted)]">
              <img src={person.avatar} alt={person.name} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1"><div className="flex items-center gap-1"><strong className="truncate text-xs">{person.name}</strong>{person.verified && <VerifiedBadge size={13} />}</div><span className="block truncate text-[10px] text-[var(--axo-text-muted)]">@{person.username.replace(/^@/, '')}</span><span className="block truncate text-[9px] text-[var(--axo-accent-wave)]">{person.detail}</span></div>
              {mode === 'following' ? <UserCheck className="h-4 w-4 text-[var(--axo-accent-mint)]" /> : null}
            </div>
          ))}
          {!visiblePeople.length && <div className="py-12 text-center"><Users className="mx-auto mb-2 h-8 w-8 text-[var(--axo-text-muted)]" /><p className="text-xs text-[var(--axo-text-muted)]">Aucun compte trouvé</p></div>}
        </div>
      </motion.section>
    </div>,
    document.body
  );
}
