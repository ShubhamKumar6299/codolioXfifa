import { useState } from 'react';
import type { Card, HeroType } from './lib/types';
import { buildCard } from './lib/scoring';
import { fetchCodolioProfile } from './lib/codolioClient';
import Background from './components/Background';
import ScoutForm from './components/ScoutForm';
import CardShowcase from './components/CardShowcase';
import ResultView from './components/ResultView';
import './App.css';

type AppState = 'home' | 'loading' | 'result';

function App() {
  const [state, setState] = useState<AppState>('home');
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScoutUsername = async (username: string, hero?: HeroType) => {
    setState('loading');
    setError(null);
    try {
      const signals = await fetchCodolioProfile(username);
      const result = buildCard(signals, hero);
      setCard(result);
      setState('result');
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Something went wrong. Please try again.');
      setState('home');
    }
  };

  const handleBack = () => {
    setState('home');
    setCard(null);
  };

  return (
    <>
      <Background />
      <div className="app">
        {state === 'result' && card ? (
          <ResultView card={card} onBack={handleBack} />
        ) : (
          <main className="home">
            <header className="home__header">
              <a
                href="https://github.com/ShubhamKumar6299/codolioXfifa#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="home__header-link"
              >
                how it works
              </a>
              <a
                href="https://github.com/ShubhamKumar6299/codolioXfifa"
                target="_blank"
                rel="noopener noreferrer"
                className="home__header-btn"
              >
                Star on GitHub ⭐
              </a>
            </header>

            <div className="home__content">
              <div className="home__left">
                <ScoutForm
                  loading={state === 'loading'}
                  error={error}
                  onScoutUsername={handleScoutUsername}
                  onScoutManual={() => {}}
                />
              </div>
              <div className="home__right">
                <CardShowcase />
              </div>
            </div>
            <footer className="home__footer">
              <p>
                Inspired by{' '}
                <a href="https://leetfut.fun" target="_blank" rel="noopener noreferrer">leetfut.fun</a>
                {' '}· Built for the{' '}
                <a href="https://codolio.com" target="_blank" rel="noopener noreferrer">Codolio</a>
                {' '}community
              </p>
            </footer>
          </main>
        )}
      </div>
    </>
  );
}

export default App;
