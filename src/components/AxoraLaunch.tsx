import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Flame, LockKeyhole, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface AxoraLaunchProps {
  onAuthenticated: () => void;
  mode?: 'login' | 'resume';
}

export default function AxoraLaunch({ onAuthenticated, mode = 'login' }: AxoraLaunchProps) {
  const [phase, setPhase] = useState<'splash' | 'login'>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (mode === 'resume') {
        onAuthenticated();
      } else {
        setPhase('login');
      }
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [mode, onAuthenticated]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Saisissez votre adresse et votre mot de passe.');
      return;
    }
    sessionStorage.setItem('axo_session', 'active');
    onAuthenticated();
  };

  return (
    <main className="relative w-full h-[100dvh] min-h-[520px] overflow-hidden bg-white text-zinc-950">
      <AnimatePresence mode="wait">
        {phase === 'splash' ? (
          <motion.section
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex items-center justify-center bg-white"
          >
            <motion.svg
              viewBox="0 0 96 112"
              className="w-[74px] h-[86px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1, 1, 0.96] }}
              transition={{ duration: 1.35, times: [0, 0.55, 0.82, 1], ease: 'easeOut' }}
              aria-label="Axora"
            >
              <motion.path
                d="M51 5C53 28 77 31 77 59C77 82 64 101 47 106C59 94 58 80 50 71C49 83 42 91 32 96C22 88 17 76 18 63C19 45 30 33 40 22C45 16 48 10 51 5Z"
                fill="#FF2D55"
                stroke="#FF2D55"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: [0, 1, 1], fillOpacity: [0, 0, 1] }}
                transition={{ duration: 1.15, times: [0, 0.7, 1], ease: 'easeInOut' }}
              />
              <motion.path
                d="M44 100C36 94 33 86 35 78C37 70 43 65 46 58C47 68 56 73 56 83C56 92 51 98 44 100Z"
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.92, duration: 0.2 }}
              />
            </motion.svg>
          </motion.section>
        ) : (
          <motion.section
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.32 }}
            className="relative h-full overflow-y-auto flex items-center justify-center px-5 py-8 bg-white"
          >
            {/* Quiet brand watermarks, deliberately subtle on white. */}
            <Flame className="absolute -left-20 top-[12%] w-64 h-64 text-[#FF2D55] opacity-[0.025] fill-current -rotate-12" />
            <Flame className="absolute -right-24 bottom-[5%] w-80 h-80 text-[#FF2D55] opacity-[0.025] fill-current rotate-12" />

            <div className="relative z-10 w-full max-w-[380px]">
              <div className="mb-9">
                <Flame className="w-10 h-10 fill-[#FF2D55] text-[#FF2D55]" strokeWidth={1.8} />
                <h1 className="mt-6 text-[28px] font-black tracking-[-0.035em]">Connexion à Axora</h1>
                <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">
                  Retrouvez votre espace et vos conversations.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[11px] font-bold text-zinc-800">Adresse électronique</span>
                    <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 focus-within:border-zinc-950">
                      <Mail className="w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={event => {
                          setEmail(event.target.value);
                          setError('');
                        }}
                        placeholder="nom@exemple.com"
                        className="flex-1 min-w-0 bg-transparent outline-none text-[12px] text-zinc-950 placeholder:text-zinc-400"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-bold text-zinc-800">Mot de passe</span>
                    <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 focus-within:border-zinc-950">
                      <LockKeyhole className="w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={event => {
                          setPassword(event.target.value);
                          setError('');
                        }}
                        placeholder="Votre mot de passe"
                        className="flex-1 min-w-0 bg-transparent outline-none text-[12px] text-zinc-950 placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="text-zinc-500 hover:text-zinc-950"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </span>
                  </label>
                </div>

                {error && <p className="mt-3 text-[10px] font-medium text-[#D91B43]">{error}</p>}

                <div className="mt-4 flex items-center justify-between text-[10px]">
                  <label className="flex items-center gap-2 text-zinc-600">
                    <input type="checkbox" className="accent-[#FF2D55]" />
                    Rester connecté
                  </label>
                  <button type="button" className="font-bold text-zinc-950 hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full h-12 rounded-xl bg-[#FF2D55] text-white text-[11px] font-black flex items-center justify-center hover:bg-[#E5264C] active:scale-[0.99] transition-all"
                >
                  Se connecter
                </button>
              </form>

              <p className="mt-7 text-center text-[10px] text-zinc-600">
                Pas encore de compte ?{' '}
                <button className="font-bold text-zinc-950 hover:underline">Créer un compte</button>
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
