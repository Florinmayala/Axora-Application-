import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  Heart, 
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
  Sliders,
  Smile,
  MapPin,
  Users,
  Image as ImageIcon,
  Moon,
  Sun
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
  setTheme
}: AtelierProfileProps) {
  const [profileSubTab, setProfileSubTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [scrolledPast, setScrolledPast] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  
  // Custom states for interactive elements
  const [showAuraDetails, setShowAuraDetails] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [localFollowers, setLocalFollowers] = useState(14820);
  const [isJoinedPopSession, setIsJoinedPopSession] = useState(false);
  const [isAuraPublic, setIsAuraPublic] = useState(() => localStorage.getItem('axo_isAuraPublic') !== 'false');

  // Dynamic Profile States
  const [profileName, setProfileName] = useState(() => localStorage.getItem('axo_profileName') || 'Auteur Invité');
  const [profileUsername, setProfileUsername] = useState(() => localStorage.getItem('axo_profileUsername') || '@alex_axora');
  const [profileTagline, setProfileTagline] = useState(() => localStorage.getItem('axo_profileTagline') || 'Concepteur UI Premium');
  const [profileBio, setProfileBio] = useState(() => localStorage.getItem('axo_profileBio') || '🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créateur passionné de l\'écosystème Axora. Toujours à l\'affût d\'échanges bienveillants !');
  const [profileStatus, setProfileStatus] = useState(() => localStorage.getItem('axo_profileStatus') || 'Statut : Designer UI Premium');
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem('axo_profileAvatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80');

  // Editing control state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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
  const [formTagline, setFormTagline] = useState(profileTagline);
  const [formBio, setFormBio] = useState(profileBio);
  const [formStatus, setFormStatus] = useState(profileStatus);
  const [formAvatar, setFormAvatar] = useState(profileAvatar);
  const [formIsAuraPublic, setFormIsAuraPublic] = useState(isAuraPublic);

  // Sync back on form update if profile state changes
  useEffect(() => {
    setFormName(profileName);
    setFormUsername(profileUsername);
    setFormTagline(profileTagline);
    setFormBio(profileBio);
    setFormStatus(profileStatus);
    setFormAvatar(profileAvatar);
    setFormIsAuraPublic(isAuraPublic);
  }, [profileName, profileUsername, profileTagline, profileBio, profileStatus, profileAvatar, isAuraPublic]);

  // Save profile helper
  const handleSaveProfile = () => {
    // Basic validations
    if (!formName.trim()) {
      alert("⚠️ Le nom d'auteur ne peut pas être vide !");
      return;
    }
    const cleanUsername = formUsername.trim().startsWith('@') ? formUsername.trim() : `@${formUsername.trim()}`;
    
    setProfileName(formName.trim());
    setProfileUsername(cleanUsername);
    setProfileTagline(formTagline.trim());
    setProfileBio(formBio.trim());
    setProfileStatus(formStatus.trim());
    setProfileAvatar(formAvatar.trim());
    setIsAuraPublic(formIsAuraPublic);

    localStorage.setItem('axo_profileName', formName.trim());
    localStorage.setItem('axo_profileUsername', cleanUsername);
    localStorage.setItem('axo_profileTagline', formTagline.trim());
    localStorage.setItem('axo_profileBio', formBio.trim());
    localStorage.setItem('axo_profileStatus', formStatus.trim());
    localStorage.setItem('axo_profileAvatar', formAvatar.trim());
    localStorage.setItem('axo_isAuraPublic', String(formIsAuraPublic));

    setIsEditingProfile(false);
  };

  interface PostItem {
    id: string;
    title: string;
    text: string;
    imageUrl: string;
    date: string;
    likes: number;
    commentsCount?: number;
    comments?: Array<{
      id: string;
      username: string;
      avatar: string;
      text: string;
      date: string;
    }>;
  }

  // Predefined gorgeous photography covers for Instagram style posts
  const postImagePresets = [
    { name: 'Redesign Bento', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80' },
    { name: 'Code Terminal', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80' },
    { name: 'Africa Tech', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
    { name: 'Cyber Neon Lights', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80' },
    { name: 'Cozy Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80' },
    { name: 'Vapor Wave Dusk', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' }
  ];

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

  const [isAddingPost, setIsAddingPost] = useState(false);
  const [creationStep, setCreationStep] = useState<1 | 2 | 3 | 4>(1);
  const [cropRatio, setCropRatio] = useState<'1:1' | '16:9' | '4:5'>('1:1');
  const [selectedFilter, setSelectedFilter] = useState<string>('Normal');
  const [filterBrightness, setFilterBrightness] = useState<number>(100);
  const [filterContrast, setFilterContrast] = useState<number>(100);
  const [filterSaturation, setFilterSaturation] = useState<number>(100);
  const [filterBlur, setFilterBlur] = useState<number>(0);
  const [postLocation, setPostLocation] = useState<string>('');
  const [taggedUsers, setTaggedUsers] = useState<string>('');
  const [hideLikes, setHideLikes] = useState<boolean>(false);
  const [disableComments, setDisableComments] = useState<boolean>(false);

  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState(postImagePresets[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const getFilterStyleString = (filterName: string, b: number, c: number, s: number, blurVal: number) => {
    let base = '';
    switch (filterName) {
      case 'Clarendon':
        base = `brightness(${b * 1.1}%) contrast(${c * 1.2}%) saturate(${s * 1.25}%) hue-rotate(5deg)`;
        break;
      case 'Lark':
        base = `brightness(${b * 1.15}%) contrast(${c * 1.05}%) saturate(${s * 0.9}%)`;
        break;
      case 'Juno':
        base = `contrast(${c * 1.15}%) saturate(${s * 1.35}%) hue-rotate(-5deg)`;
        break;
      case 'Gingham':
        base = `brightness(${b * 1.05}%) contrast(${c * 0.9}%) saturate(${s * 0.85}%) sepia(20%)`;
        break;
      case 'Crema':
        base = `brightness(${b * 1.1}%) contrast(${c * 0.95}%) saturate(${s * 1.0}%) sepia(15%)`;
        break;
      case 'Slumber':
        base = `brightness(${b * 1.05}%) contrast(${c * 0.9}%) sepia(35%) saturate(${s * 0.7}%)`;
        break;
      default:
        base = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
        break;
    }
    if (blurVal > 0) {
      base += ` blur(${blurVal}px)`;
    }
    return base;
  };

  // Instagram Lightbox State
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

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

  return (
    <div id="atelier-profile-screen" className="relative w-full min-h-screen text-inherit select-none">
      
      {/* 1. ATELIER NEON BACKGROUND GLOW LAYERS (Organic Ambient Fusion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Prime radial aura (AxoraPink) */}
        <div 
          className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[140%] md:w-[100%] aspect-square rounded-full opacity-15 filter blur-[100px] transition-all duration-[2000ms]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 45, 85, 0.75) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 100%)'
          }}
        />
        {/* Secondary supportive light glow (AxoraCyan) */}
        <div 
          className="absolute top-[20%] left-[10%] w-[60%] aspect-square rounded-full opacity-10 filter blur-[90px]"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 80%)'
          }}
        />
        {/* Velvet neon grid accents */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 mix-blend-overlay" />
      </div>

      {/* 2. DYNAMIC IMMERSIVE STICKY TOP BAR */}
      <div 
        id="atelier-sticky-topbar"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolledPast || isViewingSettings
            ? (isDark ? 'bg-[#09090A]/90 border-b border-white/5 text-white backdrop-blur-xl shadow-lg' : 'bg-white/95 border-b border-zinc-200 text-zinc-900 shadow') 
            : `bg-transparent border-b border-transparent ${isDark ? 'text-white' : 'text-zinc-900'}`
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
          
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
                    <span className="text-xs font-black text-white tracking-tight">{profileName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10" />
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
                    className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 text-zinc-300 hover:text-white"
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
                    className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 text-zinc-300 hover:text-white"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {isAuraPublic ? 'Masquer l\'Aura du profil' : 'Afficher l\'Aura publique'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsCurrentlyLive(!isCurrentlyLive);
                      setShowOptionsDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 text-zinc-300 hover:text-white"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    {isCurrentlyLive ? "Désactiver le statut Live" : "Activer le statut Live"}
                  </button>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <button 
                    onClick={() => {
                      alert("Lien du profil d'Auteur copié dans le presse-papier !");
                      setShowOptionsDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl transition-colors text-[11px] font-mono font-medium flex items-center gap-2 text-zinc-300 hover:text-white"
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
            className={`relative rounded-[32px] overflow-hidden border backdrop-blur-md p-6 sm:p-8 space-y-8 shadow-2xl ${isDark ? 'border-white/5 bg-[#141416]/50 text-white' : 'border-slate-200 bg-white text-slate-900 shadow-slate-300/60 [&_.text-white]:!text-slate-900 [&_.text-zinc-400]:!text-slate-600'}`}
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
                    className="w-full px-4 py-2.5 bg-[#0F0F0F]/60 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Nouveau</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settingsNewPassword}
                    onChange={(e) => setSettingsNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0F0F0F]/60 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono block">Confirmation</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settingsConfirmPassword}
                    onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0F0F0F]/60 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <button
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
        <div className="max-w-3xl mx-auto px-4 pb-16 relative z-10 space-y-6">
          {/* PROFILE HEADER CARD */}
          <div id="atelier-header-card" className={`relative rounded-[32px] overflow-hidden border backdrop-blur-md p-5 sm:p-6 flex flex-col items-stretch text-left gap-5 sm:gap-6 shadow-2xl ${
            isDark ? 'border-white/5 bg-[#141416]/40 text-white' : 'border-zinc-200 bg-white/70 text-zinc-900 shadow-sm'
          }`}>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left w-full">
              
              {/* VIBRANT SWEEP GRADIENT AVATAR */}
              <div className="relative group flex-shrink-0 select-none">
                
                <div 
                  onClick={() => setIsCurrentlyLive(!isCurrentlyLive)}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr cursor-pointer transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
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
                </div>
              </div>

              {/* NAME, BADGE, AND SUBTITLE */}
              <div className="space-y-2 flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                <div className="flex flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className={`text-xl sm:text-2.5xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>{profileName}</h1>
                  
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[8px] sm:text-[10px] font-black tracking-wide font-mono shadow-sm">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-500/10" />
                    VÉRIFIÉ
                  </div>
                </div>

                <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs font-mono text-center sm:text-left ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span className="text-[#FF2D55] font-extrabold">{profileUsername}</span>
                  <span className={`${isDark ? 'text-zinc-650' : 'text-zinc-300'}`}>•</span>
                  <span>{profileTagline}</span>
                  <span className={`hidden sm:inline ${isDark ? 'text-zinc-650' : 'text-zinc-300'}`}>•</span>
                  <span className={`hidden sm:flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    ⚡ v2.0
                  </span>
                </div>

                <div className="pt-0.5 hidden sm:flex select-none">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.03]' : 'border-zinc-200 bg-zinc-100'}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className={`text-[10px] font-bold font-sans tracking-wide ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{profileStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BIO AND STATUS DISPLAY ON MOBILE */}
            <div className="space-y-3 w-full text-center sm:text-left">
              <p className={`text-xs sm:text-sm leading-relaxed px-2 sm:px-0 ${isDark ? 'text-zinc-350' : 'text-zinc-700'}`}>
                {profileBio}
              </p>

              <div className="flex justify-center sm:justify-start sm:hidden select-none">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.03]' : 'border-zinc-200 bg-zinc-100'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={`text-[10px] font-bold font-sans tracking-wide ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{profileStatus}</span>
                </div>
              </div>
            </div>

            {/* AXORA SOUL MATCHMAKER */}
            <div className={`p-5 rounded-3xl border w-full flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden select-none transition-all duration-300 hover:shadow-lg ${
              isDark 
                ? 'border-white/5 bg-zinc-900/30' 
                : 'border-zinc-200 bg-[#FAFAFB]'
            }`}>
              {/* Subtle visual lighting backdrop */}
              {matchStatus === 'liked' && (
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none animate-pulse" />
              )}
              {matchStatus === 'disliked' && (
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#FF2D55]/5 rounded-full filter blur-2xl pointer-events-none" />
              )}

              {/* Title & Info */}
              <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-black tracking-widest text-[#FF2D55] font-mono bg-[#FF2D55]/10 px-2.5 py-1 rounded-md uppercase">
                    AXORA AFFINITÉ
                  </span>
                  {matchStatus === 'liked' && (
                    <span className="text-[9px] font-black text-amber-500 font-mono animate-bounce flex items-center gap-0.5">
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
                        ? 'bg-gradient-to-tr from-[#FF2D55] via-amber-500 to-yellow-400 border-transparent text-white scale-108 shadow-xl shadow-amber-500/25'
                        : isDark
                          ? 'border-white/10 bg-zinc-950 text-amber-500/80 hover:text-amber-400 hover:border-amber-500/40 hover:bg-zinc-900 hover:scale-105'
                          : 'border-zinc-350 bg-white text-amber-500/80 hover:text-amber-500 hover:border-amber-500/40 hover:bg-zinc-50 hover:scale-105'
                    }`}
                    title="Intéressé(e) / Allumer la Flamme"
                  >
                    {/* Pulsing light for like state */}
                    {matchStatus === 'liked' && (
                      <span className="absolute inset-0 bg-white/10 animate-ping rounded-full pointer-events-none" />
                    )}
                    <Flame className={`w-5.5 h-5.5 transition-all duration-300 group-hover:scale-115 ${
                      matchStatus === 'liked' ? 'fill-white text-white drop-shadow animate-pulse' : 'fill-transparent'
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
                    <span className={`text-md font-black tracking-tight ${matchStatus === 'liked' ? 'text-amber-500' : (isDark ? 'text-white' : 'text-zinc-900')}`}>
                      {matchCount}
                    </span>
                    <span className="text-[7.5px] text-zinc-550 font-bold uppercase">étincelles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`h-[1px] w-full ${isDark ? 'bg-white/5' : 'bg-zinc-200'}`} />

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
                  {isPrivateProfile ? <Lock className="w-3.5 h-3.5 text-[#FF2D55]" /> : <Unlock className="w-3.5 h-3.5 text-cyan-400" />}
                  {isPrivateProfile ? 'PRIVÉ' : 'PUBLIC'}
                </button>

                <button 
                  onClick={() => {
                    setFormName(profileName);
                    setFormUsername(profileUsername);
                    setFormTagline(profileTagline);
                    setFormBio(profileBio);
                    setFormStatus(profileStatus);
                    setFormAvatar(profileAvatar);
                    setIsEditingProfile(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl border border-[#FF2D55]/20 bg-[#FF2D55]/10 text-xs font-black tracking-wider text-[#FF2D55] hover:text-white hover:bg-[#FF2D55]/20 hover:border-[#FF2D55]/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#FF2D55]" />
                  MODIFIER LE PROFIL
                </button>
              </div>

              <button 
                onClick={() => {
                  const stateVal = !isAddingPost;
                  setIsAddingPost(stateVal);
                  if (stateVal) {
                    setCreationStep(1);
                    setCropRatio('1:1');
                    setSelectedFilter('Normal');
                    setFilterBrightness(100);
                    setFilterContrast(100);
                    setFilterSaturation(100);
                    setFilterBlur(0);
                    setPostLocation('');
                    setTaggedUsers('');
                    setHideLikes(false);
                    setDisableComments(false);
                    setNewPostText('');
                    setNewPostTitle('');
                    setCustomImageUrl('');
                  }
                  setProfileSubTab('posts');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE] hover:from-[#E11D48] hover:to-cyan-400 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-[#FF2D55]/15 hover:shadow-[#22D3EE]/15 transition-all duration-300 cursor-pointer text-center"
              >
                {isAddingPost ? 'Fermer la création' : 'Créer Post'}
              </button>
            </div>
          </div>

        {/* GAMIFIED STATS PILL SECTION (With Pulsating AURA score) */}
        <div id="atelier-stats-pill" className={`relative p-1 rounded-3xl border backdrop-blur-md shadow-2xl overflow-hidden group ${
          isDark ? 'border-white/5 bg-[#141416]/50' : 'border-zinc-200 bg-white/70 shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2D55]/5 rounded-full filter blur-2xl -mr-8 -mt-8 pointer-events-none" />
          
          <div className={`grid grid-cols-3 items-center justify-between text-center select-none divide-x ${
            isDark ? 'divide-white/5' : 'divide-zinc-200'
          }`}>
            {/* Posts Count */}
            <div className="py-4 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black tracking-widest text-[#22D3EE] uppercase font-mono">POSTS</span>
              <div className="text-2xl font-black text-white tracking-tight mt-1">11</div>
              <span className="text-[8px] text-zinc-500 font-medium font-mono">Publications</span>
            </div>

            {/* Followers with dynamic stats trend */}
            <div className="py-4 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black tracking-widest text-[#A855F7] uppercase font-mono">FOLLOWERS</span>
              <div className="text-2xl font-black text-white tracking-tight mt-1">
                {(localFollowers / 1000).toFixed(1)}K
              </div>
              <div className="text-[8px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5 font-mono">
                <TrendingUp className="w-2.5 h-2.5" /> +12.4%
              </div>
            </div>

            {/* Pulsating Premium "AURA" Capsule */}
            <div 
              onClick={() => setShowAuraDetails(!showAuraDetails)}
              className="py-4 relative flex flex-col items-center justify-center cursor-pointer overflow-hidden group/aura group-hover:bg-white/[0.01]"
              title="Cliquez pour voir les critères d'AURA"
            >
              {/* Internal breathing neon outline */}
              <div className="absolute inset-0.5 border border-transparent rounded-2xl group-hover/aura:border-gradient group-hover/aura:border-[#FF2D55]/10 group-hover/aura:bg-[#FF2D55]/[0.02] transition-colors duration-500" />
              
              <span className="text-[9px] font-black tracking-widest text-[#FF2D55] uppercase font-mono flex items-center gap-1 relative z-10">
                <Sparkles className="w-3 h-3 text-[#FF2D55] animate-pulse" /> AURA SCORE
              </span>
              <div className="text-2xl font-black bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent mt-1 relative z-10 tracking-tight glow-[#FF2D55]">
                {auraScore.toLocaleString()}
              </div>
              <div className="text-[8px] text-amber-400 font-bold mt-1 flex items-center gap-1.5 font-mono relative z-10">
                <span>⭐ Élite Rang III</span>
                <span className="text-zinc-500">•</span>
                <span className={isAuraPublic ? 'text-cyan-400' : 'text-rose-400'}>
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
              isDark ? 'bg-[#141416]/70 border-white/5' : 'bg-zinc-100/85 border-zinc-200'
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
          <div className="min-h-[250px]">
            {profileSubTab === 'posts' && (
              <div className="space-y-5">
                {/* MULTI-STEP INSTAGRAM-STYLE COMPOSER */}
                <AnimatePresence>
                  {isAddingPost && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: -15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -15 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className={`p-6 sm:p-8 rounded-[32px] border text-left relative shadow-2xl ${
                        isDark ? 'border-[#FF2D55]/30 bg-[#121214] shadow-black/80' : 'border-zinc-300 bg-white shadow-zinc-300/60'
                      }`}>
                        {/* Ambient decorative glowing backdrops */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2D55]/5 rounded-full filter blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#22D3EE]/5 rounded-full filter blur-3xl pointer-events-none" />
                        
                        {/* 1. HEADER: PROGRESSION & STEP CONTROL */}
                        <div className="space-y-4 pb-5 border-b border-zinc-200/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-black tracking-widest text-[#FF2D55] font-mono uppercase bg-[#FF2D55]/10 px-2.5 py-1 rounded-md">
                                ÉTAPE {creationStep}/4
                              </span>
                              <h3 className={`text-sm sm:text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                {creationStep === 1 && "Sélection et Format du Média"}
                                {creationStep === 2 && "Ajustement & Filtres Instagram-Style"}
                                {creationStep === 3 && "Légende et Paramètres Détaillés"}
                                {creationStep === 4 && "Publication Réussie !"}
                              </h3>
                            </div>
                            
                            <button 
                              type="button"
                              onClick={() => {
                                setIsAddingPost(false);
                                setCreationStep(1);
                              }}
                              className="text-zinc-400 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-zinc-800/20"
                              title="Annuler la création"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Interactive Segmented Progress Bar */}
                          <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((step) => {
                              const isActive = creationStep >= step;
                              const isCurrent = creationStep === step;
                              return (
                                <div key={step} className="h-1.5 rounded-full bg-zinc-700/30 overflow-hidden relative">
                                  <div className={`absolute inset-0 transition-all duration-500 ${
                                    isActive 
                                      ? 'bg-gradient-to-r from-[#FF2D55] to-[#A855F7]' 
                                      : 'bg-transparent'
                                  }`} />
                                  {isCurrent && (
                                    <div className="absolute inset-0 bg-white animate-pulse" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. BODY CONTENT BY STEP */}
                        <div className="py-6 min-h-[380px]">
                          {/* ================= STEP 1: SELECT MEDIA ================= */}
                          {creationStep === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                              {/* Left Column: Ratio & Crop Real-time Canvas */}
                              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                                <div>
                                  <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono block mb-2">Aperçu du Format</span>
                                  <div className={`w-full overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 transition-all duration-505 shadow-inner relative group`}>
                                    <img 
                                      src={customImageUrl.trim() || selectedPresetImage} 
                                      alt="Selected"
                                      className={`object-cover w-full h-full transition-all duration-500 ${
                                        cropRatio === '1:1' ? 'aspect-square' : cropRatio === '16:9' ? 'aspect-video' : 'aspect-[4/5]'
                                      }`}
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-white px-2.5 py-1 rounded-lg border border-white/10 select-none">
                                      Format : {cropRatio}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase font-mono block">Cadrage / Ratio d'aspect</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { ratio: '1:1' as const, label: 'Carré (1:1)' },
                                      { ratio: '16:9' as const, label: 'Paysage (16:9)' },
                                      { ratio: '4:5' as const, label: 'Portrait (4:5)' }
                                    ].map((item) => (
                                      <button
                                        key={item.ratio}
                                        type="button"
                                        onClick={() => setCropRatio(item.ratio)}
                                        className={`px-3 py-2.5 text-xs font-bold border rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                          cropRatio === item.ratio 
                                            ? 'bg-gradient-to-r from-[#FF2D55] to-amber-500 text-white border-transparent' 
                                            : (isDark ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-805' : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100')
                                        }`}
                                      >
                                        <span className="text-[10px] uppercase font-bold tracking-tight">{item.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Library Selector / Custom Input */}
                              <div className="lg:col-span-6 space-y-5">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase font-mono block">
                                    Sélectionnez une Œuvre de la Galerie
                                  </label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {postImagePresets.map((preset) => {
                                      const isSelected = selectedPresetImage === preset.url && !customImageUrl;
                                      return (
                                        <div
                                          key={preset.name}
                                          onClick={() => {
                                            setSelectedPresetImage(preset.url);
                                            setCustomImageUrl('');
                                          }}
                                          className={`relative aspect-square rounded-xl cursor-pointer overflow-hidden p-[2px] transition-all bg-gradient-to-tr ${
                                            isSelected ? 'from-[#FF2D55] via-amber-500 to-cyan-400 scale-[1.03] shadow-md shadow-[#FF2D55]/15' : 'from-transparent to-transparent hover:scale-101 hover:brightness-110'
                                          }`}
                                          title={preset.name}
                                        >
                                          <img
                                            src={preset.url}
                                            alt={preset.name}
                                            className="w-full h-full object-cover rounded-lg"
                                            referrerPolicy="no-referrer"
                                          />
                                          {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                              <Check className="w-5 h-5 text-white" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-mono text-zinc-500 font-bold block uppercase">Ou coller une URL d'image externe</span>
                                  <input 
                                    type="text"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={customImageUrl}
                                    onChange={(e) => setCustomImageUrl(e.target.value)}
                                    className={`w-full px-4 py-3 text-xs font-mono border rounded-xl focus:outline-none focus:border-[#FF2D55]/55 ${
                                      isDark ? 'bg-zinc-900 border-white/10 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-250 text-zinc-900 placeholder-zinc-400'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= STEP 2: APPLY FILTERS & RETOUCH ================= */}
                          {creationStep === 2 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                              {/* Left Column: Live Filter Applied Photo */}
                              <div className="lg:col-span-6 flex flex-col items-center justify-center bg-zinc-950 p-2 rounded-2xl relative border border-white/5 shadow-inner">
                                <div className="w-full h-full overflow-hidden rounded-xl flex items-center justify-center">
                                  <img 
                                    src={customImageUrl.trim() || selectedPresetImage} 
                                    alt="Filter Review"
                                    className={`object-cover w-full h-full duration-300 ${
                                      cropRatio === '1:1' ? 'aspect-square' : cropRatio === '16:9' ? 'aspect-video' : 'aspect-[4/5]'
                                    }`}
                                    style={{
                                      filter: getFilterStyleString(selectedFilter, filterBrightness, filterContrast, filterSaturation, filterBlur)
                                    }}
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                                  <Sliders className="w-3 h-3 text-[#FF2D55]" /> Filtre : {selectedFilter}
                                </div>
                              </div>

                              {/* Right Column: Interactive Instagram Color Preset & Sliders */}
                              <div className="lg:col-span-6 space-y-5">
                                {/* Preset Filter Selector */}
                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase font-mono block">Filtres Instagram Exclusifs</span>
                                  <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-zinc-800">
                                    {[
                                      { name: 'Normal', desc: 'Original' },
                                      { name: 'Clarendon', desc: 'Bleu contrasté' },
                                      { name: 'Lark', desc: 'Lumineux' },
                                      { name: 'Juno', desc: 'Chaud & Saturé' },
                                      { name: 'Gingham', desc: 'Rétro Vintage' },
                                      { name: 'Crema', desc: 'Doux Poudré' },
                                      { name: 'Slumber', desc: 'Mélancolique' }
                                    ].map((filter) => {
                                      const isActive = selectedFilter === filter.name;
                                      return (
                                        <div
                                          key={filter.name}
                                          onClick={() => setSelectedFilter(filter.name)}
                                          className={`flex-shrink-0 flex flex-col items-center cursor-pointer transition-all ${
                                            isActive ? 'scale-[1.03]' : 'hover:opacity-85'
                                          }`}
                                        >
                                          {/* Tiny thumbnail filtered preview */}
                                          <div className={`w-14 h-14 rounded-xl overflow-hidden p-[2.5px] transition-all bg-gradient-to-tr ${
                                            isActive ? 'from-[#FF2D55] to-[#A855F7] shadow-md shadow-red-500/10' : 'from-transparent to-transparent'
                                          }`}>
                                            <img
                                              src={customImageUrl.trim() || selectedPresetImage}
                                              alt={filter.name}
                                              className="w-full h-full object-cover rounded-lg"
                                              style={{ filter: getFilterStyleString(filter.name, 100, 100, 100, 0) }}
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          <span className={`text-[9px] font-black tracking-tight mt-1.5 uppercase ${
                                            isActive ? 'text-[#FF2D55]' : 'text-zinc-500'
                                          }`}>{filter.name}</span>
                                          <span className="text-[7.5px] font-mono text-zinc-650 tracking-wider leading-none mt-0.5">{filter.desc}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Fine-Tuning sliders */}
                                <div className="space-y-3 pt-2 border-t border-zinc-200/10">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase font-mono">Retouche et Ajustement Manuel</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFilterBrightness(100);
                                        setFilterContrast(100);
                                        setFilterSaturation(100);
                                        setFilterBlur(0);
                                      }}
                                      className="text-[9px] text-[#22D3EE] font-black tracking-widest uppercase font-mono hover:underline cursor-pointer"
                                    >
                                      Réinitialiser
                                    </button>
                                  </div>

                                  {/* Slider 1: Brightness */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550">
                                      <span>Luminosité</span>
                                      <span className="font-bold text-zinc-400">{filterBrightness}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="50"
                                      max="155"
                                      value={filterBrightness}
                                      onChange={(e) => setFilterBrightness(Number(e.target.value))}
                                      className="w-full accent-[#FF2D55] h-1 bg-zinc-700 rounded-lg cursor-pointer"
                                    />
                                  </div>

                                  {/* Slider 2: Contrast */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550">
                                      <span>Contraste</span>
                                      <span className="font-bold text-zinc-400">{filterContrast}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="50"
                                      max="155"
                                      value={filterContrast}
                                      onChange={(e) => setFilterContrast(Number(e.target.value))}
                                      className="w-full accent-[#FF2D55] h-1 bg-zinc-700 rounded-lg cursor-pointer"
                                    />
                                  </div>

                                  {/* Slider 3: Saturation */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550">
                                      <span>Saturation</span>
                                      <span className="font-bold text-zinc-400">{filterSaturation}%</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="200"
                                      value={filterSaturation}
                                      onChange={(e) => setFilterSaturation(Number(e.target.value))}
                                      className="w-full accent-[#FF2D55] h-1 bg-zinc-700 rounded-lg cursor-pointer"
                                    />
                                  </div>

                                  {/* Slider 4: Blur */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550">
                                      <span>Flou Thématique (Tilt-Shift)</span>
                                      <span className="font-bold text-zinc-400">{filterBlur}px</span>
                                    </div>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="6"
                                      step="0.5"
                                      value={filterBlur}
                                      onChange={(e) => setFilterBlur(Number(e.target.value))}
                                      className="w-full accent-[#FF2D55] h-1 bg-zinc-700 rounded-lg cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= STEP 3: CAPTION & PUBLISH PARAMETERS ================= */}
                          {creationStep === 3 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                              {/* Left Column: Post Card Preview Thumbnail */}
                              <div className="lg:col-span-5 flex flex-col space-y-3">
                                <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono block">Rendu Final de la Publication</span>
                                <div className="rounded-2xl border border-white/5 bg-zinc-950 overflow-hidden relative shadow-lg">
                                  <img 
                                    src={customImageUrl.trim() || selectedPresetImage} 
                                    alt="Publish preview"
                                    className={`object-cover w-full h-auto transition-all ${
                                      cropRatio === '1:1' ? 'aspect-square' : cropRatio === '16:9' ? 'aspect-video' : 'aspect-[4/5]'
                                    }`}
                                    style={{
                                      filter: getFilterStyleString(selectedFilter, filterBrightness, filterContrast, filterSaturation, filterBlur)
                                    }}
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono font-black text-white/95 uppercase border border-white/10 select-none">
                                    {newPostTitle.trim() || 'PUBLICATION PERSO'}
                                  </div>
                                  {postLocation && (
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-md text-[8.5px] text-zinc-200 font-mono px-2 py-1 rounded font-bold border border-white/10 select-none">
                                      <MapPin className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                                      {postLocation}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Column: Title, Caption, Tagging & Advanced Toggles */}
                              <div className="lg:col-span-7 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Titre / Tag Catégorie</span>
                                    <input 
                                      type="text"
                                      placeholder="E.g. DESIGN STUDY, COZY MORNING..."
                                      value={newPostTitle}
                                      onChange={(e) => setNewPostTitle(e.target.value)}
                                      className={`w-full px-4 py-2.5 text-xs font-bold font-mono border rounded-xl focus:outline-none focus:border-[#FF2D55]/55 ${
                                        isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-zinc-50 border-zinc-250 text-zinc-900'
                                      }`}
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Lieu / Unité</span>
                                      <span className="text-[8px] font-mono text-zinc-500 font-extrabold">(Optionnel)</span>
                                    </div>
                                    <select
                                      value={postLocation}
                                      onChange={(e) => setPostLocation(e.target.value)}
                                      className={`w-full px-4 py-2.5 text-xs font-bold font-mono border rounded-xl focus:outline-none focus:border-[#FF2D55]/55 cursor-pointer ${
                                        isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-zinc-50 border-zinc-250 text-zinc-900'
                                      }`}
                                    >
                                      <option value="">Aucun lieu spécifié</option>
                                      <option value="Paris, France">🗼 Paris, France</option>
                                      <option value="Station F, Paris">⭐ Station F, Paris</option>
                                      <option value="Silicon Valley, California">💻 Silicon Valley, California</option>
                                      <option value="Axora Creative Labs HQ">⚡ Axora Labs HQ</option>
                                      <option value="Tokyo, Japan">🌸 Tokyo, Japan</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Légende (Caption)</span>
                                    <span className="text-[9px] font-mono text-zinc-500 font-semibold">{newPostText.length} caractères</span>
                                  </div>
                                  <textarea
                                    placeholder="Partagez vos inspirations ou votre humeur aujourd'hui..."
                                    value={newPostText}
                                    onChange={(e) => setNewPostText(e.target.value)}
                                    rows={3.5}
                                    className={`w-full p-4 text-xs border rounded-xl focus:outline-none focus:border-[#FF2D55]/55 resize-none leading-relaxed ${
                                      isDark ? 'bg-zinc-900 border-white/10 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-250 text-zinc-900 placeholder-zinc-400'
                                    }`}
                                  />
                                  
                                  {/* Fast Emoji keyboard wrapper */}
                                  <div className="flex items-center gap-1.5 pt-1">
                                    <span className="text-[9px] font-mono text-zinc-500 font-bold mr-1 flex items-center gap-1">
                                      <Smile className="w-3 h-3 text-[#FF2D55]" /> Émojis rapides :
                                    </span>
                                    {['⚡', '🔥', '✨', '💻', '🚀', '❤️', '🎨', '🌟'].map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewPostText(prev => prev + emoji)}
                                        className="text-xs hover:scale-125 transition-transform p-1 cursor-pointer bg-zinc-800/20 hover:bg-zinc-805 rounded-md leading-none h-6 w-6 flex items-center justify-center"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Identifier des Membres</span>
                                  <div className="relative">
                                    <Users className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                    <input 
                                      type="text"
                                      placeholder="Ex : @alex, @lena, @user998..."
                                      value={taggedUsers}
                                      onChange={(e) => setTaggedUsers(e.target.value)}
                                      className={`w-full pl-9 pr-4 py-2.5 text-xs font-mono border rounded-xl focus:outline-none focus:border-[#FF2D55]/55 ${
                                        isDark ? 'bg-zinc-900 border-white/10 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-250 text-zinc-900 placeholder-zinc-400'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Advanced settings switches */}
                                <div className="pt-3 border-t border-zinc-200/10 space-y-2">
                                  <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase font-mono block">Paramètres Avancés d'Instagram</span>
                                  
                                  <div className="flex items-center justify-between py-1">
                                    <div className="text-left">
                                      <span className={`text-[11px] font-bold block ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Masquer le nombre d'abonnés et J'aime</span>
                                      <span className="text-[9px] font-mono text-zinc-500 block">Les autres ne verront pas le total de Likes sur ce post</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                      <input 
                                        type="checkbox" 
                                        checked={hideLikes}
                                        onChange={() => setHideLikes(!hideLikes)}
                                        className="sr-only peer" 
                                      />
                                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                  </div>

                                  <div className="flex items-center justify-between py-1">
                                    <div className="text-left">
                                      <span className={`text-[11px] font-bold block ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Désactiver les commentaires</span>
                                      <span className="text-[9px] font-mono text-zinc-500 block">Aucun utilisateur ne pourra poster de commentaires</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                      <input 
                                        type="checkbox" 
                                        checked={disableComments}
                                        onChange={() => setDisableComments(!disableComments)}
                                        className="sr-only peer" 
                                      />
                                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= STEP 4: SUCCESS OVERLAY ================= */}
                          {creationStep === 4 && (
                            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 space-y-6">
                              <motion.div
                                initial={{ scale: 0.5, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 10 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF2D55] via-[#A855F7] to-emerald-400 p-1 flex items-center justify-center shadow-xl shadow-[#FF2D55]/20"
                              >
                                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                                  <Check className="w-10 h-10 text-emerald-400 drop-shadow" />
                                </div>
                              </motion.div>

                              <div className="space-y-2">
                                <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                  Fidélité au Format Instagram !
                                </h4>
                                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                                  Votre publication a été filtrée, finalisée et déployée avec succès sur votre profil Axora.
                                </p>
                              </div>

                              {/* Tiny card visual summary of what was shared */}
                              <div className={`p-4 rounded-2xl border text-left w-full space-y-2 relative overflow-hidden ${
                                isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                                    <img 
                                      src={customImageUrl.trim() || selectedPresetImage} 
                                      alt="Thumbnail published"
                                      className="w-full h-full object-cover"
                                      style={{
                                        filter: getFilterStyleString(selectedFilter, filterBrightness, filterContrast, filterSaturation, filterBlur)
                                      }}
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left min-w-0 flex-1">
                                    <span className="text-[10px] font-black tracking-widest text-[#FF2D55] font-mono block truncate">
                                      {newPostTitle.trim().toUpperCase() || "PUBLICATION DÉCORÉE"}
                                    </span>
                                    <span className={`text-[11px] font-sans truncate block ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                      {newPostText.trim() || 'Aucune légende'}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-200/5 select-none">
                                  <div>Filtre : <span className="text-[#a855f7] font-black">{selectedFilter}</span></div>
                                  <div>Format : <span className="text-cyan-400 font-black">{cropRatio}</span></div>
                                  {postLocation && <div className="truncate">Lieu : <span className="text-[#FF2D55] font-black">{postLocation}</span></div>}
                                  {taggedUsers && <div className="truncate">Tags : <span className="text-amber-500 font-black">{taggedUsers}</span></div>}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 3. FOOTER CONTROLS: PREVIOUS, NEXT & SHARE */}
                        <div className="flex items-center justify-between pt-5 border-t border-zinc-200/10">
                          {creationStep > 1 && creationStep < 4 ? (
                            <button
                              type="button"
                              onClick={() => setCreationStep(prev => (prev - 1) as 1 | 2 | 3)}
                              className={`px-5 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                                isDark ? 'border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'border-zinc-300 text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100'
                              }`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                            </button>
                          ) : (
                            <div /> // Spacer
                          )}

                          <div className="flex gap-2">
                            {creationStep < 3 ? (
                              <button
                                type="button"
                                onClick={() => setCreationStep(prev => (prev + 1) as 1 | 2 | 3)}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#FF2D55] via-red-500 to-amber-500 hover:scale-[1.01] active:scale-[0.99] text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-red-500/15 transition-all cursor-pointer"
                              >
                                Configurer Suivant
                              </button>
                            ) : creationStep === 3 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  // Gather details & publish to profile grid!
                                  const finalImageUrl = customImageUrl.trim() || selectedPresetImage;
                                  
                                  // Construct created post with gorgeous structured traits
                                  const createdPost = {
                                    id: `p_user_${Date.now()}`,
                                    title: newPostTitle.trim().toUpperCase() || "VISUEL PERSO",
                                    text: newPostText.trim() || `Sublime rendu filtré avec ${selectedFilter}.`,
                                    imageUrl: finalImageUrl,
                                    date: "Posté à l'instant",
                                    likes: 0,
                                    commentsCount: 0,
                                    comments: [],
                                    
                                    // custom instagram options built-in
                                    filterType: selectedFilter,
                                    aspectRatio: cropRatio,
                                    location: postLocation || undefined,
                                    taggedPeople: taggedUsers || undefined,
                                    hideLikesState: hideLikes,
                                    commentsDisabledState: disableComments
                                  };

                                  const updated = [createdPost, ...profilePosts];
                                  setProfilePosts(updated);
                                  localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify(updated));
                                  
                                  // Go to screen 4 (Success Screen!)
                                  setCreationStep(4);
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE] hover:scale-[1.01] active:scale-[0.99] text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-purple-500/15 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                Partager la Publication
                              </button>
                            ) : (
                              // Clear success state and close composer returning to profile grid!
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingPost(false);
                                  setCreationStep(1);
                                  // Auto-scroll context element down to view the fresh grid if exists
                                  setTimeout(() => {
                                    const grid = document.getElementById('atelier-stats-pill');
                                    if(grid) grid.scrollIntoView({ behavior: 'smooth' });
                                  }, 150);
                                }}
                                className="px-10 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] active:scale-[0.99] text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg transition-all cursor-pointer"
                              >
                                Fermer & Visualiser l'Aura
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* STAGGERED MASONRY GRID */}
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                  {profilePosts.map((post, index) => {
                    // Create beautiful staggered proportions and custom padding for elite rhythm
                    const aspectRatios = [
                      "aspect-[3/4]",
                      "aspect-square",
                      "aspect-[4/5]",
                      "aspect-[5/4]",
                      "aspect-[4/3]",
                    ];
                    const chosenAspect = aspectRatios[index % aspectRatios.length];

                    return (
                      <div 
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className={`inline-block w-full mb-4 break-inside-avoid group relative ${chosenAspect} rounded-2xl overflow-hidden cursor-pointer bg-zinc-950 shadow-md hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 border border-white/5`}
                      >
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Instagram statistics overlay on Hover */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center gap-4 sm:gap-6 text-white font-extrabold select-none">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                            <span>{likedItems[post.id] ? post.likes + 1 : post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                            <MessageSquare className="w-4 h-4 text-white fill-white" />
                            <span>{post.comments ? post.comments.length : (post.commentsCount || 0)}</span>
                          </div>
                        </div>

                        {/* Accent Category Tag */}
                        <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 backdrop-blur-md rounded-lg px-2.5 py-1 pointer-events-none max-w-[85%]">
                          <span className="text-[7.5px] font-black font-mono text-white tracking-widest block uppercase truncate">
                            {post.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REELS PORTFOLIO GRID */}
            {profileSubTab === 'reels' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              </div>
            )}

            {/* SAVED PORTFOLIO GRID */}
            {profileSubTab === 'saved' && (
              <div className="columns-2 sm:columns-3 gap-4 space-y-4">
                {/* Saved Item 1 */}
                <div className={`break-inside-avoid p-5 rounded-3xl border space-y-3 group/mcard cursor-pointer relative shadow-lg ${
                  isDark 
                    ? 'border-white/5 bg-gradient-to-br from-[#1C1C1E]/70 to-[#141416]/70' 
                    : 'border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100/60'
                }`}>
                  <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover/mcard:bg-amber-500/[0.03] border border-transparent group-hover/mcard:border-amber-400/20 transition-all duration-300" />
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 select-none">
                    <span>Sauvegardé il y a 2j</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                  <h5 className={`font-extrabold text-xs leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Dictionnaire des animations CSS 🚀</h5>
                  <p className={`text-[10px] font-sans leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>Une référence essentielle pour concevoir des transitions fluides & naturelles.</p>
                </div>

                {/* Saved Item 2 */}
                <div className={`break-inside-avoid rounded-3xl border overflow-hidden group/mcard cursor-pointer relative shadow-lg ${
                  isDark ? 'border-white/5 bg-[#141416]/80' : 'border-zinc-200 bg-zinc-50/90'
                }`}>
                  <div className="relative overflow-hidden aspect-[4/3] sm:aspect-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80" 
                      alt="Cryptography system" 
                      className="w-full h-auto object-cover group-hover/mcard:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className={`p-4 space-y-1 bg-gradient-to-t ${isDark ? 'from-zinc-950/50 to-transparent' : 'from-zinc-200/20 to-transparent'}`}>
                    <span className="text-[9px] font-bold text-cyan-400 font-mono tracking-wider uppercase">SECURITY</span>
                    <h5 className={`font-extrabold text-xs leading-snug ${isDark ? 'text-white' : 'text-zinc-900'}`}>Algorithmes asymétriques</h5>
                    <p className={`text-[10px] font-sans leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>Les structures modernes de chiffrement asymétrique décentralisé.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

        {/* EDIT PROFILE MODAL OVERLAY */}
        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditingProfile(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0F0F10] p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-left"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2D55]/10 rounded-full filter blur-2xl -mr-8 -mt-8 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#22D3EE]/5 rounded-full filter blur-2xl -ml-8 -mb-8 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF2D55] animate-pulse" />
                      Modifier mon Profil
                    </h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">
                      Réglez les détails de votre profil
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 select-text">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono block">
                      Nom d'Auteur
                    </label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Auteur Invité"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
                    />
                  </div>

                  {/* Username and Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#A855F7] uppercase font-mono block">
                        Identifiant unique
                      </label>
                      <input 
                        type="text" 
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                        placeholder="e.g. @alex_axora"
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-400/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-cyan-400 uppercase font-mono block">
                        Rôle / Titre du profil
                      </label>
                      <input 
                        type="text" 
                        value={formTagline}
                        onChange={(e) => setFormTagline(e.target.value)}
                        placeholder="e.g. Concepteur UI Premium"
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-widest text-zinc-400 uppercase font-mono block">
                      Bio de Présentation
                    </label>
                    <textarea 
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Décrivez votre présentation..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-zinc-500/50 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-widest text-emerald-400 uppercase font-mono block">
                      Build en cours / Activité active
                    </label>
                    <input 
                      type="text" 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      placeholder="e.g. En cours de developpement..."
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  {/* Aura Privacy toggle in modal */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono block">
                        Confidentialité de l'Aura
                      </label>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        {formIsAuraPublic ? 'Auras Publiques (Affichées sur le profil)' : 'Auras Privées (Masquées aux autres)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormIsAuraPublic(!formIsAuraPublic)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formIsAuraPublic ? 'bg-gradient-to-r from-[#FF2D55] to-[#A855F7]' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formIsAuraPublic ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-[10px] font-black tracking-widest text-amber-500 uppercase font-mono block">
                      Avatar d'Auteur
                    </label>
                    
                    {/* Presets */}
                    <div className="flex gap-2.5 pb-2">
                      {[
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                      ].map((presetUrl) => {
                        const isSelected = formAvatar === presetUrl;
                        return (
                          <div 
                            key={presetUrl}
                            onClick={() => setFormAvatar(presetUrl)}
                            className={`relative w-12 h-12 rounded-full cursor-pointer p-[2px] transition-all bg-gradient-to-tr ${
                              isSelected ? 'from-[#FF2D55] to-[#22D3EE] scale-105 shadow-md shadow-[#FF2D55]/20' : 'from-transparent to-transparent hover:scale-102'
                            }`}
                          >
                            <img 
                              src={presetUrl} 
                              alt="Preset" 
                              className="w-full h-full rounded-full object-cover border-2 border-[#0F0F10]"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center bg-[#FF2D55]/20 rounded-full">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom URL */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-500 font-mono block">Ou URL d'image personnalisée :</span>
                      <input 
                        type="text" 
                        value={formAvatar}
                        onChange={(e) => setFormAvatar(e.target.value)}
                        placeholder="Insérer l'URL de votre image https://..."
                        className="w-full px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg text-zinc-300 text-[11px] font-mono focus:outline-none focus:border-[#FF2D55]/30 transition-colors"
                      />
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-white/5 select-none">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-[10px] font-bold tracking-wider text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    ANNULER
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] via-[#A855F7] to-[#22D3EE] text-white text-[10px] font-black tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-[#FF2D55]/15 cursor-pointer"
                  >
                    ENREGISTRER L'AURA <Check className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            </div>
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

              {/* Lightbox Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`relative w-full max-w-4xl rounded-[32px] border overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 shadow-2xl ${
                  isDark ? 'border-white/10 bg-[#0F0F10]' : 'border-zinc-200 bg-white text-zinc-900 shadow-zinc-300'
                }`}
                style={{ maxHeight: '90vh' }}
              >
                {/* 1. Left half (Image) */}
                <div className="col-span-1 md:col-span-7 relative flex items-center justify-center bg-black aspect-square md:aspect-auto md:h-[600px]">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black tracking-widest text-white/90 font-mono uppercase">{selectedPost.title}</span>
                  </div>
                </div>

                {/* 2. Right half (Interaction Feed & Comments) */}
                <div className="col-span-1 md:col-span-5 flex flex-col justify-between h-full md:h-[600px]">
                  {/* Header: Author & Options */}
                  <div className={`p-4 flex items-center justify-between border-b ${
                    isDark ? 'border-white/5 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <img 
                        src={profileAvatar} 
                        alt={profileUsername} 
                        className={`w-9 h-9 object-cover rounded-full border-2 ${isDark ? 'border-red-500/30' : 'border-zinc-300'}`}
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-1 leading-none mb-0.5">
                          <span className={`text-xs font-black font-sans ${isDark ? 'text-white' : 'text-zinc-900'}`}>{profileName}</span>
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
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
                        <span className={`text-xs font-black font-sans ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>{profileUsername}</span>
                        <p className={`text-xs font-sans leading-relaxed mt-0.5 ${isDark ? 'text-zinc-305' : 'text-zinc-700'}`}>
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
                        <div key={comment.id} className="flex gap-3 text-left">
                          <img 
                            src={comment.avatar} 
                            alt={comment.username} 
                            className="w-7 h-7 object-cover rounded-full flex-shrink-0"
                          />
                          <div>
                            <span className={`text-xs font-black font-sans ${isDark ? 'text-zinc-200' : 'text-zinc-850'}`}>{comment.username}</span>
                            <p className={`text-xs font-sans leading-relaxed mt-0.5 ${isDark ? 'text-zinc-305' : 'text-zinc-700'}`}>
                              {comment.text}
                            </p>
                            <span className="text-[9px] font-mono text-zinc-500 mt-1 block">{comment.date}</span>
                          </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
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
                        <span className={`text-[11px] font-bold font-sans ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                          {likedItems[selectedPost.id] ? selectedPost.likes + 1 : selectedPost.likes} J'aime
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">{selectedPost.date}</span>
                    </div>

                    {/* Add Comment Input */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCommentText.trim()) return;
                        
                        const newComment = {
                          id: `c_${Date.now()}`,
                          username: profileUsername,
                          avatar: profileAvatar,
                          text: newCommentText.trim(),
                          date: "À l'instant"
                        };

                        const updatedComments = [...(selectedPost.comments || []), newComment];
                        
                        const updatedPosts = profilePosts.map(p => {
                          if (p.id === selectedPost.id) {
                            return { ...p, comments: updatedComments, commentsCount: updatedComments.length };
                          }
                          return p;
                        });

                        setProfilePosts(updatedPosts);
                        localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify(updatedPosts));
                        setSelectedPost(prev => prev ? { ...prev, comments: updatedComments, commentsCount: updatedComments.length } : null);
                        setNewCommentText('');
                      }}
                      className="flex gap-2 items-center pt-2 border-t border-zinc-200/5"
                    >
                      <input 
                        type="text" 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className={`flex-1 text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-red-500/50 ${
                          isDark ? 'bg-zinc-900 border-white/5 text-white placeholder-zinc-505' : 'bg-white border-zinc-200 text-zinc-90 w placeholder-zinc-400'
                        }`}
                      />
                      <button 
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-wider disabled:opacity-40 select-none cursor-pointer pr-1"
                      >
                        Publier
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
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
                            localStorage.clear();
                            setIsViewingSettings(false);
                            setShowLogoutConfirm(false);
                            setIsLoggingOut(false);
                            setCurrentTab('home');
                            window.location.reload();
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
