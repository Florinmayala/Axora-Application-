import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Flame, MessageCircle, Play } from 'lucide-react';
import { AxoraReels, ReelItem } from './AxoraReels';

interface ProfileReelsGridProps {
  reels: ReelItem[];
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onViewProfile?: (creator: { name: string; username: string; avatar: string }) => void;
}

export default function ProfileReelsGrid({ reels, coins, setCoins, onViewProfile }: ProfileReelsGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const profileReels = useMemo(() => reels.filter(reel => Boolean(reel.mediaUrl)), [reels]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('axora:post-interaction', { detail: { open: selectedIndex !== null } }));
    return () => window.dispatchEvent(new CustomEvent('axora:post-interaction', { detail: { open: false } }));
  }, [selectedIndex]);

  if (!profileReels.length) {
    return <div className="py-16 text-center text-xs text-[var(--axo-text-muted)]">Aucun Reel publié.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {profileReels.map((reel, index) => (
          <button
            key={reel.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[3/4] overflow-hidden bg-[var(--axo-media-bg)] text-white"
            aria-label={`Lire le Reel ${reel.caption}`}
          >
            <img src={reel.mediaUrl} alt={reel.caption} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            <Play className="absolute right-2 top-2 h-4 w-4 fill-white drop-shadow" />
            <span className="absolute inset-x-2 bottom-2 flex items-center justify-between text-[9px] font-bold drop-shadow">
              <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 fill-white" />{reel.likes.toLocaleString('fr-FR')}</span>
              <span className="hidden items-center gap-1 sm:flex"><MessageCircle className="h-3.5 w-3.5" />{reel.commentsCount}</span>
            </span>
          </button>
        ))}
      </div>

      {selectedIndex !== null && createPortal(
        <div className="fixed inset-0 z-[80] bg-black">
          <AxoraReels items={profileReels} initialIndex={selectedIndex} coins={coins} setCoins={setCoins} onViewProfile={onViewProfile} />
          <button type="button" onClick={() => setSelectedIndex(null)} className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-[90] flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs font-black text-white backdrop-blur-md" aria-label="Retour au profil">
            <ArrowLeft className="h-4 w-4" />Retour
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
