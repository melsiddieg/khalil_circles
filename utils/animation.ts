import { useEffect, useRef, useState } from 'react';
import { RateFn, smooth, thereAndBack } from './rate';

/** Honours the OS "reduce motion" setting, reactively. */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

/**
 * A play-once timeline running from mount: returns raw progress 0→1 over
 * `durationMs`. Consumers apply their own rate functions and sub-windows
 * (see utils/rate), so one timeline can orchestrate a whole scene the way
 * Manim's Succession/LaggedStart do. Remount (a changing React `key`) to
 * replay. Reduced motion jumps straight to the final frame.
 */
export const useDrawProgress = (durationMs = 1000): number => {
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setT(p); // inside the rAF callback, not the effect body
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, reduced]);

  return reduced ? 1 : t;
};

/**
 * Manim's ChangeDecimalToValue fused with Indicate: tweens a number from
 * its previous value to the new one, and reports a 0→1→0 `pulse` for the
 * duration so callers can flash/scale the term that changed — the visual
 * grammar of "this is the thing that moved".
 */
export const useAnimatedNumber = (
  value: number,
  durationMs = 650,
  rate: RateFn = smooth
): { display: number; pulse: number; changing: boolean } => {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState({ display: value, pulse: 0 });
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) return;
    if (reduced) {
      fromRef.current = value;
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setState({ display: from + (value - from) * rate(p), pulse: thereAndBack(p) });
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, rate, reduced]);

  if (reduced) return { display: value, pulse: 0, changing: false };
  return { display: state.display, pulse: state.pulse, changing: state.pulse > 0.01 };
};
