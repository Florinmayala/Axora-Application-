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
  BadgeCheck, 
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
  ArrowRight
} from 'lucide-react';
import { ChatSummary, ChatMessage } from '../types';

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
}

// Spark note structure
interface SparkNote {
  id: string;
  name: string;
  avatar: string;
  note: string;
  isMe?: boolean;
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
    bubbleClass: 'bg-gradient-to-r from-[#FF2D55] to-[#D91B43]', 
    bgGradient: 'from-[#FF2D55]/5 to-black/20',
    accent: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.3)'
  },
  { 
    id: 'wave', 
    name: 'Vapor Aura', 
    bubbleClass: 'bg-gradient-to-r from-[#22D3EE] via-[#A855F7] to-[#ED4F89]', 
    bgGradient: 'from-[#A855F7]/10 to-black/20',
    accent: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  { 
    id: 'emerald', 
    name: 'Hacker Mint', 
    bubbleClass: 'bg-gradient-to-r from-emerald-500 to-teal-600', 
    bgGradient: 'from-emerald-500/5 to-black/20',
    accent: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)'
  },
  { 
    id: 'solar', 
    name: 'Solar Flare', 
    bubbleClass: 'bg-gradient-to-r from-amber-500 to-[#FF2D55]', 
    bgGradient: 'from-amber-500/5 to-black/20',
    accent: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)'
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
  isDark
}: AxoraMessagesProps) {
  // Inbox tab filter: "all", "unread", "nearby", "match_pop"
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'nearby' | 'match_pop'>('all');
  
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
  
  // Expanded Spark notes list
  const [sparkNotes, setSparkNotes] = useState<SparkNote[]>([
    { id: 'me', name: 'Vous', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', note: 'Prêt à designer 🎨', isMe: true },
    { id: 'n1', name: 'Lena X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', note: 'Drop ce soir à 21h 🎧' },
    { id: 'n2', name: 'Kaelen', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', note: 'Chiffrement activé 🔒' },
    { id: 'n3', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', note: 'Inspiration cyberpunk ⚡' }
  ]);
  
  // Edit own note states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  
  // Reaction picker state
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, string>>({});
  
  // Voice note simulator states
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<Record<string, number>>({});
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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

  const activeChat = chats.find(c => c.id === selectedChatId);

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
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
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

  // Post personal spark note
  const handlePublishSpark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSparkNotes(prev => prev.map(note => {
      if (note.id === 'me') {
        return { ...note, note: newNoteText.trim().substring(0, 45) };
      }
      return note;
    }));

    setNewNoteText('');
    setShowNoteModal(false);
    showToast('Votre Spark de profil a été mis à jour !');
  };

  // double tap message like attachment
  const handleDoubleTapMessage = (msgId: string) => {
    handleReactToMessage(msgId, '❤️');
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
    if (activeTab === 'unread') return ch.unreadCount > 0;
    if (activeTab === 'nearby') return ch.isOnline; // mock nearby as active online sessions
    if (activeTab === 'match_pop') return ch.id === 'c1' || ch.id === 'c3'; // match pop profiles

    return true; // For 'all'
  });

  return (
    <div id="axora-insta-messaging" className={`w-full h-full flex flex-col min-h-[520px] ${
      isDark ? 'bg-black/40 text-white' : 'bg-white text-zinc-900'
    }`}>
      
      {/* 🚀 SLEEK TOP HEADER BAR */}
      {!selectedChatId && (
        <div className={`flex py-2.5 px-4 items-center justify-between backdrop-blur-md select-none z-10 block border-b ${
          isDark ? 'border-white/5 bg-[#141416]/50' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#FF2D55]" />
            <h2 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-150' : 'text-zinc-700'}`}>Messagerie Directe</h2>
          </div>
          <div className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-400/5 py-1 px-2.5 rounded-full border border-cyan-400/10 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>INSTANT DIRECT</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* ================= CHATS COLUMN SIDEBAR ================= */}
        <div className={`w-full flex flex-col select-none ${selectedChatId ? 'hidden' : 'flex'}`}>
          
          {/* SEARCH INPUT */}
          <div className="p-3">
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all ${
              isDark 
                ? 'bg-white/[0.03] border-white/5 focus-within:border-[#FF2D55]/30 focus-within:bg-white/[0.05]' 
                : 'bg-zinc-100 border-zinc-250/80 focus-within:border-[#FF2D55] focus-within:bg-zinc-200/50'
            }`}>
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Rechercher un auteur..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent border-none text-[11px] outline-none focus:ring-0 font-sans ${
                  isDark ? 'placeholder:text-zinc-500 text-white' : 'placeholder:text-zinc-400 text-zinc-900'
                }`}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className={`p-0.5 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* INSTAGRAM SPARKS TRAY (Floating statuses thoughts) */}
          <div className={`px-3 pb-3.5 border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
            <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 no-scrollbar">
              {sparkNotes.map(sp => {
                const isUserMe = sp.isMe === true;
                return (
                  <div key={sp.id} className="flex flex-col items-center flex-shrink-0 relative group">
                    {/* Thought Bubble floating above avatar */}
                    <div 
                      onClick={() => isUserMe ? setShowNoteModal(true) : handleSendMessage(`Hé ! J'adore ton spark: "${sp.note}"`)}
                      className="max-w-[76px] px-2 py-1 bg-zinc-900 border border-white/10 rounded-xl shadow-lg text-center cursor-pointer mb-2.5 relative transition-transform duration-300 hover:scale-105 active:scale-95 group-hover:border-red-500/20"
                    >
                      <p className="text-[8.5px] font-medium leading-relaxed truncate text-zinc-200">
                        {sp.note}
                      </p>
                      {/* Little speech tail anchor pointing down */}
                      <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-white/10 rotate-45" />
                    </div>

                    {/* Profile avatar frame */}
                    <div className="relative">
                      <img 
                        src={sp.avatar} 
                        alt={sp.name} 
                        className={`w-11 h-11 rounded-full object-cover p-[2px] transition-transform group-hover:scale-103 duration-350 ${
                          isUserMe 
                            ? 'border-2 border-dashed border-zinc-700 bg-black' 
                            : 'bg-gradient-to-tr from-[#FF2D55] via-[#A855F7] to-cyan-400 p-[2px]'
                        }`} 
                        referrerPolicy="no-referrer"
                      />
                      
                      {isUserMe ? (
                        <button 
                          onClick={() => setShowNoteModal(true)}
                          className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-red-600 rounded-full flex items-center justify-center border border-black hover:bg-red-500 text-white transition-all scale-105"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      ) : (
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
                      )}
                    </div>

                    <span className="text-[9px] font-bold text-zinc-505 mt-1 font-mono">{isUserMe ? 'Note' : sp.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ⚡ DIRECT CATEGORY TABS (all, unread, nearby, match pop) */}
          <div className="flex border-b border-white/5 py-1.5 px-4 bg-[#141416]/25 select-none">
            <div className="flex gap-4 overflow-x-auto w-full no-scrollbar">
              <button 
                type="button"
                onClick={() => setActiveTab('all')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'all' ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>all</span>
                {activeTab === 'all' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeTab === 'unread' ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>unread</span>
                {chats.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="w-4 h-4 bg-[#FF2D55]/15 text-[#FF2D55] text-[8px] rounded-full flex items-center justify-center font-bold">
                    {chats.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
                {activeTab === 'unread' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('nearby')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'nearby' ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>nearby</span>
                {activeTab === 'nearby' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('match_pop')}
                className={`text-[10px] font-black uppercase tracking-widest relative py-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'match_pop' ? 'text-[#FF2D55]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>match pop</span>
                {activeTab === 'match_pop' && (
                  <motion.div layoutId="nav-msg-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />
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
                      ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-white/15 text-white active:bg-zinc-900/60 shadow-lg' 
                      : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
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
                        className="w-full h-full rounded-full object-cover border border-zinc-950 bg-zinc-950" 
                      />
                    </div>
                    {ch.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[11.5px] font-black tracking-wide text-zinc-100 flex items-center gap-1 group-hover/item:text-white transition-colors">
                        {ch.name}
                        {(ch.username === 'Lena_X' || ch.username === 'kaelen_afri_tech') && (
                          <BadgeCheck className="text-[#A855F7] fill-[#A855F7]/10 flex-shrink-0" style={{ width: '14px', height: '14px' }} />
                        )}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500 group-hover/item:text-zinc-400">{ch.timestamp}</span>
                    </div>

                    <p className={`text-[10px] truncate ${ch.unreadCount > 0 ? 'text-white font-extrabold font-sans' : 'text-zinc-400'}`}>
                      {ch.lastMessage}
                    </p>
                  </div>

                  {/* Unread dot or simulated count badge */}
                  {ch.unreadCount > 0 && (
                    <div className="self-center flex-shrink-0 flex items-center justify-center h-4.5 min-w-4.5 px-1 bg-red-600 rounded-full text-[8.5px] font-black text-white font-mono shadow-md">
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
        <div className={`w-full flex-1 flex flex-col overflow-hidden bg-zinc-950/25 relative ${selectedChatId ? 'flex' : 'hidden'}`}>
          {selectedChatId && activeChat ? (
            <>
              {activeCall ? (
                /* ================= 📞 UPGRADED AUDIO CALL SCREEN ================= */
                <div className="absolute inset-0 z-40 bg-zinc-950 flex flex-col justify-between p-6 overflow-hidden">
                  
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
                        style={{ background: `linear-gradient(to tr, ${activeTheme.accent}, #000000)` }}
                      >
                        <img 
                          referrerPolicy="no-referrer"
                          src={activeChat.avatar} 
                          alt={activeChat.name} 
                          className="w-full h-full object-cover rounded-full border-4 border-zinc-950 bg-black" 
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-white mt-6 tracking-wide flex items-center gap-1">
                      {activeChat.name}
                      <BadgeCheck className="text-[#A855F7] fill-[#A855F7]/10" style={{ width: '16px', height: '16px' }} />
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase tracking-widest">
                      {isMuted ? "🎤 Micro muet • " : ""}{isVideoOff ? "📷 Caméra coupée" : "En cours..."}
                    </p>
                    
                    {/* Animated timer clock */}
                    <div className="mt-4 px-3 py-1 bg-white/5 border border-white/5 text-[11px] font-bold text-zinc-300 rounded-lg font-mono">
                      {formatCallTime(callTimer)}
                    </div>
                  </div>

                  {/* Bottom controllers buttons bar */}
                  <div className="max-w-sm mx-auto w-full z-10 bg-[#0F0F10] border border-white/5 p-4 rounded-3xl flex justify-around items-center shadow-2xl backdrop-blur-md">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isMuted 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button 
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isVideoOff 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={() => {
                        setActiveCall(false);
                        showToast(`Appel sécurisé terminé avec succès (${formatCallTime(callTimer)}) !`);
                      }}
                      className="w-14 h-14 bg-red-650 hover:bg-red-600 rounded-2xl border border-red-500/20 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-650/15"
                    >
                      <PhoneOff className="w-5.5 h-5.5 fill-white" />
                    </button>
                  </div>

                </div>
              ) : (
                /* ================= 📝 CHAT MESSAGING VIEW ================= */
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  
                  {/* CHAT CHANNELS HEADER */}
                  <div className={`py-3 px-4 border-b flex justify-between items-center backdrop-blur-md select-none z-10 w-full ${
                    isDark ? 'border-white/5 bg-[#141416]/20' : 'border-zinc-200 bg-zinc-50 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {/* Back to chat list button */}
                      <button 
                        onClick={() => setSelectedChatId(null)}
                        className={`p-1.5 rounded-xl border flex items-center justify-center cursor-pointer active:scale-95 transition-all mr-1.5 ${
                          isDark 
                            ? 'text-zinc-400 hover:text-white bg-white/5 border-white/5 hover:bg-white/10' 
                            : 'text-zinc-500 hover:text-zinc-950 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'
                        }`}
                        title="Retour aux messages"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#FF2D55] stroke-[2.5px]" />
                      </button>

                      <div className="relative">
                        <img 
                          referrerPolicy="no-referrer" 
                          src={activeChat.avatar} 
                          alt="avatar recipient" 
                          className={`w-8.5 h-8.5 rounded-full object-cover border ${isDark ? 'border-white/10' : 'border-zinc-200'}`} 
                        />
                        {activeChat.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
                        )}
                      </div>

                      <div>
                        <h4 className={`text-[11.5px] font-black flex items-center gap-1 leading-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                          {activeChat.name}
                          {(activeChat.username === 'Lena_X' || activeChat.username === 'kaelen_afri_tech') && (
                            <BadgeCheck className="text-[#A855F7] fill-[#A855F7]/10 flex-shrink-0" style={{ width: '14px', height: '14px' }} />
                          )}
                        </h4>
                        <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">
                          {activeChat.isOnline ? "En ligne" : "Dernière connexion récemment"}
                        </p>
                      </div>
                    </div>

                    {/* Left Actions options links (Call, Video parameters, Theme settings details) */}
                    <div className="flex items-center gap-1">
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
                        className="border-b border-white/5 bg-[#0F0F10] p-4 space-y-3 select-none z-20"
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
                                    ? 'border-white bg-white/[0.05] shadow-lg' 
                                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
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
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 relative min-h-[220px]">
                    {/* Security Banner alert inside log */}
                    <div className="mx-auto max-w-sm text-center p-3 rounded-2xl border border-white/5 bg-white/[0.02] mb-3 select-none pointer-events-none">
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
                              src={activeChat.avatar} 
                              alt="avatar portrait" 
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
                              className={`p-3.5 text-xs select-text shadow-sm transition-all duration-300 relative ${
                                isMe 
                                  ? 'text-white font-bold'
                                  : isDark 
                                    ? 'bg-[#09090b] text-white'
                                    : 'bg-white text-black'
                              }`}
                              style={{ 
                                borderRadius: auraBubbleRadius,
                                background: isMe
                                  ? `linear-gradient(145deg, ${activeTheme.accent}, color-mix(in srgb, ${activeTheme.accent} 68%, #09090b))`
                                  : undefined,
                                boxShadow: isMe ? `0 8px 24px ${activeTheme.glowColor}` : 'none'
                              }}
                            >
                              
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
                                        ? 'bg-zinc-950 text-emerald-400 animate-pulse' 
                                        : 'bg-zinc-850 text-white hover:scale-102'
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
                                <span className={isMe ? 'text-white/70' : 'text-zinc-500'}>
                                  {msg.timestamp}
                                </span>
                                {isMe && (
                                  <span className="text-white/80 font-bold flex items-center gap-0.5 uppercase tracking-widest text-[7px]">
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
                                  className="block rounded-full border border-zinc-950"
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
                                  className="flex gap-2 p-2 bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl items-center relative"
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
                          className="relative h-14 min-w-[174px] overflow-hidden bg-zinc-950/95 pl-4 pr-5 flex items-center gap-3"
                          style={{
                            clipPath: 'polygon(0 11px, 12px 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 12px 100%, 0 calc(100% - 11px))',
                            boxShadow: `inset 0 0 0 1px ${activeTheme.accent}33`
                          }}
                        >
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[3px]"
                            style={{
                              backgroundColor: activeTheme.accent,
                              boxShadow: `0 0 12px ${activeTheme.accent}`
                            }}
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
                              style={{ backgroundColor: '#fff', boxShadow: `0 0 8px ${activeTheme.accent}` }}
                            />
                          </div>

                          <div className="min-w-0 leading-none">
                            <p className="text-[9px] font-semibold text-zinc-200 whitespace-nowrap">
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
                  <div className={`px-3.5 pt-1.5 border-t flex gap-2 overflow-x-auto py-2 select-none no-scrollbar ${
                    isDark ? 'border-white/5 bg-black/45' : 'border-zinc-200 bg-zinc-50'
                  }`}>
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
                  <div className={`p-3 z-10 select-none border-t ${
                    isDark ? 'bg-[#0F0F10] border-zinc-900' : 'bg-white border-zinc-200'
                  }`}>
                    <div className={`relative flex gap-1.5 items-center rounded-[28px] px-2.5 py-2 transition-all border shadow-lg ${
                      isDark 
                        ? 'bg-zinc-950/90 border-white/10 focus-within:border-[#FF2D55]/40 shadow-black/30' 
                        : 'bg-zinc-100 border-zinc-200 focus-within:border-[#FF2D55] shadow-zinc-200/60'
                    }`}>
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(inputText);
                          }}
                          className={`flex-1 min-w-0 bg-transparent border-none text-[11px] outline-none focus:ring-0 ${
                            isDark ? 'text-white placeholder:text-zinc-500' : 'text-zinc-900 placeholder:text-zinc-450'
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
                  <div className="w-full h-full bg-zinc-950 rounded-[23px] flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-[#FF2D55] filter drop-shadow-[0_0_10px_rgba(255,45,85,0.45)]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono">
                    Liaison Directe Axora
                  </h3>
                  <h2 className="text-sm font-black text-white">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-[#FF2D55]/20 hover:bg-white/[0.08] hover:text-[#FF2D55] text-[10px] font-extrabold uppercase tracking-wide transition-all duration-300 cursor-pointer"
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

      {/* ================= 📝 SPARKS MODAL WINDOW (To publish own notes) ================= */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="absolute inset-0 z-50 flex flex-col justify-center items-center px-4">
            {/* Modal glass backing shadow */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNoteModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal container content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-32 p-6 flex flex-col z-10 space-y-4"
            >
              <div className="flex justify-between items-center select-none">
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Votre Spark d&apos;Auteur</h3>
                <button 
                  onClick={() => setShowNoteModal(false)}
                  className="w-7 h-7 rounded-full bg-zinc-900 text-zinc-500 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 select-none">
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Partagez une courte pensée en haut de votre messagerie pendant 24 heures pour que vos correspondants puissent y réagir instantanément !
                </p>
                <p className="text-[9px] text-amber-500 font-mono font-bold">RECOMPENSE : +30 Axora Coins 🪙</p>
              </div>

              <form onSubmit={handlePublishSpark} className="space-y-3">
                <div className="flex gap-2 items-center bg-zinc-900 border border-white/5 rounded-2xl px-3.5 py-3 focus-within:border-[#FF2D55]/35">
                  <input 
                    type="text" 
                    required
                    maxLength={45}
                    placeholder="Qu'avez-vous en tête ? (max 45 car.)" 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full bg-transparent border-none text-[11.5px] text-white outline-none placeholder:text-zinc-500 focus:ring-0"
                  />
                  <span className="text-[9px] text-zinc-650 font-mono shrink-0 select-none">
                    {45 - newNoteText.length}
                  </span>
                </div>

                <div className="flex justify-end gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2 text-[10px] font-black tracking-wide uppercase bg-zinc-900 hover:bg-zinc-850 rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-[10px] font-black tracking-wide uppercase bg-gradient-to-r from-[#FF2D55] to-red-600 hover:scale-102 transition-transform text-white rounded-xl cursor-pointer"
                  >
                    Publier
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT POP NOTIFIER TOASTER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute bottom-6 right-6 z-50 bg-[#0F0F10] border border-[#FF2D55]/30 text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xl shadow-red-500/5 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
