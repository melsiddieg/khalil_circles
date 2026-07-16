import { describe, it, expect } from 'vitest';
import {
  linear,
  smooth,
  rushInto,
  rushFrom,
  slowInto,
  doubleSmooth,
  thereAndBack,
  thereAndBackWithPause,
  wiggle,
  easeOutBounce,
  easeOutBack,
  easeInOutBack,
  easeInOutCubic,
  laggedProgress,
  window as subWindow,
  clamp01,
  RateFn,
} from './rate';

/** Every rate function must pin the unit interval's endpoints. */
const ENDPOINT_FNS: [string, RateFn][] = [
  ['linear', linear],
  ['smooth', smooth],
  ['rushInto', rushInto],
  ['rushFrom', rushFrom],
  ['slowInto', slowInto],
  ['doubleSmooth', doubleSmooth],
  ['easeOutBounce', easeOutBounce],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeInOutCubic', easeInOutCubic],
];

describe('rate functions (ported from Manim)', () => {
  it.each(ENDPOINT_FNS)('%s maps 0→0 and 1→1', (_name, fn) => {
    expect(fn(0)).toBeCloseTo(0, 6);
    expect(fn(1)).toBeCloseTo(1, 6);
  });

  it.each(ENDPOINT_FNS)('%s clamps out-of-range input', (_name, fn) => {
    expect(fn(-3)).toBeCloseTo(fn(0), 6);
    expect(fn(4)).toBeCloseTo(fn(1), 6);
  });

  it('smooth is symmetric about the midpoint and monotonic', () => {
    expect(smooth(0.5)).toBeCloseTo(0.5, 6);
    for (const t of [0.1, 0.25, 0.4]) {
      // smooth(t) + smooth(1-t) = 1 by the sigmoid's symmetry
      expect(smooth(t) + smooth(1 - t)).toBeCloseTo(1, 6);
    }
    let prev = -Infinity;
    for (let t = 0; t <= 1; t += 0.05) {
      const v = smooth(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('smooth eases: it is slower than linear at the ends, faster in the middle', () => {
    expect(smooth(0.1)).toBeLessThan(0.1);
    expect(smooth(0.9)).toBeGreaterThan(0.9);
  });

  it('rushInto accelerates into the end; rushFrom decelerates out of the start', () => {
    // rushInto is smooth's first (accelerating) half: behind linear throughout
    expect(rushInto(0.1)).toBeLessThan(0.1);
    expect(rushInto(0.9)).toBeLessThan(0.9);
    // rushFrom is smooth's second (decelerating) half: ahead of linear throughout
    expect(rushFrom(0.1)).toBeGreaterThan(0.1);
    expect(rushFrom(0.9)).toBeGreaterThan(0.9);
  });

  it('thereAndBack peaks at the midpoint and returns to zero', () => {
    expect(thereAndBack(0)).toBeCloseTo(0, 6);
    expect(thereAndBack(0.5)).toBeCloseTo(1, 6);
    expect(thereAndBack(1)).toBeCloseTo(0, 6);
  });

  it('thereAndBackWithPause holds 1 across the pause', () => {
    expect(thereAndBackWithPause(0.5)).toBeCloseTo(1, 6);
    expect(thereAndBackWithPause(0.4)).toBeCloseTo(1, 6); // inside the 1/3 pause
    expect(thereAndBackWithPause(0)).toBeCloseTo(0, 6);
    expect(thereAndBackWithPause(1)).toBeCloseTo(0, 6);
  });

  it('easeOutBack overshoots past 1 before settling', () => {
    const peak = Math.max(...Array.from({ length: 101 }, (_, i) => easeOutBack(i / 100)));
    expect(peak).toBeGreaterThan(1);
    expect(easeOutBack(1)).toBeCloseTo(1, 6);
  });

  it('wiggle oscillates around zero and ends at zero', () => {
    expect(wiggle(0)).toBeCloseTo(0, 6);
    expect(wiggle(1)).toBeCloseTo(0, 6);
    const samples = Array.from({ length: 101 }, (_, i) => wiggle(i / 100));
    expect(Math.max(...samples)).toBeGreaterThan(0);
    expect(Math.min(...samples)).toBeLessThan(0);
  });

  it('clamp01 bounds its input', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.3)).toBe(0.3);
  });
});

describe('laggedProgress (Manim LaggedStart timing)', () => {
  it('with lagRatio 0 every child moves in unison', () => {
    for (const i of [0, 1, 2]) {
      expect(laggedProgress(0.4, i, 3, 0)).toBeCloseTo(0.4, 6);
    }
  });

  it('with lagRatio 1 children run strictly in sequence', () => {
    // 3 children, total = 3 units: child 0 owns [0,1/3], child 1 [1/3,2/3]…
    expect(laggedProgress(1 / 3, 0, 3, 1)).toBeCloseTo(1, 6);
    expect(laggedProgress(1 / 3, 1, 3, 1)).toBeCloseTo(0, 6);
    expect(laggedProgress(2 / 3, 1, 3, 1)).toBeCloseTo(1, 6);
    expect(laggedProgress(2 / 3, 2, 3, 1)).toBeCloseTo(0, 6);
  });

  it('the first child starts immediately and the last finishes exactly at t=1', () => {
    const n = 5;
    const lag = 0.3;
    expect(laggedProgress(0.001, 0, n, lag)).toBeGreaterThan(0);
    expect(laggedProgress(1, n - 1, n, lag)).toBeCloseTo(1, 6);
    // …and nobody is still moving after the group ends
    for (let i = 0; i < n; i++) expect(laggedProgress(1, i, n, lag)).toBeCloseTo(1, 6);
  });

  it('children start in order', () => {
    const n = 4;
    const lag = 0.5;
    const at = 0.45;
    const values = Array.from({ length: n }, (_, i) => laggedProgress(at, i, n, lag));
    for (let i = 1; i < n; i++) expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
  });

  it('a single child is just the parent progress', () => {
    expect(laggedProgress(0.7, 0, 1, 0.5)).toBeCloseTo(0.7, 6);
  });
});

describe('window (sub-timeline)', () => {
  it('maps a sub-range onto the unit interval', () => {
    expect(subWindow(0.25, 0.25, 0.75)).toBeCloseTo(0, 6);
    expect(subWindow(0.5, 0.25, 0.75)).toBeCloseTo(0.5, 6);
    expect(subWindow(0.75, 0.25, 0.75)).toBeCloseTo(1, 6);
    expect(subWindow(0.1, 0.25, 0.75)).toBeCloseTo(0, 6); // before it starts
    expect(subWindow(0.9, 0.25, 0.75)).toBeCloseTo(1, 6); // after it ends
  });
});
