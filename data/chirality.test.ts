import { describe, expect, it } from 'vitest';
import { ALL_CIRCLES } from '../constants';
import { sequencePeriod, stabilizerOrder } from './rotations';
import {
  dihedralStabilizerOrder,
  isAchiral,
  isMirrorAxis,
  letterUnits,
  mirrorAxes,
  mirrorMismatches,
  moraicString,
  reflect,
} from './chirality';

/**
 * The mirror test, asserted against the real sequences. These are the claims
 * the interactive makes on screen, so they are checked here rather than
 * trusted: four circles read the same backwards, دائرة المشتبه does not, and
 * the count of mirror axes is exactly the rotational stabilizer.
 */

/** Reflection about m, applied to any cyclic array. */
const reflectsOnto = <T>(arr: T[], m: number): boolean =>
  arr.every((v, i) => v === arr[reflect(i, m, arr.length)]);

describe('mirror symmetry (chirality)', () => {
  it('expands each circle into its letter stream', () => {
    const expected: Record<string, number> = {
      'circle1-mixed': 24,
      'circle2-pure': 21,
      'circle3-contracted': 21,
      'circle4-accordant': 21,
      'circle5-consonant': 20,
    };
    for (const circle of ALL_CIRCLES) {
      const bits = moraicString(circle.atomicSequence);
      expect(bits, circle.id).toMatch(/^[01]+$/);
      expect(bits.length, circle.id).toBe(expected[circle.id]);
      // One parent unit per letter, and every unit represented.
      const units = letterUnits(circle.atomicSequence);
      expect(units).toHaveLength(bits.length);
      expect(new Set(units).size).toBe(circle.atomicSequence.length);
    }
  });

  it('finds a mirror in four circles and none in المشتبه', () => {
    const chiral = ALL_CIRCLES.filter((c) => !isAchiral(moraicString(c.atomicSequence)));
    expect(chiral.map((c) => c.id)).toEqual(['circle4-accordant']);
  });

  it('counts mirror axes exactly equal to the rotational stabilizer', () => {
    // Reflections fixing a necklace form a coset of the rotations fixing it,
    // so there are either none of them or exactly as many. This is the claim
    // the panel puts on screen as Dₙ = Cₙ doubled.
    for (const circle of ALL_CIRCLES) {
      const seq = circle.atomicSequence;
      const bits = moraicString(seq);
      const axes = mirrorAxes(bits);
      const rot = stabilizerOrder(seq);
      if (axes.length > 0) {
        expect(axes.length, circle.id).toBe(rot);
        expect(dihedralStabilizerOrder(bits, rot), circle.id).toBe(2 * rot);
      } else {
        expect(circle.id).toBe('circle4-accordant');
        expect(dihedralStabilizerOrder(bits, rot), circle.id).toBe(rot);
      }
    }
  });

  it('lists the axes it actually found', () => {
    const axes = Object.fromEntries(
      ALL_CIRCLES.map((c) => [c.id, mirrorAxes(moraicString(c.atomicSequence))])
    );
    expect(axes).toEqual({
      'circle1-mixed': [6, 18],
      'circle2-pure': [1, 8, 15],
      'circle3-contracted': [1, 8, 15],
      'circle4-accordant': [],
      'circle5-consonant': [1, 6, 11, 16],
    });
    // Axes are evenly spaced by the period's worth of letters — the mirrors
    // sit one fundamental domain apart, like the rotations do.
    for (const [id, list] of Object.entries(axes)) {
      if (list.length < 2) continue;
      const gaps = list.slice(1).map((m, i) => m - list[i]);
      expect(new Set(gaps).size, id).toBe(1);
    }
  });

  it('agrees with the reverse-equals-rotation formulation', () => {
    // Reflecting about m is the same statement as "the reversed string is a
    // rotation of the original". Two routes to the same fact; if they ever
    // disagree the geometry on screen has drifted from the arithmetic.
    for (const circle of ALL_CIRCLES) {
      const bits = moraicString(circle.atomicSequence);
      const L = bits.length;
      const rev = [...bits].reverse().join('');
      const rotationsMatchingReverse: number[] = [];
      for (let k = 0; k < L; k++) {
        if (bits.slice(k) + bits.slice(0, k) === rev) rotationsMatchingReverse.push(k);
      }
      expect(rotationsMatchingReverse.length, circle.id).toBe(
        mirrorAxes(bits).length
      );
      // axis m ⟺ rotation k = (L − 1 + k) …, i.e. m = (L − 1 + k) mod L
      const derived = rotationsMatchingReverse.map((k) => (L - 1 + k) % L).sort((a, b) => a - b);
      expect(derived, circle.id).toEqual(mirrorAxes(bits));
    }
  });

  it('locates المشتبه‎’s chirality below the unit level', () => {
    // The finding worth the whole panel: circle 4's arrangement of units IS
    // mirror-symmetric. Only when each unit is opened into its letters does
    // the mirror fail — because a watid majmūʿ reversed is not a watid.
    const c4 = ALL_CIRCLES.find((c) => c.id === 'circle4-accordant')!;
    const units = c4.atomicSequence;
    const unitAxes = units.map((_, m) => m).filter((m) => reflectsOnto(units, m));
    expect(unitAxes.length).toBeGreaterThan(0);
    expect(isAchiral(moraicString(units))).toBe(false);

    // And the reason: only the split peg survives reversal intact.
    const selfReverse = [...new Set(units)].filter(
      (u) => u.split('').reverse().join('') === u
    );
    expect(selfReverse).toEqual(['/0/']);
  });

  it('treats reflection as an involution with the right fixed points', () => {
    for (const circle of ALL_CIRCLES) {
      const L = moraicString(circle.atomicSequence).length;
      for (const m of [0, 1, 5, L - 1]) {
        for (let i = 0; i < L; i++) {
          expect(reflect(reflect(i, m, L), m, L)).toBe(i);
        }
        // Fixed points solve 2i ≡ m (mod L), so where the axis crosses the
        // ring depends on parity: an odd-length cycle always pins exactly one
        // letter, while an even-length cycle pins two letters or — when the
        // axis runs between them — none at all. These are the points that
        // would become the mirror boundary of the quotient.
        const fixed = Array.from({ length: L }, (_, i) => i).filter(
          (i) => reflect(i, m, L) === i
        );
        expect(fixed, `${circle.id} L=${L} m=${m}`).toHaveLength(
          L % 2 === 1 ? 1 : m % 2 === 0 ? 2 : 0
        );
      }
    }
  });

  it('reports mismatches only where the reflection really fails', () => {
    for (const circle of ALL_CIRCLES) {
      const bits = moraicString(circle.atomicSequence);
      for (let m = 0; m < bits.length; m++) {
        const bad = mirrorMismatches(bits, m);
        expect(isMirrorAxis(bits, m)).toBe(bad.length === 0);
        for (const i of bad) expect(bits[i]).not.toBe(bits[reflect(i, m, bits.length)]);
        // Mismatches come in pairs — if i is wrong, so is its image.
        for (const i of bad) expect(bad).toContain(reflect(i, m, bits.length));
      }
    }
  });

  it('keeps the rotational picture unchanged', () => {
    // Guard: the mirror work must not disturb the numbers the rest of the
    // app is built on.
    expect(ALL_CIRCLES.map((c) => sequencePeriod(c.atomicSequence))).toEqual([5, 2, 3, 9, 2]);
    expect(ALL_CIRCLES.map((c) => stabilizerOrder(c.atomicSequence))).toEqual([2, 3, 3, 1, 4]);
  });
});
