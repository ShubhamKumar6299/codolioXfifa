import { useEffect, useRef } from 'react';

/* Pixel tracker grid — orange/grey squares like leetfut */
function PixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 10;
    const GAP = 4;
    const STEP = SIZE + GAP;
    let cols = 0, rows = 0;
    const cells: { lit: boolean; alpha: number; targetAlpha: number }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = 160;
      cols = Math.ceil(canvas!.width / STEP) + 1;
      rows = Math.ceil(canvas!.height / STEP) + 1;
      cells.length = 0;
      for (let i = 0; i < cols * rows; i++) {
        const lit = Math.random() < 0.18;
        cells.push({ lit, alpha: lit ? Math.random() * 0.7 + 0.15 : 0, targetAlpha: 0 });
      }
    }

    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const cell = cells[idx];
          // random flicker
          if (Math.random() < 0.002) {
            cell.lit = !cell.lit;
            cell.targetAlpha = cell.lit ? Math.random() * 0.7 + 0.2 : 0;
          }
          // ease towards target
          if (cell.lit) {
            cell.alpha += (0.55 - cell.alpha) * 0.04;
          } else {
            cell.alpha *= 0.94;
          }
          if (cell.alpha < 0.01) continue;
          const x = c * STEP;
          const y = r * STEP;
          // orange-amber for lit, grey for dim
          const color = cell.lit
            ? `rgba(255,184,0,${cell.alpha})`
            : `rgba(80,80,100,${cell.alpha * 0.4})`;
          ctx!.fillStyle = color;
          ctx!.fillRect(x, y, SIZE, SIZE);
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '160px',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }}
    />
  );
}

export default function Background() {
  return (
    <div className="bg-container" aria-hidden>
      {/* Subtle grid lines */}
      <div className="bg-grid" />

      {/* Warm golden spreading center glow — the "stadium light" */}
      <div className="bg-stadium-glow" />

      {/* Animated floating orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Pixel tracker grid at bottom */}
      <PixelGrid />
    </div>
  );
}
