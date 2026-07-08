import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Download, Share2, Copy, Image as ImageIcon } from 'lucide-react';
import type { Card, StatKey } from '../lib/types';
import { STAT_KEYS, STAT_LABELS } from '../lib/types';
import PlayerCard from './PlayerCard';
import { captureCard } from '../lib/capture';
import { burstConfetti } from '../lib/confetti';

interface Props {
  card: Card;
  onBack: () => void;
}

const CONFETTI_COLORS: Record<string, string[]> = {
  toty: ['#8b5cf6', '#c084fc', '#ffd54f', '#ffffff', '#a78bfa'],
  icon: ['#ffd700', '#ffb800', '#fff8dc', '#ffffff', '#daa520'],
  totw: ['#4a90d9', '#7fb3ff', '#ffffff', '#ffd54f'],
  gold: ['#ffd700', '#ffb800', '#ffffff', '#daa520'],
};

/* Playstyle badge derivation */
function getPlaystyles(s: Card['signals']): { icon: string; label: string }[] {
  const ps: { icon: string; label: string }[] = [];
  if (s.reputation >= 200) ps.push({ icon: '🌟', label: 'Reputation' });
  if (s.totalSolved >= 1500) ps.push({ icon: '📈', label: 'Top Percentile' });
  if (s.hardSolved >= 80) ps.push({ icon: '🔥', label: 'Hard Mode' });
  if (s.contestsAttended >= 30) ps.push({ icon: '⚔️', label: 'Contest Grinder' });
  if (s.maxStreak >= 100) ps.push({ icon: '🏅', label: 'Veteran' });
  if (s.currentStreak >= 100) ps.push({ icon: '💯', label: 'Century Club' });
  if (s.contestRating >= 1800) ps.push({ icon: '👑', label: 'High Rated' });
  if (s.languages >= 5) ps.push({ icon: '🌐', label: 'Polyglot' });
  if (s.platforms >= 3) ps.push({ icon: '🔗', label: 'Cross-Platform' });
  if (s.totalSolved >= 500 && s.totalSolved < 1500) ps.push({ icon: '💪', label: 'Grinder' });
  return ps.slice(0, 8);
}

/* Archetype derivation */
function getArchetype(s: Card['signals']): { title: string; desc: string } {
  const { hardSolved, totalSolved, contestRating, currentStreak, platforms } = s;
  const hardRatio = totalSolved > 0 ? hardSolved / totalSolved : 0;

  if (contestRating >= 2000 && hardRatio > 0.15)
    return { title: 'Grandmaster', desc: 'Hall-of-fame solver. High and balanced, earned over years.' };
  if (contestRating >= 1800)
    return { title: 'Elite Contender', desc: 'Contest machine with proven competitive excellence.' };
  if (contestRating >= 1500)
    return { title: 'Contest Warrior', desc: 'Strong competitive record with consistent rating performance.' };
  if (hardRatio > 0.2)
    return { title: 'Hard Mode Specialist', desc: 'Tackles the toughest problems head-on. Fearless solver.' };
  if (platforms >= 4)
    return { title: 'Multi-Platform Pro', desc: 'Versatile coder across multiple competitive platforms.' };
  if (currentStreak >= 100)
    return { title: 'Consistency King', desc: 'Unstoppable streak. Dedication personified.' };
  if (totalSolved >= 1000)
    return { title: 'Volume Grinder', desc: 'Relentless problem solver. Quantity meets quality.' };
  if (totalSolved >= 500)
    return { title: 'Rising Star', desc: 'Building momentum with solid fundamentals.' };
  return { title: 'Newcomer', desc: 'Just getting started. The journey begins here.' };
}

/* Star rating helper */
function stars(val: number, max: number): number {
  return Math.min(5, Math.max(1, Math.round((val / max) * 5)));
}

/* Scouting metrics for right panel */
interface ScoutMetric {
  label: string;
  value: string;
  pct: number;
  icon: string;
  color: string;
}

function getScoutingMetrics(s: Card['signals']): ScoutMetric[] {
  return [
    { label: 'Problems solved', value: `${s.totalSolved} solved`, pct: Math.min(100, (s.totalSolved / 2000) * 100), icon: '📊', color: '#f59e0b' },
    { label: 'Hard solved', value: `${s.hardSolved} hard`, pct: Math.min(100, (s.hardSolved / 300) * 100), icon: '🔴', color: '#ef4444' },
    { label: 'Contest rating', value: `${s.contestRating || '—'} rating`, pct: Math.min(100, (s.contestRating / 2500) * 100), icon: '🏆', color: '#f59e0b' },
    { label: 'Contests attended', value: `${s.contestsAttended} contests`, pct: Math.min(100, (s.contestsAttended / 100) * 100), icon: '⚔️', color: '#f59e0b' },
    { label: 'Languages', value: `${s.languages} languages`, pct: Math.min(100, (s.languages / 10) * 100), icon: '💻', color: '#22c55e' },
    { label: 'Reputation', value: `${s.reputation} rep`, pct: Math.min(100, (s.reputation / 1000) * 100), icon: '🌟', color: '#f59e0b' },
    { label: 'Max streak', value: `${s.maxStreak} days`, pct: Math.min(100, (s.maxStreak / 365) * 100), icon: '🔥', color: '#f97316' },
    { label: 'Platforms', value: `${s.platforms} platforms`, pct: Math.min(100, (s.platforms / 5) * 100), icon: '🔗', color: '#22c55e' },
  ];
}

function workRateStr(s: Card['signals']): string {
  if (s.currentStreak >= 90) return 'High / High';
  if (s.currentStreak >= 30) return 'High / Med';
  if (s.currentStreak >= 7) return 'Med / Med';
  return 'Med / Low';
}

function styleStr(card: Card): string {
  const pos = card.position;
  if (['ST', 'RW'].includes(pos)) return 'ATTACKER';
  if (['CAM', 'CM'].includes(pos)) return 'PLAYMAKER';
  return 'GUARDIAN';
}

export default function ResultView({ card, onBack }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const archetype = getArchetype(card.signals);
  const playstyles = getPlaystyles(card.signals);
  const metrics = getScoutingMetrics(card.signals);
  const skillMoves = stars(card.signals.totalSolved, 1500);
  const weakFoot = stars(card.signals.hardSolved, 200);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      const palette = CONFETTI_COLORS[card.finish];
      if (palette) {
        setTimeout(() => burstConfetti(palette), 200);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [card.finish]);

  const handleDownload = async () => {
    if (!captureRef.current || downloading) return;
    setDownloading(true);
    try {
      await captureCard(captureRef.current, `codoliofun-${card.username}.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!captureRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(captureRef.current, { cacheBust: true, pixelRatio: 3 });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Copy failed');
    }
  };

  const SITE_URL = 'https://shubhamkumar6299.github.io/codolioXfifa/';

  const handleShare = () => {
    const text = `⚽ Just got my CodolioFun card — ${card.overall} OVR ${card.position} (${archetype.title})!\n\nPAC ${card.stats.pac} | SHO ${card.stats.sho} | PAS ${card.stats.pas} | DRI ${card.stats.dri} | DEF ${card.stats.def} | PHY ${card.stats.phy}\n\nGet your own card → ${SITE_URL}`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = card.name.includes(' ')
    ? card.name.split(' ').slice(-1)[0].toUpperCase()
    : card.name.toUpperCase();

  return (
    <div className={`result ${revealed ? 'result--revealed' : ''}`}>
      {/* Top bar */}
      <div className="result__topbar">
        <button className="result__back" onClick={onBack}>
          <ArrowLeft size={16} /> GET SCOUTED ⚽
        </button>
        <div className="result__topbar-actions">
          <a
            href="https://github.com/ShubhamKumar6299/codolioXfifa#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="result__topbar-link"
          >
            how it works
          </a>
          <a
            href="https://github.com/ShubhamKumar6299/codolioXfifa"
            target="_blank"
            rel="noopener noreferrer"
            className="result__topbar-btn"
          >
            Star on GitHub ⭐
          </a>
        </div>
      </div>

      {/* Header: Rating + Name + Archetype */}
      <div className="result__header">
        <div className="result__header-rating">
          <span className="result__header-ovr">{card.overall}</span>
          <span className="result__header-pos">{card.position}</span>
        </div>
        <div className="result__header-info">
          <h2 className="result__header-title">
            <span className="result__header-scout-label">SCOUT REPORT</span>
            <span className="result__header-name">{displayName}</span>
          </h2>
          <div className="result__header-meta">
            <span className="result__header-archetype">{archetype.title}</span>
            <span className="result__header-sep">·</span>
            <span className="result__header-handle">@{card.username}</span>
          </div>
          <p className="result__header-desc">
            <strong>GENERATIONAL TALENT:</strong> {archetype.desc}
          </p>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="result__layout">
        {/* Left: Attributes + Playstyles */}
        <div className="result__col result__col--left">
          {/* Attributes */}
          <div className="result__section">
            <h4 className="result__section-title">ATTRIBUTES</h4>
            <div className="result__attr-rows">
              <div className="result__attr-row">
                <span className="result__attr-label">Skill moves</span>
                <div className="result__attr-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < skillMoves ? 'star-on' : 'star-off'}>★</span>
                  ))}
                </div>
              </div>
              <div className="result__attr-row">
                <span className="result__attr-label">Weak foot</span>
                <div className="result__attr-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < weakFoot ? 'star-on' : 'star-off'}>★</span>
                  ))}
                </div>
              </div>
              <div className="result__attr-row">
                <span className="result__attr-label">Work rate</span>
                <span className="result__attr-value">{workRateStr(card.signals)}</span>
              </div>
              <div className="result__attr-row">
                <span className="result__attr-label">Style</span>
                <span className="result__attr-value result__attr-value--accent">{styleStr(card)}</span>
              </div>
            </div>
          </div>

          {/* Playstyles */}
          <div className="result__section">
            <h4 className="result__section-title">PLAYSTYLES</h4>
            <div className="result__playstyle-list">
              {playstyles.map(ps => (
                <div key={ps.label} className="result__playstyle-item">
                  <span className="result__playstyle-icon">{ps.icon}</span>
                  <span className="result__playstyle-label">{ps.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Card + Actions */}
        <div className="result__col result__col--center">
          <div className="result__card-container" ref={captureRef}>
            <PlayerCard card={card} />
          </div>

          {/* Share My Card */}
          <button className="result__share-main" onClick={handleShare}>
            <Share2 size={16} /> SHARE MY CARD
          </button>

          {/* Social row */}
          <div className="result__social-row">
            <button className="result__social-btn" onClick={handleShare}>
              𝕏 X
            </button>
            <button className="result__social-btn" onClick={handleLinkedIn}>
              in LinkedIn
            </button>
            <button className="result__social-btn" onClick={handleCopyLink}>
              <Copy size={13} /> {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          {/* Download row */}
          <div className="result__download-row">
            <button className="result__dl-btn" onClick={handleDownload} disabled={downloading}>
              <Download size={14} /> {downloading ? 'Saving…' : 'Download'}
            </button>
            <button className="result__dl-btn" onClick={handleCopyImage}>
              <ImageIcon size={14} /> Copy Image
            </button>
          </div>
        </div>

        {/* Right: Scouting Metrics */}
        <div className="result__col result__col--right">
          <div className="result__section">
            <h4 className="result__section-title">SCOUTING METRICS</h4>
            <div className="result__metrics">
              {metrics.map(m => (
                <div key={m.label} className="result__metric">
                  <div className="result__metric-header">
                    <span className="result__metric-label">{m.label}</span>
                    <span className="result__metric-value">{m.value} <span className="result__metric-icon">{m.icon}</span></span>
                  </div>
                  <div className="result__metric-bar">
                    <div
                      className="result__metric-fill"
                      style={{ width: `${m.pct}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Stats Summary */}
          <div className="result__section">
            <h4 className="result__section-title">CARD STATS</h4>
            <div className="result__card-stats">
              {STAT_KEYS.map((k: StatKey) => (
                <div key={k} className="result__card-stat">
                  <span className="result__card-stat-val">{card.stats[k]}</span>
                  <span className="result__card-stat-label">{STAT_LABELS[k]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
