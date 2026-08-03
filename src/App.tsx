import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import AxoraApp from './components/AxoraApp';
import AxoraLaunch from './components/AxoraLaunch';

export default function App() {
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
