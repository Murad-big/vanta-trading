import { useEffect } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Event-driven interpolation: pointer/scroll values stay outside React state.
// The loop goes idle after settling and is fully removed when motion is paused.
export default function useMotionScene(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    const hero = root.querySelector('.hero');
    const progress = root.querySelector('.scroll-progress');
    const halo = root.querySelector('.cursor-halo');
    const finePointer = window.matchMedia('(pointer: fine)');
    const resizeObserver = new ResizeObserver(schedule);
    let frame = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    let pointerX = 0, pointerY = 0, haloX = 0, haloY = 0;
    let targetScroll = 0, scroll = 0;
    let magnetic = null;
    let magneticX = 0, magneticY = 0;
    let activePointer = false;
    let dirty = true;

    function render() {
      frame = 0;
      const height = window.innerHeight;
      const heroRect = hero.getBoundingClientRect();
      targetScroll = clamp(-heroRect.top / Math.max(heroRect.height, 1), 0, 1);
      const fullHeight = document.documentElement.scrollHeight - height;
      progress.style.transform = `scaleX(${fullHeight > 0 ? clamp(window.scrollY / fullHeight, 0, 1) : 0})`;

      if (!enabled || document.hidden) return;

      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      scroll += (targetScroll - scroll) * 0.1;
      haloX += (pointerX - haloX) * 0.15;
      haloY += (pointerY - haloY) * 0.15;
      hero.style.setProperty('--pointer-x', x.toFixed(4));
      hero.style.setProperty('--pointer-y', y.toFixed(4));
      hero.style.setProperty('--hero-travel', `${(scroll * 105).toFixed(2)}px`);
      hero.style.setProperty('--hero-turn', `${(scroll * 12).toFixed(2)}deg`);
      hero.style.setProperty('--hero-scale', (1 + scroll * 0.09).toFixed(4));
      halo.style.transform = `translate3d(${haloX.toFixed(1)}px,${haloY.toFixed(1)}px,0)`;
      halo.classList.toggle('is-visible', activePointer && finePointer.matches);

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const tx = clamp((pointerX - rect.left - rect.width / 2) * 0.19, -12, 12);
        const ty = clamp((pointerY - rect.top - rect.height / 2) * 0.22, -10, 10);
        magneticX += (tx - magneticX) * 0.15;
        magneticY += (ty - magneticY) * 0.15;
        magnetic.style.translate = `${magneticX.toFixed(2)}px ${magneticY.toFixed(2)}px`;
      }

      const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002
        || Math.abs(targetScroll - scroll) > 0.002
        || Math.abs(pointerX - haloX) + Math.abs(pointerY - haloY) > 0.2;
      if (moving || dirty) { dirty = false; frame = requestAnimationFrame(render); }
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(render);
    }

    function releaseMagnet() {
      if (magnetic) magnetic.style.translate = '';
      magnetic = null;
      magneticX = 0;
      magneticY = 0;
    }

    function move(event) {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!activePointer) { haloX = pointerX; haloY = pointerY; }
      activePointer = true;
      const rect = hero.getBoundingClientRect();
      const inside = pointerY >= rect.top && pointerY <= rect.bottom;
      targetX = inside ? clamp((pointerX - rect.left) / rect.width - 0.5, -0.5, 0.5) : 0;
      targetY = inside ? clamp((pointerY - rect.top) / rect.height - 0.5, -0.5, 0.5) : 0;
      const button = event.target.closest('.button, .orbit-badge');
      if (button !== magnetic) { releaseMagnet(); magnetic = button; }
      halo.classList.toggle('is-interactive', !!event.target.closest('a,button,input,select'));
      dirty = true;
      schedule();
    }

    function leave() {
      activePointer = false;
      targetX = targetY = 0;
      releaseMagnet();
      schedule();
    }

    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    }

    if (enabled) {
      root.addEventListener('pointermove', move, { passive: true });
      root.addEventListener('pointerleave', leave);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    resizeObserver.observe(root);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', visibility);
      resizeObserver.disconnect();
      releaseMagnet();
      halo.classList.remove('is-visible');
      ['--pointer-x', '--pointer-y', '--hero-travel', '--hero-turn', '--hero-scale'].forEach(name => hero.style.removeProperty(name));
    };
  }, [rootRef, enabled]);
}
