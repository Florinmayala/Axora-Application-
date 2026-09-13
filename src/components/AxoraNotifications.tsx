import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Check, ChevronLeft, Heart, MessageCircle, Shield, Trash2 } from 'lucide-react';
import { AxoraNotification } from '../types';

interface Props {
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: AxoraNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AxoraNotification[]>>;
  isDark: boolean;
  onAction: (notification: AxoraNotification) => void;
}

type Tab = 'all' | 'social' | 'security';

export default function AxoraNotifications({ notificationsOpen, setNotificationsOpen, notifications, setNotifications, isDark, onAction }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [read, setRead] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('axo_notification_reads_v2') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('axo_notification_reads_v2', JSON.stringify(read)); }, [read]);

  const filtered = useMemo(() => notifications.filter(item => {
    if (tab === 'security') return item.type === 'security';
    if (tab === 'social') return item.type !== 'security';
    return true;
  }), [notifications, tab]);

  const markRead = (id: string) => setRead(current => current.includes(id) ? current : [...current, id]);
  const toggleRead = (id: string) => setRead(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  if (!notificationsOpen) return null;

  return (
    <div className={`absolute inset-0 z-50 flex flex-col overflow-y-auto ${isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F9F9FB] text-zinc-900'}`}>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--axo-border)] bg-[var(--axo-bg)]/95 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setNotificationsOpen(false)} className="rounded-xl border border-[var(--axo-border)] p-2" aria-label="Fermer les notifications"><ChevronLeft className="h-4 w-4" /></button>
          <Bell className="h-4 w-4 text-[#FF2D55]" />
          <h1 className="text-xs font-black uppercase tracking-widest">Notifications</h1>
        </div>
        <button type="button" onClick={() => setRead(notifications.map(item => item.id))} className="rounded-full bg-[var(--axo-surface-muted)] px-3 py-2 text-[10px] font-black">Tout lire</button>
      </header>

      <nav className="sticky top-[61px] z-10 grid grid-cols-3 border-b border-[var(--axo-border)] bg-[var(--axo-bg)]">
        {([['all', 'Tout'], ['social', 'Activité'], ['security', 'Sécurité']] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`py-3 text-[10px] font-black ${tab === id ? 'border-b-2 border-[#FF2D55] text-[#FF2D55]' : 'text-[var(--axo-text-muted)]'}`}>{label}</button>
        ))}
      </nav>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-2 p-4">
        {filtered.length ? filtered.map(item => {
          const isRead = read.includes(item.id);
          const icon = item.type === 'security' ? <Shield className="h-4 w-4" /> : item.type === 'comment' ? <MessageCircle className="h-4 w-4" /> : <Heart className="h-4 w-4" />;
          return <article key={item.id} className={`rounded-2xl border ${isRead ? 'border-[var(--axo-border)] opacity-65' : 'border-[#FF2D55]/25 bg-[#FF2D55]/[0.03]'}`}>
            <button type="button" onClick={() => { markRead(item.id); onAction(item); }} className="flex w-full gap-3 p-4 text-left">
              <span className={`rounded-xl p-2 ${item.type === 'security' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#FF2D55]/10 text-[#FF2D55]'}`}>{icon}</span>
              <span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><b className="text-xs">{item.title}</b><time className="shrink-0 text-[10px] text-[var(--axo-text-muted)]">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : item.timestamp}</time></span><span className="mt-1 block text-xs text-[var(--axo-text-muted)]">{item.description}</span></span>
            </button>
            <div className="flex justify-end gap-1 border-t border-[var(--axo-border)] px-2 py-1.5">
              <button type="button" onClick={() => toggleRead(item.id)} className="rounded-lg p-1.5 text-[var(--axo-text-muted)]" aria-label={isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}><Check className="h-4 w-4" /></button>
              <button type="button" onClick={() => setNotifications(current => current.filter(notification => notification.id !== item.id))} className="rounded-lg p-1.5 text-[#FF2D55]" aria-label="Supprimer la notification"><Trash2 className="h-4 w-4" /></button>
            </div>
          </article>;
        }) : <div className="py-24 text-center"><Bell className="mx-auto h-8 w-8 text-[var(--axo-text-muted)]" /><p className="mt-3 text-xs text-[var(--axo-text-muted)]">Aucune notification dans cette catégorie.</p></div>}
      </main>
    </div>
  );
}
