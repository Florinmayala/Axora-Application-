import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  MessageCircle, 
  Share2, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Send,
  Plus,
  Check,
  Music,
  Heart,
  Smile,
  Search,
  Copy
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface AxoraReelsProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface ReelItem {
  id: string;
  creatorName: string;
  creatorUsername: string;
  avatar: string;
  mediaUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  shares: number;
  musicTrack: string;
  isVerified: boolean;
  comments: Comment[];
}

const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    creatorName: 'Lena_X',
    creatorUsername: 'Lena_X',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    caption: '🔥 Session Live modulaire brute dans mon bunker à Tokyo ! Notez l\'énergie en comms ⚡ #modular #synth #reels #cyberpunk',
    likes: 4210,
    commentsCount: 3,
    shares: 42,
    musicTrack: 'Lena_X • Neo-Tokyo Live Jam (Exclusive)',
    isVerified: true,
    comments: [
      { id: 'c1', author: 'CyberPioneer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', text: 'Incroyable setup Lena ! Tu utilises quelle marque de filtre ? 🎛️', time: '2h', likes: 24 },
      { id: 'c2', author: 'Kaelen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', text: 'Ce drop à la 30ème seconde est monstrueux ! 🔥', time: '1h', likes: 12 },
      { id: 'c3', author: 'Aria_Wave', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', text: 'Futuriste ! Ça rentre direct en boucle dans mes écouteurs.', time: '30m', likes: 7 }
    ]
  },
  {
    id: 'reel-2',
    creatorName: 'kaelen_afri_tech',
    creatorUsername: 'kaelen_afri_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
    caption: 'Session freestyle nocturne sous la pluie 🌧️✨ Célébration de la nouvelle mise à jour exclusive de l\'application Axora ! #freestyle #dance #urban #street',
    likes: 8952,
    commentsCount: 2,
    shares: 119,
    musicTrack: 'kaelen_afri_tech • Electric Rain (Original Mix)',
    isVerified: true,
    comments: [
      { id: 'c4', author: 'DancerXYZ', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', text: 'La fluidité de tes mouvements est irréelle ! Chapeau 👑', time: '5h', likes: 82 },
      { id: 'c5', author: 'VaporDave', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', text: 'Le cadrage sous la pluie donne une vibe cyberpunk magique', time: '3h', likes: 45 }
    ]
  },
  {
    id: 'reel-3',
    creatorName: 'Aurora Designer',
    creatorUsername: 'aurora_designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    caption: 'Création d\'une interface neumorphisme et glassmorphism ultra-lisse sous Figma en 15 minutes chrono ! ✨💻 #uiux #uxdesign #figmalove #webdev',
    likes: 2304,
    commentsCount: 2,
    shares: 22,
    musicTrack: 'aurora_designer • Ambient Lofi Chill Pill',
    isVerified: false,
    comments: [
      { id: 'c6', author: 'PixelArtisan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', text: 'Tutoriel rapide et tellement clair ! Tu partages le fichier figma ? 😍', time: '1j', likes: 38 },
      { id: 'c7', author: 'DevFiona', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', text: 'Je vais coder ça en CSS immédiatement ! Superbes couleurs !', time: '18h', likes: 19 }
    ]
  }
];

export function AxoraReels({ coins, setCoins }: AxoraReelsProps) {
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Interaction states for specific reels
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  
  // Custom feedback animations
  const [doubleTapHearts, setDoubleTapHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showPlayPauseAnim, setShowPlayPauseAnim] = useState<'play' | 'pause' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Interactive comment drawer
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [friendQuery, setFriendQuery] = useState('');
  const [sentToFriends, setSentToFriends] = useState<string[]>([]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heartCounterRef = useRef(0);

  const activeReel = reels[activeIndex];

  // Auto clean toaster
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Scroll handler to detect which video is in view
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex && index >= 0 && index < reels.length) {
      setActiveIndex(index);
      setPaused(false); // Reset pause state on scroll
    }
  };

  const handleNextReel = () => {
    if (activeIndex < reels.length - 1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.clientHeight * (activeIndex + 1),
        behavior: 'smooth'
      });
    }
  };

  const handlePrevReel = () => {
    if (activeIndex > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.clientHeight * (activeIndex - 1),
        behavior: 'smooth'
      });
    }
  };

  // Double tap handler
  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add custom floating heart
    heartCounterRef.current += 1;
    const newHeart = { id: heartCounterRef.current, x, y };
    setDoubleTapHearts(prev => [...prev, newHeart]);
    
    // Mark as liked if not already
    const reelId = activeReel.id;
    if (!likedReels[reelId]) {
      setLikedReels(prev => ({ ...prev, [reelId]: true }));
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, likes: r.likes + 1 } : r));
    }

    // Auto clean floating heart
    setTimeout(() => {
      setDoubleTapHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  // Single tap play/pause toggle
  const handleScreenTap = (e: React.MouseEvent) => {
    // Avoid tapping on action buttons or bottom area
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('.no-tap-trigger')) return;

    setPaused(!paused);
    setShowPlayPauseAnim(paused ? 'play' : 'pause');
    setTimeout(() => setShowPlayPauseAnim(null), 600);
  };

  // Toggle Like manually
  const toggleLike = (reelId: string) => {
    const isLiked = likedReels[reelId];
    setLikedReels(prev => ({ ...prev, [reelId]: !isLiked }));
    setReels(prev => prev.map(r => r.id === reelId ? { 
      ...r, 
      likes: isLiked ? r.likes - 1 : r.likes + 1 
    } : r));
    
    if (!isLiked) {
      showToast('Axora Reel Liké !');
    }
  };

  // Toggle follow creator
  const toggleFollow = (username: string) => {
    const isFollowing = followedCreators[username];
    setFollowedCreators(prev => ({ ...prev, [username]: !isFollowing }));
    if (!isFollowing) {
      showToast(`Vous suivez désormais @${username} !`);
    } else {
      showToast(`Désabonné de @${username}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const toggleCommentLike = (commentId: string) => {
    const wasLiked = commentLikes[commentId];
    setCommentLikes(prev => ({ ...prev, [commentId]: !wasLiked }));
    setReels(prev => prev.map(reel => ({
      ...reel,
      comments: reel.comments.map(comment => comment.id === commentId
        ? { ...comment, likes: comment.likes + (wasLiked ? -1 : 1) }
        : comment
      )
    })));
  };

  const shareReel = (destination: string) => {
    setReels(prev => prev.map(reel => reel.id === activeReel.id
      ? { ...reel, shares: reel.shares + 1 }
      : reel
    ));
    if (destination === 'Copier') {
      navigator.clipboard?.writeText(`https://axora.app/reels/${activeReel.id}`).catch(() => {});
      showToast('Lien du Reel copié !');
    } else {
      showToast(`Reel prêt pour ${destination}`);
    }
  };

  // Submit comment
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const myComment: Comment = {
      id: `my-comment-${Date.now()}`,
      author: 'Vous (Auteur)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
      text: newCommentText.trim(),
      time: 'Instant',
      likes: 0
    };

    setReels(prev => prev.map(r => {
      if (r.id === activeReel.id) {
        return {
          ...r,
          commentsCount: r.commentsCount + 1,
          comments: [myComment, ...r.comments]
        };
      }
      return r;
    }));

    setNewCommentText('');
    setShowStickers(false);
    showToast('Commentaire publié !');
  };

  return (
    <div className="w-full h-full relative bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Scrollable multi-reel viewport */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => {
          const isLiked = likedReels[reel.id];
          const isFollowing = followedCreators[reel.creatorUsername];

          return (
            <div 
              key={reel.id}
              className="w-full h-full flex-shrink-0 snap-start relative flex flex-col justify-end bg-zinc-950 overflow-hidden"
              style={{ height: '100%' }}
            >
              {/* Media background overlay */}
              <div 
                className="absolute inset-0 w-full h-full active:opacity-95 select-none"
                onClick={handleScreenTap}
                onDoubleClick={handleDoubleTap}
              >
                <img 
                  referrerPolicy="no-referrer"
                  src={reel.mediaUrl} 
                  alt={reel.caption} 
                  className={`w-full h-full object-cover transition-all duration-700 ${paused ? 'scale-102 filter brightness-[0.45]' : 'scale-100'}`}
                />

                {/* Cyber gradients overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 pointer-events-none z-10" />
                
                {/* Simulated ambient light glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[400px] aspect-square rounded-full opacity-20 filter blur-[110px] pointer-events-none"
                  style={{
                    background: index % 2 === 0 
                      ? 'radial-gradient(circle, #FF2D55 0%, transparent 70%)'
                      : 'radial-gradient(circle, #A855F7 0%, transparent 70%)'
                  }}
                />
              </div>

              {/* TOP HEADER: Axora mini logo on left, Muted state and Reel index on right */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20 pointer-events-none select-none">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-widest italic font-mono text-[#FF2D55] filter drop-shadow-[0_0_8px_rgba(255,45,85,0.7)] uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/5">
                    reels
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button 
                    onClick={() => setMuted(!muted)}
                    className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/75 cursor-pointer transition-all active:scale-95"
                    title={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <span className="text-[10px] text-zinc-400 font-mono font-bold bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                    {index + 1} / {reels.length}
                  </span>
                </div>
              </div>

              {/* ACTION COMPONENT LEFT FOR NAVIGATION (Desktop helpers button to go up/down) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden md:flex">
                <button 
                  onClick={handlePrevReel}
                  disabled={index === 0}
                  className="p-1 px-2 text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/5 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextReel}
                  disabled={index === reels.length - 1}
                  className="p-1 px-2 text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/5 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* RIGHT ACTION CONTROLS PANEL */}
              <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5 z-20 no-tap-trigger">
                {/* Creator Avatar with follow overlay */}
                <div className="relative mb-2">
                  <img 
                    src={reel.avatar} 
                    alt={reel.creatorName} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-red-500 shadow-lg shadow-black/50 bg-[#141416]"
                  />
                  <button 
                    onClick={() => toggleFollow(reel.creatorUsername)}
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border text-white transition-all scale-105 active:scale-90 cursor-pointer ${
                      isFollowing 
                        ? 'bg-emerald-500 border-white/25 hover:bg-emerald-600' 
                        : 'bg-[#FF2D55] border-white/20 hover:bg-red-600 shadow-[0_0_8px_#FF2D55]'
                    }`}
                  >
                    {isFollowing ? (
                      <Check className="w-3 h-3 stroke-[3px]" />
                    ) : (
                      <Plus className="w-3 h-3 stroke-[3px]" />
                    )}
                  </button>
                </div>

                {/* LIKE ACTION: Flame of Axora */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => toggleLike(reel.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border backdrop-blur-md transition-all active:scale-90 duration-300 cursor-pointer ${
                      isLiked 
                        ? 'bg-[#FF2D55]/20 border-[#FF2D55]/60 text-[#FF2D55] shadow-[0_0_12px_rgba(255,45,85,0.45)]' 
                        : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                    }`}
                  >
                    <Flame className={`w-5.5 h-5.5 transition-all ${isLiked ? 'fill-[#FF2D55] scale-110' : ''}`} />
                  </button>
                  <span className={`text-[10px] font-bold font-mono mt-1 ${isLiked ? 'text-[#FF2D55]' : 'text-zinc-300'}`}>
                    {reel.likes.toLocaleString()}
                  </span>
                </div>

                {/* COMMENT SECTION CHAT BUTTON */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setCommentDrawerOpen(true)}
                    className="w-11 h-11 bg-black/40 border border-white/10 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-zinc-300 font-bold font-mono mt-1">
                    {reel.commentsCount}
                  </span>
                </div>

                {/* SHARE DEBATE BUTTON */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setActiveIndex(index);
                      setShareDrawerOpen(true);
                    }}
                    className="w-11 h-11 bg-black/40 border border-white/10 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-zinc-300 font-bold font-mono mt-1">
                    {reel.shares}
                  </span>
                </div>

                {/* SPINNING MUSIC VINYL ROTATOR */}
                <div className="relative mt-2 flex flex-col items-center justify-center pointer-events-none select-none">
                  <div className={`w-9 h-9 rounded-full border border-zinc-700 bg-zinc-950 p-1 flex items-center justify-center ${paused ? '' : 'animate-spin'}`} style={{ animationDuration: '6s' }}>
                    <div className="w-full h-full rounded-full bg-zinc-900 border-2 border-[#FF2D55]/30 flex items-center justify-center overflow-hidden">
                      <Music className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </div>
                  {/* Music note particles drifting upward */}
                  {!paused && (
                    <div className="absolute -top-3 right-0 flex flex-col gap-0.5 animate-pulse text-[10px] text-red-400">
                      <span>♫</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM COLUMN CONTENT: Caption, Author Tags and scrolling music title */}
              <div className="p-4 pr-16 bg-gradient-to-t from-black via-black/80 to-transparent min-h-36 flex flex-col justify-end z-10 pointer-events-none select-none pb-26 no-tap-trigger">
                <div className="flex items-center gap-2 mb-2 pointer-events-auto">
                  <h4 className="text-sm font-black text-white tracking-wide flex items-center gap-1">
                    {reel.creatorName}
                    {reel.isVerified && (
                      <VerifiedBadge size={16} />
                    )}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">@{reel.creatorUsername}</span>
                  
                  {!isFollowing && (
                    <button 
                      onClick={() => toggleFollow(reel.creatorUsername)}
                      className="text-[9px] px-2 py-0.5 border border-[#FF2D55] text-[#FF2D55] rounded-md font-extrabold uppercase hover:bg-[#FF2D55]/10 cursor-pointer"
                    >
                      Suivre
                    </button>
                  )}
                </div>

                <p className="text-xs text-zinc-200 font-sans leading-relaxed line-clamp-2 md:line-clamp-none italic pr-4">
                  {reel.caption}
                </p>

                {/* Scrolling Audio track row */}
                <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-400 font-mono bg-white/[0.04] border border-white/5 py-1 px-2.5 rounded-lg w-max max-w-full">
                  <Music className="w-3.5 h-3.5 text-[#FF2D55]" />
                  <div className="overflow-hidden whitespace-nowrap w-36 sm:w-48 relative">
                    <span className="inline-block animate-marquee">
                      {reel.musicTrack} • {reel.musicTrack}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reels continuous progress line bar */}
              <div className="w-full h-1 bg-white/10 absolute bottom-[72px] left-0 z-30 pointer-events-none">
                <div 
                  className={`h-full bg-[#FF2D55] filter drop-shadow-[0_0_6px_#FF2D55] transition-all`}
                  style={{ 
                    width: paused ? '60%' : '100%',
                    transitionDuration: paused ? '0ms' : '15000ms',
                    animation: paused ? 'none' : 'progressWidth 15s linear infinite'
                  }}
                />
              </div>

              {/* SINGLE TAP PLAY/PAUSE ICON OVERLAY FEEDBACK */}
              <AnimatePresence>
                {showPlayPauseAnim && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white shadow-xl">
                      {showPlayPauseAnim === 'pause' ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DOUBLE TAP HEART CLICK VISUAL FEEDBACKS */}
              {doubleTapHearts.map(heart => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 0, scale: 0, x: heart.x - 32, y: heart.y - 32, rotate: Math.random() * 30 - 15 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.4, 1.2, 0.8], y: heart.y - 120 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute z-40 text-[#FF2D55] pointer-events-none"
                >
                  <Flame className="w-16 h-16 fill-[#FF2D55] filter drop-shadow-[0_0_12px_rgba(255,45,85,0.7)]" />
                </motion.div>
              ))}

            </div>
          );
        })}
      </div>

      {/* REELS INTERACTIVE SIDE/BOTTOM COMMENT DRAWER OVERLAY */}
      <AnimatePresence>
        {commentDrawerOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Dark glass backdrop layout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentDrawerOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Comment Drawer container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-h-[82dvh] sm:max-h-[70%] bg-zinc-950 rounded-t-[26px] sm:rounded-t-[32px] border-t border-white/10 flex flex-col z-10"
            >
              {/* Drag controller bar */}
              <div className="w-full flex justify-center py-3 cursor-pointer" onClick={() => setCommentDrawerOpen(false)}>
                <div className="w-12 h-1 bg-zinc-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/45">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Commentaires de Débats</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Participez pour gagner +15 Coins 🪙</p>
                </div>
                <button 
                  onClick={() => setCommentDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable list of comments */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {activeReel.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 text-xs bg-white/[0.01] border border-white/[0.02] p-3 rounded-2xl">
                    <img 
                      src={comment.avatar} 
                      alt={comment.author} 
                      className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-[11px]">{comment.author}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{comment.time}</span>
                      </div>
                      <p className="text-zinc-300 pr-4 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCommentLike(comment.id)}
                      className={`flex flex-col items-center gap-1 pt-1 min-w-8 ${
                        commentLikes[comment.id] ? 'text-[#FF2D55]' : 'text-zinc-500'
                      }`}
                      aria-label="Aimer ce commentaire"
                    >
                      <Heart className={`w-3.5 h-3.5 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                      <span className="text-[8px] font-mono">{comment.likes}</span>
                    </button>
                  </div>
                ))}
                
                {activeReel.comments.length === 0 && (
                  <p className="text-center text-zinc-500 text-xs py-10 font-mono italic">Soyez le premier à lancer le débat ! 🔥</p>
                )}
              </div>

              {/* Add a comment active form input */}
              <form onSubmit={handleSendComment} className="relative p-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/5 bg-zinc-900/60 backdrop-blur-md">
                {showStickers && (
                  <div className="absolute left-4 bottom-full mb-2 p-2 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                    {['🔥', '✨', '💯', '👏', '❤️‍🔥', '🚀', '🎨', '🫶'].map(sticker => (
                      <button
                        key={sticker}
                        type="button"
                        onClick={() => {
                          setNewCommentText(prev => `${prev}${sticker}`);
                          setShowStickers(false);
                        }}
                        className="w-10 h-10 rounded-xl text-lg hover:bg-white/5 hover:scale-110 transition-all"
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 items-center bg-zinc-950/80 border border-zinc-800 rounded-2xl px-3 py-1.5 focus-within:border-[#FF2D55] transition-colors">
                  <button
                    type="button"
                    onClick={() => setShowStickers(prev => !prev)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-400/10"
                    aria-label="Ajouter un sticker"
                  >
                    <Smile className="w-4.5 h-4.5" />
                  </button>
                  <input 
                    type="text" 
                    required
                    placeholder="Ajouter votre avis dans le débat..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs text-white outline-none placeholder:text-zinc-500 focus:ring-0"
                  />
                  <button 
                    type="submit"
                    className="p-1 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-[10px] font-black uppercase tracking-wider"
                  >
                    <span>Envoyer</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AXORA SHARE DRAWER */}
      <AnimatePresence>
        {shareDrawerOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareDrawerOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              aria-label="Fermer le partage"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full max-h-[86dvh] sm:max-h-[78%] overflow-y-auto rounded-t-[26px] sm:rounded-t-[32px] border-t border-white/10 bg-zinc-950 text-white pb-[env(safe-area-inset-bottom)]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-zinc-950/95 px-5 py-4 backdrop-blur-md">
                <div>
                  <h3 className="text-xs font-black">Partager ce Reel</h3>
                  <p className="mt-0.5 text-[9px] text-zinc-500">Dans Axora ou sur une autre plateforme</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShareDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <h4 className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">Amis Axora</h4>
                  <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input
                      value={friendQuery}
                      onChange={event => setFriendQuery(event.target.value)}
                      placeholder="Rechercher un ami…"
                      className="flex-1 bg-transparent outline-none text-[11px] text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'lena', name: 'Lena X', username: 'Lena_X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
                      { id: 'kaelen', name: 'Kaelen AfriTech', username: 'kaelen_afri_tech', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80' },
                      { id: 'sarah', name: 'Sarah Jenkins', username: 'sara_jenk', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80' },
                      { id: 'axora', name: 'Axora Social', username: 'axora_social', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&q=80' }
                    ]
                      .filter(friend => `${friend.name} ${friend.username}`.toLowerCase().includes(friendQuery.toLowerCase()))
                      .map(friend => {
                        const isSent = sentToFriends.includes(friend.id);
                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => {
                              if (!isSent) {
                                setSentToFriends(prev => [...prev, friend.id]);
                                shareReel(friend.name);
                              }
                            }}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                              isSent ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 hover:bg-white/5'
                            }`}
                          >
                            <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                            <span className="flex-1 min-w-0">
                              <span className="block truncate text-[11px] font-bold">{friend.name}</span>
                              <span className="block truncate text-[9px] text-zinc-500">@{friend.username}</span>
                            </span>
                            {isSent ? <Check className="w-4 h-4 text-emerald-500" /> : <Send className="w-3.5 h-3.5 text-[#FF2D55]" />}
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">Autres plateformes</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {[
                      { name: 'WhatsApp', mark: 'W', color: '#22C55E' },
                      { name: 'Facebook', mark: 'f', color: '#1877F2' },
                      { name: 'X', mark: '𝕏', color: '#18181B' },
                      { name: 'Telegram', mark: 'T', color: '#229ED9' }
                    ].map(network => (
                      <button key={network.name} type="button" onClick={() => shareReel(network.name)} className="flex flex-col items-center gap-2 shrink-0">
                        <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg" style={{ backgroundColor: network.color }}>
                          {network.mark}
                        </span>
                        <span className="text-[9px] font-semibold">{network.name}</span>
                      </button>
                    ))}
                    <button type="button" onClick={() => shareReel('Copier')} className="flex flex-col items-center gap-2 shrink-0">
                      <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Copy className="w-5 h-5" />
                      </span>
                      <span className="text-[9px] font-semibold">Copier</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM FLOATING MICRO-TOAST SUCCESS NOTIFICATIONS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute bottom-24 z-50 bg-[#0F0F10] border border-[#FF2D55]/30 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow-xl shadow-[#FF2D55]/10 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS marquee styling for custom scrolling tracks */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 16s linear infinite;
        }
        @keyframes progressWidth {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

    </div>
  );
}
