import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VerifiedBadge } from './VerifiedBadge';
import { Post, SavedContent } from '../types';
import ProfilePostsGallery from './ProfilePostsGallery';
import { ReelItem } from './AxoraReels';
import ProfileReelsGrid from './ProfileReelsGrid';
import ProfileConnectionsModal from './ProfileConnectionsModal';
import AccountSecurityPanel from './AccountSecurityPanel';
import GlobalSettingsPanel from './GlobalSettingsPanel';
import { 
  Moon, Sun, Users, Send,
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Star, 
  Sparkles, 
  User, 
  Flame, 
  Clapperboard, 
  MoreVertical, 
  Globe, 
  Cpu, 
  Share2,
  ExternalLink,
  MessageSquare,
  Edit,
  X,
  Check,
  Settings,
  LogOut,
  Key,
  Mail,
  ChevronLeft,
  Copy
} from 'lucide-react';

interface AtelierProfileProps {
  isCurrentlyLive: boolean;
  setIsCurrentlyLive: (val: boolean) => void;
  isPrivateProfile: boolean;
  setIsPrivateProfile: (val: boolean) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onLogout: () => void;
  onViewReelProfile?: (creator: { name: string; username: string; avatar: string }) => void;
  onCreatePost: () => void;
  onProfileEditorChange?: (open: boolean) => void;
  savedItems: SavedContent[];
}

export default function AtelierProfile({
  isCurrentlyLive,
  setIsCurrentlyLive,
  isPrivateProfile,
  setIsPrivateProfile,
  coins,
  setCoins,
  setCurrentTab,
  isDark,
  theme,
  setTheme,
  onLogout,
  onViewReelProfile,
  onCreatePost,
  onProfileEditorChange,
  savedItems
}: AtelierProfileProps) {
  const [profileSubTab, setProfileSubTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [scrolledPast, setScrolledPast] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  
  // Custom states for interactive elements
  const [showAuraDetails, setShowAuraDetails] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [localFollowers, setLocalFollowers] = useState(14820);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followerSearch, setFollowerSearch] = useState('');
  const [isJoinedPopSession, setIsJoinedPopSession] = useState(false);
  const [isAuraPublic, setIsAuraPublic] = useState(() => localStorage.getItem('axo_isAuraPublic') !== 'false');
  const followers = [
    { id: 'f1', name: 'Lena X', username: '@lena_x', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', mutual: '12 amis en commun' },
    { id: 'f2', name: 'Kaelen Afri Tech', username: '@kaelen_afri_tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', mutual: '8 amis en commun' },
    { id: 'f3', name: 'Sarah Chloé', username: '@sarah_chloe', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', mutual: '5 amis en commun' },
    { id: 'f4', name: 'Liam Sterling', username: '@liam_sterling', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', mutual: '3 amis en commun' },
    { id: 'f5', name: 'Neon Vibe', username: '@neon_vibe', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', mutual: '2 amis en commun' },
    { id: 'f6', name: 'DevCore', username: '@devcore', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', mutual: '1 ami en commun' }
  ];
  const visibleFollowers = followers.filter(follower =>
    `${follower.name} ${follower.username}`.toLowerCase().includes(followerSearch.toLowerCase())
  );
  const localFollowing = 384;

  // Dynamic Profile States
  const [profileName, setProfileName] = useState(() => localStorage.getItem('axo_profileName') || 'Auteur Invité');
  const [profileUsername, setProfileUsername] = useState(() => localStorage.getItem('axo_profileUsername') || '@alex_axora');
  const [profileBio, setProfileBio] = useState(() => localStorage.getItem('axo_profileBio') || '🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créateur passionné de l\'écosystème Axora. Toujours à l\'affût d\'échanges bienveillants !');
  const [profileLink, setProfileLink] = useState(() => localStorage.getItem('axo_profileLink') || '');
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem('axo_profileAvatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80');

  // Editing control state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    onProfileEditorChange?.(isEditingProfile);
    return () => onProfileEditorChange?.(false);
  }, [isEditingProfile, onProfileEditorChange]);

  // Settings Panel States
  const [isViewingSettings, setIsViewingSettings] = useState(false);
  const [settingsCurrentPassword, setSettingsCurrentPassword] = useState('');
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('mayalaflorin@gmail.com');
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Temporal Form States for Edit Modes
  const [formName, setFormName] = useState(profileName);
  const [formUsername, setFormUsername] = useState(profileUsername);
  const [formBio, setFormBio] = useState(profileBio);
  const [formLink, setFormLink] = useState(profileLink);
  const [formIsAuraPublic, setFormIsAuraPublic] = useState(isAuraPublic);

  // Sync back on form update if profile state changes
  useEffect(() => {
    setFormName(profileName);
    setFormUsername(profileUsername);
    setFormBio(profileBio);
    setFormLink(profileLink);
    setFormIsAuraPublic(isAuraPublic);
  }, [profileName, profileUsername, profileBio, profileLink, isAuraPublic]);

  // Save profile helper
  const handleSaveProfile = () => {
    // Basic validations
    if (!formName.trim()) {
      alert("⚠️ Le nom d'auteur ne peut pas être vide !");
      return;
    }
    const cleanUsername = formUsername.trim().startsWith('@') ? formUsername.trim() : `@${formUsername.trim()}`;
    const rawLink = formLink.trim();
    const cleanLink = rawLink && !/^https?:\/\//i.test(rawLink) ? `https://${rawLink}` : rawLink;

    if (cleanLink) {
      try {
        const parsedLink = new URL(cleanLink);
        if (!['http:', 'https:'].includes(parsedLink.protocol)) throw new Error('Unsupported protocol');
      } catch {
        alert('⚠️ Entrez un lien valide, par exemple https://monsite.com');
        return;
      }
    }
    
    setProfileName(formName.trim());
    setProfileUsername(cleanUsername);
    setProfileBio(formBio.trim());
    setProfileLink(cleanLink);
    setIsAuraPublic(formIsAuraPublic);

    localStorage.setItem('axo_profileName', formName.trim());
    localStorage.setItem('axo_profileUsername', cleanUsername);
    localStorage.setItem('axo_profileBio', formBio.trim());
    localStorage.setItem('axo_profileLink', cleanLink);
    localStorage.setItem('axo_isAuraPublic', String(formIsAuraPublic));

    setIsEditingProfile(false);
  };

  interface PostComment {
    id: string;
    username: string;
    avatar: string;
    text: string;
    date: string;
    likes?: number;
    liked?: boolean;
    replies?: PostComment[];
  }

  interface PostItem {
    id: string;
    title: string;
    text: string;
    imageUrl: string;
    date: string;
    likes: number;
    shares?: number;
    commentsCount?: number;
    comments?: PostComment[];
  }

  const [profilePosts, setProfilePosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('axo_profile_instagram_posts_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fall back
      }
    }
    return [
      {
        id: 'p1',
        title: 'AXORA REDESIGN V2',
        text: 'Redesigning Axora Web v2. Une étude de style Bento combinant le verre poli et le minimalisme néon.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
        date: "Il y a 2 heures",
        likes: 245,
        commentsCount: 2,
        comments: [
          { id: 'c1', username: 'Alex_N', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', text: 'Magnifique design bento! 🔥', date: "Il y a 1h" },
          { id: 'c2', username: 'Lena_X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Incroyable travail sur les couleurs d\'accentuation !', date: "Il y a 30m" }
        ]
      },
      {
        id: 'p2',
        title: 'CODE REVIEWS',
        text: 'Revues de Code Interactives. Comment l\'écoute audio live en salon Pop améliore le cycle de review de 40% sans stress ni délai.',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        date: "Hier",
        likes: 198,
        commentsCount: 1,
        comments: [
          { id: 'c3', username: 'DevCore', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'Totalement d\'accord, les salons audio de discussion changent la donne !', date: "Hier" }
        ]
      },
      {
        id: 'p3',
        title: 'TECH GLOBE SUMMIT',
        text: 'Tech Globe Summit. Perspectives et retours passionnants de notre premier meetup physique au cœur de l\'Africa Tech Hub.',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
        date: "Il y a 3 jours",
        likes: 312,
        commentsCount: 1,
        comments: [
          { id: 'c4', username: 'Sarah_K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'Une ambiance inspirante, on se voit à la prochaine édition !', date: "Il y a 2 jours" }
        ]
      },
      {
        id: 'p4',
        title: 'COSY CODE HOURS',
        text: 'Le setup parfait du développeur nocturne : un café chaud, des lignes de code fluides et une douce lueur néon magenta.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        date: "Il y a 5 jours",
        likes: 156,
        commentsCount: 0,
        comments: []
      },
      {
        id: 'p5',
        title: 'MINIMALIST STUDIO',
        text: 'Inspiration et productivité épurée. Voici l\'espace idéal pour concevoir des expériences utilisateurs mémorables.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
        date: "Il y a 1 semaine",
        likes: 289,
        commentsCount: 3,
        comments: [
          { id: 'c5', username: 'Neon_Vibe', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', text: 'Très classe, j\'adore la sobriété !', date: "Il y a 6j" }
        ]
      },
      {
        id: 'p6',
        title: 'POP MATCH RUNNING',
        text: 'Session de brainstorming intense en direct. La communauté valide le déploiement de la version premium sur le store.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
        date: "Il y a 2 semaines",
        likes: 420,
        commentsCount: 0,
        comments: []
      }
    ];
  });

  const [matchStatus, setMatchStatus] = useState<'liked' | 'disliked' | null>(() => {
    return localStorage.getItem('axo_match_status') as 'liked' | 'disliked' | null;
  });
  const [matchCount, setMatchCount] = useState(() => {
    return Number(localStorage.getItem('axo_match_count') || '847');
  });

  const handleMatchLike = () => {
    if (matchStatus === 'liked') {
      setMatchStatus(null);
      setMatchCount(prev => {
        const val = prev - 1;
        localStorage.setItem('axo_match_count', String(val));
        return val;
      });
      localStorage.removeItem('axo_match_status');
    } else {
      setMatchStatus('liked');
      setMatchCount(prev => {
        const val = prev + 1;
        localStorage.setItem('axo_match_count', String(val));
        return val;
      });
      localStorage.setItem('axo_match_status', 'liked');
    }
  };

  const handleMatchDislike = () => {
    if (matchStatus === 'disliked') {
      setMatchStatus(null);
      localStorage.removeItem('axo_match_status');
    } else {
      const wasLiked = matchStatus === 'liked';
      setMatchStatus('disliked');
      if (wasLiked) {
        setMatchCount(prev => {
          const val = Math.max(0, prev - 1);
          localStorage.setItem('axo_match_count', String(val));
          return val;
        });
      }
      localStorage.setItem('axo_match_status', 'disliked');
    }
  };

  // Instagram Lightbox State
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [postViewMode, setPostViewMode] = useState<'media' | 'comments'>('media');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);
  const [sharePostOpen, setSharePostOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const saveSelectedPost = (post: PostItem) => {
    const updatedPosts = profilePosts.map(item => item.id === post.id ? post : item);
    setProfilePosts(updatedPosts);
    setSelectedPost(post);
    localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify(updatedPosts));
  };

  const openProfilePost = (post: PostItem) => {
    setSelectedPost(post);
    setPostViewMode('media');
    setSharePostOpen(false);
    setReplyingTo(null);
    setNewCommentText('');
  };

  const toggleSelectedPostFlame = () => {
    if (!selectedPost) return;
    const isLiked = Boolean(likedItems[selectedPost.id]);
    setLikedItems(previous => ({ ...previous, [selectedPost.id]: !isLiked }));
    saveSelectedPost({
      ...selectedPost,
      likes: Math.max(0, selectedPost.likes + (isLiked ? -1 : 1))
    });
  };

  const toggleProfileCommentFlame = (commentId: string, parentId?: string) => {
    if (!selectedPost) return;
    const toggle = (comment: PostComment): PostComment => comment.id === commentId
      ? { ...comment, liked: !comment.liked, likes: Math.max(0, (comment.likes || 0) + (comment.liked ? -1 : 1)) }
      : comment;
    const comments = (selectedPost.comments || []).map(comment => parentId === comment.id
      ? { ...comment, replies: (comment.replies || []).map(toggle) }
      : toggle(comment)
    );
    saveSelectedPost({ ...selectedPost, comments });
  };

  const shareProfilePost = async (destination: string) => {
    if (!selectedPost) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#profile-post-${selectedPost.id}`;
    if (destination === 'Copier') {
      await navigator.clipboard?.writeText(shareUrl);
      setShareFeedback('Lien copié');
    } else if (destination === 'Plus' && navigator.share) {
      await navigator.share({ title: selectedPost.title, text: selectedPost.text, url: shareUrl });
      setShareFeedback('Publication partagée');
    } else {
      setShareFeedback(`Partagé sur ${destination}`);
    }
    saveSelectedPost({ ...selectedPost, shares: (selectedPost.shares || 0) + 1 });
    window.setTimeout(() => setShareFeedback(''), 2200);
  };

  // Aura Score calculation
  const auraScore = 15420 + (isCurrentlyLive ? 1200 : 0) + (isPrivateProfile ? -500 : 800) + (isJoinedPopSession ? 350 : 0);

  // Monitor parent scroll container
  useEffect(() => {
    const scrollContainer = document.getElementById('main-app-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrolledPast(scrollContainer.scrollTop > 80);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const isLiked = !prev[id];
      // Toggled successfully
      return { ...prev, [id]: isLiked };
    });
  };

  const handleCreatePostAlert = () => {
    alert("✨ Mode Profil : Formulaire de création d'un Post/Reel premium initialisé !");
  };

  const profileReels: ReelItem[] = profilePosts.slice(0, 6).map(post => ({
    id: `my-reel-${post.id}`,
    creatorName: profileName,
    creatorUsername: profileUsername.replace(/^@/, ''),
    avatar: profileAvatar,
    mediaUrl: post.imageUrl,
    mediaType: 'image',
    caption: post.text,
    likes: post.likes,
    commentsCount: post.comments?.length ?? post.commentsCount ?? 0,
    shares: post.shares ?? 0,
    musicTrack: `${profileName} • Audio original`,
    isVerified: true,
    comments: [],
  }));

  return (
    <div id="atelier-profile-screen" className="relative w-full min-h-screen bg-[var(--axo-bg)] text-inherit select-none">
      <AnimatePresence>
        {showAvatarMenu && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAvatarMenu(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Fermer" />
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className={`relative w-full max-w-sm rounded-[28px] border p-4 shadow-2xl ${isDark ? 'border-white/10 bg-[#141416]' : 'border-zinc-200 bg-white'}`}>
              <div className="flex items-center gap-3 px-2 pb-4">
                <img src={profileAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div><p className="text-sm font-black">{profileName}</p><p className="text-[10px] text-zinc-500">Votre photo de profil</p></div>
              </div>
              <button type="button" onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true); }} className="w-full rounded-2xl bg-[var(--axo-surface)] px-4 py-3 text-xs font-black text-[var(--axo-accent-wave)]">Voir la photo</button>
              <button type="button" onClick={() => setShowAvatarMenu(false)} className="mt-2 w-full rounded-2xl px-4 py-3 text-xs font-bold text-zinc-500">Annuler</button>
            </motion.div>
          </div>
        )}
        {showAvatarPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-black p-4">
            <button type="button" onClick={() => setShowAvatarPreview(false)} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white" aria-label="Fermer"><X className="h-5 w-5" /></button>
            <img src={profileAvatar} alt={`Photo de ${profileName}`} className="max-h-full max-w-full object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. One quiet brand tint shared by the whole profile surface. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Prime radial aura (AxoraPink) */}
        <div 
          className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[140%] md:w-[100%] aspect-square rounded-full opacity-15 filter blur-[100px] transition-all duration-[2000ms]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 45, 85, 0.22) 0%, transparent 68%)'
          }}
        />
      </div>

      {/* 2. DYNAMIC IMMERSIVE STICKY TOP BAR */}
      <div 
        id="atelier-sticky-topbar"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolledPast || isViewingSettings
            ? (isDark ? 'bg-[#0F0F0F]/90 border-b border-transparent text-white backdrop-blur-xl shadow-none' : 'bg-[var(--axo-bg)]/95 border-b border-[var(--axo-border)] text-zinc-900 backdrop-blur-xl shadow-none')
            : `bg-[var(--axo-bg)]/80 border-b border-transparent ${isDark ? 'text-white' : 'text-zinc-900'}`
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
          
          {/* Left Side: Back button if viewing settings, otherwise dynamic profile identity tag */}
          <div className="flex items-center gap-2">
            {isViewingSettings ? (
              <button 
                onClick={() => { setIsViewingSettings(false); setSettingsSuccessMsg(null); }}
                className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold font-mono"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
                <span>Retour au Profil</span>
              </button>
            ) : (
              <>
                {!scrolledPast ? (
                  <span className="text-[10px] font-black tracking-widest text-[#FF2D55] font-mono uppercase bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    AXORA PORTAL
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE]">
                      <img 
                        src={profileAvatar} 
                        alt="Mini Avatar" 
                        className="w-full h-full rounded-full object-cover border border-[#0F0F0F]"
                      />
                    </div>
                    <span className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{profileName}</span>
                    <VerifiedBadge size={14} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Center: settings context flag */}
          {isViewingSettings && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-black text-zinc-500 font-mono tracking-widest">
              <span>⚙️ PARAMÈTRES</span>
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 cursor-pointer active:scale-95"
              title="Paramètres & Actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Contextual Options Dropdown */}
            {showOptionsDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowOptionsDropdown(false)} />
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 ${
                  isDark ? 'bg-zinc-950/95 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
                }`}>
                  <button 
                    onClick={() => {
                      setIsViewingSettings(true);
                      setShowOptionsDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-zinc-800/10 rounded-xl transition-colors text-[11px] font-mono font-bold flex items-center gap-2 text-cyan-400 ${
                      isDark ? 'hover:text-white' : 'hover:text-cyan-600'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                    Paramètres du Compte
                  </button>
                  <div className={`h-[1px] my-1 ${isDark ? 'bg-white/5' : 'bg-zinc-200'}`} />
                  <button 
                    onClick={() => {
                      setIsEditingProfile(true);
                      setShowOptionsDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
                  >
                    <Edit className="w-3.5 h-3.5 text-[#FF2D55]" />
                    Modifier mon Profil
                  </button>
                  <button 
                    onClick={() => {
                      setIsPrivateProfile(!isPrivateProfile);
                      setShowOptionsDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 text-[#FF2D55] hover:text-[#FF2D55]/80"
                  >
                    {isPrivateProfile ? <Unlock className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-[#FF2D55]" />}
                    {isPrivateProfile ? 'Rendre le profil Public' : 'Rendre le profil Privé'}
                  </button>
                  <button 
                    onClick={() => {
                      const updated = !isAuraPublic;
                      setIsAuraPublic(updated);
                      localStorage.setItem('axo_isAuraPublic', String(updated));
                      setShowOptionsDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {isAuraPublic ? 'Masquer l\'Aura du profil' : 'Afficher l\'Aura publique'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsCurrentlyLive(!isCurrentlyLive);
                      setShowOptionsDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    {isCurrentlyLive ? "Désactiver le statut Live" : "Activer le statut Live"}
                  </button>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <button 
                    onClick={() => {
                      const recipient = window.prompt('Envoyer votre profil à quel @identifiant ?', '@Lena_X');
                      if (!recipient?.trim()) return;
                      window.dispatchEvent(new CustomEvent('axora:share-profile', { detail: { recipient: recipient.trim().replace(/^@/, ''), name: profileName, username: profileUsername, avatar: profileAvatar, bio: profileBio } }));
                      setShowOptionsDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    Partager le Profil
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. CORE PROFILE CONTENT (Max scroll integration as a single unit) */}
      {isViewingSettings ? (
        <div className="max-w-3xl mx-auto px-4 pb-16 relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-[32px] overflow-hidden border p-6 sm:p-8 space-y-8 shadow-none ${isDark ? 'border-transparent bg-transparent text-white' : 'border-transparent bg-transparent text-slate-900 [&_.text-white]:!text-slate-900 [&_.text-zinc-400]:!text-slate-600'}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2 text-left">
                  <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Paramètres du Compte</h2>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-1 text-left">Gérez votre identité, votre confidentialité et vos informations de sécurité</p>
              </div>
              <button
                onClick={() => { setIsViewingSettings(false); setSettingsSuccessMsg(null); }}
                className={`p-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/[0.05]' : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {settingsSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settingsSuccessMsg}</span>
              </motion.div>
            )}

            <section className={`space-y-3 rounded-2xl border p-4 text-left ${isDark ? 'border-cyan-400/15 bg-cyan-400/[0.03]' : 'border-cyan-200 bg-cyan-50/70'}`}>
              <div>
                <h3 className="text-[10px] font-black tracking-widest text-cyan-600 uppercase font-mono">Apparence</h3>
                <p className={`mt-1 text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Choisissez une palette confortable et lisible pour votre écran.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition-all ${theme === 'dark' ? 'border-[#FF2D55] bg-[#17171A] text-white shadow-lg shadow-[#FF2D55]/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                >
                  <Moon className="h-4 w-4" /> Sombre
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition-all ${theme === 'light' ? 'border-cyan-500 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300'}`}
                >
                  <Sun className="h-4 w-4" /> Clair
                </button>
              </div>
            </section>

            {/* Section 1: Informations de compte */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black tracking-widest text-[#22D3EE] uppercase font-mono text-left">Informations Générales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">E-mail de contact</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-[#0F0F0F]/60 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/25">
                      <CheckCircle className="w-2.5 h-2.5" /> G-Workspace
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Nom d'Auteur</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => {
                        setProfileName(e.target.value);
                        localStorage.setItem('axo_profileName', e.target.value);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-[#0F0F0F]/60 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs font-mono text-left">
                <div className="space-y-0.5">
                  <span className="text-zinc-400 block font-bold">Identifiant système</span>
                  <span className="text-[#FF2D55] font-black">{profileUsername}</span>
                </div>
                <span className="px-2.5 py-1 bg-white/5 rounded-lg text-zinc-400 text-[10px]">Utilisateur Vérifié</span>
              </div>
            </div>

            {/* Section 2: Paramètres de Confidentialité */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono text-left">Confidentialité & Visibilité</h3>
              
              <div className="grid grid-cols-1 gap-3.5 text-left">
                {/* Profile privacy */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <div className="space-y-1 pr-4 text-left">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      {isPrivateProfile ? <Lock className="w-3.5 h-3.5 text-rose-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>Visibilité du Compte</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal max-w-md">
                      {isPrivateProfile ? 'Compte Privé : Vos publications de Live et vos jalons ne sont visibles que par vos abonnés approuvés.' : 'Compte Public : Tout utilisateur d\'Axora peut consulter votre profil et s\'abonner à vos Lives.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivateProfile(!isPrivateProfile)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPrivateProfile ? 'bg-zinc-805' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isPrivateProfile ? 'translate-x-0' : 'translate-x-5'
                      }`}
                    />
                  </button>
                </div>

                {/* Aura privacy */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <div className="space-y-1 pr-4 text-left">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Afficher mon score d'Aura public</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal max-w-md">
                      Permettez aux membres d'Axora de voir vos scores d'Aura cumulés ainsi que vos jalons d'activité.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const val = !isAuraPublic;
                      setIsAuraPublic(val);
                      localStorage.setItem('axo_isAuraPublic', String(val));
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isAuraPublic ? 'bg-gradient-to-r from-[#FF2D55] to-[#A855F7]' : 'bg-zinc-805'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAuraPublic ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Live presence switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <div className="space-y-1 pr-4 text-left">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Star className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Statut de présence en direct (Live)</span>
                    </div>
                    <p className="text-[10px] text-zinc-450 leading-normal max-w-md">
                      Affichez le halo vibrant de présence interactive de manière automatique sur votre profil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCurrentlyLive(!isCurrentlyLive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isCurrentlyLive ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-zinc-805'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isCurrentlyLive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Changer le mot de passe */}
            <div className="space-y-4 pt-4 border-t border-white/5 text-left">
              <h3 className="text-[10px] font-black tracking-widest text-[#22D3EE] uppercase font-mono block">Changer le mot de passe</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Actuel</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settingsCurrentPassword}
                    onChange={(e) => setSettingsCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-[#0F0F0F]/60 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Nouveau</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settingsNewPassword}
                    onChange={(e) => setSettingsNewPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-[#0F0F0F]/60 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Confirmation</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settingsConfirmPassword}
                    onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-[#0F0F0F]/60 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!settingsCurrentPassword || !settingsNewPassword || !settingsConfirmPassword) {
                    alert("⚠️ Veuillez remplir tous les champs !");
                    return;
                  }
                  if (settingsNewPassword !== settingsConfirmPassword) {
                    alert("⚠️ Les mots de passe ne correspondent pas !");
                    return;
                  }
                  setSettingsCurrentPassword('');
                  setSettingsNewPassword('');
                  setSettingsConfirmPassword('');
                  setSettingsSuccessMsg("🔐 Mot de passe mis à jour de manière cryptée !");
                }}
                className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 text-xs font-black tracking-wider text-cyan-400 hover:text-white hover:border-cyan-400/60 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                Confirmer l'enregistrement du mot de passe
              </button>
            </div>

            <GlobalSettingsPanel isDark={isDark} theme={theme} setTheme={setTheme} coins={coins} setCoins={setCoins} />
            <AccountSecurityPanel isDark={isDark} onLogout={onLogout} />

            {/* Section 4: Log Out */}
            <div className="space-y-4 pt-4 border-t border-white/5 text-left">
              <h3 className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono block">Déconnexion</h3>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-5 py-3 rounded-2xl bg-[#FF2D55]/10 border border-[#FF2D55]/30 hover:bg-[#FF2D55]/20 text-xs font-black tracking-wider text-[#FF2D55] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#FF2D55]" />
                Se déconnecter de l'espace membre
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 pb-16 relative z-10 space-y-4 sm:space-y-6">
          {/* PROFILE HEADER CARD */}
          <div id="atelier-header-card" className={`relative rounded-[22px] sm:rounded-[32px] overflow-hidden border p-4 sm:p-6 flex flex-col items-stretch text-left gap-4 sm:gap-6 shadow-none ${
            isDark ? 'border-transparent bg-transparent text-white' : 'border-transparent bg-transparent text-zinc-900'
          }`}>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left w-full">
              
              {/* VIBRANT SWEEP GRADIENT AVATAR */}
              <div className="relative group flex-shrink-0 select-none">
                
                <button
                  type="button"
                  onClick={() => setShowAvatarMenu(true)}
                  className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr cursor-pointer transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
                    isCurrentlyLive 
                      ? 'from-[#FF2D55] via-red-500 to-red-800' 
                      : 'from-zinc-700 via-zinc-800 to-zinc-700'
                  }`}
                  title="Cliquez pour permuter entre Live et Story"
                >
                  <img 
                    src={profileAvatar} 
                    alt={`${profileName} profile`} 
                    className={`w-full h-full rounded-full object-cover border-4 bg-zinc-950 ${isDark ? 'border-[#141416]' : 'border-white'}`} 
                    referrerPolicy="no-referrer"
                  />
                </button>
              </div>

              {/* NAME, BADGE, AND SUBTITLE */}
              <div className="space-y-2 flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                <div className="flex flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className={`text-xl sm:text-2.5xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>{profileName}</h1>
                  
                  <VerifiedBadge size={18} />
                </div>

                <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs font-mono text-center sm:text-left ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span className="text-[#FF2D55] font-extrabold">{profileUsername}</span>
                  {profileLink && (
                    <>
                      <span className={`${isDark ? 'text-zinc-650' : 'text-zinc-300'}`}>•</span>
                      <a
                        href={profileLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[240px] items-center gap-1 truncate font-semibold transition-colors hover:text-[#FF2D55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D55] focus-visible:ring-offset-2"
                      >
                        <Globe className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{profileLink.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* PROFILE BIO */}
            <div className="space-y-3 w-full text-center sm:text-left">
              <p className={`text-xs sm:text-sm leading-relaxed px-2 sm:px-0 ${isDark ? 'text-zinc-350' : 'text-zinc-700'}`}>
                {profileBio}
              </p>
            </div>

            {/* AXORA SOUL MATCHMAKER */}
            <div className={`p-4 sm:p-5 rounded-[20px] sm:rounded-3xl border w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 relative overflow-hidden select-none transition-all duration-300 hover:shadow-lg ${
              isDark 
                ? 'border-transparent bg-transparent'
                : 'border-transparent bg-transparent'
            }`}>
              {/* Title & Info */}
              <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-black tracking-widest text-[#FF2D55] font-mono bg-[#FF2D55]/10 px-2.5 py-1 rounded-md uppercase">
                    AXORA AFFINITÉ
                  </span>
                  {matchStatus === 'liked' && (
                    <span className="text-[9px] font-black text-[#FF2D55] font-mono flex items-center gap-0.5">
                      🔥 ADORÉ !
                    </span>
                  )}
                  {matchStatus === 'disliked' && (
                    <span className="text-[9px] font-black text-zinc-400 font-mono flex items-center gap-0.5">
                      ❌ PASSÉ
                    </span>
                  )}
                </div>
                <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {matchStatus === 'liked' 
                    ? "La flamme est allumée !" 
                    : matchStatus === 'disliked' 
                      ? "Vous n'êtes pas intéressé(e)" 
                      : "Êtes-vous intéressé(e) par ce profil ?"}
                </h4>
                <p className={`text-[11px] leading-relaxed max-w-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {matchStatus === 'liked' 
                    ? `Vous soutenez activement le travail de cet artiste.`
                    : matchStatus === 'disliked' 
                      ? `Ce profil est ignoré de votre radar d'affinité. Vous pouvez modifier votre choix.`
                      : `Allumez la flamme pour dire que vous aimez ou cliquez sur la croix pour passer.`}
                </p>
              </div>

              {/* Interactive Tinder Action Cluster */}
              <div className="flex flex-col xs:flex-row items-center gap-4 w-full sm:w-auto self-stretch sm:self-auto border-t sm:border-y-0 border-zinc-500/10 xs:border-t-0 pt-4 xs:pt-0">
                <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                  {/* Left option: Dislike / Cross Button */}
                  <button
                    onClick={handleMatchDislike}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 relative group cursor-pointer ${
                      matchStatus === 'disliked'
                        ? 'bg-[#FF2D55]/20 border-[#FF2D55] text-[#FF2D55] scale-102 shadow-lg shadow-[#FF2D55]/10'
                        : isDark
                          ? 'border-white/10 bg-zinc-950 text-zinc-500 hover:text-[#FF2D55] hover:border-[#FF2D55]/40 hover:bg-zinc-900 hover:scale-105'
                          : 'border-zinc-300 bg-white text-zinc-400 hover:text-[#FF2D55] hover:border-[#FF2D55]/40 hover:bg-zinc-100 hover:scale-105'
                    }`}
                    title="Pas intéressé(e)"
                  >
                    <X className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-90 ${matchStatus === 'disliked' ? 'scale-110 font-bold' : ''}`} />
                    {matchStatus !== 'disliked' && (
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-zinc-900 text-white text-[8px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-50">
                        Passer
                      </span>
                    )}
                  </button>

                  {/* Right option: Like / Flame Button */}
                  <button
                    onClick={handleMatchLike}
                    className={`w-13 h-13 rounded-full border flex items-center justify-center transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                      matchStatus === 'liked'
                        ? 'bg-[#FF2D55] border-[#FF2D55] text-white scale-105 shadow-lg shadow-[#FF2D55]/20'
                        : isDark
                          ? 'border-white/10 bg-zinc-950 text-[#FF2D55] hover:border-[#FF2D55]/40 hover:bg-zinc-900 hover:scale-105'
                          : 'border-zinc-350 bg-white text-[#FF2D55] hover:border-[#FF2D55]/40 hover:bg-zinc-50 hover:scale-105'
                    }`}
                    title="Intéressé(e) / Allumer la Flamme"
                  >
                    {/* Pulsing light for like state */}
                    {matchStatus === 'liked' && (
                      <span className="absolute inset-0 bg-white/10 animate-ping rounded-full pointer-events-none" />
                    )}
                    <Flame className={`w-5.5 h-5.5 transition-all duration-300 group-hover:scale-115 ${
                      matchStatus === 'liked' ? 'fill-white text-white' : 'fill-transparent'
                    }`} />
                    {matchStatus !== 'liked' && (
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-zinc-900 text-white text-[8px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-50">
                        Adorer
                      </span>
                    )}
                  </button>
                </div>

                {/* Score display column inside the widget */}
                <div className="flex flex-row xs:flex-col items-center justify-center xs:justify-start font-mono gap-1.5 xs:gap-0 min-w-full sm:min-w-[80px] border-t xs:border-t-0 xs:border-l border-zinc-500/10 pt-3 xs:pt-0 xs:pl-4 select-none w-full sm:w-auto">
                  <span className="text-[8px] font-black text-zinc-550 uppercase tracking-widest">Score match</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-md font-black tracking-tight ${matchStatus === 'liked' ? 'text-[#FF2D55]' : (isDark ? 'text-white' : 'text-zinc-900')}`}>
                      {matchCount}
                    </span>
                    <span className="text-[7.5px] text-zinc-550 font-bold uppercase">étincelles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center select-none">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsPrivateProfile(!isPrivateProfile)}
                  className={`px-4 sm:px-5 py-3 rounded-2xl border text-xs font-black tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full xs:w-auto ${
                    isDark 
                      ? 'border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.03] active:scale-[0.97]' 
                      : 'border-zinc-250 bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 hover:scale-[1.03] active:scale-[0.97]'
                  }`}
                >
                  {isPrivateProfile ? <Lock className="w-3.5 h-3.5 text-[#FF2D55]" /> : <Unlock className="w-3.5 h-3.5 text-[#FF2D55]" />}
                  {isPrivateProfile ? 'PRIVÉ' : 'PUBLIC'}
                </button>

                <button 
                  onClick={() => {
                    setFormName(profileName);
                    setFormUsername(profileUsername);
                    setFormBio(profileBio);
                    setFormLink(profileLink);
                    setIsEditingProfile(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl border border-[#FF2D55]/20 bg-[#FF2D55]/10 text-xs font-black tracking-wider text-[#FF2D55] hover:text-white hover:bg-[#FF2D55]/20 hover:border-[#FF2D55]/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#FF2D55]" />
                  MODIFIER LE PROFIL
                </button>
              </div>

              <button 
                onClick={onCreatePost}
                className="w-full sm:w-auto px-6 py-3 bg-[#FF2D55] hover:bg-[#e11d48] text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-[#FF2D55]/15 transition-all duration-300 cursor-pointer text-center"
              >
                Créer un post
              </button>
            </div>
          </div>

        {/* GAMIFIED STATS PILL SECTION (With Pulsating AURA score) */}
        <div id="atelier-stats-pill" className={`relative p-1 rounded-3xl border shadow-none overflow-hidden group ${
          isDark ? 'border-transparent bg-transparent' : 'border-transparent bg-transparent'
        }`}>
          
          <div className={`grid grid-cols-4 items-center justify-between text-center select-none divide-x ${
            isDark ? 'divide-white/5' : 'divide-zinc-200'
          }`}>
            {/* Posts Count */}
            <div className="py-4 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono">POSTS</span>
              <div className={`text-2xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>11</div>
              <span className="text-[8px] text-zinc-500 font-medium font-mono">Publications</span>
            </div>

            {/* Followers with dynamic stats trend */}
            <button
              type="button"
              onClick={() => setShowFollowers(true)}
              className="py-4 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[#A855F7]/5 focus:outline-none"
              aria-label="Voir les followers"
            >
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono">FOLLOWERS</span>
              <div className={`text-2xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {(localFollowers / 1000).toFixed(1)}K
              </div>
              <div className="text-[8px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5 font-mono">
                <TrendingUp className="w-2.5 h-2.5" /> +12.4%
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowFollowing(true)}
              className="py-4 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[#FF2D55]/5 focus:outline-none"
              aria-label="Voir les comptes suivis"
            >
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono">SUIVIS</span>
              <div className={`text-2xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{localFollowing}</div>
              <span className="text-[8px] text-zinc-500 font-medium font-mono mt-1.5">Abonnements</span>
            </button>

            {/* Pulsating Premium "AURA" Capsule */}
            <div 
              onClick={() => setShowAuraDetails(!showAuraDetails)}
              className="py-4 relative flex flex-col items-center justify-center cursor-pointer overflow-hidden group/aura group-hover:bg-white/[0.01]"
              title="Cliquez pour voir les critères d'AURA"
            >
              <div className="absolute inset-0.5 rounded-2xl group-hover/aura:bg-[#FF2D55]/[0.02] transition-colors duration-500" />
              
              <span className="text-[9px] font-black tracking-widest text-[#FF2D55] uppercase font-mono flex items-center gap-1 relative z-10">
                <Sparkles className="w-3 h-3 text-[#FF2D55]" /> AURA SCORE
              </span>
              <div className="text-2xl font-black text-[#FF2D55] mt-1 relative z-10 tracking-tight">
                {auraScore.toLocaleString()}
              </div>
              <div className="text-[8px] text-zinc-500 font-bold mt-1 flex items-center gap-1.5 font-mono relative z-10">
                <span>⭐ Élite Rang III</span>
                <span className="text-zinc-500">•</span>
                <span className={isAuraPublic ? 'text-zinc-500' : 'text-[#FF2D55]'}>
                  {isAuraPublic ? '🔓 Auras Publiques' : '🔒 Auras Privées'}
                </span>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showAuraDetails && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-4 pt-2 border-t border-white/5 bg-black/20 text-xs text-zinc-400 space-y-2.5 font-mono"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-white/90">
                  <span>DÉTAIL DU CRÉDIT SOCIAL (AURA)</span>
                  <span className="text-amber-400">Bonus Score</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span>Base Social Score</span>
                    <span className="text-zinc-200">15 420 AP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bonus Engagement Live ({isCurrentlyLive ? 'Actif' : 'Inactif'})</span>
                    <span className={isCurrentlyLive ? 'text-emerald-400' : 'text-zinc-500'}>
                      {isCurrentlyLive ? '+1 200 AP' : '0 AP'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Score de Transparence Publique</span>
                    <span className={!isPrivateProfile ? 'text-emerald-400' : 'text-rose-500'}>
                      {!isPrivateProfile ? '+800 AP' : '-500 AP'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pop Session Facilitator ({isJoinedPopSession ? 'Engagé' : 'Libre'})</span>
                    <span className={isJoinedPopSession ? 'text-cyan-400' : 'text-zinc-500'}>
                      {isJoinedPopSession ? '+350 AP' : '0 AP'}
                    </span>
                  </div>
                </div>
                <p className="text-[8px] text-zinc-500 leading-normal pt-1.5 border-t border-white/5 italic">
                  *Le score AURA est calculé de manière décentralisée sur l'écosystème Axora v2. Participez aux Lives Pop et tenez vos objectifs pour booster le score de votre Profil.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* INTERACTIVE COMPONENT WITH SLIDING UNDERLINE (The Content Matrix Tabs Section) */}
        <div className="pt-2 flex flex-col space-y-6">
          <div className="flex justify-center select-none">
            <div className={`inline-flex items-center p-1 rounded-2xl border backdrop-blur-lg shadow-inner ${
              isDark ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent'
            }`}>
              <button 
                onClick={() => setProfileSubTab('posts')}
                className={`text-[10px] sm:text-xs font-bold tracking-[0.15em] font-mono relative px-5 py-2.5 rounded-xl transition-colors duration-300 cursor-pointer ${
                  profileSubTab === 'posts' 
                    ? (isDark ? 'text-white' : 'text-zinc-900') 
                    : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800')
                }`}
              >
                POSTS
                {profileSubTab === 'posts' && (
                  <motion.span 
                    layoutId="activeSubTab" 
                    className={`absolute inset-0 rounded-xl border -z-10 ${
                      isDark ? 'bg-white/[0.04] border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-white border-zinc-300/80 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              
              <button 
                onClick={() => setProfileSubTab('reels')}
                className={`text-[10px] sm:text-xs font-bold tracking-[0.15em] font-mono relative px-5 py-2.5 rounded-xl transition-colors duration-300 cursor-pointer ${
                  profileSubTab === 'reels' 
                    ? (isDark ? 'text-white' : 'text-zinc-900') 
                    : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800')
                }`}
              >
                REELS
                {profileSubTab === 'reels' && (
                  <motion.span 
                    layoutId="activeSubTab" 
                    className={`absolute inset-0 rounded-xl border -z-10 ${
                      isDark ? 'bg-white/[0.04] border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-white border-zinc-300/80 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              <button 
                onClick={() => setProfileSubTab('saved')}
                className={`text-[10px] sm:text-xs font-bold tracking-[0.15em] font-mono relative px-5 py-2.5 rounded-xl transition-colors duration-300 cursor-pointer ${
                  profileSubTab === 'saved' 
                    ? (isDark ? 'text-white' : 'text-zinc-900') 
                    : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800')
                }`}
              >
                SAVED
                {profileSubTab === 'saved' && (
                  <motion.span 
                    layoutId="activeSubTab" 
                    className={`absolute inset-0 rounded-xl border -z-10 ${
                      isDark ? 'bg-white/[0.04] border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-white border-zinc-300/80 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* PORTFOLIO GRIDS WITH CONTRASTED GLASS OVERLAYS */}
          <div className="profile-content-grid min-h-[250px]">
            {profileSubTab === 'posts' && (
              <div className="space-y-5">
                <ProfilePostsGallery
                  isDark={isDark}
                  posts={profilePosts.map((post): Post => ({
                    id: post.id,
                    author: profileName,
                    username: profileUsername.replace(/^@/, ''),
                    avatar: profileAvatar,
                    text: post.text,
                    image: post.imageUrl,
                    likes: post.likes,
                    comments: post.comments?.length ?? post.commentsCount ?? 0,
                    shares: post.shares ?? 0,
                    isLiked: Boolean(likedItems[post.id]),
                    time: post.date,
                  }))}
                />
              </div>
            )}

            {/* REELS PORTFOLIO GRID */}
            {profileSubTab === 'reels' && (
              <div className="w-full overflow-hidden">
                <ProfileReelsGrid reels={profileReels} coins={coins} setCoins={setCoins} onViewProfile={onViewReelProfile} />
                {false && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Reel item 1 */}
                <div className={`rounded-3xl border p-1.5 relative group overflow-hidden cursor-pointer shadow-2xl aspect-[9/16] ${
                  isDark ? 'border-white/5 bg-[#141416]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" 
                    alt="Reels Tutorial preview" 
                    className="w-full h-full object-cover rounded-[22px] filter saturate-[1.1] transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glassplay indicator hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF2D55] shadow-lg">
                      <Clapperboard className="w-5 h-5 fill-[#FF2D55]" />
                    </div>
                    <span className="text-[9px] text-white font-black tracking-widest font-mono uppercase">LIRE LE REEL</span>
                  </div>
                  <div className={`absolute inset-x-2 bottom-2 p-3 rounded-2xl backdrop-blur-md border select-none ${
                    isDark ? 'bg-zinc-950/70 border-white/10 text-white/90' : 'bg-white/80 border-zinc-250 text-zinc-900 shadow-sm'
                  }`}>
                    <div className="text-[9px] font-black truncate">Tuto Axora v2 Design</div>
                    <div className="text-[8px] text-[#FF2D55] font-extrabold mt-0.5">1.2M vues</div>
                  </div>
                </div>

                {/* Reel item 2 */}
                <div className={`rounded-3xl border p-1.5 relative group overflow-hidden cursor-pointer shadow-2xl aspect-[9/16] ${
                  isDark ? 'border-white/5 bg-[#141416]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80" 
                    alt="Crypto live review" 
                    className="w-full h-full object-cover rounded-[22px] filter saturate-[1.1] transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF2D55] shadow-lg">
                      <Clapperboard className="w-5 h-5 fill-[#FF2D55]" />
                    </div>
                    <span className="text-[9px] text-white font-black tracking-widest font-mono uppercase">LIRE LE REEL</span>
                  </div>
                  <div className={`absolute inset-x-2 bottom-2 p-3 rounded-2xl backdrop-blur-md border select-none ${
                    isDark ? 'bg-zinc-950/70 border-white/10 text-white/90' : 'bg-white/80 border-zinc-250 text-zinc-900 shadow-sm'
                  }`}>
                    <div className="text-[9px] font-black truncate">Debat Pop Crypto</div>
                    <div className="text-[8px] text-[#FF2D55] font-extrabold mt-0.5">840K vues</div>
                  </div>
                </div>

                {/* Reel item 3 */}
                <div className={`rounded-3xl border p-1.5 relative group overflow-hidden cursor-pointer shadow-2xl aspect-[9/16] ${
                  isDark ? 'border-white/5 bg-[#141416]' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80" 
                    alt="Interactive codes" 
                    className="w-full h-full object-cover rounded-[22px] filter saturate-[1.1] transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF2D55] shadow-lg">
                      <Clapperboard className="w-5 h-5 fill-[#FF2D55]" />
                    </div>
                    <span className="text-[9px] text-white font-black tracking-widest font-mono uppercase">LIRE LE REEL</span>
                  </div>
                  <div className={`absolute inset-x-2 bottom-2 p-3 rounded-2xl backdrop-blur-md border select-none ${
                    isDark ? 'bg-zinc-950/70 border-white/10 text-white/90' : 'bg-white/80 border-zinc-250 text-zinc-900 shadow-sm'
                  }`}>
                    <div className="text-[9px] font-black truncate">Code Review session</div>
                    <div className="text-[8px] text-[#FF2D55] font-extrabold mt-0.5">420K vues</div>
                  </div>
                </div>
                </div>}
              </div>
            )}

            {/* SAVED PORTFOLIO GRID */}
            {profileSubTab === 'saved' && (
              savedItems.length > 0 ? (
                <div className="columns-2 gap-4 space-y-4 sm:columns-3">
                  {savedItems.map(item => (
                    <article key={`${item.type}-${item.id}`} className={`break-inside-avoid overflow-hidden rounded-3xl border shadow-lg ${isDark ? 'border-white/5 bg-[#141416]/80' : 'border-zinc-200 bg-zinc-50/90'}`}>
                      {item.image && <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" />}
                      <div className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-2 text-[9px] font-mono text-zinc-500">
                          <span>{item.type === 'reel' ? 'REEL' : 'PUBLICATION'} · @{item.username}</span>
                          <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />
                        </div>
                        <p className={`line-clamp-4 text-[11px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.text}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.reasons.includes('liked') && <span className="rounded-full bg-[#FF2D55]/10 px-2 py-1 text-[8px] font-black text-[#FF2D55]">AIMÉ</span>}
                          {item.reasons.includes('shared') && <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[8px] font-black text-cyan-400">PARTAGÉ</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={`rounded-3xl border border-dashed p-10 text-center ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-300 bg-zinc-50'}`}>
                  <Star className="mx-auto mb-3 h-7 w-7 text-amber-400" />
                  <h4 className="text-sm font-black">Aucun contenu sauvegardé</h4>
                  <p className="mt-1 text-[11px] text-zinc-500">Les publications et Reels que vous aimez ou partagez apparaîtront ici.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    )}

        {/* FULL-SCREEN PROFILE EDITOR */}
        <AnimatePresence>
          {isEditingProfile && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-editor-title"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`fixed inset-0 z-[100] overflow-y-auto ${isDark ? 'bg-[#09090B] text-white' : 'bg-[#FAFAFA] text-zinc-950'}`}
            >
              <div className="mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))] sm:px-8 lg:px-12">
                {/* Header */}
                <div className={`sticky top-0 z-10 -mx-4 mb-8 flex items-center justify-between border-b px-4 py-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 ${isDark ? 'border-white/10 bg-[#09090B]' : 'border-zinc-200 bg-[#FAFAFA]'}`}>
                  <div>
                    <h3 id="profile-editor-title" className="flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl">
                      <Sparkles className="h-5 w-5 text-[#FF2D55]" aria-hidden="true" />
                      Modifier mon Profil
                    </h3>
                    <p className={`mt-1 text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Mettez à jour les informations visibles par votre communauté.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    aria-label="Fermer l’édition du profil"
                    className={`rounded-full p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D55] ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950'}`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 select-text">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="profile-name" className="block text-[11px] font-black uppercase tracking-widest text-[#FF2D55]">
                      Nom d'Auteur
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Auteur Invité"
                      autoComplete="name"
                      className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors focus:border-[#FF2D55] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600' : 'border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400'}`}
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="profile-username" className="block text-[11px] font-black uppercase tracking-widest text-[#A855F7]">
                      Identifiant unique
                    </label>
                    <input
                      id="profile-username"
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="@alex_axora"
                      autoComplete="username"
                      className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors focus:border-[#A855F7] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/20 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600' : 'border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400'}`}
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label htmlFor="profile-bio" className={`block text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Bio de Présentation
                    </label>
                    <textarea 
                      id="profile-bio"
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Décrivez votre présentation..."
                      rows={5}
                      className={`w-full resize-none rounded-2xl border px-4 py-3.5 text-sm font-medium leading-relaxed transition-colors focus:border-[#FF2D55] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600' : 'border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400'}`}
                    />
                  </div>

                  {/* Website or social profile */}
                  <div className="space-y-2">
                    <label htmlFor="profile-link" className="block text-[11px] font-black uppercase tracking-widest text-cyan-500">
                      Site ou réseau social
                    </label>
                    <div className="relative">
                      <Globe className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} aria-hidden="true" />
                      <input
                        id="profile-link"
                        type="url"
                        inputMode="url"
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        placeholder="https://monsite.com"
                        autoComplete="url"
                        className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm font-semibold transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600' : 'border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-400'}`}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">Ajoutez votre site, portfolio ou le réseau social que vous souhaitez mettre en avant.</p>
                  </div>

                  {/* Aura Privacy toggle in modal */}
                  <div className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
                    <div>
                      <span className="block text-[11px] font-black uppercase tracking-widest text-[#FF2D55]">
                        Confidentialité de l'Aura
                      </span>
                      <span className={`mt-1 block text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {formIsAuraPublic ? 'Auras Publiques (Affichées sur le profil)' : 'Auras Privées (Masquées aux autres)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormIsAuraPublic(!formIsAuraPublic)}
                      role="switch"
                      aria-checked={formIsAuraPublic}
                      aria-label="Rendre les Auras publiques"
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D55] focus-visible:ring-offset-2 ${
                        formIsAuraPublic ? 'bg-gradient-to-r from-[#FF2D55] to-[#A855F7]' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formIsAuraPublic ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className={`sticky bottom-0 mx-auto mt-10 flex w-full max-w-2xl flex-col-reverse gap-3 border-t py-4 select-none sm:flex-row sm:justify-end ${isDark ? 'border-white/10 bg-[#09090B]' : 'border-zinc-200 bg-[#FAFAFA]'}`}>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className={`rounded-2xl border px-5 py-3 text-xs font-black tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D55] ${isDark ? 'border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white' : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'}`}
                  >
                    ANNULER
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#FF2D55]/15 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D55] focus-visible:ring-offset-2 active:scale-[0.98]"
                  >
                    ENREGISTRER <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {showFollowers && (
            <ProfileConnectionsModal
              mode="followers"
              count={localFollowers}
              people={followers.map(follower => ({
                id: follower.id,
                name: follower.name,
                username: follower.username,
                avatar: follower.avatar,
                detail: follower.mutual,
                verified: true,
              }))}
              onClose={() => setShowFollowers(false)}
            />
          )}

          {/* Legacy follower sheet retained only as reference. */}
          {false && showFollowers && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFollowers(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                className={`relative z-10 w-full max-w-md max-h-[82vh] rounded-[28px] border shadow-2xl overflow-hidden ${
                  isDark ? 'bg-[#101012] border-white/10' : 'bg-white border-zinc-200'
                }`}
              >
                <div className={`p-5 border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>Followers</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">{localFollowers.toLocaleString()} personnes vous suivent</p>
                    </div>
                    <button type="button" onClick={() => setShowFollowers(false)} className="p-2 rounded-full text-zinc-500 hover:bg-zinc-500/10" aria-label="Fermer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="search"
                    value={followerSearch}
                    onChange={event => setFollowerSearch(event.target.value)}
                    placeholder="Rechercher un follower…"
                    className={`w-full px-4 py-3 rounded-xl border text-xs outline-none focus:border-[#A855F7]/60 ${
                      isDark ? 'bg-zinc-900 border-white/5 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
                <div className="p-3 overflow-y-auto max-h-[58vh] custom-scrollbar">
                  {visibleFollowers.map(follower => (
                    <button
                      key={follower.id}
                      type="button"
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <img src={follower.avatar} alt={follower.name} className="w-11 h-11 rounded-full object-cover border border-white/10" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{follower.name}</span>
                          <VerifiedBadge size={13} />
                        </div>
                        <span className="block text-[10px] text-zinc-500 truncate">{follower.username}</span>
                        <span className="block text-[9px] text-[#A855F7] mt-0.5">{follower.mutual}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-zinc-600 rotate-180" />
                    </button>
                  ))}
                  {visibleFollowers.length === 0 && (
                    <div className="py-12 text-center">
                      <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                      <p className="text-xs text-zinc-500">Aucun follower trouvé</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {showFollowing && (
            <ProfileConnectionsModal
              mode="following"
              count={localFollowing}
              people={followers.map(follower => ({
                id: `following-${follower.id}`,
                name: follower.name,
                username: follower.username,
                avatar: follower.avatar,
                detail: 'Compte suivi',
                verified: true,
              })).reverse()}
              onClose={() => setShowFollowing(false)}
            />
          )}

          {/* Instagram Post Detail Lightbox Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              {postViewMode === 'media' ? (
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="relative z-10 w-full h-[100dvh] sm:h-[92vh] sm:max-w-4xl bg-black sm:rounded-[32px] overflow-hidden shadow-2xl flex items-center justify-center"
                >
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/55 border border-white/10 text-white backdrop-blur-md hover:bg-black/75"
                    aria-label="Fermer la publication"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-14 bg-gradient-to-t from-black via-black/75 to-transparent">
                    <div className="max-w-sm mx-auto grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={toggleSelectedPostFlame}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border backdrop-blur-md ${
                          likedItems[selectedPost.id] ? 'bg-[#FF2D55]/20 border-[#FF2D55]/40 text-[#FF2D55]' : 'bg-black/45 border-white/15 text-white'
                        }`}
                      >
                        <Flame className={`w-6 h-6 ${likedItems[selectedPost.id] ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-bold">{selectedPost.likes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostViewMode('comments')}
                        className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-black/45 border border-white/15 text-white backdrop-blur-md"
                      >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-[10px] font-bold">{selectedPost.comments?.length || 0}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSharePostOpen(true);
                          setPostViewMode('comments');
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-black/45 border border-white/15 text-white backdrop-blur-md"
                      >
                        <Share2 className="w-6 h-6" />
                        <span className="text-[10px] font-bold">{selectedPost.shares || 0}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
              /* Comments and interaction container */
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`relative w-full max-w-4xl h-[100dvh] sm:h-[94dvh] md:h-[600px] rounded-none sm:rounded-[32px] border overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 shadow-2xl ${
                  isDark ? 'border-white/10 bg-[#0F0F10]' : 'border-zinc-200 bg-white text-zinc-900 shadow-zinc-300'
                }`}
              >
                {/* 1. Left half (Image) */}
                <div className="md:col-span-7 relative flex flex-shrink-0 items-center justify-center bg-black h-[30dvh] min-h-[180px] max-h-[280px] md:h-[600px] md:max-h-none">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-contain md:object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 2. Right half (Interaction Feed & Comments) */}
                <div className="md:col-span-5 flex flex-col flex-1 min-h-0 md:h-[600px]">
                  {/* Header: Author & Options */}
                  <div className={`p-4 flex items-center justify-between border-b ${
                    isDark ? 'border-white/5 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSharePostOpen(false);
                          setPostViewMode('media');
                        }}
                        className="p-1.5 -ml-1 rounded-full text-zinc-500 hover:bg-zinc-500/10 hover:text-[#22D3EE]"
                        aria-label="Revenir à la photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <img 
                        src={profileAvatar} 
                        alt={profileUsername} 
                        className={`w-9 h-9 object-cover rounded-full border-2 ${isDark ? 'border-red-500/30' : 'border-zinc-300'}`}
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-1 leading-none mb-0.5">
                          <span className={`text-xs font-black font-sans ${isDark ? 'text-white' : 'text-zinc-900'}`}>{profileName}</span>
                          <VerifiedBadge size={14} />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 block">@{profileUsername}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Delete button for user posts */}
                      {selectedPost.id.startsWith('p_user_') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Voulez-vous supprimer ce post ?")) {
                              const updated = profilePosts.filter(p => p.id !== selectedPost.id);
                              setProfilePosts(updated);
                              localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify(updated));
                              setSelectedPost(null);
                            }
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Supprimer ce post"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      <button 
                        type="button" 
                        onClick={() => setSelectedPost(null)}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          isDark ? 'text-zinc-400 hover:bg-zinc-805 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Comments Feed Area */}
                  <div className={`p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar ${
                    isDark ? 'bg-[#0a0a0b]' : 'bg-white'
                  }`}>
                    {/* Caption Comment */}
                    <div className="flex gap-3 text-left">
                      <img 
                        src={profileAvatar} 
                        alt={profileUsername} 
                        className="w-7 h-7 object-cover rounded-full flex-shrink-0"
                      />
                      <div>
                        <span className={`text-xs font-black font-sans ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{profileUsername}</span>
                        <p className={`text-xs font-sans leading-relaxed mt-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {selectedPost.text}
                        </p>
                        <span className="text-[9px] font-mono text-zinc-500 mt-1 block">{selectedPost.date}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`h-[1px] ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`} />

                    {/* Subsequent Comments */}
                    {selectedPost.comments && selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((comment) => (
                        <div key={comment.id} className={`rounded-2xl p-3 ${isDark ? 'bg-white/[0.025]' : 'bg-zinc-50'}`}>
                          <div className="flex gap-3 text-left">
                            <img src={comment.avatar} alt={comment.username} className="w-8 h-8 object-cover rounded-full flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className={`text-xs font-black ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{comment.username}</span>
                              <p className={`text-xs leading-relaxed mt-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{comment.text}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[9px] font-mono text-zinc-500">{comment.date}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo(comment);
                                    setNewCommentText(`@${comment.username} `);
                                  }}
                                  className="text-[9px] font-black text-zinc-500 hover:text-[#22D3EE]"
                                >
                                  Répondre
                                </button>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleProfileCommentFlame(comment.id)}
                              className={`flex flex-col items-center gap-0.5 ${comment.liked ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-[#FF2D55]'}`}
                              aria-label="Aimer ce commentaire"
                            >
                              <Flame className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`} />
                              <span className="text-[8px] font-mono">{comment.likes || 0}</span>
                            </button>
                          </div>

                          {(comment.replies || []).map(reply => (
                            <div key={reply.id} className={`ml-8 mt-3 pl-3 border-l flex gap-2 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                              <img src={reply.avatar} alt={reply.username} className="w-6 h-6 rounded-full object-cover" />
                              <div className="min-w-0 flex-1 text-left">
                                <span className={`text-[10px] font-black ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{reply.username}</span>
                                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{reply.text}</p>
                                <span className="text-[8px] font-mono text-zinc-500">{reply.date}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleProfileCommentFlame(reply.id, comment.id)}
                                className={`flex flex-col items-center ${reply.liked ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-[#FF2D55]'}`}
                                aria-label="Aimer cette réponse"
                              >
                                <Flame className={`w-3.5 h-3.5 ${reply.liked ? 'fill-current' : ''}`} />
                                <span className="text-[8px]">{reply.likes || 0}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center opacity-60">
                        <MessageSquare className="w-8 h-8 text-zinc-500 stroke-[1.5] mb-2" />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500">AUCUN COMMENTAIRE</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: Likes & Add Comment */}
                  <div className={`p-4 border-t ${
                    isDark ? 'border-white/5 bg-zinc-900/10' : 'border-zinc-200 bg-zinc-50/50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => {
                            const isLiked = likedItems[selectedPost.id];
                            const updatedLikes = isLiked ? selectedPost.likes - 1 : selectedPost.likes + 1;
                            setLikedItems(prev => ({ ...prev, [selectedPost.id]: !isLiked }));
                            
                            // update state
                            const updatedPosts = profilePosts.map(p => {
                              if (p.id === selectedPost.id) {
                                return { ...p, likes: updatedLikes };
                              }
                              return p;
                            });
                            setProfilePosts(updatedPosts);
                            localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify(updatedPosts));
                            setSelectedPost(prev => prev ? { ...prev, likes: updatedLikes } : null);
                          }}
                          className="group focus:outline-none cursor-pointer"
                        >
                          <Flame className={`w-6 h-6 transition-transform group-hover:scale-110 active:scale-90 ${
                            likedItems[selectedPost.id] ? 'text-red-500 fill-red-500' : (isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950')
                          }`} />
                        </button>
                        <span className={`text-[11px] font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                          {selectedPost.likes} J’aime
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                          <MessageSquare className="w-4 h-4" /> {selectedPost.comments?.length || 0}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSharePostOpen(open => !open)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${sharePostOpen ? 'text-[#22D3EE]' : 'text-zinc-500 hover:text-[#22D3EE]'}`}
                      >
                        <Share2 className="w-4 h-4" /> {selectedPost.shares || 0}
                      </button>
                    </div>

                    <AnimatePresence>
                      {sharePostOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className={`mb-3 p-3 rounded-2xl border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>
                            <p className="text-[9px] font-black tracking-widest text-zinc-500 uppercase mb-2">Partager la publication</p>
                            <div className="grid grid-cols-4 gap-2">
                              {['Messages', 'WhatsApp', 'Facebook'].map(destination => (
                                <button key={destination} type="button" onClick={() => shareProfilePost(destination)} className={`py-2 rounded-xl text-[9px] font-bold ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
                                  {destination}
                                </button>
                              ))}
                              <button type="button" onClick={() => shareProfilePost('Copier')} className={`flex items-center justify-center gap-1 py-2 rounded-xl text-[9px] font-bold ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
                                <Copy className="w-3 h-3" /> Copier
                              </button>
                            </div>
                            {shareFeedback && <p className="mt-2 text-[9px] font-bold text-emerald-500"><Check className="inline w-3 h-3 mr-1" />{shareFeedback}</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Add Comment Input */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCommentText.trim()) return;
                        
                        const newComment: PostComment = {
                          id: `c_${Date.now()}`,
                          username: profileUsername,
                          avatar: profileAvatar,
                          text: newCommentText.trim(),
                          date: "À l'instant"
                        };

                        const updatedComments = replyingTo
                          ? (selectedPost.comments || []).map(comment => comment.id === replyingTo.id
                              ? { ...comment, replies: [...(comment.replies || []), newComment] }
                              : comment
                            )
                          : [...(selectedPost.comments || []), newComment];

                        saveSelectedPost({ ...selectedPost, comments: updatedComments, commentsCount: updatedComments.length });
                        setNewCommentText('');
                        setReplyingTo(null);
                      }}
                      className="flex gap-2 items-center pt-2 border-t border-zinc-200/5"
                    >
                      {replyingTo && (
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setNewCommentText('');
                          }}
                          className="text-[9px] text-[#22D3EE] font-bold whitespace-nowrap"
                        >
                          @{replyingTo.username} ×
                        </button>
                      )}
                      <input 
                        type="text" 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={replyingTo ? `Répondre à ${replyingTo.username}…` : "Ajouter un commentaire…"}
                        className={`flex-1 text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-red-500/50 ${
                          isDark ? 'bg-zinc-900 border-white/5 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                      <button 
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-wider disabled:opacity-40 select-none cursor-pointer pr-1"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
              )}
            </div>
          )}

          {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-sm rounded-[32px] border border-white/10 bg-[#0F0F10] p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-center"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2D55]/10 rounded-full filter blur-2xl -mr-8 -mt-8 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl -ml-8 -mb-8 pointer-events-none" />

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center text-[#FF2D55]">
                    {isLoggingOut ? (
                      <span className="flex h-5 w-5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-[#FF2D55] to-red-600"></span>
                      </span>
                    ) : (
                      <LogOut className="w-8 h-8" />
                    )}
                  </div>

                  <div className="space-y-1.5 text-center">
                    <h3 className="text-lg font-black text-white tracking-tight uppercase leading-none">
                      {isLoggingOut ? "Déconnexion..." : "Se déconnecter ?"}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                      {isLoggingOut 
                        ? "Fermeture sécurisée des sessions de l'écosystème Axora..." 
                        : "Êtes-vous certain de vouloir quitter votre profil et fermer la session active ?"}
                    </p>
                  </div>

                  {!isLoggingOut ? (
                    <div className="flex flex-col gap-2 w-full pt-4 select-none">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsLoggingOut(true);
                          setTimeout(() => {
                            setIsViewingSettings(false);
                            setShowLogoutConfirm(false);
                            setIsLoggingOut(false);
                            onLogout();
                          }, 1500);
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#FF2D55] text-white font-black text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#FF2D55]/15 active:scale-98 transition-all cursor-pointer"
                      >
                        CONFIRMER LA DÉCONNEXION
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="w-full py-3 rounded-2xl border border-white/10 bg-white/[0.02] text-xs font-bold tracking-wider text-zinc-405 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                      >
                        RESTER CONNECTÉ
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 flex items-center justify-center">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 animate-pulse">
                        DE-AUTHORIZATION PROTOCOL ACTIVE
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
