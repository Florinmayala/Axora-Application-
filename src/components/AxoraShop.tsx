import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Video, Play, CheckCircle, Gift, CreditCard, Award, Zap, Sparkles, X, ShoppingBag } from 'lucide-react';
import { AxoraNotification } from '../types';

interface Ad {
  id: string;
  name: string;
  reward: number;
  duration: number;
  costUnit: string;
}

interface AxoraShopProps {
  shopOpen: boolean;
  setShopOpen: (open: boolean) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<AxoraNotification[]>>;
  isDark: boolean;
}

export default function AxoraShop({
  shopOpen,
  setShopOpen,
  coins,
  setCoins,
  setNotifications,
  isDark,
}: AxoraShopProps) {
  const [activeTab, setActiveTab] = useState<'earn' | 'buy' | 'redeem'>('earn');
  
  // Ad simulation states
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [adSecondsLeft, setAdSecondsLeft] = useState<number>(0);

  // Daily Chest state
  const [chestClaimed, setChestClaimed] = useState<boolean>(false);
  const [openingChest, setOpeningChest] = useState<boolean>(false);
  const [chestReward, setChestReward] = useState<number | null>(null);

  // Checkout states
  const [selectedPack, setSelectedPack] = useState<{ name: string; amount: number; price: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Redeem item state
  const [purchasedPerks, setPurchasedPerks] = useState<string[]>([]);
  const [insufficientCoinsError, setInsufficientCoinsError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeAd) return;

    const interval = setInterval(() => {
      setAdSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCoins((c) => c + activeAd.reward);

          const newNotif: AxoraNotification = {
            id: `notif-ad-${Date.now()}`,
            title: "Récompense Pub Obtenue !",
            description: `Félicitations ! Vous avez reçu +${activeAd.reward} Axora Coins pour avoir visionné la publicité "${activeAd.name}".`,
            timestamp: "À l'instant",
            type: 'match'
          };
          setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);
          setActiveAd(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAd, setCoins, setNotifications]);

  if (!shopOpen) return null;

  // Handle opening Daily Chest
  const handleOpenChest = () => {
    if (chestClaimed) return;
    setOpeningChest(true);
    setTimeout(() => {
      const reward = Math.floor(Math.random() * 41) + 10; // Random 10 to 50 coins
      setChestReward(reward);
      setCoins((c) => c + reward);
      setChestClaimed(true);
      setOpeningChest(false);

      const newNotif: AxoraNotification = {
        id: `notif-chest-${Date.now()}`,
        title: "Coffre Quotidien Réclamé !",
        description: `Incroyable ! Vous avez ouvert le coffre mystère et remporté +${reward} Axo🪙. Revenez demain pour un nouveau coffre !`,
        timestamp: "À l'instant",
        type: 'match'
      };
      setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);
    }, 2000);
  };

  // Handle simulated purchase of coins
  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setCoins((c) => c + selectedPack.amount);

      const newNotif: AxoraNotification = {
        id: `notif-buy-${Date.now()}`,
        title: "Paiement Reçu - Coins Crédités",
        description: `Merci pour votre achat ! Votre compte a été crédité de +${selectedPack.amount} Axo🪙.`,
        timestamp: "À l'instant",
        type: 'security'
      };
      setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);

      setTimeout(() => {
        setSelectedPack(null);
        setPaymentSuccess(false);
        setCardNumber('');
        setCardHolder('');
      }, 2500);
    }, 2000);
  };

  // Handle purchasing perk
  const handleRedeemPerk = (id: string, cost: number, title: string) => {
    if (coins < cost) {
      setInsufficientCoinsError(`Il vous manque ${cost - coins} Coins pour débloquer "${title}".`);
      setTimeout(() => setInsufficientCoinsError(null), 4000);
      return;
    }

    setCoins((c) => c - cost);
    setPurchasedPerks((prev) => [...prev, id]);

    const newNotif: AxoraNotification = {
      id: `notif-perk-${Date.now()}`,
      title: "Avantage Débloqué !",
      description: `Félicitations ! Vous avez échangé ${cost} Coins contre l'avantage "${title}". Cet avantage est maintenant actif sur votre compte.`,
      timestamp: "À l'instant",
      type: 'security'
    };
    setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);
  };

  return (
    <div className={`absolute inset-0 z-50 overflow-y-auto flex flex-col ${
      isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F9F9FB] text-zinc-900'
    }`}>
      {/* Header of Coin Shop */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'border-white/5 bg-[#141416]/95' : 'border-zinc-200 bg-white shadow-sm'
      } backdrop-blur-md sticky top-0 z-30`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShopOpen(false)}
            className={`p-1.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
              isDark 
                ? 'border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
            title="Fermer la boutique"
            disabled={activeAd !== null || isProcessingPayment}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-widest font-sans">
              Boutique Axora
            </h2>
          </div>
        </div>

        {/* Gold coin count indicator */}
        <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono font-bold text-xs ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/35 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
            : 'bg-amber-50 border-amber-500/30 text-amber-700'
        }`}>
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{coins} Coins</span>
        </div>
      </div>

      {/* Main Container */}
      {activeAd ? (
        /* Simulated Ad Player screen */
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black text-white relative select-none">
          <div className="w-full max-w-md aspect-video rounded-3xl bg-zinc-950 border border-white/5 flex flex-col justify-between p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2D55]/10 via-[#7F1D1D]/5 to-amber-500/10 animate-pulse pointer-events-none" />
            
            <div className="flex justify-between items-center z-10">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-zinc-300 flex items-center gap-1 font-sans">
                <Video className="w-2.5 h-2.5 text-[#FF2D55]" /> SPONSOR LIVE
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/5">
                {adSecondsLeft > 0 ? `${adSecondsLeft}s restantes` : 'Terminé !'}
              </span>
            </div>

            <div className="my-auto text-center space-y-4 z-10 flex flex-col items-center">
              {adSecondsLeft > 0 ? (
                <>
                  <div className="relative w-14 h-14 rounded-full bg-[#FF2D55]/10 flex items-center justify-center border border-[#FF2D55]/20 animate-bounce">
                    <Play className="w-6 h-6 text-[#FF2D55] fill-[#FF2D55] pl-0.5" />
                    <div className="absolute inset-0 rounded-full border border-[#FF2D55]/40 animate-ping" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF2D55] font-sans">
                      {activeAd.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto animate-pulse font-sans">
                      {adSecondsLeft > 18 ? "Téléchargement du contenu partenaire..." :
                       adSecondsLeft > 10 ? "Chargement des visuels sponsorisés..." :
                       adSecondsLeft > 5 ? "Découvrez de nouvelles opportunités..." :
                       "Finalisation du crédit bonus..."}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 scale-110 duration-500 transition-all">
                    <CheckCircle className="w-7 h-7 text-emerald-400 fill-transparent" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400 font-sans">
                      FÉLICITATIONS !
                    </h4>
                    <p className="text-[11px] text-zinc-350 font-sans">
                      La publicité vidéo a été visionnée complètement.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden z-10 border border-white/5">
              <div 
                className="bg-gradient-to-r from-[#FF2D55] to-amber-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((activeAd.duration - adSecondsLeft) / activeAd.duration) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mt-6 text-center max-w-xs leading-relaxed font-sans">
            Le crédit de récompense de <span className="text-[#FF2D55] font-bold">+{activeAd.reward} Coins</span> se fait instantanément à la fin du visionnage.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Internal sub-tab switcher */}
          <div className={`flex border-b ${isDark ? 'bg-[#141416]/50 border-white/5' : 'bg-white border-zinc-200'} sticky top-[57px] z-20`}>
            <button 
              onClick={() => setActiveTab('earn')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'earn' 
                  ? 'border-[#FF2D55] text-[#FF2D55]' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-450'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Gratuit</span>
            </button>
            <button 
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'buy' 
                  ? 'border-[#FF2D55] text-[#FF2D55]' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-450'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Acheter</span>
            </button>
            <button 
              onClick={() => setActiveTab('redeem')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'redeem' 
                  ? 'border-[#FF2D55] text-[#FF2D55]' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-450'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Avantages</span>
            </button>
          </div>

          <div className="p-4 space-y-6 max-w-2xl mx-auto w-full pb-20">
            {/* TAB 1: EARN FREE COINS */}
            {activeTab === 'earn' && (
              <div className="space-y-6">
                {/* Daily Reward Chest Card */}
                <div className={`p-5 rounded-3xl border ${
                  isDark ? 'bg-zinc-900/60 border-amber-500/20' : 'bg-amber-50/40 border-amber-500/25'
                } flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 bg-amber-500/10 text-amber-400 font-black uppercase text-[7.5px] px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    1 par Jour
                  </div>

                  {chestReward ? (
                    <div className="animate-bounce flex flex-col items-center space-y-2 py-4">
                      <span className="text-4xl">🎉</span>
                      <h3 className="text-sm font-black text-amber-500">+{chestReward} COINS REÇUS !</h3>
                      <p className="text-[11px] text-zinc-400 font-sans">Crédités sur votre compte avec succès.</p>
                    </div>
                  ) : (
                    <>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                        openingChest ? 'animate-spin scale-110' : chestClaimed ? 'opacity-50 grayscale' : 'hover:scale-110 cursor-pointer animate-pulse'
                      }`}>
                        🎁
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-wider font-sans">
                          {chestClaimed ? 'Coffre Quotidien Réclamé' : 'Coffre Mystère Quotidien'}
                        </h3>
                        <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                          {chestClaimed 
                            ? 'Revenez dans 24h pour récupérer votre prochain bonus gratuit.' 
                            : 'Ouvrez le coffre magique pour obtenir instantanément entre +10 et +50 Coins.'}
                        </p>
                      </div>

                      <button
                        onClick={handleOpenChest}
                        disabled={chestClaimed || openingChest}
                        className={`w-full py-2.5 rounded-xl font-black font-sans uppercase tracking-widest text-xs transition-all ${
                          chestClaimed 
                            ? 'bg-zinc-800 border border-zinc-750 text-zinc-550 cursor-not-allowed'
                            : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-black hover:opacity-95 shadow-[0_4px_12px_rgba(245,158,11,0.2)] active:scale-95 cursor-pointer'
                        }`}
                      >
                        {openingChest ? 'Ouverture...' : chestClaimed ? 'Réclamé ✓' : 'Ouvrir le Coffre 🔥'}
                      </button>
                    </>
                  )}
                </div>

                {/* Ads items lists */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black tracking-widest text-zinc-500 uppercase font-mono">COURTES PUBLICITÉS VIDÉO</h4>
                  
                  {[
                    { id: 'ad-express', name: 'Sponsor Express', reward: 15, duration: 10, costUnit: '10 secondes' },
                    { id: 'ad-premium', name: 'Axora Plus Cliq', reward: 35, duration: 15, costUnit: '15 secondes' },
                    { id: 'ad-exclusive', name: 'Souveraineté Digitale debate', reward: 60, duration: 25, costUnit: '25 secondes' }
                  ].map(ad => (
                    <div 
                      key={ad.id}
                      className={`p-4 rounded-2xl transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isDark 
                          ? 'bg-[#141416] border-white/5 hover:border-white/10 hover:bg-[#1A1A1E]' 
                          : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-extrabold uppercase tracking-wide ${isDark ? 'text-zinc-100' : 'text-zinc-800'} font-sans`}>
                            {ad.name}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 bg-zinc-500/5 px-2 py-0.5 rounded-full border border-zinc-500/10">
                            {ad.costUnit}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans">
                          Soutenez la liberté d'expression en regardant un court message partenaire.
                        </p>
                      </div>

                      <button 
                        onClick={() => {
                          setActiveAd(ad);
                          setAdSecondsLeft(ad.duration);
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-black tracking-widest font-mono uppercase bg-[#FF2D55] text-white hover:bg-[#FF2D55]/90 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,45,85,0.2)] shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>+{ad.reward} 🪙</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: BUY PREMIUM COIN PACKS */}
            {activeTab === 'buy' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-50 border-zinc-200'} text-xs text-zinc-400 text-center leading-normal mb-2`}>
                  💳 Simulez un rechargement instantané de votre solde de coins. Aucune carte réelle n'est requise.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'pack-starter', name: 'Pack Starter', amount: 150, price: '1.99€', color: 'from-amber-600 to-amber-500', icon: '🪙' },
                    { id: 'pack-booster', name: 'Pack Booster', amount: 500, price: '4.99€', color: 'from-purple-600 to-[#FF2D55]', icon: '⚡' },
                    { id: 'pack-sovereign', name: 'Sovereign VIP', amount: 1500, price: '11.99€', color: 'from-emerald-600 to-teal-500', icon: '👑', highlight: true }
                  ].map(pack => (
                    <div 
                      key={pack.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all relative ${
                        pack.highlight 
                          ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]' 
                          : isDark ? 'bg-[#141416] border-white/5 hover:border-white/10' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                      }`}
                    >
                      {pack.highlight && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[7.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono select-none">
                          LE PLUS POPULAIRE
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">{pack.icon}</span>
                          <span className={`text-[9px] font-mono uppercase font-black tracking-wider px-2 py-0.5 rounded ${
                            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100 border border-zinc-150'
                          }`}>{pack.price}</span>
                        </div>
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                          {pack.name}
                        </h4>
                        <div className="text-xl font-extrabold flex items-center gap-1 text-amber-500">
                          <span>+{pack.amount}</span>
                          <span className="text-xs text-zinc-400 font-black">Axo🪙</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPack(pack)}
                        className={`w-full py-2 bg-gradient-to-r ${pack.color} text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:opacity-95 text-center`}
                      >
                        Recharger
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SPEND COINS ON EXCLUSIVE BENEFITS */}
            {activeTab === 'redeem' && (
              <div className="space-y-5">
                {insufficientCoinsError && (
                  <div className="p-3 bg-red-600/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-500 text-center animate-pulse">
                    ⚠️ {insufficientCoinsError}
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs font-black tracking-widest text-zinc-500 uppercase font-mono">AVANTAGES DISPONIBLES</h4>
                  
                  {[
                    { 
                      id: 'perk-verified', 
                      title: 'Badge Certifié Émeraude', 
                      desc: 'Affichez un insigne "Certifié" vert émeraude exclusif à côté de votre nom sur vos publications.', 
                      cost: 300, 
                      icon: <Award className="w-5 h-5 text-emerald-400" /> 
                    },
                    { 
                      id: 'perk-boost', 
                      title: 'Boost d\'Aura (+20% aura)', 
                      desc: 'Améliorez votre jauge de synergie globale pour déverrouiller plus de contenus privés de story.', 
                      cost: 100, 
                      icon: <Zap className="w-5 h-5 text-cyan-400" /> 
                    },
                    { 
                      id: 'perk-spark', 
                      title: 'Effets de Publication Spark', 
                      desc: 'Faites briller vos publications avec un contour brillant et des étincelles décoratives animées.', 
                      cost: 150, 
                      icon: <Sparkles className="w-5 h-5 text-amber-400" /> 
                    }
                  ].map(perk => {
                    const isOwned = purchasedPerks.includes(perk.id);

                    return (
                      <div 
                        key={perk.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                          isOwned 
                            ? 'border-emerald-500/30 bg-emerald-500/5' 
                            : isDark ? 'bg-[#141416] border-white/5' : 'bg-white border-zinc-200'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100 border border-zinc-150'
                          }`}>
                            {perk.icon}
                          </div>
                          <div className="space-y-0.5 text-left">
                            <span className={`text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                              <span>{perk.title}</span>
                              {isOwned && <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase px-2 py-0.5 rounded">ACTIF</span>}
                            </span>
                            <p className="text-[11px] text-zinc-400 leading-normal">
                              {perk.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRedeemPerk(perk.id, perk.cost, perk.title)}
                          disabled={isOwned}
                          className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all shrink-0 ${
                            isOwned 
                              ? 'bg-zinc-800 border border-zinc-750 text-zinc-550 cursor-not-allowed'
                              : 'bg-amber-500 hover:bg-amber-600 text-black active:scale-95 cursor-pointer'
                          }`}
                        >
                          {isOwned ? 'Acquis ✓' : `${perk.cost} 🪙`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED CHECKOUT MODAL DRAWER OVERLAY */}
      {selectedPack && (
        <div className="fixed inset-0 z-55 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-[360px] rounded-[30px] border p-6 text-left relative shadow-2xl animate-scaleUp ${
            isDark ? 'bg-[#141416] border-white/5 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <button 
              onClick={() => setSelectedPack(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
              disabled={isProcessingPayment}
            >
              <X className="w-4 h-4" />
            </button>

            {paymentSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-emerald-400 tracking-wider">Achat Réussi !</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">+{selectedPack.amount} Coins ont été ajoutés à votre solde.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompletePayment} className="space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="text-[8px] font-black uppercase text-[#FF2D55] tracking-widest font-mono">PAIEMENT DE COINS SÉCURISÉ</span>
                  <h3 className="text-xs font-black uppercase tracking-wider mt-0.5">Saisir les Informations</h3>
                </div>

                <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between text-xs font-bold font-mono">
                  <span className="text-zinc-400">Paiement pour : {selectedPack.name}</span>
                  <span className="text-amber-400">{selectedPack.price}</span>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest font-mono">Numéro de Carte Simulé</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        placeholder="4000 1234 5678 9010" 
                        className="w-full text-xs p-3 bg-black/60 border border-zinc-800 focus:border-[#FF2D55] rounded-xl text-white font-mono outline-none"
                      />
                      <CreditCard className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest font-mono">Expiration</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/AA" 
                        maxLength={5}
                        className="w-full text-xs p-3 bg-black/60 border border-zinc-800 focus:border-[#FF2D55] rounded-xl text-white font-mono text-center outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest font-mono">CVC</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        placeholder="•••" 
                        className="w-full text-xs p-3 bg-black/60 border border-zinc-800 focus:border-[#FF2D55] rounded-xl text-white font-mono text-center outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-zinc-500 uppercase tracking-widest font-mono">Titulaire</label>
                    <input 
                      type="text" 
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Axorien Passionné" 
                      className="w-full text-xs p-3 bg-black/60 border border-zinc-800 focus:border-[#FF2D55] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3 bg-gradient-to-r from-[#FF2D55] to-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(255,45,85,0.25)]"
                >
                  {isProcessingPayment ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <span>Confirmer le Rechargement 🚀</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
