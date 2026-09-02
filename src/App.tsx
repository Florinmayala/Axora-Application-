import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import AxoraApp from './components/AxoraApp';
import AxoraLaunch from './components/AxoraLaunch';

export default function App() {
  const [appError, setAppError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('axo_session') === 'active'
  );
  const [showResumeSplash, setShowResumeSplash] = useState(false);
  const [coins, setCoinsState] = useState(250);
  const setCoins: Dispatch<SetStateAction<number>> = useCallback((value) => {
    setCoinsState(current => {
      const next = typeof value === 'function' ? value(current) : value;
      return Math.max(0, Math.min(250, next));
    });
  }, []);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => localStorage.getItem('axo_theme') === 'dark' ? 'dark' : 'light'
  );

  const updateTheme = (nextTheme: 'dark' | 'light') => {
    setTheme(nextTheme);
    localStorage.setItem('axo_theme', nextTheme);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('axo_session');
    sessionStorage.removeItem('axo_background_at');
    setShowResumeSplash(false);
    setIsAuthenticated(false);
  };

  const finishResume = useCallback(() => {
    sessionStorage.removeItem('axo_background_at');
    setShowResumeSplash(false);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isAuthenticated) return;

      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem('axo_background_at', String(Date.now()));
        return;
      }

      const backgroundAt = Number(sessionStorage.getItem('axo_background_at') || 0);
      if (backgroundAt && Date.now() - backgroundAt >= 5 * 60 * 1000) {
        setShowResumeSplash(true);
      } else {
        sessionStorage.removeItem('axo_background_at');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (document.visibilityState === 'visible') handleVisibilityChange();
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleError = () => setAppError(true);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => { window.removeEventListener('error', handleError); window.removeEventListener('unhandledrejection', handleError); };
  }, []);

  if (appError) return <main className="h-[100dvh] w-full overflow-hidden"><section role="alert" className="flex h-full items-center justify-center bg-zinc-950 p-6 text-center text-white"><div className="max-w-sm rounded-[28px] border border-red-500/30 bg-zinc-900 p-7"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">Erreur Axora</p><h1 className="mt-3 text-2xl font-black">Un écran n’a pas pu s’afficher.</h1><p className="mt-3 text-sm leading-relaxed text-zinc-400">Vos données locales ne sont pas perdues. Réessayez ou rechargez l’application.</p><div className="mt-6 flex gap-2"><button type="button" onClick={() => setAppError(false)} className="flex-1 rounded-xl border border-white/15 py-3 text-xs font-black">Réessayer</button><button type="button" onClick={() => window.location.reload()} className="flex-1 rounded-xl bg-[#FF2D55] py-3 text-xs font-black">Recharger</button></div></div></section></main>;

  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      {showResumeSplash ? (
        <AxoraLaunch mode="resume" onAuthenticated={finishResume} />
      ) : isAuthenticated ? (
        <AxoraApp
          theme={theme}
          setTheme={updateTheme}
          device="web"
          coins={coins}
          setCoins={setCoins}
          onLogout={handleLogout}
        />
      ) : (
        <AxoraLaunch onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </main>
  );
}
