import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Clapperboard, 
  Flame, 
  MessageSquare, 
  User, 
  Search, 
  Bell, 
  Star,
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  X, 
  Lock, 
  Unlock, 
  PhoneCall, 
  PhoneOff, 
  Video, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  MapPin, 
  Smile, 
  BarChart4, 
  Image as ImageIcon, 
  Grid, 
  ExternalLink,
  DollarSign,
  Compass,
  CheckCircle,
  BadgeCheck,
  HelpCircle,
  Users,
  TrendingUp,
  Globe,
  Cpu,
  Copy,
  Check,
  ArrowLeft,
  ChevronLeft,
  Shield,
  Sparkles,
  Play,
  Music
} from 'lucide-react';
import { mockStories, mockPosts, mockChats, mockMessages, mockNotifications, mockPopSessions } from '../mockData';
import { Post, Story, ChatSummary, ChatMessage, AxoraNotification, PopSession } from '../types';
import AtelierProfile from './AtelierProfile';
import PopSessionEvolution from './PopSessionEvolution';
import { AxoraReels } from './AxoraReels';
import { AxoraMessages } from './AxoraMessages';
import StoriesBar from './StoriesBar';
import PostCard from './PostCard';
import AxoraNotifications from './AxoraNotifications';
import AxoraShop from './AxoraShop';
import StoryCreatorModal from './StoryCreatorModal';
import StoryViewerModal from './StoryViewerModal';

// Structured search & discovery content
const suggestedVideos = [
  {
    id: 'sv1',
    title: 'Tuto Design Axora v2...',
    views: '1.2M vues',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
  },
  {
    id: 'sv2',
    title: 'Crypto Débat Pop Live',
    views: '840K vues',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80'
  },
  {
    id: 'sv3',
    title: 'Code Review avec Lena',
    views: '420K vues',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80'
  },
  {
    id: 'sv4',
    title: 'Sécurité Réseaux 101',
    views: '1.7M vues',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80'
  },
  {
    id: 'sv5',
    title: 'L\'Afrique en Technologie',
    views: '2.1M vues',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80'
  }
];

const newsUpdates = [
  {
    id: 'n1',
    title: 'Mise à jour Axora v2.0',
    description: 'Découvrez la nouvelle interface fluide optimisée, les badges de certification vert émeraude et les transactions instantanées.',
    gradient: 'from-zinc-950 via-[#2E1018] to-[#FF2D55]/90'
  },
  {
    id: 'n2',
    title: 'Sécurité renforcée par Afri-Tech',
    description: 'Toutes les communications directes de la plateforme sont désormais cryptées de bout en bout et auditées régulièrement.',
    gradient: 'from-[#0F0F15] via-[#1F1122] to-[#FF2D55]/85'
  },
  {
    id: 'n3',
    title: 'Gagnez plus avec Pop Coins',
    description: 'Participez à des débats interactifs et débloquez de superbes récompenses grâce à notre nouveau système d\'engagement.',
    gradient: 'from-zinc-900 via-[#31151B] to-[#FF2D55]'
  }
];

interface AxoraAppProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  device: 'mobile' | 'tablet' | 'desktop' | 'web';
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}

export default function AxoraApp({ theme, setTheme, device, coins, setCoins }: AxoraAppProps) {
  // Dynamic Profile info from AtelierProfile
  const currentUserAvatar = localStorage.getItem('axo_profileAvatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80';
  const currentUserName = localStorage.getItem('axo_profileName') || 'Auteur Invité';
  const currentUserUsername = localStorage.getItem('axo_profileUsername') || '@alex_axora';

  // Navigation states
  const [currentTab, setCurrentTab] = useState<'home' | 'reels' | 'pop' | 'messages' | 'profile'>('home');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [shopOpen, setShopOpen] = useState<boolean>(false);
  const [activeAd, setActiveAd] = useState<{ id: string; name: string; reward: number; duration: number } | null>(null);
  const [adSecondsLeft, setAdSecondsLeft] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'members' | 'videos' | 'news'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Kaelen', 'Aura Afrique', 'Pop Session']);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  
  // Interactive app state copies
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [chats, setChats] = useState<ChatSummary[]>(mockChats);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(mockMessages);
  const [popSessions, setPopSessions] = useState<PopSession[]>(mockPopSessions);
  const [notifications, setNotifications] = useState<AxoraNotification[]>(mockNotifications);
  const [stories, setStories] = useState<Story[]>(mockStories);

  // Group stories by username to render single-bubble-per-user list
  const groupedStories = React.useMemo(() => {
    const groups: Record<string, { username: string; avatar: string; items: Story[] }> = {};
    
    // Create an entry for the logged-in user (username: 'Vous')
    groups['Vous'] = {
      username: 'Vous',
      avatar: currentUserAvatar,
      items: stories.filter(s => s.username === 'Vous')
    };

    stories.forEach(story => {
      if (story.username === 'Vous') return; // already handled
      const key = story.username;
      if (!groups[key]) {
        groups[key] = {
          username: story.username,
          avatar: story.avatar,
          items: []
        };
      }
      groups[key].items.push(story);
    });

    // Convert to an ordered list where 'Vous' is first, followed by others
    return [
      groups['Vous'],
      ...Object.values(groups).filter(g => g.username !== 'Vous')
    ];
  }, [stories, currentUserAvatar]);

  const activeAdId = activeAd?.id || null;
  React.useEffect(() => {
    if (!activeAdId || !activeAd) return;
    
    const interval = setInterval(() => {
      setAdSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCoins(c => c + activeAd.reward);
          
          const newNotif: AxoraNotification = {
            id: `notif-ad-${Date.now()}`,
            title: "Récompense Pub Obtenue !",
            description: `Félicitations ! Vous avez reçu +${activeAd.reward} Axora Coins pour avoir visionné la publicité "${activeAd.name}".`,
            timestamp: "À l'instant",
            type: 'match'
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          setActiveAd(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAdId]);
  
  // Form states
  const [writePostText, setWritePostText] = useState<string>('');
  const [writeChatText, setWriteChatText] = useState<string>('');
  const [isPrivateProfile, setIsPrivateProfile] = useState<boolean>(false);
  const [profileSubTab, setProfileSubTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isCurrentlyLive, setIsCurrentlyLive] = useState<boolean>(true);
  
  // Pop session modal
  const [showRegisterSessionModal, setShowRegisterSessionModal] = useState<boolean>(false);
  const [newSessionTitle, setNewSessionTitle] = useState<string>('');
  const [newSessionCategory, setNewSessionCategory] = useState<string>('Débat & Politique');
  const [newSessionDuration, setNewSessionDuration] = useState<string>('30 minutes');

  // Sub-features like Poll Votes
  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});

  // Story creator modal states (Instagram-style sequential interfaces)
  const [showCreateStoryModal, setShowCreateStoryModal] = useState<boolean>(false);
  const [storyStep, setStoryStep] = useState<number>(1); // 1: Gallery Selection / File Import, 2: Interactive Screen Editor, 3: Direct Sharing / Destinations
  const [isEditingCaption, setIsEditingCaption] = useState<boolean>(false);
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  
  // Step 1: Gallery Selection & Custom Upload inputs
  const [selectedGalleryMedia, setSelectedGalleryMedia] = useState<{ id: string; type: string; url: string; description?: string } | null>({
    id: 'g1', type: 'photo', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&q=80', description: 'Néon Horizon cyberpunk'
  }); // Default to first item
  const [selectedTemplate, setSelectedTemplate] = useState<string>('cyber'); // 'cyber' | 'loft' | 'afritech' | 'fluid' | 'custom' | 'text-only'
  const [customMediaUrl, setCustomMediaUrl] = useState<string>('');
  const [selectedGradient, setSelectedGradient] = useState<string>('gradient-sunset'); // custom backgrounds
  const [dragOverActive, setDragOverActive] = useState<boolean>(false);
  
  // Step 2: creative typography overlays & filter blends
  const [storyFilter, setStoryFilter] = useState<string>('normal'); // 'normal', 'clarendon', 'lark', 'juno', 'ludwig', 'crema', 'cyber', 'neomint', 'noir', 'amber'
  const [storyCaption, setStoryCaption] = useState<string>('');
  const [storyFont, setStoryFont] = useState<string>('font-sans'); // 'font-sans' | 'font-mono' | 'font-serif'
  const [captionColor, setCaptionColor] = useState<string>('#FFFFFF'); // styling
  const [textBackgroundOn, setTextBackgroundOn] = useState<boolean>(true); // Aa highlight background style
  
  // Placed Interactive Stickers list on Creative Canvas
  const [storyActiveStickers, setStoryActiveStickers] = useState<{ type: string; x: number; y: number; textVal?: string; extra1?: string; extra2?: string }[]>([]);
  const [showStickerMenu, setShowStickerMenu] = useState<boolean>(false);
  
  // Placed Sticker values controllers
  const [pollStickerQuestion, setPollStickerQuestion] = useState<string>('Stylé ? 🔥');
  const [pollStickerYes, setPollStickerYes] = useState<string>('Grave !');
  const [pollStickerNo, setPollStickerNo] = useState<string>('Bof');
  const [musicStickerTitle, setMusicStickerTitle] = useState<string>('Lofi Waves');
  const [musicStickerArtist, setMusicStickerArtist] = useState<string>('Axora Sound Crew');
  const [locationStickerName, setLocationStickerName] = useState<string>('Champs-Élysées, Paris');
  
  // Custom paint brush sketches simulation list
  const [brushDrawings, setBrushDrawings] = useState<{ x: number; y: number; color: string }[]>([]);
  const [brushColor, setBrushColor] = useState<string>('#FF2D55');
  const [brushModeActive, setBrushModeActive] = useState<boolean>(false);

  // Step 3: Destinations & Direct Share configurations
  const [storyAuraLevel, setStoryAuraLevel] = useState<number>(85);
  const [storyIsPrivate, setStoryIsPrivate] = useState<boolean>(false);
  const [linkPopSession, setLinkPopSession] = useState<boolean>(true);
  const [searchContactQuery, setSearchContactQuery] = useState<string>('');
  const [directContacts, setDirectContacts] = useState<any[]>([
    { id: 'dc1', name: 'Liam Sterling', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', auraMatch: '98%', shared: false },
    { id: 'dc2', name: 'Sarah Chloé', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', auraMatch: '94%', shared: false },
    { id: 'dc3', name: 'AxoBot Core', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', auraMatch: '100%', shared: false },
    { id: 'dc4', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', auraMatch: '89%', shared: false },
    { id: 'dc5', name: 'Niko Afritechture', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', auraMatch: '87%', shared: false }
  ]);

  // Story viewing overlay states
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);

  // Auto-advance or close active story after smooth countdown
  useEffect(() => {
    if (!activeStory) {
      setStoryProgress(0);
      return;
    }

    setStoryProgress(0);
    const totalDuration = 6000; // 6 seconds per story
    const stepTime = 50; // smooth 50ms intervals
    const numSteps = totalDuration / stepTime;
    const increment = 100 / numSteps;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto advance if there are subsequent stories for this user
          const activeUserStories = stories.filter(s => s.username === activeStory.username);
          const currentSlideIndex = activeUserStories.findIndex(s => s.id === activeStory.id);
          if (currentSlideIndex !== -1 && currentSlideIndex < activeUserStories.length - 1) {
            setActiveStory(activeUserStories[currentSlideIndex + 1]);
          } else {
            setActiveStory(null);
          }
          return 100;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [activeStory, stories]);

  const handleNextStory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeStory) return;
    const activeUserStories = stories.filter(s => s.username === activeStory.username);
    const currentSlideIndex = activeUserStories.findIndex(s => s.id === activeStory.id);
    if (currentSlideIndex !== -1 && currentSlideIndex < activeUserStories.length - 1) {
      setActiveStory(activeUserStories[currentSlideIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrevStory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeStory) return;
    const activeUserStories = stories.filter(s => s.username === activeStory.username);
    const currentSlideIndex = activeUserStories.findIndex(s => s.id === activeStory.id);
    if (currentSlideIndex > 0) {
      setActiveStory(activeUserStories[currentSlideIndex - 1]);
    }
  };

  // Theme support local styling definitions
  const isDark = theme === 'dark';
  const appBg = isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F9F9FB] text-zinc-900 border-zinc-200';
  const cardBg = isDark ? 'bg-[#1C1C1E] border border-white/5 text-white' : 'bg-white border border-zinc-200 text-zinc-900';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const bentoBorder = isDark ? 'border-white/5' : 'border-zinc-200';

  // Filtered search and discovery content
  const filteredVideos = searchQuery 
    ? suggestedVideos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : suggestedVideos;

  const filteredNews = searchQuery 
    ? newsUpdates.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : newsUpdates;

  // Action: Post & Publish Story from multi-step wizard
  const handlePublishStorySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Select media URL based on template choices or chosen gallery media
    let finalMediaUrl = '';
    if (selectedTemplate === 'text-only') {
      if (selectedGradient === 'gradient-sunset') finalMediaUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80';
      else if (selectedGradient === 'gradient-cosmic') finalMediaUrl = 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&q=80';
      else if (selectedGradient === 'gradient-emerald') finalMediaUrl = 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500&q=80';
      else finalMediaUrl = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&q=80';
    } else if (selectedGalleryMedia) {
      finalMediaUrl = selectedGalleryMedia.url;
    } else {
      finalMediaUrl = customMediaUrl || 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=500&q=80';
    }

    const newStoryId = `story-me-${Date.now()}`;
    const newStoryEntry: Story = {
      id: newStoryId,
      username: 'Vous',
      avatar: currentUserAvatar,
      isSeen: false,
      mediaUrl: finalMediaUrl,
      filter: storyFilter,
      caption: storyCaption,
      font: storyFont,
      captionColor: captionColor,
      auraLevel: storyAuraLevel,
      isPrivate: storyIsPrivate,
      stickers: [...storyActiveStickers]
    };

    // Prepend to stories array
    setStories(prevStories => [newStoryEntry, ...prevStories]);

    // Reward pop coins
    setCoins(prev => prev + 25);

    // Push notification log
    const newNotif: AxoraNotification = {
      id: `notif-s-${Date.now()}`,
      type: 'match',
      title: 'Story Diffusée live ! ⚡',
      description: `Votre story éphémère d'Aura ${storyAuraLevel}% est publiée sur le Loop Global 🎉. Vous remportez +25 Axo🪙 !`,
      timestamp: "À l'instant"
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Cleanup & Exit
    setStoryCaption('');
    setStoryFilter('normal');
    setStoryActiveStickers([]);
    setBrushDrawings([]);
    setBrushModeActive(false);
    setShowCreateStoryModal(false);

    // Automatically view the newly posted story right away!
    setActiveStory(newStoryEntry);
  };

  // Quick Action: Add Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writePostText.trim()) return;

    const newPost: Post = {
      id: `p_new_${Date.now()}`,
      author: `${currentUserName} (Vous)`,
      username: currentUserUsername.replace('@', ''),
      avatar: currentUserAvatar,
      text: writePostText,
      likes: 0,
      comments: 0,
      shares: 0,
      time: 'À l\'instant'
    };

    setPosts([newPost, ...posts]);
    setWritePostText('');
  };

  // Quick Action: Send direct message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeChatText.trim() || !selectedChatId) return;

    const newMsg: ChatMessage = {
      id: `m_new_${Date.now()}`,
      text: writeChatText,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistories({
      ...chatHistories,
      [selectedChatId]: [...(chatHistories[selectedChatId] || []), newMsg]
    });

    // Update last message in active chat summary too
    setChats(prev => prev.map(ch => {
      if (ch.id === selectedChatId) {
        return { ...ch, lastMessage: writeChatText, timestamp: '14:26' };
      }
      return ch;
    }));

    setWriteChatText('');
  };

  // Like Toggle
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  // Vote on Polls
  const handleVote = (postId: string, optionId: number) => {
    if (votedPolls[postId]) return; // Single vote only
    setVotedPolls({ ...votedPolls, [postId]: optionId });

    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.pollData) {
        const updatedOptions = p.pollData.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...p,
          pollData: {
            ...p.pollData,
            options: updatedOptions,
            totalVotes: p.pollData.totalVotes + 1
          }
        };
      }
      return p;
    }));
  };

  // Join or leave a pop session
  const [joinedSessionIds, setJoinedSessionIds] = useState<string[]>([]);
  const toggleJoinSession = (sessionId: string) => {
    if (joinedSessionIds.includes(sessionId)) {
      setJoinedSessionIds(prev => prev.filter(id => id !== sessionId));
      setPopSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return { ...session, activeCount: session.activeCount - 1 };
        }
        return session;
      }));
    } else {
      setJoinedSessionIds(prev => [...prev, sessionId]);
      setPopSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return { ...session, activeCount: session.activeCount + 1 };
        }
        return session;
      }));
    }
  };

  // Create customized session
  const handleCreatePopSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const newSession: PopSession = {
      id: `pop_new_${Date.now()}`,
      title: newSessionTitle,
      host: 'Vous (Créateur)',
      hostAvatar: currentUserAvatar,
      activeCount: 1,
      category: newSessionCategory,
      timeRemaining: newSessionDuration
    };

    setPopSessions([newSession, ...popSessions]);
    setJoinedSessionIds(prev => [...prev, newSession.id]);
    setNewSessionTitle('');
    setShowRegisterSessionModal(false);
    setSelectedChatId(null);
  };

  return (
    <div className={`w-full h-full overflow-hidden font-sans transition-all duration-300 relative flex flex-col ${appBg}`}>
      
      {searchOpen ? (
        <div id="full-screen-search-view" className={`w-full h-full flex flex-col overflow-y-auto px-5 py-6 space-y-6 animate-in fade-in duration-300 ${
          isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F9F9FB] text-zinc-900 animate-in fade-in'
        }`}>
          {/* 1. The Search Bar (Top) */}
          <div className="flex items-center gap-3 w-full">
            <div className={`flex-1 flex items-center gap-2.5 px-4.5 py-3.5 rounded-full border shadow-inner transition-all duration-300 ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white' 
                : 'bg-zinc-800/5 border-zinc-200 text-zinc-900'
            }`}>
              <Search className="w-5 h-5 text-[#FF2D55] flex-shrink-0" />
              <input 
                type="text"
                autoFocus
                placeholder="Rechercher sur Axora (membres, actus, vidéos)..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  // Auto-append to recent searches if length is good and typing finishes (simulate or let submit handle)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    if (!recentSearches.includes(searchQuery.trim())) {
                      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 5)]);
                    }
                  }
                }}
                className={`flex-1 bg-transparent text-sm outline-none border-none font-sans ${
                  isDark ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className={`p-1 rounded-full hover:bg-white/10 transition-all ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
              className={`text-sm font-semibold tracking-wide transition-all ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-[#FF2D55]'
              }`}
            >
              Annuler
            </button>
          </div>

          {/* 2. Recent Searches & Trending Hashtags */}
          {!searchQuery && (
            <div className="space-y-5 animate-in fade-in duration-200 text-left">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">RECHERCHES RÉCENTES</h4>
                    <button 
                      onClick={() => setRecentSearches([])}
                      className="text-[9px] font-black text-[#FF2D55] hover:underline uppercase font-mono tracking-wide"
                    >
                      Effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <div 
                        key={index}
                        onClick={() => setSearchQuery(term)}
                        className={`pl-3 pr-2 py-1.5 rounded-full border text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 hover:border-[#FF2D55]/30 text-zinc-300 hover:text-white' 
                            : 'bg-zinc-100 border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900 shadow-sm'
                        }`}
                      >
                        <span>{term}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="p-0.5 rounded-full hover:bg-black/20 text-zinc-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">TENDANCES ACTUELLES</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { tag: '#AuraAfrique', desc: 'Boostez votre synergie' },
                    { tag: '#TechSovereignty', desc: 'Souveraineté numérique' },
                    { tag: '#CryptoPop', desc: 'Dons de jetons en direct' },
                    { tag: '#LibreArbre', desc: 'Réseau sans censure' }
                  ].map((topic) => (
                    <div 
                      key={topic.tag}
                      onClick={() => {
                        setSearchQuery(topic.tag);
                        if (!recentSearches.includes(topic.tag)) {
                          setRecentSearches(prev => [topic.tag, ...prev.slice(0, 4)]);
                        }
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer text-left transition-all ${
                        isDark 
                          ? 'bg-[#141416] border-white/5 hover:border-red-500/30' 
                          : 'bg-white border-zinc-200 hover:border-red-500/25 shadow-sm'
                      }`}
                    >
                      <span className="text-xs font-black text-[#FF2D55] block">{topic.tag}</span>
                      <span className="text-[9.5px] text-zinc-500 mt-0.5 block">{topic.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Filter Tabs (Always visible when there is content or text query) */}
          <div className={`flex border-b border-zinc-800/25 ${isDark ? 'bg-transparent' : 'bg-transparent'} select-none`}>
            {[
              { id: 'all', name: 'Tout' },
              { id: 'members', name: 'Membres' },
              { id: 'videos', name: 'Vidéos' },
              { id: 'news', name: 'Actus' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSearchCategory(tab.id as any)}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  searchCategory === tab.id 
                    ? 'border-[#FF2D55] text-[#FF2D55]' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-400'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* 4. Filtered search results content container */}
          <div className="flex-1 space-y-6 text-left pb-16">
            
            {/* SUB-SECTION 1: Members/Utilisateurs */}
            {(searchCategory === 'all' || searchCategory === 'members') && (
              <div className="space-y-3.5">
                {/* Header of category */}
                <h4 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">MEMBRES SUGGÉRÉS</h4>
                
                {(() => {
                  const membersList = [
                    { id: 'm1', name: 'Kaelen Afri-Tech', username: 'kaelen_afri_tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Expert Cyber et Souveraineté Digitale 🌐', verified: true },
                    { id: 'm2', name: 'Axora Social Team', username: 'axora_social', avatar: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=200&q=80', bio: 'Équipe officielle de modération et nouveautés 📣', verified: true },
                    { id: 'm3', name: 'Leïla Karim', username: 'leila_dev', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', bio: 'Créatrice UI / UX passionnée de décentralisation 🎨', verified: false },
                    { id: 'm4', name: 'Florin Mayala', username: 'florin_m', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', bio: 'Passionné de technologie et investisseur web3 🪙', verified: false }
                  ];

                  const filteredMembers = searchQuery 
                    ? membersList.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.username.toLowerCase().includes(searchQuery.toLowerCase()))
                    : membersList;

                  if (filteredMembers.length === 0) {
                    return searchCategory === 'members' ? <p className="text-zinc-500 text-xs py-2 pl-1">Aucun membre trouvé.</p> : null;
                  }

                  return (
                    <div className="grid grid-cols-1 gap-2.5">
                      {filteredMembers.map(member => {
                        const isFollowing = followingUserIds.includes(member.id);

                        return (
                          <div 
                            key={member.id}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                              isDark 
                                ? 'bg-[#141416]/90 border-white/5 hover:border-white/10' 
                                : 'bg-white border-zinc-200 shadow-sm hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex gap-3 min-w-0">
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="w-10 h-10 rounded-full object-cover border border-[#FF2D55]/10 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-xs font-extrabold truncate ${isDark ? 'text-zinc-150' : 'text-zinc-800'}`}>{member.name}</span>
                                  {member.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                </div>
                                <span className="text-[10px] text-zinc-500 block">@{member.username}</span>
                                <p className="text-[10.5px] text-zinc-450 truncate mt-1 leading-normal">{member.bio}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (isFollowing) {
                                  setFollowingUserIds(prev => prev.filter(id => id !== member.id));
                                  // Add alerte
                                  const alert: AxoraNotification = {
                                    id: `unfollow-${Date.now()}`,
                                    title: "Désabonnement",
                                    description: `Vous vous êtes désabonné du compte de @${member.username}.`,
                                    timestamp: "À l'instant",
                                    type: 'pop'
                                  };
                                  setNotifications(prev => [alert, ...prev]);
                                } else {
                                  setFollowingUserIds(prev => [...prev, member.id]);
                                  // Add alerte
                                  const alert: AxoraNotification = {
                                    id: `follow-${Date.now()}`,
                                    title: "Nouveau Suivi 🚀",
                                    description: `Vous suivez maintenant @${member.username}. Suivez leurs débats Pop et Stories de près !`,
                                    timestamp: "À l'instant",
                                    type: 'match'
                                  };
                                  setNotifications(prev => [alert, ...prev]);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                isFollowing 
                                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-750' 
                                  : 'bg-[#FF2D55] text-white hover:bg-[#FF2D55]/90 shadow-sm'
                              }`}
                            >
                              {isFollowing ? 'Suivi ✓' : 'Suivre'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SUB-SECTION 2: Vidéos */}
            {(searchCategory === 'all' || searchCategory === 'videos') && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FF2D55]" />
                  <h4 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">VIDÉOS & SHORTS</h4>
                </div>
                
                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-3.5">
                    {filteredVideos.map((video) => (
                      <div 
                        key={video.id} 
                        className="flex flex-col group cursor-pointer text-left"
                      >
                        <div className="aspect-[3/4] rounded-[22px] overflow-hidden border border-white/5 relative shadow-md bg-zinc-900/60 group-hover:scale-[1.02] transition-all duration-350">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                          <span className="absolute bottom-3 left-3 text-[9.5px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                            {video.views}
                          </span>
                        </div>
                        <p className="text-[10.5px] font-bold truncate mt-2 px-1 leading-tight group-hover:text-[#FF2D55] transition-colors" title={video.title}>
                          {video.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  searchCategory === 'videos' && <p className="text-zinc-500 text-xs py-2 pl-1">Aucune vidéo ne correspond à votre recherche.</p>
                )}
              </div>
            )}

            {/* SUB-SECTION 3: Actualités */}
            {(searchCategory === 'all' || searchCategory === 'news') && (
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">ACTUALITÉS EXCLUSIVES</h4>
                
                {filteredNews.length > 0 ? (
                  <div className="space-y-2.5">
                    {filteredNews.map((news) => (
                      <div 
                        key={news.id} 
                        className={`w-full flex items-center gap-4 p-3.5 rounded-[22px] transition-all border ${
                          isDark 
                            ? 'bg-[#070708]/85 hover:bg-[#0C0C0E]/95 border-white/5 shadow-md' 
                            : 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200/60 shadow-sm'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${news.gradient} flex-shrink-0 flex items-center justify-center border border-white/10 shadow-inner`}>
                          <span className="text-[9px] text-white/10 font-black tracking-widest font-mono uppercase">AX</span>
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <h4 className={`font-black text-xs sm:text-sm leading-tight truncate ${
                            isDark ? 'text-zinc-150' : 'text-zinc-900'
                          }`}>
                            {news.title}
                          </h4>
                          <p className={`text-[10.5px] sm:text-xs font-sans mt-1 leading-normal line-clamp-2 ${
                            isDark ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>
                            {news.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  searchCategory === 'news' && <p className="text-zinc-500 text-xs py-2 pl-1">Aucun article ne correspond à votre recherche.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 🔝 HEADER PRINCIPAL : AxoraHeader (Optional, home page only) */}
          {currentTab === 'home' && !notificationsOpen && !shopOpen && (
            <div className="sticky top-0 z-40 flex flex-col">
              <header className={`w-full px-5 py-4 border-b flex items-center justify-between backdrop-blur-md bg-opacity-95 transition-colors duration-300 ${
                isDark 
                  ? 'border-white/5 bg-[#0F0F0F]/95 text-white shadow-lg shadow-black/40' 
                  : 'border-zinc-200 bg-white/95 text-zinc-900 shadow-md shadow-zinc-100/50'
              }`}>
                
                {/* Left Side: The "AXORA" brand logo featuring a black and red gradient with no flame icon. */}
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => { setCurrentTab('home'); setSelectedChatId(null); }}>
                  <span className={`text-2xl font-black tracking-widest italic font-mono uppercase bg-gradient-to-r from-black via-[#7F1D1D] to-[#FF2D55] bg-clip-text text-transparent transition-all duration-300 ${
                    isDark 
                      ? 'filter drop-shadow-[0_0_8px_rgba(255,45,85,0.4)]' 
                      : 'filter drop-shadow-[0_0_6px_rgba(255,45,85,0.15)]'
                  }`}>
                    Axora
                  </span>
                </div>

                {/* Right Side: An action row containing three elements */}
                <div className="flex items-center gap-3">
                  {/* Element 1: A Pop Coins Badge displaying a gold star icon next to a dynamic coin count counter, wrapped in a subtle pink-bordered surface card. */}
                  <div 
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl hover:scale-105 active:scale-95 cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-[#1C1C1E] border-[#FF2D55]/30 text-white shadow-[0_0_10px_rgba(255,45,85,0.08)]' 
                        : 'bg-zinc-50 border-[#FF2D55]/25 text-zinc-900 shadow-sm shadow-[#FF2D55]/5'
                    }`}
                    title="Ouvrir la boutique de pièces"
                    onClick={() => { setShopOpen(true); setNotificationsOpen(false); setSearchOpen(false); }}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className={`text-xs font-mono font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-800'}`}>
                      {coins} Coins
                    </span>
                  </div>

                  {/* Element 2: A circular Search Button mapped to your search triggers. */}
                  <button 
                    id="header-search-trigger"
                    onClick={() => { setSearchOpen(!searchOpen); setNotificationsOpen(false); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 border ${
                      searchOpen 
                        ? 'bg-[#FF2D55]/20 border-[#FF2D55] text-[#FF2D55]' 
                        : isDark 
                          ? 'bg-[#1C1C1E] border-white/5 text-zinc-400 hover:text-white hover:border-white/15'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-350 shadow-sm'
                    }`}
                    title="Activer la recherche"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {/* Element 3: A circular Notification Button equipped with an overlapping pink alert dot indicator at the top right corner. */}
                  <button 
                    id="notif-bell-btn"
                    onClick={() => { setNotificationsOpen(!notificationsOpen); setSearchOpen(false); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 border relative ${
                      notificationsOpen 
                        ? 'bg-[#FF2D55]/20 border-[#FF2D55] text-[#FF2D55]'
                        : isDark 
                          ? 'bg-[#1C1C1E] border-white/5 text-zinc-400 hover:text-white hover:border-white/15'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-350 shadow-sm'
                    }`}
                    title="Centre de notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className={`absolute top-0 right-0.5 w-2.5 h-2.5 bg-[#FF2D55] rounded-full border animate-bounce shadow-[0_0_8px_#FF2D55] ${
                        isDark ? 'border-[#0F0F0F]' : 'border-white'
                      }`} />
                    )}
                  </button>
                </div>
              </header>

              {/* Mapped Search Trigger UI element (the slide-down input bar) */}
              {searchOpen && (
                <div className={`w-full px-5 py-3 border-b backdrop-blur-md flex items-center gap-2.5 animate-in slide-in-from-top duration-300 ${
                  isDark 
                    ? 'bg-[#0F0F0F]/95 border-white/5' 
                    : 'bg-white/95 border-zinc-200 shadow-sm shadow-zinc-100/50'
                }`}>
                  <Search className="w-4 h-4 text-[#FF2D55]" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Rechercher des posts, hashtags, sessions Pop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent text-xs outline-none border-none font-sans ${
                      isDark ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'
                    }`}
                  />
                  <button 
                    onClick={() => { setSearchQuery(''); setSearchOpen(false); }} 
                    className={`p-1 transition-colors ${
                      isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
          )}

       {/* MID-PORT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Overlay Notification Center */}
        <AxoraNotifications
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          isDark={isDark}
        />

        {/* Overlay Coin Shop */}
        <AxoraShop
          shopOpen={shopOpen}
          setShopOpen={setShopOpen}
          coins={coins}
          setCoins={setCoins}
          setNotifications={setNotifications}
          isDark={isDark}
        />

        {/* ---------------- 💻 SCREEN TABS IMPLEMENTATION ---------------- */}
        <div id="main-app-scroll-container" className={`flex-1 ${
          currentTab === 'reels' || (currentTab === 'messages' && selectedChatId !== null)
            ? 'overflow-hidden pb-0 bg-black text-white h-full relative' 
            : 'overflow-y-auto pb-20'
        }`}>
          
          {/* TAB 1: HOME (Feed & Stories) */}
          {currentTab === 'home' && (
            <div className="space-y-6">
              
              {/* Horizontal Stories bar */}
              <StoriesBar
                groupedStories={groupedStories}
                setActiveStory={setActiveStory}
                setShowCreateStoryModal={setShowCreateStoryModal}
                setStoryStep={setStoryStep}
                isDark={isDark}
              />

              {/* Feed Content Grid */}
              <div className="px-4 max-w-2xl mx-auto space-y-6">
                
                {/* Fast Composer Bento Box */}
                <form onSubmit={handleCreatePost} className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
                  <div className="flex items-start gap-3">
                    <img 
                      src={currentUserAvatar} 
                      alt="me" 
                      className="w-10 h-10 rounded-full object-cover bg-zinc-900" 
                    />
                    <textarea 
                      placeholder="Qu'est-ce qui vous passionne aujourd'hui ? Écrivez ou lancez un sondage..." 
                      value={writePostText}
                      onChange={(e) => setWritePostText(e.target.value)}
                      rows={2}
                      className="flex-1 bg-transparent border-0 outline-none pt-2 resize-none text-xs placeholder-zinc-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-zinc-800/20 pt-3">
                    <div className="flex gap-2 text-zinc-400">
                      <button type="button" className="p-2 hover:bg-zinc-800/10 rounded-xl transition-all cursor-pointer">
                        <ImageIcon className="w-4 h-4 text-red-500" />
                      </button>
                      <button type="button" className="p-2 hover:bg-zinc-800/10 rounded-xl transition-all cursor-pointer">
                        <MapPin className="w-4 h-4 text-amber-500" />
                      </button>
                      <button type="button" className="p-2 hover:bg-zinc-800/10 rounded-xl transition-all cursor-pointer">
                        <BarChart4 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-red-500/10 active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publier</span>
                    </button>
                  </div>
                </form>

                {/* Posts Feed */}
                <div className="space-y-5">
                  {posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      votedPolls={votedPolls}
                      handleVote={handleVote}
                      handleLike={handleLike}
                      cardBg={cardBg}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REELS SCREEN */}
          {currentTab === 'reels' && (
            <AxoraReels 
              coins={coins}
              setCoins={setCoins}
            />
          )}

          {/* TAB 3: POP SESSIONS (Redesigned & Evolved Pop Session Premium Feature) */}
          {currentTab === 'pop' && (
            <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
              <PopSessionEvolution 
                coins={coins}
                setCoins={setCoins}
                isDark={isDark}
              />
            </div>
          )}

          {/* TAB 4: MESSAGES & DIRECT CHAT SIMULATION */}
          {currentTab === 'messages' && (
            <div className={selectedChatId ? "w-full h-full" : "max-w-4xl mx-auto mt-2"}>
              <AxoraMessages 
                coins={coins}
                setCoins={setCoins}
                chats={chats}
                setChats={setChats}
                chatHistories={chatHistories}
                setChatHistories={setChatHistories}
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
                isDark={isDark}
              />
            </div>
          )}

          {/* TAB 5: BENTO PROFILE (Profile details) */}
          {currentTab === 'profile' && (
            <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
              <AtelierProfile 
                isCurrentlyLive={isCurrentlyLive}
                setIsCurrentlyLive={setIsCurrentlyLive}
                isPrivateProfile={isPrivateProfile}
                setIsPrivateProfile={setIsPrivateProfile}
                coins={coins}
                setCoins={setCoins}
                setCurrentTab={setCurrentTab}
                isDark={isDark}
                theme={theme}
                setTheme={setTheme}
              />

              {false && (
                <>
                  {/* Profile cover & Avatar in Bento Header */}
              <div className="relative rounded-[32px] overflow-hidden border border-white/5 bg-[#141416]/90 backdrop-blur-md shadow-2xl space-y-5">
                {/* The Live-Banner: wide, ultra-blurred loop of the user's latest Reel or Pop Session */}
                <div className="relative h-40 bg-zinc-950 overflow-hidden border-b border-[#FF2D55]/10 group">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" 
                    alt="Live Reel Loop Backdrop" 
                    className="w-full h-full object-cover filter blur-[10px] opacity-45 scale-125 transition-transform duration-[6000ms] group-hover:scale-135" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#141416]" />
                  <div className="absolute inset-0 bg-grid-pattern opacity-15" />
                  
                  {/* Glowing live loop badge */}
                  <span className="absolute top-4 right-5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-[#FF2D55] uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-black/20 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]" />
                    Live Reel Loop
                  </span>
                </div>
                
                {/* Avatar Section & Text */}
                <div className="px-6 pb-6 -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-5 relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left select-none">
                    {/* The Verified Avatar Ring: dual-color gradient ring toggled by state */}
                    <div 
                      onClick={() => setIsCurrentlyLive(!isCurrentlyLive)}
                      className={`relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 ${
                        isCurrentlyLive 
                          ? 'from-[#22D3EE] via-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.45)]' 
                          : 'from-[#FF2D55] via-[#E11D48] to-[#FF2D55] shadow-[0_0_20px_rgba(255,45,85,0.45)]'
                      }`}
                      title="Cliquez pour permuter entre Live (Cyan) et Story (Rose)"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80" 
                        alt="user profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-[#0F0F0F] bg-zinc-950" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCurrentlyLive ? 'bg-cyan-400' : 'bg-[#FF2D55]'}`} />
                        <span className={`relative inline-flex rounded-full h-4.5 w-4.5 border border-[#0F0F0F] ${isCurrentlyLive ? 'bg-cyan-500' : 'bg-[#FF2D55]'}`} />
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-center md:justify-start gap-1.5">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Auteur Invité</h2>
                        {/* The Green Certification Badge: Next to name with emerald check */}
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/10 flex-shrink-0 filter drop-shadow-[0_0_5px_rgba(52,211,153,0.35)]" />
                      </div>
                      <p className="text-xs font-mono text-zinc-400 tracking-wide">@invite_axo • Concepteur UI Premium</p>
                      
                      {/* The "Right Now" Status Card */}
                      <div className="pt-1 select-none">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] hover:border-[#FF2D55]/20 transition-all duration-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold tracking-wide text-zinc-300 font-sans">Coding the matrix...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-center select-none">
                    <button 
                      onClick={() => setIsPrivateProfile(!isPrivateProfile)}
                      className="px-4 py-2.5 rounded-2xl border border-white/5 bg-white/[0.04] text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] active:scale-95 transition-all flex items-center gap-1.5 hover:text-white"
                    >
                      {isPrivateProfile ? <Lock className="w-3.5 h-3.5 text-[#FF2D55]" /> : <Unlock className="w-3.5 h-3.5 text-[#22D3EE]" />}
                      {isPrivateProfile ? 'Privé' : 'Public'}
                    </button>
                    <button className="px-5 py-2.5 bg-[#FF2D55] hover:bg-[#E11D48] text-white rounded-2xl text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-all">
                      Éditer
                    </button>
                  </div>
                </div>
              </div>

              {/* The Gamified Metrics Cell */}
              <div className="p-6 rounded-[28px] border border-white/5 bg-gradient-to-r from-[#141416]/95 to-[#1c1c1f]/95 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2D55]/5 rounded-full filter blur-3xl -mr-12 -mt-12 pointer-events-none" />
                
                <div className="flex flex-1 items-center justify-around gap-4 divide-x divide-white/5">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono">FOLLOWERS</span>
                    <div className="text-3xl font-black text-white tracking-tighter mt-1 font-sans">14.8K</div>
                    <div className="text-[9px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5 font-mono">
                      <TrendingUp className="w-3 h-3" /> +12% cette semaine
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 pl-4">
                    <span className="text-[10px] font-black tracking-widest text-[#22D3EE] uppercase font-mono">TOTAL VIEWS</span>
                    <div className="text-3xl font-black text-white tracking-tighter mt-1 font-sans">5.8M</div>
                    <div className="text-[9px] text-zinc-500 font-medium mt-1.5 font-mono">vues cumulées</div>
                  </div>
                </div>

                {/* The Pop Coins Counter Premium Sub-capsule */}
                <div className="flex-shrink-0 flex flex-col items-center sm:items-end justify-center">
                  <div 
                    onClick={() => setShopOpen(true)}
                    className="relative px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-600/[0.03] to-amber-500/10 border border-amber-500/20 shadow-md flex items-center gap-2.5 group/coin cursor-pointer hover:border-amber-400/40 hover:scale-102 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-400/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-amber-500/80 tracking-widest uppercase font-mono">AXORA COINS</div>
                      <div className="text-xs font-black text-amber-400 font-mono tracking-wide">{coins ? `${coins} coins` : "250 coins"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Asymmetric Bento Grid (The Profile Core) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Cell A: The "Hyper-Link & Bio" Hub (Wide Rectangular Block) */}
                <div className="md:col-span-2 p-6 rounded-[28px] border border-white/5 bg-[#141416]/90 backdrop-blur-md flex flex-col justify-between gap-5 relative group overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#FF2D55] uppercase font-mono">
                      <User className="w-3.5 h-3.5" /> BIOGRAPHIE ET LIENS
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed font-sans font-medium">
                      🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créatif de l'écosystème Axora. Toujours à la recherche des meilleurs débats et d'échanges bienveillants !
                    </p>
                  </div>
                  
                  {/* Glowing pill-shaped interactive tags */}
                  <div className="flex flex-wrap gap-2.5 pt-2 select-none">
                    <a 
                      href="#instagram"
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-2 rounded-full text-[10px] font-semibold font-mono border border-[#FF2D55]/30 bg-gradient-to-r from-[#FF2D55]/10 to-[#FF2D55]/5 text-zinc-200 hover:text-[#FF2D55] hover:border-[#FF2D55] shadow-[0_0_10px_rgba(255,45,85,0.08)] hover:shadow-[0_0_15px_rgba(255,45,85,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 animate-pulse"
                      style={{ animationDuration: '3.5s' }}
                    >
                      @invite_axo
                    </a>
                    <a 
                      href="#github"
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-2 rounded-full text-[10px] font-semibold font-mono border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 text-zinc-200 hover:text-cyan-400 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.08)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 animate-pulse"
                      style={{ animationDuration: '5s' }}
                    >
                      github.com/axora
                    </a>
                    <a 
                      href="#website"
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-2 rounded-full text-[10px] font-semibold font-mono border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-zinc-200 hover:text-amber-400 hover:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.08)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 animate-pulse"
                      style={{ animationDuration: '4s' }}
                    >
                      axora.design/v2
                    </a>
                  </div>
                </div>

                {/* Cell B: The "Live Reel" Showcase (Tall Vertical Block - TikTok Style) */}
                <div className="row-span-2 p-1.5 rounded-[30px] border border-white/5 bg-[#141416]/95 backdrop-blur-md shadow-xl flex flex-col relative overflow-hidden group select-none">
                  <div className="relative w-full h-[320px] md:h-full rounded-[25px] overflow-hidden bg-zinc-950">
                    <img 
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80" 
                      alt="TikTok style Pinned Reel Live Preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Glossmorphic category indicator in top left */}
                    <div className="absolute top-4 left-4 h-6 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-extrabold text-white tracking-widest uppercase flex items-center justify-center gap-1 shadow-lg">
                      <Clapperboard className="w-3 h-3 text-[#FF2D55] animate-spin" style={{ animationDuration: '6s' }} /> PINNED REEL
                    </div>

                    {/* Glassmorphic player overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                      <button className="h-12 w-12 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF2D55] hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,45,85,0.4)]">
                        <Clapperboard className="w-5 h-5 fill-[#FF2D55]" />
                      </button>
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-widest font-mono">Lire l'extrait</span>
                    </div>

                    {/* Shadow overlay over lower part */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                    
                    {/* Bottom-left statistics layer */}
                    <div className="absolute bottom-4 left-4 space-y-0.5">
                      <span className="text-[9px] font-black tracking-widest text-[#FF2D55] uppercase font-mono">DÉMO POPULAIRE</span>
                      <p className="text-white font-extrabold text-xs leading-snug line-clamp-1">Design de Composants</p>
                      <span className="inline-block text-[10px] font-black text-white bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-md font-sans mt-1">
                        2.5M views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cell C: The "Pop Session" Capsule (Square Block) */}
                <div className="p-5 rounded-[28px] border border-white/5 bg-[#141416]/90 backdrop-blur-md shadow-lg flex flex-col justify-between relative group overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-400/[0.02] pointer-events-none animate-pulse" />
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase font-mono flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 animate-bounce text-cyan-400" /> POP SESSION
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-wider animate-pulse flex items-center gap-1 border border-cyan-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> ACTIVE NOW
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-tight text-white line-clamp-2">
                        Afrique du Sud Hub Digital : Code review & Design Bento
                      </h4>
                      <p className="text-[10px] font-medium text-zinc-400 mt-1 line-clamp-1">
                        Hôte: @invite_axo • Avec 140 auditeurs
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentTab('pop')}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-cyan-500/10 via-cyan-500/20 to-cyan-500/10 hover:from-cyan-500/20 hover:to-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all duration-350 hover:scale-102 active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.15)] flex items-center justify-center gap-1.5"
                  >
                    Rejoindre <Flame className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* The Content Matrix Tabs Section */}
              <div className="pt-4 border-t border-white/5 flex flex-col space-y-6">
                <div className="flex justify-center select-none">
                  <div className="inline-flex items-center gap-8 bg-white/[0.02] border border-white/5 backdrop-blur-md px-6 py-2 rounded-full shadow-inner">
                    <button 
                      onClick={() => setProfileSubTab('posts')}
                      className={`text-xs font-bold tracking-[0.2em] font-mono relative py-1 transition-colors duration-300 ${
                        profileSubTab === 'posts' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      POSTS
                      {profileSubTab === 'posts' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF2D55] rounded-full shadow-[0_0_8px_rgb(255,45,85)]" />
                      )}
                    </button>
                    
                    <button 
                      onClick={() => setProfileSubTab('reels')}
                      className={`text-xs font-bold tracking-[0.2em] font-mono relative py-1 transition-colors duration-300 ${
                        profileSubTab === 'reels' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      REELS
                      {profileSubTab === 'reels' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF2D55] rounded-full shadow-[0_0_8px_rgb(255,45,85)]" />
                      )}
                    </button>

                    <button 
                      onClick={() => setProfileSubTab('saved')}
                      className={`text-xs font-bold tracking-[0.2em] font-mono relative py-1 transition-colors duration-300 ${
                        profileSubTab === 'saved' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      SAVED
                      {profileSubTab === 'saved' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF2D55] rounded-full shadow-[0_0_8px_rgb(255,45,85)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Staggered Portfolio Grid (The Masonry Layout) */}
                {profileSubTab === 'posts' && (
                  <div className="columns-2 sm:columns-3 gap-5 space-y-5 pb-12">
                    
                    {/* Item 1: Tall image content */}
                    <div className="break-inside-avoid rounded-[24px] border border-white/5 bg-[#141416]/95 overflow-hidden group/mcard cursor-pointer relative shadow-md">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" 
                          alt="Bento Design"
                          className="w-full h-auto object-cover group-hover/mcard:scale-[1.03] transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Soft glassmorphism overlay instead of solid colors */}
                        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] opacity-0 group-hover/mcard:opacity-100 transition-all duration-350 flex items-center justify-center">
                          <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white font-bold flex items-center gap-1.5 shadow-lg shadow-black/30">
                            <Flame className="w-3.5 h-3.5 text-[#FF2D55] fill-[#FF2D55]" /> 245
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="text-[9px] font-bold text-[#FF2D55] font-mono tracking-wider uppercase">DESIGN</div>
                        <h5 className="font-extrabold text-xs text-white leading-tight">Redesigning Axora Web App v2</h5>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">Une étude de style Bento combinant le verre brossé et le rouge néon.</p>
                      </div>
                    </div>

                    {/* Item 2: Text card thought */}
                    <div className="break-inside-avoid p-5 rounded-[24px] border border-white/5 bg-gradient-to-br from-[#1C1C1E]/95 to-[#141416]/95 space-y-3 group/mcard cursor-pointer relative shadow-md">
                      <div className="absolute inset-0 bg-white/[0.005] rounded-[24px] pointer-events-none group-hover/mcard:bg-[#FF2D55]/5 border border-transparent group-hover/mcard:border-[#FF2D55]/25 transition-all duration-300" />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center font-black text-[9px] text-[#FF2D55] font-mono">AX</div>
                        <span className="text-[9px] font-mono font-bold text-zinc-500">PENSÉE DU JOUR</span>
                      </div>
                      <p className="text-[11px] font-medium font-sans text-stone-200 leading-relaxed italic">
                        "La simplicité est le summum de l'élégance. Les grilles asymétriques Bento capturent l'attention sans surcharger l'esprit créatif."
                      </p>
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 pt-1">
                        <span>Posté hier</span>
                        <span className="text-[#FF2D55] font-bold">Pop Match</span>
                      </div>
                    </div>

                    {/* Item 3: Tech code image */}
                    <div className="break-inside-avoid rounded-[24px] border border-white/5 bg-[#141416]/95 overflow-hidden group/mcard cursor-pointer relative shadow-md">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80" 
                          alt="Code Review Terminal"
                          className="w-full h-auto object-cover group-hover/mcard:scale-[1.03] transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] opacity-0 group-hover/mcard:opacity-100 transition-all duration-350 flex items-center justify-center">
                          <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white font-bold flex items-center gap-1.5 shadow-lg shadow-black/30">
                            <Flame className="w-3.5 h-3.5 text-[#FF2D55] fill-[#FF2D55]" /> 198
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="text-[9px] font-bold text-cyan-400 font-mono tracking-wider uppercase">DEVELOPMENT</div>
                        <h5 className="font-extrabold text-xs text-white leading-tight">Revues de Code Interactives</h5>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">Comment l'écoute audio live améliore de 40% la review de PRs.</p>
                      </div>
                    </div>

                    {/* Item 4: Achievements card */}
                    <div className="break-inside-avoid p-5 rounded-[24px] border border-white/5 bg-gradient-to-br from-[#141416]/95 to-[#1c1c1f]/95 space-y-3 group/mcard cursor-pointer relative shadow-md">
                      <div className="absolute inset-0 rounded-[24px] pointer-events-none group-hover/mcard:bg-cyan-500/5 border border-transparent group-hover/mcard:border-cyan-400/20 transition-all duration-300" />
                      <div className="space-y-1">
                        <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase font-mono">CRÉATEUR JALONS</span>
                        <h5 className="text-xs font-bold text-white uppercase font-sans tracking-wide">Progression Élite</h5>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[11px] text-zinc-300">Auditeur d'or : 100+ h Pop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]" />
                          <span className="text-[11px] text-zinc-300">Hôte de débats certifié</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[11px] text-zinc-300">Designer Bento Originel</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 5: Meetup photo */}
                    <div className="break-inside-avoid rounded-[24px] border border-white/5 bg-[#141416]/95 overflow-hidden group/mcard cursor-pointer relative shadow-md">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" 
                          alt="Africa Tech Meetup"
                          className="w-full h-auto object-cover group-hover/mcard:scale-[1.03] transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] opacity-0 group-hover/mcard:opacity-100 transition-all duration-350 flex items-center justify-center">
                          <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white font-bold flex items-center gap-1.5 shadow-lg shadow-black/30">
                            <Flame className="w-3.5 h-3.5 text-[#FF2D55] fill-[#FF2D55]" /> 312
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="text-[9px] font-bold text-amber-400 font-mono tracking-wider uppercase">COMMUNITY</div>
                        <h5 className="font-extrabold text-xs text-white leading-tight">L'Afrique en Tech</h5>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">Récapitulatif de notre premier meetup et perspectives d'avenir.</p>
                      </div>
                    </div>

                    {/* Item 6: Short quote statement */}
                    <div className="break-inside-avoid p-5 rounded-[24px] border border-white/5 bg-gradient-to-br from-[#1C1C1E]/95 to-[#141416]/95 space-y-2 group/mcard cursor-pointer relative shadow-md">
                      <div className="absolute inset-0 rounded-[24px] pointer-events-none group-hover/mcard:bg-amber-500/5 border border-transparent group-hover/mcard:border-amber-400/20 transition-all duration-300" />
                      <h6 className="text-[9px] font-black tracking-wider text-amber-500 uppercase font-mono">DÉCLARATION</h6>
                      <p className="text-[11px] text-zinc-300 font-mono leading-relaxed italic">
                        "Build for the culture, deploy for the globe."
                      </p>
                    </div>

                  </div>
                )}

                {/* Staggered Reels sub-tab view */}
                {profileSubTab === 'reels' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-12 select-none">
                    <div className="rounded-[24px] border border-white/5 bg-[#141416] p-1.5 relative group overflow-hidden cursor-pointer shadow-lg aspect-[9/16]">
                      <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" 
                        alt="Reels Tutorial" 
                        className="w-full h-full object-cover rounded-[20px] filter saturate-[1.1]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
                        <Clapperboard className="w-7 h-7 text-[#FF2D55] animate-bounce" />
                        <span className="text-[10px] text-white font-black tracking-widest font-mono uppercase">Lire le Reel</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4.5 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none">
                        <div className="text-[10px] font-extrabold text-white flex items-center justify-between">
                          <span>Tuto Design Axora v2</span>
                          <span className="text-[#FF2D55] bg-[#FF2D55]/10 px-1.5 py-0.5 rounded font-mono border border-[#FF2D55]/20">1.2M views</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#141416] p-1.5 relative group overflow-hidden cursor-pointer shadow-lg aspect-[9/16]">
                      <img 
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80" 
                        alt="Crypto debate" 
                        className="w-full h-full object-cover rounded-[20px] filter saturate-[1.1]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
                        <Clapperboard className="w-7 h-7 text-[#FF2D55]" />
                        <span className="text-[10px] text-white font-black tracking-widest font-mono uppercase">Lire le Reel</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4.5 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none">
                        <div className="text-[10px] font-extrabold text-white flex items-center justify-between">
                          <span>Crypto Débat Pop Live</span>
                          <span className="text-[#FF2D55] bg-[#FF2D55]/10 px-1.5 py-0.5 rounded font-mono border border-[#FF2D55]/20">840K views</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#141416] p-1.5 relative group overflow-hidden cursor-pointer shadow-lg aspect-[9/16]">
                      <img 
                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80" 
                        alt="Code Review" 
                        className="w-full h-full object-cover rounded-[20px] filter saturate-[1.1]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
                        <Clapperboard className="w-7 h-7 text-[#FF2D55]" />
                        <span className="text-[10px] text-white font-black tracking-widest font-mono uppercase">Lire le Reel</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4.5 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none">
                        <div className="text-[10px] font-extrabold text-white flex items-center justify-between">
                          <span>Code Review Lena</span>
                          <span className="text-[#FF2D55] bg-[#FF2D55]/10 px-1.5 py-0.5 rounded font-mono border border-[#FF2D55]/20">420K views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved collections view */}
                {profileSubTab === 'saved' && (
                  <div className="columns-2 sm:columns-3 gap-5 space-y-5 pb-12 select-none">
                    <div className="break-inside-avoid p-5 rounded-[24px] border border-white/5 bg-gradient-to-br from-[#1C1C1E]/95 to-[#141416]/95 space-y-3 group/mcard cursor-pointer relative shadow-md">
                      <div className="absolute inset-0 rounded-[24px] pointer-events-none group-hover/mcard:bg-amber-500/[0.03] border border-transparent group-hover/mcard:border-amber-400/20 transition-all duration-300" />
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                        <span>Sauvegardé il y a 2j</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      </div>
                      <h5 className="font-extrabold text-xs text-white leading-tight">Dictionnaire des animations CSS</h5>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">Une référence essentielle pour créer des interfaces fluides & ergonomiques.</p>
                    </div>

                    <div className="break-inside-avoid rounded-[24px] border border-white/5 bg-[#141416]/95 overflow-hidden group/mcard cursor-pointer relative shadow-md">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80" 
                          alt="Information Security" 
                          className="w-full h-auto object-cover group-hover/mcard:scale-[1.03] transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="text-[9px] font-bold text-cyan-400 font-mono tracking-wider uppercase">SECURITY</div>
                        <h5 className="font-extrabold text-xs text-white leading-tight font-sans">Algorithmes de cryptographie asymétrique</h5>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">Les fondations de la sécurité de bout en bout décentralisée.</p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
                </>
              )}
            </div>
          )}

        </div>

        {/* ---------------- 🗺️ NAVIGATION & BAR PRINCIPALE BOTTOM BAR ---------------- */}
        {!(currentTab === 'messages' && selectedChatId !== null) && !notificationsOpen && !shopOpen && (
          <nav className={`absolute bottom-0 left-0 right-0 py-3.5 px-6 border-t flex justify-between items-center z-40 backdrop-blur-md bg-opacity-95 transition-all duration-305 ${
            currentTab === 'reels'
              ? 'bg-black/65 border-white/5 shadow-none rounded-t-none text-white'
              : isDark 
                ? 'bg-[#0F0F0F] border-white/5 shadow-t-2xl shadow-black/80 rounded-t-3xl text-inherit' 
                : 'bg-white border-zinc-200 rounded-t-3xl text-inherit'
          }`}>
            {/* HOME COMPONENT TAB */}
            <button 
              id="tab-btn-home"
              onClick={() => { setCurrentTab('home'); setSelectedChatId(null); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                currentTab === 'home' ? 'text-[#FF2D55] scale-102 font-bold drop-shadow-[0_0_8px_rgba(255,45,85,0.25)]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Home</span>
            </button>

            {/* REELS DETAILED */}
            <button 
              id="tab-btn-reels"
              onClick={() => { setCurrentTab('reels'); setSelectedChatId(null); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                currentTab === 'reels' ? 'text-[#FF2D55] scale-102 font-bold drop-shadow-[0_0_8px_rgba(255,45,85,0.25)]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Clapperboard className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Reels</span>
            </button>

            {/* FLAMME DU POP IN THE MIDDLE (STAR BUTTON) */}
            <button 
              id="tab-btn-pop"
              onClick={() => { setCurrentTab('pop'); setSelectedChatId(null); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                currentTab === 'pop' ? 'text-[#FF2D55] scale-102 font-bold drop-shadow-[0_0_8px_rgba(255,45,85,0.25)]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Flame className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Pop</span>
            </button>

            {/* MESSAGES/CHAT TAB */}
            <button 
              id="tab-btn-messages"
              onClick={() => { setCurrentTab('messages'); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                currentTab === 'messages' ? 'text-[#FF2D55] scale-102 font-bold drop-shadow-[0_0_8px_rgba(255,45,85,0.25)]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] tracking-tight font-sans">Messages</span>
            </button>

            {/* PROFILE DETAILED TAB */}
            <button 
              id="tab-btn-profile"
              onClick={() => { setCurrentTab('profile'); setSelectedChatId(null); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                currentTab === 'profile' ? 'text-[#FF2D55] scale-102 font-bold drop-shadow-[0_0_8px_rgba(255,45,85,0.25)]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] tracking-tight font-sans font-medium">Profile</span>
            </button>
          </nav>
        )}

      </div>
      </>
      )}

      {/* 🔮 OVERLAYS & DIALOG CREATION SESSIONS */}
      
      {/* 1. Modal creation de Pop Session (AxoraRegisterSessionDialog) */}
      {showRegisterSessionModal && (
        <div id="session-registration-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-[24px] p-6 border shadow-2xl relative space-y-4 ${
            isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <button 
              onClick={() => setShowRegisterSessionModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500 fill-red-500" />
              <h4 className="text-sm font-black uppercase tracking-wider">Créer une Pop Session</h4>
            </div>

            <p className="text-xs text-zinc-400">
              Paramétrez votre salon. Celui-ci sera visible directement dans l'onglet communautaire pour réunir instantanément de nouveaux participants.
            </p>

            <form onSubmit={handleCreatePopSession} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Thème de Débat</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Futur de l'UI & CSS en 2026..." 
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-black border border-zinc-800 rounded-xl outline-none focus:border-red-500 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Catégorie</label>
                <select 
                  value={newSessionCategory}
                  onChange={(e) => setNewSessionCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-black border border-zinc-800 rounded-xl outline-none focus:border-red-500 text-white"
                >
                  <option>Débat & Politique</option>
                  <option>Design & UX</option>
                  <option>Crypto & Blockchain</option>
                  <option>Musique & Chill</option>
                  <option>Sciences IA</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Durée préconisée</label>
                <select 
                  value={newSessionDuration}
                  onChange={(e) => setNewSessionDuration(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-black border border-zinc-800 rounded-xl outline-none focus:border-red-500 text-white"
                >
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 heure</option>
                  <option>2 heures</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 font-bold text-white rounded-xl text-xs transition-all active:scale-95"
              >
                Générer mon Salon Live (+50 Axo🪙)
              </button>
            </form>
          </div>
        </div>
      )}

      <StoryCreatorModal
        showCreateStoryModal={showCreateStoryModal}
        setShowCreateStoryModal={setShowCreateStoryModal}
        currentUserAvatar={currentUserAvatar}
        setStories={setStories}
        setCoins={setCoins}
        setNotifications={setNotifications}
        setActiveStory={setActiveStory}
      />

      {/* 2. Interactive Full Story Overlay (Story Editor & Viewer simulator) */}
      <StoryViewerModal
        activeStory={activeStory}
        setActiveStory={setActiveStory}
        stories={stories}
        storyProgress={storyProgress}
      />

    </div>
  );
}
