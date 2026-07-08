import { memo, type CSSProperties } from 'react';
import type { Card, StatKey } from '../lib/types';
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

function PlayerCard({ card, style }: { card: Card; style?: CSSProperties }) {
  const t = resolveCardTheme(card.finish);
  const displayName = (
    card.name.length <= 12 ? card.name : card.name.split(' ').slice(-1)[0]
  ).toUpperCase();

  const onAvatarError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = AVATAR_FALLBACK;
  };

  const isDark = card.finish === 'totw' || card.finish === 'toty';

  return (
    <div
      className={`player-card player-card--${card.finish}`}
      style={{
        ...style,
        '--card-bg': t.bg,
        '--card-border': t.border,
        '--card-ink': t.ink,
        '--card-ink-soft': t.inkSoft,
        '--card-glow': t.glow,
        '--card-stat-bar': t.statBar,
        '--card-badge': t.badge,
      } as CSSProperties}
    >
      {/* Glow border */}
      <div className="player-card__glow" />

      {/* Card surface */}
      <div className="player-card__surface">
        {/* Top section: Overall + Position */}
        <div className="player-card__header">
          <div className="player-card__rating">
            <span className="player-card__overall">{pad2(card.overall)}</span>
            <span className="player-card__position">{card.position}</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="player-card__avatar-wrap">
          <img
            src={card.avatarUrl || AVATAR_FALLBACK}
            alt={card.name}
            className="player-card__avatar"
            onError={onAvatarError}
            crossOrigin="anonymous"
          />
          <div className="player-card__avatar-fade" />
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
