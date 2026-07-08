import type { Card } from '../lib/types';
import { Star, Zap, Target, Trophy, Flame, Code2, Globe } from 'lucide-react';

interface Props {
  card: Card;
}

function starRating(value: number, max: number): number {
  return Math.min(5, Math.max(1, Math.round((value / max) * 5)));
}

function deriveWorkRate(signals: Card['signals']): string {
  const streak = signals.currentStreak;
  if (streak >= 90) return 'High / High';
  if (streak >= 30) return 'High / Med';
  if (streak >= 7) return 'Med / Med';
  return 'Med / Low';
}

function deriveStyle(signals: Card['signals']): string {
  const { hardSolved, totalSolved, contestRating, platforms, currentStreak } = signals;
  const hardRatio = totalSolved > 0 ? hardSolved / totalSolved : 0;

  if (contestRating >= 2000 && hardRatio > 0.2) return '🏆 Elite Competitor';
  if (contestRating >= 1500) return '⚔️ Contest Warrior';
  if (hardRatio > 0.25) return '🔥 Hard Mode Specialist';
  if (platforms >= 4) return '🌍 Multi-Platform Pro';
  if (currentStreak >= 100) return '💎 Consistency Machine';
  if (totalSolved >= 1000) return '⚡ Volume Grinder';
  if (totalSolved >= 500) return '🎯 Steady Climber';
  return '🌱 Rising Talent';
}

function derivePlaystyles(signals: Card['signals']): string[] {
  const styles: string[] = [];
  if (signals.contestRating >= 1800) styles.push('Contest Beast');
  if (signals.hardSolved >= 100) styles.push('Hard Mode Master');
  if (signals.languages >= 6) styles.push('Polyglot');
  if (signals.currentStreak >= 60) styles.push('Streak Machine');
  if (signals.platforms >= 3) styles.push('Cross-Platform');
  if (signals.contributions >= 500) styles.push('Open Source');
  if (signals.totalSolved >= 1500) styles.push('Volume King');
  if (signals.reputation >= 1000) styles.push('Community Star');
  return styles.slice(0, 4);
}

export default function AttributesPanel({ card }: Props) {
  const s = card.signals;
  const versatility = starRating(s.platforms, 4);
  const endurance = starRating(s.maxStreak, 200);
  const workRate = deriveWorkRate(s);
  const style = deriveStyle(s);
  const playstyles = derivePlaystyles(s);

  return (
    <div className="attr-panel">
      <h3 className="attr-panel__title">Scout Report</h3>

      <div className="attr-panel__attributes">
        <div className="attr-panel__attr">
          <div className="attr-panel__attr-icon"><Globe size={16} /></div>
          <div className="attr-panel__attr-info">
            <span className="attr-panel__attr-label">Versatility</span>
            <div className="attr-panel__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < versatility ? 'star--filled' : 'star--empty'} />
              ))}
            </div>
          </div>
        </div>

        <div className="attr-panel__attr">
          <div className="attr-panel__attr-icon"><Flame size={16} /></div>
          <div className="attr-panel__attr-info">
            <span className="attr-panel__attr-label">Endurance</span>
            <div className="attr-panel__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < endurance ? 'star--filled' : 'star--empty'} />
              ))}
            </div>
          </div>
        </div>

        <div className="attr-panel__attr">
          <div className="attr-panel__attr-icon"><Zap size={16} /></div>
          <div className="attr-panel__attr-info">
            <span className="attr-panel__attr-label">Work Rate</span>
            <span className="attr-panel__attr-value">{workRate}</span>
          </div>
        </div>

        <div className="attr-panel__attr">
          <div className="attr-panel__attr-icon"><Target size={16} /></div>
          <div className="attr-panel__attr-info">
            <span className="attr-panel__attr-label">Archetype</span>
            <span className="attr-panel__attr-value">{style}</span>
          </div>
        </div>
      </div>

      {playstyles.length > 0 && (
        <div className="attr-panel__playstyles">
          <h4 className="attr-panel__playstyles-title">
            <Trophy size={14} /> Playstyle Badges
          </h4>
          <div className="attr-panel__badges">
            {playstyles.map(ps => (
              <span key={ps} className="attr-panel__badge">
                <Code2 size={12} /> {ps}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="attr-panel__quick">
        <div className="attr-panel__quick-item">
          <span className="attr-panel__quick-val">{s.totalSolved.toLocaleString()}</span>
          <span className="attr-panel__quick-label">Problems</span>
        </div>
        <div className="attr-panel__quick-item">
          <span className="attr-panel__quick-val">{s.contestRating || '—'}</span>
          <span className="attr-panel__quick-label">Rating</span>
        </div>
        <div className="attr-panel__quick-item">
          <span className="attr-panel__quick-val">{s.currentStreak}</span>
          <span className="attr-panel__quick-label">Streak</span>
        </div>
      </div>
    </div>
  );
}
