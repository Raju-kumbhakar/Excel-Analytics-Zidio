import React, { useEffect, useRef } from 'react';

/**
 * AnimatedGridBackground (Network Style)
 * Renders an animated network of glowing nodes connected by lines on a canvas,
 * styled for a dark gold/amber theme similar to the provided reference.
 * Non-interactive and sits behind all app content.
 */
const AnimatedGridBackground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Use DPR = 1 to improve performance on HiDPI displays
    const DPR = 1;
    let width = 0, height = 0;

    const config = {
      // Pure black theme with gray elements
      nodeColor: 'rgba(200,200,200,0.65)',
      linkColor: 'rgba(160,160,160,0.28)',
      particleDensity: 0.00005, // even fewer for ultra-smooth perf
      maxSpeed: 0.45, // moderate speed to look calm
      linkDistance: 90, // reduce links for cleaner look
      linkThickness: 0.9,
      shadowBlur: 6, // softer glow
      mouseInfluence: 100,
      mouseRepel: 0.08,
    };

    let particles = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let lastTs = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Recalculate particle count based on area
      const targetCount = Math.max(35, Math.floor(width * height * config.particleDensity));
      if (particles.length > targetCount) particles.length = targetCount;
      while (particles.length < targetCount) particles.push(makeParticle());
    };

    const rand = (min, max) => Math.random() * (max - min) + min;

    const makeParticle = () => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-config.maxSpeed, config.maxSpeed),
      vy: rand(-config.maxSpeed, config.maxSpeed),
      r: rand(1.0, 2.2),
    });

    const step = (ts = 0) => {
      const dt = Math.min(32, ts - (lastTs || ts)); // clamp delta (ms)
      lastTs = ts;
      ctx.clearRect(0, 0, width, height);

      // Pure black base handled by CSS; no gradient fill for maximum clarity and performance

      // Update particles (time-based)
      for (let p of particles) {
        // Mouse repel effect
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < config.mouseInfluence * config.mouseInfluence) {
            const dist = Math.sqrt(Math.max(dist2, 0.0001));
            const f = (config.mouseInfluence - dist) / config.mouseInfluence;
            p.vx += (dx / dist) * f * config.mouseRepel;
            p.vy += (dy / dist) * f * config.mouseRepel;
          }
        }

        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        // Bounce off edges softly
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Build uniform grid for neighbor search (reduces O(n^2))
      const cellSize = config.linkDistance;
      const cols = Math.max(1, Math.ceil(width / cellSize));
      const rows = Math.max(1, Math.ceil(height / cellSize));
      const grid = new Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];
      for (let idx = 0; idx < particles.length; idx++) {
        const p = particles[idx];
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cellSize)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cellSize)));
        grid[cy * cols + cx].push(idx);
      }

      // Draw links
      ctx.lineWidth = config.linkThickness;
      ctx.shadowBlur = config.shadowBlur;
      ctx.shadowColor = config.linkColor;
      ctx.strokeStyle = config.linkColor;

      const neighborOffsets = [
        [0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
      ];
      const maxD2 = config.linkDistance * config.linkDistance;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cellIndex = cy * cols + cx;
          const cell = grid[cellIndex];
          if (!cell.length) continue;
          for (const [ox, oy] of neighborOffsets) {
            const nx = cx + ox, ny = cy + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const neighbor = grid[ny * cols + nx];
            if (!neighbor.length) continue;
            for (let i = 0; i < cell.length; i++) {
              const a = particles[cell[i]];
              for (let j = 0; j < neighbor.length; j++) {
                const b = particles[neighbor[j]];
                if (a === b) continue;
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < maxD2) {
                  const t = 1 - Math.sqrt(d2) / config.linkDistance;
                  ctx.globalAlpha = Math.max(0.05, t * 0.6);
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw nodes
      for (let p of particles) {
        ctx.beginPath();
        ctx.fillStyle = config.nodeColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = config.nodeColor;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    resize();
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="animated-grid-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="network-canvas" />
    </div>
  );
};

export default AnimatedGridBackground;
