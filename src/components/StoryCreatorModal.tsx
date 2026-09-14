import React, { ChangeEvent, useRef, useState } from 'react';
import { Check, Globe, ImagePlus, Lock, Send, Type, Users, X } from 'lucide-react';
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

const gradients = [
  { id: 'rose', label: 'Rose', value: 'linear-gradient(145deg,#ff2d55,#8b1e73)' },
  { id: 'ocean', label: 'Océan', value: 'linear-gradient(145deg,#1c8cff,#102a72)' },
  { id: 'sun', label: 'Soleil', value: 'linear-gradient(145deg,#ff9a1f,#e84428)' },
  { id: 'night', label: 'Nuit', value: 'linear-gradient(145deg,#302c63,#10121e)' },
];

const svgCover = (gradient: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${gradient.includes('#1c') ? '#1c8cff' : gradient.includes('#ff9') ? '#ff9a1f' : gradient.includes('#302') ? '#302c63' : '#ff2d55'}"/><stop offset="1" stop-color="${gradient.includes('#1c') ? '#102a72' : gradient.includes('#ff9') ? '#e84428' : gradient.includes('#302') ? '#10121e' : '#8b1e73'}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)}`;

export default function StoryCreatorModal({ showCreateStoryModal, setShowCreateStoryModal, currentUserAvatar, setStories, setNotifications, setActiveStory }: StoryCreatorModalProps) {
  const input = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState('');
  const [captionPosition, setCaptionPosition] = useState({ x: 50, y: 76 });
  const [isPrivate, setPrivate] = useState(false);
  const [gradient, setGradient] = useState(gradients[0]);
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');

  if (!showCreateStoryModal) return null;

  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    setImage(URL.createObjectURL(file));
    setImageName(file.name);
  };

  const publish = () => {
    const story: Story = {
      id: `story-${Date.now()}`, username: 'Vous', avatar: currentUserAvatar, isSeen: false,
      mediaUrl: image || svgCover(gradient.value), caption, filter: 'normal', font: 'font-sans', captionColor: '#fff', auraLevel: 0,
      isPrivate, stickers: [], createdAt: Date.now(), expiresAt: Date.now() + 86_400_000, views: [], responses: [],
    };
    setStories(items => [story, ...items]);
    setNotifications(items => [{ id: `story-notif-${Date.now()}`, type: 'system', title: 'Story publiée', description: isPrivate ? 'Visible uniquement par vos proches.' : 'Votre Story est maintenant visible.', timestamp: 'À l’instant' }, ...items]);
    setShowCreateStoryModal(false);
    setActiveStory(story);
  };

  const selectGradient = (item: typeof gradients[number]) => { setGradient(item); setImage(''); setImageName(''); };

  const moveCaption = (event: React.PointerEvent<HTMLParagraphElement>) => {
    const bounds = previewRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const clamp = (value: number) => Math.min(88, Math.max(12, value));
    setCaptionPosition({
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 100),
      y: clamp(((event.clientY - bounds.top) / bounds.height) * 100),
    });
  };

  return <div className="fixed inset-0 z-[100] bg-[var(--axo-bg)] text-[var(--axo-text)]">
    <section aria-label="Créer une Story" className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--axo-surface)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--axo-border)] bg-[var(--axo-surface)] px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--axo-accent)]">Nouvelle Story</p><h2 className="mt-1 text-lg font-black">Partagez un instant</h2></div>
        <button type="button" onClick={() => setShowCreateStoryModal(false)} className="rounded-full p-2 transition hover:bg-[var(--axo-surface-muted)]" aria-label="Fermer"><X className="h-5 w-5" /></button>
      </header>

      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_23rem] lg:overflow-hidden">
        <main className="relative flex min-h-[380px] items-center justify-center overflow-hidden bg-[var(--axo-surface-muted)] p-5 sm:min-h-[440px] lg:min-h-0">
          <div className="absolute inset-0 opacity-50" style={{ background: image ? 'linear-gradient(145deg,#17171b,#27272a)' : gradient.value }} />
          <div ref={previewRef} className="relative h-[min(56dvh,520px)] min-h-[330px] max-h-full aspect-[9/16] max-w-full overflow-hidden rounded-[26px] border border-white/20 bg-zinc-950 shadow-2xl sm:h-[min(58dvh,590px)]" style={{ background: image ? undefined : gradient.value }}>
            {image && <img src={image} alt="Aperçu de votre Story" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
            <div className="absolute left-4 right-4 top-4 flex items-center gap-2 text-white"><img src={currentUserAvatar} alt="" className="h-8 w-8 rounded-full border border-white/60 object-cover" /><span className="text-xs font-bold">Votre Story</span></div>
            {caption && <p
              onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); moveCaption(event); }}
              onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) moveCaption(event); }}
              onPointerUp={event => event.currentTarget.releasePointerCapture(event.pointerId)}
              className="absolute z-10 w-[80%] touch-none select-none text-center text-xl font-black leading-snug text-white drop-shadow-lg cursor-grab active:cursor-grabbing"
              style={{ left: `${captionPosition.x}%`, top: `${captionPosition.y}%`, transform: 'translate(-50%, -50%)' }}
              title="Faites glisser le texte pour le déplacer"
            >{caption}</p>}
            <span className="absolute bottom-4 right-4 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-bold text-white/90">24 h</span>
          </div>
        </main>

        <aside className="flex min-h-0 flex-col border-t border-[var(--axo-border)] bg-[var(--axo-surface)] lg:border-l lg:border-t-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <input ref={input} type="file" accept="image/*" onChange={chooseImage} className="hidden" />
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <button type="button" onClick={() => input.current?.click()} className="flex min-w-0 items-center gap-3 rounded-2xl border border-dashed border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3.5 text-left transition hover:border-[var(--axo-accent)]">
                <ImagePlus className="h-5 w-5 shrink-0 text-[var(--axo-accent)]" /><span className="min-w-0"><b className="block text-sm">{image ? 'Changer la photo' : 'Ajouter une photo'}</b><span className="block truncate text-[11px] text-[var(--axo-text-muted)]">{imageName || 'PNG ou JPG'}</span></span>
              </button>
              {image && <button type="button" onClick={() => { setImage(''); setImageName(''); }} className="rounded-2xl border border-[var(--axo-border)] px-3 text-xs font-black text-[var(--axo-text-muted)]">Retirer</button>}
            </div>

            <div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-black">Ambiance</p><span className="text-[10px] text-[var(--axo-text-muted)]">Couleur de fond</span></div><div className="grid grid-cols-4 gap-2">{gradients.map(item => <button key={item.id} type="button" onClick={() => selectGradient(item)} className={`relative aspect-square rounded-xl border-2 transition ${gradient.id === item.id && !image ? 'border-[var(--axo-accent)] scale-[1.03]' : 'border-transparent'}`} style={{ background: item.value }} aria-label={item.label}>{gradient.id === item.id && !image && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}</button>)}</div></div>

            <label className="block text-xs font-black"><span><Type className="mr-1 inline h-3.5 w-3.5 text-[var(--axo-accent)]" />Légende</span><textarea value={caption} onChange={event => setCaption(event.target.value)} maxLength={160} rows={3} placeholder="Qu’avez-vous envie de partager ?" className="mt-2 w-full resize-none rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3 text-sm font-normal outline-none transition focus:border-[var(--axo-accent)]" /><span className="mt-1 block text-right text-[10px] font-medium text-[var(--axo-text-muted)]">{caption.length}/160</span></label>

            <div><p className="mb-2 text-xs font-black">Audience</p><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setPrivate(false)} className={`rounded-2xl border p-3 text-left transition ${!isPrivate ? 'border-[var(--axo-accent)] bg-[var(--axo-accent)]/8' : 'border-[var(--axo-border)]'}`}><Globe className="h-4 w-4 text-[var(--axo-accent)]" /><b className="mt-2 block text-xs">Tout le monde</b><span className="mt-0.5 block text-[10px] text-[var(--axo-text-muted)]">Visible par tous</span></button><button type="button" onClick={() => setPrivate(true)} className={`rounded-2xl border p-3 text-left transition ${isPrivate ? 'border-[var(--axo-accent)] bg-[var(--axo-accent)]/8' : 'border-[var(--axo-border)]'}`}><Users className="h-4 w-4 text-[var(--axo-accent)]" /><b className="mt-2 block text-xs">Proches amis</b><span className="mt-0.5 block text-[10px] text-[var(--axo-text-muted)]">Audience choisie</span></button></div></div>
          </div>
          <div className="shrink-0 border-t border-[var(--axo-border)] bg-[var(--axo-surface)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"><button type="button" onClick={publish} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--axo-accent)] py-3.5 text-xs font-black text-white shadow-lg shadow-[var(--axo-accent)]/20 transition active:scale-[.98]"><Send className="h-4 w-4" />Publier la Story</button><p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[var(--axo-text-muted)]"><Lock className="h-3 w-3" />Visible pendant 24 heures</p></div>
        </aside>
      </div>
    </section>
  </div>;
}
