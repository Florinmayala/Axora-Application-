import { useState } from 'react';
import AxoraApp from './components/AxoraApp';
import AxoraLaunch from './components/AxoraLaunch';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('axo_session') === 'active'
  );
  const [coins, setCoins] = useState(250);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => localStorage.getItem('axo_theme') === 'dark' ? 'dark' : 'light'
  );

  const updateTheme = (nextTheme: 'dark' | 'light') => {
    setTheme(nextTheme);
    localStorage.setItem('axo_theme', nextTheme);
  };

  return (
    <main className="h-[100dvh] min-h-[480px] w-full overflow-hidden">
      {isAuthenticated ? (
        <AxoraApp
          theme={theme}
          setTheme={updateTheme}
          device="web"
          coins={coins}
          setCoins={setCoins}
        />
      ) : (
        <AxoraLaunch onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </main>
  );
}
