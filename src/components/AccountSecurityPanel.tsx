import { useState, type ReactNode } from 'react';
import { AlertTriangle, Check, ChevronRight, FileText, Laptop, Mail, MonitorSmartphone, ShieldCheck, Smartphone, Trash2, X } from 'lucide-react';

type LegalDocument = 'Conditions d’utilisation' | 'Politique de confidentialité' | 'Règles de la communauté';

export default function AccountSecurityPanel({ isDark, onLogout }: { isDark: boolean; onLogout: () => void }) {
  const [verification, setVerification] = useState<'idle' | 'email' | 'phone' | 'verified'>('idle');
  const [otp, setOtp] = useState('');
  const [sessions, setSessions] = useState([
    { id: 'current', name: 'Cet appareil', detail: 'Windows · Kinshasa, RDC', icon: MonitorSmartphone, current: true },
    { id: 'mobile', name: 'Axora pour Android', detail: 'Actif il y a 2 heures', icon: Smartphone, current: false },
    { id: 'web', name: 'Navigateur Chrome', detail: 'Actif hier', icon: Laptop, current: false },
  ]);
  const [legal, setLegal] = useState<LegalDocument | null>(null);
  const [danger, setDanger] = useState<'deactivate' | 'delete' | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [feedback, setFeedback] = useState('');
  const panel = isDark ? 'border-white/5 bg-white/[0.015]' : 'border-slate-200 bg-slate-50';

  const verify = () => {
    if (otp.replace(/\D/g, '').length !== 6) return setFeedback('Entrez les 6 chiffres du code simulé.');
    setVerification('verified'); setOtp(''); setFeedback('Coordonnée vérifiée dans cette maquette.');
  };
  const closeOthers = () => { setSessions(current => current.filter(session => session.current)); setFeedback('Toutes les autres sessions ont été fermées.'); };
  const confirmDanger = () => {
    if (confirmation !== 'SUPPRIMER') return setFeedback('Saisissez SUPPRIMER pour confirmer.');
    if (danger === 'delete') localStorage.clear();
    onLogout();
  };

  return <section className="space-y-4 border-t border-white/5 pt-6 text-left">
    <div><h3 className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">Sécurité et compte</h3><p className="mt-1 text-[11px] text-zinc-400">Toutes les actions ci-dessous sont simulées côté front-end.</p></div>
    {feedback && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-[11px] font-bold text-emerald-500"><Check className="h-4 w-4" />{feedback}<button type="button" onClick={() => setFeedback('')} className="ml-auto"><X className="h-4 w-4" /></button></div>}

    <div className={`rounded-2xl border p-4 ${panel}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-black"><ShieldCheck className="h-4 w-4 text-emerald-500" />Vérifier vos coordonnées</div><p className="mt-1 text-[10px] leading-relaxed text-zinc-400">Ajoutez une preuve de contrôle de l’e-mail ou du téléphone.</p></div>{verification === 'verified' && <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-black text-emerald-500">VÉRIFIÉ</span>}</div>
      {verification === 'idle' || verification === 'verified' ? <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setVerification('email'); setFeedback(''); }} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-bold"><Mail className="mr-1 inline h-3.5 w-3.5" />E-mail</button><button type="button" onClick={() => { setVerification('phone'); setFeedback(''); }} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-bold"><Smartphone className="mr-1 inline h-3.5 w-3.5" />Téléphone</button></div> : <div className="mt-3 space-y-2"><p className="text-[10px] text-zinc-400">Un code de démonstration a été envoyé par {verification === 'email' ? 'e-mail' : 'SMS'}. Entrez six chiffres quelconques.</p><div className="flex gap-2"><input value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="000000" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-transparent px-3 py-2 text-center text-sm font-black tracking-[0.35em] outline-none focus:border-cyan-400" /><button type="button" onClick={verify} className="rounded-xl bg-cyan-500 px-3 py-2 text-[10px] font-black text-slate-950">Valider</button></div></div>}
    </div>

    <div className={`rounded-2xl border p-4 ${panel}`}><div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-black"><MonitorSmartphone className="h-4 w-4 text-cyan-400" />Appareils et sessions</div><p className="mt-1 text-[10px] text-zinc-400">Gérez les appareils actuellement connectés.</p></div><button type="button" onClick={closeOthers} disabled={sessions.length === 1} className="rounded-lg border border-[#FF2D55]/30 px-2 py-1.5 text-[9px] font-black text-[#FF2D55] disabled:opacity-40">Fermer les autres</button></div><div className="mt-3 space-y-2">{sessions.map(session => { const Icon = session.icon; return <div key={session.id} className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2.5"><Icon className="h-4 w-4 text-zinc-400" /><div className="min-w-0 flex-1"><p className="text-[11px] font-bold">{session.name}{session.current && <span className="ml-2 text-[9px] text-emerald-500">ACTUELLE</span>}</p><p className="truncate text-[9px] text-zinc-500">{session.detail}</p></div>{!session.current && <button type="button" onClick={() => setSessions(current => current.filter(item => item.id !== session.id))} className="text-[9px] font-bold text-[#FF2D55]">Retirer</button>}</div>; })}</div></div>

    <div className={`rounded-2xl border p-4 ${panel}`}><div className="flex items-center gap-2 text-xs font-black"><FileText className="h-4 w-4 text-amber-500" />Documents légaux</div><div className="mt-2">{(['Conditions d’utilisation', 'Politique de confidentialité', 'Règles de la communauté'] as LegalDocument[]).map(document => <button key={document} type="button" onClick={() => setLegal(document)} className="flex w-full items-center justify-between border-b border-white/5 py-3 text-left text-[11px] font-bold last:border-0">{document}<ChevronRight className="h-4 w-4 text-zinc-500" /></button>)}</div></div>
    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-4"><div className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-red-500" /><div><h4 className="text-xs font-black text-red-500">Zone sensible</h4><p className="mt-1 text-[10px] leading-relaxed text-zinc-400">Désactivez temporairement votre profil ou simulez sa suppression définitive.</p></div></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setDanger('deactivate'); setConfirmation(''); }} className="rounded-xl border border-red-500/20 px-3 py-2 text-[10px] font-bold text-red-500">Désactiver</button><button type="button" onClick={() => { setDanger('delete'); setConfirmation(''); }} className="rounded-xl bg-red-500 px-3 py-2 text-[10px] font-black text-white"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Supprimer</button></div></div>
    {legal && <Modal title={legal} onClose={() => setLegal(null)}><p>{legal === 'Conditions d’utilisation' ? 'En utilisant Axora, vous vous engagez à respecter les autres membres et à publier un contenu conforme à la loi.' : legal === 'Politique de confidentialité' ? 'Cette version n’utilise pas de backend : les préférences de démonstration sont conservées uniquement dans votre navigateur.' : 'Aucun harcèlement, contenu dangereux, usurpation ou partage d’informations privées n’est accepté.'}</p></Modal>}
    {danger && <Modal title={danger === 'delete' ? 'Supprimer le compte ?' : 'Désactiver le compte ?'} onClose={() => setDanger(null)}><p>{danger === 'delete' ? 'Cette démonstration effacera les données Axora stockées localement puis vous déconnectera.' : 'Votre profil sera masqué et votre session sera fermée.'}</p><label className="mt-4 block text-[10px] font-bold">Pour confirmer, saisissez SUPPRIMER<input value={confirmation} onChange={event => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs outline-none" /></label><button type="button" onClick={confirmDanger} className="mt-4 w-full rounded-xl bg-red-500 py-3 text-[10px] font-black text-white">Confirmer</button></Modal>}
  </section>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-[28px] bg-zinc-900 p-6 text-white shadow-2xl"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black">{title}</h3><button type="button" onClick={onClose} aria-label="Fermer"><X className="h-5 w-5" /></button></div><div className="mt-4 text-xs leading-relaxed text-zinc-300">{children}</div></div></div>; }
