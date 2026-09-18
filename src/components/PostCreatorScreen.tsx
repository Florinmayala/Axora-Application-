import { useRef, useState } from 'react';
import { ArrowLeft, Check, ImagePlus, MapPin, Send, X } from 'lucide-react';

interface Props { isDark: boolean; onClose: () => void; }

export default function PostCreatorScreen({ isDark, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const surface = isDark ? 'border-white/10 bg-[#18181b] text-white' : 'border-zinc-200 bg-white text-zinc-950';

  const chooseImage = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };
  const publish = () => {
    if (!image) return;
    setBusy(true);
    const posts = (() => { try { return JSON.parse(localStorage.getItem('axo_profile_instagram_posts_v3') || '[]'); } catch { return []; } })();
    const post = { id: `p_user_${Date.now()}`, title: 'NOUVELLE PUBLICATION', text: caption.trim() || 'Nouvelle publication Axora', imageUrl: image, date: 'Posté à l’instant', likes: 0, commentsCount: 0, comments: [], location: location || undefined };
    localStorage.setItem('axo_profile_instagram_posts_v3', JSON.stringify([post, ...posts]));
    window.setTimeout(() => { setBusy(false); setStep(3); }, 450);
  };

  return <main className={`min-h-[100dvh] ${isDark ? 'bg-[#09090b]' : 'bg-[#fffafb]'} px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]`}>
    <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col">
      <header className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/10 text-white' : 'border-zinc-200 text-zinc-950'}`}>
        <button type="button" onClick={step === 1 ? onClose : () => setStep(value => value - 1 as 1 | 2)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour"><ArrowLeft className="h-5 w-5" /></button>
        <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#ff2d55]">Nouvelle publication</p><p className="mt-1 text-xs font-bold">Étape {step}/3</p></div>
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label="Fermer"><X className="h-5 w-5" /></button>
      </header>
      <div className="mt-4 grid grid-cols-3 gap-2" aria-label={`Étape ${step} sur 3`}>{[1, 2, 3].map(item => <span key={item} className={`h-1.5 rounded-full ${item <= step ? 'bg-[#ff2d55]' : isDark ? 'bg-white/15' : 'bg-zinc-200'}`} />)}</div>
      {step === 1 && <div className="flex flex-1 flex-col justify-center py-8"><div className={`overflow-hidden rounded-[30px] border ${surface}`}>{image ? <img src={image} alt="Aperçu de votre photo" className="aspect-square w-full object-cover" /> : <div className="flex aspect-square flex-col items-center justify-center p-8 text-center"><ImagePlus className="h-12 w-12 text-[#ff2d55]" /><h1 className="mt-5 text-xl font-black">Choisissez une photo</h1><p className="mt-2 text-sm text-[var(--axo-text-muted)]">Votre image sera affichée dans la grille de votre profil.</p></div>}</div><input ref={picker} type="file" accept="image/*" className="hidden" onChange={event => chooseImage(event.target.files?.[0])} /><button type="button" onClick={() => picker.current?.click()} className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#ff2d55] px-5 text-sm font-black text-white"><ImagePlus className="h-5 w-5" />{image ? 'Changer la photo' : 'Ouvrir la galerie'}</button><button type="button" disabled={!image} onClick={() => setStep(2)} className="mt-3 min-h-14 rounded-2xl border border-[#ff2d55]/30 text-sm font-black text-[#ff2d55] disabled:opacity-40">Continuer</button></div>}
      {step === 2 && <div className="flex flex-1 flex-col py-7"><img src={image} alt="Aperçu" className="mx-auto aspect-square w-full max-w-sm rounded-[28px] object-cover" /><label className="mt-6 text-xs font-black">Légende<textarea value={caption} onChange={event => setCaption(event.target.value)} rows={4} placeholder="Écrivez quelque chose…" className={`mt-2 w-full resize-none rounded-2xl border p-4 text-base outline-none ${surface}`} /></label><label className="mt-4 text-xs font-black">Lieu <span className="font-normal text-[var(--axo-text-muted)]">facultatif</span><span className="relative mt-2 block"><MapPin className="absolute left-4 top-3.5 h-4 w-4 text-[#ff2d55]" /><input value={location} onChange={event => setLocation(event.target.value)} placeholder="Ajouter un lieu" className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-base outline-none ${surface}`} /></span></label><button type="button" disabled={busy} onClick={publish} className="mt-auto flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#ff2d55] text-sm font-black text-white disabled:opacity-50"><Send className="h-5 w-5" />{busy ? 'Publication…' : 'Publier'}</button></div>}
      {step === 3 && <div className="flex flex-1 flex-col items-center justify-center py-10 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"><Check className="h-10 w-10" /></span><h1 className={`mt-6 text-2xl font-black ${isDark ? 'text-white' : 'text-zinc-950'}`}>Publication partagée</h1><p className="mt-3 max-w-xs text-sm text-[var(--axo-text-muted)]">Votre post est maintenant visible dans votre profil.</p><button type="button" onClick={onClose} className="mt-8 min-h-14 w-full rounded-2xl bg-[#ff2d55] text-sm font-black text-white">Retour au profil</button></div>}
    </section>
  </main>;
}
