import { useState } from 'react';
import type { CodolioSignals, HeroType } from '../lib/types';
import { ArrowRight, Search } from 'lucide-react';

interface Props {
  loading: boolean;
  error: string | null;
  onScoutUsername: (username: string, hero: HeroType) => void;
  onScoutManual: (signals: CodolioSignals) => void;
}

const EXAMPLE_USERNAMES = ['ToUrIsT45'];

const HEROES: { id: HeroType; label: string; initials: string; color: string; tagline: string }[] = [
  { id: 'spider-man', label: 'Spider-Man', initials: 'SM', color: '#ef4444', tagline: 'Web slinger' },
  { id: 'batman', label: 'Batman', initials: 'B', color: '#f59e0b', tagline: 'Dark knight' },
  { id: 'superman', label: 'Superman', initials: 'S', color: '#3b82f6', tagline: 'Man of steel' },
  { id: 'iron-man', label: 'Iron Man', initials: 'IM', color: '#f97316', tagline: 'Tech genius' },
  { id: 'captain-america', label: 'Cap America', initials: 'CA', color: '#2563eb', tagline: 'First avenger' },
  { id: 'thor', label: 'Thor', initials: 'T', color: '#60a5fa', tagline: 'God of thunder' },
  { id: 'wonder-woman', label: 'Wonder Woman', initials: 'WW', color: '#fbbf24', tagline: 'Amazon warrior' },
  { id: 'black-widow', label: 'Black Widow', initials: 'BW', color: '#dc2626', tagline: 'Master spy' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', initials: 'SW', color: '#c084fc', tagline: 'Chaos magic' },
];

export default function ScoutForm({ loading, error, onScoutUsername }: Props) {
  const [username, setUsername] = useState('');
  const [selectedHero, setSelectedHero] = useState<HeroType>('spider-man');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onScoutUsername(username.trim(), selectedHero);
  };

  return (
    <div className="scout-form">
      {/* Logo */}
      <div className="scout-form__mascot">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="CodolioFun logo"
          className="scout-form__mascot-img"
          width={96}
          height={96}
        />
      </div>

      {/* Title */}
      <h1 className="scout-form__title">
        GET SCOUTED<span className="scout-form__dot">.</span>
      </h1>
      <p className="scout-form__subtitle">
        Your Codolio stats, turned into a World-Cup-style player card rated out of 99.
      </p>

      {/* Hero Selection */}
      <div className="scout-form__hero-section">
        <label className="scout-form__hero-label">CHOOSE YOUR VIBE</label>
        <div className="scout-form__hero-grid">
          {HEROES.map(hero => {
            const isSelected = selectedHero === hero.id;
            return (
              <button
                key={hero.id}
                type="button"
                className={`scout-form__hero-card ${isSelected ? 'scout-form__hero-card--selected' : ''}`}
                onClick={() => setSelectedHero(hero.id)}
                style={{
                  '--hero-color': hero.color,
                  '--hero-glow': `${hero.color}33`,
                } as React.CSSProperties}
              >
                <div className="scout-form__hero-card-shine" />
                <div
                  className="scout-form__hero-avatar"
                  style={{ background: hero.color }}
                >
                  {hero.initials}
                </div>
                <span className="scout-form__hero-name">{hero.label}</span>
                <span className="scout-form__hero-tagline">{hero.tagline}</span>
                {isSelected && <div className="scout-form__hero-check">✓</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && <div className="scout-form__error">{error}</div>}

      {/* Search bar */}
      <form onSubmit={submit} className="scout-form__bar">
        <div className="scout-form__bar-input-wrap">
          <Search size={16} className="scout-form__bar-icon" />
          <input
            type="text"
            className="scout-form__bar-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Codolio username"
            autoFocus
          />
        </div>
        <button type="submit" className="scout-form__bar-btn" disabled={loading || !username.trim()}>
          {loading ? (
            <span className="scout-form__spinner" />
          ) : (
            <>SCOUT <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      {/* Examples */}
      <div className="scout-form__try">
        <span>try</span>
        {EXAMPLE_USERNAMES.map(name => (
          <button
            key={name}
            type="button"
            className="scout-form__try-name"
            onClick={() => { setUsername(name); onScoutUsername(name, selectedHero); }}
          >
            {name}
          </button>
        ))}
        <span className="scout-form__try-sep">or your own</span>
      </div>
    </div>
  );
}
