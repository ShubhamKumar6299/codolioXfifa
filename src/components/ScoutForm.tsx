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

const HEROES: { id: HeroType; label: string; icon: string }[] = [
  { id: 'ninja', label: 'Ninja', icon: '🥷' },
  { id: 'spider-man', label: 'Spider-Man', icon: '🕷️' },
  { id: 'batman', label: 'Batman', icon: '🦇' },
  { id: 'iron-man', label: 'Iron Man', icon: '🤖' },
  { id: 'joker', label: 'Joker', icon: '🃏' },
  { id: 'captain-america', label: 'Cap America', icon: '🛡️' },
];

export default function ScoutForm({ loading, error, onScoutUsername }: Props) {
  const [username, setUsername] = useState('');
  const [selectedHero, setSelectedHero] = useState<HeroType>('ninja');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onScoutUsername(username.trim(), selectedHero);
  };

  return (
    <div className="scout-form">
      {/* Mascot / Logo */}
      <div className="scout-form__mascot">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="CodolioXFifa mascot"
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
        <label className="scout-form__hero-label">
          SELECT THEME / ACTION HERO 🥋
        </label>
        <div className="scout-form__hero-grid">
          {HEROES.map(hero => (
            <button
              key={hero.id}
              type="button"
              className={`scout-form__hero-card ${selectedHero === hero.id ? 'scout-form__hero-card--selected' : ''}`}
              onClick={() => setSelectedHero(hero.id)}
            >
              <span className="scout-form__hero-icon">{hero.icon}</span>
              <span className="scout-form__hero-name">{hero.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <div className="scout-form__error">{error}</div>}

      {/* Search bar — single line like leetfut */}
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
