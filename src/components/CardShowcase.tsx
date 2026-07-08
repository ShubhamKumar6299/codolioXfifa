import { useMemo, useState } from 'react';
import PlayerCard from './PlayerCard';
import { getSampleCards } from '../lib/sampleCards';

export default function CardShowcase() {
  const cards = useMemo(() => getSampleCards(), []);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="showcase">
      <div className="showcase__fan">
        {cards.map((card, i) => {
          const isHovered = hovered === i;
          const offset = i - 1; // -1, 0, 1
          const baseRotate = offset * 12;
          const baseTranslateX = offset * 60;
          const baseTranslateY = Math.abs(offset) * 20;

          return (
            <div
              key={card.username}
              className="showcase__card-wrap"
              style={{
                transform: isHovered
                  ? `translateX(${baseTranslateX}px) translateY(-30px) rotate(0deg) scale(1.08)`
                  : `translateX(${baseTranslateX}px) translateY(${baseTranslateY}px) rotate(${baseRotate}deg)`,
                zIndex: isHovered ? 10 : 3 - Math.abs(offset),
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <PlayerCard card={card} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
