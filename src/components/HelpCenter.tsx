import { useState } from 'react';
import { CircleHelp, Send } from 'lucide-react';

export default function HelpCenter() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  return <section className="mt-4 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-4 text-left">
    <h3 className="flex items-center gap-2 text-xs font-black"><CircleHelp className="h-4 w-4 text-cyan-400" />Centre d’aide</h3>
    <details className="mt-3 rounded-xl border border-[var(--axo-border)] p-3 text-[10px]"><summary className="cursor-pointer font-bold">Comment fonctionnent les Axo Coins ?</summary><p className="mt-2 text-zinc-500">Les coins sont simulés dans cette maquette et récompensent certaines actions.</p></details>
    <details className="mt-2 rounded-xl border border-[var(--axo-border)] p-3 text-[10px]"><summary className="cursor-pointer font-bold">Comment signaler un compte ?</summary><p className="mt-2 text-zinc-500">Utilisez l’action Signaler depuis les paramètres ou un profil.</p></details>
    {sent ? <p className="mt-3 rounded-xl bg-emerald-500/10 p-3 text-[10px] font-bold text-emerald-500">Demande locale enregistrée — réf. AXO-2026-01.</p> : <><textarea value={message} onChange={event => setMessage(event.target.value)} rows={3} placeholder="Contacter le support…" className="mt-3 w-full rounded-xl border border-[var(--axo-border)] bg-transparent p-3 text-xs" /><button type="button" disabled={!message.trim()} onClick={() => setSent(true)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2D55] py-2.5 text-[10px] font-black text-white disabled:opacity-40"><Send className="h-3.5 w-3.5" />Envoyer</button></>}
    <p className="mt-3 text-[10px] text-zinc-500">Suivi des signalements : aucun dossier en attente.</p>
  </section>;
}
