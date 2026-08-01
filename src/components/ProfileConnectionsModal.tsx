import React, { useMemo, useState } from 'react';
import { Search, UserCheck, Users, X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-4">
      <motion.button type="button" aria-label="Fermer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex max-h-[82dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] text-[var(--axo-text)] shadow-2xl sm:rounded-[28px]">
        <header className="border-b border-[var(--axo-border)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-base font-black">{title}</h3><p className="text-[10px] text-[var(--axo-text-muted)]">{count.toLocaleString('fr-FR')} comptes</p></div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-[var(--axo-text-muted)]"><X className="h-5 w-5" /></button>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-bg)] px-3 py-2.5">
            <Search className="h-4 w-4 text-[var(--axo-text-muted)]" />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Rechercher dans les ${title.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
        </header>
        <div className="overflow-y-auto p-2">
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
    </div>
  );
}
