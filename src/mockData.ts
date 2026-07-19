import { Post, Story, ChatSummary, AxoraNotification, PopSession, ChatMessage } from './types';

export const mockStories: Story[] = [
  {
    id: 's1',
    username: 'Lena_X',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    isSeen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80'
  },
  {
    id: 's2',
    username: 'Nexus_Core',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    isSeen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&q=80'
  },
  {
    id: 's3',
    username: 'AfriTech_V',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    isSeen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80'
  },
  {
    id: 's4',
    username: 'CyberPulse',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    isSeen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80'
  },
  {
    id: 's5',
    username: 'Zephyr',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    isSeen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80'
  },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: 'Kaelen AfriTech',
    username: 'kaelen_afri_tech',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    text: '🔒 Sécurité des données garantie : Les serveurs Axora sont désormais entièrement chiffrés et audités par Afri-Tech. Vos sessions vocales, appels et messages privés profitent d\'une isolation quantique de bout-en-bout ! 🚀🛡️',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    likes: 1240,
    comments: 89,
    shares: 412,
    isLiked: true,
    time: 'Il y a 12 min'
  },
  {
    id: 'p2',
    author: 'Sarah Jenkins',
    username: 'sara_jenk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    text: 'Sondage rapide pour la prochaine Pop Session collective : Quel thème de débat crypto & tech vous passionne le plus ce soir ? 🔥👇',
    likes: 542,
    comments: 201,
    shares: 34,
    isLiked: false,
    time: 'Il y a 1h',
    hasPoll: true,
    pollData: {
      question: 'Sujet pour la Pop Session de ce soir :',
      options: [
        { id: 1, text: 'IA vs Humains : Créativité unique ?', votes: 142 },
        { id: 2, text: 'Web3 & Décentralisation en Afrique', votes: 212 },
        { id: 3, text: 'Design Bento : L’avenir des UI sombres', votes: 88 }
      ],
      totalVotes: 442
    }
  },
  {
    id: 'p3',
    author: 'Axora HQ',
    username: 'axora_social',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
    text: 'Bienvenue sur Axora ! Découvrez un design Bento ultra-fluide, des Pop Sessions enflammées pour rencontrer du monde instantanément, et gagnez des Axo Coins en participant aux débats en direct. Laissez votre passion s\'enflammer ! ❤️‍🔥',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    likes: 3105,
    comments: 423,
    shares: 1045,
    isLiked: false,
    time: 'Il y a 2h'
  }
];

export const mockChats: ChatSummary[] = [
  {
    id: 'c1',
    name: 'Lena X',
    username: 'Lena_X',
    lastMessage: 'On se lance une session de débat ce soir ?',
    timestamp: '14:24',
    unreadCount: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    isOnline: true,
  },
  {
    id: 'c2',
    name: 'Kaelen AfriTech',
    username: 'kaelen_afri_tech',
    lastMessage: 'Le chiffrement des messages est opérationnel. 🔒',
    timestamp: 'Hier',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    isOnline: true,
  },
  {
    id: 'c3',
    name: 'CyberPulse Agency',
    username: 'cyberpulse_net',
    lastMessage: 'Superbe votre Bento UI ! C’est très pro.',
    timestamp: '03 Juin',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    isOnline: false,
  }
];

export const mockMessages: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1_1', text: 'Salut ! J\'ai adoré ton dernier post sur le design Bento 😍', senderId: 'other', timestamp: '14:15' },
    { id: 'm1_2', text: 'Merci beaucoup Lena ! J\'y ai passé pas mal de temps', senderId: 'me', timestamp: '14:18' },
    { id: 'm1_3', text: 'Franchement ça se voit, l\'ergonomie est géniale.', senderId: 'other', timestamp: '14:20' },
    { id: 'm1_4', text: 'On se lance une session de débat ce soir ? 🔥', senderId: 'other', timestamp: '14:24' }
  ],
  'c2': [
    { id: 'm2_1', text: 'Bonjour, les audits de sécurité de l\'application d\'Axora sont parfaits.', senderId: 'other', timestamp: 'Hier 11:30' },
    { id: 'm2_2', text: 'Excellent, notre priorité absolue reste la protection de la vie privée des utilisateurs.', senderId: 'me', timestamp: 'Hier 11:35' },
    { id: 'm2_3', text: 'Le chiffrement des messages est opérationnel. 🔒', senderId: 'other', timestamp: 'Hier 11:42' }
  ],
  'c3': []
};

export const mockNotifications: AxoraNotification[] = [
  {
    id: 'n1',
    type: 'match',
    title: 'Nouveau Pop Match ! 🔥',
    description: 'Vous avez matché avec Lena_X durant la session Live "UIdesign Tech". Cliquez pour chatter !',
    timestamp: 'Il y a 5 min'
  },
  {
    id: 'n2',
    type: 'security',
    title: 'Sécurisé par Afri-Tech 🛡️',
    description: 'Chiffrement activé sur l\'ensemble de vos appels et conversations directes.',
    timestamp: 'Il y a 1h'
  },
  {
    id: 'n3',
    type: 'like',
    title: 'Aidé & Aimé ! ❤️',
    description: 'kaelen_afri_tech et 45 autres personnes ont aimé votre publication.',
    timestamp: 'Il y a 4h'
  },
  {
    id: 'n4',
    type: 'pop',
    title: 'Pop Session de feu ! 🔥',
    description: 'Une session "Web3 Africa Development" vient de commencer à proximité avec 12 participants.',
    timestamp: 'Il y a 1 jour'
  }
];

export const mockPopSessions: PopSession[] = [
  {
    id: 'pop1',
    title: 'UI Bento & Dark Aesthetics 🎨',
    host: 'Elena Designer',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    activeCount: 142,
    category: 'Design & UX',
    timeRemaining: '18m restantes'
  },
  {
    id: 'pop2',
    title: 'L\'essor de la Tech et Web3 en Côte d\'Ivoire 🇨🇮',
    host: 'Ibrahim Diarra',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    activeCount: 389,
    category: 'Crypto & Tech',
    timeRemaining: '45m restantes'
  },
  {
    id: 'pop3',
    title: 'Session Chill & Musique Afro-Futuriste 🎵',
    host: 'DJ Zephyr',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    activeCount: 88,
    category: 'Musique',
    timeRemaining: '02h restantes'
  }
];
