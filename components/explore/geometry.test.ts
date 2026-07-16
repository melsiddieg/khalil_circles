import { describe, it, expect } from 'vitest';
import { ALL_CIRCLES } from '../../data/circles';
import { sequencePeriod, stabilizerOrder } from '../../data/rotations';
import { gcd, rotationMatches, chordCycles, expandUnits, uniqueChords } from './geometry';

describe('explorable geometry helpers', () => {
  it('rotationMatches lights exactly at multiples of the period', () => {
    for (const circle of ALL_CIRCLES) {
      const seq = circle.atomicSequence;
      const p = sequencePeriod(seq);
      for (let k = 0; k < seq.length; k++) {
        expect(rotationMatches(seq, k), `${circle.id} k=${k}`).toBe(k % p === 0);
      }
    }
  });

  it('chordCycles gives gcd(n,k) cycles of length n/gcd(n,k)', () => {
    for (const n of [6, 8, 9, 10]) {
      for (let k = 1; k < n; k++) {
        const cycles = chordCycles(n, k);
        expect(cycles).toHaveLength(gcd(n, k));
        for (const c of cycles) expect(c).toHaveLength(n / gcd(n, k));
        // Cycles partition {0..n-1}
        expect(new Set(cycles.flat()).size).toBe(n);
      }
    }
  });

  it('the stabilizer star uses cycles of length = stabilizer order', () => {
    for (const circle of ALL_CIRCLES) {
      const n = circle.atomicSequence.length;
      const p = sequencePeriod(circle.atomicSequence);
      if (p === n) continue; // trivial stabilizer: no chords drawn
      const cycles = chordCycles(n, p);
      for (const c of cycles) {
        expect(c).toHaveLength(stabilizerOrder(circle.atomicSequence));
      }
    }
  });

  it('uniqueChords never repeats an undirected chord', () => {
    for (const n of [6, 8, 9, 10, 12]) {
      for (let k = 1; k < n; k++) {
        const chords = uniqueChords(n, k);
        const keys = chords.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`));
        expect(new Set(keys).size, `n=${n} k=${k}`).toBe(chords.length);
        // every chord really is a step of k
        for (const [a, b] of chords) expect((a + k) % n === b || (b + k) % n === a).toBe(true);
      }
    }
  });

  it('uniqueChords halves the count exactly when k = n/2, and keeps n otherwise', () => {
    for (const n of [6, 8, 9, 10, 12]) {
      for (let k = 1; k < n; k++) {
        const expected = (2 * k) % n === 0 ? n / 2 : n;
        expect(uniqueChords(n, k).length, `n=${n} k=${k}`).toBe(expected);
      }
    }
  });

  it('each circle draws its stabilizer chords exactly once', () => {
    // The five diameters of al-Mukhtalif were being drawn twice.
    const expected: Record<string, number> = {
      'circle1-mixed': 5, // n=10, p=5 → 5 diameters, not 10
      'circle2-pure': 6, // {6/2} hexagram
      'circle3-contracted': 9, // {9/3} three triangles
      'circle4-accordant': 0, // trivial stabilizer: nothing to draw
      'circle5-consonant': 8, // {8/2} two squares
    };
    for (const circle of ALL_CIRCLES) {
      const n = circle.atomicSequence.length;
      const p = sequencePeriod(circle.atomicSequence);
      const chords = p >= n ? [] : uniqueChords(n, p);
      expect(chords.length, circle.id).toBe(expected[circle.id]);
      // Every dot is touched by at least one chord (no orphan on a star)
      if (chords.length > 0) {
        expect(new Set(chords.flat()).size).toBe(n);
      }
    }
  });

  it('expandUnits produces the documented letter totals', () => {
    const totals: Record<string, number> = {
      'circle1-mixed': 24,
      'circle2-pure': 21,
      'circle3-contracted': 21,
      'circle4-accordant': 21,
      'circle5-consonant': 20,
    };
    for (const circle of ALL_CIRCLES) {
      const letters = expandUnits(circle.atomicSequence);
      expect(letters, circle.id).toHaveLength(totals[circle.id]);
      // Every unit contributes exactly one initial (moving) letter
      const initials = letters.filter((l) => l.unitInitial);
      expect(initials).toHaveLength(circle.atomicSequence.length);
      expect(initials.every((l) => l.sym === '1')).toBe(true);
    }
  });
});
