import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  MessageCircle, 
  Share2, 
  PhoneCall, 
  Video, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Send, 
  Image as ImageIcon, 
  Search, 
  ChevronLeft, 
  Plus, 
  Check, 
  Settings, 
  Palette, 
  Trash2, 
  Play, 
  Pause, 
  Smile, 
  Sparkles, 
  Bell, 
  MoreVertical,
  Volume2,
  VolumeX,
  X,
  Camera,
  Square,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRight,
  Bookmark,
  UserRound,
  Flag,
  Copy,
  Pencil,
  Forward,
  Users,
  UserPlus,
  LogOut,
  Info,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { ChatSummary, ChatMessage } from '../types';
import { isVerifiedAccount, VerifiedBadge } from './VerifiedBadge';

interface AxoraMessagesProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  chats: ChatSummary[];
  setChats: React.Dispatch<React.SetStateAction<ChatSummary[]>>;
  chatHistories: Record<string, ChatMessage[]>;
  setChatHistories: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  isDark: boolean;
  onViewPublicProfile?: (chat: ChatSummary) => void;
}

// Supported chat themes
interface ChatTheme {
  id: string;
  name: string;
  bubbleClass: string;
  bgGradient: string;
  accent: string;
  glowColor: string;
}

const CHAT_THEMES: ChatTheme[] = [
  { 
    id: 'cyber-red', 
    name: 'Cyber Crimson', 
    bubbleClass: 'bg-[var(--axo-accent)]',
    bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]',
    accent: 'var(--axo-accent)',
    glowColor: 'var(--axo-shadow)'
  },
  { 
    id: 'wave', 
    name: 'Vapor Aura', 
    bubbleClass: 'bg-[var(--axo-accent-wave)]',
    bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]',
    accent: 'var(--axo-accent-wave)',
    glowColor: 'var(--axo-shadow)'
  },
  { 
    id: 'emerald', 
    name: 'Hacker Mint', 
    bubbleClass: 'bg-[var(--axo-accent-mint)]',
    bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]',
    accent: 'var(--axo-accent-mint)',
    glowColor: 'var(--axo-shadow)'
  },
  { 
    id: 'solar', 
    name: 'Solar Flare', 
    bubbleClass: 'bg-[var(--axo-accent-solar)]',
    bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]',
    accent: 'var(--axo-accent-solar)',
    glowColor: 'var(--axo-shadow)'
  }
];

export function AxoraMessages({
  coins,
  setCoins,
  chats,
  setChats,
  chatHistories,
  setChatHistories,
  selectedChatId,
  setSelectedChatId,
  isDark,
  onViewPublicProfile
}: AxoraMessagesProps) {
  // Inbox tab filter: "all", "unread", "nearby", "match_pop"
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'unread' | 'nearby' | 'match_pop'>('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom theme dictionary mapped per discussion ID
  const [chatThemes, setChatThemes] = useState<Record<string, string>>({
    'c1': 'wave',
    'c2': 'cyber-red',
    'c3': 'emerald',
  });
  
  // Selected theme ID state
  const activeChatThemeId = chatThemes[selectedChatId || ''] || 'cyber-red';
  const activeTheme = CHAT_THEMES.find(t => t.id === activeChatThemeId) || CHAT_THEMES[0];
  
  // Reaction picker state
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, string>>({});
  
  // Voice note simulator states
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<Record<string, number>>({});
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [chatViewport, setChatViewport] = useState<{ height: number; top: number } | null>(null);
  const [friendAvatarMenu, setFriendAvatarMenu] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<{ src: string; alt: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active call screen simulation
  const [activeCall, setActiveCall] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quick replies list
  const QUICK_REPLIES = [
    "Absolument ! 🔥",
    "On s'organise ça ! 😉",
    "Génial comme idée 💡",
    "Dispo d'ici 10 min !",
    "🔒 Message sécurisé"
  ];

  // Simulated typing indicator
  const [isTyping, setIsTyping] = useState(false);

  // Toast confirmation
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Open settings sidebar panel for chat details
  const [showChatConfig, setShowChatConfig] = useState(false);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [showCommunityInfo, setShowCommunityInfo] = useState(false);
  const [followedMembers, setFollowedMembers] = useState<Set<string>>(new Set());
  const [communityTab, setCommunityTab] = useState<'members' | 'media' | 'info'>('members');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
  const [contextMessage, setContextMessage] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChat = chats.find(c => c.id === selectedChatId);
  const activeMessagesCount = selectedChatId ? (chatHistories[selectedChatId]?.length || 0) : 0;

  const suggestedMembers = [
    { id: 'u_amina', name: 'Amina Tshibola', username: 'amina.studio', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', isFollowing: false as const, role: 'member' as const },
    { id: 'u_kelly', name: 'Kelly Banza', username: 'kelly.product', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', isFollowing: true as const, role: 'member' as const },
    { id: 'u_grace', name: 'Grâce L.', username: 'grace.photo', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80', isFollowing: false as const, role: 'member' as const }
  ];

  const addCommunityMember = (member: typeof suggestedMembers[number]) => {
    if (!activeChat?.isGroup || activeChat.members?.some(item => item.id === member.id)) return;
    setChats(current => current.map(chat => chat.id === activeChat.id ? {
      ...chat,
      members: [...(chat.members || []), member],
      memberCount: (chat.memberCount || chat.members?.length || 0) + 1,
      memberAvatars: [...(chat.memberAvatars || []), member.avatar].slice(0, 4)
    } : chat));
    showToast(`${member.name} a été ajouté à la communauté`);
  };

  const leaveCommunity = () => {
    if (!activeChat || !confirm(`Quitter « ${activeChat.name} » ?`)) return;
    setChats(current => current.filter(chat => chat.id !== activeChat.id));
    setChatHistories(current => {
      const next = { ...current };
      delete next[activeChat.id];
      return next;
    });
    setShowCommunityInfo(false);
    setSelectedChatId(null);
  };

  useEffect(() => {
    if (!selectedChatId) {
      setChatViewport(null);
      return;
    }
    const viewport = window.visualViewport;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const syncViewport = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const next = {
          height: Math.round(viewport?.height ?? window.innerHeight),
          top: Math.round(viewport?.offsetTop ?? 0),
        };
        setChatViewport(current => current?.height === next.height && current?.top === next.top ? current : next);
      }, 180);
    };
    syncViewport();
    viewport?.addEventListener('resize', syncViewport);
    viewport?.addEventListener('scroll', syncViewport);
    window.addEventListener('resize', syncViewport);
    return () => {
      if (timer) clearTimeout(timer);
      viewport?.removeEventListener('resize', syncViewport);
      viewport?.removeEventListener('scroll', syncViewport);
      window.removeEventListener('resize', syncViewport);
    };
  }, [selectedChatId]);

  const openOwnMessageMenu = (message: ChatMessage) => {
    if (message.senderId === 'me') setContextMessage(message);
  };
  const startLongPress = (message: ChatMessage) => {
    if (message.senderId !== 'me') return;
    longPressTimerRef.current = setTimeout(() => openOwnMessageMenu(message), 520);
  };
  const cancelLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };
  const updateOwnMessage = (messageId: string, text: string) => {
    if (!activeChat || !text.trim()) return;
    setChatHistories(current => ({
      ...current,
      [activeChat.id]: (current[activeChat.id] || []).map(message => message.id === messageId ? { ...message, text: text.trim() } : message),
    }));
    setEditingMessage(null);
    setContextMessage(null);
    showToast('Message modifié');
  };
  const deleteOwnMessage = (messageId: string) => {
    if (!activeChat) return;
    setChatHistories(current => ({
      ...current,
      [activeChat.id]: (current[activeChat.id] || []).filter(message => message.id !== messageId),
    }));
    setContextMessage(null);
    showToast('Message supprimé pour tous');
  };

  // WhatsApp-like behavior: only the history scrolls, while the contact header
  // and composer remain fixed. New incoming and outgoing messages stay visible.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = messagesScrollRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: activeMessagesCount > 0 ? 'smooth' : 'auto'
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedChatId, activeMessagesCount, isTyping]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Handle call timer count
  useEffect(() => {
    if (activeCall) {
      setCallTimer(0);
      callIntervalRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [activeCall]);

  useEffect(() => {
    if (!isRecordingVoice) {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      return;
    }

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 59) {
          setIsRecordingVoice(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Simulate automated reply from Lena X or Kaelen when we message them
  const triggerAutomatedReply = (chatId: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const responses: Record<string, string[]> = {
        'c1': [
          "Carrément, je prépare mes samples ! 🎛️",
          "Ah super ! Regarde mon profil pour mes derniers morceaux.",
          "Ça roule ! Je te ping dès que c'est prêt.",
          "Génial ! n'oublie pas de voter sur mon sondage ! 🗳️"
        ],
        'c2': [
          "Reçu. Clé de session générée de mon côté. 🔑",
          "Le nœud serveur est parfaitement stable.",
          "Sécurisé de bout en bout.",
          "Entendu ! Le Bento UI est vraiment notre point fort."
        ],
        'c3': [
          "Merci ! N'hésitez pas si vous avez des retours design.",
          "Ah cool ! On essaie de moderniser l'iconographie.",
          "Top ! On verra ça au prochain sprint de démo."
        ]
      };

      const options = responses[chatId] || ["Message bien reçu ! 👍", "Super ! On en reparle."];
      const randomText = options[Math.floor(Math.random() * options.length)];

      const replyMsg: ChatMessage = {
        id: `m_rep_${Date.now()}`,
        text: randomText,
        senderId: 'other',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), replyMsg]
      }));

      // Update chats list summary
      setChats(prev => prev.map(ch => {
        if (ch.id === chatId) {
          return { ...ch, lastMessage: randomText, timestamp: 'À l\'instant' };
        }
        return ch;
      }));
    }, 2800);
  };

  // Submit direct message
  const [inputText, setInputText] = useState('');
  
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !selectedChatId) return;

    const newMsg: ChatMessage = {
      id: `m_me_${Date.now()}`,
      text: textToSend,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingToMessage ? {
        id: replyingToMessage.id,
        text: replyingToMessage.text,
        senderId: replyingToMessage.senderId
      } : undefined
    };

    setChatHistories(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));

    setChats(prev => prev.map(ch => {
      if (ch.id === selectedChatId) {
        return { ...ch, lastMessage: textToSend, timestamp: 'À l\'instant' };
      }
      return ch;
    }));

    setInputText('');
    setReplyingToMessage(null);
    
    // Auto simulated reply
    triggerAutomatedReply(selectedChatId);
  };

  const shareImage = (mediaUrl: string, source: 'camera' | 'gallery') => {
    if (!selectedChatId) return;

    const imgMsg: ChatMessage = {
      id: `m_img_${Date.now()}`,
      text: source === 'camera' ? 'Photo prise à l’instant' : 'Photo envoyée depuis la galerie',
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMedia: true,
      mediaUrl
    };

    setChatHistories(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), imgMsg]
    }));

    setChats(prev => prev.map(ch => {
      if (ch.id === selectedChatId) {
        return { ...ch, lastMessage: source === 'camera' ? '📷 Nouvelle photo' : '🖼️ Photo', timestamp: 'À l’instant' };
      }
      return ch;
    }));

    showToast(source === 'camera' ? 'Photo prise et envoyée !' : 'Photo de la galerie envoyée !');
    triggerAutomatedReply(selectedChatId);
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'gallery') => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choisissez un fichier image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => shareImage(reader.result as string, source);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const shareSimulatedVoiceNote = (duration = 1) => {
    if (!selectedChatId) return;
    const safeDuration = Math.max(1, duration);

    const voiceMsg: ChatMessage = {
      id: `m_voice_${Date.now()}`,
      text: `Message vocal de ${safeDuration} secondes`,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMedia: false, // We render the interactive player dynamically by reading the key prefix
    };

    // Inject voice metadata inside history state using custom tags
    setChatHistories(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), voiceMsg]
    }));

    setChats(prev => prev.map(ch => {
      if (ch.id === selectedChatId) {
        return { ...ch, lastMessage: `🎤 Note vocale (0:${safeDuration.toString().padStart(2, '0')})`, timestamp: 'À l’instant' };
      }
      return ch;
    }));

    showToast('Note vocale envoyée !');
    triggerAutomatedReply(selectedChatId);
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      shareSimulatedVoiceNote(recordingSeconds);
      setRecordingSeconds(0);
      return;
    }
    setRecordingSeconds(0);
    setIsRecordingVoice(true);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
    showToast('Enregistrement annulé');
  };

  const showToast = (text: string) => {
    setToastMsg(text);
  };

  // Toggle reactions on message
  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessageReactions(prev => {
      const current = prev[messageId];
      if (current === emoji) {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      }
      return { ...prev, [messageId]: emoji };
    });
    setActiveReactionMessageId(null);
    showToast(`Réaction ${emoji} ajoutée !`);
  };

  // Play/pause simulated voice note
  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    } else {
      setPlayingVoiceId(msgId);
      setVoiceProgress(prev => ({ ...prev, [msgId]: prev[msgId] || 0 }));
      
      voiceTimerRef.current = setInterval(() => {
        setVoiceProgress(prev => {
          const current = prev[msgId] || 0;
          if (current >= 100) {
            setPlayingVoiceId(null);
            if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
            return { ...prev, [msgId]: 0 };
          }
          return { ...prev, [msgId]: current + 8 };
        });
      }, 300);
    }
  };

  // double tap message like attachment
  const handleDoubleTapMessage = (msgId: string) => {
    if (!selectedChatId) return;
    const message = (chatHistories[selectedChatId] || []).find(item => item.id === msgId);
    if (!message) return;
    setReplyingToMessage(message);
    window.setTimeout(() => {
      const container = messagesScrollRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }, 80);
  };

  // Filtered chats lists
  const filteredChats = chats.filter(ch => {
    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = ch.name.toLowerCase().includes(q) || ch.username.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Tab filtering (mock categorization)
    if (activeTab === 'groups') return ch.isGroup;
    if (activeTab === 'unread') return ch.unreadCount > 0;
    if (activeTab === 'nearby') return ch.isOnline; // mock nearby as active online sessions
    if (activeTab === 'match_pop') return ch.id === 'c1' || ch.id === 'c3'; // match pop profiles

    return true; // For 'all'
  });

  const createGroup = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;
    const id = `g_${Date.now()}`;
    const group: ChatSummary = {
      id,
      name,
      username: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      lastMessage: 'Groupe créé — envoyez le premier message',
      timestamp: 'À l’instant',
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&q=80',
      isOnline: true,
      isGroup: true,
      currentUserRole: 'admin',
      memberCount: 1,
      memberAvatars: []
    };
    setChats(current => [group, ...current]);
    setChatHistories(current => ({ ...current, [id]: [] }));
    setNewGroupName('');
    setShowCreateGroup(false);
    setSelectedChatId(id);
    showToast('Groupe créé avec succès');
  };

  return (
    <div
      id="axora-insta-messaging"
      className={`w-full h-full flex flex-col bg-[var(--axo-bg)] text-[var(--axo-text)] ${selectedChatId ? 'fixed inset-x-0 z-[45] min-h-0 overflow-hidden' : 'min-h-[520px]'}`}
      style={selectedChatId && chatViewport ? { height: `${chatViewport.height}px`, top: `${chatViewport.top}px`, bottom: 'auto' } : undefined}
    >
      <AnimatePresence>
        {showCreateGroup && (
          <div className="fixed inset-0 z-[130] flex h-[100dvh] items-center justify-center p-3 sm:p-4">
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateGroup(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Fermer" />
            <motion.form onSubmit={createGroup} initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-sm overflow-y-auto rounded-[24px] border border-[var(--axo-border)] bg-[var(--axo-bg)] p-4 shadow-2xl sm:rounded-[28px] sm:p-5">
              <div className="mb-5 flex items-start justify-between">
                <div><p className="text-lg font-black">Nouveau groupe</p><p className="mt-1 text-xs text-[var(--axo-text-muted)]">Créez un espace pour votre communauté.</p></div>
                <button type="button" onClick={() => setShowCreateGroup(false)} className="rounded-full p-2 text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface)]" aria-label="Fermer"><X className="h-4 w-4" /></button>
              </div>
              <label htmlFor="group-name" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--axo-text-muted)]">Nom du groupe</label>
              <input id="group-name" autoFocus value={newGroupName} onChange={event => setNewGroupName(event.target.value)} placeholder="Ex. Designers de Kinshasa" maxLength={48} className="w-full rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--axo-accent)]" />
              <button type="submit" disabled={!newGroupName.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--axo-accent)] px-4 py-3 text-xs font-black text-white transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40"><Users className="h-4 w-4" />Créer le groupe</button>
            </motion.form>
          </div>
        )}
        {friendAvatarMenu && activeChat && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFriendAvatarMenu(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Fermer" />
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="relative w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-bg)] p-4 shadow-2xl">
              <div className="flex items-center gap-3 px-2 pb-4">
                <img src={activeChat.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 text-left"><p className="truncate text-sm font-black">{activeChat.name}</p><p className="text-[10px] text-zinc-500">Photo de profil</p></div>
              </div>
              <button type="button" onClick={() => { setFriendAvatarMenu(false); setAvatarPreview({ src: activeChat.avatar, alt: `Photo de ${activeChat.name}` }); }} className="w-full rounded-2xl bg-[var(--axo-surface)] px-4 py-3 text-xs font-black text-[var(--axo-accent-wave)]">Voir la photo</button>
              <button type="button" onClick={() => setFriendAvatarMenu(false)} className="mt-2 w-full rounded-2xl px-4 py-3 text-xs font-bold text-zinc-500">Annuler</button>
            </motion.div>
          </div>
        )}
        {avatarPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-black p-4">
            <button type="button" onClick={() => setAvatarPreview(null)} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white" aria-label="Fermer"><X className="h-5 w-5" /></button>
            <img src={avatarPreview.src} alt={avatarPreview.alt} className="max-h-full max-w-full object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 🚀 SLEEK TOP HEADER BAR */}
      {!selectedChatId && (
        <div className={`flex py-2.5 px-4 items-center justify-between backdrop-blur-md select-none z-10 block border-b ${
          isDark ? 'border-transparent bg-transparent' : 'border-transparent bg-transparent'
        }`}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[var(--axo-accent)]" />
            <h2 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-150' : 'text-zinc-700'}`}>Messages</h2>
          </div>
          <button type="button" onClick={() => setShowCreateGroup(true)} className="flex items-center gap-1.5 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--axo-accent)] transition hover:border-[var(--axo-accent)] active:scale-95"><Plus className="h-3.5 w-3.5" />Nouveau groupe</button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        
        {/* ================= CHATS COLUMN SIDEBAR ================= */}
        <div className={`w-full flex flex-col select-none ${selectedChatId ? 'hidden' : 'flex'}`}>
          
          {/* SEARCH INPUT */}
          <div className="p-3">
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all ${
              isDark 
                ? 'bg-[var(--axo-surface)] border-[var(--axo-border)] focus-within:border-[var(--axo-accent)]'
                : 'bg-[var(--axo-surface)] border-[var(--axo-border)] focus-within:border-[var(--axo-accent)]'
            }`}>
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Rechercher un auteur..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent border-none text-[11px] outline-none focus:ring-0 font-sans ${
                  isDark ? 'placeholder:text-[var(--axo-text-muted)] text-[var(--axo-text)]' : 'placeholder:text-[var(--axo-text-muted)] text-[var(--axo-text)]'
                }`}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className={`p-0.5 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ⚡ DIRECT CATEGORY TABS (all, unread, nearby, match pop) */}
          <div className={`flex border-b py-1.5 px-4 select-none ${
            isDark ? 'border-transparent bg-transparent' : 'border-transparent bg-transparent'
          }`}>
            <div className="flex gap-4 overflow-x-auto w-full no-scrollbar">
              <button 
                type="button"
                onClick={() => setActiveTab('all')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'all' ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)] hover:text-[var(--axo-text)]'
                }`}
              >
                <span>all</span>
                {activeTab === 'all' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--axo-accent)]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('groups')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${activeTab === 'groups' ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)] hover:text-[var(--axo-text)]'}`}
              >
                <span>groupes</span>
                {activeTab === 'groups' && <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--axo-accent)]" />}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeTab === 'unread' ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)] hover:text-[var(--axo-text)]'
                }`}
              >
                <span>unread</span>
                {chats.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="w-4 h-4 bg-[var(--axo-surface-muted)] text-[var(--axo-accent)] text-[8px] rounded-full flex items-center justify-center font-bold">
                    {chats.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
                {activeTab === 'unread' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--axo-accent)]" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('nearby')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'nearby' ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)] hover:text-[var(--axo-text)]'
                }`}
              >
                <span>nearby</span>
                {activeTab === 'nearby' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--axo-accent)]" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('match_pop')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'match_pop' ? 'text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)] hover:text-[var(--axo-text)]'
                }`}
              >
                <span>match pop</span>
                {activeTab === 'match_pop' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--axo-accent)]" />
                )}
              </button>
            </div>
          </div>

          {/* CHATS DIRECT LIST FEED */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-[180px]">
            {filteredChats.map(ch => {
              const themeForChat = chatThemes[ch.id] || 'cyber-red';
              const t = CHAT_THEMES.find(item => item.id === themeForChat) || CHAT_THEMES[0];
              const isSelected = selectedChatId === ch.id;

              return (
                <div 
                  key={ch.id}
                  onClick={() => { setSelectedChatId(ch.id); setShowChatConfig(false); }}
                  className={`p-3 rounded-2.5xl border transition-all duration-300 cursor-pointer flex gap-3 relative overflow-hidden group/item ${
                    isSelected 
                      ? 'bg-[var(--axo-surface-strong)] border-[var(--axo-border)] text-[var(--axo-text)] shadow-lg shadow-[var(--axo-shadow)]'
                      : 'bg-transparent border-transparent hover:bg-[var(--axo-surface)] hover:border-[var(--axo-border)]'
                  }`}
                >
                  {/* Selected neon border strip */}
                  {isSelected && (
                    <div 
                      className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full"
                      style={{ backgroundColor: t.accent }}
                    />
                  )}

                  {/* Avatar wrapper */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-full p-[2px] ${ch.isOnline ? 'bg-gradient-to-tr from-emerald-400 to-cyan-400' : 'bg-transparent'}`}>
                      <img 
                        referrerPolicy="no-referrer" 
                        src={ch.avatar} 
                        alt={ch.name} 
                        className="w-full h-full rounded-full object-cover border border-[var(--axo-border)] bg-[var(--axo-surface)]"
                      />
                    </div>
                    {ch.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--axo-bg)] rounded-full" />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`text-[11.5px] font-black tracking-wide flex items-center gap-1 transition-colors ${
                        isDark ? 'text-zinc-100 group-hover/item:text-white' : 'text-zinc-900 group-hover/item:text-black'
                      }`}>
                        {ch.name}
                        {ch.isGroup && <Users className="h-3 w-3 text-[var(--axo-accent-wave)]" aria-label="Groupe" />}
                        {isVerifiedAccount(ch.username) && <VerifiedBadge size={14} />}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500 group-hover/item:text-zinc-400">{ch.timestamp}</span>
                    </div>

                    <p className={`text-[10px] truncate ${
                      ch.unreadCount > 0
                        ? `${isDark ? 'text-white' : 'text-zinc-950'} font-extrabold font-sans`
                        : isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      {ch.lastMessage}
                    </p>
                  </div>

                  {/* Unread dot or simulated count badge */}
                  {ch.unreadCount > 0 && (
                    <div className="self-center flex-shrink-0 flex items-center justify-center h-4.5 min-w-4.5 px-1 bg-[var(--axo-accent)] rounded-full text-[8.5px] font-black text-[var(--axo-on-accent)] font-mono shadow-md">
                      {ch.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredChats.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-[10px] text-zinc-500 italic font-mono">Aucune discussion disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= ACTIVE CHAT & CALL WINDOW ================= */}
        <div className={`w-full flex-1 min-h-0 flex-col overflow-hidden relative ${
          isDark ? 'bg-transparent' : 'bg-transparent'
        } ${selectedChatId ? 'flex' : 'hidden'}`}>
          {selectedChatId && activeChat ? (
            <>
              <AnimatePresence>
                {showCommunityInfo && activeChat.isGroup && (
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="absolute inset-0 z-50 overflow-y-auto overscroll-contain bg-[var(--axo-bg)] pb-[env(safe-area-inset-bottom)] text-[var(--axo-text)]"
                  >
                    <div className="sticky top-0 z-10 flex min-h-14 items-center justify-between gap-3 border-b border-[var(--axo-border)] bg-[var(--axo-bg)] px-3 py-2.5 sm:p-4">
                      <button type="button" onClick={() => setShowCommunityInfo(false)} className="flex items-center gap-2 text-xs font-black">
                        <ChevronLeft className="h-5 w-5 text-[var(--axo-accent)]" /> <span className="sm:hidden">Retour</span><span className="hidden sm:inline">Retour au groupe</span>
                      </button>
                      <span className="text-[10px] font-mono text-[var(--axo-text-muted)]">COMMUNAUTÉ</span>
                    </div>

                    <div className="mx-auto max-w-lg px-3 py-5 sm:p-5">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative">
                          <img src={activeChat.avatar} alt="" className="h-20 w-20 rounded-[26px] border-2 border-[var(--axo-accent)] object-cover sm:h-24 sm:w-24 sm:rounded-[30px]" />
                          <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[var(--axo-bg)] bg-[var(--axo-accent)] text-white"><Users className="h-4 w-4" /></span>
                        </div>
                        <h2 className="mt-4 text-lg font-black sm:text-xl">{activeChat.name}</h2>
                        <p className="mt-1 text-xs text-[var(--axo-text-muted)]">Communauté · {activeChat.memberCount || activeChat.members?.length || 1} membres</p>
                        <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--axo-text-muted)]">Un espace collectif où les membres échangent, découvrent des profils et développent leur réseau.</p>
                      </div>

                      <div className="mt-6 grid grid-cols-3 rounded-2xl bg-[var(--axo-surface)] p-1" role="tablist" aria-label="Informations de la communauté">
                        {([['members', 'Membres'], ['media', 'Médias'], ['info', 'Infos']] as const).map(([id, label]) => (
                          <button key={id} type="button" role="tab" aria-selected={communityTab === id} onClick={() => setCommunityTab(id)} className={`rounded-xl px-2 py-2.5 text-[10px] font-black transition ${communityTab === id ? 'bg-[var(--axo-bg)] text-[var(--axo-accent)] shadow-sm' : 'text-[var(--axo-text-muted)]'}`}>{label}</button>
                        ))}
                      </div>

                      {communityTab === 'members' && <section className="mt-5" aria-labelledby="community-members-title">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div><h3 id="community-members-title" className="text-sm font-black">Membres</h3><p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">{activeChat.members?.length || 0} profils affichés</p></div>
                          {activeChat.currentUserRole === 'admin' && <button type="button" onClick={() => setShowAddMember(value => !value)} className="flex min-h-10 items-center gap-1.5 rounded-xl bg-[var(--axo-accent)] px-3 text-[10px] font-black text-white"><UserPlus className="h-4 w-4" />Ajouter</button>}
                        </div>

                        <AnimatePresence>
                          {showAddMember && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)]">
                            <div className="border-b border-[var(--axo-border)] p-3"><p className="text-xs font-black">Ajouter des membres</p><p className="mt-1 text-[9px] text-[var(--axo-text-muted)]">Visible uniquement par les administrateurs.</p></div>
                            {suggestedMembers.map(member => {
                              const alreadyAdded = activeChat.members?.some(item => item.id === member.id);
                              return <div key={member.id} className="flex items-center gap-3 border-b border-[var(--axo-border)] p-3 last:border-0">
                                <img src={member.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                                <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black">{member.name}</p><p className="truncate text-[9px] text-[var(--axo-text-muted)]">@{member.username}</p></div>
                                <button type="button" disabled={alreadyAdded} onClick={() => addCommunityMember(member)} className="rounded-lg border border-[var(--axo-accent)] px-2.5 py-1.5 text-[9px] font-black text-[var(--axo-accent)] disabled:border-[var(--axo-border)] disabled:text-[var(--axo-text-muted)]">{alreadyAdded ? 'Ajouté' : 'Ajouter'}</button>
                              </div>;
                            })}
                          </motion.div>}
                        </AnimatePresence>

                        <div className="space-y-2">
                          {(activeChat.members || []).map(member => {
                            const isFollowing = member.isFollowing || followedMembers.has(member.id);
                            return <div key={member.id} className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-2.5 sm:p-3">
                              <img src={member.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11" />
                              <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><p className="truncate text-xs font-black">{member.name}</p>{member.role === 'admin' && <span className="rounded-full bg-[var(--axo-accent)]/10 px-2 py-0.5 text-[8px] font-black uppercase text-[var(--axo-accent)]">Admin</span>}</div><p className="truncate text-[10px] text-[var(--axo-text-muted)]">@{member.username}</p></div>
                              <button type="button" disabled={isFollowing} onClick={() => { setFollowedMembers(current => new Set(current).add(member.id)); showToast(`Vous suivez maintenant ${member.name}`); }} className={`min-h-9 shrink-0 rounded-xl px-2.5 py-2 text-[10px] font-black ${isFollowing ? 'border border-[var(--axo-border)] text-[var(--axo-text-muted)]' : 'bg-[var(--axo-accent)] text-white'}`}>{isFollowing ? 'Suivi' : 'Suivre'}</button>
                            </div>;
                          })}
                        </div>
                      </section>}

                      {communityTab === 'media' && <section className="mt-5">
                        <div className="mb-3"><h3 className="text-sm font-black">Médias, liens et documents</h3><p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">Partagés avec tous les membres du groupe.</p></div>
                        <div className="grid grid-cols-3 gap-2">
                          {['https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=80', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&q=80'].map((src, index) => <button key={src} type="button" onClick={() => setAvatarPreview({ src, alt: `Média partagé ${index + 1}` })} className="aspect-square overflow-hidden rounded-2xl bg-[var(--axo-surface)]"><img src={src} alt={`Média partagé ${index + 1}`} className="h-full w-full object-cover" /></button>)}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl border border-[var(--axo-border)] p-3"><Share2 className="h-4 w-4 text-cyan-400" /><p className="mt-2 text-[10px] font-black">4 liens partagés</p></div><div className="rounded-2xl border border-[var(--axo-border)] p-3"><Bookmark className="h-4 w-4 text-amber-400" /><p className="mt-2 text-[10px] font-black">2 documents</p></div></div>
                      </section>}

                      {communityTab === 'info' && <section className="mt-5 space-y-3">
                        <div className="rounded-2xl border border-[var(--axo-border)] p-4"><h3 className="flex items-center gap-2 text-sm font-black"><Info className="h-4 w-4 text-[var(--axo-accent)]" />À propos</h3><p className="mt-2 text-xs leading-relaxed text-[var(--axo-text-muted)]">Communauté privée pour partager des projets, des événements et des opportunités entre créateurs.</p><div className="mt-4 space-y-2 text-[10px] text-[var(--axo-text-muted)]"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Créée le 12 août 2026</p><p className="flex items-center gap-2"><Lock className="h-4 w-4" />Seuls les administrateurs ajoutent des membres</p></div></div>
                        <div className="overflow-hidden rounded-2xl border border-red-500/20">
                          <button type="button" onClick={() => showToast('Signalement de la communauté envoyé pour examen')} className="flex min-h-12 w-full items-center gap-3 px-4 text-left text-xs font-bold text-amber-500"><Flag className="h-4 w-4" />Signaler la communauté</button>
                          <button type="button" onClick={leaveCommunity} className="flex min-h-12 w-full items-center gap-3 border-t border-[var(--axo-border)] px-4 text-left text-xs font-bold text-red-500"><LogOut className="h-4 w-4" />Quitter la communauté</button>
                        </div>
                      </section>}
                    </div>
                  </motion.div>
                )}
                {showFriendProfile && (
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="absolute inset-0 z-50 overflow-y-auto bg-[var(--axo-bg)] text-[var(--axo-text)]"
                  >
                    <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-inherit">
                      <button type="button" onClick={() => { setShowFriendProfile(false); setShowPublicProfile(false); setShowReportPanel(false); }} className="flex items-center gap-2 text-xs font-black">
                        <ChevronLeft className="w-5 h-5 text-[var(--axo-accent)]" /> Retour au message
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500">CONTACT</span>
                    </div>

                    <div className="max-w-lg mx-auto p-5 space-y-5">
                      <div className="overflow-hidden rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface)]">
                        <div className="h-20 bg-gradient-to-r from-[var(--axo-accent)]/25 via-[var(--axo-accent-wave)]/20 to-cyan-400/20" />
                        <div className="px-5 pb-5 text-center">
                          <button type="button" onClick={() => setFriendAvatarMenu(true)} className="mx-auto -mt-12 block rounded-full transition active:scale-95" aria-label="Options de la photo de profil">
                            <img src={activeChat.avatar} alt={activeChat.name} className="h-24 w-24 rounded-full border-4 border-[var(--axo-bg)] object-cover ring-2 ring-[var(--axo-accent)]" />
                          </button>
                          <h2 className="mt-3 text-xl font-black">{activeChat.name}</h2>
                          <p className="text-xs text-[var(--axo-text-muted)]">@{activeChat.username}</p>
                          <div className="mt-2 flex items-center justify-center gap-2"><span className={`h-2 w-2 rounded-full ${activeChat.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'}`} /><span className="text-[10px] font-bold text-[var(--axo-text-muted)]">{activeChat.isOnline ? 'En ligne maintenant' : 'Vu récemment'}</span></div>
                          <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-[var(--axo-text-muted)]">Créateur passionné par la technologie, les échanges utiles et les projets qui rapprochent les communautés africaines.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <button type="button" onClick={() => { setShowFriendProfile(false); setActiveCall(true); }} className="py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex flex-col items-center gap-1 text-[10px] font-bold"><PhoneCall className="w-5 h-5" />Appeler</button>
                        <button type="button" onClick={() => setShowFriendProfile(false)} className="py-3 rounded-2xl bg-[var(--axo-surface-muted)] text-[var(--axo-accent)] flex flex-col items-center gap-1 text-[10px] font-bold"><MessageCircle className="w-5 h-5" />Message</button>
                        <button type="button" onClick={() => { setShowFriendProfile(false); onViewPublicProfile?.(activeChat); }} className="py-3 rounded-2xl bg-[var(--axo-surface-muted)] text-[var(--axo-accent-wave)] flex flex-col items-center gap-1 text-[10px] font-bold"><UserRound className="w-5 h-5" />Profil public</button>
                      </div>

                      <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] text-center">
                        <div className="p-3"><p className="text-sm font-black">128</p><p className="mt-1 text-[9px] text-[var(--axo-text-muted)]">Abonnés</p></div>
                        <div className="border-x border-[var(--axo-border)] p-3"><p className="text-sm font-black">84</p><p className="mt-1 text-[9px] text-[var(--axo-text-muted)]">Abonnements</p></div>
                        <div className="p-3"><p className="text-sm font-black">12</p><p className="mt-1 text-[9px] text-[var(--axo-text-muted)]">Relations communes</p></div>
                      </div>

                      <div className="rounded-3xl border border-[var(--axo-border)] p-4">
                        <h3 className="text-sm font-black">Informations du contact</h3>
                        <div className="mt-4 space-y-3 text-[11px] text-[var(--axo-text-muted)]">
                          <p className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-[var(--axo-accent)]" />Kinshasa, République démocratique du Congo</p>
                          <p className="flex items-center gap-3"><CalendarDays className="h-4 w-4 shrink-0 text-[var(--axo-accent-wave)]" />Ami sur Axora depuis juin 2026</p>
                          <p className="flex items-center gap-3"><Users className="h-4 w-4 shrink-0 text-cyan-400" />12 amis et 3 communautés en commun</p>
                          <p className="flex items-center gap-3"><Lock className="h-4 w-4 shrink-0 text-emerald-400" />Messages et appels chiffrés de bout en bout</p>
                        </div>
                      </div>

                      {showPublicProfile && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 p-5">
                          <h3 className="text-sm font-black">Profil public</h3>
                          <p className="mt-2 text-xs leading-relaxed text-zinc-500">Créateur Axora passionné par les échanges, la technologie et les rencontres communautaires.</p>
                          <div className="mt-4 flex gap-2"><span className="px-3 py-1 rounded-full bg-[#FF2D55]/10 text-[#FF2D55] text-[9px] font-bold">TECH</span><span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[9px] font-bold">POP</span></div>
                        </motion.div>
                      )}

                      <div className="rounded-3xl border border-white/10 p-5">
                        <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-black"><ImageIcon className="w-4 h-4 text-cyan-400" /> Médias partagés</h3><span className="text-[9px] font-bold text-[var(--axo-text-muted)]">Voir tout</span></div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {['Photo partagée', 'Note vocale', 'Lien Axora'].map((item, index) => (
                            <div key={item} className="aspect-square rounded-2xl bg-[var(--axo-surface)] flex flex-col items-center justify-center gap-2 text-center p-2">
                              {index === 0 ? <ImageIcon className="w-5 h-5 text-cyan-400" /> : index === 1 ? <Mic className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5 text-purple-400" />}
                              <span className="text-[9px] text-zinc-500">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-red-500/15 overflow-hidden">
                        <button type="button" onClick={() => { setShowReportPanel(value => !value); setReportReason(''); }} className="w-full p-4 flex items-center gap-3 text-xs font-bold text-amber-500 hover:bg-amber-500/5"><Flag className="w-4 h-4" /> Signaler cet utilisateur</button>
                        <button type="button" onClick={() => { showToast(`${activeChat.name} a été bloqué.`); setShowFriendProfile(false); }} className="w-full p-4 border-t border-white/5 flex items-center gap-3 text-xs font-bold text-red-400 hover:bg-red-500/5"><Lock className="w-4 h-4" /> Bloquer cet utilisateur</button>
                        <button type="button" onClick={() => {
                          if (!confirm('Supprimer définitivement cette discussion ?')) return;
                          setChatHistories(previous => {
                            const next = { ...previous };
                            delete next[activeChat.id];
                            return next;
                          });
                          setChats(previous => previous.filter(chat => chat.id !== activeChat.id));
                          setShowFriendProfile(false);
                          setSelectedChatId(null);
                        }} className="w-full p-4 border-t border-white/5 flex items-center gap-3 text-xs font-bold text-red-500 hover:bg-red-500/5"><Trash2 className="w-4 h-4" /> Supprimer la discussion</button>
                      </div>

                      {showReportPanel && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-amber-500/20 p-5">
                          <h3 className="text-sm font-black">Pourquoi voulez-vous signaler ce compte ?</h3>
                          <div className="mt-4 space-y-2">
                            {[
                              'Cette personne vous harcèle-t-elle ou vous menace-t-elle ?',
                              'Ce compte partage-t-il du contenu haineux ou violent ?',
                              'S’agit-il d’un faux profil ou d’une usurpation d’identité ?',
                              'Cette personne envoie-t-elle du spam ou une arnaque ?',
                              'Le contenu publié est-il sexuel ou inapproprié ?',
                              'Une autre règle de la communauté a-t-elle été enfreinte ?'
                            ].map(reason => (
                              <button key={reason} type="button" onClick={() => setReportReason(reason)} className={`w-full p-3 rounded-xl border text-left text-[10px] ${reportReason === reason ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-white/10 text-zinc-400'}`}>{reason}</button>
                            ))}
                          </div>
                          <button type="button" disabled={!reportReason} onClick={() => { showToast('Signalement envoyé pour examen.'); setShowReportPanel(false); }} className="mt-4 w-full py-3 rounded-xl bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-xs font-black disabled:opacity-40">Envoyer le signalement</button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeCall ? (
                /* ================= 📞 UPGRADED AUDIO CALL SCREEN ================= */
                <div className="absolute inset-0 z-40 bg-[var(--axo-bg)] text-[var(--axo-text)] flex flex-col justify-between p-6 overflow-hidden">
                  
                  {/* Futuristic background elements and particle glow */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[220px] aspect-square rounded-full filter blur-[100px] opacity-25 pointer-events-none"
                    style={{ backgroundColor: activeTheme.accent }}
                  />

                  {/* Top Bar for Security validation info */}
                  <div className="flex justify-between items-center z-10 select-none">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                        APPEL ENCRYPTE AFRI-TECH
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-mono">CODE: {activeChat.id}-FST</span>
                  </div>

                  {/* Middle Area: Pulsing avatar and visual waves */}
                  <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 text-center">
                    
                    {/* Ring waveforms pulsing */}
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1] }} 
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                        className="absolute w-28 h-28 rounded-full opacity-10"
                        style={{ border: `2px solid ${activeTheme.accent}` }}
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.7, 1] }} 
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
                        className="absolute w-28 h-28 rounded-full opacity-5"
                        style={{ border: `1px solid ${activeTheme.accent}` }}
                      />

                      <div className="w-24 h-24 rounded-full p-[2.5px] z-10 transition-transform duration-300 active:scale-95"
                        style={{ background: `linear-gradient(to top right, ${activeTheme.accent}, var(--axo-surface-strong))` }}
                      >
                        <img 
                          referrerPolicy="no-referrer"
                          src={activeChat.avatar} 
                          alt={activeChat.name} 
                          className="w-full h-full object-cover rounded-full border-4 border-[var(--axo-bg)] bg-[var(--axo-surface)]"
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-[var(--axo-text)] mt-6 tracking-wide flex items-center gap-1">
                      {activeChat.name}
                      {isVerifiedAccount(activeChat.username) && <VerifiedBadge size={16} />}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase tracking-widest">
                      {isMuted ? "🎤 Micro muet • " : ""}{isVideoOff ? "📷 Caméra coupée" : "En cours..."}
                    </p>
                    
                    {/* Animated timer clock */}
                    <div className="mt-4 px-3 py-1 bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[11px] font-bold text-[var(--axo-text)] rounded-lg font-mono">
                      {formatCallTime(callTimer)}
                    </div>
                  </div>

                  {/* Bottom controllers buttons bar */}
                  <div className="max-w-sm mx-auto w-full z-10 bg-[var(--axo-surface)] border border-[var(--axo-border)] p-4 rounded-3xl flex justify-around items-center shadow-2xl backdrop-blur-md">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isMuted 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[var(--axo-text)]'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button 
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isVideoOff 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[var(--axo-text)]'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={() => {
                        setActiveCall(false);
                        showToast(`Appel sécurisé terminé avec succès (${formatCallTime(callTimer)}) !`);
                      }}
                      className="w-14 h-14 bg-[var(--axo-accent)] rounded-2xl border border-[var(--axo-border)] flex items-center justify-center text-[var(--axo-on-accent)] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[var(--axo-shadow)]"
                    >
                      <PhoneOff className="w-5.5 h-5.5 fill-white" />
                    </button>
                  </div>

                </div>
              ) : (
                /* ================= 📝 CHAT MESSAGING VIEW ================= */
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
                  
                  {/* CHAT CHANNELS HEADER */}
                  <div className="shrink-0 py-3 px-4 border-b border-[var(--axo-border)] flex justify-between items-center bg-[var(--axo-bg)] backdrop-blur-md select-none z-30 w-full">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                      {/* Back to chat list button */}
                      <button 
                        onClick={() => setSelectedChatId(null)}
                        className="p-1.5 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] text-[var(--axo-text-muted)] hover:text-[var(--axo-text)] flex items-center justify-center cursor-pointer active:scale-95 transition-all mr-1.5"
                        title="Retour aux messages"
                      >
                        <ChevronLeft className="w-4 h-4 text-[var(--axo-accent)] stroke-[2.5px]" />
                      </button>

                      <div className="relative">
                        <img 
                          referrerPolicy="no-referrer" 
                          src={activeChat.avatar} 
                          alt="avatar recipient" 
                          className={`w-8.5 h-8.5 rounded-full object-cover border ${isDark ? 'border-white/10' : 'border-zinc-200'}`} 
                        />
                        {activeChat.isOnline && !activeChat.isGroup && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => activeChat.isGroup ? setShowCommunityInfo(true) : setShowFriendProfile(true)}
                          className={`flex max-w-[120px] items-center gap-1 truncate text-[11.5px] font-black leading-tight hover:text-[#22D3EE] sm:max-w-[220px] ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}
                        >
                          {activeChat.name}
                          {activeChat.isGroup && <Users className="h-3.5 w-3.5 text-[var(--axo-accent-wave)]" />}
                          {isVerifiedAccount(activeChat.username) && <VerifiedBadge size={14} />}
                        </button>
                        <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">
                          {activeChat.isGroup ? `${activeChat.memberCount || 1} membres` : activeChat.isOnline ? "En ligne" : "Dernière connexion récemment"}
                        </p>
                      </div>
                    </div>

                    {/* Left Actions options links (Call, Video parameters, Theme settings details) */}
                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                      <button 
                        onClick={() => {
                          setActiveCall(true);
                          showToast('Initialisation de la liaison Afri-Tech vocale... 🛸');
                        }}
                        className="w-8.5 h-8.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        title="Démarrer l'appel Sécurisé"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button 
                        onClick={() => {
                          setActiveCall(true);
                          showToast('Initialisation de la liaison Afri-Tech vidéo... 🎥');
                        }}
                        className="w-8.5 h-8.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        title="Démarrer l'appel Vidéo"
                      >
                        <Video className="w-4 h-4 text-cyan-400" />
                      </button>

                      <button 
                        onClick={() => setShowChatConfig(!showChatConfig)}
                        className={`w-8.5 h-8.5 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                          showChatConfig ? 'text-[#FF2D55] bg-[#FF2D55]/10' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                        title="Personnaliser la discussion"
                      >
                        <Palette className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* ================= PERSONNAL COCON THEMES PANEL DRAWERS ================= */}
                  <AnimatePresence>
                    {showChatConfig && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-4 space-y-3 select-none z-20"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9.5px] font-black uppercase tracking-widest text-[#FF2D55] font-mono">
                            Thèmes de discussion personnalisés
                          </span>
                          <button 
                            onClick={() => setShowChatConfig(false)}
                            className="text-zinc-500 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Les thèmes changent l&apos;ambiance de couleur des bulles de messages et des boutons d&apos;action uniquement pour cet auteur.
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-2">
                          {CHAT_THEMES.map(theme => {
                            const isThemeChosen = theme.id === activeChatThemeId;
                            return (
                              <button 
                                key={theme.id}
                                onClick={() => {
                                  setChatThemes(prev => ({ ...prev, [activeChat.id]: theme.id }));
                                  showToast(`Axe thématique modifié pour: ${theme.name}!`);
                                }}
                                className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                                  isThemeChosen 
                                    ? 'border-[var(--axo-accent)] bg-[var(--axo-surface)] shadow-lg'
                                    : 'border-[var(--axo-border)] bg-transparent hover:bg-[var(--axo-surface)]'
                                }`}
                              >
                                <span className="text-[9.5px] font-mono text-zinc-400">{theme.name}</span>
                                <div className={`w-full h-2.5 rounded-full ${theme.bubbleClass}`} />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ================= SECURE LOG MESSAGES CONTAINER ================= */}
                  <div ref={messagesScrollRef} className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain scroll-smooth space-y-4 relative">
                    {/* Security Banner alert inside log */}
                    <div className="mx-auto max-w-sm text-center p-3 rounded-2xl border border-[var(--axo-border)] bg-transparent mb-3 select-none pointer-events-none">
                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#FF2D55] font-black tracking-widest font-mono uppercase">
                        <Lock className="w-3 h-3 text-[#FF2D55]" />
                        <span>Canal de Protection Afri-Tech</span>
                      </div>
                      <p className="text-[8.5px] text-zinc-500 mt-1">
                        Cette discussion est cryptée par chiffrement de clé d&apos;invité. Double-cliquez pour liker.
                      </p>
                    </div>

                    {(chatHistories[activeChat.id] || []).map((msg, index) => {
                      const isMe = msg.senderId === 'me';
                      const hasReaction = messageReactions[msg.id];
                      
                      const isVNot = msg.id.startsWith('m_voice_') || msg.text.startsWith('🎤');
                      const voiceDuration = Number(msg.text.match(/(\d+)\s*secondes?/)?.[1] || 12);
                      const auraBubbleRadius = isMe
                        ? '30px 14px 28px 22px / 24px 18px 32px 26px'
                        : '14px 30px 22px 28px / 18px 24px 26px 32px';

                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg relative`}
                        >
                          {/* Left Avatar portrait if other sender */}
                          {!isMe && (
                            <img 
                              src={msg.senderAvatar || activeChat.avatar} 
                              alt={msg.senderName ? `Avatar de ${msg.senderName}` : "avatar portrait"}
                              className="w-6.5 h-6.5 rounded-full object-cover mr-2 self-end border border-white/5 select-none" 
                              referrerPolicy="no-referrer"
                            />
                          )}

                          <div className="relative flex flex-col max-w-[80%]">
                            
                            {/* Tap interaction heart attachment overlay (Instagram double tap) */}
                            <div
                              className="relative p-[1px] transition-transform duration-300 group-hover/msg:-translate-y-0.5"
                              style={{
                                borderRadius: auraBubbleRadius,
                                background: isMe
                                  ? `linear-gradient(135deg, rgba(255,255,255,.7), ${activeTheme.accent} 48%, rgba(255,255,255,.12))`
                                  : `linear-gradient(135deg, ${activeTheme.accent}88, rgba(255,255,255,.14) 50%, rgba(255,255,255,.05))`
                              }}
                            >
                            <div 
                              onDoubleClick={() => handleDoubleTapMessage(msg.id)}
                              onPointerDown={() => startLongPress(msg)}
                              onPointerUp={cancelLongPress}
                              onPointerLeave={cancelLongPress}
                              onPointerCancel={cancelLongPress}
                              onContextMenu={(event) => {
                                if (!isMe) return;
                                event.preventDefault();
                                openOwnMessageMenu(msg);
                              }}
                              className={`p-3.5 text-xs select-text shadow-sm transition-all duration-300 relative ${
                                isMe
                                  ? 'text-[var(--axo-on-accent)] font-bold'
                                  : 'bg-[var(--axo-message-received)] text-[var(--axo-text)]'
                              }`}
                              style={{ 
                                borderRadius: auraBubbleRadius,
                                background: isMe
                                  ? `linear-gradient(145deg, ${activeTheme.accent}, color-mix(in srgb, ${activeTheme.accent} 68%, var(--axo-surface-strong)))`
                                  : undefined,
                                boxShadow: isMe ? `0 8px 24px ${activeTheme.glowColor}` : 'none'
                              }}
                            >
                              {!isMe && activeChat.isGroup && msg.senderName && (
                                <p className="mb-1 text-[9px] font-black tracking-wide text-[var(--axo-accent-wave)]">{msg.senderName}</p>
                              )}
                              
                              {msg.replyTo && (
                                <div className="mb-2 rounded-xl border-l-2 border-[var(--axo-on-accent)] bg-[var(--axo-overlay)] px-3 py-2 text-[10px]">
                                  <span className="block font-black text-[var(--axo-on-accent)]">
                                    {msg.replyTo.senderId === 'me' ? 'Vous' : activeChat.name}
                                  </span>
                                  <span className="block truncate text-[var(--axo-on-accent)] opacity-75">{msg.replyTo.text}</span>
                                </div>
                              )}

                              {/* Standard Image Messages */}
                              {msg.isMedia && msg.mediaUrl ? (
                                <div className="space-y-2 select-none">
                                  <div className="rounded-xl overflow-hidden border border-white/10 max-h-[160px] aspect-video">
                                    <img 
                                      referrerPolicy="no-referrer"
                                      src={msg.mediaUrl} 
                                      alt="transmited visual" 
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                    />
                                  </div>
                                  <p className="leading-relaxed leading-normal">{msg.text}</p>
                                </div>
                              ) : isVNot ? (
                                
                                /* Interactive Custom Waveform Voice Note Simulator */
                                <div className="flex items-center gap-3.5 min-w-[210px] select-none py-1">
                                  <button 
                                    type="button"
                                    onClick={() => toggleVoicePlayback(msg.id)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                      playingVoiceId === msg.id 
                                        ? 'bg-[var(--axo-surface-strong)] text-emerald-400 animate-pulse'
                                        : 'bg-[var(--axo-surface)] text-[var(--axo-text)] hover:scale-102'
                                    }`}
                                  >
                                    {playingVoiceId === msg.id ? (
                                      <Pause className="w-4.5 h-4.5 fill-emerald-400 stroke-[#10B981]" />
                                    ) : (
                                      <Play className="w-4.5 h-4.5 fill-white stroke-black pl-0.5" />
                                    )}
                                  </button>

                                  <div className="flex-1 flex flex-col">
                                    {/* Waves generator bars */}
                                    <div className="flex items-end gap-1 h-6">
                                      {[1, 2, 3, 4, 5, 4, 6, 3, 5, 6, 4, 5, 2, 4, 3, 5, 2, 4, 3, 4].map((waveH, i) => {
                                        const isActivePlayback = playingVoiceId === msg.id;
                                        const progressAmt = voiceProgress[msg.id] || 0;
                                        const percentagePos = (i / 20) * 100;
                                        const isFilled = isActivePlayback && percentagePos <= progressAmt;

                                        return (
                                          <span 
                                            key={i} 
                                            className="w-0.75 rounded-full flex-1 transition-all"
                                            style={{ 
                                              height: `${waveH * 16}%`,
                                              backgroundColor: isFilled 
                                                ? '#10B981' 
                                                : isMe ? 'rgba(255,255,255,0.45)' : 'rgba(100,116,139,0.5)',
                                              animation: isActivePlayback && !isFilled ? 'pulse 1.2s infinite' : 'none'
                                            }}
                                          />
                                        );
                                      })}
                                    </div>
                                    <div className="flex justify-between items-center mt-1.5 text-[8px] font-mono text-zinc-400">
                                      <span>{playingVoiceId === msg.id ? "En cours de lecture" : "Vocal Afri-Tech"}</span>
                                      <span>0:{voiceDuration.toString().padStart(2, '0')}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Normal text message logic */
                                <p className="leading-relaxed">{msg.text}</p>
                              )}

                              <div className="flex justify-between items-center mt-1.5 select-none text-[8.5px] font-mono">
                                <span className={isMe ? 'text-[var(--axo-on-accent)] opacity-70' : 'text-[var(--axo-text-muted)]'}>
                                  {msg.timestamp}
                                </span>
                                {isMe && (
                                  <span className="text-[var(--axo-on-accent)] opacity-80 font-bold flex items-center gap-0.5 uppercase tracking-widest text-[7px]">
                                    <Check className="w-2.5 h-2.5 stroke-[3px]" /> Remis
                                  </span>
                                )}
                              </div>
                            </div>
                            </div>

                            {/* Axora orbit signature */}
                            <span
                              className={`absolute -bottom-2 flex items-center gap-1 z-10 ${
                                isMe ? 'right-4 flex-row-reverse' : 'left-4'
                              }`}
                              aria-hidden="true"
                            >
                              {[1, 0.65, 0.35].map((opacity, orbitIndex) => (
                                <span
                                  key={orbitIndex}
                                  className="block rounded-full border border-[var(--axo-bg)]"
                                  style={{
                                    width: `${7 - orbitIndex * 1.5}px`,
                                    height: `${7 - orbitIndex * 1.5}px`,
                                    opacity,
                                    backgroundColor: activeTheme.accent,
                                    boxShadow: orbitIndex === 0 ? `0 0 8px ${activeTheme.glowColor}` : 'none'
                                  }}
                                />
                              ))}
                            </span>

                            {/* Floating Reaction placement */}
                            {hasReaction && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute bottom-[-10px] right-2.5 bg-[#141416] border border-white/10 rounded-full px-2 py-0.5 text-xs shadow-lg flex items-center gap-1 z-10 select-none cursor-pointer hover:scale-110 active:scale-95"
                                title="Réaction double-clic"
                                onClick={() => {
                                  const copy = { ...messageReactions };
                                  delete copy[msg.id];
                                  setMessageReactions(copy);
                                }}
                              >
                                <span>{hasReaction}</span>
                              </motion.div>
                            )}

                            {/* Trigger details interaction button overlay on hover message */}
                            <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover/msg:opacity-100 transition-opacity z-20 select-none px-2 no-tap-trigger cursor-pointer"
                              style={{ left: isMe ? '-45px' : 'auto', right: isMe ? 'auto' : '-45px' }}
                            >
                              <button 
                                type="button"
                                onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                                className="p-1 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                                title="Réagir"
                              >
                                <Smile className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* REACTION OVERLAY POPUP */}
                          <AnimatePresence>
                            {activeReactionMessageId === msg.id && (
                              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-12 select-none no-tap-trigger">
                                <motion.div 
                                  initial={{ scale: 0.8, y: 15 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0.8, y: 15 }}
                                  className="flex gap-2 p-2 bg-[var(--axo-surface-strong)] border border-[var(--axo-border)] rounded-2xl shadow-2xl items-center relative"
                                >
                                  {['❤️', '🔥', '👍', '😂', '😲', '🔒'].map(emo => (
                                    <button 
                                      key={emo} 
                                      type="button"
                                      onClick={() => handleReactToMessage(msg.id, emo)}
                                      className="text-base cursor-pointer hover:scale-130 transition-transform active:scale-90"
                                    >
                                      {emo}
                                    </button>
                                  ))}
                                  
                                  <button 
                                    type="button" 
                                    onClick={() => setActiveReactionMessageId(null)}
                                    className="p-1 rounded-full text-zinc-500 hover:text-zinc-200"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </motion.div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* Auto simulated Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        className="flex justify-start items-end relative select-none"
                      >
                        <img 
                          src={activeChat.avatar} 
                          alt="avatar recipient" 
                          className="w-6.5 h-6.5 rounded-full object-cover mr-2 border border-white/5"
                        />
                        <div
                          className={`relative h-14 min-w-[174px] overflow-hidden backdrop-blur-sm pl-4 pr-5 flex items-center gap-3 border ${
                            isDark ? 'bg-zinc-950/25 border-white/[0.06]' : 'bg-white/80 border-zinc-200'
                          }`}
                          style={{
                            borderRadius: '999px',
                            boxShadow: `inset 0 0 22px ${activeTheme.accent}0D`
                          }}
                        >
                          <span
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: activeTheme.accent,
                              boxShadow: `0 0 12px ${activeTheme.accent}`
                            }}
                          />
                          <motion.span
                            animate={{ scale: [1, 2.4, 1], opacity: [0.25, 0, 0.25] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border"
                            style={{ borderColor: activeTheme.accent }}
                          />

                          {/* A luminous trace is drawn and erased like a live thought */}
                          <div className="relative w-[72px] h-8 shrink-0">
                            <svg viewBox="0 0 72 32" className="absolute inset-0 w-full h-full overflow-visible">
                              <path
                                d="M2 22 C11 5, 18 28, 28 13 S43 8, 48 19 S61 27, 70 8"
                                fill="none"
                                stroke="rgba(255,255,255,.08)"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <motion.path
                                d="M2 22 C11 5, 18 28, 28 13 S43 8, 48 19 S61 27, 70 8"
                                fill="none"
                                stroke={activeTheme.accent}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.72, 1], ease: 'easeInOut' }}
                                style={{ filter: `drop-shadow(0 0 4px ${activeTheme.accent})` }}
                              />
                            </svg>
                            <motion.span
                              animate={{ x: [0, 62], y: [19, 5], opacity: [0, 1, 0] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                              className="absolute left-0 top-0 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: 'var(--axo-on-accent)', boxShadow: `0 0 8px ${activeTheme.accent}` }}
                            />
                          </div>

                          <div className="min-w-0 leading-none">
                            <p className={`text-[9px] font-semibold whitespace-nowrap ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                              pensée en cours
                            </p>
                            <p
                              className="text-[7px] uppercase tracking-[0.2em] mt-1.5 font-mono"
                              style={{ color: activeTheme.accent }}
                            >
                              Axo trace
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ================= INSTAGRAM-LIKE QUICK REPLIES BAR ================= */}
                  <div className="shrink-0 px-3.5 pt-1.5 border-t border-[var(--axo-border)] bg-[var(--axo-bg)] flex gap-2 overflow-x-auto py-2 select-none no-scrollbar">
                    {QUICK_REPLIES.map(qr => (
                      <button 
                        key={qr}
                        type="button"
                        onClick={() => {
                          handleSendMessage(qr);
                        }}
                        className={`py-1 px-3 border rounded-full text-[9px] font-bold tracking-wide font-sans cursor-pointer flex-shrink-0 transition-all hover:scale-102 active:scale-95 ${
                          isDark 
                            ? 'bg-white/[0.03] border-white/10 hover:border-[#FF2D55]/30 hover:bg-white/[0.05] text-zinc-350' 
                            : 'bg-zinc-100 border-zinc-250 hover:border-[#FF2D55] hover:bg-zinc-200 text-zinc-650'
                        }`}
                      >
                        {qr}
                      </button>
                    ))}
                  </div>

                  {/* ================= ACTIVE BOTTOM SEND DRAFT INPUT ================= */}
                  <div className="shrink-0 p-3 z-20 select-none border-t border-[var(--axo-border)] bg-[var(--axo-bg)]">
                    {replyingToMessage && (
                      <div className="mb-2 flex items-center gap-3 rounded-2xl border-l-4 border-[var(--axo-accent)] bg-[var(--axo-surface-muted)] px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-black text-[var(--axo-accent)]">
                            Répondre à {replyingToMessage.senderId === 'me' ? 'vous-même' : activeChat.name}
                          </span>
                          <span className="block truncate text-[10px] text-zinc-500">{replyingToMessage.text}</span>
                        </div>
                        <button type="button" onClick={() => setReplyingToMessage(null)} className="p-1 text-zinc-500 hover:text-white" aria-label="Annuler la réponse">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="relative flex gap-1.5 items-center rounded-[28px] px-2.5 py-2 transition-all border border-[var(--axo-border)] bg-[var(--axo-surface)] shadow-lg shadow-[var(--axo-shadow)] focus-within:border-[var(--axo-accent)]">
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageSelection(event, 'gallery')}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(event) => handleImageSelection(event, 'camera')}
                      />
                      
                      {/* Gallery picker */}
                      <button 
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                          isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                        title="Choisir une photo dans la galerie"
                        aria-label="Choisir une photo dans la galerie"
                      >
                        <ImageIcon className="w-4.5 h-4.5" />
                      </button>

                      {/* Camera capture */}
                      <button 
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                          isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                        title="Prendre une photo"
                        aria-label="Prendre une photo"
                      >
                        <Camera className="w-4.5 h-4.5" />
                      </button>

                      {/* Voice recorder */}
                      <button 
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                          isRecordingVoice
                            ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]'
                            : isDark ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title="Enregistrer un vocal Afri-Tech"
                        aria-label={isRecordingVoice ? 'Arrêter et envoyer le vocal' : 'Enregistrer un vocal'}
                      >
                        {isRecordingVoice ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-4.5 h-4.5" />}
                      </button>

                      {isRecordingVoice ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-1 min-w-0 h-9 px-2 flex items-center gap-2"
                        >
                          <span className="relative flex w-2.5 h-2.5 shrink-0">
                            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-70" />
                            <span className="relative w-2.5 h-2.5 rounded-full bg-red-500" />
                          </span>
                          <div className="flex-1 h-6 flex items-center justify-center gap-[3px] overflow-hidden">
                            {[8, 15, 22, 12, 18, 26, 14, 20, 10, 24, 16, 9].map((height, index) => (
                              <motion.span
                                key={index}
                                animate={{ height: [6, height, 6] }}
                                transition={{ duration: 0.65, repeat: Infinity, delay: index * 0.06 }}
                                className="w-[3px] rounded-full bg-gradient-to-t from-red-500 to-fuchsia-400"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-mono font-bold text-red-400 tabular-nums">
                            0:{recordingSeconds.toString().padStart(2, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={cancelVoiceRecording}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5"
                            aria-label="Annuler l’enregistrement"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Écrire un message..." 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onFocus={() => {
                            window.setTimeout(() => {
                              const container = messagesScrollRef.current;
                              if (container) container.scrollTop = container.scrollHeight;
                            }, 180);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(inputText);
                          }}
                          className={`flex-1 min-w-0 bg-transparent border-none text-base outline-none focus:ring-0 ${
                            isDark ? 'text-[var(--axo-text)] placeholder:text-[var(--axo-text-muted)]' : 'text-[var(--axo-text)] placeholder:text-[var(--axo-text-muted)]'
                          }`}
                        />
                      )}

                      {/* Sender action click button */}
                      {!isRecordingVoice && <button 
                        type="button"
                        onClick={() => handleSendMessage(inputText)}
                        disabled={!inputText.trim()}
                        className={`p-1.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                          inputText.trim() 
                            ? 'bg-red-650 text-white hover:scale-103' 
                            : 'text-zinc-650 opacity-40 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: inputText.trim() ? activeTheme.accent : 'transparent' }}
                      >
                        <Send className="w-4 h-4" />
                      </button>}
                    </div>
                  </div>

                </div>
              )}
            </>
          ) : (
            /* ================= 💌 INSTA WELCOME SCREEN PLATFORM ELEMENTS ================= */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              
              {/* Premium custom inbox design visual overlay background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2D55]/5 via-[#A855F7]/3 to-cyan-400/5 filter blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-xs z-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF2D55] via-[#A855F7] to-cyan-400 p-[1px] mx-auto flex items-center justify-center shadow-2xl shadow-red-500/10">
                  <div className="w-full h-full bg-[var(--axo-surface-strong)] rounded-[23px] flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-[#FF2D55] filter drop-shadow-[0_0_10px_rgba(255,45,85,0.45)]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono">
                    Liaison Directe Axora
                  </h3>
                  <h2 className={`text-sm font-black ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                    Messagerie de Confiance
                  </h2>
                </div>

                <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs font-sans">
                  Profitez de liaisons audio chiffrées par Afri-Tech, de Sparks interactifs de profil de style Instagram, de thèmes de discussion et des avis de débats.
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (chats.length > 0) {
                        setSelectedChatId(chats[0].id);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border hover:border-[#FF2D55]/20 hover:text-[#FF2D55] text-[10px] font-extrabold uppercase tracking-wide transition-all duration-300 cursor-pointer ${
                      isDark ? 'bg-white/[0.04] border-white/5 hover:bg-white/[0.08]' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <span>Ouvrir un chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {contextMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center"
            onClick={() => setContextMessage(null)}
          >
            <motion.div
              initial={{ y: 24, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.96 }}
              className="w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-3 text-[var(--axo-text)] shadow-2xl shadow-[var(--axo-shadow)]"
              onClick={event => event.stopPropagation()}
            >
              <p className="mb-2 truncate px-3 py-2 text-[10px] text-[var(--axo-text-muted)]">{contextMessage.text}</p>
              <MessageMenuAction icon={<Copy />} label="Copier" onClick={async () => { await navigator.clipboard?.writeText(contextMessage.text); setContextMessage(null); showToast('Message copié'); }} />
              <MessageMenuAction icon={<Pencil />} label="Modifier" onClick={() => { setEditDraft(contextMessage.text); setEditingMessage(contextMessage); setContextMessage(null); }} />
              <MessageMenuAction icon={<Forward />} label="Partager" onClick={async () => { if (navigator.share) await navigator.share({ text: contextMessage.text }); else await navigator.clipboard?.writeText(contextMessage.text); setContextMessage(null); showToast('Message prêt à partager'); }} />
              <MessageMenuAction icon={<Trash2 />} label="Supprimer pour tous" danger onClick={() => deleteOwnMessage(contextMessage.id)} />
            </motion.div>
          </motion.div>
        )}
        {editingMessage && (
          <motion.div className="absolute inset-0 z-[72] flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingMessage(null)}>
            <motion.form onSubmit={event => { event.preventDefault(); updateOwnMessage(editingMessage.id, editDraft); }} onClick={event => event.stopPropagation()} className="w-full max-w-sm space-y-3 rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-4 shadow-2xl">
              <h3 className="text-sm font-black">Modifier le message</h3>
              <textarea value={editDraft} onChange={event => setEditDraft(event.target.value)} autoFocus rows={3} className="w-full resize-none rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3 text-base text-[var(--axo-text)] outline-none focus:border-[var(--axo-accent)]" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingMessage(null)} className="flex-1 rounded-xl border border-[var(--axo-border)] py-2.5 text-xs font-bold">Annuler</button>
                <button type="submit" className="flex-1 rounded-xl bg-[var(--axo-accent)] py-2.5 text-xs font-black text-[var(--axo-on-accent)]">Enregistrer</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT POP NOTIFIER TOASTER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute bottom-6 right-6 z-50 bg-[var(--axo-surface-strong)] border border-[var(--axo-accent)] text-[var(--axo-text)] text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xl shadow-[var(--axo-shadow)] flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--axo-accent)] animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MessageMenuAction({ icon, label, onClick, danger = false }: { icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-bold transition hover:bg-[var(--axo-surface-muted)] ${danger ? 'text-[var(--axo-accent)]' : ''}`}>
      {React.cloneElement(icon, { className: 'h-4 w-4' })}{label}
    </button>
  );
}
