import { useState } from 'react';
import AxoraApp from './components/AxoraApp';

export default function App() {
  const [coins, setCoins] = useState(250);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => localStorage.getItem('axo_theme') === 'light' ? 'light' : 'dark'
  );

  const updateTheme = (nextTheme: 'dark' | 'light') => {
    setTheme(nextTheme);
    localStorage.setItem('axo_theme', nextTheme);
  };

  return (
    <main className="h-[100dvh] min-h-[480px] w-full overflow-hidden">
      <AxoraApp
        theme={theme}
        setTheme={updateTheme}
        device="web"
        coins={coins}
        setCoins={setCoins}
      />
    </main>
  );
}
