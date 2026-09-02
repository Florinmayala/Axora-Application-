import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Clapperboard, ImagePlus, LoaderCircle, Music, Save, Send, Video, X } from 'lucide-react';
import type { ReelItem } from './AxoraReels';

type CreatorState = 'editing' | 'publishing' | 'success' | 'error';
interface ReelCreatorModalProps { open: boolean; onClose: () => void; onPublish: (reel: ReelItem) => void; currentUser: { name: string; username: string; avatar: string }; }
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=85';

export default function ReelCreatorModal({ open, onClose, onPublish, currentUser }: ReelCreatorModalProps) {
  const videoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [music, setMusic] = useState('Audio original');
  const [visibility, setVisibility] = useState<'Public' | 'Abonnés' | 'Privé'>('Public');
  const [duration, setDuration] = useState<'0–30 secondes' | '0–60 secondes'>('0–30 secondes');
  const [crop, setCrop] = useState<'9:16' | '4:5' | '1:1'>('9:16');
  const [coverMode, setCoverMode] = useState<'auto' | 'custom'>('auto');
  const [creatorState, setCreatorState] = useState<CreatorState>('editing');
  const [error, setError] = useState('');

  useEffect(() => () => { if (mediaPreview) URL.revokeObjectURL(mediaPreview); if (coverPreview) URL.revokeObjectURL(coverPreview); }, [mediaPreview, coverPreview]);
  if (!open) return null;

  const resetAndClose = () => { setCreatorState('editing'); setError(''); onClose(); };
  const saveDraft = () => { localStorage.setItem('axo_reel_draft', JSON.stringify({ caption, music, visibility, duration, crop, coverMode, mediaName: media?.name || '', coverName: coverFile?.name || '', savedAt: Date.now() })); resetAndClose(); };
  const selectVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('video/')) { setError('Choisissez un fichier vidéo compatible.'); return; }
    if (file.size > 100 * 1024 * 1024) { setError('Cette vidéo dépasse la limite de 100 Mo.'); return; }
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMedia(file); setMediaPreview(URL.createObjectURL(file)); setError('');
  };
  const selectCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { setError('La couverture doit être une image.'); return; }
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); setCoverMode('custom'); setError('');
  };
  const publish = () => {
    if (!media) { setError('Importez une vidéo avant de publier.'); return; }
    setCreatorState('publishing'); setError('');
    window.setTimeout(() => {
      try {
        onPublish({ id: `reel-${Date.now()}`, creatorName: currentUser.name, creatorUsername: currentUser.username.replace('@', ''), avatar: currentUser.avatar, mediaUrl: coverMode === 'custom' && coverPreview ? coverPreview : FALLBACK_COVER, caption: caption.trim() || 'Nouveau Reel Axora', likes: 0, commentsCount: 0, shares: 0, musicTrack: music.trim() || 'Audio original', isVerified: false, comments: [] });
        localStorage.removeItem('axo_reel_draft'); setCreatorState('success');
      } catch { setCreatorState('error'); setError('La publication a échoué. Réessayez dans quelques instants.'); }
    }, 900);
  };
  const fieldClass = 'mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-[#FF2D55]';

  return <div className="fixed inset-0 z-[220] overflow-y-auto bg-zinc-950/95 p-3 text-white backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label="Créer un Reel"><div className="mx-auto min-h-full max-w-2xl"><div className="rounded-[28px] border border-white/10 bg-zinc-900 shadow-2xl"><header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF2D55]/15 text-[#FF2D55]"><Clapperboard className="h-5 w-5" /></span><div><h2 className="text-sm font-black">Créer un Reel</h2><p className="text-[10px] text-zinc-500">Import, cadrage, couverture et publication</p></div></div><button type="button" onClick={resetAndClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Fermer"><X className="h-5 w-5" /></button></header>{creatorState === 'success' ? <div className="p-8 text-center sm:p-12"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" /><h3 className="mt-5 text-xl font-black">Reel publié</h3><p className="mt-2 text-sm text-zinc-400">Votre Reel est maintenant visible selon la confidentialité choisie.</p><button type="button" onClick={resetAndClose} className="mt-7 rounded-xl bg-[#FF2D55] px-5 py-3 text-xs font-black">Voir les Reels</button></div> : <div className="space-y-5 p-4 sm:p-6"><input ref={videoInput} type="file" accept="video/*" capture="environment" className="hidden" onChange={selectVideo} /><input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={selectCover} /><section><div className="mb-2 flex items-center justify-between"><label className="text-xs font-black">1. Vidéo</label>{media && <span className="text-[10px] text-emerald-400">{media.name}</span>}</div>{mediaPreview ? <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black"><video src={mediaPreview} controls className="aspect-[9/16] max-h-[360px] w-full object-contain" /><button type="button" onClick={() => videoInput.current?.click()} className="absolute right-3 top-3 rounded-xl bg-black/70 px-3 py-2 text-[10px] font-black">Changer</button></div> : <button type="button" onClick={() => videoInput.current?.click()} className="flex h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-zinc-400 transition hover:border-[#FF2D55]/60 hover:bg-[#FF2D55]/5"><Video className="h-8 w-8 text-[#FF2D55]" /><span className="mt-3 text-xs font-black">Importer ou filmer une vidéo</span><span className="mt-1 text-[10px] text-zinc-500">MP4, MOV · 100 Mo maximum</span></button>}</section><section className="grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-bold">Recadrage<select value={crop} onChange={event => setCrop(event.target.value as typeof crop)} className={fieldClass}><option>9:16</option><option>4:5</option><option>1:1</option></select></label><label className="text-[10px] font-bold">Durée<select value={duration} onChange={event => setDuration(event.target.value as typeof duration)} className={fieldClass}><option>0–30 secondes</option><option>0–60 secondes</option></select></label></section><section><div className="mb-2 flex items-center justify-between"><label className="text-xs font-black">2. Couverture</label><div className="flex rounded-lg bg-white/5 p-0.5 text-[10px]"><button type="button" onClick={() => setCoverMode('auto')} className={`rounded-md px-2 py-1 ${coverMode === 'auto' ? 'bg-white/15 text-white' : 'text-zinc-500'}`}>Auto</button><button type="button" onClick={() => { setCoverMode('custom'); coverInput.current?.click(); }} className={`rounded-md px-2 py-1 ${coverMode === 'custom' ? 'bg-white/15 text-white' : 'text-zinc-500'}`}>Personnalisée</button></div></div><button type="button" onClick={() => coverInput.current?.click()} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-white/20">{coverPreview ? <img src={coverPreview} alt="Couverture choisie" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5"><ImagePlus className="h-5 w-5 text-zinc-400" /></span>}<span><b className="block text-xs">{coverFile?.name || 'Choisir une couverture'}</b><span className="text-[10px] text-zinc-500">{coverMode === 'auto' ? 'Une image de couverture sera générée.' : 'PNG ou JPG recommandé.'}</span></span></button></section><section className="space-y-3"><label className="block text-[10px] font-bold">Légende<textarea value={caption} onChange={event => setCaption(event.target.value)} rows={3} maxLength={500} placeholder="Décrivez votre Reel…" className={fieldClass} /><span className="mt-1 block text-right text-[9px] text-zinc-500">{caption.length}/500</span></label><label className="block text-[10px] font-bold"><Music className="mr-1 inline h-3.5 w-3.5" />Audio<input value={music} onChange={event => setMusic(event.target.value)} className={fieldClass} /></label><label className="block text-[10px] font-bold">Visibilité<select value={visibility} onChange={event => setVisibility(event.target.value as typeof visibility)} className={fieldClass}><option>Public</option><option>Abonnés</option><option>Privé</option></select></label></section>{(error || creatorState === 'error') && <div role="alert" className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200"><AlertCircle className="h-4 w-4 shrink-0 text-red-400" />{error}</div>}<footer className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row"><button type="button" onClick={saveDraft} disabled={creatorState === 'publishing'} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-xs font-black text-zinc-300 disabled:opacity-50"><Save className="h-4 w-4" />Enregistrer le brouillon</button><button type="button" onClick={publish} disabled={creatorState === 'publishing'} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2D55] py-3 text-xs font-black disabled:opacity-50">{creatorState === 'publishing' ? <><LoaderCircle className="h-4 w-4 animate-spin" />Publication…</> : <><Send className="h-4 w-4" />Publier</>}</button></footer></div>}</div></div></div>;
}
