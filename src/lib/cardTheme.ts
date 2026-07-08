import type { Finish, HeroType } from './types';

export interface CardTheme {
  bg: string;          // card background gradient
  border: string;      // border/glow color
  ink: string;         // text color
  inkSoft: string;     // secondary text
  glow: string;        // outer glow color
  statBar: string;     // stat bar fill
  badge: string;       // position badge bg
}

const THEMES: Record<Finish, CardTheme> = {
  bronze: {
    bg: 'linear-gradient(160deg, #5c3d2e 0%, #8b6914 30%, #cd7f32 50%, #a0522d 80%, #5c3d2e 100%)',
    border: '#cd7f32',
    ink: '#1a0f0a',
    inkSoft: '#3d2517',
    glow: 'rgba(205, 127, 50, 0.3)',
    statBar: '#cd7f32',
    badge: 'rgba(205, 127, 50, 0.25)',
  },
  silver: {
    bg: 'linear-gradient(160deg, #7a7d85 0%, #b8bcc5 30%, #d4d8e0 50%, #a8acb5 80%, #7a7d85 100%)',
    border: '#c0c4cc',
    ink: '#1a1c20',
    inkSoft: '#3a3d44',
    glow: 'rgba(192, 196, 204, 0.3)',
    statBar: '#8890a0',
    badge: 'rgba(192, 196, 204, 0.25)',
  },
  gold: {
    bg: 'linear-gradient(160deg, #8b6914 0%, #daa520 25%, #ffd700 45%, #ffb800 60%, #daa520 80%, #8b6914 100%)',
    border: '#ffd700',
    ink: '#1a1400',
    inkSoft: '#4a3d00',
    glow: 'rgba(255, 215, 0, 0.35)',
    statBar: '#daa520',
    badge: 'rgba(255, 215, 0, 0.2)',
  },
  totw: {
    bg: 'linear-gradient(160deg, #0a0e1a 0%, #1a2340 30%, #1e3a5f 50%, #0f1b30 80%, #0a0e1a 100%)',
    border: '#4a90d9',
    ink: '#e8edf5',
    inkSoft: '#8aa8cc',
    glow: 'rgba(74, 144, 217, 0.4)',
    statBar: '#4a90d9',
    badge: 'rgba(74, 144, 217, 0.2)',
  },
  toty: {
    bg: 'linear-gradient(160deg, #0a0520 0%, #1a0a3e 25%, #2d1b69 45%, #1a0a3e 70%, #0a0520 100%)',
    border: '#8b5cf6',
    ink: '#f0e8ff',
    inkSoft: '#b49cdc',
    glow: 'rgba(139, 92, 246, 0.5)',
    statBar: '#8b5cf6',
    badge: 'rgba(139, 92, 246, 0.2)',
  },
  icon: {
    bg: 'linear-gradient(160deg, #1a1200 0%, #3d2e00 20%, #5c4400 35%, #8b6914 50%, #daa520 65%, #ffd700 78%, #fff8dc 90%, #ffd700 100%)',
    border: '#ffd700',
    ink: '#1a1400',
    inkSoft: '#5c4400',
    glow: 'rgba(255, 215, 0, 0.6)',
    statBar: '#ffd700',
    badge: 'rgba(255, 215, 0, 0.25)',
  },
};

const HERO_THEMES: Record<HeroType, CardTheme> = {
  'spider-man': {
    bg: 'linear-gradient(160deg, #991b1b 0%, #1e3a8a 50%, #0b1329 100%)',
    border: '#ef4444',
    ink: '#ffffff',
    inkSoft: '#f87171',
    glow: 'rgba(239, 68, 68, 0.55)',
    statBar: '#ef4444',
    badge: 'rgba(239, 68, 68, 0.25)',
  },
  'batman': {
    bg: 'linear-gradient(160deg, #18181b 0%, #09090b 50%, #020202 100%)',
    border: '#f59e0b',
    ink: '#ffffff',
    inkSoft: '#a1a1aa',
    glow: 'rgba(245, 158, 11, 0.45)',
    statBar: '#f59e0b',
    badge: 'rgba(245, 158, 11, 0.2)',
  },
  'iron-man': {
    bg: 'linear-gradient(160deg, #7f1d1d 0%, #450a0a 45%, #d97706 100%)',
    border: '#f59e0b',
    ink: '#ffffff',
    inkSoft: '#fcd34d',
    glow: 'rgba(245, 158, 11, 0.55)',
    statBar: '#f59e0b',
    badge: 'rgba(245, 158, 11, 0.25)',
  },
  'joker': {
    bg: 'linear-gradient(160deg, #581c87 0%, #2e1065 50%, #064e3b 100%)',
    border: '#22c55e',
    ink: '#ffffff',
    inkSoft: '#c084fc',
    glow: 'rgba(34, 197, 94, 0.55)',
    statBar: '#22c55e',
    badge: 'rgba(34, 197, 94, 0.25)',
  },
  'captain-america': {
    bg: 'linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 50%, #b91c1c 100%)',
    border: '#ffffff',
    ink: '#ffffff',
    inkSoft: '#93c5fd',
    glow: 'rgba(255, 255, 255, 0.5)',
    statBar: '#3b82f6',
    badge: 'rgba(239, 68, 68, 0.25)',
  },
  'ninja': {
    bg: 'linear-gradient(160deg, #09090b 0%, #18181b 50%, #020202 100%)',
    border: '#dc2626',
    ink: '#f4f4f5',
    inkSoft: '#a1a1aa',
    glow: 'rgba(220, 38, 38, 0.5)',
    statBar: '#dc2626',
    badge: 'rgba(220, 38, 38, 0.2)',
  },
};

export function resolveCardTheme(finish: Finish, hero?: HeroType): CardTheme {
  if (hero && HERO_THEMES[hero]) {
    return HERO_THEMES[hero];
  }
  return THEMES[finish];
}

export function resolveResultTheme(finish: Finish, hero?: HeroType) {
  const t = resolveCardTheme(finish, hero);
  return {
    ...t,
    pageBg: hero
      ? `radial-gradient(ellipse at 50% 30%, ${t.glow} 0%, transparent 70%)`
      : finish === 'totw' || finish === 'toty'
        ? 'radial-gradient(ellipse at 50% 30%, rgba(74,144,217,0.08) 0%, transparent 70%)'
        : finish === 'icon'
          ? 'radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.06) 0%, transparent 70%)'
          : 'none',
  };
}
