import { useState, type FormEvent } from 'react';
import { Users, X } from 'lucide-react';

export interface RoomDraft {
  name: string;
  subtitle: string;
  dailyQuestion: string;
  isPrivate: boolean;
}

interface RoomCreatorDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (draft: RoomDraft) => void;
}

export default function RoomCreatorDialog({ open, onClose, onCreate }: RoomCreatorDialogProps) {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dailyQuestion, setDailyQuestion] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!open) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !dailyQuestion.trim()) return;
    onCreate({
      name: name.trim(),
      subtitle: subtitle.trim() || 'Une communauté Axora',
      dailyQuestion: dailyQuestion.trim(),
      isPrivate,
    });
    setName('');
    setSubtitle('');
    setDailyQuestion('');
    setIsPrivate(false);
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center bg-[var(--axo-overlay)] p-3 backdrop-blur-sm sm:items-center">
      <section role="dialog" aria-modal="true" aria-labelledby="room-creator-title" className="relative w-full max-w-md rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-6 text-[var(--axo-text)] shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Fermer la création de Room" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface-muted)]"><X className="h-5 w-5" /></button>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF2D55]/10 text-[#FF2D55]"><Users className="h-6 w-6" /></span>
        <h2 id="room-creator-title" className="mt-4 text-lg font-black">Créer une Room</h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--axo-text-muted)]">Créez un espace communautaire quotidien. Les membres peuvent publier et répondre, mais pas s’écrire en privé depuis la Room.</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#FF2D55]">Nom de la Room<input autoFocus required maxLength={50} value={name} onChange={event => setName(event.target.value)} placeholder="Ex. Photographes de Kinshasa" className="mt-2 min-h-11 w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 text-sm normal-case tracking-normal text-[var(--axo-text)] outline-none" /></label>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#FF2D55]">Thème<input maxLength={80} value={subtitle} onChange={event => setSubtitle(event.target.value)} placeholder="Ex. Photos, sorties et conseils" className="mt-2 min-h-11 w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 text-sm normal-case tracking-normal text-[var(--axo-text)] outline-none" /></label>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#FF2D55]">Première question du jour<textarea required maxLength={180} rows={3} value={dailyQuestion} onChange={event => setDailyQuestion(event.target.value)} placeholder="Quelle photo raconte votre journée ?" className="mt-2 w-full resize-none rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3 text-sm normal-case tracking-normal text-[var(--axo-text)] outline-none" /></label>
          <label className="flex items-start gap-3 rounded-xl bg-[var(--axo-surface-muted)] p-3 text-xs"><input type="checkbox" checked={isPrivate} onChange={event => setIsPrivate(event.target.checked)} className="mt-0.5" /><span><strong className="block">Room privée</strong><span className="mt-0.5 block text-[10px] text-[var(--axo-text-muted)]">Une approbation sera nécessaire pour rejoindre.</span></span></label>
          <button type="submit" disabled={!name.trim() || !dailyQuestion.trim()} className="min-h-12 w-full rounded-xl bg-[#FF2D55] px-4 text-xs font-black text-white shadow-lg shadow-[#FF2D55]/20 disabled:opacity-40">Créer la Room</button>
        </form>
      </section>
    </div>
  );
}
