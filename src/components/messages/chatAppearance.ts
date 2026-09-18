export interface ChatTheme {
  id: string;
  name: string;
  bubbleClass: string;
  bgGradient: string;
  accent: string;
  glowColor: string;
}

export const CHAT_THEMES: ChatTheme[] = [
  { id: 'cyber-red', name: 'Cyber Crimson', bubbleClass: 'bg-[var(--axo-accent)]', bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]', accent: 'var(--axo-accent)', glowColor: 'var(--axo-shadow)' },
  { id: 'wave', name: 'Vapor Aura', bubbleClass: 'bg-[var(--axo-accent-wave)]', bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]', accent: 'var(--axo-accent-wave)', glowColor: 'var(--axo-shadow)' },
  { id: 'emerald', name: 'Hacker Mint', bubbleClass: 'bg-[var(--axo-accent-mint)]', bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]', accent: 'var(--axo-accent-mint)', glowColor: 'var(--axo-shadow)' },
  { id: 'solar', name: 'Solar Flare', bubbleClass: 'bg-[var(--axo-accent-solar)]', bgGradient: 'from-[var(--axo-surface)] to-[var(--axo-bg)]', accent: 'var(--axo-accent-solar)', glowColor: 'var(--axo-shadow)' },
];

// Quiet dots and arcs retain personality without competing with message text.
export const AXORA_CHAT_WALLPAPER = `url("data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="260" height="220" viewBox="0 0 260 220">
    <g fill="none" stroke="#ff2d55" opacity="0.08"><circle cx="36" cy="34" r="18"/><path d="M18 152c26-30 61-30 87 0"/><circle cx="210" cy="176" r="25"/></g>
    <g fill="#a855f7" opacity="0.09"><circle cx="116" cy="78" r="3"/><circle cx="141" cy="99" r="5"/><circle cx="168" cy="73" r="2"/></g>
    <path d="M188 26h34M205 9v34" stroke="#22d3ee" stroke-width="1.5" opacity="0.1"/>
  </svg>
`)}")`;
