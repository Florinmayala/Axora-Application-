import React, { useState } from 'react';
import { ChevronLeft, Bell, Shield, Heart, Sparkles, X, Check, ArrowRight, Eye } from 'lucide-react';
import { AxoraNotification } from '../types';

interface AxoraNotificationsProps {
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: AxoraNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AxoraNotification[]>>;
  isDark: boolean;
}

export default function AxoraNotifications({
  notificationsOpen,
  setNotificationsOpen,
  notifications,
  setNotifications,
  isDark,
}: AxoraNotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'security' | 'social'>('all');
  const [selectedNotif, setSelectedNotif] = useState<AxoraNotification | null>(null);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);

  if (!notificationsOpen) return null;

  // Filter notifications based on tab
  const filteredNotifs = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'security') return notif.type === 'security';
    if (activeTab === 'social') return notif.type === 'match' || notif.type === 'pop' || notif.type === 'like' || notif.type === 'comment';
    return true;
  });

  // Mark all as read
  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifIds(allIds);
  };

  // Toggle single notification read status
  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (readNotifIds.includes(id)) {
      setReadNotifIds(prev => prev.filter(x => x !== id));
    } else {
      setReadNotifIds(prev => [...prev, id]);
    }
  };

  // Delete single notification
  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotif?.id === id) {
      setSelectedNotif(null);
    }
  };

  return (
    <div className={`absolute inset-0 z-50 overflow-y-auto flex flex-col ${
      isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#F9F9FB] text-zinc-900'
    }`}>
      {/* Header of Notifications */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'border-white/5 bg-[#141416]/95' : 'border-zinc-200 bg-white shadow-sm'
      } backdrop-blur-md sticky top-0 z-30`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotificationsOpen(false)}
            className={`p-1.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
              isDark 
                ? 'border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-100 text-zinc-650 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
            title="Retour"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#FF2D55] animate-bounce" />
            <h2 className="text-xs font-black uppercase tracking-widest font-sans">
              Centre d'Alertes
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button 
                onClick={handleMarkAllRead}
                className={`text-[9px] font-black tracking-widest font-mono uppercase py-1.5 px-2.5 rounded-full transition-all border cursor-pointer ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Tout lire
              </button>
              <button 
                onClick={() => { setNotifications([]); }}
                className="text-[9px] font-black tracking-widest font-mono uppercase bg-[#FF2D55]/10 hover:bg-[#FF2D55]/20 text-[#FF2D55] py-1.5 px-3 rounded-full transition-all border border-[#FF2D55]/20 cursor-pointer"
              >
                Vider
              </button>
            </>
          )}
        </div>
      </div>

      {/* Categories sub-tabs */}
      <div className={`flex border-b ${isDark ? 'bg-[#141416]/50 border-white/5' : 'bg-white border-zinc-200'} sticky top-[57px] z-20`}>
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 text-center ${
            activeTab === 'all' 
              ? 'border-[#FF2D55] text-[#FF2D55]' 
              : 'border-transparent text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Tout ({notifications.length})
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 text-center ${
            activeTab === 'security' 
              ? 'border-emerald-500 text-emerald-500' 
              : 'border-transparent text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Sécurité ({notifications.filter(n => n.type === 'security').length})
        </button>
        <button 
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 text-center ${
            activeTab === 'social' 
              ? 'border-red-500 text-[#FF2D55]' 
              : 'border-transparent text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Interactions ({notifications.filter(n => n.type === 'match' || n.type === 'pop' || n.type === 'like' || n.type === 'comment').length})
        </button>
      </div>

      {/* Notification List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {filteredNotifs.length > 0 ? (
          <div className="space-y-3 pb-20">
            {filteredNotifs.map(notif => {
              const isRead = readNotifIds.includes(notif.id);

              return (
                <div 
                  key={notif.id} 
                  onClick={() => {
                    setSelectedNotif(notif);
                    if (!isRead) {
                      setReadNotifIds(prev => [...prev, notif.id]);
                    }
                  }}
                  className={`p-4 rounded-[24px] transition-all border shadow-sm relative group cursor-pointer flex flex-col justify-between gap-2 text-left ${
                    notif.type === 'security' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30' 
                      : notif.type === 'match' 
                        ? 'border-[#FF2D55]/20 bg-[#FF2D55]/5 hover:border-[#FF2D55]/30'
                        : isDark
                          ? 'border-white/5 bg-[#141416]/90 hover:bg-[#1A1A1E]'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  {/* Floating unread dot */}
                  {!isRead && (
                    <div className="absolute top-4.5 right-4.5 w-2 h-2 rounded-full bg-[#FF2D55] animate-ping" />
                  )}

                  <div className="flex justify-between items-start font-bold">
                    <div className="flex items-center gap-2">
                      {notif.type === 'security' && <Shield className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {notif.type === 'match' && <Heart className="w-4 h-4 text-[#FF2D55] fill-[#FF2D55] shrink-0" />}
                      {notif.type !== 'security' && notif.type !== 'match' && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
                      
                      <span className={`${
                        isRead ? 'text-zinc-400' : isDark ? 'text-zinc-100' : 'text-zinc-800'
                      } text-xs font-black font-sans leading-tight`}>
                        {notif.title}
                      </span>
                    </div>

                    <span className="text-[9px] text-zinc-500 font-mono italic shrink-0 mr-4">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className={`text-[11.5px] font-sans pr-4 line-clamp-2 ${
                    isRead ? 'text-zinc-500' : isDark ? 'text-zinc-300' : 'text-zinc-650'
                  }`}>
                    {notif.description}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-zinc-550/5 text-[9.5px] font-mono">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Voir les détails
                    </span>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleToggleRead(notif.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isRead 
                            ? 'bg-zinc-800/10 border-transparent text-zinc-500' 
                            : 'bg-[#FF2D55]/10 border-[#FF2D55]/20 text-[#FF2D55]'
                        }`}
                        title={isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                      >
                        <Check className="w-3 h-3" />
                      </button>

                      <button 
                        onClick={(e) => handleDeleteNotif(notif.id, e)}
                        className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500 text-zinc-500 hover:text-red-500 transition-all"
                        title="Supprimer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3.5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
              isDark ? 'bg-zinc-900/50 border-white/5 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}>
              <Bell className="w-6 h-6 stroke-[1.5px]" />
            </div>
            <div className="space-y-1">
              <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
                Aucune alerte
              </h3>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed font-sans">
                Toutes les notifications correspondant à cette catégorie ont été lues ou effacées.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* EXPANDED DETAILED ALERTS MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 z-55 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-[340px] rounded-[30px] border p-6 text-left relative shadow-2xl animate-scaleUp ${
            isDark ? 'bg-[#141416] border-white/5 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <button 
              onClick={() => setSelectedNotif(null)}
              className="absolute top-4.5 right-4.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2.5 border-b border-zinc-800/40 pb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedNotif.type === 'security' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-[#FF2D55]/10 text-[#FF2D55] border border-[#FF2D55]/20'
                }`}>
                  {selectedNotif.type === 'security' ? <Shield className="w-4.5 h-4.5" /> : <Heart className="w-4.5 h-4.5 fill-current" />}
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-[#FF2D55] tracking-widest font-mono">DÉTAILS DE L'ALERTE</span>
                  <h3 className="text-xs font-black uppercase tracking-wider">{selectedNotif.title}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {selectedNotif.description}
                </p>

                <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1.5 text-[10px] font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Date & Heure :</span>
                    <span className="text-zinc-300">{selectedNotif.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>État :</span>
                    <span className="text-emerald-400">Vérifié par Axora Sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type :</span>
                    <span className="text-cyan-400 uppercase">{selectedNotif.type}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedNotif(null)}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF2D55] to-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Fermer l'alerte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
