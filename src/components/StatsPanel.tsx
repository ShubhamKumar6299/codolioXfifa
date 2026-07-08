import type { Card } from '../lib/types';
import { STAT_KEYS, STAT_LABELS, STAT_DESCRIPTIONS } from '../lib/types';
import { resolveCardTheme } from '../lib/cardTheme';

interface Props {
  card: Card;
}

export default function StatsPanel({ card }: Props) {
  const t = resolveCardTheme(card.finish);

  return (
    <div className="stats-panel">
      <h3 className="stats-panel__title">Stat Breakdown</h3>
      <div className="stats-panel__list">
        {STAT_KEYS.map(k => (
          <div key={k} className="stats-panel__item">
            <div className="stats-panel__item-header">
              <span className="stats-panel__item-label">{STAT_LABELS[k]}</span>
              <span className="stats-panel__item-value">{card.stats[k]}</span>
            </div>
            <div className="stats-panel__bar-track">
              <div
                className="stats-panel__bar-fill"
                style={{
                  width: `${card.stats[k]}%`,
                  background: t.statBar,
                }}
              />
            </div>
            <p className="stats-panel__item-desc">{STAT_DESCRIPTIONS[k]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
