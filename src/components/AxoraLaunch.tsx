import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Flame, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface AxoraLaunchProps {
  onAuthenticated: () => void;
}

const FLOATING_FLAMES = [
  { left: '7%', top: '12%', size: 52, duration: 7.2, delay: 0.2, drift: 22, opacity: 0.08 },
  { left: '18%', top: '68%', size: 88, duration: 9.5, delay: 1.1, drift: -18, opacity: 0.06 },
  { left: '73%', top: '8%', size: 74, duration: 8.4, delay: 0.7, drift: 20, opacity: 0.07 },
  { left: '86%', top: '61%', size: 112, duration: 10.2, delay: 1.6, drift: -24, opacity: 0.05 },
  { left: '57%', top: '78%', size: 44, duration: 6.8, delay: 0.4, drift: 16, opacity: 0.09 },
  { left: '36%', top: '22%', size: 34, duration: 7.8, delay: 1.9, drift: -14, opacity: 0.06 }
];

export default function AxoraLaunch({ onAuthenticated }: AxoraLaunchProps) {
  const [phase, setPhase] = useState<'splash' | 'login'>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('login'), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Renseignez votre adresse et votre mot de passe.');
      return;
    }
    sessionStorage.setItem('axo_session', 'active');
    onAuthenticated();
  };

  return (
    <main className="relative w-full h-[100dvh] min-h-[520px] overflow-hidden bg-[#070708] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,45,85,0.15),transparent_35%),linear-gradient(145deg,#050506,#0d090b_55%,#050506)]" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_FLAMES.map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, rotate: -8, opacity: 0 }}
            animate={{
              y: [18, -28, 18],
              x: [0, item.drift, 0],
              rotate: [-8, 9, -8],
              opacity: [item.opacity * 0.45, item.opacity, item.opacity * 0.45]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute"
            style={{ left: item.left, top: item.top }}
          >
            <Flame
              width={item.size}
              height={item.size}
              className="fill-[#FF2D55] text-[#FF2D55]"
              strokeWidth={1}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'splash' ? (
          <motion.section
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              {[1, 2, 3].map(ring => (
                <motion.span
                  key={ring}
                  initial={{ scale: 0.35, opacity: 0 }}
                  animate={{ scale: [0.45, 1.3 + ring * 0.22], opacity: [0, 0.28, 0] }}
                  transition={{ duration: 1.45, delay: ring * 0.13, ease: 'easeOut' }}
                  className="absolute w-28 h-28 rounded-full border border-[#FF2D55]"
                />
              ))}

              <motion.div
                initial={{ scale: 0.2, rotate: -22, opacity: 0 }}
                animate={{
                  scale: [0.2, 1.18, 0.96, 1],
                  rotate: [-22, 7, -3, 0],
                  opacity: 1
                }}
                transition={{ duration: 1.05, times: [0, 0.58, 0.8, 1], ease: 'easeOut' }}
                className="relative w-24 h-24 flex items-center justify-center"
              >
                <motion.span
                  animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="absolute inset-1 rounded-[36px] bg-[#FF2D55]/25 blur-xl"
                />
                <Flame className="relative w-20 h-20 fill-[#FF2D55] text-[#FF2D55] drop-shadow-[0_0_24px_rgba(255,45,85,0.65)]" strokeWidth={1.6} />
                <motion.span
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 25, opacity: [0, 1, 0.65] }}
                  transition={{ delay: 0.65, duration: 0.45 }}
                  className="absolute bottom-5 w-3 rounded-full bg-white/80 blur-[1px]"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12, letterSpacing: '0.7em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.32em' }}
              transition={{ delay: 0.82, duration: 0.55 }}
              className="mt-6 text-center"
            >
              <h1 className="text-xl font-black uppercase">Axora</h1>
              <p className="mt-2 text-[8px] uppercase tracking-[0.24em] text-zinc-500">Allumez votre monde</p>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section
            key="login"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative z-10 h-full flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[390px]">
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0.75, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 190, damping: 15 }}
                  className="relative w-16 h-16 mx-auto rounded-[24px] border border-[#FF2D55]/30 bg-[#FF2D55]/10 flex items-center justify-center"
                >
                  <Flame className="w-9 h-9 fill-[#FF2D55] text-[#FF2D55] drop-shadow-[0_0_12px_rgba(255,45,85,0.55)]" />
                  <Sparkles className="absolute -right-2 -top-2 w-4 h-4 text-amber-300" />
                </motion.div>
                <h1 className="mt-5 text-2xl font-black tracking-tight">Rallumez votre espace</h1>
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                  Connectez-vous pour retrouver vos discussions, créations et flammes.
                </p>
              </div>

              <form onSubmit={handleLogin} className="rounded-[30px] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/50">
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-500 font-bold">Adresse électronique</span>
                    <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-[#FF2D55]/50">
                      <Mail className="w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={event => {
                          setEmail(event.target.value);
                          setError('');
                        }}
                        placeholder="vous@axora.social"
                        className="h-12 flex-1 min-w-0 bg-transparent outline-none text-xs text-white placeholder:text-zinc-600"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-500 font-bold">Mot de passe</span>
                    <span className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-[#FF2D55]/50">
                      <LockKeyhole className="w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={event => {
                          setPassword(event.target.value);
                          setError('');
                        }}
                        placeholder="Votre mot de passe"
                        className="h-12 flex-1 min-w-0 bg-transparent outline-none text-xs text-white placeholder:text-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="text-zinc-500 hover:text-white"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </span>
                  </label>
                </div>

                {error && <p className="mt-3 text-[10px] text-[#FF2D55]">{error}</p>}

                <div className="mt-3 flex items-center justify-between text-[9px]">
                  <label className="flex items-center gap-2 text-zinc-500">
                    <input type="checkbox" className="accent-[#FF2D55]" />
                    Rester connecté
                  </label>
                  <button type="button" className="font-bold text-[#FF2D55] hover:text-red-400">Mot de passe oublié ?</button>
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full h-12 rounded-2xl bg-[#FF2D55] text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,45,85,0.28)] hover:bg-[#ff4165] active:scale-[0.98] transition-all"
                >
                  <Flame className="w-4 h-4 fill-current" />
                  Entrer dans Axora
                </button>
              </form>

              <p className="mt-5 text-center text-[9px] text-zinc-600">
                Nouveau ici ? <button className="text-zinc-300 font-bold hover:text-white">Créer une identité Axora</button>
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
