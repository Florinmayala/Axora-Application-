import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Clapperboard, ImagePlus, LoaderCircle, Save, Send, Video, X } from 'lucide-react';
import type { ReelItem } from './AxoraReels';

type CreatorState = 'editing' | 'publishing' | 'success';

interface ReelCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (reel: ReelItem) => void;
  currentUser: { name: string; username: string; avatar: string };
}

const DRAFT_KEY = 'axo_reel_draft';

export default function ReelCreatorModal({ open, onClose, onPublish, currentUser }: ReelCreatorModalProps) {
  const videoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Abonnés' | 'Privé'>('Public');
  const [state, setState] = useState<CreatorState>('editing');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      const saved = JSON.parse(draft) as { caption?: string; visibility?: 'Public' | 'Abonnés' | 'Privé' };
      setCaption(saved.caption ?? '');
      setVisibility(saved.visibility ?? 'Public');
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [open]);

  useEffect(() => () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
  }, [videoPreview, coverPreview]);

  if (!open) return null;

  const close = () => { setState('editing'); setError(''); onClose(); };
  const selectVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) return setError('Choisissez un fichier vidéo compatible.');
    if (file.size > 100 * 1024 * 1024) return setError('La vidéo dépasse la limite de 100 Mo.');
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(file); setVideoPreview(URL.createObjectURL(file)); setDuration(null); setError('');
  };
  const selectCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('La couverture doit être une image.');
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCover(file); setCoverPreview(URL.createObjectURL(file)); setError('');
  };
  const saveDraft = () => { localStorage.setItem(DRAFT_KEY, JSON.stringify({ caption, visibility, savedAt: Date.now() })); setError('Brouillon enregistré sur cet appareil.'); };
  const publish = () => {
    if (!video) return setError('Ajoutez une vidéo avant de publier.');
    if (!coverPreview) return setError('Ajoutez une couverture : elle sera utilisée dans le fil Reels.');
    if (duration !== null && duration > 60) return setError('Choisissez une vidéo de 60 secondes ou moins.');
    setState('publishing');
    window.setTimeout(() => {
      onPublish({ id: `reel-${Date.now()}`, creatorName: currentUser.name, creatorUsername: currentUser.username.replace('@', ''), avatar: currentUser.avatar, mediaUrl: coverPreview, caption: caption.trim() || 'Nouveau Reel Axora', likes: 0, commentsCount: 0, shares: 0, musicTrack: 'Audio original', isVerified: false, comments: [] });
      localStorage.removeItem(DRAFT_KEY); setState('success');
    }, 350);
  };
  const fieldClass = 'mt-1 w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3 text-sm text-[var(--axo-text)] outline-none transition focus:border-[#ff2d55]';

  return (
    <div className="fixed inset-0 z-[220] overflow-y-auto bg-[var(--axo-overlay)] p-3 text-[var(--axo-text)] backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Créer un Reel">
      <div className="mx-auto flex min-h-full max-w-xl items-center"><div className="w-full overflow-hidden rounded-[28px] border border-[var(--axo-border)] bg-[var(--axo-surface)] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[var(--axo-border)] px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff2d55]/12 text-[#ff2d55]"><Clapperboard className="h-5 w-5" /></span><div><h2 className="text-sm font-black">Créer un Reel</h2><p className="text-[11px] text-[var(--axo-text-muted)]">Vidéo, couverture et légende</p></div></div><button type="button" onClick={close} className="rounded-full p-2 text-[var(--axo-text-muted)] transition hover:bg-[var(--axo-surface-muted)] hover:text-[var(--axo-text)]" aria-label="Fermer"><X className="h-5 w-5" /></button></header>
        {state === 'success' ? <div className="p-10 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><h3 className="mt-5 text-xl font-black">Reel ajouté</h3><p className="mt-2 text-sm text-[var(--axo-text-muted)]">Il est visible dans votre fil sur cet appareil.</p><button type="button" onClick={close} className="mt-7 rounded-xl bg-[#ff2d55] px-5 py-3 text-xs font-black text-white">Voir les Reels</button></div> : <div className="space-y-5 p-5">
          <input ref={videoInput} type="file" accept="video/*" capture="environment" className="hidden" onChange={selectVideo} /><input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={selectCover} />
          <section><div className="mb-2 flex items-center justify-between"><label className="text-sm font-black">1. Vidéo</label>{video && <span className="max-w-[55%] truncate text-xs text-emerald-600">{video.name}</span>}</div>{videoPreview ? <div className="relative overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-black"><video src={videoPreview} controls onLoadedMetadata={event => setDuration(event.currentTarget.duration)} className="aspect-[9/16] max-h-[320px] w-full object-contain" /><button type="button" onClick={() => videoInput.current?.click()} className="absolute right-3 top-3 rounded-xl bg-black/70 px-3 py-2 text-xs font-bold text-white">Changer</button></div> : <button type="button" onClick={() => videoInput.current?.click()} className="flex h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--axo-border)] bg-[var(--axo-surface-muted)] text-[var(--axo-text-muted)] transition hover:border-[#ff2d55] hover:bg-[#ff2d55]/5"><Video className="h-7 w-7 text-[#ff2d55]" /><span className="mt-3 text-sm font-bold">Importer ou filmer une vidéo</span><span className="mt-1 text-xs">MP4, MOV · 100 Mo maximum</span></button>}{duration !== null && <p className={`mt-2 text-xs ${duration > 60 ? 'text-red-500' : 'text-[var(--axo-text-muted)]'}`}>{Math.ceil(duration)} s {duration > 60 ? '— cette vidéo est trop longue (60 s maximum).' : '— durée compatible.'}</p>}</section>
          <section><label className="text-sm font-black">2. Couverture</label><button type="button" onClick={() => coverInput.current?.click()} className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3 text-left transition hover:border-[#ff2d55]/60">{coverPreview ? <img src={coverPreview} alt="Couverture choisie" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--axo-surface)]"><ImagePlus className="h-5 w-5 text-[var(--axo-text-muted)]" /></span>}<span><b className="block text-sm">{cover?.name || 'Choisir une couverture'}</b><span className="text-xs text-[var(--axo-text-muted)]">Image affichée dans le fil Reels.</span></span></button></section>
          <section className="space-y-3"><label className="block text-xs font-bold">Légende<textarea value={caption} onChange={event => setCaption(event.target.value)} rows={3} maxLength={500} placeholder="Décrivez votre Reel…" className={fieldClass} /><span className="mt-1 block text-right text-[10px] text-[var(--axo-text-muted)]">{caption.length}/500</span></label><label className="block text-xs font-bold">Visibilité<select value={visibility} onChange={event => setVisibility(event.target.value as typeof visibility)} className={fieldClass}><option>Public</option><option>Abonnés</option><option>Privé</option></select></label></section>
          <p className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-[11px] leading-relaxed text-[var(--axo-text-muted)]">La vidéo est prévisualisée ici et le Reel est ajouté localement à cette démonstration. L’envoi vers d’autres appareils requiert un stockage serveur.</p>
          {error && <div role="alert" className={`flex gap-2 rounded-xl border p-3 text-xs ${error.startsWith('Brouillon') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' : 'border-red-500/30 bg-red-500/10 text-red-600'}`}><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <footer className="flex flex-col-reverse gap-2 border-t border-[var(--axo-border)] pt-4 sm:flex-row"><button type="button" onClick={saveDraft} disabled={state === 'publishing'} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--axo-border)] py-3 text-xs font-black text-[var(--axo-text)] disabled:opacity-50"><Save className="h-4 w-4" />Brouillon</button><button type="button" onClick={publish} disabled={state === 'publishing'} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff2d55] py-3 text-xs font-black text-white disabled:opacity-50">{state === 'publishing' ? <><LoaderCircle className="h-4 w-4 animate-spin" />Ajout…</> : <><Send className="h-4 w-4" />Ajouter au fil</>}</button></footer>
        </div>}
      </div></div>
    </div>
  );
}
