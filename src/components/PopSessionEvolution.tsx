import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  User, 
  RefreshCw, 
  Check, 
  X, 
  Heart, 
  Star, 
  CheckCircle,
  Shield,
  Upload,
  ChevronRight,
  Sparkle,
  ArrowLeft,
  Lock,
  Flame as SparkleIcon,
  Trash2,
  ShieldAlert,
  CalendarDays,
  MapPin,
  WalletCards
} from 'lucide-react';

interface PopSessionEvolutionProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  isDark: boolean;
}

interface AuraProfile {
  id: string;
  displayName: string;
  realNameObfuscated: string;
  auraScore: number;
  matchPercentage: number;
  tags: string[];
  gradientFrom: string;
  gradientTo: string;
  avatar: string;
  bio: string;
}

const mockRomanticProfiles: AuraProfile[] = [
  {
    id: 'rp-1',
    displayName: 'Alya ⚡',
    realNameObfuscated: 'Alya S. • Privé jusqu\'au Pop',
    auraScore: 18450,
    matchPercentage: 97,
    tags: ['Cyberpunk Architecture', 'Neon Photography', 'Snythwave', 'Bento UI'],
    gradientFrom: 'var(--axo-media-overlay)',
    gradientTo: 'var(--axo-accent)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    bio: 'À la recherche d’une âme créative passionnée par la lumière nocturne, le design génératif et la musique électronique sombre.'
  },
  {
    id: 'rp-2',
    displayName: 'Mathis 🌙',
    realNameObfuscated: 'Mathis V. • Privé jusqu\'au Pop',
    auraScore: 15910,
    matchPercentage: 92,
    tags: ['OLED Minimalist', 'Creative Code', 'Ambient Lo-Fi', 'Atelier v2'],
    gradientFrom: 'var(--axo-media-overlay)',
    gradientTo: 'var(--axo-accent)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Architecte d’interface le jour, explorateur sonore la nuit. Partageons des pixels perf et du thé noir de Kyoto.'
  },
  {
    id: 'rp-3',
    displayName: 'Inès ✨',
    realNameObfuscated: 'Inès D. • Privé jusqu\'au Pop',
    auraScore: 16820,
    matchPercentage: 88,
    tags: ['TypeScript Enthusiast', 'Analog Synth', 'Generative Space', 'Cyberpunk'],
    gradientFrom: 'var(--axo-media-overlay)',
    gradientTo: 'var(--axo-accent)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    bio: 'Minimaliste dans le code comme dans l’espace physique. Trouve de la poésie pure brute dans les lignes rouges des terminaux Linux.'
  },
  {
    id: 'rp-4',
    displayName: 'Cassiel 🪐',
    realNameObfuscated: 'Cassiel M. • Privé jusqu\'au Pop',
    auraScore: 14780,
    matchPercentage: 91,
    tags: ['3D Motion', 'Atelier v2', 'Industrial Techno', 'Cyberpunk Architecture'],
    gradientFrom: 'var(--axo-media-overlay)',
    gradientTo: 'var(--axo-accent)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    bio: 'Modeleur d’univers abstraits. Discutons de mise en page brutaliste, d’ombres douces CSS et de futurisme urbain ultra-saturé.'
  }
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80',
];

const BIO_TEMPLATES = [
  "Explorateur du cyberespace, passionné par l'art génératif nocturne et les architectures d'interfaces épurées.",
  "Minimaliste obsédé par l'harmonie des lumières écarlates et les contrastes élégants du mode sombre OLED.",
  "Développeur passionné de design suisse et de sonorités synthwave sombres, cherchant une âme inspirante pour bâtir des futurs alternatifs."
];

// Aesthetic Interest Chip - strictly color-restricted to Black & Red
interface InterestChipProps {
  text: string;
  isMatch: boolean;
  key?: any;
}

function InterestChip({ text, isMatch }: InterestChipProps) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex-shrink-0 flex items-center gap-1 transition-all ${
        isMatch
          ? 'bg-[var(--axo-surface)] text-[var(--axo-accent)] border border-[var(--axo-accent)]'
          : 'bg-[var(--axo-surface)] text-[var(--axo-text-muted)] border border-[var(--axo-border)]'
      }`}
    >
      {isMatch && <span className="w-1 h-1 bg-[var(--axo-accent)] rounded-full animate-pulse" />}
      {text}
    </span>
  );
}

// Portfolio-styled profile card selector with asymmetrical dark red privacy blend blur
interface PopSessionProfileCardProps {
  profile: AuraProfile;
  userInterests: string[];
  onSkip: () => void;
  onAccept: () => void;
  key?: any;
}

function PopSessionProfileCard({
  profile,
  userInterests,
  onSkip,
  onAccept
}: PopSessionProfileCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative w-full rounded-[28px] overflow-hidden border border-[var(--axo-border)] shadow-xl shadow-[var(--axo-shadow)] flex flex-col justify-end h-[500px] sm:h-[540px] bg-[var(--axo-media-bg)] group"
    >
      {/* Dynamic Aura Gradient Spotter */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[30px]">
        <div 
          className="absolute inset-0 filter blur-[40px] opacity-20 scale-105"
          style={{
            background: `radial-gradient(circle, ${profile.gradientFrom} 0%, var(--axo-media-bg) 80%)`
          }}
        />
      </div>

      {/* Portrait Profile Photo */}
      <div className="absolute inset-0 z-0 bg-[var(--axo-media-bg)]">
        <img 
          src={profile.avatar} 
          alt={profile.displayName} 
          className="w-full h-full object-cover object-center filter saturate-[0.95] brightness-[0.82] group-hover:scale-102 transition-transform duration-[1200ms]"
          referrerPolicy="no-referrer"
        />
        {/* Asymmetrical Gradient Overlay for Privacy Obfuscation */}
        <div className="absolute inset-0 z-10 bg-[var(--axo-overlay)] opacity-35 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 top-[38%] z-10 bg-gradient-to-t from-[var(--axo-media-bg)] via-[var(--axo-media-overlay)] to-transparent pointer-events-none" />
      </div>

      {/* Skip button in top-right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSkip();
        }}
        className="hidden"
        title="Passer discrètement"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Card Info Content */}
      <div className="relative z-20 p-6 space-y-4.5 text-left">
        
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-xl font-black text-[var(--axo-media-text)] tracking-tight">{profile.displayName}</h4>
            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[var(--axo-media-overlay)] text-[var(--axo-accent)] border border-[var(--axo-accent)] text-[9px] font-black font-mono tracking-widest uppercase">
              {profile.matchPercentage}% FIT
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--axo-accent)] select-none">
            <Shield className="w-3.5 h-3.5 text-[var(--axo-accent)] animate-pulse" />
            <span>{profile.realNameObfuscated}</span>
          </div>
        </div>

        {/* Bio Obfuscator Text */}
        <p className="text-sm text-[var(--axo-media-muted)] line-clamp-3 leading-relaxed font-normal">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {/* Tags Segment */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase font-black text-zinc-500 select-none">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[var(--axo-accent)]" />
              <span>Alignements d'Intérêts</span>
            </div>
            <span className="text-zinc-500 font-mono tracking-wider">{profile.auraScore.toLocaleString()} AP</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pb-1 select-none">
            {profile.tags.map((tag, idx) => {
              const isMatch = userInterests.includes(tag);
              return <InterestChip key={idx} text={tag} isMatch={isMatch} />;
            })}
          </div>
        </div>

        {/* Bottom Call to Action Button - Linear red-to-black gradient */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAccept();
          }}
          className="hidden"
        >
          <Flame className="w-4 h-4 fill-current animate-pulse" />
          <span>COUP DE COEUR</span>
        </button>

      </div>
    </motion.div>
  );
}

interface ActiveHeaderSectionProps {
  minutes: string;
  seconds: string;
  onExit: () => void;
}

function ActiveHeaderSection({ minutes, seconds, onExit }: ActiveHeaderSectionProps) {
  return (
    <div id="pop-active-top-header" className="flex items-center justify-between select-none relative z-10 w-full">
      
      {/* Minimal exit trigger */}
      <button
        onClick={onExit}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--axo-surface)] border border-[var(--axo-border)] hover:border-[var(--axo-accent)] text-[var(--axo-text-muted)] hover:text-[var(--axo-text)] transition-all active:scale-95 cursor-pointer"
        title="Suspendre l'évaluation"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Dynamic Floating Countdown Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] text-[var(--axo-accent)] font-mono text-[10px] font-black tracking-widest shadow-sm shadow-[var(--axo-shadow)] select-none uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--axo-accent)] animate-ping" />
        <span>RESTE : {minutes}:{seconds}</span>
      </div>

    </div>
  );
}

interface InteractiveEmptyStateProps {
  matchesCount: number;
  onViewReport: () => void;
}

function InteractiveEmptyState({ matchesCount, onViewReport }: InteractiveEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-8 sm:py-10 text-center space-y-6 max-w-sm mx-auto select-none text-[var(--axo-text)]"
    >
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[var(--axo-accent)] animate-ping" />
        <div className="absolute inset-2 rounded-full border border-dashed border-[var(--axo-accent)] animate-spin" />
        <div className="w-12 h-12 rounded-full bg-[var(--axo-accent)] flex items-center justify-center shadow-lg shadow-[var(--axo-shadow)]">
          <SparkleIcon className="w-5 h-5 text-[var(--axo-on-accent)] fill-current animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-black font-mono tracking-widest text-[var(--axo-accent)] uppercase block">
          Matchmaking Complété
        </span>
        <h4 className="text-base font-black text-[var(--axo-text)] tracking-tight uppercase">QUEUE POP ÉPUISÉE</h4>
        <p className="text-xs text-[var(--axo-text-muted)] leading-relaxed font-normal">
          Toutes les candidatures d'Aura éphémères de cette session active ont été passées en revue avec brio !
        </p>
      </div>

      {matchesCount > 0 ? (
        <div className="p-3.5 rounded-2xl bg-[var(--axo-surface)] border border-[var(--axo-border)] text-xs text-[var(--axo-accent)] font-mono font-black uppercase tracking-wide">
          ⚡ {matchesCount} {matchesCount > 1 ? 'Liaisons Mutuelles' : 'Liaison Mutuelle'}
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-[var(--axo-surface)] border border-[var(--axo-border)] text-[10px] text-[var(--axo-text-muted)] font-mono uppercase tracking-wider">
          Aucun Match Pop pour le moment
        </div>
      )}

      <button
        onClick={onViewReport}
        className="w-full py-4 rounded-2xl bg-[var(--axo-accent)] border border-[var(--axo-accent)] text-[var(--axo-on-accent)] font-black text-xs tracking-widest uppercase cursor-pointer shadow-lg shadow-[var(--axo-shadow)] transition-all active:scale-95 duration-200"
      >
        Consulter le Rapport final
      </button>
    </motion.div>
  );
}

const userInterests = ['Cyberpunk Architecture', 'Neon Photography', 'Atelier v2', 'Bento UI'];

export default function PopSessionEvolution({
  coins,
  setCoins,
  isDark
}: PopSessionEvolutionProps) {
  // Navigation State Pipeline:
  // 'SESSION_SELECTION' -> 'PAYMENT' -> 'ONBOARDING' -> 'ACTIVE' -> 'CLOSED'
  const [sessionState, setSessionState] = useState<'SESSION_SELECTION' | 'PAYMENT' | 'ONBOARDING' | 'ACTIVE' | 'CLOSED'>('SESSION_SELECTION');
  
  // Registration and Profile Data
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; label: string; time: string; desc: string } | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>(AVATAR_PRESETS[0]);
  const [userBio, setUserBio] = useState<string>(BIO_TEMPLATES[0]);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  
  // Transaction loading states to prevent duplicate coin deductions
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [secureMessage, setSecureMessage] = useState<string>('');
  
  // Active timing
  const [secondsRemaining, setSecondsRemaining] = useState<number>(90);
  const [minutesDisplay, setMinutesDisplay] = useState<string>('01');
  const [secondsDisplay, setSecondsDisplay] = useState<string>('30');
  
  // Interactive list of profiles
  const [matchesMade, setMatchesMade] = useState<AuraProfile[]>([]);
  const [activeProfiles, setActiveProfiles] = useState<AuraProfile[]>([]);
  const [showMatchCelebration, setShowMatchCelebration] = useState<boolean>(false);
  const [latestCelebratedMatch, setLatestCelebratedMatch] = useState<AuraProfile | null>(null);

  // File Input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Scheduled Sessions (Black & Red theme specs)
  const sessionTimetable = [
    { id: 'session-1', label: 'Session de Soirée', time: '20:30 - 21:45', desc: 'Le premier grand pic d’audience pour les rencontres d’Aura éphémères.' },
    { id: 'session-2', label: 'Session Nocturne', time: '22:00 - 22:45', desc: 'Idéal pour les connexions secrètes et mystérieuses sous l’ombre rouge.' }
  ];

  // Live Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'ACTIVE') {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // End active cycle automatically
            setSessionState('CLOSED');
            return 0;
          }
          const nextVal = prev - 1;
          const mins = Math.floor(nextVal / 60);
          const secs = nextVal % 60;
          setMinutesDisplay(mins < 10 ? `0${mins}` : `${mins}`);
          setSecondsDisplay(secs < 10 ? `0${secs}` : `${secs}`);
          return nextVal;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionState, setCoins]);

  // Derived state: Pulsating background glow linked intimately to remaining countdown time!
  const [pulsationIntensity, setPulsationIntensity] = useState<number>(1);
  useEffect(() => {
    if (sessionState === 'ACTIVE') {
      const pulseInterval = setInterval(() => {
        // Fast pulse if time is running out (< 30 seconds), moderate otherwise
        const speedMultiplier = secondsRemaining < 30 ? 3 : 1.2;
        setPulsationIntensity(1 + 0.15 * Math.sin(Date.now() * 0.0035 * speedMultiplier));
      }, 80);
      return () => clearInterval(pulseInterval);
    } else {
      setPulsationIntensity(1);
    }
  }, [sessionState, secondsRemaining]);

  const initiateRegistration = (slot: typeof sessionTimetable[0]) => {
    setSelectedSlot(slot);
    setSessionState('PAYMENT');
  };

  // Secure payment transaction: strictly decrease 50 coins safely, guarding against rapid multiple taps or negative balance
  const handlePaymentCheckout = () => {
    if (isProcessingPayment) return;
    
    if (coins < 50) {
      alert("⚠️ Vos fonds sont insuffisants (50 Axo Coins requis d'admission). Ouvrez la boutique de pièces en haut de l'écran d'accueil pour regarder des vidéos sponsorisées et obtenir des pièces !");
      return;
    }
    
    setIsProcessingPayment(true);
    setSecureMessage("Validation cryptographique...");
    
    setTimeout(() => {
      setSecureMessage("Débit sécurisé de -50 Coins...");
      
      setTimeout(() => {
        // Safe mutation block
        setCoins(prev => {
          const checkNext = prev - 50;
          if (checkNext < 0) {
            // Guard
            return prev;
          }
          return checkNext;
        });
        
        setIsProcessingPayment(false);
        setSecureMessage("");
        setSessionState('ONBOARDING');
      }, 700);
    }, 600);
  };

  // Drag and drop photo logic representing USABILITY standards
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const processPhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Seules les images sont autorisées pour votre micro-profil.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserPhoto(event.target.result as string);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerManualFileInput = () => {
    fileInputRef.current?.click();
  };

  // Form submission
  const handleSubmitOnboarding = () => {
    if (!userBio.trim()) {
      alert("⚠️ Veuillez rédiger une bio éphémère de session !");
      return;
    }
    setSecondsRemaining(90);
    setMinutesDisplay('01');
    setSecondsDisplay('30');
    setMatchesMade([]);
    setActiveProfiles([...mockRomanticProfiles]);
    setSessionState('ACTIVE');
  };

  const resetCycle = () => {
    setSessionState('SESSION_SELECTION');
    setSelectedSlot(null);
    setActiveProfiles([]);
    setMatchesMade([]);
    setUploadedFileName('');
  };

  // Demo Fast-track testing trigger with correct constraints
  const forceTriggerActive = () => {
    setSelectedSlot(sessionTimetable[0]);
    setUserPhoto(AVATAR_PRESETS[2]);
    setUserBio(BIO_TEMPLATES[1]);
    setSecondsRemaining(120);
    setMinutesDisplay('02');
    setSecondsDisplay('00');
    setMatchesMade([]);
    setActiveProfiles([...mockRomanticProfiles]);
    setSessionState('ACTIVE');
  };

  return (
    <div className="relative w-full select-none font-sans overflow-hidden py-4 bg-transparent text-[var(--axo-text)]">
      
      {/* Black & Red Backdrop Radial Glow reacting dynamically to countdown pulsation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[130%] aspect-square rounded-full filter blur-[120px] transition-all duration-300 opacity-35"
          style={{
            transform: `translateX(-50%) scale(${pulsationIntensity})`,
            background: `radial-gradient(circle, color-mix(in srgb, var(--axo-accent) ${isDark ? '28%' : '8%'}, transparent) 0%, color-mix(in srgb, var(--axo-bg) 95%, transparent) 70%, transparent 100%)`
          }}
        />
        <div className="absolute inset-0 bg-transparent opacity-5 grid-pattern" />
      </div>

      <div className="relative z-10 space-y-6">

        {/* Animating Screen Transitions */}
        <AnimatePresence mode="wait">

          {/* PHASE 1: CHOOSE UPCOMING FIXED DAILY SESSIONS */}
          {sessionState === 'SESSION_SELECTION' && (
            <motion.div
              key="selection-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Typographic Headings */}
              <div className="text-center space-y-2 py-3 select-none">
                <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--axo-text)]">POP SESSIONS DAILY</h2>
                <p className="text-xs max-w-md mx-auto leading-relaxed font-normal text-[var(--axo-text-muted)]">
                  Rencontrez des profils synchronisés à vos vibrations. Choisissez votre salon éphémère de matchmaking hébergé deux fois par jour.
                </p>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
                {sessionTimetable.map((slot) => (
                  <div 
                    key={slot.id}
                    className="py-5 border-b border-[var(--axo-border)] bg-transparent text-[var(--axo-text)] relative overflow-hidden flex flex-col justify-between group transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF003C]/5 rounded-full filter blur-xl pointer-events-none -mr-4 -mt-4 opacity-40" />
                    
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] bg-[#FF003C]/10 text-[#FF003C] border border-[#FF003C]/20 font-black font-mono px-2 py-0.5 rounded tracking-wider uppercase">
                          S'INSCRIRE
                        </span>
                        
                        {/* 50 COINS ENTRY TICKET BADGE */}
                        <span className="px-2.5 py-1 text-[9px] font-mono font-extrabold text-white bg-[#FF003C] rounded border border-white/10 shadow-[0_0_12px_rgba(255,0,60,0.4)] animate-pulse uppercase">
                          50 COINS
                        </span>
                      </div>

                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-[#FF003C] font-mono text-xs font-black">
                          <Clock className="w-3.5 h-3.5 text-[#FF003C]" />
                          <span>{slot.time}</span>
                        </div>
                        <h4 className={`text-base font-black tracking-tight uppercase pt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{slot.label}</h4>
                        <p className={`text-xs leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>{slot.desc}</p>
                      </div>
                    </div>

                    <div className={`pt-4 flex items-center justify-between border-t mt-4 ${isDark ? 'border-zinc-900' : 'border-zinc-150'}`}>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">
                        🎫 Ticket éphémère
                      </div>
                      <button 
                        onClick={() => initiateRegistration(slot)}
                        className="px-4.5 py-2 bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-[var(--axo-accent)] active:scale-95"
                      >
                        REJOINDRE
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure footer */}
              <div className="p-4 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] text-[10px] text-[var(--axo-text-muted)] font-mono text-center uppercase tracking-wider">
                🔒 Cryptographie d'Aura confidentielle • Suppression des cookies post-session
              </div>
            </motion.div>
          )}

          {/* PHASE 2: TRANSACTION GATE */}
          {sessionState === 'PAYMENT' && selectedSlot && (
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              className="max-w-md mx-auto"
            >
              <div className="py-5 text-[var(--axo-text)] flex flex-col items-center justify-center text-center space-y-6">
                
                {/* Vault Graphic */}
                <div className="relative w-20 h-20 flex items-center justify-center select-none">
                  <div className="absolute inset-0 rounded-full border border-[#FF003C]/30 animate-pulse bg-[#FF003C]/5" />
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#FF003C]/50 animate-spin" />
                  <Lock className="w-8 h-8 text-[#FF003C]" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <span className="text-[9px] font-black text-[#FF003C] font-mono tracking-widest uppercase block">SÉCURISATION DU CHECKPOINT</span>
                  <h3 className="text-xl font-black text-[var(--axo-text)] tracking-tight uppercase">VALIDER L'ADMISSION</h3>
                  <p className="text-xs text-[var(--axo-text-muted)] leading-relaxed font-normal">
                    La participation au salon &ldquo;<strong>{selectedSlot.label}</strong>&rdquo; exige un ticket d'inscription unique de 50 Coins. Ce filtre garantit un haut dynamisme.
                  </p>
                </div>

                <div className="w-full space-y-3 border-y border-[var(--axo-border)] py-4 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--axo-text-muted)]">PopSession</span>
                      <p className="mt-1 text-sm font-black">{selectedSlot.label}</p>
                      <p className="mt-1 text-[11px] text-[var(--axo-text-muted)]">Organisée par Axora Pop</p>
                    </div>
                    <span className="rounded-full border border-[var(--axo-border)] px-3 py-1 text-[10px] font-black text-[var(--axo-accent)]">50 Coins</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-[11px] text-[var(--axo-text-muted)] sm:grid-cols-2">
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[var(--axo-accent)]" />Aujourd’hui · {selectedSlot.time}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--axo-accent)]" />Salon Axora en ligne</span>
                  </div>
                </div>

                {/* Ledger calculations */}
                <div className="w-full p-4 rounded-2xl bg-[var(--axo-surface-muted)] border border-[var(--axo-border)] flex items-center justify-between text-left">
                  <div>
                    <span className="text-[8px] text-zinc-500 font-mono block uppercase">VOTRE SOLDE ACTUEL</span>
                    <span className="text-xs font-black text-[var(--axo-text)] font-mono">{coins} Coins</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-[#FF003C] font-mono block uppercase">FRAIS DE TICKET</span>
                    <span className="text-xs font-black text-[#FF003C] font-mono">-50 Coins</span>
                  </div>
                </div>

                <div className="w-full space-y-2 text-left text-[10px] leading-relaxed text-[var(--axo-text-muted)]">
                  <p className="flex items-start gap-2"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--axo-accent)]" />Paiement sécurisé : vos informations restent confidentielles et ne sont jamais partagées avec les participants.</p>
                  <p className="flex items-start gap-2"><WalletCards className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--axo-accent)]" />Votre place sera confirmée immédiatement après validation des 50 Coins.</p>
                </div>

                {/* Secure interaction triggers */}
                <div className="w-full space-y-3 pt-1">
                  
                  {isProcessingPayment ? (
                    <div className="w-full py-4 rounded-2xl bg-[#FF003C]/10 border border-[#FF003C]/40 flex items-center justify-center gap-2.5">
                      <RefreshCw className="w-4 h-4 text-[#FF003C] animate-spin" />
                      <span className="text-xs font-mono font-bold text-[#FF003C] tracking-wide uppercase">
                        {secureMessage}
                      </span>
                    </div>
                  ) : (
                    <button
                      disabled={coins < 50}
                      onClick={handlePaymentCheckout}
                      className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl transition-all border ${
                        coins >= 50
                          ? 'bg-[var(--axo-accent)] border-[var(--axo-accent)] text-[var(--axo-on-accent)] cursor-pointer hover:scale-[1.01] active:scale-[0.98]'
                          : 'bg-[var(--axo-surface-muted)] border-[var(--axo-border)] text-[var(--axo-text-muted)] cursor-not-allowed'
                      }`}
                    >
                      {coins >= 50 ? "RÉGLER 50 COINS & PROCÉDER" : "SOLDE INSUFFISANT (50 COINS REQUIS)"}
                    </button>
                  )}

                  <button
                    disabled={isProcessingPayment}
                    onClick={() => setSessionState('SESSION_SELECTION')}
                    className="w-full py-2 text-zinc-500 hover:text-zinc-300 transition-all text-[10px] uppercase font-bold tracking-widest cursor-pointer disabled:opacity-30"
                  >
                    Retour aux créneaux
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: EPHEMERAL PROFILE ONBOARDING FORM */}
          {sessionState === 'ONBOARDING' && selectedSlot && (
            <motion.div
              key="onboarding-step"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="py-5 text-[var(--axo-text)] space-y-6 text-left">
                
                <div className="space-y-1 select-none text-left">
                  <div className="flex items-center gap-1.5 text-[#FF003C] font-mono text-[10px] font-black uppercase tracking-widest">
                    <User className="w-4 h-4 text-[#FF003C]" /> Étape 2 sur 2 • Identité Éphémère de Session
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">CRÉER LE MICRO-PROFIL</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Votre pseudonyme @username global reste masqué. Configurez le premier aperçu d'Aura qui sera visible par les autres participants.
                  </p>
                </div>

                <div className="space-y-5">
                  
                  {/* Photo Selection Container */}
                  <div className="space-y-2.5 text-left">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                      Sélectionnez votre avatar de session
                    </label>
                    
                    {/* Visual Presets Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
                      {AVATAR_PRESETS.map((preset, index) => {
                        const isSelected = userPhoto === preset;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setUserPhoto(preset);
                              setUploadedFileName('');
                            }}
                            className={`relative aspect-square rounded-2xl overflow-hidden border p-[2px] transition-all hover:scale-103 active:scale-95 cursor-pointer ${
                              isSelected 
                                ? 'border-[#FF003C] shadow-lg bg-gradient-to-tr from-[#FF003C] to-[#200005]' 
                                : 'border-zinc-800 bg-zinc-900 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                            }`}
                          >
                            <img src={preset} alt={`Avatar ${index}`} className="w-full h-full object-cover rounded-[14px]" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-[#FF003C]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* USABILITY Drag & Drop Upload trigger wrapper */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerManualFileInput}
                      className={`p-4 rounded-2xl border border-dashed transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                        isDragOver
                          ? 'border-[#FF003C] bg-[#FF003C]/5 shadow-[0_0_15px_rgba(255,0,60,0.1)]'
                          : 'border-[var(--axo-border)] bg-[var(--axo-surface-muted)] hover:border-[var(--axo-text-muted)]'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <Upload className={`w-5 h-5 ${isDragOver ? 'text-[#FF003C] animate-bounce' : 'text-zinc-500'}`} />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">
                          {uploadedFileName ? "FICHIER SÉLECTIONNÉ POUR TÉLÉVERSEMENT !" : "TÉLÉVERSER VOTRE PROPRE PHOTO"}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono font-normal">
                          {uploadedFileName ? uploadedFileName : "Glissez-déposez ici ou cliquez pour choisir"}
                        </span>
                      </div>
                    </div>

                    {/* Preview Upload Picture */}
                    {uploadedFileName && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-810 animate-fade-in text-left">
                        <img src={userPhoto} alt="Upload preview" className="w-16 h-16 rounded-xl object-cover border border-[#FF003C]/30" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-[#FF003C] font-mono tracking-widest font-black uppercase block">PHOTO PERSONNALISÉE ACTIVER</span>
                          <span className="text-[10px] text-zinc-400 truncate block font-mono">{uploadedFileName}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserPhoto(AVATAR_PRESETS[0]);
                            setUploadedFileName('');
                          }}
                          className="p-1 text-zinc-500 hover:text-[#FF003C] rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bio Area */}
                  <div className="space-y-2.5 text-left">
                    <div className="flex justify-between items-center select-none">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                        Votre Bio éphémère (Obligatoire)
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">{userBio.length}/200 car.</span>
                    </div>

                    <textarea
                      value={userBio}
                      onChange={(e) => setUserBio(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="Comment décririez-vous vos alignements d'Aura nocturnes ?"
                      className="w-full p-4 rounded-2xl bg-[var(--axo-surface-muted)] border border-[var(--axo-border)] focus:border-[var(--axo-accent)] text-xs text-[var(--axo-text)] leading-relaxed placeholder:text-[var(--axo-text-muted)] resize-none outline-none font-sans focus:ring-1 focus:ring-[var(--axo-accent)]"
                    />

                    {/* Writing Accelerator presets */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-black block">Assistants d'écriture rapide :</span>
                      <div className="flex flex-col gap-1.5">
                        {BIO_TEMPLATES.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setUserBio(tmpl)}
                            className="p-2.5 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] hover:border-[var(--axo-accent)] transition-all text-left text-[10px] text-[var(--axo-text-muted)] hover:text-[var(--axo-text)] leading-snug cursor-pointer line-clamp-1"
                          >
                            &ldquo;{tmpl}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submits */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (confirm("Votre ticket d'inscription unique de 50 Coins sera perdu. Voulez-vous annuler l'enregistrement ?")) {
                        setSessionState('SESSION_SELECTION');
                      }
                    }}
                    className="flex-1 py-3.5 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] hover:border-[var(--axo-text-muted)] text-xs font-black uppercase tracking-widest text-[var(--axo-text-muted)] hover:text-[var(--axo-text)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Abandonner
                  </button>
                  <button
                    onClick={handleSubmitOnboarding}
                    className="flex-1 py-3.5 rounded-2xl bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg border border-[var(--axo-accent)]"
                  >
                    <span>Lancer le Matchmaking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* PHASE 4: ACTIVE MATCHMAKING */}
          {sessionState === 'ACTIVE' && (
            <motion.div
              key="active-matching-step"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-xl mx-auto relative z-10 w-full"
            >
              <div className="space-y-2 px-1 text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--axo-accent)]">PopSession · Étape finale</span>
                <h2 className="text-3xl font-black tracking-tight text-[var(--axo-text)]">À toi de choisir</h2>
                <p className="mx-auto max-w-md text-xs leading-relaxed text-[var(--axo-text-muted)]">
                  Sélectionne les personnes avec qui tu aimerais développer une relation. Si l’intérêt est réciproque, vous pourrez échanger librement.
                </p>
                <p className="mx-auto max-w-md text-[11px] leading-relaxed text-[var(--axo-text-muted)]">
                  Les personnes choisies pourront confirmer leur envie de développer la relation. Votre sélection reste privée jusqu’à la fin du processus.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[var(--axo-text-muted)]">
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Aujourd’hui · {selectedSlot?.time ?? 'Session active'}</span>
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{activeProfiles.length} participants à découvrir</span>
                </div>
              </div>

              <ActiveHeaderSection
                minutes={minutesDisplay}
                seconds={secondsDisplay}
                onExit={() => {
                  if (confirm("Suspendre le salon actif d'Aura ? Vos micro-profils et coupons seront archivés.")) {
                    resetCycle();
                  }
                }}
              />

              <div className="grid grid-cols-3 divide-x divide-[var(--axo-border)] border-y border-[var(--axo-border)] py-3">
                <div className="flex flex-col items-center gap-1 px-2 text-center">
                  <User className="h-4 w-4 text-[var(--axo-accent-wave)]" />
                  <strong className="text-sm font-black">{mockRomanticProfiles.length}</strong>
                  <span className="text-[9px] text-[var(--axo-text-muted)]">Participants</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2 text-center">
                  <Heart className="h-4 w-4 text-[var(--axo-accent)]" />
                  <strong className="text-sm font-black">{Math.max(0, 3 - matchesMade.length)}</strong>
                  <span className="text-[9px] text-[var(--axo-text-muted)]">Sélections restantes</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2 text-center">
                  <Lock className="h-4 w-4 text-[var(--axo-text-muted)]" />
                  <strong className="text-sm font-black">Privé</strong>
                  <span className="text-[9px] text-[var(--axo-text-muted)]">Jusqu’à la fin</span>
                </div>
              </div>

              <div className="space-y-2 px-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[var(--axo-text-muted)]">
                  <span>Progression finale</span>
                  <span>{mockRomanticProfiles.length - activeProfiles.length}/{mockRomanticProfiles.length}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[var(--axo-border)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--axo-accent)]"
                    animate={{ width: `${((mockRomanticProfiles.length - activeProfiles.length) / mockRomanticProfiles.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                  />
                </div>
              </div>

              {activeProfiles.length > 0 ? (
                <div className="space-y-5 relative z-10 w-full">
                  <div className="text-center select-none space-y-1">
                    <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono block">
                      Faites défiler horizontalement ou évaluez
                    </span>
                    <div className="text-xs text-[var(--axo-accent)] font-mono tracking-wider font-black flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--axo-accent)] animate-ping" />
                      <span>{activeProfiles.length} CANDIDATES DISPONIBLES</span>
                    </div>
                  </div>

                  {/* Horizontal Scroll with nice snaps */}
                  <div 
                    className="flex gap-5 overflow-x-auto px-3 sm:px-6 py-4 scroll-smooth snap-x snap-mandatory select-none touch-pan-x cursor-grab active:cursor-grabbing no-scrollbar [&::-webkit-scrollbar]:hidden w-full"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      {activeProfiles.map((p) => {
                        const skipProfile = () => setActiveProfiles(prev => prev.filter(candidate => candidate.id !== p.id));
                        const selectProfile = () => {
                          const isMatchMade = p.matchPercentage > 90 || Math.random() > 0.4;
                          if (isMatchMade) {
                            setMatchesMade(prev => [...prev, p]);
                            setLatestCelebratedMatch(p);
                            setShowMatchCelebration(true);
                          }
                          setActiveProfiles(prev => prev.filter(candidate => candidate.id !== p.id));
                        };
                        return (
                          <div key={p.id} className="relative w-[calc(100vw-3rem)] max-w-[390px] shrink-0 snap-center pb-2">
                            <div className="pointer-events-none absolute inset-x-3 top-3 h-[500px] rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface)] opacity-50 sm:h-[540px]" />
                            <div className="pointer-events-none absolute inset-x-1.5 top-1.5 h-[500px] rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] opacity-70 sm:h-[540px]" />
                            <div className="relative">
                              <PopSessionProfileCard profile={p} userInterests={userInterests} onSkip={skipProfile} onAccept={selectProfile} />
                            </div>
                            <div className="relative mt-5 flex items-start justify-center gap-14">
                              <button type="button" onClick={skipProfile} className="group flex flex-col items-center gap-2 text-[10px] font-black text-[var(--axo-text)]">
                                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--axo-border)] bg-[var(--axo-surface)] shadow-md shadow-[var(--axo-shadow)] transition group-hover:scale-105 group-active:scale-95">
                                  <X className="h-6 w-6" />
                                </span>
                                Passer
                              </button>
                              <button type="button" onClick={selectProfile} className="group flex flex-col items-center gap-2 text-[10px] font-black text-[var(--axo-text)]">
                                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--axo-accent)] bg-[var(--axo-accent)] text-[var(--axo-on-accent)] shadow-md shadow-[var(--axo-shadow)] transition group-hover:scale-105 group-active:scale-95">
                                  <Heart className="h-6 w-6 fill-current" />
                                </span>
                                Sélectionner
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-center gap-1.5 text-zinc-650 text-[10px] font-mono tracking-widest uppercase select-none text-center pt-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--axo-accent)] animate-pulse" />
                    <span>Liaison d'Aura éphémère chiffrée</span>
                  </div>
                </div>
              ) : (
                <InteractiveEmptyState
                  matchesCount={matchesMade.length}
                  onViewReport={() => {
                    setSessionState('CLOSED');
                  }}
                />
              )}

            </motion.div>
          )}

          {/* PHASE 5: MUTUAL MATCHES REPORT */}
          {sessionState === 'CLOSED' && (
            <motion.div
              key="closed-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="py-5 text-[var(--axo-text)] space-y-6">
                
                {/* Completion Details */}
                <div className="text-center space-y-2 select-none">
                  <div className="w-12 h-12 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/25 flex items-center justify-center text-[#FF003C] mx-auto shadow-[0_0_15px_rgba(255,0,60,0.15)] animate-pulse">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#FF003C] uppercase font-mono block">
                    SALON CONSERVÉ ET CLOS
                  </span>
                  <h3 className="text-2xl font-black tracking-tight uppercase text-[var(--axo-text)]">RAPPORT DE CORRESPONDANCE</h3>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed text-[var(--axo-text-muted)]">
                    Le temps imparti à ce salon s’est écoulé. Vos coordonnées d'Aura mutuelle sont décryptées et archivées ci-dessous :
                  </p>
                </div>

                {/* Secure dividend rewards display */}
                <div className="p-4 rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] flex items-center justify-between text-left select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--axo-accent)] flex items-center justify-center text-[var(--axo-on-accent)] text-md">
                      🎟️
                    </div>
                    <div>
                      <h5 className="text-[11px] font-extrabold uppercase font-sans text-[var(--axo-text)]">RETOUR COMPENSATOIRE d'ENGAGEMENT</h5>
                      <span className="text-[10px] text-zinc-500 font-mono block">Prime de complétion de session</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#FF003C] font-mono tracking-tight">+35 Coins</span>
                    <p className="text-[8px] text-zinc-600 font-mono">Déposés sur solde</p>
                  </div>
                </div>

                {/* Direct Messagings Segment */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center select-none">
                    <span className={`text-[10px] font-black uppercase font-mono tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Canaux Confidentiels Débloqués ({matchesMade.length})
                    </span>
                    <span className="text-[9px] text-[#FF003C] font-mono tracking-widest font-black uppercase">COMMUNICATION POP SECURE</span>
                  </div>

                  {matchesMade.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-[var(--axo-border)] bg-[var(--axo-surface-muted)] text-[var(--axo-text-muted)] rounded-2xl text-xs py-10 space-y-2">
                      <p>Aucun Coup de Coeur mutuel n’a abouti cette fois.</p>
                      <p className="text-[10px] text-zinc-650 max-w-xs mx-auto">Conseil: Peaufinez vos alignements et vos descriptions éphémères de portrait pour le prochain salon de 20:30 !</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-left">
                      {matchesMade.map((match, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <img 
                              src={match.avatar} 
                              alt={match.displayName} 
                              className="w-16 h-16 rounded-2xl object-cover border border-[#FF003C]/35"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs font-black text-[var(--axo-text)]">{match.displayName}</h5>
                                <span className="px-2 py-0.5 rounded bg-[#FF003C]/10 text-[#FF003C] text-[8px] font-black font-mono">
                                  {match.matchPercentage}% FIT
                                </span>
                              </div>
                              <p className="text-[9px] text-zinc-500 font-mono italic">
                                Identité certifiée : {match.displayName.split(' ')[0]} {idx % 2 === 0 ? 'S.' : 'M.'}
                              </p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => alert(`🚀 Canal crypté de messagerie confidentielle instantanée ouvert avec ${match.displayName} ! Uniquement disponible pendant la session.`)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-[var(--axo-accent)] shadow-sm"
                          >
                            ÉCRIRE
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lobby re-routing */}
                <div className="pt-2">
                  <button
                    onClick={resetCycle}
                    className="w-full py-3.5 border border-zinc-800 hover:border-[#FF003C]/40 bg-transparent text-xs font-black uppercase tracking-widest text-[#FF003C] rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retour au calendrier des salons</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* MUTUAL MATCH CELEBRATION MODAL OVERLAY */}
        <AnimatePresence>
          {showMatchCelebration && latestCelebratedMatch && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--axo-overlay)] backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-sm p-6 sm:p-8 rounded-[32px] border border-[var(--axo-border)] bg-[var(--axo-surface-strong)] text-[var(--axo-text)] text-center space-y-6 shadow-2xl shadow-[var(--axo-shadow)]"
              >
                {/* Flame Sparklers graphic */}
                <div className="flex justify-center select-none">
                  <div className="w-16 h-16 rounded-full bg-[var(--axo-accent)] flex items-center justify-center shadow-lg shadow-[var(--axo-shadow)] relative border border-[var(--axo-accent)]">
                    <Flame className="w-8 h-8 text-[var(--axo-on-accent)] fill-current animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--axo-surface-strong)] rounded-full flex items-center justify-center text-[10px]">🔥</span>
                  </div>
                </div>

                <div className="space-y-2 select-none">
                  <span className="text-[10px] font-black font-mono tracking-widest text-[var(--axo-accent)] uppercase block">
                    CONNEXION COÏNCIDENTE
                  </span>
                  <h4 className="text-2xl font-black text-[var(--axo-text)] tracking-tight uppercase">MATCH POP MUTUEL !</h4>
                  <p className="text-xs text-[var(--axo-text-muted)] leading-relaxed font-normal">
                    Félicitations ! Vos alignements d'Aura mutuelle avec <strong>{latestCelebratedMatch.displayName}</strong> s'accordent à la perfection.
                  </p>
                </div>

                {/* Portraits side-by-side representing DE-ANONYMIZED view matches */}
                <div className="flex justify-center items-center gap-5 select-none relative py-2">
                  <div className="relative">
                    <img src={userPhoto} alt="My profile portrait" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--axo-border)] shadow-lg" />
                    <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded bg-[var(--axo-surface-strong)] text-[7px] font-mono border border-[var(--axo-border)] text-[var(--axo-text)]">Vous</span>
                  </div>

                  <div className="text-zinc-600 font-mono text-xs font-black animate-pulse">➕</div>

                  <div className="relative">
                    <img src={latestCelebratedMatch.avatar} alt="Matched profile portrait" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--axo-accent)] shadow-lg" />
                    <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-[7px] font-mono font-bold">Pop</span>
                  </div>
                </div>

                {/* Gamified bonus notice strictly red/black */}
                <div className="p-3 bg-[var(--axo-surface)] rounded-2xl text-[10px] text-[var(--axo-accent)] font-mono border border-[var(--axo-border)] flex items-center justify-center gap-1.5 uppercase font-bold tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-[var(--axo-accent)]" />
                  <span>Liaison coïncidente établie • Anonymat résolu !</span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      alert(`🚀 Canal de messagerie direct confidentiel débloqué !`);
                      setShowMatchCelebration(false);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[var(--axo-accent)] text-[var(--axo-on-accent)] text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md shadow-[var(--axo-shadow)]"
                  >
                    DÉMARRER LA CONVERSATION
                  </button>
                  <button 
                    onClick={() => setShowMatchCelebration(false)}
                    className="w-full py-2.5 text-[var(--axo-text-muted)] hover:text-[var(--axo-text)] text-[10px] font-black tracking-widest uppercase cursor-pointer"
                  >
                    Continuer à évaluer
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
