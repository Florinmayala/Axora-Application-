import { useState } from 'react';
import AxoraApp from './components/AxoraApp';

export default function App() {
  const [coins, setCoins] = useState(250);

  return (
    <main className="h-[100dvh] min-h-[480px] w-full overflow-hidden bg-[#0F0F0F]">
      <AxoraApp
        theme="dark"
        device="web"
        coins={coins}
        setCoins={setCoins}
      />
    </main>
  );
}
