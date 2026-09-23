export interface Post {
  id: string;
  author: string;
  username: string;
  avatar: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  time: string;
  hasPoll?: boolean;
  pollData?: {
    question: string;
    options: { text: string; votes: number; id: number }[];
    totalVotes: number;
    userVote?: number;
  };
}

export interface SavedContent {
  id: string;
  type: 'post' | 'reel';
  author: string;
  username: string;
  avatar: string;
  text: string;
  image?: string;
  savedAt: number;
  reasons: Array<'liked' | 'shared'>;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  isSeen: boolean;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  mediaId?: string;
  mediaScale?: number;
  mediaOffsetY?: number;
  background?: string;
  filter?: string;
  caption?: string;
  font?: string;
  captionColor?: string;
  auraLevel?: number;
  isPrivate?: boolean;
  closeFriends?: string[];
  allowReplies?: boolean;
  allowDownload?: boolean;
  stickers?: any[];
  createdAt?: number;
  expiresAt?: number;
  views?: Array<{ username: string; avatar: string; seenAt: number; blocked?: boolean }>;
  responses?: Array<{ id: string; text: string; username: string; createdAt: number }>;
  hiddenBy?: string[];
}

export interface ChatSummary {
  id: string;
  name: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  isGroup?: boolean;
  memberCount?: number;
  memberAvatars?: string[];
  members?: CommunityMember[];
  currentUserRole?: 'admin' | 'member';
}

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
  role?: 'admin' | 'member';
}

export interface ChatMessage {
  editedAt?: number;
  forwarded?: boolean;
  id: string;
  text: string;
  senderId: 'me' | 'other';
  senderName?: string;
  senderAvatar?: string;
  timestamp: string;
  isMedia?: boolean;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  replyTo?: {
    id: string;
    text: string;
    senderId: 'me' | 'other';
  };
  receiptStatus?: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: number;
  isVoice?: boolean;
  /** System events are rendered as neutral timeline notices, not chat bubbles. */
  isSystem?: boolean;
  /** Local IndexedDB id until a remote media service is connected. */
  mediaId?: string;
  attachment?: {
    kind: 'image' | 'video' | 'audio' | 'document' | 'location';
    name: string;
    mimeType: string;
  };
}

export interface AxoraNotification {
  id: string;
  type: 'like' | 'comment' | 'pop' | 'security' | 'match';
  title: string;
  description: string;
  timestamp: string;
  createdAt?: number;
  target?: 'post' | 'comment' | 'profile' | 'room' | 'pop' | 'message';
  targetId?: string;
}

export interface PopSession {
  id: string;
  title: string;
  host: string;
  hostAvatar: string;
  activeCount: number;
  category: string;
  timeRemaining?: string;
}
