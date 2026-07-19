import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Flame, 
  User, 
  Clapperboard, 
  Info,
  Smartphone,
  Sparkles,
  Download
} from 'lucide-react';

export default function JetpackComposeShowcase() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isLiveLocal, setIsLiveLocal] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // The actual Kotlin Jetpack Compose code written in /ProfileScreen.kt
  const kotlinCode = `package com.axora.app.ui.profile

import androidx.compose.animation.Crossfade
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.TileMode
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ==========================================
// 🎨 AXORA PREMIUM SYSTEM DESIGN TOKENS
// ==========================================

object AxoraTheme {
    val Pink = Color(0xFFFF2D55)      // AxoraPink: Core accents and actions
    val Cyan = Color(0xFF22D3EE)      // AxoraCyan: Active status indicators and Pop Sessions
    val Violet = Color(0xFFA855F7)    // AxoraViolet: Playful highlights
    val Gold = Color(0xFFF59E0B)      // Premium Gold: Gamification & Coins
    val VerifiedGreen = Color(0xFF34D399) // Emerald: Certification Checked Badge

    // Surface Palette (Cybernetic Charcoal Colors for OLED Contrast)
    val Background = Color(0xFF0C0C0E)
    val SurfaceDark = Color(0xFF141416)
    val SurfaceLight = Color(0xFF1C1C1F)
    val BorderGlass = Color(0xFFFFFFFF).copy(alpha = 0.08f)
    val TextPrimary = Color(0xFFFFFFFF)
    val TextSecondary = Color(0xFFA1A1AA)

    // Layout Shapes
    val BentoShape = RoundedCornerShape(28.dp)
    val PillShape = RoundedCornerShape(100.dp)
}

// ==========================================
// 🚀 MAIN IMMERSIVE PROFILE COMPONENT
// ==========================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onBackClick: () -> Unit = {},
    onEditProfileClick: () -> Unit = {},
    onJoinPopSessionClick: () -> Unit = {}
) {
    // Component State declarations
    var isLive by remember { mutableStateOf(true) }
    var selectedTab by remember { mutableStateOf(ProfileTab.POSTS) }

    // Mock profiles inputs
    val userName = "Auteur Invité"
    val userTag = "@invite_axo"
    val userBio = "🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créatif de l'écosystème Axora. Toujours à la recherche des meilleurs débats..."

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = userName,
                        fontFamily = FontFamily.SansSerif,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp,
                        color = AxoraTheme.TextPrimary,
                        letterSpacing = 1.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Go Back",
                            tint = AxoraTheme.TextPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = AxoraTheme.Background,
                    titleContentColor = AxoraTheme.TextPrimary
                )
            )
        },
        containerColor = AxoraTheme.Background
    ) { innerPadding ->
        
        // Single LazyColumn strategy avoids all nested scroll conflicts
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(AxoraTheme.Background),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            
            // 1️⃣ Header Layer (Live Banner & Verified Avatar Ring)
            item {
                ProfileHeaderSection(
                    userName = userName,
                    userTag = userTag,
                    isLive = isLive,
                    onAvatarClick = { isLive = !isLive }
                )
            }

            // 2️⃣ Gamified Metrics Cell (Followers, Total Views, Premium Coins Counter)
            item {
                GamifiedMetricsDashboard()
            }

            // 3️⃣ Asymmetric Profile Core (Bio Hub, Live Reel Tall display, Pop Session)
            item {
                InteractiveBentoGrid(
                    userBio = userBio,
                    onJoinPopSessionClick = onJoinPopSessionClick
                )
            }

            // 4️⃣ Content Matrix Tabs Switcher ("POSTS", "REELS", "SAVED")
            item {
                ContentTabsSelection(
                    selectedTab = selectedTab,
                    onTabChanged = { selectedTab = it }
                )
            }

            // 5️⃣ Content Matrix Items list
            item {
                ContentPortfolioArchive(selectedTab = selectedTab)
            }
        }
    }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(kotlinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([kotlinCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ProfileScreen.kt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Simulated content based on current active state tab
  const activePostData = {
    posts: [
      { id: 1, tag: 'DESIGN', title: 'Bento Grid Redesign x2', desc: "Exploration de l'asymétrie active.", color: '#FF2D55' },
      { id: 2, tag: 'ENGINE', title: 'Interactive Code Review', desc: 'Performances audio Pop session.', color: '#22D3EE' },
      { id: 3, tag: 'TECH', title: "L'Afrique en Tech Meetup", desc: 'Première édition physique réussie.', color: '#22D3EE' },
      { id: 4, tag: 'VISION', title: 'Build for the culture, deploy globally', desc: 'Manifesto pour la culture dev.', color: '#FF2D55' }
    ],
    reels: [
      { id: 5, tag: 'REEL', title: 'Tuto Bento Design de Précision', desc: '1.2M views • 30s de pure ui.', color: '#FF2D55' },
      { id: 6, tag: 'LIVE', title: 'Pop Session Highlights #1', desc: '840K views • 15s débriefing.', color: '#22D3EE' },
      { id: 7, tag: 'DEV', title: 'Clean Kotlin review PRs', desc: '420K views • Guide matériel 3.', color: '#22D3EE' }
    ],
    saved: [
      { id: 8, tag: 'TOOLS', title: 'CSS Custom Animation Easing', desc: 'Courbes de bézier pré-paramétrées.', color: '#FF2D55' },
      { id: 9, tag: 'TRUST', title: 'Asymmetric Cryptography Basics', desc: 'Simulations de clés de chiffrement.', color: '#22D3EE' }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* ==========================================
          📱 COLUMN 1: INTERACTIVE EMULATOR MODEL
         ========================================== */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-[340px] rounded-[48px] border-[10px] border-[#1D1D20] bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.1)] overflow-hidden relative">
          
          {/* Bezel Gloss Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-b-2xl z-50 flex items-center justify-between px-4">
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]/60 block" />
            </div>
            <div className="w-8 h-1 bg-zinc-800 rounded-full" />
          </div>

          {/* Android Screen Container */}
          <div className="w-full bg-[#0C0C0E] text-white flex flex-col relative select-none font-sans overflow-hidden">
            
            {/* 🔋 MOCK ANDROID STATUS BAR */}
            <div className="h-10 pt-4.5 px-6 flex justify-between items-center text-[9px] font-mono tracking-wider text-zinc-400 bg-black/40 z-40 relative">
              <span className="font-bold flex items-center gap-1">
                AXA 5G <Flame className="w-2.5 h-2.5 text-[#FF2D55] animate-pulse" />
              </span>
              <div className="flex items-center gap-2">
                <span>100%</span>
                <div className="w-5 h-2.5 border border-zinc-650 rounded-xs p-0.5 flex items-center">
                  <div className="w-full h-full bg-[#22D3EE] rounded-2xs" />
                </div>
                <span className="font-bold text-zinc-300">14:35</span>
              </div>
            </div>

            {/* 🏷️ MOCK COLLAPSING TOP BAR */}
            <div className="h-12 border-b border-white/5 bg-[#0C0C0E] px-4 flex justify-between items-center z-40 relative">
              <button className="p-1 rounded-full hover:bg-white/5 active:scale-90 transition-all text-zinc-300">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black tracking-widest text-zinc-100 uppercase">Auteur Invité</span>
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] text-zinc-500 font-mono">AX</div>
            </div>

            {/* IMMERSIVE SCROLLING WRAPPER */}
            <div className="overflow-y-auto max-h-[500px] px-3.5 py-3 space-y-4 pb-8 scrollbar-thin">
              
              {/* 📸 HEADER PREVIEW COMPONENT */}
              <div className="rounded-2xl border border-white/5 bg-[#141416] overflow-hidden relative">
                
                {/* Banner backdrop with glowing mesh */}
                <div className="h-24 bg-gradient-to-r from-zinc-950 via-[#1C1C1F] to-zinc-950 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#FF2D55]/10 animate-pulse pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#141416] to-transparent" />
                  
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[7px] font-bold text-[#FF2D55] tracking-widest uppercase animate-pulse">
                    LIVE REEL
                  </span>
                </div>

                {/* Avatar overlays */}
                <div className="px-4 pb-4 -mt-10 flex flex-col items-center relative z-10">
                  <div 
                    onClick={() => setIsLiveLocal(!isLiveLocal)}
                    className={`relative w-18 h-18 rounded-full p-[2.5px] cursor-pointer bg-gradient-to-tr transition-all duration-500 hover:scale-105 active:scale-95 ${
                      isLiveLocal 
                        ? 'from-[#22D3EE] to-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                        : 'from-[#FF2D55] to-[#E11D48] shadow-[0_0_12px_rgba(255,45,85,0.4)]'
                    }`}
                    title="Cliquez pour permuter la couleur"
                  >
                    <div className="w-full h-full rounded-full bg-zinc-950 border border-black flex items-center justify-center bg-cover bg-center">
                      <span className={`text-base font-black tracking-tight ${isLiveLocal ? 'text-[#22D3EE]' : 'text-[#FF2D55]'}`}>AX</span>
                    </div>
                  </div>

                  <div className="text-center mt-2.5 space-y-1">
                    <div className="flex items-center justify-center gap-1 font-bold text-xs text-white">
                      <span>Auteur Invité</span>
                      <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-400/15" />
                    </div>
                    
                    <div className="text-[9px] text-zinc-500 font-mono">@invite_axo</div>

                    {/* Status capsule bubble badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-zinc-300 mt-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      Coding the matrix...
                    </div>
                  </div>
                </div>
              </div>

              {/* 📊 GAMIFIED METRICS PANEL */}
              <div className="rounded-2xl border border-white/5 bg-[#141416] p-4 flex items-center justify-between gap-2.5">
                <div className="flex items-center justify-around flex-1 text-center divide-x divide-white/5">
                  <div className="flex-1 pr-1">
                    <div className="text-[7px] font-black tracking-wider text-[#FF2D55] font-mono">FOLLOWERS</div>
                    <div className="text-sm font-black text-white mt-0.5">14.8K</div>
                    <div className="text-[7px] text-emerald-400 font-bold font-mono">▲ +12%</div>
                  </div>
                  <div className="flex-1 pl-1">
                    <div className="text-[7px] font-black tracking-wider text-[#22D3EE] font-mono font-mono">TOTAL VIEWS</div>
                    <div className="text-sm font-black text-white mt-0.5">5.8M</div>
                    <div className="text-[7px] text-zinc-500 font-mono">cumulées</div>
                  </div>
                </div>

                {/* Pop Coins sub capsule nested */}
                <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-1.5 shrink-0">
                  <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-[6px] font-bold text-amber-500/70 font-mono">AXORA COINS</div>
                    <div className="text-[8px] font-black   text-amber-400 font-mono">250 coins</div>
                  </div>
                </div>
              </div>

              {/* 🧩 ASYMMETRIC BENTO GRID ELEMENTS */}
              <div className="grid grid-cols-1 gap-3">
                
                {/* Bio Block & Plugs */}
                <div className="rounded-2xl border border-white/5 bg-[#141416] p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-1 text-[7px] font-black tracking-wider text-[#FF2D55] font-mono">
                    <User className="w-2.5 h-2.5" /> BIOGRAPHIE ET LIENS
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    🌟 Explorateur des interfaces Bento, amoureux des esthétiques cyberpunk et créatif de l'écosystème Axora.
                  </p>
                  
                  {/* Glowing link tag pills */}
                  <div className="flex gap-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-mono bg-[#FF2D55]/10 border border-[#FF2D55]/20 text-[#FF2D55]">
                      @invite_axo
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      axora.design
                    </span>
                  </div>
                </div>

                {/* Horizontally split second Row */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Live Reel showcase preview */}
                  <div className="rounded-2xl border border-white/5 bg-[#161619] relative overflow-hidden group/m hover:border-[#FF2D55]/30 p-3 h-30 flex flex-col justify-between">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[6px] font-black text-[#FF2D55] font-mono tracking-wide">PINNED REEL</span>
                      <span className="text-[6px] px-1 bg-black/50 rounded font-mono text-white/80">2.5M</span>
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black tracking-tight text-white leading-tight">Compose v3 Easing</h4>
                      <p className="text-[7px] text-zinc-500 font-mono">Micro-animations</p>
                    </div>
                  </div>

                  {/* Pop session capsule */}
                  <div className="rounded-2xl border border-[#22D3EE]/30 bg-[#141416] p-3 flex flex-col justify-between h-30 hover:border-cyan-400 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[6.5px] font-black tracking-widest text-[#22D3EE] font-mono">POP SESSION</span>
                      <span className="text-[5px] bg-[#22D3EE]/15 text-cyan-400 font-black px-1 py-0.2 rounded uppercase">LIVE NOW</span>
                    </div>
                    
                    <div>
                      <h4 className="text-[8px] font-extrabold text-white leading-tight line-clamp-2">Review Neon Bento Layouts</h4>
                    </div>

                    <button className="w-full mt-1.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[7px] font-black tracking-widest uppercase rounded border border-cyan-500/30">
                      REJOINDRE
                    </button>
                  </div>

                </div>
              </div>

              {/* 🎛️ SLIDER TAB CHIPS */}
              <div className="p-1.5 rounded-full bg-white/[0.02] border border-white/5 flex gap-1 bg-zinc-950/70">
                {(['posts', 'reels', 'saved'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-1.5 rounded-full text-[8.5px] font-bold tracking-widest font-mono uppercase transition-all duration-300 ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-[#FF2D55]/20 to-[#FF2D55]/5 border border-[#FF2D55]/25 text-white' 
                        : 'text-zinc-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 📦 MATRIX PORTFOLIO MEDIA ARCHIVE */}
              <div className="grid grid-cols-2 gap-2.5">
                {activePostData[activeTab].map((p) => (
                  <div 
                    key={p.id}
                    className="p-3 rounded-xl border border-white/5 bg-[#141416] flex flex-col justify-between gap-3 min-h-24 hover:border-[#FF2D55]/15 transition-all text-left"
                  >
                    <span 
                      className="px-1.5 py-0.5 rounded text-[5px] font-mono font-black self-start"
                      style={{ 
                        backgroundColor: p.color === '#FF2D55' ? 'rgba(255,45,85,0.08)' : 'rgba(34,211,238,0.08)',
                        color: p.color
                      }}
                    >
                      {p.tag}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="text-[9.5px] font-extrabold text-white leading-tight line-clamp-2">{p.title}</h5>
                      <p className="text-[8px] text-zinc-500 font-sans leading-normal">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Simulated Android Home Indicator bar */}
            <div className="h-6 pb-2.5 flex items-center justify-center bg-black/40 z-40 relative">
              <div className="w-24 h-1 bg-zinc-700 rounded-full" />
            </div>

          </div>
        </div>

        {/* Tactile indicator annotation */}
        <div className="flex items-center gap-2 mt-4 text-[11px] text-zinc-500 font-mono">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Pixels Emulated Live-Interactive Preview
        </div>
      </div>

      {/* ==========================================
          📂 COLUMN 2: KOTLIN CODE HUB & METADATA
         ========================================== */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Code Header Bar Capsule */}
        <div className="p-5 rounded-3xl border border-white/5 bg-[#141416]/90 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="px-2.5 py-1 text-[9px] font-bold font-mono tracking-widest text-[#22D3EE] bg-[#22D3EE]/8 rounded uppercase border border-[#22D3EE]/20">KOTLIN / COMPOSE v3</span>
                <span className="text-[10px] text-zinc-500 font-mono">src/ui/profile/ProfileScreen.kt</span>
              </div>
              <h3 className="text-sm font-black text-white font-mono mt-1">ProfileScreen.kt</h3>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-white font-bold rounded-xl border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-2.5 bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] font-bold rounded-xl border border-[#22D3EE]/20 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Download Source Code .kt file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-sans">
            This premium Jetpack Compose screen merges a dark neon visual design with state-of-the-art Android architectures. It replaces raw nested layouts with a decoupled, unified single-level <strong>LazyColumn</strong> hierarchy to completely eliminate <em>Nested Scrolling Conflicts</em>, ensuring smooth 60fps framerates on mobile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5 text-[10.5px] text-zinc-400 font-mono">
            <div className="flex items-start gap-2 bg-black/25 p-3 rounded-xl border border-white/5">
              <Sparkles className="w-4 h-4 text-[#FF2D55] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Asymmetric Bento Layout</strong>
                Replaces rigid matrix divisions with responsive groups of vertical/horizontal columns.
              </div>
            </div>
            <div className="flex items-start gap-2 bg-black/25 p-3 rounded-xl border border-white/5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Material 3 ColorTokens</strong>
                Native support for dark/light themes via custom local tokens instead of hardcoded hex values.
              </div>
            </div>
          </div>
        </div>

        {/* 💻 HIGHLY FORMATTED SCROLLABLE KOTLIN CODE BLOCK */}
        <div className="rounded-3xl border border-white/5 bg-[#09090A] overflow-hidden shadow-2xl relative select-text">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#0F0F11]">
            <span className="text-[9.5px] font-bold text-zinc-500 tracking-widest uppercase font-mono">KOTLIN COMPOSE CODE VISUALIZER</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Code panel with line markings */}
          <div className="max-h-[380px] overflow-y-auto overflow-x-auto p-5 text-[10.5px] font-mono leading-relaxed bg-[#0C0C0E]">
            <pre className="text-left text-zinc-350 select-text">
              <code>
<span className="text-zinc-500 font-semibold select-none">  1: </span><span className="text-[#FF2D55]">package</span> com.axora.app.ui.profile{"\n"}
<span className="text-zinc-500 font-semibold select-none">  2: </span>{"\n"}
<span className="text-zinc-500 font-semibold select-none">  3: </span><span className="text-[#FF2D55]">import</span> androidx.compose.animation.*{"\n"}
<span className="text-zinc-500 font-semibold select-none">  4: </span><span className="text-[#FF2D55]">import</span> androidx.compose.foundation.layout.*{"\n"}
<span className="text-zinc-500 font-semibold select-none">  5: </span><span className="text-[#98C379]">// ... other Compose core component imports</span>{"\n"}
<span className="text-zinc-500 font-semibold select-none">  6: </span>{"\n"}
<span className="text-zinc-500 font-semibold select-none">  7: </span><span className="text-zinc-500">// 🎨 AXORA PREMIUM SYSTEM DESIGN TOKENS</span>{"\n"}
<span className="text-zinc-500 font-semibold select-none">  8: </span><span className="text-[#FF2D55]">object</span> <span className="text-[#22D3EE] font-bold">AxoraTheme</span> &#123;{"\n"}
<span className="text-zinc-500 font-semibold select-none">  9: </span>    <span className="text-[#FF2D55]">val</span> Pink = Color(<span className="text-amber-400">0xFFFF2D55</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 10: </span>    <span className="text-[#FF2D55]">val</span> Cyan = Color(<span className="text-amber-400">0xFF22D3EE</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 11: </span>    <span className="text-[#FF2D55]">val</span> Violet = Color(<span className="text-amber-400">0xFFA855F7</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 12: </span>    <span className="text-[#FF2D55]">val</span> Gold = Color(<span className="text-amber-400">0xFFF59E0B</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 13: </span>    <span className="text-[#FF2D55]">val</span> Background = Color(<span className="text-amber-400">0xFF0C0C0E</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 14: </span>    <span className="text-[#FF2D55]">val</span> SurfaceDark = Color(<span className="text-amber-400">0xFF141416</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 15: </span>    <span className="text-[#FF2D55]">val</span> BentoShape = RoundedCornerShape(<span className="text-amber-400">28.dp</span>){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 16: </span>&#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 17: </span>{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 18: </span><span className="text-zinc-500">// 🚀 MAIN IMMERSIVE PROFILE COMPONENT</span>{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 19: </span><span className="text-amber-500">@Composable</span>{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 20: </span><span className="text-[#FF2D55]">fun</span> <span className="text-[#22D3EE] font-bold">ProfileScreen</span>(onBackClick: () -&gt; Unit) &#123;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 21: </span>    <span className="text-[#FF2D55]">var</span> isLive <span className="text-[#FF2D55]">by</span> remember &#123; mutableStateOf(<span className="text-[#FF2D55]">true</span>) &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 22: </span>    <span className="text-[#FF2D55]">var</span> selectedTab <span className="text-[#FF2D55]">by</span> remember &#123; mutableStateOf(ProfileTab.POSTS) &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 23: </span>{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 24: </span>    Scaffold(topBar = &#123;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 25: </span>        CenterAlignedTopAppBar(title = &#123; Text(<span className="text-[#34D399]">"Auteur Invité"</span>) &#125;){"\n"}
<span className="text-zinc-500 font-semibold select-none"> 26: </span>    &#125;) &#123; innerPadding -&gt;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 27: </span>        <span className="text-zinc-500">/* Performance Strategy: Single flat scrollable container */</span>{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 28: </span>        LazyColumn(modifier = Modifier.padding(innerPadding)) &#123;{"\n"}
<span className="text-zinc-550 font-semibold select-none"> 29: </span>            item &#123; ProfileHeaderSection(userName, isLive) &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 30: </span>            item &#123; GamifiedMetricsDashboard() &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 31: </span>            item &#123; InteractiveBentoGrid() &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 32: </span>            item &#123; ContentTabsSelection() &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 33: </span>            item &#123; ContentPortfolioArchive(selectedTab) &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 34: </span>        &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 35: </span>    &#125;{"\n"}
<span className="text-zinc-500 font-semibold select-none"> 36: </span>&#125;
              </code>
            </pre>
          </div>
          
          {/* Footer of code card */}
          <div className="flex justify-between items-center px-5 py-3 border-t border-white/5 bg-[#0F0F11] text-[10px] text-zinc-500 font-mono">
            <span>Lines: 512 | Size: 18.4 KB</span>
            <span>UTF-8 • Kotlin 1.9</span>
          </div>
        </div>

      </div>

    </div>
  );
}
