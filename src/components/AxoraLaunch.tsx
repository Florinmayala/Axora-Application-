import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, Flame,
  FileText, LockKeyhole, Mail, Phone, ShieldCheck, Smartphone, User
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface AxoraLaunchProps {
  onAuthenticated: () => void;
  mode?: 'login' | 'resume';
}

export default function AxoraLaunch({ onAuthenticated, mode = 'login' }: AxoraLaunchProps) {
  const [phase, setPhase] = useState<'splash' | 'login' | 'signup' | 'recovery' | 'legal'>('splash');
  const [signupStep, setSignupStep] = useState(1);
  const [recoveryStep, setRecoveryStep] = useState<'contact' | 'otp' | 'password' | 'done'>('contact');
  const [recoveryChannel, setRecoveryChannel] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState('');
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [recoveryConfirm, setRecoveryConfirm] = useState('');
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'rules'>('terms');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', username: '', birthDate: '', email: '', phone: '',
    password: '', confirmPassword: '', bio: '', accepted: false
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (mode === 'resume') onAuthenticated();
      else setPhase('login');
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [mode, onAuthenticated]);

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm(previous => ({ ...previous, [field]: value }));
    setError('');
  };

  const finishAuthentication = () => {
    sessionStorage.setItem('axo_session', 'active');
    onAuthenticated();
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Saisissez votre adresse et votre mot de passe.');
      return;
    }
    finishAuthentication();
  };

  const startRecovery = () => {
    if (!form.email.trim() && !form.phone.trim()) {
      setError('Saisissez votre e-mail ou votre numéro de téléphone.');
      return;
    }
    setError('');
    setOtp('');
    setRecoveryStep('otp');
  };

  const verifyOtp = () => {
    if (otp.replace(/\D/g, '').length !== 6) {
      setError('Entrez les 6 chiffres du code simulé.');
      return;
    }
    setError('');
    setRecoveryStep('password');
  };

  const resetPassword = () => {
    if (recoveryPassword.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (recoveryPassword !== recoveryConfirm) return setError('Les deux mots de passe ne correspondent pas.');
    setError('');
    setRecoveryStep('done');
  };

  const nextSignupStep = () => {
    if (signupStep === 1 && (!form.name.trim() || !form.username.trim() || !form.birthDate)) {
      setError('Complétez votre nom, votre identifiant et votre date de naissance.');
      return;
    }
    if (signupStep === 2 && (!form.email.trim() || !form.phone.trim())) {
      setError('Ajoutez une adresse électronique et un numéro de téléphone.');
      return;
    }
    if (signupStep === 3) {
      if (form.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Les deux mots de passe ne correspondent pas.');
        return;
      }
      if (!form.accepted) {
        setError('Acceptez les conditions pour continuer.');
        return;
      }
    }
    setSignupStep(step => Math.min(4, step + 1));
  };

  const createAccount = () => {
    localStorage.setItem('axo_profileName', form.name.trim());
    localStorage.setItem('axo_profileUsername', `@${form.username.replace(/^@/, '').trim()}`);
    if (form.bio.trim()) localStorage.setItem('axo_profileBio', form.bio.trim());
    finishAuthentication();
  };

  const fieldClass = 'flex-1 min-w-0 bg-transparent outline-none text-base text-zinc-950 placeholder:text-zinc-400';

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-white text-zinc-950">
      <AnimatePresence mode="wait">
        {phase === 'splash' ? (
          <motion.section key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-white">
            <motion.div animate={{ scale: [0.9, 1, 0.96] }} transition={{ duration: 1.35 }}><Flame className="w-20 h-20 fill-[#FF2D55] text-[#FF2D55]" /></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] text-lg font-black tracking-[-0.03em] text-zinc-950"
            >
              Axora
            </motion.p>
          </motion.section>
        ) : (
          <motion.section key={phase} initial={{ opacity: 0, x: phase === 'signup' ? 18 : 0 }} animate={{ opacity: 1, x: 0 }} className="relative h-full overflow-y-auto flex items-center justify-center px-5 py-8 bg-white">
            <Flame className="absolute -left-20 top-[12%] w-64 h-64 text-[#FF2D55] opacity-[0.025] fill-current -rotate-12" />
            <div className="relative z-10 w-full max-w-[390px]">
              {phase === 'login' ? (
                <>
                  <div className="mb-9">
                    <Flame className="w-10 h-10 fill-[#FF2D55] text-[#FF2D55]" />
                    <h1 className="mt-6 text-[28px] font-black tracking-tight">Connexion à Axora</h1>
                    <p className="mt-2 text-xs text-zinc-600">Retrouvez votre espace et vos conversations.</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Field icon={<Mail />} label="Adresse électronique">
                      <input type="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="nom@exemple.com" className={fieldClass} />
                    </Field>
                    <Field icon={<LockKeyhole />} label="Mot de passe">
                      <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={event => update('password', event.target.value)} placeholder="Votre mot de passe" className={fieldClass} />
                      <button type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </Field>
                    {error && <p className="text-xs text-[#D91B43]">{error}</p>}
                    <button type="submit" className="w-full h-12 rounded-xl bg-[#FF2D55] text-white text-xs font-black">Se connecter</button>
                  </form>
                  <button type="button" onClick={() => { setPhase('recovery'); setRecoveryStep('contact'); setError(''); }} className="mt-4 text-xs font-bold text-zinc-600 underline underline-offset-4">Mot de passe oublié ?</button>
                  <p className="mt-7 text-center text-xs text-zinc-600">Pas encore de compte ?{' '}
                    <button onClick={() => { setPhase('signup'); setError(''); }} className="font-black text-zinc-950 underline">Créer un compte</button>
                  </p>
                  <div className="mt-8 flex justify-center gap-4 text-[10px] font-semibold text-zinc-500"><button type="button" onClick={() => { setLegalPage('terms'); setPhase('legal'); }}>CGU</button><button type="button" onClick={() => { setLegalPage('privacy'); setPhase('legal'); }}>Confidentialité</button><button type="button" onClick={() => { setLegalPage('rules'); setPhase('legal'); }}>Règles</button></div>
                </>
              ) : phase === 'recovery' ? (
                <>
                  <button type="button" onClick={() => { setPhase('login'); setError(''); }} className="mb-7 flex items-center gap-2 text-xs font-bold text-zinc-600"><ArrowLeft className="w-4 h-4" /> Retour à la connexion</button>
                  {recoveryStep === 'contact' && <div className="space-y-5"><div><ShieldCheck className="h-10 w-10 text-[#FF2D55]" /><h1 className="mt-4 text-2xl font-black">Réinitialiser le mot de passe</h1><p className="mt-2 text-xs leading-relaxed text-zinc-600">Choisissez où recevoir un code. Il est simulé : entrez n’importe quels 6 chiffres pour continuer.</p></div><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setRecoveryChannel('email')} className={`rounded-xl border p-3 text-xs font-bold ${recoveryChannel === 'email' ? 'border-[#FF2D55] bg-[#FF2D55]/5 text-[#D91B43]' : 'border-zinc-200'}`}><Mail className="mx-auto mb-1 h-4 w-4" />E-mail</button><button type="button" onClick={() => setRecoveryChannel('phone')} className={`rounded-xl border p-3 text-xs font-bold ${recoveryChannel === 'phone' ? 'border-[#FF2D55] bg-[#FF2D55]/5 text-[#D91B43]' : 'border-zinc-200'}`}><Phone className="mx-auto mb-1 h-4 w-4" />Téléphone</button></div><Field icon={recoveryChannel === 'email' ? <Mail /> : <Phone />} label={recoveryChannel === 'email' ? 'Adresse e-mail' : 'Numéro de téléphone'}><input type={recoveryChannel === 'email' ? 'email' : 'tel'} value={recoveryChannel === 'email' ? form.email : form.phone} onChange={event => update(recoveryChannel === 'email' ? 'email' : 'phone', event.target.value)} placeholder={recoveryChannel === 'email' ? 'nom@exemple.com' : '+243…'} className={fieldClass} /></Field></div>}
                  {recoveryStep === 'otp' && <div className="space-y-5"><div><Smartphone className="h-10 w-10 text-[#FF2D55]" /><h1 className="mt-4 text-2xl font-black">Vérification</h1><p className="mt-2 text-xs leading-relaxed text-zinc-600">Code de démonstration envoyé à {recoveryChannel === 'email' ? form.email : form.phone}.</p></div><label className="block text-xs font-bold">Code à 6 chiffres<input inputMode="numeric" maxLength={6} autoFocus value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-4 text-center text-2xl font-black tracking-[0.45em] outline-none focus:border-[#FF2D55]" /></label><button type="button" onClick={() => setOtp('')} className="text-xs font-bold text-zinc-600 underline">Renvoyer le code simulé</button></div>}
                  {recoveryStep === 'password' && <div className="space-y-4"><div><LockKeyhole className="h-10 w-10 text-[#FF2D55]" /><h1 className="mt-4 text-2xl font-black">Nouveau mot de passe</h1></div><Field icon={<LockKeyhole />} label="Nouveau mot de passe"><input type="password" value={recoveryPassword} onChange={event => setRecoveryPassword(event.target.value)} placeholder="8 caractères minimum" className={fieldClass} /></Field><Field icon={<LockKeyhole />} label="Confirmer le mot de passe"><input type="password" value={recoveryConfirm} onChange={event => setRecoveryConfirm(event.target.value)} placeholder="Répétez le mot de passe" className={fieldClass} /></Field></div>}
                  {recoveryStep === 'done' && <div className="space-y-4 text-center"><CheckCircle className="mx-auto h-14 w-14 text-emerald-500" /><h1 className="text-2xl font-black">Mot de passe mis à jour</h1><p className="text-xs leading-relaxed text-zinc-600">Cette confirmation est simulée côté interface. Vous pouvez maintenant vous connecter.</p></div>}
                  {error && <p className="mt-4 text-xs text-[#D91B43]">{error}</p>}
                  {recoveryStep !== 'done' ? <button type="button" onClick={recoveryStep === 'contact' ? startRecovery : recoveryStep === 'otp' ? verifyOtp : resetPassword} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF2D55] text-xs font-black text-white">{recoveryStep === 'contact' ? 'Recevoir le code' : recoveryStep === 'otp' ? 'Vérifier le code' : 'Enregistrer le mot de passe'} <ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={() => setPhase('login')} className="mt-6 h-12 w-full rounded-xl bg-[#FF2D55] text-xs font-black text-white">Retour à la connexion</button>}
                </>
              ) : phase === 'legal' ? (
                <><button type="button" onClick={() => setPhase('login')} className="mb-7 flex items-center gap-2 text-xs font-bold text-zinc-600"><ArrowLeft className="w-4 h-4" /> Retour</button><FileText className="h-9 w-9 text-[#FF2D55]" /><h1 className="mt-4 text-2xl font-black">{legalPage === 'terms' ? 'Conditions d’utilisation' : legalPage === 'privacy' ? 'Politique de confidentialité' : 'Règles de la communauté'}</h1><div className="mt-5 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700">{legalPage === 'terms' ? <p>En utilisant Axora, vous vous engagez à fournir des informations exactes, à respecter les autres membres et à ne pas publier de contenu illégal ou nuisible.</p> : legalPage === 'privacy' ? <p>Cette maquette stocke uniquement certaines préférences dans votre navigateur. Aucun e-mail, code OTP ou mot de passe n’est envoyé à un serveur.</p> : <p>Respectez les personnes, protégez les informations personnelles, évitez le harcèlement et signalez les contenus dangereux ou illégaux.</p>}</div><div className="mt-5 flex gap-2"><button type="button" onClick={() => setLegalPage('terms')} className="text-[10px] font-bold underline">CGU</button><button type="button" onClick={() => setLegalPage('privacy')} className="text-[10px] font-bold underline">Confidentialité</button><button type="button" onClick={() => setLegalPage('rules')} className="text-[10px] font-bold underline">Règles</button></div></>
              ) : (
                <>
                  <button type="button" onClick={() => signupStep > 1 ? setSignupStep(step => step - 1) : setPhase('login')} className="mb-5 flex items-center gap-2 text-xs font-bold text-zinc-600">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-black text-[#FF2D55]"><span>CRÉER VOTRE COMPTE</span><span>{signupStep}/4</span></div>
                    <div className="mt-2 grid grid-cols-4 gap-2">{[1,2,3,4].map(step => <span key={step} className={`h-1.5 rounded-full ${step <= signupStep ? 'bg-[#FF2D55]' : 'bg-zinc-200'}`} />)}</div>
                  </div>

                  {signupStep === 1 && <div className="space-y-4">
                    <h1 className="text-2xl font-black">Votre identité</h1>
                    <Field icon={<User />} label="Nom complet"><input value={form.name} onChange={event => update('name', event.target.value)} placeholder="Votre nom" className={fieldClass} /></Field>
                    <Field icon={<User />} label="Identifiant Axora"><input value={form.username} onChange={event => update('username', event.target.value)} placeholder="@identifiant" className={fieldClass} /></Field>
                    <Field label="Date de naissance"><input type="date" value={form.birthDate} onChange={event => update('birthDate', event.target.value)} className={fieldClass} /></Field>
                  </div>}
                  {signupStep === 2 && <div className="space-y-4">
                    <h1 className="text-2xl font-black">Vos coordonnées</h1>
                    <Field icon={<Mail />} label="Adresse électronique"><input type="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="nom@exemple.com" className={fieldClass} /></Field>
                    <Field icon={<Phone />} label="Téléphone"><input type="tel" value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="+243…" className={fieldClass} /></Field>
                  </div>}
                  {signupStep === 3 && <div className="space-y-4">
                    <h1 className="text-2xl font-black">Sécurisez le compte</h1>
                    <Field icon={<LockKeyhole />} label="Mot de passe"><input type="password" value={form.password} onChange={event => update('password', event.target.value)} placeholder="8 caractères minimum" className={fieldClass} /></Field>
                    <Field icon={<LockKeyhole />} label="Confirmer"><input type="password" value={form.confirmPassword} onChange={event => update('confirmPassword', event.target.value)} placeholder="Répétez le mot de passe" className={fieldClass} /></Field>
                    <label className="flex items-start gap-3 text-xs text-zinc-600"><input type="checkbox" checked={form.accepted} onChange={event => update('accepted', event.target.checked)} className="mt-0.5 accent-[#FF2D55]" />J’accepte les conditions d’utilisation et la politique de confidentialité.</label>
                  </div>}
                  {signupStep === 4 && <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                    <h1 className="text-2xl font-black">Finalisez votre profil</h1>
                    <p className="text-xs text-zinc-600">Cette présentation sera visible sur votre profil public.</p>
                    <label className="block text-xs font-bold">Biographie<textarea value={form.bio} onChange={event => update('bio', event.target.value)} rows={4} placeholder="Parlez de vous…" className="mt-2 w-full rounded-xl border border-zinc-300 p-4 text-base outline-none focus:border-[#FF2D55]" /></label>
                  </div>}

                  {error && <p className="mt-4 text-xs text-[#D91B43]">{error}</p>}
                  <button type="button" onClick={signupStep === 4 ? createAccount : nextSignupStep} className="mt-6 w-full h-12 rounded-xl bg-[#FF2D55] text-white text-xs font-black flex items-center justify-center gap-2">
                    {signupStep === 4 ? 'Créer mon compte et entrer sur Axora' : <>Continuer <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function Field({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="block">
    <span className="text-[11px] font-bold text-zinc-800">{label}</span>
    <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 focus-within:border-zinc-950">
      {icon && <span className="text-zinc-500 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
      {children}
    </span>
  </label>;
}
