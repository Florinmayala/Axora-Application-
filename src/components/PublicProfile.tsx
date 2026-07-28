import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Ban,
  ExternalLink,
  Flame,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
  ShieldAlert,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { Post } from '../types';
import { isVerifiedAccount, VerifiedBadge } from './VerifiedBadge';

export interface PublicProfileData {
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  location?: string;
  externalUrl?: string;
  followers: number;
  following: number;
  aura: number;
  auraVisible: boolean;
  messagesAllowed: boolean;
}

interface PublicProfileProps {
  profile: PublicProfileData;
  posts: Post[];
  onBack: () => void;
  onMessage: () => void;
}

export default function PublicProfile({ profile, posts, onBack, onMessage }: PublicProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const visiblePosts = useMemo(() => {
    const owned = posts.filter(post => post.username === profile.username);
    return owned.length > 0 ? owned : posts.slice(0, 6);
  }, [posts, profile.username]);

  const notify = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2200);
  };

  const shareProfile = async () => {
    const url = `${window.location.origin}${window.location.pathname}#@${profile.username}`;
    try {
      await navigator.clipboard?.writeText(url);
      notify('Lien du profil copié');
    } catch {
      notify('Profil prêt à être partagé');
    }
    setMenuOpen(false);
  };

  return (
    <section className="min-h-full w-full bg-[var(--axo-bg)] text-[var(--axo-text)]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--axo-border)] bg-[var(--axo-bg)]/90 px-4 py-3 backdrop-blur-xl">
        <button type="button" onClick={onBack} className="rounded-full p-2 text-[var(--axo-text)] transition hover:bg-[var(--axo-surface-muted)]" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <div className="flex items-center justify-center gap-1">
            <h1 className="truncate text-sm font-black">{profile.name}</h1>
            {isVerifiedAccount(profile.username) && <VerifiedBadge size={15} />}
          </div>
          <p className="text-[10px] text-[var(--axo-text-muted)]">{visiblePosts.length} publications</p>
        </div>
        <button type="button" onClick={() => setMenuOpen(true)} className="rounded-full p-2 text-[var(--axo-text)] transition hover:bg-[var(--axo-surface-muted)]" aria-label="Plus d'actions">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-auto w-full max-w-5xl">
        <div className="px-4 pb-5 pt-6 sm:px-6">
          <div className="flex items-start gap-5 sm:gap-8">
            <img src={profile.avatar} alt={profile.name} className="h-24 w-24 shrink-0 rounded-full border border-[var(--axo-border)] object-cover sm:h-32 sm:w-32" />
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-xl font-black sm:text-2xl">{profile.name}</h2>
                {isVerifiedAccount(profile.username) && <VerifiedBadge size={18} />}
              </div>
              <p className="mt-0.5 text-xs text-[var(--axo-text-muted)]">@{profile.username}</p>
              {profile.bio && <p className="mt-3 max-w-2xl text-xs leading-relaxed sm:text-sm">{profile.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[var(--axo-text-muted)]">
                {profile.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>}
                {profile.externalUrl && (
                  <a href={profile.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[var(--axo-accent)]">
                    <LinkIcon className="h-3.5 w-3.5" />{profile.externalUrl.replace(/^https?:\/\//, '')}<ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className={`mt-6 grid divide-x divide-[var(--axo-border)] border-y border-[var(--axo-border)] py-4 ${profile.auraVisible ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <Stat value={visiblePosts.length} label="Publications" />
            <Stat value={profile.followers + (isFollowing ? 1 : 0)} label="Followers" />
            <Stat value={profile.following} label="Suivis" />
            {profile.auraVisible && <Stat value={profile.aura} label="Aura" icon={<Flame className="h-3.5 w-3.5 text-[var(--axo-accent)]" />} />}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-2">
            <button
              type="button"
              onClick={() => setIsFollowing(value => !value)}
              className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-black transition active:scale-[0.98] ${isFollowing ? 'border-[var(--axo-border)] bg-[var(--axo-surface-muted)] text-[var(--axo-text)]' : 'border-[var(--axo-accent)] bg-[var(--axo-accent)] text-[var(--axo-on-accent)]'}`}
            >
              {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {isFollowing ? 'Abonné' : "S'abonner"}
            </button>
            {profile.messagesAllowed ? (
              <button type="button" onClick={onMessage} className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 text-xs font-black transition hover:bg-[var(--axo-surface-muted)]">
                <MessageCircle className="h-4 w-4" />Message
              </button>
            ) : <div />}
            <button type="button" onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)]" aria-label="Plus">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center border-y border-[var(--axo-border)] py-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--axo-text-muted)]">Publications</span>
        </div>
        <div className="grid grid-cols-3 gap-px bg-[var(--axo-border)]">
          {visiblePosts.map((post, index) => (
            <button key={`${post.id}-${index}`} type="button" className="group relative aspect-square overflow-hidden bg-[var(--axo-surface-muted)]">
              {post.image ? (
                <img src={post.image} alt={`Publication de ${profile.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <span className="flex h-full items-center p-3 text-left text-[10px] leading-relaxed text-[var(--axo-text-muted)] sm:p-5 sm:text-xs">{post.text}</span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1 bg-[var(--axo-overlay)] py-2 text-[10px] font-bold text-[var(--axo-on-accent)] transition group-hover:translate-y-0">
                <Flame className="h-3.5 w-3.5" />{post.likes}
              </span>
            </button>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center" onClick={() => setMenuOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-3 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <span className="text-xs font-black">Actions du profil</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-full p-2 hover:bg-[var(--axo-surface-muted)]"><X className="h-4 w-4" /></button>
            </div>
            <MenuAction icon={<Send />} label="Partager le profil" onClick={shareProfile} />
            <MenuAction icon={<ShieldAlert />} label="Signaler ce profil" onClick={() => { notify('Signalement ouvert'); setMenuOpen(false); }} />
            <MenuAction icon={<Ban />} label="Bloquer cet utilisateur" onClick={() => { notify('Utilisateur bloqué'); setMenuOpen(false); }} danger />
          </div>
        </div>
      )}

      {feedback && <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] px-4 py-2 text-[10px] font-bold shadow-xl">{feedback}</div>}
    </section>
  );
}

function Stat({ value, label, icon }: { value: number; label: string; icon?: React.ReactNode }) {
  return (
    <div className="min-w-0 px-1 text-center">
      <strong className="flex items-center justify-center gap-1 text-sm font-black sm:text-base">{value.toLocaleString('fr-FR')}{icon}</strong>
      <span className="block truncate text-[9px] text-[var(--axo-text-muted)] sm:text-[10px]">{label}</span>
    </div>
  );
}

function MenuAction({ icon, label, onClick, danger = false }: { icon: React.ReactElement; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-bold transition hover:bg-[var(--axo-surface-muted)] ${danger ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text)]'}`}>
      {React.cloneElement(icon, { className: 'h-4 w-4' })}
      {label}
    </button>
  );
}
