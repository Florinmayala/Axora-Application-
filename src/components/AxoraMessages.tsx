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
  CalendarDays,
  CheckCheck,
  FileText,
  LoaderCircle,
  Navigation,
  RotateCcw,
  ExternalLink,
  Link2
} from 'lucide-react';
import { AxoraNotification, ChatSummary, ChatMessage } from '../types';
import { isVerifiedAccount, VerifiedBadge } from './VerifiedBadge';
import { readLocalMedia, saveLocalMedia } from '../lib/localMedia';
import { AXORA_CHAT_WALLPAPER, CHAT_THEMES } from './messages/chatAppearance';
import MessageMenuAction from './messages/MessageMenuAction';
import MessageDialog from './messages/MessageDialog';
import MediaViewer from './messages/MediaViewer';
import { forwardCopy, messagePreview } from './messages/messageOperations';

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
  onNotify?: (notification: Omit<AxoraNotification, 'id' | 'timestamp'>) => void;
}
type CallPhase = 'outgoing' | 'ringing' | 'connected' | 'declined' | 'busy' | 'interrupted' | 'ended';

type PendingAttachment = {
  kind: 'image' | 'video' | 'document' | 'location';
  name: string;
  detail: string;
  previewUrl?: string;
  source?: 'camera' | 'gallery';
  file?: File;
  files?: File[];
};

const CALL_PHASE_CONTENT: Record<CallPhase, { label: string; detail: string }> = {
  outgoing: { label: 'Appel en cours…', detail: 'Préparation de la connexion' },
  ringing: { label: 'Sonnerie…', detail: 'En attente de réponse' },
  connected: { label: 'Connecté', detail: 'Conversation en cours' },
  declined: { label: 'Appel refusé', detail: 'Votre contact a décliné l’appel' },
  busy: { label: 'Contact occupé', detail: 'Réessayez dans quelques instants' },
  interrupted: { label: 'Appel interrompu', detail: 'La connexion a été perdue' },
  ended: { label: 'Appel terminé', detail: 'La conversation est terminée' },
};

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
  onViewPublicProfile,
  onNotify
}: AxoraMessagesProps) {
  // Inbox tabs, including a dedicated call history surface.
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'unread' | 'nearby' | 'match_pop' | 'calls'>('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [recipientQuery, setRecipientQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMemberIds, setNewGroupMemberIds] = useState<string[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom theme dictionary mapped per discussion ID
  const [chatThemes, setChatThemes] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('axo_chat_themes_v1') || 'null') || { c1: 'wave', c2: 'cyber-red', c3: 'emerald' }; } catch { return {}; } });
  
  // Selected theme ID state
  const activeChatThemeId = chatThemes[selectedChatId || ''] || 'cyber-red';
  const activeTheme = CHAT_THEMES.find(t => t.id === activeChatThemeId) || CHAT_THEMES[0];
  
  // Reaction picker state
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('axo_message_reactions_v1') || '{}'); } catch { return {}; } });
  const [organizer, setOrganizer] = useState<'archives' | 'blocked' | null>(null);
  const [viewingMediaId, setViewingMediaId] = useState<string | null>(null);
  const [voiceDraft, setVoiceDraft] = useState<{ blob: Blob; url: string; seconds: number; chatId: string } | null>(null);
  const [savingVoice, setSavingVoice] = useState(false);
  useEffect(() => { try { localStorage.setItem('axo_chat_themes_v1', JSON.stringify(chatThemes)); localStorage.setItem('axo_message_reactions_v1', JSON.stringify(messageReactions)); } catch { setToastMsg('Stockage plein : vos préférences ne peuvent pas être sauvegardées.'); } }, [chatThemes, messageReactions]);
  useEffect(() => () => { if (voiceDraft) URL.revokeObjectURL(voiceDraft.url); }, [voiceDraft]);
  
  // Voice note simulator states
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<Record<string, number>>({});
  const [voiceSpeed, setVoiceSpeed] = useState<Record<string, 1 | 1.5 | 2>>(() => {
    try { return JSON.parse(localStorage.getItem('axo_voice_speeds_v1') || '{}'); } catch { return {}; }
  });
  const [voicePositions, setVoicePositions] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('axo_voice_positions_v1') || '{}'); } catch { return {}; }
  });
  const voiceAudioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [chatViewport, setChatViewport] = useState<{ height: number; top: number } | null>(null);
  const [friendAvatarMenu, setFriendAvatarMenu] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<{ src: string; alt: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [attachmentCaption, setAttachmentCaption] = useState('');
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [isSendingAttachment, setIsSendingAttachment] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingSecondsRef = useRef(0);
  const discardRecordingRef = useRef(false);
  const callStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [callMode, setCallMode] = useState<'audio' | 'video'>('audio');
  const [callPermissionError, setCallPermissionError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [resolvedMediaUrls, setResolvedMediaUrls] = useState<Record<string, string>>({});

  const stopCall = (phase: Extract<CallPhase, 'declined' | 'busy' | 'interrupted' | 'ended'> = 'ended') => {
    callStreamRef.current?.getTracks().forEach(track => track.stop());
    callStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setCallPhase(phase);
    setCallPermissionError(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };
  const startCall = async (mode: 'audio' | 'video') => {
    callStreamRef.current?.getTracks().forEach(track => track.stop());
    callStreamRef.current = null;
    setCallMode(mode);
    setCallPermissionError(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallPhase('outgoing');
    setActiveCall(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCallPermissionError(`L’appel ${mode === 'video' ? 'vidéo' : 'vocal'} est ouvert en mode aperçu. Utilisez une connexion HTTPS et autorisez ${mode === 'video' ? 'la caméra et le microphone' : 'le microphone'} pour activer le média.`);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === 'video' });
      callStreamRef.current = stream;
      window.requestAnimationFrame(() => {
        if (mode === 'video' && localVideoRef.current) localVideoRef.current.srcObject = stream;
      });
    } catch {
      setCallPermissionError(`L’appel reste ouvert en mode aperçu. Autorisez ${mode === 'video' ? 'la caméra et le microphone' : 'le microphone'} dans votre navigateur pour activer le média.`);
    }
  };

  // Active call screen simulation
  const [activeCall, setActiveCall] = useState(false);
  const [callPhase, setCallPhase] = useState<CallPhase>('outgoing');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!activeCall || callMode !== 'video' || !localVideoRef.current || !callStreamRef.current) return;
    localVideoRef.current.srcObject = callStreamRef.current;
  }, [activeCall, callMode, callPermissionError]);

  const toggleCallMute = () => {
    const nextMuted = !isMuted;
    callStreamRef.current?.getAudioTracks().forEach(track => { track.enabled = !nextMuted; });
    setIsMuted(nextMuted);
  };

  const toggleCallVideo = () => {
    const nextVideoOff = !isVideoOff;
    callStreamRef.current?.getVideoTracks().forEach(track => { track.enabled = !nextVideoOff; });
    setIsVideoOff(nextVideoOff);
  };

  // Quick replies list
  const QUICK_REPLIES = [
    'Absolument ! 🔥',
    'On s’organise ça ! 😉',
    'Génial comme idée 💡',
    'Dispo dans 10 min !',
    'Je t’ai bien lu 👌'
  ];

  // Simulated typing indicator
  const [isTyping, setIsTyping] = useState(false);
  const [presenceDetail, setPresenceDetail] = useState<'online' | 'last-seen' | 'typing'>('online');
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [messageDateFilter, setMessageDateFilter] = useState('');
  const [conversationSearch, setConversationSearch] = useState('');
  const [showConversationSearch, setShowConversationSearch] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'all' | 'media' | 'links' | 'files'>('all');
  const [pinnedMessageIds, setPinnedMessageIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('axo_pinned_messages_v1') || '[]'); } catch { return []; }
  });
  const [favoriteMessageIds, setFavoriteMessageIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('axo_favorite_messages_v1') || '[]'); } catch { return []; }
  });
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [showSavedMessages, setShowSavedMessages] = useState(false);
  const [savedMessagesFilter, setSavedMessagesFilter] = useState<'pinned' | 'favorites'>('pinned');
  const [showSharedGallery, setShowSharedGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'photos' | 'videos' | 'files' | 'links' | 'locations'>('all');
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [archivedChatIds, setArchivedChatIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('axo_archived_chats_v1') || '[]'); } catch { return []; } });
  const [mutedChatIds, setMutedChatIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('axo_muted_chats_v1') || '[]'); } catch { return []; } });
  const messageSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const chatSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [visibleMessageLimit, setVisibleMessageLimit] = useState(50);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [hasNewMessagesBelow, setHasNewMessagesBelow] = useState(false);
  const [draftsByChat, setDraftsByChat] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('axo_message_drafts_v1') || '{}'); } catch { return {}; }
  });
  const previousScrollHeightRef = useRef(0);
  const previousConversationRef = useRef<string | null>(null);

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
  const [blockedUsernames, setBlockedUsernames] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('axo_blocked_users_v1') || '[]'); } catch { return []; } });
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
  const [contextMessage, setContextMessage] = useState<ChatMessage | null>(null);
  const [forwardMessage, setForwardMessage] = useState<ChatMessage | null>(null);
  const [forwardTargets, setForwardTargets] = useState<string[]>([]);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{ title: string; description: string; confirmLabel: string; action: () => void } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null);

  // Every transient surface has the same predictable keyboard exit.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (contextMessage) setContextMessage(null);
      else if (editingMessage) setEditingMessage(null);
      else if (forwardMessage) setForwardMessage(null);
      else if (pendingConfirmation) setPendingConfirmation(null);
      else if (showReportPanel) setShowReportPanel(false);
      else if (showFriendProfile) setShowFriendProfile(false);
      else if (showCommunityInfo) setShowCommunityInfo(false);
      else if (showCreateGroup) setShowCreateGroup(false);
      else if (showNewConversation) setShowNewConversation(false);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [contextMessage, editingMessage, forwardMessage, pendingConfirmation, showReportPanel, showFriendProfile, showCommunityInfo, showCreateGroup, showNewConversation]);

  useEffect(() => {
    if (!contextMessage && !editingMessage && !forwardMessage) return;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const modal = document.querySelector<HTMLElement>('[data-message-modal]');
      const focusable = modal ? Array.from(modal.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])')).filter(element => !element.hasAttribute('disabled')) : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const frame = requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-message-modal] button, [data-message-modal] input, [data-message-modal] textarea')?.focus());
    window.addEventListener('keydown', trapFocus);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', trapFocus); };
  }, [contextMessage, editingMessage, forwardMessage]);

  const activeChat = chats.find(c => c.id === selectedChatId);
  const activeMessagesCount = selectedChatId ? (chatHistories[selectedChatId]?.length || 0) : 0;
  const matchingMessages = activeChat ? (chatHistories[activeChat.id] || []).filter(message => {
    const matchesText = !conversationSearch.trim() || message.text.toLocaleLowerCase().includes(conversationSearch.trim().toLocaleLowerCase());
    const matchesDate = !messageDateFilter || Boolean(message.sentAt && new Date(message.sentAt).toISOString().slice(0, 10) === messageDateFilter);
    const matchesFilter = messageFilter === 'all'
      || messageFilter === 'media' && (message.isMedia || message.isVoice)
      || messageFilter === 'links' && /https?:\/\//i.test(message.text)
      || messageFilter === 'files' && message.attachment?.kind === 'document';
    return matchesText && matchesDate && matchesFilter;
  }) : [];
  const visibleMessages = matchingMessages.slice(-visibleMessageLimit);
  const hasOlderMessages = visibleMessages.length < matchingMessages.length;
  const savedMessages = activeChat ? (chatHistories[activeChat.id] || []).filter(message => savedMessagesFilter === 'pinned' ? pinnedMessageIds.includes(message.id) : favoriteMessageIds.includes(message.id)) : [];
  const galleryMessages = activeChat ? (chatHistories[activeChat.id] || []).filter(message => {
    if (galleryFilter === 'all') return Boolean(message.isMedia || message.attachment || /https?:\/\//i.test(message.text));
    if (galleryFilter === 'photos') return message.mediaType === 'image' || message.isMedia && !message.mediaType;
    if (galleryFilter === 'videos') return message.mediaType === 'video';
    if (galleryFilter === 'files') return message.attachment?.kind === 'document';
    if (galleryFilter === 'links') return /https?:\/\//i.test(message.text);
    return message.attachment?.kind === 'location';
  }) : [];

  const suggestedMembers = [
    { id: 'u_amina', name: 'Amina Tshibola', username: 'amina.studio', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80', isFollowing: false as const, role: 'member' as const },
    { id: 'u_kelly', name: 'Kelly Banza', username: 'kelly.product', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', isFollowing: true as const, role: 'member' as const },
    { id: 'u_grace', name: 'Grâce L.', username: 'grace.photo', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=80', isFollowing: false as const, role: 'member' as const }
  ];

  const appendSystemMessage = (chatId: string, text: string) => {
    setChatHistories(current => ({
      ...current,
      [chatId]: [...(current[chatId] || []), {
        id: `system-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        senderId: 'other',
        senderName: 'Axora',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sentAt: Date.now(),
        isSystem: true,
      }],
    }));
  };

  const copyGroupInvitation = async () => {
    if (!activeChat?.isGroup) return;
    const invitationLink = `https://axora.app/invite/${encodeURIComponent(activeChat.id)}`;
    await navigator.clipboard?.writeText(invitationLink);
    showToast('Lien d’invitation copié');
  };

  const addCommunityMember = (member: typeof suggestedMembers[number]) => {
    if (!activeChat?.isGroup || activeChat.members?.some(item => item.id === member.id)) return;
    setChats(current => current.map(chat => chat.id === activeChat.id ? {
      ...chat,
      members: [...(chat.members || []), member],
      memberCount: (chat.memberCount || chat.members?.length || 0) + 1,
      memberAvatars: [...(chat.memberAvatars || []), member.avatar].slice(0, 4)
    } : chat));
    onNotify?.({ type: 'comment', title: 'Membre ajouté', description: `${member.name} rejoint « ${activeChat.name} ».`, target: 'message', targetId: activeChat.id });
    appendSystemMessage(activeChat.id, `${member.name} a rejoint la communauté.`);
    showToast(`${member.name} a été ajouté à la communauté`);
  };

  const updateCommunityMember = (memberId: string, change: 'admin' | 'member' | 'remove') => {
    if (!activeChat?.isGroup || activeChat.currentUserRole !== 'admin') return;
    const member = activeChat.members?.find(item => item.id === memberId);
    setChats(current => current.map(chat => {
      if (chat.id !== activeChat.id) return chat;
      const members = change === 'remove'
        ? (chat.members || []).filter(member => member.id !== memberId)
        : (chat.members || []).map(member => member.id === memberId ? { ...member, role: change } : member);
      return { ...chat, members, memberCount: members.length + 1, memberAvatars: members.map(member => member.avatar).slice(0, 4) };
    }));
    if (member) appendSystemMessage(activeChat.id, change === 'remove' ? `${member.name} a été retiré de la communauté.` : `${member.name} est maintenant ${change === 'admin' ? 'administrateur' : 'membre'}.`);
  };

  const leaveCommunity = () => {
    if (!activeChat) return;
    setPendingConfirmation({ title: 'Quitter la communauté ?', description: `Vous quitterez « ${activeChat.name} » et son historique local sera supprimé.`, confirmLabel: 'Quitter', action: () => {
    setChats(current => current.filter(chat => chat.id !== activeChat.id));
    setChatHistories(current => {
      const next = { ...current };
      delete next[activeChat.id];
      return next;
    });
    setShowCommunityInfo(false);
    setSelectedChatId(null);
    }});
  };

  const deleteConversation = () => {
    if (!activeChat) return;
    setPendingConfirmation({ title: 'Supprimer la discussion ?', description: `La conversation avec ${activeChat.name} sera supprimée de cet appareil.`, confirmLabel: 'Supprimer', action: () => {
      setChatHistories(previous => { const next = { ...previous }; delete next[activeChat.id]; return next; });
      setChats(previous => previous.filter(chat => chat.id !== activeChat.id));
      setShowFriendProfile(false);
      setSelectedChatId(null);
    }});
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

  useEffect(() => {
    setConversationSearch('');
    setMessageDateFilter('');
    setShowConversationSearch(false);
    setContextMessage(null);
    setReplyingToMessage(null); setSelectedMessageIds([]); setMessageFilter('all'); setForwardTargets([]);
    setVisibleMessageLimit(50);
    setHasNewMessagesBelow(false);
    setInputText(selectedChatId ? draftsByChat[selectedChatId] || '' : '');
  }, [selectedChatId]);

  useEffect(() => {
    localStorage.setItem('axo_message_drafts_v1', JSON.stringify(draftsByChat));
  }, [draftsByChat]);

  useEffect(() => { localStorage.setItem('axo_voice_speeds_v1', JSON.stringify(voiceSpeed)); }, [voiceSpeed]);
  useEffect(() => { localStorage.setItem('axo_voice_positions_v1', JSON.stringify(voicePositions)); }, [voicePositions]);

  useEffect(() => {
    localStorage.setItem('axo_pinned_messages_v1', JSON.stringify(pinnedMessageIds));
  }, [pinnedMessageIds]);

  useEffect(() => {
    localStorage.setItem('axo_favorite_messages_v1', JSON.stringify(favoriteMessageIds));
  }, [favoriteMessageIds]);

  useEffect(() => { localStorage.setItem('axo_archived_chats_v1', JSON.stringify(archivedChatIds)); }, [archivedChatIds]);
  useEffect(() => { localStorage.setItem('axo_muted_chats_v1', JSON.stringify(mutedChatIds)); }, [mutedChatIds]);

  const toggleSavedMessage = (messageId: string, kind: 'pinned' | 'favorite') => {
    const setter = kind === 'pinned' ? setPinnedMessageIds : setFavoriteMessageIds;
    setter(current => current.includes(messageId) ? current.filter(id => id !== messageId) : [...current, messageId]);
    showToast(kind === 'pinned' ? 'Épinglage mis à jour' : 'Favori mis à jour');
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(current => current.includes(messageId) ? current.filter(id => id !== messageId) : [...current, messageId]);
  };

  const selectedMessages = activeChat ? (chatHistories[activeChat.id] || []).filter(message => selectedMessageIds.includes(message.id)) : [];
  const clearMessageSelection = () => setSelectedMessageIds([]);

  const handleMessageSwipe = (message: ChatMessage, event: React.PointerEvent) => {
    const start = messageSwipeStartRef.current;
    messageSwipeStartRef.current = null;
    if (!start || Math.abs(event.clientY - start.y) > 48) return;
    if (event.clientX - start.x > 72) replyToMessage(message);
  };

  const handleChatSwipe = (chatId: string, event: React.PointerEvent) => {
    const start = chatSwipeStartRef.current;
    chatSwipeStartRef.current = null;
    if (!start || Math.abs(event.clientY - start.y) > 48) return;
    if (event.clientX - start.x < -72) {
      setArchivedChatIds(current => Array.from(new Set([...current, chatId])));
      showToast('Discussion archivée');
    }
    if (event.clientX - start.x > 72) {
      setMutedChatIds(current => current.includes(chatId) ? current.filter(id => id !== chatId) : [...current, chatId]);
      showToast(mutedChatIds.includes(chatId) ? 'Notifications réactivées' : 'Discussion mise en sourdine');
    }
  };

  const highlightMessageText = (text: string) => {
    const query = conversationSearch.trim();
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.split(new RegExp(`(${escaped})`, 'ig')).map((part, index) => part.toLowerCase() === query.toLowerCase()
      ? <mark key={`${part}-${index}`} className="rounded bg-amber-300/70 px-0.5 text-inherit">{part}</mark>
      : part);
  };

  // Opening a conversation acknowledges every locally stored unread message.
  useEffect(() => {
    if (!selectedChatId) return;
    setChats(current => current.map(chat => chat.id === selectedChatId && chat.unreadCount > 0 ? { ...chat, unreadCount: 0 } : chat));
  }, [selectedChatId, setChats]);

  // IndexedDB is the source of truth; persisted blob URLs expire on reload.
  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    const messages = selectedChatId ? chatHistories[selectedChatId] || [] : [];
    void Promise.all(messages.filter(message => message.mediaId).map(async message => {
      try {
        const blob = await readLocalMedia(message.mediaId!);
        if (!blob || cancelled) return null;
        const url = URL.createObjectURL(blob); created.push(url);
        return [message.id, url] as const;
      } catch { return null; }
    })).then(entries => {
      if (!cancelled) setResolvedMediaUrls(Object.fromEntries(entries.filter(Boolean) as (readonly [string, string])[]));
    });
    return () => { cancelled = true; created.forEach(url => URL.revokeObjectURL(url)); };
  }, [selectedChatId, chatHistories]);

  useEffect(() => {
    setChats(current => current.map(chat => {
      if (!(chat.id in chatHistories)) return chat;
      const preview = messagePreview(chatHistories[chat.id]);
      return preview.lastMessage === chat.lastMessage && preview.timestamp === chat.timestamp ? chat : { ...chat, ...preview };
    }));
  }, [chatHistories, setChats]);

  const openMessageMenu = (message: ChatMessage) => {
    setContextMessage(message);
  };
  const startLongPress = (message: ChatMessage, event: React.PointerEvent) => {
    cancelLongPress();
    longPressStartRef.current = { x: event.clientX, y: event.clientY };
    longPressTimerRef.current = setTimeout(() => {
      openMessageMenu(message);
      longPressStartRef.current = null;
      if (navigator.vibrate) navigator.vibrate(35);
    }, 480);
  };
  const cancelLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
    longPressStartRef.current = null;
  };
  const cancelLongPressOnMove = (event: React.PointerEvent) => {
    if (!longPressStartRef.current) return;
    const distance = Math.hypot(event.clientX - longPressStartRef.current.x, event.clientY - longPressStartRef.current.y);
    if (distance > 10) cancelLongPress();
  };
  const updateOwnMessage = (messageId: string, text: string) => {
    if (!activeChat || !text.trim()) return;
    setChatHistories(current => ({
      ...current,
      [activeChat.id]: (current[activeChat.id] || []).map(message => message.id === messageId ? { ...message, text: text.trim(), editedAt: Date.now() } : message),
    }));
    setEditingMessage(null);
    setContextMessage(null);
    showToast('Message modifié');
  };
  const deleteMessage = (messageId: string, forEveryone: boolean) => {
    if (!activeChat) return;
    setChatHistories(current => ({
      ...current,
      [activeChat.id]: (current[activeChat.id] || []).filter(message => message.id !== messageId),
    }));
    setContextMessage(null);
    setPinnedMessageIds(current => current.filter(id => id !== messageId));
    setFavoriteMessageIds(current => current.filter(id => id !== messageId));
    showToast('Message supprimé de cet appareil');
  };

  // Keep readers where they are; only follow messages when they are already at
  // the end of a conversation or when opening another conversation.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = messagesScrollRef.current;
      if (!container) return;
      const openedAnotherConversation = previousConversationRef.current !== selectedChatId;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 96;
      if (openedAnotherConversation || isNearBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: openedAnotherConversation ? 'auto' : 'smooth' });
        setHasNewMessagesBelow(false);
      } else {
        setHasNewMessagesBelow(true);
      }
      previousConversationRef.current = selectedChatId;
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedChatId, activeMessagesCount]);

  const loadOlderMessages = () => {
    const container = messagesScrollRef.current;
    if (!container || !hasOlderMessages || isLoadingOlderMessages) return;
    previousScrollHeightRef.current = container.scrollHeight;
    setIsLoadingOlderMessages(true);
    window.setTimeout(() => {
      setVisibleMessageLimit(current => current + 50);
      requestAnimationFrame(() => {
        const nextContainer = messagesScrollRef.current;
        if (nextContainer) nextContainer.scrollTop += nextContainer.scrollHeight - previousScrollHeightRef.current;
        setIsLoadingOlderMessages(false);
      });
    }, 220);
  };

  const handleMessagesScroll = () => {
    const container = messagesScrollRef.current;
    if (!container) return;
    if (container.scrollTop < 32) loadOlderMessages();
    if (container.scrollHeight - container.scrollTop - container.clientHeight < 96) setHasNewMessagesBelow(false);
  };

  const scrollToLatestMessage = () => {
    const container = messagesScrollRef.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    setHasNewMessagesBelow(false);
  };

  // Toast auto-clear
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Frontend call lifecycle: outgoing, ringing, connected and terminal states.
  useEffect(() => {
    if (!activeCall) return;
    if (callPhase === 'outgoing') {
      const timer = window.setTimeout(() => setCallPhase('ringing'), 700);
      return () => window.clearTimeout(timer);
    }
    if (callPhase === 'ringing') {
      const timer = window.setTimeout(() => setCallPhase(activeChat?.isOnline === false ? 'busy' : 'connected'), 1500);
      return () => window.clearTimeout(timer);
    }
    if (['declined', 'busy', 'interrupted', 'ended'].includes(callPhase)) {
      const timer = window.setTimeout(() => {
        setActiveCall(false);
        setCallPhase('outgoing');
      }, 2200);
      return () => window.clearTimeout(timer);
    }
  }, [activeCall, callPhase, activeChat?.isOnline]);

  useEffect(() => {
    if (activeCall && callPhase === 'connected') {
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
  }, [activeCall, callPhase]);

  useEffect(() => {
    const handleOffline = () => {
      if (activeCall) stopCall('interrupted');
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [activeCall]);

  useEffect(() => {
    const updateConnectionState = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateConnectionState);
    window.addEventListener('offline', updateConnectionState);
    return () => {
      window.removeEventListener('online', updateConnectionState);
      window.removeEventListener('offline', updateConnectionState);
    };
  }, []);

  useEffect(() => {
    if (!isRecordingVoice) {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      return;
    }

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 59) {
          mediaRecorderRef.current?.stop();
          setIsRecordingVoice(false);
          return prev;
        }
        recordingSecondsRef.current = prev + 1;
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

  const advanceMessageReceipt = (chatId: string, messageId: string) => {
    window.setTimeout(() => setChatHistories(current => ({
      ...current,
      [chatId]: (current[chatId] || []).map(message => message.id === messageId && message.receiptStatus !== 'failed' ? { ...message, receiptStatus: 'delivered' } : message)
    })), 450);
    window.setTimeout(() => setChatHistories(current => ({
      ...current,
      [chatId]: (current[chatId] || []).map(message => message.id === messageId && message.receiptStatus !== 'failed' ? { ...message, receiptStatus: 'read' } : message)
    })), 1500);
  };

  const retryMessage = (messageId: string) => {
    if (!selectedChatId) return;
    if (!navigator.onLine) { showToast('Toujours hors connexion. Réessayez une fois connecté.'); return; }
    setChatHistories(current => ({
      ...current,
      [selectedChatId]: (current[selectedChatId] || []).map(message => message.id === messageId ? { ...message, receiptStatus: 'sent' } : message)
    }));
    advanceMessageReceipt(selectedChatId, messageId);
    showToast('Nouvel envoi en cours');
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
      sentAt: Date.now(),
      receiptStatus: navigator.onLine ? 'sent' : 'failed',
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

    setChats(current => bringChatToFront(current, selectedChatId, { lastMessage: textToSend, timestamp: 'À l\'instant' }));

    setInputText('');
    setDraftsByChat(current => {
      const next = { ...current };
      delete next[selectedChatId];
      return next;
    });
    setReplyingToMessage(null);
    
    if (navigator.onLine) advanceMessageReceipt(selectedChatId, newMsg.id);
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'gallery') => {
    const files: File[] = Array.from(event.target.files || []) as File[];
    const file = files[0];
    if (!file) return;
    if (files.some(item => !item.type.startsWith('image/') && !item.type.startsWith('video/'))) {
      showToast('Choisissez uniquement des images ou des vidéos.');
      return;
    }
    if (files.some(item => item.size > 80 * 1024 * 1024)) {
      showToast('Chaque média doit peser 80 Mo maximum.');
      return;
    }
    const kind = file.type.startsWith('video/') ? 'video' : 'image';

    setPendingAttachment({
      kind,
      name: file.name || (source === 'camera' ? 'Média pris à l’instant' : 'Média sélectionné'),
      detail: `${files.length > 1 ? `${files.length} médias · ` : ''}${(file.size / 1024 / 1024).toFixed(1)} Mo · ${source === 'camera' ? 'Caméra' : 'Galerie'}`,
      previewUrl: URL.createObjectURL(file),
      source,
      file,
      files,
    });
    setAttachmentCaption('');
    setAttachmentProgress(0);
    event.target.value = '';
  };

  const handleDocumentSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast('Le document ne doit pas dépasser 15 Mo.');
      event.target.value = '';
      return;
    }
    setPendingAttachment({
      kind: 'document',
      name: file.name,
      detail: `${(file.size / 1024 / 1024).toFixed(1)} Mo · ${file.type || 'Document'}`,
      file,
    });
    setAttachmentCaption('');
    setAttachmentProgress(0);
    event.target.value = '';
  };

  const prepareLocationAttachment = () => {
    setAttachmentMenuOpen(false);
    setPendingAttachment({ kind: 'location', name: 'Position actuelle', detail: 'Localisation en cours…' });
    setAttachmentCaption('');
    if (!navigator.geolocation) {
      setPendingAttachment({ kind: 'location', name: 'Position partagée', detail: 'Kinshasa, RDC · position approximative' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => setPendingAttachment({
        kind: 'location',
        name: 'Position partagée',
        detail: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)} · précision ${Math.round(position.coords.accuracy)} m`,
      }),
      () => setPendingAttachment({ kind: 'location', name: 'Position partagée', detail: 'Localisation non autorisée · aperçu uniquement' }),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 60_000 }
    );
  };

  const clearPendingAttachment = () => {
    if (pendingAttachment?.previewUrl) URL.revokeObjectURL(pendingAttachment.previewUrl);
    setPendingAttachment(null);
    setAttachmentCaption('');
    setAttachmentProgress(0);
    setIsSendingAttachment(false);
  };

  const confirmAttachmentSend = async () => {
    if (!selectedChatId || !pendingAttachment || isSendingAttachment) return;
    const chatId = selectedChatId;
    const attachment = pendingAttachment;
    const fallbackText = attachment.kind === 'image'
      ? attachment.source === 'camera' ? '📷 Photo prise à l’instant' : '🖼️ Photo partagée'
      : attachment.kind === 'video'
        ? attachment.source === 'camera' ? '🎥 Vidéo prise à l’instant' : '🎬 Vidéo partagée'
      : attachment.kind === 'document' ? `📎 Document : ${attachment.name}`
      : `📍 ${attachment.name} · ${attachment.detail}`;
    const messageText = attachmentCaption.trim() ? `${fallbackText}\n${attachmentCaption.trim()}` : fallbackText;
    const messageId = `attachment-${Date.now()}`;

    setIsSendingAttachment(true);
    setAttachmentProgress(12);
    try {
      const files = attachment.files || (attachment.file ? [attachment.file] : []);
      const messages: ChatMessage[] = await Promise.all((files.length ? files : [undefined]).map(async (file, index) => {
        const mediaId = file ? `attachment-${crypto.randomUUID()}` : undefined;
        if (file && mediaId) await saveLocalMedia(mediaId, file);
        const kind = file?.type.startsWith('video/') ? 'video' : file?.type.startsWith('image/') ? 'image' : attachment.kind;
        const isMedia = kind === 'image' || kind === 'video';
        return {
          id: `${messageId}-${index}`,
          text: index === 0 ? messageText : file?.name || fallbackText,
          senderId: 'me',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          sentAt: Date.now(),
          receiptStatus: navigator.onLine ? 'sent' : 'failed',
          isMedia,
          mediaType: kind === 'video' ? 'video' : kind === 'image' ? 'image' : undefined,
          mediaId,
          attachment: attachment.kind === 'location'
            ? { kind: 'location', name: attachment.name, mimeType: 'application/geo+json' }
            : file ? { kind: kind === 'video' ? 'video' : kind === 'image' ? 'image' : 'document', name: file.name, mimeType: file.type || 'application/octet-stream' } : undefined,
        };
      }));
      setChatHistories(current => ({ ...current, [chatId]: [...(current[chatId] || []), ...messages] }));
      setChats(current => bringChatToFront(current, chatId, { lastMessage: fallbackText, timestamp: 'À l’instant' }));
      setAttachmentProgress(100);
      if (navigator.onLine) messages.forEach(message => advanceMessageReceipt(chatId, message.id));
      clearPendingAttachment();
      showToast(navigator.onLine ? 'Pièce jointe ajoutée' : 'Pièce jointe conservée hors connexion');
    } catch {
      setIsSendingAttachment(false); setAttachmentProgress(0);
      showToast('Impossible de sauvegarder le fichier. Libérez de l’espace puis réessayez.');
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecordingVoice && mediaRecorderRef.current) { mediaRecorderRef.current.stop(); return; }
    if (!selectedChatId || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { showToast('L’enregistrement vocal n’est pas disponible sur cet appareil.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream; recordingChunksRef.current = []; discardRecordingRef.current = false;
      const recorder = new MediaRecorder(stream); mediaRecorderRef.current = recorder;
      recorder.ondataavailable = event => { if (event.data.size) recordingChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        if (discardRecordingRef.current) {
          recordingStreamRef.current?.getTracks().forEach(track => track.stop()); recordingStreamRef.current = null;
          setIsRecordingVoice(false); setRecordingSeconds(0); return;
        }
        const seconds = Math.max(1, recordingSecondsRef.current);
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setVoiceDraft({ blob, url: URL.createObjectURL(blob), seconds, chatId: selectedChatId });
        recordingStreamRef.current?.getTracks().forEach(track => track.stop()); recordingStreamRef.current = null;
        setIsRecordingVoice(false); setRecordingSeconds(0); showToast('Écoutez votre vocal avant de l’envoyer.');
      };
      recorder.start(); recordingSecondsRef.current = 0; setRecordingSeconds(0); setIsRecordingVoice(true);
    } catch { showToast('Autorisez le microphone pour enregistrer un vocal.'); }
  };
  const sendVoiceDraft = async () => {
    if (!voiceDraft || savingVoice) return;
    setSavingVoice(true);
    try {
      const mediaId = 'voice-' + crypto.randomUUID();
      await saveLocalMedia(mediaId, voiceDraft.blob);
      const message: ChatMessage = { id: crypto.randomUUID(), text: 'Note vocale · ' + voiceDraft.seconds + 's', senderId: 'me', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), sentAt: Date.now(), isVoice: true, mediaId, attachment: { kind: 'audio', name: 'Note vocale', mimeType: voiceDraft.blob.type }, receiptStatus: navigator.onLine ? 'sent' : 'failed' };
      setChatHistories(current => ({ ...current, [voiceDraft.chatId]: [...(current[voiceDraft.chatId] || []), message] }));
      if (navigator.onLine) advanceMessageReceipt(voiceDraft.chatId, message.id);
      setVoiceDraft(null); showToast('Note vocale ajoutée');
    } catch { showToast('Sauvegarde impossible. Votre vocal est conservé pour réessayer.'); }
    finally { setSavingVoice(false); }
  };

  const cancelVoiceRecording = () => {
    discardRecordingRef.current = true;
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    else recordingStreamRef.current?.getTracks().forEach(track => track.stop());
    recordingSecondsRef.current = 0;
    setIsRecordingVoice(false); setRecordingSeconds(0);
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
    const audio = voiceAudioRefs.current[msgId];
    if (audio) {
      if (!audio.paused) { audio.pause(); setPlayingVoiceId(null); return; }
      audio.playbackRate = voiceSpeed[msgId] || 1;
      (Object.values(voiceAudioRefs.current) as (HTMLAudioElement | null)[]).forEach(other => { if (other && other !== audio) other.pause(); });
      void audio.play().catch(() => showToast('Lecture impossible. Réessayez.'));
      setPlayingVoiceId(msgId);
      return;
    }
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

  const replyToMessage = (message: ChatMessage) => {
    setReplyingToMessage(message);
    setContextMessage(null);
    window.setTimeout(() => {
      const container = messagesScrollRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }, 80);
  };

  const jumpToMessage = (messageId: string) => {
    setShowConversationSearch(false);
    window.requestAnimationFrame(() => {
      const target = messagesScrollRef.current?.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.animate(
        [{ filter: 'brightness(1)' }, { filter: 'brightness(1.35)' }, { filter: 'brightness(1)' }],
        { duration: 900, easing: 'ease-out' }
      );
    });
  };

  // Filtered chats lists
  const filteredChats = chats.filter(ch => {
    if (blockedUsernames.includes(ch.username)) return false;
    if (archivedChatIds.includes(ch.id)) return false;
    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = ch.name.toLowerCase().includes(q) || ch.username.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Tab filtering (mock categorization)
    if (activeTab === 'groups') return ch.isGroup;
    if (activeTab === 'unread') return ch.unreadCount > 0;
    if (activeTab === 'nearby') return ch.isOnline && !ch.isGroup;
    if (activeTab === 'match_pop') return !ch.isGroup && (chatHistories[ch.id]?.length || 0) >= 2;

    return true; // For 'all'
  });

  const callHistory = [
    { chatId: 'c2', mode: 'video' as const, label: 'Appel vidéo', time: 'Hier à 18:42', status: 'Terminé', completed: true },
    { chatId: 'c1', mode: 'audio' as const, label: 'Appel audio', time: 'Lundi à 09:16', status: 'Manqué', completed: false },
  ];

  useEffect(() => { localStorage.setItem('axo_blocked_users_v1', JSON.stringify(blockedUsernames)); }, [blockedUsernames]);

  const bringChatToFront = (current: ChatSummary[], chatId: string, update: Partial<ChatSummary>) => {
    const target = current.find(chat => chat.id === chatId);
    return target ? [{ ...target, ...update }, ...current.filter(chat => chat.id !== chatId)] : current;
  };

  const blockActiveChat = () => {
    if (!activeChat) return;
    setBlockedUsernames(current => Array.from(new Set([...current, activeChat.username])));
    setShowFriendProfile(false);
    setSelectedChatId(null);
    onNotify?.({ type: 'security', title: 'Compte bloqué', description: `${activeChat.name} ne peut plus apparaître dans votre messagerie locale.`, target: 'message', targetId: activeChat.id });
    showToast(`${activeChat.name} a été bloqué.`);
  };

  const submitReport = () => {
    if (!activeChat || !reportReason) return;
    const reports = (() => { try { return JSON.parse(localStorage.getItem('axo_message_reports_v1') || '[]'); } catch { return []; } })();
    localStorage.setItem('axo_message_reports_v1', JSON.stringify([{ id: crypto.randomUUID(), chatId: activeChat.id, username: activeChat.username, reason: reportReason, createdAt: Date.now() }, ...reports]));
    onNotify?.({ type: 'security', title: 'Signalement enregistré', description: `Votre signalement concernant ${activeChat.name} est enregistré sur cet appareil.`, target: 'message', targetId: activeChat.id });
    setShowReportPanel(false);
    setReportReason('');
    showToast('Signalement enregistré localement.');
  };

  const redial = async (chatId: string, mode: 'audio' | 'video') => {
    setSelectedChatId(chatId);
    await startCall(mode);
  };

  const createGroup = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;
    const id = `g_${Date.now()}`;
    const members = suggestedMembers.filter(member => newGroupMemberIds.includes(member.id));
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
      memberCount: members.length + 1,
      memberAvatars: members.map(member => member.avatar),
      members
    };
    setChats(current => [group, ...current]);
    setChatHistories(current => ({ ...current, [id]: [{
      id: `system-${Date.now()}`,
      text: `Vous avez créé « ${name} »${members.length ? ` avec ${members.length} membre${members.length > 1 ? 's' : ''}.` : '.'}`,
      senderId: 'other',
      senderName: 'Axora',
      timestamp: 'À l’instant',
      sentAt: Date.now(),
      isSystem: true,
    }] }));
    setNewGroupName('');
    setNewGroupMemberIds([]);
    setShowCreateGroup(false);
    setSelectedChatId(id);
    onNotify?.({ type: 'comment', title: 'Groupe créé', description: `« ${name} » est prêt avec ${members.length} membre${members.length > 1 ? 's' : ''}.`, target: 'message', targetId: id });
    showToast('Groupe créé avec succès');
  };
  const createConversation = (name: string) => {
    const id = `dm_${Date.now()}`;
    const chat: ChatSummary = { id, name, username: name.toLowerCase().replace(/\s+/g, '_'), lastMessage: 'Nouvelle conversation', timestamp: 'À l’instant', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', isOnline: true };
    setChats(current => [chat, ...current]); setChatHistories(current => ({ ...current, [id]: [] })); setShowNewConversation(false); setSelectedChatId(id);
  };

  return (
    <div
      id="axora-insta-messaging"
      className={`w-full h-full flex flex-col overflow-x-hidden bg-[var(--axo-bg)] text-[var(--axo-text)] ${selectedChatId ? 'fixed inset-0 z-[45] h-[100dvh] min-h-0 overflow-hidden lg:static lg:h-full lg:z-auto' : 'min-h-[520px]'}`}
      style={selectedChatId && chatViewport ? { height: `${chatViewport.height}px`, top: `${chatViewport.top}px`, bottom: 'auto' } : undefined}
    >
      {organizer && <MessageDialog title={organizer === 'archives' ? 'Discussions archivées' : 'Comptes bloqués'} onClose={() => setOrganizer(null)}>
        <div className="space-y-2">{organizer === 'archives' ? <>{chats.filter(chat => archivedChatIds.includes(chat.id)).map(chat => <div key={chat.id} className="flex items-center gap-3 rounded-2xl border border-[var(--axo-border)] p-3"><span className="min-w-0 flex-1 truncate text-sm font-semibold">{chat.name}</span><button className="message-secondary" onClick={() => { setArchivedChatIds(current => current.filter(id => id !== chat.id)); showToast('Discussion désarchivée'); }}>Désarchiver</button></div>)}{!chats.some(chat => archivedChatIds.includes(chat.id)) && <p className="message-empty">Aucune discussion archivée.</p>}</> : <>{blockedUsernames.map(username => <div key={username} className="flex items-center gap-3 rounded-2xl border border-[var(--axo-border)] p-3"><span className="min-w-0 flex-1 truncate text-sm">@{username}</span><button className="message-secondary" onClick={() => { setBlockedUsernames(current => current.filter(name => name !== username)); showToast('Compte débloqué'); }}>Débloquer</button></div>)}{blockedUsernames.length === 0 && <p className="message-empty">Aucun compte bloqué.</p>}</>}</div>
      </MessageDialog>}
      {viewingMediaId && <MediaViewer initialId={viewingMediaId} messages={(chatHistories[selectedChatId || ''] || []).filter(message => message.isMedia)} urls={resolvedMediaUrls} onClose={() => setViewingMediaId(null)} />}
      {voiceDraft && <MessageDialog title="Écouter avant d’envoyer" onClose={() => { if (!savingVoice) setVoiceDraft(null); }}>
        <p className="mb-3 text-sm text-[var(--axo-text-muted)]">Vocal de {voiceDraft.seconds} s pour {chats.find(chat => chat.id === voiceDraft.chatId)?.name}</p>
        <audio controls src={voiceDraft.url} className="w-full" />
        <div className="mt-4 flex gap-2"><button disabled={savingVoice} className="message-secondary flex-1" onClick={() => setVoiceDraft(null)}>Supprimer</button><button disabled={savingVoice} className="message-primary flex-1" onClick={sendVoiceDraft}>{savingVoice ? 'Sauvegarde…' : 'Envoyer le vocal'}</button></div>
      </MessageDialog>}
      <AnimatePresence>
        {showSavedMessages && (
          <motion.div data-message-modal role="dialog" aria-modal="true" aria-label="Messages enregistrés" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-end bg-black/65 p-3 sm:items-center sm:justify-center" onClick={() => setShowSavedMessages(false)}>
            <motion.section initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 24 }} onClick={event => event.stopPropagation()} className="max-h-[82dvh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-bg)] p-4 shadow-2xl">
              <header className="flex items-center justify-between"><div><h2 className="text-base font-black">Messages enregistrés</h2><p className="mt-1 text-xs text-[var(--axo-text-muted)]">Pour {activeChat?.name || 'cette discussion'}</p></div><button type="button" onClick={() => setShowSavedMessages(false)} className="rounded-full p-2" aria-label="Fermer"><X className="h-5 w-5" /></button></header>
              <div className="mt-4 grid grid-cols-2 rounded-2xl bg-[var(--axo-surface-muted)] p-1"><button type="button" onClick={() => setSavedMessagesFilter('pinned')} className={`rounded-xl py-2 text-xs font-black ${savedMessagesFilter === 'pinned' ? 'bg-[var(--axo-bg)] text-[var(--axo-accent)] shadow-sm' : 'text-[var(--axo-text-muted)]'}`}>Épinglés</button><button type="button" onClick={() => setSavedMessagesFilter('favorites')} className={`rounded-xl py-2 text-xs font-black ${savedMessagesFilter === 'favorites' ? 'bg-[var(--axo-bg)] text-[var(--axo-accent)] shadow-sm' : 'text-[var(--axo-text-muted)]'}`}>Favoris</button></div>
              <div className="mt-3 space-y-2">{savedMessages.map(message => <button key={message.id} type="button" onClick={() => { setShowSavedMessages(false); jumpToMessage(message.id); }} className="w-full rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3 text-left"><p className="line-clamp-2 text-sm font-semibold">{message.text}</p><p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">{message.timestamp}</p></button>)}{savedMessages.length === 0 && <p className="rounded-2xl border border-dashed border-[var(--axo-border)] px-4 py-10 text-center text-xs text-[var(--axo-text-muted)]">Aucun message enregistré dans cette catégorie.</p>}</div>
            </motion.section>
          </motion.div>
        )}
        {showSharedGallery && (
          <motion.div data-message-modal role="dialog" aria-modal="true" aria-label="Galerie partagée" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-end bg-black/65 p-3 sm:items-center sm:justify-center" onClick={() => setShowSharedGallery(false)}>
            <motion.section initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 24 }} onClick={event => event.stopPropagation()} className="max-h-[86dvh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-bg)] p-4 shadow-2xl"><header className="flex items-center justify-between"><div><h2 className="text-base font-black">Galerie partagée</h2><p className="mt-1 text-xs text-[var(--axo-text-muted)]">Médias, fichiers, liens et positions</p></div><button type="button" onClick={() => setShowSharedGallery(false)} className="rounded-full p-2" aria-label="Fermer"><X className="h-5 w-5" /></button></header><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{([['all', 'Tout'], ['photos', 'Photos'], ['videos', 'Vidéos'], ['files', 'Fichiers'], ['links', 'Liens'], ['locations', 'Positions']] as const).map(([id, label]) => <button key={id} type="button" onClick={() => setGalleryFilter(id)} className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black ${galleryFilter === id ? 'bg-[var(--axo-accent)] text-white' : 'bg-[var(--axo-surface-muted)] text-[var(--axo-text-muted)]'}`}>{label}</button>)}</div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{galleryMessages.map(message => { const url = resolvedMediaUrls[message.id] || (!message.mediaId ? message.mediaUrl : undefined); return <button key={message.id} type="button" onClick={() => { setShowSharedGallery(false); if (message.isMedia) setViewingMediaId(message.id); else jumpToMessage(message.id); }} className="min-h-28 overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-2 text-left">{message.mediaType === 'video' && url ? <video muted playsInline src={url} className="h-24 w-full rounded-xl object-cover" /> : message.isMedia && url ? <img src={url} alt="Média partagé" className="h-24 w-full rounded-xl object-cover" /> : <><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--axo-surface-muted)]"><FileText className="h-4 w-4 text-[var(--axo-accent)]" /></span><p className="mt-2 line-clamp-3 text-[10px] font-bold">{message.text}</p></>} </button>; })}</div>{galleryMessages.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-[var(--axo-border)] px-4 py-10 text-center text-xs text-[var(--axo-text-muted)]">Aucun élément dans cette catégorie.</p>}</motion.section>
          </motion.div>
        )}
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
              <fieldset className="mt-5"><legend className="text-[10px] font-black uppercase tracking-widest text-[var(--axo-text-muted)]">Inviter des membres</legend><div className="mt-2 space-y-2">{suggestedMembers.map(member => { const selected = newGroupMemberIds.includes(member.id); return <button key={member.id} type="button" onClick={() => setNewGroupMemberIds(current => selected ? current.filter(id => id !== member.id) : [...current, member.id])} className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left ${selected ? 'border-[var(--axo-accent)] bg-[var(--axo-accent)]/10' : 'border-[var(--axo-border)] bg-[var(--axo-surface)]'}`}><img src={member.avatar} alt="" className="h-9 w-9 rounded-xl object-cover" /><span className="min-w-0 flex-1"><b className="block truncate text-xs">{member.name}</b><span className="block text-[10px] text-[var(--axo-text-muted)]">@{member.username}</span></span><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-[var(--axo-accent)] bg-[var(--axo-accent)] text-white' : 'border-[var(--axo-border)] text-transparent'}`}><Check className="h-3.5 w-3.5" /></span></button>; })}</div></fieldset>
              <button type="submit" disabled={!newGroupName.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--axo-accent)] px-4 py-3 text-xs font-black text-white transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40"><Users className="h-4 w-4" />Créer le groupe</button>
            </motion.form>
          </div>
        )}
        {showNewConversation && <div className="fixed inset-0 z-[130] flex items-center justify-center p-4"><button type="button" onClick={() => setShowNewConversation(false)} className="absolute inset-0 bg-black/70" aria-label="Fermer" /><div className="relative w-full max-w-sm rounded-[28px] bg-[var(--axo-bg)] p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-sm font-black">Nouvelle conversation</h3><button type="button" onClick={() => setShowNewConversation(false)}><X className="h-5 w-5" /></button></div><input autoFocus value={recipientQuery} onChange={event => setRecipientQuery(event.target.value)} placeholder="Rechercher un destinataire…" className="mt-4 w-full rounded-xl border border-[var(--axo-border)] bg-transparent p-3 text-sm outline-none" />{['Amina Tshibola', 'Kelly Banza', 'Grâce L.'].filter(name => name.toLowerCase().includes(recipientQuery.toLowerCase())).map(name => <button key={name} type="button" onClick={() => createConversation(name)} className="mt-2 flex w-full items-center justify-between rounded-xl border border-[var(--axo-border)] p-3 text-left text-xs font-bold">{name}<ArrowRight className="h-4 w-4 text-[var(--axo-accent)]" /></button>)}</div></div>}
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
            <h2 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-150' : 'text-zinc-700'}`}>{activeTab === 'calls' ? 'Appels' : 'Messages'}</h2>
          </div>
          <div className="flex gap-2"><button type="button" onClick={() => setActiveTab('calls')} className={`rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] p-2 ${activeTab === 'calls' ? 'text-emerald-500' : 'text-[var(--axo-accent)]'}`} aria-label="Ouvrir les appels"><PhoneCall className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setShowNewConversation(true)} className="rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] p-2 text-[var(--axo-accent)]" aria-label="Nouvelle conversation"><MessageCircle className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setShowCreateGroup(true)} className="flex items-center gap-1.5 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--axo-accent)]"><Plus className="h-3.5 w-3.5" />Groupe</button></div>
        </div>
      )}

      <div className="axora-messages-layout flex-1 min-h-0 flex flex-col relative overflow-hidden">
        
        {/* ================= CHATS COLUMN SIDEBAR ================= */}
        <div className={`axora-messages-sidebar w-full flex flex-col select-none ${selectedChatId ? 'hidden lg:flex' : 'flex'}`}>
          {activeTab === 'calls' && <section className="axora-calls-panel flex-1 overflow-y-auto p-4" aria-label="Historique des appels">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--axo-border)] pb-4">
              <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--axo-accent)]">Appels</p><h3 className="mt-1 text-lg font-black">Historique récent</h3><p className="mt-1 text-xs text-[var(--axo-text-muted)]">Rappelez un contact ou reprenez la discussion.</p></div>
              <button type="button" onClick={() => setActiveTab('all')} className="rounded-xl border border-[var(--axo-border)] px-3 py-2 text-[10px] font-black text-[var(--axo-text-muted)]">Messages</button>
            </div>
            <div className="mt-4 space-y-2">
              {callHistory.map(call => {
                const chat = chats.find(item => item.id === call.chatId);
                if (!chat) return null;
                return <article key={`${call.chatId}-${call.time}`} className="rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3.5">
                  <div className="flex items-center gap-3"><img src={chat.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b className="truncate text-sm">{chat.name}</b><span className={`text-[10px] font-bold ${call.completed ? 'text-emerald-500' : 'text-[#FF2D55]'}`}>{call.status}</span></div><p className="mt-1 text-xs text-[var(--axo-text-muted)]">{call.label} · {call.time}</p></div></div>
                  <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setSelectedChatId(call.chatId); setActiveTab('all'); }} className="rounded-xl border border-[var(--axo-border)] py-2.5 text-xs font-black">Message</button><button type="button" onClick={() => redial(call.chatId, call.mode)} className="flex items-center justify-center gap-2 rounded-xl bg-[var(--axo-accent)] py-2.5 text-xs font-black text-white"><PhoneCall className="h-4 w-4" />Rappeler</button></div>
                </article>;
              })}
            </div>
          </section>}
          {activeTab !== 'calls' && <>
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

          <div className="flex gap-2 px-4 pb-2"><button className="message-secondary" onClick={() => setOrganizer('archives')}>Archives · {archivedChatIds.length}</button><button className="message-secondary" onClick={() => setOrganizer('blocked')}>Comptes bloqués · {blockedUsernames.length}</button></div>
          {/* DIRECT CATEGORY TABS */}
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
                <span>Toutes</span>
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
                <span>Non lus</span>
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
                <span>À proximité</span>
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
                <span>Affinités</span>
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
                <button
                  type="button"
                  key={ch.id}
                  onPointerDown={event => { chatSwipeStartRef.current = { x: event.clientX, y: event.clientY }; }}
                  onPointerUp={event => handleChatSwipe(ch.id, event)}
                  onClick={() => { setSelectedChatId(ch.id); setShowChatConfig(false); }}
                  aria-label={`Ouvrir la conversation ${ch.name}${ch.unreadCount > 0 ? `, ${ch.unreadCount} message${ch.unreadCount > 1 ? 's' : ''} non lu${ch.unreadCount > 1 ? 's' : ''}` : ''}`}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`w-full p-3 rounded-2.5xl border transition-all duration-300 cursor-pointer flex gap-3 relative overflow-hidden group/item text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--axo-accent)] ${
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
                      {draftsByChat[ch.id]?.trim() ? <><span className="font-black text-[#FF2D55]">Brouillon&nbsp;</span>{draftsByChat[ch.id]}</> : ch.lastMessage}
                    </p>
                  </div>

                  {/* Unread dot or simulated count badge */}
                  {ch.unreadCount > 0 && (
                    <div className="self-center flex-shrink-0 flex items-center justify-center h-4.5 min-w-4.5 px-1 bg-[var(--axo-accent)] rounded-full text-[8.5px] font-black text-[var(--axo-on-accent)] font-mono shadow-md">
                      {ch.unreadCount}
                    </div>
                  )}
                </button>
              );
            })}

            {filteredChats.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-[10px] text-zinc-500 italic font-mono">Aucune discussion disponible</p>
              </div>
            )}
          </div>
          </>}
        </div>

        {/* ================= ACTIVE CHAT & CALL WINDOW ================= */}
        <div className={`axora-messages-conversation w-full flex-1 min-h-0 flex-col overflow-hidden relative ${
          isDark ? 'bg-transparent' : 'bg-transparent'
        } ${selectedChatId ? 'flex' : 'hidden lg:flex'}`}>
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
                            <div className="p-3 pt-0"><input value={memberSearchQuery} onChange={event => setMemberSearchQuery(event.target.value)} placeholder="Rechercher un membre…" className="w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-bg)] px-3 py-2 text-xs outline-none focus:border-[var(--axo-accent)]" /></div>
                            {suggestedMembers.filter(member => `${member.name} ${member.username}`.toLowerCase().includes(memberSearchQuery.trim().toLowerCase())).map(member => {
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
                              {activeChat.currentUserRole === 'admin' && <div className="flex shrink-0 gap-1"><button type="button" onClick={() => updateCommunityMember(member.id, member.role === 'admin' ? 'member' : 'admin')} className="rounded-lg border border-[var(--axo-border)] px-2 py-2 text-[8px] font-black text-[var(--axo-text-muted)]">{member.role === 'admin' ? 'Retirer admin' : 'Admin'}</button><button type="button" onClick={() => updateCommunityMember(member.id, 'remove')} className="rounded-lg border border-red-500/30 px-2 py-2 text-[8px] font-black text-red-500">Retirer</button></div>}
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
                        <button type="button" onClick={() => void copyGroupInvitation()} className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 text-left text-xs font-bold text-[var(--axo-accent)]"><Share2 className="h-4 w-4" />Copier le lien d’invitation</button>
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
                        <button type="button" onClick={() => { setShowFriendProfile(false); void startCall('audio'); }} className="py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex flex-col items-center gap-1 text-[10px] font-bold"><PhoneCall className="w-5 h-5" />Appeler</button>
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
                          <p className="flex items-center gap-3"><Lock className="h-4 w-4 shrink-0 text-emerald-400" />Vos échanges sont conservés sur cet appareil</p>
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
                        <button type="button" onClick={blockActiveChat} className="w-full p-4 border-t border-white/5 flex items-center gap-3 text-xs font-bold text-red-400 hover:bg-red-500/5"><Lock className="w-4 h-4" /> Bloquer cet utilisateur</button>
                        <button type="button" onClick={deleteConversation} className="w-full p-4 border-t border-white/5 flex items-center gap-3 text-xs font-bold text-red-500 hover:bg-red-500/5"><Trash2 className="w-4 h-4" /> Supprimer la discussion</button>
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
                          <button type="button" disabled={!reportReason} onClick={submitReport} className="mt-4 w-full py-3 rounded-xl bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-xs font-black disabled:opacity-40">Enregistrer le signalement</button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showConversationSearch && (
                  <motion.section
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 28 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute inset-0 z-[65] flex flex-col bg-[var(--axo-bg)] text-[var(--axo-text)] sm:hidden"
                    aria-label="Recherche dans la conversation"
                  >
                    <header className="flex items-center gap-3 border-b border-[var(--axo-border)] px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                      <button type="button" onClick={() => setShowConversationSearch(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--axo-accent)] hover:bg-[var(--axo-surface-muted)]" aria-label="Fermer la recherche">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-black">Rechercher dans la discussion</h2>
                        <p className="truncate text-[10px] text-[var(--axo-text-muted)]">{activeChat.name}</p>
                      </div>
                    </header>

                    <div className="border-b border-[var(--axo-border)] p-4">
                      <label htmlFor="mobile-message-search" className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--axo-text-muted)]">Mots-clés</label>
                      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 py-3 focus-within:border-[var(--axo-accent)]">
                        <Search className="h-4 w-4 shrink-0 text-[var(--axo-accent)]" />
                        <input id="mobile-message-search" autoFocus value={conversationSearch} onChange={event => setConversationSearch(event.target.value)} placeholder="Message, mot ou expression…" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--axo-text-muted)]" />
                        {conversationSearch && <button type="button" onClick={() => setConversationSearch('')} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--axo-text-muted)]" aria-label="Effacer la recherche"><X className="h-4 w-4" /></button>}
                      </div>

                      <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3">
                        <label htmlFor="mobile-message-date" className="block">
                          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--axo-text-muted)]">Date</span>
                          <span className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 py-3">
                            <CalendarDays className="h-4 w-4 text-amber-500" />
                            <input id="mobile-message-date" type="date" value={messageDateFilter} onChange={event => setMessageDateFilter(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                          </span>
                        </label>
                        <select aria-label="Filtrer les messages" value={messageFilter} onChange={event => setMessageFilter(event.target.value as 'all' | 'media' | 'links' | 'files')} className="h-12 min-w-0 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-2 text-xs font-black outline-none"><option value="all">Tout</option><option value="media">Médias</option><option value="links">Liens</option><option value="files">Fichiers</option></select>
                        <button type="button" onClick={() => { setConversationSearch(''); setMessageDateFilter(''); setMessageFilter('all'); }} disabled={!conversationSearch && !messageDateFilter && messageFilter === 'all'} className="h-12 rounded-2xl px-3 text-xs font-black text-[var(--axo-accent)] disabled:opacity-35">Effacer</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--axo-text-muted)]">{visibleMessages.length} résultat{visibleMessages.length > 1 ? 's' : ''}</p>
                      <div className="space-y-2">
                        {visibleMessages.map(message => (
                          <button key={message.id} type="button" onClick={() => jumpToMessage(message.id)} className="flex w-full items-start gap-3 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3 text-left active:scale-[0.99]">
                            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${message.senderId === 'me' ? 'bg-[var(--axo-accent)] text-white' : 'bg-[var(--axo-surface-muted)] text-[var(--axo-text)]'}`}>{message.senderId === 'me' ? 'V' : activeChat.name.slice(0, 1).toUpperCase()}</span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-3 text-[10px]"><b>{message.senderId === 'me' ? 'Vous' : message.senderName || activeChat.name}</b><time className="shrink-0 text-[var(--axo-text-muted)]">{message.timestamp}</time></span>
                              <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-[var(--axo-text-muted)]">{message.text}</span>
                            </span>
                          </button>
                        ))}
                        {visibleMessages.length === 0 && (
                          <div className="rounded-3xl border border-dashed border-[var(--axo-border)] px-5 py-10 text-center">
                            <Search className="mx-auto h-6 w-6 text-[var(--axo-text-muted)]" />
                            <p className="mt-3 text-sm font-black">Aucun message trouvé</p>
                            <p className="mt-1 text-xs text-[var(--axo-text-muted)]">Modifiez les mots-clés ou retirez le filtre de date.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {activeCall ? (
                /* ================= 📞 UPGRADED AUDIO CALL SCREEN ================= */
                <div className="absolute inset-0 z-40 bg-[var(--axo-bg)] text-[var(--axo-text)] flex flex-col justify-between p-6 overflow-hidden">
                  
                  {/* Futuristic background elements and particle glow */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[220px] aspect-square rounded-full filter blur-[100px] opacity-25 pointer-events-none"
                    style={{ backgroundColor: activeTheme.accent }}
                  />

                  {/* Call state bar */}
                  <div className="flex justify-between items-center z-10 select-none">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${callPhase === 'connected' ? 'bg-emerald-500' : ['declined', 'busy', 'interrupted', 'ended'].includes(callPhase) ? 'bg-red-500' : 'animate-pulse bg-amber-400'}`} />
                      <span className="rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--axo-text-muted)]">
                        {callMode === 'video' ? 'APPEL VIDÉO AXORA' : 'APPEL VOCAL AXORA'}
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-mono">{callPhase === 'connected' ? formatCallTime(callTimer) : 'EN DIRECT'}</span>
                  </div>

                  {callPermissionError && (
                    <div role="status" className="relative z-10 mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-center text-[10px] font-semibold leading-relaxed text-amber-500">
                      {callPermissionError}
                    </div>
                  )}

                  {/* Middle Area: Pulsing avatar and visual waves */}
                  <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 text-center">
                    {activeChat.isGroup && <div className="mb-5 grid w-full max-w-sm grid-cols-2 gap-2 sm:grid-cols-3">{[{ id: 'me', name: 'Vous', avatar: localStorage.getItem('axo_profileAvatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80' }, ...(activeChat.members || [])].map((member, index) => <div key={member.id} className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-2"><img src={member.avatar} alt="" className="h-full w-full rounded-xl object-cover opacity-80" /><span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-1 text-[9px] font-bold text-white">{member.name}</span>{index === 0 && <span className="absolute right-2 top-2 rounded-full bg-emerald-500 p-1" />}</div>)}</div>}
                    {callMode === 'video' && (
                      <div className="relative mb-5 aspect-video w-full max-w-xs overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-black">
                        <video ref={localVideoRef} autoPlay muted playsInline className={`h-full w-full object-cover transition-opacity ${isVideoOff ? 'opacity-0' : 'opacity-100'}`} />
                        {(isVideoOff || callPermissionError) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950 text-zinc-500">
                            <Video className="h-7 w-7" aria-hidden="true" />
                            <span className="text-[10px] font-bold">{isVideoOff ? 'Caméra désactivée' : 'Aperçu caméra indisponible'}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Ring waveforms pulsing */}
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={['outgoing', 'ringing'].includes(callPhase) ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                        className="absolute w-28 h-28 rounded-full opacity-10"
                        style={{ border: `2px solid ${activeTheme.accent}` }}
                      />
                      <motion.div 
                        animate={['outgoing', 'ringing'].includes(callPhase) ? { scale: [1, 1.7, 1] } : { scale: 1 }}
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
                    <p className={`mt-2 font-mono text-[11px] font-black uppercase tracking-widest ${callPhase === 'connected' ? 'text-emerald-500' : ['declined', 'busy', 'interrupted', 'ended'].includes(callPhase) ? 'text-red-400' : 'text-amber-400'}`}>
                      {CALL_PHASE_CONTENT[callPhase].label}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">{callPhase === 'connected' && (isMuted || isVideoOff) ? `${isMuted ? 'Micro coupé' : ''}${isMuted && isVideoOff ? ' · ' : ''}${isVideoOff ? 'Caméra coupée' : ''}` : CALL_PHASE_CONTENT[callPhase].detail}</p>
                    
                    {/* Animated timer clock */}
                    {callPhase === 'connected' && <div className="mt-4 px-3 py-1 bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[11px] font-bold text-[var(--axo-text)] rounded-lg font-mono">
                      {formatCallTime(callTimer)}
                    </div>}
                  </div>

                  {/* Bottom controllers buttons bar */}
                  <div className="max-w-sm mx-auto w-full z-10 bg-[var(--axo-surface)] border border-[var(--axo-border)] p-4 rounded-3xl flex justify-around items-center shadow-2xl backdrop-blur-md">
                    {callPhase === 'connected' ? <>
                    <button 
                      type="button"
                      onClick={toggleCallMute}
                      aria-label={isMuted ? 'Réactiver le microphone' : 'Couper le microphone'}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isMuted 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[var(--axo-text)]'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {callMode === 'video' && <button 
                      type="button"
                      onClick={toggleCallVideo}
                      aria-label={isVideoOff ? 'Réactiver la caméra' : 'Couper la caméra'}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isVideoOff 
                          ? 'bg-red-600/20 text-red-500 border border-red-500/25' 
                          : 'bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[var(--axo-text)]'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                    </button>}

                    <button 
                      type="button"
                      onClick={() => {
                        stopCall();
                        showToast(`Aperçu de l’appel terminé (${formatCallTime(callTimer)})`);
                      }}
                      className="w-14 h-14 bg-[var(--axo-accent)] rounded-2xl border border-[var(--axo-border)] flex items-center justify-center text-[var(--axo-on-accent)] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[var(--axo-shadow)]"
                      aria-label="Terminer l’appel"
                    >
                      <PhoneOff className="w-5.5 h-5.5 fill-white" />
                    </button>
                    </> : ['outgoing', 'ringing'].includes(callPhase) ? (
                      <button type="button" onClick={() => stopCall('ended')} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 active:scale-95" aria-label="Annuler l’appel"><PhoneOff className="h-5.5 w-5.5 fill-white" /></button>
                    ) : (
                      <div className="flex items-center gap-2 py-2 text-xs font-black text-[var(--axo-text-muted)]"><PhoneOff className="h-4 w-4" />{CALL_PHASE_CONTENT[callPhase].label}</div>
                    )}
                  </div>

                </div>
              ) : (
                /* ================= 📝 CHAT MESSAGING VIEW ================= */
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
                  
                  {/* CHAT CHANNELS HEADER */}
                  <div className="shrink-0 py-3 px-4 border-b border-[var(--axo-border)] flex justify-between items-center bg-[var(--axo-surface)] select-none z-30 w-full shadow-sm">
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
                        type="button"
                        onClick={() => setShowConversationSearch(true)}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-xl sm:hidden ${conversationSearch || messageDateFilter ? 'bg-[var(--axo-accent)]/10 text-[var(--axo-accent)]' : 'text-[var(--axo-text-muted)]'}`}
                        aria-label="Rechercher dans la conversation"
                        aria-pressed={Boolean(conversationSearch || messageDateFilter)}
                      >
                        <Search className="h-4 w-4" />
                        {(conversationSearch || messageDateFilter) && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--axo-accent)]" />}
                      </button>
                      <input aria-label="Rechercher dans la conversation" value={conversationSearch} onChange={event => setConversationSearch(event.target.value)} placeholder="Rechercher" className="hidden w-28 rounded-lg bg-[var(--axo-surface-muted)] px-2 py-1.5 text-[10px] outline-none focus:ring-2 focus:ring-[var(--axo-accent)]/30 sm:block" />
                      <select aria-label="Filtrer les messages" value={messageFilter} onChange={event => setMessageFilter(event.target.value as 'all' | 'media' | 'links' | 'files')} className="hidden rounded-lg bg-[var(--axo-surface-muted)] px-2 py-1.5 text-[10px] font-bold outline-none sm:block"><option value="all">Tout</option><option value="media">Médias</option><option value="links">Liens</option><option value="files">Fichiers</option></select>
                      <button type="button" onClick={() => setShowSavedMessages(true)} className="flex h-10 w-10 items-center justify-center rounded-xl text-amber-500 hover:bg-[var(--axo-surface-muted)]" aria-label="Messages épinglés et favoris"><Bookmark className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setShowSharedGallery(true)} className="flex h-10 w-10 items-center justify-center rounded-xl text-cyan-500 hover:bg-[var(--axo-surface-muted)]" aria-label="Galerie partagée"><ImageIcon className="h-4 w-4" /></button>
                      <label className="relative hidden h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-amber-400 hover:bg-[var(--axo-surface-muted)] sm:flex" title="Rechercher par date"><CalendarDays className="h-4 w-4" /><input aria-label="Filtrer les messages par date" type="date" value={messageDateFilter} onChange={event => { setMessageDateFilter(event.target.value); showToast(event.target.value ? `Messages du ${event.target.value}` : 'Filtre de date retiré'); }} className="absolute inset-0 cursor-pointer opacity-0" /></label>
                      <button
                        type="button"
                        onClick={() => startCall('audio')}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-[var(--axo-surface-muted)] hover:text-[var(--axo-text)] active:scale-95 sm:h-9 sm:w-9"
                        title="Démarrer l’aperçu de l’appel audio"
                        aria-label={`Appeler ${activeChat.name}`}
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => startCall('video')}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-[var(--axo-surface-muted)] hover:text-[var(--axo-text)] active:scale-95 sm:h-9 sm:w-9"
                        title="Démarrer l'appel Vidéo"
                        aria-label={`Appeler ${activeChat.name} en vidéo`}
                      >
                        <Video className="w-4 h-4 text-cyan-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowChatConfig(!showChatConfig)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 sm:h-9 sm:w-9 ${
                          showChatConfig ? 'text-[#FF2D55] bg-[#FF2D55]/10' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                        title="Personnaliser la discussion"
                        aria-label="Personnaliser la discussion"
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
                  <div
                    ref={messagesScrollRef}
                    data-message-list
                    onScroll={handleMessagesScroll}
                    className="relative min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto overscroll-contain p-4 scroll-smooth"
                    style={{
                      backgroundColor: 'var(--axo-bg)',
                      backgroundImage: `linear-gradient(145deg, color-mix(in srgb, var(--axo-bg) 94%, var(--axo-accent) 6%), var(--axo-bg) 48%, color-mix(in srgb, var(--axo-bg) 94%, var(--axo-accent-wave) 6%)), ${AXORA_CHAT_WALLPAPER}, radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--axo-accent-wave) 9%, transparent), transparent 34%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--axo-accent) 8%, transparent), transparent 38%)`,
                      backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat',
                      backgroundSize: 'cover, 260px 220px, cover, cover',
                    }}
                  >

                    {isOffline && <div role="status" className="sticky top-0 z-30 mx-auto w-fit rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-[10px] font-black text-amber-700 shadow-sm dark:text-amber-300">Hors ligne · les nouveaux envois restent en attente</div>}

                    {matchingMessages.length === 0 && <div className="mx-auto flex min-h-48 max-w-xs flex-col items-center justify-center text-center"><MessageCircle className="h-8 w-8 text-[var(--axo-accent)]" /><p className="mt-3 text-sm font-black">{conversationSearch || messageDateFilter || messageFilter !== 'all' ? 'Aucun message ne correspond à ce filtre' : 'La discussion commence ici'}</p><p className="mt-1 text-xs text-[var(--axo-text-muted)]">{conversationSearch || messageDateFilter || messageFilter !== 'all' ? 'Modifiez ou effacez les filtres pour voir davantage de messages.' : 'Envoyez le premier message pour lancer la conversation.'}</p></div>}

                    {selectedMessageIds.length > 0 && <div className="sticky top-2 z-40 mx-auto flex w-fit max-w-full items-center gap-1 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-1.5 shadow-xl"><span className="px-2 text-[10px] font-black text-[var(--axo-accent)]">{selectedMessageIds.length}</span><button type="button" onClick={async () => { await navigator.clipboard?.writeText(selectedMessages.map(message => message.text).join('\n')); showToast('Messages copiés'); clearMessageSelection(); }} className="rounded-xl px-2 py-2 text-[10px] font-black hover:bg-[var(--axo-surface-muted)]">Copier</button><button type="button" onClick={() => { setFavoriteMessageIds(current => Array.from(new Set([...current, ...selectedMessageIds]))); showToast('Ajoutés aux favoris'); clearMessageSelection(); }} className="rounded-xl px-2 py-2 text-[10px] font-black hover:bg-[var(--axo-surface-muted)]">Favori</button><button type="button" onClick={() => { if (selectedMessages[0]) setForwardMessage(selectedMessages[0]); }} className="rounded-xl px-2 py-2 text-[10px] font-black hover:bg-[var(--axo-surface-muted)]">Transférer</button><button type="button" onClick={() => { if (!activeChat) return; setChatHistories(current => ({ ...current, [activeChat.id]: (current[activeChat.id] || []).filter(message => !selectedMessageIds.includes(message.id)) })); showToast('Messages supprimés'); clearMessageSelection(); }} className="rounded-xl px-2 py-2 text-[10px] font-black text-red-500 hover:bg-red-500/10">Supprimer</button><button type="button" onClick={clearMessageSelection} className="rounded-xl p-2 text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface-muted)]" aria-label="Annuler la sélection"><X className="h-4 w-4" /></button></div>}

                    {(hasOlderMessages || isLoadingOlderMessages) && (
                      <div className="sticky top-0 z-10 flex justify-center py-1">
                        <span className="rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] px-3 py-1.5 text-[10px] font-bold text-[var(--axo-text-muted)] shadow-sm">
                          {isLoadingOlderMessages ? 'Chargement des messages…' : 'Faites défiler vers le haut pour charger les messages précédents'}
                        </span>
                      </div>
                    )}

                    {hasNewMessagesBelow && (
                      <div className="sticky top-3 z-20 flex justify-center">
                        <button type="button" onClick={scrollToLatestMessage} className="rounded-full bg-[var(--axo-accent)] px-3.5 py-2 text-[10px] font-black text-white shadow-lg shadow-black/20">
                          Nouveaux messages ↓
                        </button>
                      </div>
                    )}

                    {visibleMessages.map((msg, index) => {
                      const isSystemMessage = Boolean(msg.isSystem || msg.id.startsWith('system-') || msg.senderName === 'Axora');
                      const isMe = msg.senderId === 'me' && !isSystemMessage;
                      const hasReaction = messageReactions[msg.id];
                      const receiptStatus = msg.receiptStatus || 'delivered';
                      const messageMediaUrl = resolvedMediaUrls[msg.id] || (!msg.mediaId ? msg.mediaUrl : undefined);
                      
                      const isVNot = msg.id.startsWith('m_voice_') || msg.text.startsWith('🎤');
                      const voiceDuration = Number(msg.text.match(/(\d+)\s*secondes?/)?.[1] || 12);
                      const linkMatch = msg.text.match(/https?:\/\/[^\s]+/i);
                      const linkUrl = linkMatch?.[0];
                      const linkDomain = linkUrl ? new URL(linkUrl).hostname.replace(/^www\./, '') : '';
                      const linkTitle = linkUrl ? decodeURIComponent(new URL(linkUrl).pathname.split('/').filter(Boolean).pop() || linkDomain).replace(/[-_]/g, ' ') : '';
                      const auraBubbleRadius = isMe ? '20px 20px 6px 20px' : '20px 20px 20px 6px';

                      return (
                        <div 
                          key={msg.id} 
                          data-message-row
                          data-message-id={msg.id}
                          className={`mx-auto flex w-full ${isSystemMessage ? 'justify-center py-1' : isMe ? 'justify-end' : 'justify-start'} group/msg relative ${selectedMessageIds.includes(msg.id) ? 'rounded-2xl bg-[var(--axo-accent)]/10 ring-1 ring-[var(--axo-accent)]/40' : ''}`}
                        >
                          {/* Left Avatar portrait if other sender */}
                          {!isMe && !isSystemMessage && (
                            <img 
                              src={msg.senderAvatar || activeChat.avatar} 
                              alt={msg.senderName ? `Avatar de ${msg.senderName}` : "avatar portrait"}
                              className="w-6.5 h-6.5 rounded-full object-cover mr-2 self-end border border-white/5 select-none" 
                              referrerPolicy="no-referrer"
                            />
                          )}

                          <div className={`relative flex flex-col ${isSystemMessage ? 'max-w-[90%] items-center' : 'max-w-[84%] sm:max-w-[65%]'}`}>
                            
                            {/* Tap interaction heart attachment overlay (Instagram double tap) */}
                            <div
                              className="relative p-[1px] transition-transform duration-300 group-hover/msg:-translate-y-0.5"
                              style={{
                                borderRadius: auraBubbleRadius,
                                background: isSystemMessage ? 'transparent' : isMe ? 'var(--axo-accent)' : 'var(--axo-border)'
                              }}
                            >
                            <div
                              role="button"
                              tabIndex={0}
                              aria-label={`Message de ${isMe ? 'vous' : msg.senderName || activeChat.name}. Appui long pour les actions.`}
                              onPointerDown={(event) => { messageSwipeStartRef.current = { x: event.clientX, y: event.clientY }; startLongPress(msg, event); }}
                              onPointerMove={cancelLongPressOnMove}
                              onPointerUp={(event) => { handleMessageSwipe(msg, event); cancelLongPress(); }}
                              onPointerLeave={cancelLongPress}
                              onPointerCancel={cancelLongPress}
                              onContextMenu={(event) => {
                                event.preventDefault();
                                openMessageMenu(msg);
                              }}
                              onClick={() => { if (selectedMessageIds.length) toggleMessageSelection(msg.id); }}
                              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMessageMenu(msg); } }}
                              className={`p-3.5 text-xs select-text shadow-sm transition-all duration-300 relative ${isSystemMessage ? 'rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] text-[var(--axo-text-muted)] text-center font-medium !p-2.5' :
                                isMe
                                  ? 'text-[var(--axo-on-accent)] font-bold'
                                  : 'bg-[var(--axo-message-received)] text-[var(--axo-text)]'}`}
                              style={{ 
                                borderRadius: auraBubbleRadius,
                                background: isSystemMessage ? undefined : isMe ? 'var(--axo-accent)' : undefined,
                                boxShadow: 'none'
                              }}
                            >
                              {msg.forwarded && <p className="mb-1 text-[10px] italic opacity-75">Transféré</p>}
                              {isSystemMessage && <span className="mr-1 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[.12em] text-[var(--axo-accent)]"><Link2 className="h-3 w-3" /> Système</span>}
                              {!isMe && !isSystemMessage && activeChat.isGroup && msg.senderName && (
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
                              {msg.isMedia && messageMediaUrl && msg.mediaType === 'video' ? (
                                <div className="space-y-2 select-none">
                                  <video controls playsInline preload="metadata" src={messageMediaUrl} className="max-h-[220px] w-full rounded-xl border border-white/10 bg-black" /><button type="button" className="message-secondary" onClick={() => setViewingMediaId(msg.id)}>Agrandir la vidéo</button>
                                  <p className="leading-relaxed leading-normal">{highlightMessageText(msg.text)}</p>
                                </div>
                              ) : msg.isMedia && messageMediaUrl ? (
                                <div className="space-y-2 select-none">
                                  <button type="button" aria-label="Ouvrir la photo" onClick={event => { event.stopPropagation(); setViewingMediaId(msg.id); }} className="block w-full rounded-xl overflow-hidden border border-white/10 max-h-[160px] aspect-video">
                                    <img 
                                      referrerPolicy="no-referrer"
                                      src={messageMediaUrl}
                                      alt={msg.attachment?.name || "Photo partagée"}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                    />
                                  </button>
                                  <p className="leading-relaxed leading-normal">{highlightMessageText(msg.text)}</p>
                                </div>
                              ) : msg.isVoice && messageMediaUrl ? (
                                <div className="min-w-[220px] space-y-2 py-1">
                                  <audio
                                    ref={node => { voiceAudioRefs.current[msg.id] = node; }}
                                    preload="metadata"
                                    src={messageMediaUrl}
                                    className="hidden"
                                    onLoadedMetadata={event => { const saved = voicePositions[msg.id] || 0; if (saved > 0 && saved < event.currentTarget.duration) event.currentTarget.currentTime = saved; }}
                                    onTimeUpdate={event => { const audio = event.currentTarget; const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0; setVoiceProgress(current => ({ ...current, [msg.id]: pct })); setVoicePositions(current => ({ ...current, [msg.id]: audio.currentTime })); }}
                                    onPlay={() => setPlayingVoiceId(msg.id)}
                                    onPause={() => setPlayingVoiceId(current => current === msg.id ? null : current)}
                                    onEnded={() => { setPlayingVoiceId(null); setVoicePositions(current => ({ ...current, [msg.id]: 0 })); setVoiceProgress(current => ({ ...current, [msg.id]: 0 })); }}
                                  />
                                  <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => toggleVoicePlayback(msg.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--axo-surface)] text-[var(--axo-text)] transition hover:scale-105">
                                      {playingVoiceId === msg.id ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                                    </button>
                                    <div className="flex h-7 flex-1 items-center gap-1" aria-label="Forme d’onde du message vocal">
                                      {[5, 12, 19, 9, 16, 24, 12, 20, 8, 17, 25, 11, 15, 22, 7, 18, 13, 21, 10, 16, 23, 9].map((height, index) => <span key={index} className="flex-1 rounded-full transition-colors" style={{ height: `${height}px`, backgroundColor: index / 22 * 100 <= (voiceProgress[msg.id] || 0) ? 'var(--axo-accent)' : (isMe ? 'rgba(255,255,255,.42)' : 'rgba(100,116,139,.42)') }} />)}
                                    </div>
                                    <button type="button" onClick={() => { const next = voiceSpeed[msg.id] === 1 ? 1.5 : voiceSpeed[msg.id] === 1.5 ? 2 : 1; setVoiceSpeed(current => ({ ...current, [msg.id]: next })); const audio = voiceAudioRefs.current[msg.id]; if (audio) audio.playbackRate = next; }} className="rounded-lg bg-black/10 px-1.5 py-1 text-[9px] font-black">{voiceSpeed[msg.id] || 1}×</button>
                                  </div>
                                  <div className="flex justify-between text-[8px] font-mono opacity-70"><span>{Math.floor(voicePositions[msg.id] || 0)} s mémorisée</span><span>1× · 1,5× · 2×</span></div>
                                </div>
                              ) : msg.attachment?.kind === 'location' ? (
                                <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(msg.text)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-black/10 px-3 py-3 text-[11px] underline underline-offset-2"><MapPin className="h-4 w-4 shrink-0" />Ouvrir la position sur la carte</a>
                              ) : msg.attachment?.kind === 'document' && messageMediaUrl ? (
                                <a href={messageMediaUrl} download={msg.attachment.name} className="flex items-center gap-2 rounded-xl bg-black/10 px-3 py-2 text-[11px] underline underline-offset-2"><FileText className="h-4 w-4 shrink-0" />{msg.attachment.name}</a>
                              ) : linkUrl ? (
                                <div className="space-y-2">
                                  <a href={linkUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/15 bg-black/10 transition hover:bg-black/15">
                                    <div className="flex h-16 items-center gap-3 bg-gradient-to-br from-cyan-400/25 via-violet-400/20 to-fuchsia-500/20 px-3">
                                      <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(linkDomain)}&sz=64`} alt="" className="h-9 w-9 rounded-xl bg-white/90 p-1.5" />
                                      <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black capitalize">{linkTitle || linkDomain}</p><p className="mt-0.5 truncate text-[9px] opacity-70">{linkDomain}</p></div><ExternalLink className="h-4 w-4 shrink-0" />
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2 text-[10px] font-black"><span className="truncate">{msg.text.replace(linkUrl, '').trim() || 'Aperçu du lien'}</span><span className="ml-2 shrink-0 rounded-md bg-white/15 px-2 py-1">Ouvrir</span></div>
                                  </a>
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
                                      <span>{playingVoiceId === msg.id ? "En cours de lecture" : "Message vocal"}</span>
                                      <span>0:{voiceDuration.toString().padStart(2, '0')}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Normal text message logic */
                                <p className="leading-relaxed">{highlightMessageText(msg.text)}</p>
                              )}

                              <div className="flex justify-between items-center mt-1.5 select-none text-[8.5px] font-mono">
                                <span className={isMe ? 'text-[var(--axo-on-accent)] opacity-70' : 'text-[var(--axo-text-muted)]'}>
                                  {msg.editedAt ? 'Modifié · ' : ''}{msg.timestamp}
                                </span>
                                {(pinnedMessageIds.includes(msg.id) || favoriteMessageIds.includes(msg.id)) && <span className={`mr-auto ml-2 flex items-center gap-1 ${isMe ? 'text-[var(--axo-on-accent)]' : 'text-[var(--axo-text-muted)]'}`} title={`${pinnedMessageIds.includes(msg.id) ? 'Épinglé' : ''}${pinnedMessageIds.includes(msg.id) && favoriteMessageIds.includes(msg.id) ? ' · ' : ''}${favoriteMessageIds.includes(msg.id) ? 'Favori' : ''}`}><Bookmark className="h-2.5 w-2.5" />{pinnedMessageIds.includes(msg.id) && 'Épinglé'}</span>}
                                {isMe && receiptStatus === 'failed' && (
                                  <button type="button" onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); retryMessage(msg.id); }} className="flex items-center gap-1 rounded-full bg-black/15 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wide text-[var(--axo-on-accent)]" aria-label="Échec de l’envoi, réessayer">
                                    <RotateCcw className="h-2.5 w-2.5" /> Échec · Réessayer
                                  </button>
                                )}
                                {isMe && receiptStatus !== 'failed' && (
                                  <span className={`flex items-center gap-0.5 text-[7px] font-bold uppercase tracking-widest text-[var(--axo-on-accent)] ${receiptStatus === 'read' ? 'opacity-100' : 'opacity-75'}`}>
                                    {receiptStatus === 'sent' ? <Check className="h-2.5 w-2.5 stroke-[3px]" /> : <CheckCheck className="h-2.5 w-2.5 stroke-[3px]" />}
                                    {receiptStatus === 'sent' ? 'Envoyé' : receiptStatus === 'read' ? 'Lu' : 'Remis'}
                                  </span>
                                )}
                                {isMe && activeChat.isGroup && receiptStatus === 'read' && (activeChat.members || []).length > 0 && (
                                  <span className="ml-1 flex -space-x-1" aria-label={`Lu par ${(activeChat.members || []).map(member => member.name).join(', ')}`}>
                                    {(activeChat.members || []).slice(0, 3).map(member => <img key={member.id} src={member.avatar} alt="" title={`Lu par ${member.name}`} className="h-3.5 w-3.5 rounded-full border border-[var(--axo-accent)] object-cover" />)}
                                  </span>
                                )}
                              </div>
                            </div>
                            </div>

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
                            <div className="absolute top-1/2 hidden -translate-y-1/2 items-center gap-1.5 opacity-0 transition-opacity z-20 select-none px-2 no-tap-trigger cursor-pointer group-hover/msg:opacity-100 sm:flex"
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

                  {/* Quick replies remain available in code but are hidden for the compact WhatsApp-style composer. */}
                  <div className="hidden shrink-0 px-3.5 pt-1.5 border-t border-[var(--axo-border)] bg-[var(--axo-bg)] gap-2 overflow-x-auto py-2 select-none no-scrollbar">
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
                    <AnimatePresence>
                      {pendingAttachment && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mb-3 overflow-hidden rounded-3xl border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] shadow-xl">
                          <div className="flex items-center justify-between gap-3 border-b border-[var(--axo-border)] px-4 py-3">
                            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--axo-accent)]">Aperçu avant envoi</p><p className="mt-1 truncate text-xs font-bold">{pendingAttachment.name}</p></div>
                            <button type="button" onClick={clearPendingAttachment} disabled={isSendingAttachment} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface-muted)] disabled:opacity-40" aria-label="Retirer la pièce jointe"><X className="h-4 w-4" /></button>
                          </div>

                          <div className="p-3">
                            {pendingAttachment.kind === 'image' && pendingAttachment.previewUrl && <img src={pendingAttachment.previewUrl} alt="Aperçu de la photo à envoyer" className="max-h-56 w-full rounded-2xl object-cover" />}
                            {pendingAttachment.kind === 'video' && pendingAttachment.previewUrl && <video controls playsInline src={pendingAttachment.previewUrl} className="max-h-56 w-full rounded-2xl bg-black object-cover" />}
                            {pendingAttachment.files && pendingAttachment.files.length > 1 && <p className="mt-2 text-center text-[10px] font-bold text-[var(--axo-text-muted)]">{pendingAttachment.files.length} médias seront envoyés séparément.</p>}
                            {pendingAttachment.kind === 'document' && (
                              <div className="flex items-center gap-4 rounded-2xl bg-[var(--axo-surface)] p-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500"><FileText className="h-6 w-6" /></span>
                                <div className="min-w-0"><p className="truncate text-sm font-black">{pendingAttachment.name}</p><p className="mt-1 truncate text-[10px] text-[var(--axo-text-muted)]">{pendingAttachment.detail}</p></div>
                              </div>
                            )}
                            {pendingAttachment.kind === 'location' && (
                              <div className="relative flex min-h-32 items-center justify-center overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,45,85,0.18),transparent_38%),var(--axo-surface)]">
                                <div className="text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--axo-accent)] text-white shadow-lg"><Navigation className="h-5 w-5" /></span><p className="mt-3 text-xs font-black">{pendingAttachment.name}</p><p className="mt-1 px-4 text-[10px] text-[var(--axo-text-muted)]">{pendingAttachment.detail}</p><a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(pendingAttachment.detail)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] px-3 py-1.5 text-[10px] font-black text-[var(--axo-accent)]">Ouvrir la carte</a></div>
                              </div>
                            )}

                            <p className="mt-2 text-[10px] text-[var(--axo-text-muted)]">{pendingAttachment.detail}</p>
                            <input value={attachmentCaption} onChange={event => setAttachmentCaption(event.target.value)} disabled={isSendingAttachment} placeholder="Ajouter une légende…" className="mt-3 w-full rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--axo-accent)] disabled:opacity-50" />

                            {isSendingAttachment && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--axo-surface-muted)]"><motion.div className="h-full rounded-full bg-[var(--axo-accent)]" animate={{ width: `${attachmentProgress}%` }} transition={{ duration: 0.18 }} /></div>}
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <button type="button" onClick={clearPendingAttachment} disabled={isSendingAttachment} className="rounded-2xl border border-[var(--axo-border)] py-3 text-xs font-bold disabled:opacity-40">Annuler</button>
                              <button type="button" onClick={confirmAttachmentSend} disabled={isSendingAttachment || pendingAttachment.detail === 'Localisation en cours…'} className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--axo-accent)] py-3 text-xs font-black text-white disabled:opacity-50">{isSendingAttachment ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{isSendingAttachment ? `${attachmentProgress}%` : 'Envoyer'}</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="relative flex gap-1.5 items-center rounded-full px-2.5 py-2 transition-all border border-[var(--axo-border)] bg-[var(--axo-surface)] shadow-sm focus-within:border-[var(--axo-accent)]">
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(event) => handleImageSelection(event, 'gallery')}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*,video/*"
                        capture="environment"
                        className="hidden"
                        onChange={(event) => handleImageSelection(event, 'camera')}
                      />
                      <input
                        ref={documentInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.zip,application/pdf,text/plain"
                        className="hidden"
                        onChange={handleDocumentSelection}
                      />
                      
                      <button type="button" onClick={() => setAttachmentMenuOpen(open => !open)} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--axo-accent)] hover:bg-[var(--axo-surface-muted)]" aria-label="Plus d’options"><Plus className="h-5 w-5" /></button>
                      {attachmentMenuOpen && (
                        <div className="absolute bottom-[calc(100%+0.6rem)] left-0 z-30 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-3 shadow-xl">
                          <button type="button" onClick={() => { galleryInputRef.current?.click(); setAttachmentMenuOpen(false); }} className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-xs font-bold"><ImageIcon className="mr-1 inline h-4 w-4" />Médias</button>
                          <button type="button" onClick={() => { cameraInputRef.current?.click(); setAttachmentMenuOpen(false); }} className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-xs font-bold"><Camera className="mr-1 inline h-4 w-4" />Caméra</button>
                          <button type="button" onClick={() => { documentInputRef.current?.click(); setAttachmentMenuOpen(false); }} className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-xs font-bold"><FileText className="mr-1 inline h-4 w-4" />Document</button>
                          <button type="button" onClick={prepareLocationAttachment} className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-xs font-bold"><MapPin className="mr-1 inline h-4 w-4" />Position</button>
                        </div>
                      )}


                      {/* Voice recorder */}
                      <button 
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                          isRecordingVoice
                            ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]'
                            : isDark ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title="Enregistrer un message vocal"
                        aria-label={isRecordingVoice ? 'Arrêter et écouter le vocal' : 'Enregistrer un vocal'}
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
                        <textarea
                          ref={composerRef}
                          rows={1}
                          aria-label="Écrire un message"
                          placeholder="Écrire un message…"
                          value={inputText}
                          onChange={(e) => {
                            const draft = e.target.value;
                            setInputText(draft);
                            if (selectedChatId) setDraftsByChat(current => ({ ...current, [selectedChatId]: draft }));
                          }}
                          onInput={event => {
                            const element = event.currentTarget;
                            element.style.height = 'auto';
                            element.style.height = `${Math.min(element.scrollHeight, 128)}px`;
                          }}
                          onFocus={() => {
                            window.setTimeout(() => {
                              const container = messagesScrollRef.current;
                              if (container) container.scrollTop = container.scrollHeight;
                            }, 180);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              handleSendMessage(inputText);
                            }
                          }}
                          className={`max-h-32 flex-1 min-w-0 resize-none overflow-y-auto bg-transparent border-none py-1 text-base outline-none focus:ring-0 ${
                            isDark ? 'text-[var(--axo-text)] placeholder:text-[var(--axo-text-muted)]' : 'text-[var(--axo-text)] placeholder:text-[var(--axo-text-muted)]'
                          }`}
                        />
                      )}

                      {/* Sender action click button */}
                      {!isRecordingVoice && <button 
                        type="button"
                        aria-label="Envoyer le message"
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
                  Retrouvez vos échanges, vos vocaux, vos médias et vos thèmes de discussion dans une interface fluide et personnalisable.
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
              data-message-modal
              role="dialog"
              aria-modal="true"
              aria-label="Actions du message"
              className="w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[var(--axo-text)] shadow-2xl shadow-[var(--axo-shadow)]"
              onClick={event => event.stopPropagation()}
            >
              <div className="mb-2 flex items-start justify-between gap-3 px-3 py-2">
                <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--axo-accent)]">Actions du message</p><p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[var(--axo-text-muted)]">{contextMessage.text}</p></div>
                <button type="button" onClick={() => setContextMessage(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface-muted)]" aria-label="Fermer"><X className="h-4 w-4" /></button>
              </div>
              <div className="mb-2 grid grid-cols-5 gap-1 rounded-2xl bg-[var(--axo-surface)] p-2" aria-label="Réagir au message">
                {['❤️', '👍', '😂', '🔥', '😮'].map(emoji => (
                  <button key={emoji} type="button" onClick={() => { handleReactToMessage(contextMessage.id, emoji); setContextMessage(null); }} className={`flex h-11 items-center justify-center rounded-xl text-xl transition active:scale-90 ${messageReactions[contextMessage.id] === emoji ? 'bg-[var(--axo-surface-muted)] ring-2 ring-[var(--axo-accent)]' : 'hover:bg-[var(--axo-surface-muted)]'}`} aria-label={`Réagir avec ${emoji}`}>{emoji}</button>
                ))}
              </div>
              <MessageMenuAction icon={<MessageCircle />} label="Répondre" onClick={() => replyToMessage(contextMessage)} />
              <MessageMenuAction icon={<Copy />} label="Copier" onClick={async () => { await navigator.clipboard?.writeText(contextMessage.text); setContextMessage(null); showToast('Message copié'); }} />
              <MessageMenuAction icon={<Bookmark />} label={pinnedMessageIds.includes(contextMessage.id) ? 'Désépingler' : 'Épingler'} onClick={() => { toggleSavedMessage(contextMessage.id, 'pinned'); setContextMessage(null); }} />
              <MessageMenuAction icon={<Bookmark />} label={favoriteMessageIds.includes(contextMessage.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => { toggleSavedMessage(contextMessage.id, 'favorite'); setContextMessage(null); }} />
              <MessageMenuAction icon={<Check />} label="Sélectionner" onClick={() => { setSelectedMessageIds(current => current.includes(contextMessage.id) ? current : [...current, contextMessage.id]); setContextMessage(null); }} />
              {contextMessage.senderId === 'me' && <MessageMenuAction icon={<Pencil />} label="Modifier" onClick={() => { setEditDraft(contextMessage.text); setEditingMessage(contextMessage); setContextMessage(null); }} />}
              <MessageMenuAction icon={<Forward />} label="Partager" onClick={async () => { if (navigator.share) await navigator.share({ text: contextMessage.text }); else await navigator.clipboard?.writeText(contextMessage.text); setContextMessage(null); showToast('Message prêt à partager'); }} />
              <MessageMenuAction icon={<Forward />} label="Transférer" onClick={() => { setForwardMessage(contextMessage); setForwardTargets([]); setContextMessage(null); }} />
              <MessageMenuAction icon={<Trash2 />} label="Supprimer pour moi" danger onClick={() => { const id = contextMessage.id; setContextMessage(null); setPendingConfirmation({ title: 'Supprimer le message ?', description: 'Il sera retiré de cet appareil. Cette action est définitive.', confirmLabel: 'Supprimer', action: () => deleteMessage(id, false) }); }} />
            </motion.div>
          </motion.div>
        )}
        {forwardMessage && <MessageDialog title="Transférer des messages" onClose={() => setForwardMessage(null)}>
          <p className="mb-3 text-sm text-[var(--axo-text-muted)]">{selectedMessageIds.length || 1} message(s) · Choisissez les destinataires.</p>
          <div className="max-h-[45dvh] space-y-2 overflow-y-auto">{chats.filter(chat => chat.id !== selectedChatId && !blockedUsernames.includes(chat.username)).map(chat => <label key={chat.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--axo-border)] p-3 text-sm"><input type="checkbox" checked={forwardTargets.includes(chat.id)} onChange={() => setForwardTargets(current => current.includes(chat.id) ? current.filter(id => id !== chat.id) : [...current, chat.id])} />{chat.name}</label>)}</div>
          {chats.filter(chat => chat.id !== selectedChatId && !blockedUsernames.includes(chat.username)).length === 0 && <p className="message-empty">Créez une autre discussion pour transférer ce message.</p>}
          <button disabled={!forwardTargets.length} className="message-primary mt-4 w-full" onClick={() => {
            const source = selectedMessageIds.length ? selectedMessages : [forwardMessage];
            const batches = forwardTargets.map(id => ({ id, messages: source.map(message => ({ ...forwardCopy(message), receiptStatus: navigator.onLine ? 'sent' as const : 'failed' as const })) }));
            setChatHistories(current => { const next = { ...current }; batches.forEach(batch => { next[batch.id] = [...(next[batch.id] || []), ...batch.messages]; }); return next; });
            if (navigator.onLine) batches.forEach(batch => batch.messages.forEach(message => advanceMessageReceipt(batch.id, message.id)));
            showToast('Transfert ajouté à ' + forwardTargets.length + ' discussion(s)');
            clearMessageSelection(); setForwardTargets([]); setForwardMessage(null);
          }}>Transférer à {forwardTargets.length} discussion(s)</button>
        </MessageDialog>}
        {editingMessage && (
          <motion.div data-message-modal role="dialog" aria-modal="true" aria-label="Modifier un message" className="absolute inset-0 z-[72] flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingMessage(null)}>
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

      {pendingConfirmation && <div className="absolute inset-0 z-[80] flex items-end justify-center bg-[var(--axo-overlay)] p-3 sm:items-center"><div role="dialog" aria-modal="true" aria-label={pendingConfirmation.title} className="w-full max-w-sm rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] p-5 text-[var(--axo-text)] shadow-2xl"><h3 className="text-sm font-black">{pendingConfirmation.title}</h3><p className="mt-2 text-xs leading-relaxed text-[var(--axo-text-muted)]">{pendingConfirmation.description}</p><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setPendingConfirmation(null)} className="rounded-xl border border-[var(--axo-border)] py-3 text-xs font-bold">Annuler</button><button type="button" onClick={() => { pendingConfirmation.action(); setPendingConfirmation(null); }} className="rounded-xl bg-[#FF2D55] py-3 text-xs font-black text-white">{pendingConfirmation.confirmLabel}</button></div></div></div>}

      {/* FLOAT POP NOTIFIER TOASTER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div role="status" aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
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
