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

export interface Story {
  id: string;
  username: string;
  avatar: string;
  isSeen: boolean;
  mediaUrl: string;
  filter?: string;
  caption?: string;
  font?: string;
  captionColor?: string;
  auraLevel?: number;
  isPrivate?: boolean;
  stickers?: any[];
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
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: 'me' | 'other';
  timestamp: string;
  isMedia?: boolean;
  mediaUrl?: string;
}

export interface AxoraNotification {
  id: string;
  type: 'like' | 'comment' | 'pop' | 'security' | 'match';
  title: string;
  description: string;
  timestamp: string;
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
