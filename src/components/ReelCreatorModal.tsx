import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clapperboard, Eye, ImagePlus, LoaderCircle, Save, Send, Users, Video, X } from 'lucide-react';
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
  const [mediaScale, setMediaScale] = useState(1);
  const [mediaOffsetY, setMediaOffsetY] = useState(0);
  const [musicTrack, setMusicTrack] = useState('Audio original');
  const [step, setStep] = useState(1);
  const [state, setState] = useState<CreatorState>('editing');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setStep(1);
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
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) return setError('Choisissez une vidéo ou une photo compatible.');
    if (file.size > 100 * 1024 * 1024) return setError('Le média dépasse la limite de 100 Mo.');
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
    if (!video) return setError('Ajoutez une vidéo ou une photo avant de publier.');
    if (duration !== null && duration > 60) return setError('Choisissez une vidéo de 60 secondes ou moins.');
    setState('publishing');
    window.setTimeout(() => {
      onPublish({ id: `reel-${Date.now()}`, creatorName: currentUser.name, creatorUsername: currentUser.username.replace('@', ''), avatar: currentUser.avatar, mediaUrl: videoPreview, mediaType: video.type.startsWith('video/') ? 'video' : 'image', posterUrl: video.type.startsWith('video/') ? coverPreview || undefined : undefined, caption: caption.trim() || 'Nouveau Reel Axora', likes: 0, commentsCount: 0, shares: 0, musicTrack, mediaScale, mediaOffsetY, isVerified: false, comments: [] });
      localStorage.removeItem(DRAFT_KEY); setState('success');
    }, 350);
  };
  const fieldClass = 'mt-1 w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3 text-sm text-[var(--axo-text)] outline-none transition focus:border-[#ff2d55]';

  return (
    <div className="fixed inset-0 z-[220] overflow-y-auto bg-[var(--axo-bg)] text-[var(--axo-text)]" role="dialog" aria-modal="true" aria-label="Créer un Reel">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl"><div className="w-full min-h-[100dvh] overflow-hidden bg-[var(--axo-surface)]">
        <header className="flex items-center justify-between border-b border-[var(--axo-border)] px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff2d55]/12 text-[#ff2d55]"><Clapperboard className="h-5 w-5" /></span><div><h2 className="text-sm font-black">Créer un Reel</h2><p className="text-[11px] text-[var(--axo-text-muted)]">Vidéo, couverture et légende</p></div></div><button type="button" onClick={close} className="rounded-full p-2 text-[var(--axo-text-muted)] transition hover:bg-[var(--axo-surface-muted)] hover:text-[var(--axo-text)]" aria-label="Fermer"><X className="h-5 w-5" /></button></header>
        {state === 'success' ? <div className="p-10 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><h3 className="mt-5 text-xl font-black">Reel ajouté</h3><p className="mt-2 text-sm text-[var(--axo-text-muted)]">Il est visible dans votre fil sur cet appareil.</p><button type="button" onClick={close} className="mt-7 rounded-xl bg-[#ff2d55] px-5 py-3 text-xs font-black text-white">Voir les Reels</button></div> : <div className="mx-auto w-full max-w-3xl space-y-5 p-5 sm:p-8">
          <div className="grid grid-cols-3 gap-2" aria-label={`Étape ${step} sur 3`}>{['Choisir', 'Personnaliser', 'Publier'].map((label, index) => <div key={label}><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= index + 1 ? 'bg-[#ff2d55] text-white' : 'bg-[var(--axo-surface-muted)] text-[var(--axo-text-muted)]'}`}>{step > index + 1 ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className={step === index + 1 ? 'text-[#ff2d55]' : 'text-[var(--axo-text-muted)]'}>{label}</span></div><div className={`mt-2 h-1 rounded-full ${step >= index + 1 ? 'bg-[#ff2d55]' : 'bg-[var(--axo-surface-muted)]'}`} /></div>)}</div>
          <input ref={videoInput} type="file" accept="video/*,image/*" capture="environment" className="hidden" onChange={selectVideo} /><input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={selectCover} />
          {step === 1 && <section><div className="mb-2 flex items-center justify-between"><label className="text-sm font-black">Choisissez un média</label>{video && <span className="max-w-[55%] truncate text-xs text-emerald-600">{video.name}</span>}</div>{videoPreview ? <div className="relative overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-black">{video?.type.startsWith('video/') ? <video src={videoPreview} controls onLoadedMetadata={event => setDuration(event.currentTarget.duration)} className="aspect-[9/16] max-h-[320px] w-full object-contain" /> : <img src={videoPreview} alt="Média choisi" className="aspect-[9/16] max-h-[320px] w-full object-contain" />}<button type="button" onClick={() => videoInput.current?.click()} className="absolute right-3 top-3 rounded-xl bg-black/70 px-3 py-2 text-xs font-bold text-white">Changer</button></div> : <button type="button" onClick={() => videoInput.current?.click()} className="flex h-56 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#ff2d55]/60 bg-[#ff2d55]/5 text-[var(--axo-text-muted)] transition hover:bg-[#ff2d55]/10"><ImagePlus className="h-8 w-8 text-[#ff2d55]" /><span className="mt-3 text-sm font-black">Choisir depuis le téléphone</span><span className="mt-1 text-xs">Vidéo ou photo · 100 Mo maximum</span></button>}{duration !== null && <p className={`mt-2 text-xs ${duration > 60 ? 'text-red-500' : 'text-emerald-600'}`}>{Math.ceil(duration)} s {duration > 60 ? '— cette vidéo est trop longue (60 s maximum).' : '— durée compatible.'}</p>}</section>}
          {step === 2 && <><section><label className="text-sm font-black">Couverture <span className="font-normal text-[var(--axo-text-muted)]">(facultatif)</span></label><button type="button" onClick={() => coverInput.current?.click()} className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-3 text-left transition hover:border-[#ff2d55]/60">{coverPreview ? <img src={coverPreview} alt="Couverture choisie" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--axo-surface)]"><ImagePlus className="h-5 w-5 text-[#ff2d55]" /></span>}<span><b className="block text-sm">{cover?.name || 'Ajouter une couverture'}</b><span className="text-xs text-[var(--axo-text-muted)]">Elle rend l’aperçu plus attractif.</span></span></button></section><section className="mt-4"><label className="block text-xs font-bold">Légende<textarea value={caption} onChange={event => setCaption(event.target.value)} rows={4} maxLength={500} placeholder="Décrivez votre Reel…" className={fieldClass} /><span className="mt-1 block text-right text-[10px] text-[var(--axo-text-muted)]">{caption.length}/500</span></label></section></>}
          {step === 3 && <section><div className="overflow-hidden rounded-2xl bg-black">{video?.type.startsWith('video/') ? <video src={videoPreview} poster={coverPreview || undefined} controls className="aspect-[9/16] max-h-[300px] w-full object-contain" /> : <img src={videoPreview} alt="Aperçu final" className="aspect-[9/16] max-h-[300px] w-full object-contain" />}</div><h3 className="mt-4 text-lg font-black">Dernière vérification</h3><div className="mt-3 grid gap-2">{([{ value: 'Public', label: 'Public', icon: Eye }, { value: 'Abonnés', label: 'Abonnés', icon: Users }, { value: 'Privé', label: 'Privé', icon: Save }] as const).map(option => { const Icon = option.icon; return <button key={option.value} type="button" onClick={() => setVisibility(option.value)} className={`flex items-center gap-3 rounded-xl border p-3 text-left text-xs font-black ${visibility === option.value ? 'border-[#ff2d55] bg-[#ff2d55]/10 text-[#ff2d55]' : 'border-[var(--axo-border)]'}`}><Icon className="h-4 w-4" />{option.label}{visibility === option.value && <Check className="ml-auto h-4 w-4" />}</button>; })}</div></section>}
          {step === 2 && <ReelEnhancements mediaPreview={videoPreview} isVideo={Boolean(video?.type.startsWith('video/'))} mediaScale={mediaScale} mediaOffsetY={mediaOffsetY} musicTrack={musicTrack} onScaleChange={setMediaScale} onOffsetChange={setMediaOffsetY} onMusicChange={setMusicTrack} />}
          <p className="rounded-xl bg-[var(--axo-surface-muted)] px-3 py-2 text-[11px] leading-relaxed text-[var(--axo-text-muted)]">Le cadrage et la piste sont appliqués localement à cette démonstration. L’envoi vers d’autres appareils requiert un stockage serveur.</p>
          {error && <div role="alert" className={`flex gap-2 rounded-xl border p-3 text-xs ${error.startsWith('Brouillon') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' : 'border-red-500/30 bg-red-500/10 text-red-600'}`}><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <footer className="flex items-center justify-between gap-2 border-t border-[var(--axo-border)] pt-4">{step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 rounded-xl px-3 py-3 text-xs font-black"><ArrowLeft className="h-4 w-4" />Retour</button> : <button type="button" onClick={saveDraft} className="inline-flex items-center gap-1 rounded-xl px-3 py-3 text-xs font-black"><Save className="h-4 w-4" />Brouillon</button>}{step < 3 ? <button type="button" onClick={() => { if (!video) setError('Ajoutez un média avant de continuer.'); else if (duration !== null && duration > 60) setError('Choisissez une vidéo de 60 secondes ou moins.'); else { setError(''); setStep(step + 1); } }} className="inline-flex items-center gap-1 rounded-xl bg-[#ff2d55] px-5 py-3 text-xs font-black text-white">Continuer<ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={publish} disabled={state === 'publishing'} className="inline-flex items-center gap-2 rounded-xl bg-[#ff2d55] px-5 py-3 text-xs font-black text-white">{state === 'publishing' ? <><LoaderCircle className="h-4 w-4 animate-spin" />Ajout…</> : <><Send className="h-4 w-4" />Publier</>}</button>}</footer>
        </div>}
      </div></div>
    </div>
  );
}

function ReelEnhancements({ mediaPreview, isVideo, mediaScale, mediaOffsetY, musicTrack, onScaleChange, onOffsetChange, onMusicChange }: { mediaPreview: string; isVideo: boolean; mediaScale: number; mediaOffsetY: number; musicTrack: string; onScaleChange: (value: number) => void; onOffsetChange: (value: number) => void; onMusicChange: (value: string) => void }) {
  const tracks = ['Audio original', 'Axora • Nuit électrique', 'Axora • Kin Vibes', 'Axora • Lofi Focus'];
  return <section className="space-y-4 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface-muted)] p-4"><div><h3 className="text-sm font-black">Cadrage et son</h3><p className="mt-1 text-[11px] text-[var(--axo-text-muted)]">Ajustements non destructifs, visibles dans votre aperçu.</p></div><div className="grid gap-4 sm:grid-cols-[7rem_1fr]"><div className="overflow-hidden rounded-xl bg-black">{isVideo ? <video src={mediaPreview} muted playsInline className="aspect-[9/16] h-full w-full object-cover" style={{ transform: `translateY(${mediaOffsetY}%) scale(${mediaScale})` }} /> : <img src={mediaPreview} alt="Aperçu du cadrage" className="aspect-[9/16] h-full w-full object-cover" style={{ transform: `translateY(${mediaOffsetY}%) scale(${mediaScale})` }} />}</div><div className="space-y-4"><label className="block text-xs font-bold">Zoom <input type="range" min="1" max="1.5" step="0.05" value={mediaScale} onChange={event => onScaleChange(Number(event.target.value))} className="mt-2 w-full accent-[#ff2d55]" /><span className="text-[10px] text-[var(--axo-text-muted)]">{Math.round(mediaScale * 100)}%</span></label><label className="block text-xs font-bold">Position verticale <input type="range" min="-18" max="18" step="1" value={mediaOffsetY} onChange={event => onOffsetChange(Number(event.target.value))} className="mt-2 w-full accent-[#ff2d55]" /><span className="text-[10px] text-[var(--axo-text-muted)]">{mediaOffsetY > 0 ? '+' : ''}{mediaOffsetY}%</span></label><label className="block text-xs font-bold">Musique<select value={musicTrack} onChange={event => onMusicChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3 text-xs outline-none focus:border-[#ff2d55]">{tracks.map(track => <option key={track}>{track}</option>)}</select></label></div></div></section>;
}
