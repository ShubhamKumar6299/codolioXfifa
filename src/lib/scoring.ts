import type { CodolioSignals, Card, Stats, StatKey, Finish, Position } from './types';
import { STAT_KEYS } from './types';

/* ── Math helpers ── */
const Lg = (x: number) => Math.log10(Math.max(0, x) + 1);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / (a.length || 1);

/* ── Step 1: Raw stats from signals ── */
function rawStats(s: CodolioSignals): Stats {
  return {
    // PAC — Consistency & momentum
    pac: clamp(Math.round(
      36 + 10 * Lg(s.currentStreak) + 8 * Lg(s.maxStreak)
    ), 1, 99),

    // SHO — Volume & difficulty mastery
    sho: clamp(Math.round(
      36 + 10 * Lg(s.totalSolved) + 12 * Lg(s.hardSolved) + 4 * Lg(s.mediumSolved)
    ), 1, 99),

    // PAS — Competitive performance
    pas: clamp(Math.round(
      40 + 11 * Lg(s.contestsAttended) + 9 * Lg(s.contestRating)
    ), 1, 99),

    // DRI — Versatility & range
    dri: clamp(Math.round(
      48 + 8 * Math.sqrt(s.languages) + 10 * Math.sqrt(s.platforms)
    ), 1, 99),

    // DEF — Community impact
    def: clamp(Math.round(
      38 + 8 * Lg(s.contributions) + 10 * Lg(s.reputation)
    ), 1, 99),

    // PHY — Endurance & completeness
    phy: clamp(Math.round(
      36 + 9 * Lg(s.totalSolved) + 3 * Lg(s.easySolved) +
      4 * Lg(s.mediumSolved) + 5 * Lg(s.hardSolved)
    ), 1, 99),
  };
}

/* ── Step 2: Magnitude center (determines overall range) ── */
function center(s: CodolioSignals): number {
  const K = { w1: 0.35, w2: 0.25, w3: 0.15, w4: 0.1, w5: 0.15, b: -2.8, lo: 38, hi: 97 };
  const M = sigmoid(
    K.w1 * Lg(s.totalSolved) +
    K.w2 * Lg(s.contestRating) +
    K.w3 * Lg(s.reputation) +
    K.w4 * Math.min(s.platforms, 4) +
    K.w5 * Lg(s.currentStreak) +
    K.b
  );
  return lerp(K.lo, K.hi, M);
}

/* ── Step 3: Z-score normalize ── */
function zscore(raw: Stats): Record<StatKey, number> {
  const v = STAT_KEYS.map(k => raw[k]);
  const m = mean(v);
  const sd = Math.sqrt(mean(v.map(x => (x - m) ** 2))) || 1;
  const p = {} as Record<StatKey, number>;
  STAT_KEYS.forEach((k, i) => (p[k] = (v[i] - m) / sd));
  return p;
}

/* ── Step 4: Spread stats around the center ── */
function spread(profile: Record<StatKey, number>, c: number): Stats {
  const SPREAD_BASE = 8;
  const v = STAT_KEYS.map(k => profile[k]);
  const lop = clamp((Math.max(...v) - Math.min(...v)) / 4, 0, 1);
  const s = SPREAD_BASE * (1 + lop);
  const m = mean(v);
  const out = {} as Stats;
  STAT_KEYS.forEach(k => {
    out[k] = clamp(Math.round(c + s * (profile[k] - m)), 1, 99);
  });
  return out;
}

/* ── Step 5: Derive position from stat profile ── */
function derivePosition(stats: Stats): Position {
  const attackScore = stats.pac + stats.sho;
  const midScore = stats.pas + stats.dri;
  const defScore = stats.def + stats.phy;

  if (attackScore >= midScore && attackScore >= defScore) {
    return stats.sho > stats.pac ? 'ST' : 'RW';
  }
  if (midScore >= defScore) {
    return stats.pas > stats.dri ? 'CAM' : 'CM';
  }
  return stats.def > stats.phy ? 'CDM' : 'CB';
}

/* ── Step 6: Derive finish tier from overall ── */
function deriveFinish(overall: number): Finish {
  if (overall >= 96) return 'icon';
  if (overall >= 90) return 'toty';
  if (overall >= 85) return 'totw';
  if (overall >= 70) return 'gold';
  if (overall >= 50) return 'silver';
  return 'bronze';
}

/* ── Main: Build card from signals ── */
export function buildCard(signals: CodolioSignals): Card {
  const raw = rawStats(signals);
  const profile = zscore(raw);
  const c = center(signals);
  const stats = spread(profile, c);

  // Overall = weighted mean of all stats
  const weights: Record<StatKey, number> = {
    pac: 0.12, sho: 0.22, pas: 0.22, dri: 0.14, def: 0.14, phy: 0.16,
  };
  const overall = clamp(
    Math.round(STAT_KEYS.reduce((sum, k) => sum + stats[k] * weights[k], 0)),
    1, 99
  );

  const position = derivePosition(stats);
  const finish = deriveFinish(overall);

  return {
    signals,
    stats,
    overall,
    position,
    finish,
    name: signals.name || signals.username,
    username: signals.username,
    avatarUrl: signals.avatarUrl,
  };
}
