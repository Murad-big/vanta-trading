import { useEffect, useRef } from 'react';

export default function ParticleField({ enabled }) {
  const canvasRef = useRef(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas.parentElement;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;
    let width = 1, height = 1, mobile = false;
    let visible = true, frame = 0, lastFrame = 0;
    let mouseX = -1000, mouseY = -1000;

    function paint() {
      const time = elapsed.current * 0.0003;
      context.clearRect(0, 0, width, height);
      const columns = mobile ? 34 : 72;
      const rows = mobile ? 30 : 38;
      const gapX = width / (columns - 3);
      const gapY = height / (rows - 7);
      context.fillStyle = '#a5d983';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const baseX = (col - 1) * gapX;
          const baseY = (row - 3) * gapY;
          const wave = Math.sin(col * 0.105 + row * 0.065 + time) * Math.cos(row * 0.15 - time * 0.65);
          let x = baseX + Math.sin(row * 0.13 + time * 0.6) * 25;
          let y = baseY + wave * (mobile ? 36 : 76);
          const dx = x - mouseX, dy = y - mouseY;
          const distance = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - distance / 170);
          if (distance > 0) { x += dx / distance * force * 24; y += dy / distance * force * 24; }
          const edge = Math.max(0, Math.min(1, x / 90, (width - x) / 90, y / 80, (height - y) / 90));
          const textProtection = mobile ? (y < height * 0.43 ? 0.2 : 0.85) : (x < width * 0.42 ? 0.18 : 1);
          const brightness = 0.12 + (wave + 1) * 0.12 + force * 0.36;
          context.globalAlpha = brightness * edge * textProtection;
          const size = 1 + (wave + 1) * 0.55 + force;
          context.fillRect(x, y, size, size);
        }
      }
      context.globalAlpha = 1;
    }

    function draw(now) {
      frame = 0;
      if (!enabled || !visible || document.hidden) return;
      const interval = mobile ? 1000 / 30 : 1000 / 45;
      if (!lastFrame) lastFrame = now;
      if (now - lastFrame >= interval) {
        elapsed.current += Math.min(now - lastFrame, 70);
        lastFrame = now;
        paint();
      }
      frame = requestAnimationFrame(draw);
    }

    function start() {
      if (!frame && enabled && visible && !document.hidden) { lastFrame = 0; frame = requestAnimationFrame(draw); }
    }

    function stop() { cancelAnimationFrame(frame); frame = 0; }

    const resize = new ResizeObserver(() => {
      width = hero.clientWidth; height = hero.clientHeight; mobile = width < 680;
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint();
      start();
    });
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { rootMargin: '60px' });
    const pointer = event => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };
    const leave = () => { mouseX = mouseY = -1000; };
    const visibility = () => { if (document.hidden) stop(); else start(); };

    resize.observe(hero);
    intersection.observe(hero);
    if (enabled) { hero.addEventListener('pointermove', pointer, { passive: true }); hero.addEventListener('pointerleave', leave); }
    document.addEventListener('visibilitychange', visibility);
    return () => { stop(); resize.disconnect(); intersection.disconnect(); hero.removeEventListener('pointermove', pointer); hero.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility); };
  }, [enabled]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
