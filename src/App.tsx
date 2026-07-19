import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Globe, 
  Moon, 
  Sun, 
  Terminal, 
  Sparkles,
  BookOpen,
  Eye,
  Settings,
  Flame,
  Award,
  ExternalLink,
  Github,
  X
} from 'lucide-react';
import AxoraApp from './components/AxoraApp';

export default function App() {
  // Simulator configuration states
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [deviceSelection, setDeviceSelection] = useState<'mobile' | 'tablet' | 'desktop' | 'web'>('mobile');
  const [axoCoins, setAxoCoins] = useState<number>(250);

  // Interactive helper instructions toggle
  const [showTips, setShowTips] = useState<boolean>(true);

  // Background gradient configuration
  const overallBg = themeMode === 'dark' 
    ? 'bg-[#0F0F0F] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#0F0F0F] to-[#0F0F0F] text-zinc-100' 
    : 'bg-[#F9F9FB] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-neutral-50 to-[#F9F9FB] text-zinc-900';

  return (
    <div className={`min-h-screen ${overallBg} font-sans overflow-x-hidden pb-10 transition-colors duration-300`}>
      
      {/* 🚀 STUDIO HEADER BANNER */}
      <div className={`border-b ${themeMode === 'dark' ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-white/40'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#FF2D55] rounded-md text-[9px] font-mono font-bold tracking-widest text-white uppercase animate-pulse">
                Maquette Interactive
              </span>
              <span className="text-zinc-500 font-mono text-[10px]">•</span>
              <span className="text-zinc-400 font-mono text-[10px]">Secure by Afri-Tech</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 bg-clip-text">
              Axora App <span className="text-[#FF2D55] font-mono font-normal">Studio Simulator</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Architecture en Bento UI avec système d'états d'appels, flux Reels, Pop Sessions collectives et bascule bilatérale Sombre/Clair.
            </p>
          </div>

          {/* Master theme selector and tabs controls */}
          <div className="flex flex-wrap items-center gap-3">
                 {/* Sombre/Clair Selector */}
            <div className={`flex p-1 rounded-xl border ${themeMode === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-zinc-100 border-zinc-300'}`}>
              <button 
                id="btn-theme-dark"
                onClick={() => setThemeMode('dark')}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                  themeMode === 'dark' ? 'bg-[#FF2D55] text-white shadow-md shadow-[#FF2D55]/20' : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sombre</span>
              </button>
              
              <button 
                id="btn-theme-light"
                onClick={() => setThemeMode('light')}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                  themeMode === 'light' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Clair</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 🚀 MAIN STUDIO VIEWPORT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col items-center justify-center">
        
        {/* CENTERED COLUMN: THE MOCKUP DEVICE SIMULATION */}
        <div className="w-full flex flex-col items-center space-y-6">
            
            {/* DEVICE SELECTOR CONTROLLER BAR */}
            <div className={`w-full max-w-md p-2 rounded-2xl border flex items-center justify-between gap-1.5 ${
              themeMode === 'dark' ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100 border-zinc-200'
            }`}>
              <button
                onClick={() => setDeviceSelection('mobile')}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  deviceSelection === 'mobile' ? 'bg-[#FF2D55] text-white font-semibold shadow-lg shadow-[#FF2D55]/15' : 'text-zinc-400 hover:text-zinc-850'
                }`}
                title="Format Smartphone"
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-tight">Mobile</span>
              </button>

              <button
                onClick={() => setDeviceSelection('tablet')}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  deviceSelection === 'tablet' ? 'bg-[#FF2D55] text-white font-semibold shadow-lg shadow-[#FF2D55]/15' : 'text-zinc-400 hover:text-zinc-850'
                }`}
                title="Format Tablette"
              >
                <Tablet className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-tight">Tablette</span>
              </button>

              <button
                onClick={() => setDeviceSelection('desktop')}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  deviceSelection === 'desktop' ? 'bg-[#FF2D55] text-white font-semibold shadow-lg shadow-[#FF2D55]/15' : 'text-zinc-400 hover:text-zinc-850'
                }`}
                title="Format Desktop"
              >
                <Monitor className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-tight">Desktop</span>
              </button>

              <button
                onClick={() => setDeviceSelection('web')}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  deviceSelection === 'web' ? 'bg-[#FF2D55] text-white font-semibold shadow-lg shadow-[#FF2D55]/15' : 'text-zinc-400 hover:text-zinc-850'
                }`}
                title="Format Web Plein"
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-tight">Web</span>
              </button>
            </div>

            {/* LIVE DEVICE CANVAS RENDERING */}
            <div className="w-full flex justify-center items-center">
              
              {/* MOBILE FRAME (Sleek Phone Notch Simulator) */}
              {deviceSelection === 'mobile' && (
                <div className="w-full max-w-[364px] h-[720px] bg-zinc-950 rounded-[44px] border-8 border-neutral-800 relative shadow-2xl flex flex-col overflow-hidden ring-4 ring-neutral-900/30">
                  {/* Smartphone Notch Camera */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 bg-zinc-900 rounded-full mr-2" />
                    <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                  </div>
                  
                  {/* Active Simulator app inside */}
                  <div className="flex-1 w-full h-full overflow-hidden relative">
                    <AxoraApp theme={themeMode} device={deviceSelection} coins={axoCoins} setCoins={setAxoCoins} />
                  </div>
                </div>
              )}

              {/* TABLET FRAME (iPad style bezel) */}
              {deviceSelection === 'tablet' && (
                <div className="w-full max-w-[580px] h-[720px] bg-zinc-950 rounded-[38px] border-[16px] border-neutral-800 relative shadow-2xl flex flex-col overflow-hidden ring-4 ring-neutral-900/40">
                  {/* Tablet Bezel details */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900 rounded-full z-50" />
                  
                  <div className="flex-1 w-full h-full overflow-hidden relative">
                    <AxoraApp theme={themeMode} device={deviceSelection} coins={axoCoins} setCoins={setAxoCoins} />
                  </div>
                </div>
              )}

              {/* DESKTOP FRAME (iMac styled Monitor Bezel & Stand) */}
              {deviceSelection === 'desktop' && (
                <div className="w-full max-w-[840px] flex flex-col items-center">
                  <div className="w-full h-[520px] bg-zinc-950 rounded-2xl border-[10px] border-neutral-800 relative shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex-1 w-full h-full overflow-hidden relative">
                      <AxoraApp theme={themeMode} device={deviceSelection} coins={axoCoins} setCoins={setAxoCoins} />
                    </div>
                  </div>
                  {/* Desktop Stands details */}
                  <div className="w-24 h-16 bg-neutral-800 rounded-b-lg border-x-4 border-b-4 border-neutral-700" />
                  <div className="w-40 h-2 bg-neutral-700 rounded-full shadow-md" />
                </div>
              )}

              {/* FULL RESPONSIVE WEB FRAME */}
              {deviceSelection === 'web' && (
                <div className="w-full h-[720px] min-w-full rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
                  <AxoraApp theme={themeMode} device={deviceSelection} coins={axoCoins} setCoins={setAxoCoins} />
                </div>
              )}

            </div>

            {/* IN-SIMULATOR CONTROLS */}
            <div className={`p-4 rounded-2xl border w-full text-center ${
              themeMode === 'dark' ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
            }`}>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-zinc-300">⚙️ Simulateur de Coins Axo :</span>
                <p className="text-[11px] text-zinc-500">Ajustez le solde pour tester le badge de récompense dynamique dans le header</p>
                <div className="flex justify-center items-center gap-2 pt-2.5">
                  <button onClick={() => setAxoCoins(Math.max(0, axoCoins - 50))} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold">
                    -50 🪙
                  </button>
                  <span className="text-xs font-mono font-black text-white px-3 bg-[#FF2D55] shadow-sm rounded-md py-0.5">{axoCoins} Coins</span>
                  <button onClick={() => setAxoCoins(axoCoins + 50)} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold">
                    +50 🪙
                  </button>
                </div>
              </div>
            </div>

          </div>

      </main>

      {/* 🔮 CREDIT FOOTER */}
      <footer className="mt-16 text-center text-xs text-zinc-500 space-y-2 border-t border-zinc-900 pt-6">
        <p>© 2026 Axora Co. All Rights Reserved. Securisé par Afri-Tech.</p>
        <p className="text-[10px] max-w-md mx-auto">
          Cette démonstration présente une maquette interactive haute fidélité d'Axora App, intégrant les directives d'adaptation de design Bento, de notifications et de matchmaking réactif.
        </p>
      </footer>

    </div>
  );
}
