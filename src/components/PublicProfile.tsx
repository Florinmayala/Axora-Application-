import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, Ban, ExternalLink, Flame, Link as LinkIcon, MapPin,
  MessageCircle, MoreHorizontal, Send, ShieldAlert, Sparkles,
  UserCheck, UserPlus, X,
} from 'lucide-react';
import { motion } from 'motion/react';
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
    return owned.length ? owned : posts.slice(0, 6);
  }, [posts, profile.username]);

  const notify = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2200);
  };

  const shareProfile = async () => {
    try {
      await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#@${profile.username}`);
      notify('Lien du profil copié');
    } catch {
      notify('Profil prêt à être partagé');
    }
    setMenuOpen(false);
  };

  return (
    <section className="min-h-full w-full bg-[var(--axo-bg)] text-[var(--axo-text)]">
      <div className="mx-auto max-w-4xl px-0 pb-16 sm:px-4">
        <div className="flex items-center justify-between px-4 py-3 sm:px-0">
          <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-xl p-2 text-xs font-bold text-[var(--axo-text-muted)] transition hover:text-[var(--axo-text)]">
            <ArrowLeft className="h-4 w-4" />Retour
          </button>
          <button type="button" onClick={() => setMenuOpen(true)} className="rounded-full p-2 text-[var(--axo-text-muted)] transition hover:bg-[var(--axo-surface-muted)] hover:text-[var(--axo-text)]" aria-label="Plus d’actions">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex flex-col items-stretch gap-4 overflow-hidden rounded-[22px] border border-transparent bg-transparent p-4 text-left shadow-none sm:gap-6 sm:rounded-[32px] sm:p-6">
          <div className="flex w-full flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0 select-none">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[var(--axo-accent)] via-[var(--axo-accent-wave)] to-[var(--axo-accent-mint)] p-[3px] transition duration-300 hover:scale-105 sm:h-28 sm:w-28">
                <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full border-4 border-[var(--axo-bg)] bg-[var(--axo-media-bg)] object-cover" />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center space-y-2 sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-black leading-none tracking-tight sm:text-2xl">{profile.name}</h1>
                {isVerifiedAccount(profile.username) && <VerifiedBadge size={18} />}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--axo-text-muted)] sm:justify-start sm:text-xs">
                <span className="font-extrabold text-[var(--axo-accent)]">@{profile.username}</span>
                <span>•</span>
                <span>Créateur Axora</span>
                {profile.location && <><span>•</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.location}</span></>}
              </div>
              <div className="hidden sm:flex">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 py-1 text-[10px] font-bold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--axo-accent-mint)]" />Profil public
                </span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 text-center sm:text-left">
            {profile.bio && <p className="px-2 text-xs leading-relaxed sm:px-0 sm:text-sm">{profile.bio}</p>}
            {profile.externalUrl && (
              <a href={profile.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-black text-[var(--axo-accent)]">
                <LinkIcon className="h-3.5 w-3.5" />{profile.externalUrl.replace(/^https?:\/\//, '')}<ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="h-px w-full bg-[var(--axo-border)]" />
          <div className="flex w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsFollowing(value => !value)} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black tracking-wide transition active:scale-[0.97] sm:flex-none ${isFollowing ? 'border-[var(--axo-border)] bg-[var(--axo-surface)] text-[var(--axo-text)]' : 'border-[var(--axo-accent)] bg-[var(--axo-accent)] text-[var(--axo-on-accent)]'}`}>
                {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}{isFollowing ? 'ABONNÉ' : "S’ABONNER"}
              </button>
              {profile.messagesAllowed && (
                <button type="button" onClick={onMessage} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-5 py-3 text-xs font-black tracking-wide transition active:scale-[0.97] sm:flex-none">
                  <MessageCircle className="h-4 w-4" />MESSAGE
                </button>
              )}
            </div>
            <button type="button" onClick={() => setMenuOpen(true)} className="flex items-center justify-center rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-transparent bg-transparent p-1 shadow-none">
          <div className={`grid items-center divide-x divide-[var(--axo-border)] text-center ${profile.auraVisible ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <ProfileStat label="POSTS" value={visiblePosts.length} detail="Publications" />
            <ProfileStat label="FOLLOWERS" value={profile.followers + (isFollowing ? 1 : 0)} detail="Communauté" />
            <ProfileStat label="SUIVIS" value={profile.following} detail="Abonnements" />
            {profile.auraVisible && <ProfileStat label="AURA SCORE" value={profile.aura} detail="J’aime reçus" aura />}
          </div>
        </div>

        <div className="flex flex-col space-y-6 pt-2">
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-2xl border border-transparent bg-transparent p-1">
              <button type="button" className="relative rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] sm:text-xs">
                POSTS
                <motion.span layoutId="publicProfileTab" className="absolute inset-0 -z-10 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] shadow-sm" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 px-1 sm:gap-3">
            {visiblePosts.map((post, index) => (
              <button key={`${post.id}-${index}`} type="button" className="group relative aspect-square overflow-hidden rounded-md border border-[var(--axo-border)] bg-[var(--axo-media-bg)] transition active:scale-[0.985] sm:rounded-2xl">
                {post.image ? <img src={post.image} alt={`Publication de ${profile.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <span className="flex h-full items-center bg-[var(--axo-surface)] p-3 text-left text-[10px] leading-relaxed text-[var(--axo-text-muted)]">{post.text}</span>}
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1 bg-[var(--axo-media-overlay)] py-2 text-[10px] font-bold text-[var(--axo-media-text)] transition group-hover:translate-y-0"><Flame className="h-3.5 w-3.5" />{post.likes}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center" onClick={() => setMenuOpen(false)}>
          <div className="w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-3 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-2 py-1"><span className="text-xs font-black">Actions du profil</span><button type="button" onClick={() => setMenuOpen(false)} className="rounded-full p-2"><X className="h-4 w-4" /></button></div>
            <MenuAction icon={<Send className="h-4 w-4" />} label="Partager le profil" onClick={shareProfile} />
            <MenuAction icon={<ShieldAlert className="h-4 w-4" />} label="Signaler ce profil" onClick={() => { notify('Signalement ouvert'); setMenuOpen(false); }} />
            <MenuAction icon={<Ban className="h-4 w-4" />} label="Bloquer cet utilisateur" onClick={() => { notify('Utilisateur bloqué'); setMenuOpen(false); }} danger />
          </div>
        </div>
      )}
      {feedback && <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] px-4 py-2 text-[10px] font-bold shadow-xl">{feedback}</div>}
    </section>
  );
}

function ProfileStat({ label, value, detail, aura = false }: { label: string; value: number; detail: string; aura?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center py-4">
      <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest sm:text-[9px] ${aura ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-accent-wave)]'}`}>{aura && <Sparkles className="h-3 w-3" />}{label}</span>
      <strong className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{value.toLocaleString('fr-FR')}</strong>
      <span className="truncate text-[7px] text-[var(--axo-text-muted)] sm:text-[8px]">{detail}</span>
    </div>
  );
}

function MenuAction({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-bold transition hover:bg-[var(--axo-surface-muted)] ${danger ? 'text-[var(--axo-accent)]' : ''}`}>{icon}{label}</button>;
}
