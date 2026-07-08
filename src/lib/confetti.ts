interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle';
}

export function burstConfetti(colors: string[] = ['#ffd700', '#ffb800', '#ff6b35', '#ffffff']) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%';
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  const particles: Particle[] = [];
  const W = window.innerWidth;
  const H = window.innerHeight;

  // Create particles from center-top
  for (let i = 0; i < 120; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 4 + Math.random() * 10;
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 200,
      y: H * 0.35 + (Math.random() - 0.5) * 100,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      life: 0,
      maxLife: 80 + Math.random() * 60,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    });
  }

  let frame = 0;
  const maxFrames = 180;

  function animate() {
    frame++;
    if (frame > maxFrames) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.life++;
      if (p.life > p.maxLife) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.99; // air resistance
      p.rotation += p.rotationSpeed;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
