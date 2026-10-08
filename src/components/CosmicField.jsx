import { useEffect, useRef } from 'react';

/**
 * CosmicField
 * ------------------------------------------------------------------
 * A continuously animated aurora + starfield backdrop, fixed behind
 * every section. Unlike a static gradient, this is redrawn every frame
 * with drifting, overlapping glow blobs (additive blending, like real
 * aurora/plasma) plus a parallax starfield tied to scroll — the
 * closest thing to a looping background video we can render without
 * external media assets.
 */
const STAR_LAYERS = [
  { count: 110, speed: 0.02, size: [0.5, 1.2], alpha: [0.3, 0.6], twinkle: 0.6 },
  { count: 70, speed: 0.05, size: [0.8, 1.7], alpha: [0.4, 0.8], twinkle: 1.1 },
  { count: 35, speed: 0.09, size: [1.2, 2.4], alpha: [0.55, 1], twinkle: 1.6 },
];

const AURORA_BLOBS = [
  { color: '99,102,241', radius: 0.42, speedX: 0.06, speedY: 0.045, phase: 0 },
  { color: '56,189,248', radius: 0.34, speedX: 0.05, speedY: 0.07, phase: 2.1 },
  { color: '244,169,0', radius: 0.28, speedX: 0.07, speedY: 0.05, phase: 4.2 },
  { color: '168,85,247', radius: 0.3, speedX: 0.045, speedY: 0.06, phase: 1.3 },
];

const CosmicField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let scrollY = window.scrollY;

    const stars = STAR_LAYERS.map((layer) => ({
      ...layer,
      pts: Array.from({ length: layer.count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 3,
        r: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        baseAlpha: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
        phase: Math.random() * Math.PI * 2,
      })),
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    let frameId = null;
    let t = 0;

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#07070a';
      ctx.fillRect(0, 0, width, height);

      // flowing aurora glows, additive blend for a plasma/video-like feel
      ctx.globalCompositeOperation = 'lighter';
      AURORA_BLOBS.forEach((b) => {
        const cx = width * (0.5 + 0.42 * Math.sin(t * b.speedX + b.phase));
        const cy = height * (0.5 + 0.4 * Math.cos(t * b.speedY + b.phase * 1.3));
        const r = Math.min(width, height) * b.radius;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${b.color},0.16)`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      // parallax starfield on top
      stars.forEach((layer) => {
        layer.pts.forEach((star) => {
          const y = ((star.y - scrollY * layer.speed) % (height * 3) + height * 3) % (height * 3);
          if (y > height) return;
          const twinkle = 0.7 + 0.3 * Math.sin(t * 12 * layer.twinkle + star.phase);
          ctx.beginPath();
          ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(star.baseAlpha * twinkle).toFixed(3)})`;
          ctx.fill();
        });
      });

      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#07070a]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default CosmicField;
