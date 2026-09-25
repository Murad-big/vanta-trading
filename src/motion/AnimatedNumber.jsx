import { useLayoutEffect, useRef } from 'react';
import { money } from '../lib/markets.js';

export default function AnimatedNumber({ value, paused, className = '' }) {
  const element = useRef(null);
  const current = useRef(value);

  useLayoutEffect(() => {
    if (paused || document.hidden || current.current === value) {
      current.current = value;
      element.current.textContent = money(value);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame;
    const update = time => {
      const progress = Math.min(1, (time - start) / 600);
      current.current = from + (value - from) * (1 - (1 - progress) ** 3);
      element.current.textContent = money(current.current);
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    element.current.textContent = money(from);
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value, paused]);

  return <span ref={element} className={className}>{money(value)}</span>;
}
