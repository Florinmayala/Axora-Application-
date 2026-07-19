import React, { useState } from 'react';
import { Send, MapPin } from 'lucide-react';
import { Story, AxoraNotification } from '../types';

interface StoryCreatorModalProps {
  showCreateStoryModal: boolean;
  setShowCreateStoryModal: (open: boolean) => void;
  currentUserAvatar: string;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<AxoraNotification[]>>;
  setActiveStory: (story: Story | null) => void;
}

export default function StoryCreatorModal({
  showCreateStoryModal,
  setShowCreateStoryModal,
  currentUserAvatar,
  setStories,
  setCoins,
  setNotifications,
  setActiveStory,
}: StoryCreatorModalProps) {
  // Localized story builder states
  const [storyCaption, setStoryCaption] = useState<string>('');
  const [storyFilter, setStoryFilter] = useState<string>('normal');
  const [storyFont, setStoryFont] = useState<string>('font-sans');
  const [captionColor, setCaptionColor] = useState<string>('#FFFFFF');
  const [storyActiveStickers, setStoryActiveStickers] = useState<any[]>([]);
  const [storyAuraLevel, setStoryAuraLevel] = useState<number>(85);
  const [storyIsPrivate, setStoryIsPrivate] = useState<boolean>(false);
  const [linkPopSession, setLinkPopSession] = useState<boolean>(true);

  // Brush drawing states
  const [brushModeActive, setBrushModeActive] = useState<boolean>(false);
  const [brushDrawings, setBrushDrawings] = useState<Array<{ x: number; y: number; color: string }>>([]);
  const [brushColor, setBrushColor] = useState<string>('#FF2D55');

  // Overlay navigation drawers inside story composer
  const [showGalleryPicker, setShowGalleryPicker] = useState<boolean>(false);
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  // Template custom backgrounds configuration
  const [selectedTemplate, setSelectedTemplate] = useState<'text-only' | 'gallery' | 'custom'>('text-only');
  const [selectedGradient, setSelectedGradient] = useState<'gradient-sunset' | 'gradient-cosmic' | 'gradient-emerald' | 'gradient-slate'>('gradient-sunset');
  const [selectedGalleryMedia, setSelectedGalleryMedia] = useState<any>(null);
  const [customMediaUrl, setCustomMediaUrl] = useState<string>('');

  // Interactive editing micro-states
  const [isEditingCaption, setIsEditingCaption] = useState<boolean>(false);
  const [textBackgroundOn, setTextBackgroundOn] = useState<boolean>(true);

  // Specific sticker creators
  const [pollStickerQuestion, setPollStickerQuestion] = useState<string>('');
  const [pollStickerYes, setPollStickerYes] = useState<string>('Oui');
  const [pollStickerNo, setPollStickerNo] = useState<string>('Non');
  const [musicStickerTitle, setMusicStickerTitle] = useState<string>('');
  const [musicStickerArtist, setMusicStickerArtist] = useState<string>('Axora Track');
  const [locationStickerName, setLocationStickerName] = useState<string>('');

  if (!showCreateStoryModal) return null;

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

  return (
    <div id="story-creator-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/95 backdrop-blur-xl select-none">
      <div className="w-full max-w-[420px] bg-[#0c0c0e] border border-zinc-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[94vh] max-h-[840px] text-white font-sans relative p-4 ring-1 ring-white/10">
        
        {/* COMPOSER NAVBAR */}
        <div className="flex justify-between items-center z-30 pt-1 pb-3 border-b border-zinc-900/50">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase text-[#FF2D55] tracking-widest font-mono">STORY BUILDER</span>
            <span className="text-[7.5px] text-zinc-400 font-sans">Éditeur Mobile Axora</span>
          </div>

          {/* FLOATING CREATIVE ACTIONS */}
          <div className="flex items-center gap-1.5">
            {/* Photo presets selector */}
            <button 
              onClick={() => {
                setShowGalleryPicker(true);
                setShowStickerPicker(false);
                setShowSettingsDrawer(false);
              }}
              title="Changer de photo"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 cursor-pointer text-xs transition-all active:scale-90"
            >
              🖼️
            </button>

            {/* Draw brush toggle */}
            <button 
              onClick={() => {
                setBrushModeActive(!brushModeActive);
                setShowStickerPicker(false);
                setShowGalleryPicker(false);
                setShowSettingsDrawer(false);
              }}
              title="Pinceaux néon/dessin"
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-white cursor-pointer text-xs transition-all active:scale-95 ${
                brushModeActive ? 'bg-amber-500 border-amber-500 scale-105 shadow-md shadow-amber-500/25' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              🖌️
            </button>

            {/* Stickers trigger */}
            <button 
              onClick={() => {
                setShowStickerPicker(!showStickerPicker);
                setShowGalleryPicker(false);
                setShowSettingsDrawer(false);
              }}
              title="Ajouter widget sticker"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 cursor-pointer text-xs transition-all active:scale-90"
            >
              ☺
            </button>

            {/* Text trigger (Aa) */}
            <button 
              onClick={() => setIsEditingCaption(true)}
              title="Modifier la légende"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 cursor-pointer font-black text-[11px] transition-all id-story-caption-edit active:scale-90"
            >
              Aa
            </button>
          </div>
        </div>

        {/* MAIN COMPOSER WORKSPACE */}
        <div className="flex-1 flex flex-col justify-between relative overflow-hidden pt-3">
          
          {/* CENTRAL ASPECT-RATIO CORE CANVAS FRAME */}
          <div 
            id="phone-preview-container"
            onClick={(e) => {
              if (brushModeActive) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setBrushDrawings(prev => [...prev, { x, y, color: brushColor }]);
              }
            }}
            className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-950 flex flex-col justify-between border border-zinc-900/60 group aspect-[9/16] shadow-xl"
          >
            
            {/* 1. Dynamic Background selection rendering */}
            {selectedTemplate === 'text-only' ? (
              <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 ${
                selectedGradient === 'gradient-sunset' ? 'bg-gradient-to-tr from-[#FF2D55] via-[#FF5E3A] to-[#FF9500]' :
                selectedGradient === 'gradient-cosmic' ? 'bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0]' :
                selectedGradient === 'gradient-emerald' ? 'bg-gradient-to-tr from-[#11998e] to-[#38ef7d]' :
                'bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364]'
              }`} />
            ) : (
              <img 
                src={selectedGalleryMedia ? selectedGalleryMedia.url : 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&q=80'} 
                alt="Composer resource" 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 pointer-events-none"
                style={{
                  filter: 
                    storyFilter === 'clarendon' ? 'contrast(1.2) saturate(1.35) hue-rotate(5deg) brightness(1.05)' :
                    storyFilter === 'lark' ? 'saturate(0.85) brightness(1.15) contrast(0.95) sepia(0.08)' :
                    storyFilter === 'juno' ? 'hue-rotate(-10deg) saturate(1.4) contrast(1.1)' :
                    storyFilter === 'ludwig' ? 'sepia(0.15) contrast(1.15) brightness(0.95)' :
                    storyFilter === 'crema' ? 'sepia(0.4) saturate(0.9) brightness(1.05) contrast(0.9)' :
                    storyFilter === 'cyber' ? 'hue-rotate-[320deg] saturate(150) contrast-110' :
                    storyFilter === 'neomint' ? 'hue-rotate-[90deg] brightness-110 saturate-125' :
                    storyFilter === 'noir' ? 'grayscale contrast-125' :
                    storyFilter === 'amber' ? 'sepia brightness-90 contrast-110' :
                    'none'
                }}
              />
            )}

            {/* Aesthetic shadow gradient filter */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none z-10" />

            {/* Progress bar line indicator */}
            <div className="absolute top-2 left-3 right-3 flex gap-1 z-30">
              <div className="h-0.5 bg-[#FF2D55] w-2/3 rounded-full shadow-sm" />
              <div className="h-0.5 bg-zinc-800 w-1/3 rounded-full" />
            </div>

            {/* Top Poster User ID Details */}
            <div className="z-20 p-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <img 
                  src={currentUserAvatar} 
                  alt="My avatar" 
                  className="w-7 h-7 rounded-full border border-red-500 shadow-md object-cover bg-zinc-900" 
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-white leading-none">@Vous</span>
                  <span className="text-[7px] text-zinc-355 font-bold uppercase tracking-wider font-sans">Aura Composer v2</span>
                </div>
              </div>
              <span className="p-1 rounded-full bg-black/50 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
              </span>
            </div>

            {/* Rendered Freehand drawings brush layers */}
            {brushDrawings.length > 0 && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {brushDrawings.map((draw, dIdx) => (
                  <div 
                    key={dIdx}
                    className="absolute w-2 h-2 rounded-full select-none"
                    style={{
                      left: `${draw.x}%`, 
                      top: `${draw.y}%`, 
                      backgroundColor: draw.color,
                      boxShadow: `0 0 8px ${draw.color}`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Active Caption Text container overlay (Tap on caption to edit) */}
            <div className="z-20 my-auto text-center px-4 w-full select-none relative pointer-events-auto">
              {storyCaption ? (
                <div 
                  onClick={() => setIsEditingCaption(true)}
                  className="inline-block transform transition-transform hover:scale-102 cursor-pointer animate-fadeIn"
                >
                  <p 
                    className={`text-xs px-3 py-2 rounded-xl border leading-relaxed break-words shadow-2xl max-w-[220px] mx-auto text-center ${storyFont} ${
                      textBackgroundOn 
                        ? 'bg-black/75 backdrop-blur-md border-white/10' 
                        : 'bg-transparent border-transparent'
                    }`}
                    style={{ color: captionColor }}
                  >
                    {storyCaption}
                  </p>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingCaption(true)}
                  className="cursor-pointer bg-black/40 backdrop-blur-sm border border-white/5 py-2.5 px-4 rounded-xl max-w-[180px] mx-auto transition-all hover:bg-black/60"
                >
                  <p className="text-[9.5px] text-white/50 font-mono italic">
                    ✍️ Appuyez pour ajouter une légende...
                  </p>
                </div>
              )}
            </div>

            {/* Placed Interactive Stickers loop rendering inside simulated preview */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {storyActiveStickers.map((sticker, sIdx) => (
                <div 
                  key={sIdx} 
                  className="absolute shadow-2xl transform scale-90 pointer-events-auto select-none group/sticker"
                  style={{ left: `${sticker.x}%`, top: `${sticker.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setStoryActiveStickers(prev => prev.filter((_, idx) => idx !== sIdx));
                    }}
                    className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-[#FF2D55] hover:bg-red-500 text-white text-[8px] flex items-center justify-center border border-white/20 shadow-lg opacity-100 z-30 cursor-pointer"
                  >
                    ✕
                  </button>

                  {sticker.type === 'poll' && (
                    <div className="bg-white text-zinc-900 p-2.5 rounded-2xl w-40 border border-zinc-100/30">
                      <h6 className="text-[8px] font-black uppercase text-center text-red-500 tracking-widest mb-1 font-mono">SONDAGE</h6>
                      <p className="text-[10.5px] font-extrabold text-zinc-950 text-center mb-1.5 truncate">{sticker.textVal || 'Stylé ? 🔥'}</p>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <span className="py-1 px-1 text-center bg-red-50 text-red-650 font-black rounded-lg">
                          {sticker.extra1 || 'Oui'}
                        </span>
                        <span className="py-1 px-1 bg-zinc-150 text-zinc-800 font-black rounded-lg text-center">
                          {sticker.extra2 || 'Non'}
                        </span>
                      </div>
                    </div>
                  )}

                  {sticker.type === 'location' && (
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[9.5px] font-extrabold border border-white/15 shadow-lg">
                      <MapPin className="w-3 h-3 text-white" />
                      <span className="truncate max-w-[100px]">{sticker.textVal || 'Paris'}</span>
                    </div>
                  )}

                  {sticker.type === 'music' && (
                    <div className="bg-black/90 text-white p-1.5 rounded-xl flex items-center gap-2 text-[9px] font-bold border border-white/10 max-w-[150px] shadow-lg">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center animate-spin text-[8px]">
                        💿
                      </div>
                      <div className="flex flex-col text-left truncate">
                        <span className="text-[9px] font-black leading-none truncate">{sticker.textVal || 'Lofi Chill'}</span>
                        <span className="text-[7.5px] text-zinc-400 mt-0.5 truncate">{sticker.extra1 || 'Axora'}</span>
                      </div>
                    </div>
                  )}

                  {sticker.type === 'time' && (
                    <div className="bg-white/25 backdrop-blur-md text-white border border-white/20 px-2.5 py-0.5 rounded-xl font-mono text-[9.5px] font-bold">
                      🕒 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}

                  {sticker.type === 'aura' && (
                    <div className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-black px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md">
                      ⚡ {storyAuraLevel}% Aura
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Brush painting settings box */}
            {brushModeActive && (
              <div className="absolute top-14 left-3 right-3 z-35 bg-black/85 backdrop-blur-md rounded-2xl border border-amber-500/25 p-2 flex items-center justify-between text-[9px]">
                <span className="text-amber-500 font-bold uppercase tracking-wide">🎨 Peindre :</span>
                <div className="flex gap-1.5 items-center">
                  {['#FF2D55', '#22D3EE', '#FBBF24', '#FFFFFF'].map(c => (
                    <button
                      key={c}
                      onClick={() => setBrushColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-3.5 h-3.5 rounded-full border border-zinc-705 cursor-pointer ${
                        brushColor === c ? 'ring-2 ring-amber-500' : ''
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setBrushDrawings([])}
                  className="bg-zinc-800 text-[7.5px] px-1.5 py-0.5 rounded text-zinc-400 hover:text-white cursor-pointer"
                >
                  Effacer
                </button>
              </div>
            )}

            {/* Bottom Canvas Info elements */}
            <div className="z-20 p-3 mt-auto space-y-1">
              <div className="flex gap-1 flex-wrap">
                {linkPopSession && (
                  <span className="text-[6.5px] font-black uppercase font-mono bg-red-650 text-white px-1 py-0.5 rounded">
                    🔥 POP LIVE LINKED
                  </span>
                )}
                <span className="text-[6.5px] font-black uppercase font-mono bg-cyan-500 text-black px-1.5 py-0.5 rounded">
                  Synergie: {storyAuraLevel}%
                </span>
                {storyIsPrivate && (
                  <span className="text-[6.5px] font-black uppercase font-mono bg-yellow-500 text-black px-1.5 py-0.5 rounded">
                    ⭐ AMIS PROCHES
                  </span>
                )}
              </div>
              <div className="text-[8px] text-zinc-400 text-center font-mono">
                {brushModeActive ? '🖌️ Tapez sur l\'écran pour peindre' : '📱 Appuyez sur la légende pour modifier'}
              </div>
            </div>

            {/* 1. TEXT EDITOR COMPRESS OVERLAY IN-PHONE */}
            {isEditingCaption && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col justify-between p-5 text-white animate-fadeIn">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                  <span className="text-[9px] font-black uppercase text-[#FF2D55] tracking-widest font-mono">Légende de Story</span>
                  <button 
                    onClick={() => setIsEditingCaption(false)} 
                    className="py-1 px-3 bg-[#FF2D55] text-white text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    Valider ✓
                  </button>
                </div>

                <div className="my-auto space-y-4">
                  <textarea
                    rows={3}
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    placeholder="Tapez votre légende de story..."
                    className="w-full text-xs p-3 bg-zinc-900 border border-zinc-800 focus:border-[#FF2D55] outline-none rounded-xl text-center resize-none leading-relaxed placeholder-zinc-650 text-white"
                  />

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1 justify-center select-none">
                      {[
                        { id: 'font-sans', name: 'Integra' },
                        { id: 'font-mono', name: 'Console' },
                        { id: 'font-serif', name: 'Editorial' },
                        { id: 'font-sans font-black uppercase tracking-wider', name: 'Headline' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setStoryFont(f.id)}
                          className={`px-2 py-0.5 text-[8px] font-black rounded-md border transition-all cursor-pointer ${
                            storyFont === f.id ? 'bg-white text-black border-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 justify-center items-center">
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Encre :</span>
                      {['#FFFFFF', '#FF2D55', '#22D3EE', '#FBBF24', '#38ef7d'].map(colorVal => (
                        <button 
                          key={colorVal}
                          onClick={() => setCaptionColor(colorVal)} 
                          style={{ backgroundColor: colorVal }}
                          className={`w-4.5 h-4.5 rounded-full border cursor-pointer border-zinc-800 ${
                            captionColor === colorVal ? 'ring-2 ring-red-500 scale-105' : 'opacity-80'
                          }`} 
                        />
                      ))}
                    </div>

                    <button 
                      onClick={() => setTextBackgroundOn(!textBackgroundOn)}
                      className={`w-full text-[8px] py-1 rounded uppercase font-black font-mono tracking-wider border cursor-pointer ${
                        textBackgroundOn ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent text-zinc-550 border-zinc-900'
                      }`}
                    >
                      Highlight : {textBackgroundOn ? 'Activé (Glow)' : 'Désactivé'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => { setStoryCaption(''); setIsEditingCaption(false); }}
                  className="w-full py-1 text-[9px] text-red-500/80 hover:text-red-500 font-mono uppercase underline select-none cursor-pointer"
                >
                  Effacer le texte
                </button>
              </div>
            )}

            {/* 2. STICKER PICKER OVERLAY IN-PHONE */}
            {showStickerPicker && (
              <div className="absolute inset-x-0 bottom-0 max-h-[85%] bg-zinc-950/98 border-t border-zinc-850 rounded-t-[28px] p-4 z-40 space-y-3.5 shadow-2xl overflow-y-auto text-white">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                  <span className="text-[9px] font-black uppercase text-[#FF2D55] tracking-widest font-mono">☺ Boîte à Stickers</span>
                  <button onClick={() => setShowStickerPicker(false)} className="text-zinc-500 hover:text-white p-1 text-xs cursor-pointer">✕</button>
                </div>

                <div className="space-y-3 text-left">
                  <div className="p-2.5 bg-zinc-900/40 rounded-xl space-y-1.5 border border-zinc-900">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest font-mono">📊 Créer un Sondage</span>
                    <input 
                      type="text" 
                      value={pollStickerQuestion} 
                      onChange={(e) => setPollStickerQuestion(e.target.value)}
                      placeholder="Ta question..." 
                      className="w-full text-[10px] p-1.5 bg-black border border-zinc-850 rounded outline-none text-white focus:border-indigo-500 font-sans"
                    />
                    <button 
                      onClick={() => {
                        setStoryActiveStickers(prev => [...prev, { 
                          type: 'poll', x: 50, y: 65, textVal: pollStickerQuestion, extra1: pollStickerYes, extra2: pollStickerNo 
                        }]);
                        setShowStickerPicker(false);
                      }}
                      className="w-full py-1 bg-indigo-600 text-[8px] font-black uppercase rounded-lg text-white cursor-pointer font-mono"
                    >
                      Placer le Sondage
                    </button>
                  </div>

                  <div className="p-2.5 bg-zinc-900/40 rounded-xl space-y-1.5 border border-zinc-900">
                    <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest font-mono">🎵 Tag de Musique</span>
                    <input 
                      type="text" 
                      value={musicStickerTitle} 
                      onChange={(e) => setMusicStickerTitle(e.target.value)}
                      placeholder="Musique..." 
                      className="w-full text-[10px] p-1.5 bg-black border border-zinc-850 rounded outline-none text-white focus:border-pink-500 font-sans"
                    />
                    <button 
                      onClick={() => {
                        setStoryActiveStickers(prev => [...prev, { type: 'music', x: 50, y: 45, textVal: musicStickerTitle, extra1: musicStickerArtist }]);
                        setShowStickerPicker(false);
                      }}
                      className="w-full py-1 bg-pink-600 text-[8px] font-black uppercase rounded-lg text-white cursor-pointer font-mono"
                    >
                      Associer Musique
                    </button>
                  </div>

                  <div className="p-2.5 bg-zinc-900/40 rounded-xl space-y-1.5 border border-zinc-900">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest font-mono">📍 Tag de Lieu</span>
                    <input 
                      type="text" 
                      value={locationStickerName} 
                      onChange={(e) => setLocationStickerName(e.target.value)}
                      placeholder="Paris, France..." 
                      className="w-full text-[10px] p-1.5 bg-black border border-zinc-850 rounded outline-none text-white focus:border-blue-500 font-sans"
                    />
                    <button 
                      onClick={() => {
                        setStoryActiveStickers(prev => [...prev, { type: 'location', x: 50, y: 30, textVal: locationStickerName }]);
                        setShowStickerPicker(false);
                      }}
                      className="w-full py-1 bg-blue-600 text-[8px] font-black uppercase rounded-lg text-white cursor-pointer font-mono"
                    >
                      Placer le Lieu
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setStoryActiveStickers(prev => [...prev, { type: 'aura', x: 50, y: 15 }]);
                      setShowStickerPicker(false);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-black text-[9px] font-black uppercase rounded-lg text-center cursor-pointer font-mono"
                  >
                    ⚡ Placer Mon Badge d'Aura
                  </button>
                </div>
              </div>
            )}

            {/* 3. GALLERY SELECTOR DRAWER IN-PHONE */}
            {showGalleryPicker && (
              <div className="absolute inset-x-0 bottom-0 max-h-[85%] bg-zinc-950/98 border-t border-zinc-850 rounded-t-[28px] p-4.5 z-40 space-y-3 shadow-2xl overflow-y-auto text-white">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest font-sans">Sélecteur de Cliché</span>
                  <button onClick={() => setShowGalleryPicker(false)} className="text-zinc-500 hover:text-white p-1 cursor-pointer">✕</button>
                </div>

                <div className="space-y-3">
                  <div 
                    onClick={() => document.getElementById('internal-story-upload-real')?.click()}
                    className="border border-dashed border-zinc-800 hover:border-[#FF2D55] p-3 rounded-xl bg-black/50 text-center cursor-pointer transition-all space-y-1"
                  >
                    <input 
                      type="file" 
                      id="internal-story-upload-real" 
                      accept="image/*,video/*"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const objectUrl = URL.createObjectURL(file);
                          setSelectedGalleryMedia({
                            id: `custom-${Date.now()}`,
                            type: file.type.startsWith('video') ? 'video' : 'photo',
                            url: objectUrl,
                            description: file.name
                          });
                          setSelectedTemplate('custom');
                          setShowGalleryPicker(false);
                        }
                      }}
                    />
                    <div className="text-sm">📂</div>
                    <p className="text-[9px] font-black text-zinc-300 uppercase tracking-wider font-sans animate-pulse">Importer mon Fichier</p>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedTemplate('text-only');
                      setShowGalleryPicker(false);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#FF2D55] via-[#FF5E3A] to-amber-500 rounded-xl text-[9px] font-black uppercase tracking-wider text-white cursor-pointer font-mono"
                  >
                    ✍️ Mode Écrit (Fond dégradé)
                  </button>

                  <div className="grid grid-cols-3 gap-1.5 pt-1 select-none">
                    {[
                      { id: 'g1', type: 'photo', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=500&q=80' },
                      { id: 'g2', type: 'photo', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80' },
                      { id: 'g3', type: 'photo', url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=500&q=80' },
                      { id: 'g4', type: 'photo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
                      { id: 'g5', type: 'photo', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80' },
                      { id: 'g6', type: 'photo', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80' }
                    ].map(m => (
                      <div 
                        key={m.id}
                        onClick={() => {
                          setSelectedGalleryMedia(m);
                          setSelectedTemplate('gallery');
                          setShowGalleryPicker(false);
                        }}
                        className={`aspect-square relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedGalleryMedia?.id === m.id ? 'border-red-500 scale-95 shadow-md' : 'border-transparent'
                        }`}
                      >
                        <img src={m.url} alt="Preset preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SETTINGS DRAWER OVERLAY IN-PHONE */}
            {showSettingsDrawer && (
              <div className="absolute inset-x-0 bottom-0 bg-zinc-950/98 border-t border-zinc-850 rounded-t-[28px] p-4.5 z-40 space-y-4 shadow-2xl text-white text-left">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 font-sans">
                  <span className="text-[9px] font-black text-zinc-400 tracking-widest font-mono uppercase">Audience & Sécurité</span>
                  <button onClick={() => setShowSettingsDrawer(false)} className="text-zinc-500 hover:text-white p-1 cursor-pointer">✕</button>
                </div>

                <div className="space-y-1.5 font-sans">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Confidentialité</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setStoryIsPrivate(false)}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase text-center border transition-all cursor-pointer ${
                        !storyIsPrivate ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-zinc-800 bg-zinc-90 w-full text-zinc-400'
                      }`}
                    >
                      🌍 Story Public
                    </button>
                    <button 
                      onClick={() => setStoryIsPrivate(true)}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase text-center border transition-all cursor-pointer ${
                        storyIsPrivate ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-zinc-800 bg-zinc-90 w-full text-zinc-400'
                      }`}
                    >
                      ⭐ Amis Proches
                    </button>
                  </div>
                </div>

                {/* Synergy Slider */}
                <div className="p-3 bg-zinc-900 rounded-xl space-y-2 border border-zinc-850 font-sans">
                  <div className="flex justify-between items-center text-[9.5px] font-bold font-mono">
                    <span className="text-zinc-500 uppercase">AURA MINIMUM</span>
                    <span className="text-cyan-400 font-extrabold">{storyAuraLevel}%</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="99"
                    value={storyAuraLevel}
                    onChange={(e) => setStoryAuraLevel(parseInt(e.target.value))}
                    className="w-full accent-red-650 h-1 bg-zinc-955 rounded cursor-pointer"
                  />
                  <p className="text-[7.5px] text-zinc-450 leading-normal">
                    Filtre : seuls les utilisateurs ayant un pourcentage de compatibilité supérieur verront la publication.
                  </p>
                </div>

                {/* Live pop linked */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-[10.5px] font-sans">
                  <span className="font-bold">Associer Salon Live Pop actif</span>
                  <input 
                    type="checkbox" 
                    checked={linkPopSession}
                    onChange={(e) => setLinkPopSession(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#FF2D55] cursor-pointer"
                  />
                </div>

                <button 
                  onClick={() => setShowSettingsDrawer(false)}
                  className="w-full py-2 bg-[#FF2D55] hover:bg-red-600 rounded-xl text-[9px] font-black uppercase tracking-wider text-white text-md shadow-md cursor-pointer font-mono"
                >
                  Sauvegarder
                </button>
              </div>
            )}

          </div>

          {/* REAL-TIME HORIZONTAL FILTER SLIDER */}
          <div className="flex gap-2 border-t border-zinc-900 pt-1.5 pb-2 select-none overflow-x-auto scrollbar-none items-center mt-1">
            <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-mono font-black border-r border-zinc-850 pr-2 block">Filtres</span>
            {[
              { id: 'normal', name: 'Raw' },
              { id: 'clarendon', name: 'Clarendon' },
              { id: 'lark', name: 'Lark' },
              { id: 'juno', name: 'Juno' },
              { id: 'ludwig', name: 'Lud' },
              { id: 'crema', name: 'Crema' },
              { id: 'cyber', name: 'Cyber' },
              { id: 'noir', name: 'Noir' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStoryFilter(f.id)}
                className={`px-2.5 py-1 text-[8.5px] font-black rounded-full uppercase tracking-tight flex-shrink-0 transition-all cursor-pointer ${
                  storyFilter === f.id
                    ? 'bg-gradient-to-tr from-[#FF2D55] via-red-600 to-amber-500 text-white font-extrabold shadow-md'
                    : 'bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* AUDIENCE ACCENTS LINE */}
          <div className="flex justify-between items-center px-3 py-1 bg-zinc-950 rounded-xl border border-zinc-900 text-[10px] select-none mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 block animate-pulse" />
              <span className="text-zinc-500 uppercase text-[7.5px] font-mono">Confidentialité:</span>
              <span className="font-extrabold text-zinc-300 text-[9px] font-sans">{storyIsPrivate ? 'Amis proches ⭐' : 'Global Loop 🌍'}</span>
            </div>
            <button 
              onClick={() => setShowSettingsDrawer(true)}
              className="text-[#FF2D55] hover:underline text-[9px] font-black uppercase font-mono tracking-wide cursor-pointer"
            >
              Modifier ({storyAuraLevel}%)
            </button>
          </div>

          {/* ACTION COMPOSER FOOTER BOTTOM BAR */}
          <div className="flex gap-2 mt-1">
            {/* Cancel button */}
            <button
              onClick={() => setShowCreateStoryModal(false)}
              className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all select-none cursor-pointer font-sans"
            >
              Fermer
            </button>

            {/* Instant select button */}
            <button 
              onClick={() => setShowGalleryPicker(true)}
              className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 hover:text-white text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-sm select-none cursor-pointer font-sans"
            >
              🖼️ <span className="hidden xs:inline">Galerie</span>
            </button>

            {/* The single primary publish button */}
            <button 
              onClick={handlePublishStorySubmit}
              className="flex-grow py-2.5 bg-gradient-to-r from-[#FF2D55] via-[#FF2D55] to-amber-500 hover:opacity-95 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-mono"
            >
              <Send className="w-3 h-3 text-white" />
              PARTAGER STORY 🚀
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
