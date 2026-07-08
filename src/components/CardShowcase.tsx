import { useMemo, useState } from 'react';
import PlayerCard from './PlayerCard';
import { getSampleCards } from '../lib/sampleCards';

export default function CardShowcase() {
  const cards = useMemo(() => getSampleCards(), []);
  const [hovered, setHovered] = useState<number | null>(null);

  // 5-card fan layout like leetfut — spread from left to right
  const transforms = [
    { rotate: -22, tx: -130, ty: 55, z: 1 },
    { rotate: -11, tx: -65,  ty: 22, z: 2 },
    { rotate:   0, tx:   0,  ty:  0, z: 3 },
    { rotate:  11, tx:  65,  ty: 22, z: 2 },
    { rotate:  22, tx: 130,  ty: 55, z: 1 },
  ];

  // repeat/trim cards to always have 5
  const display = Array.from({ length: 5 }, (_, i) => cards[i % cards.length]);

  return (
    <div className="showcase">
      <div className="showcase__fan">
        {display.map((card, i) => {
          const t = transforms[i];
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              className="showcase__card-wrap"
              style={{
                transform: isHovered
                  ? `translateX(${t.tx}px) translateY(-28px) rotate(0deg) scale(1.08)`
                  : `translateX(${t.tx}px) translateY(${t.ty}px) rotate(${t.rotate}deg)`,
                zIndex: isHovered ? 10 : t.z,
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
