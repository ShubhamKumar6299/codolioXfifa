import { memo, type CSSProperties } from 'react';
import type { Card, StatKey, HeroType } from '../lib/types';
import { resolveCardTheme } from '../lib/cardTheme';

const AVATAR_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="%23000" fill-opacity="0"/><circle cx="160" cy="128" r="62" fill="%23ffffff" fill-opacity="0.18"/><rect x="58" y="206" width="204" height="150" rx="80" fill="%23ffffff" fill-opacity="0.18"/></svg>'
  );

const pad2 = (n: number) => String(Math.round(n)).padStart(2, '0');

const STAT_CELLS: { k: StatKey; l: string; col: number; row: number }[] = [
  { k: 'pac', l: 'PAC', col: 0, row: 0 },
  { k: 'dri', l: 'DRI', col: 1, row: 0 },
  { k: 'sho', l: 'SHO', col: 0, row: 1 },
  { k: 'def', l: 'DEF', col: 1, row: 1 },
  { k: 'pas', l: 'PAS', col: 0, row: 2 },
  { k: 'phy', l: 'PHY', col: 1, row: 2 },
];

const HERO_RING_COLORS: Record<HeroType, string> = {
  'spider-man': '#ef4444',
  'batman': '#f59e0b',
  'superman': '#3b82f6',
  'iron-man': '#f97316',
  'captain-america': '#2563eb',
  'thor': '#60a5fa',
  'wonder-woman': '#fbbf24',
  'black-widow': '#dc2626',
  'scarlet-witch': '#c084fc',
};

const HERO_INITIALS: Record<HeroType, string> = {
  'spider-man': 'SM',
  'batman': 'B',
  'superman': 'S',
  'iron-man': 'IM',
  'captain-america': 'CA',
  'thor': 'T',
  'wonder-woman': 'WW',
  'black-widow': 'BW',
  'scarlet-witch': 'SW',
};

function PlayerCard({ card, style }: { card: Card; style?: CSSProperties }) {
  const t = resolveCardTheme(card.finish, card.hero);
  const displayName = (
    card.name.length <= 12 ? card.name : card.name.split(' ').slice(-1)[0]
  ).toUpperCase();

  const onAvatarError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = AVATAR_FALLBACK;
  };

  const isDark = card.finish === 'totw' || card.finish === 'toty' || !!card.hero;

  const heroColor = card.hero ? HERO_RING_COLORS[card.hero] : undefined;
  const heroInitials = card.hero ? HERO_INITIALS[card.hero] : undefined;

  return (
    <div
      className={`player-card player-card--${card.hero ? `hero-${card.hero}` : card.finish}`}
      style={{
        ...style,
        '--card-bg': t.bg,
        '--card-border': t.border,
        '--card-ink': t.ink,
        '--card-ink-soft': t.inkSoft,
        '--card-glow': t.glow,
        '--card-stat-bar': t.statBar,
        '--card-badge': t.badge,
        ...(heroColor ? { '--hero-ring': heroColor } as Record<string, string> : {}),
      } as CSSProperties}
    >
      {/* Glow border */}
      <div className="player-card__glow" />

      {/* Card surface */}
      <div className="player-card__surface">
        {/* Shuriken Ninja Watermark */}
        <div className="player-card__shuriken-watermark">
          <svg viewBox="0 0 100 100" fill="currentColor" width="100%" height="100%">
            <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z M50 44 C46.7 44 44 46.7 44 50 C44 53.3 46.7 56 50 56 C53.3 56 56 53.3 56 50 C56 46.7 53.3 44 50 44 Z" />
          </svg>
        </div>

        {/* Top section: Overall + Position */}
        <div className="player-card__header">
          <div className="player-card__rating">
            <span className="player-card__overall">{pad2(card.overall)}</span>
            <span className="player-card__position">{card.position}</span>
          </div>
          {heroInitials && (
            <div
              className="player-card__hero-badge"
              title={card.hero}
              style={{ background: heroColor }}
            >
              {heroInitials}
            </div>
          )}
        </div>

        {/* Avatar with hero ring */}
        <div className={`player-card__avatar-wrap ${card.hero ? 'player-card__avatar-wrap--hero' : ''}`}>
          <img
            src={card.avatarUrl || AVATAR_FALLBACK}
            alt={card.name}
            className="player-card__avatar"
            onError={onAvatarError}
            crossOrigin="anonymous"
          />
          <div className="player-card__avatar-fade" />
          {card.hero && <div className="player-card__avatar-ring" />}
        </div>

        {/* Divider */}
        <div className="player-card__divider" />

        {/* Name */}
        <div className="player-card__name" style={{ color: isDark ? t.ink : t.ink }}>
          {displayName}
        </div>

        {/* Stats grid */}
        <div className="player-card__stats">
          {STAT_CELLS.map(({ k, l }) => (
            <div key={k} className="player-card__stat">
              <span className="player-card__stat-val">{pad2(card.stats[k])}</span>
              <span className="player-card__stat-label">{l}</span>
            </div>
          ))}
        </div>

        {/* Username watermark */}
        <div className="player-card__username">@{card.username}</div>
      </div>
    </div>
  );
}

export default memo(PlayerCard);
