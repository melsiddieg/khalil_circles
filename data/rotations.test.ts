import { describe, it, expect } from 'vitest';
import { ALL_CIRCLES } from './circles';
import {
  CIRCLE_ROTATIONS,
  sequencePeriod,
  canonicalOffset,
  stabilizerOrder,
} from './rotations';

describe('rotation table integrity', () => {
  it('covers every offset of every circle exactly once', () => {
    for (const circle of ALL_CIRCLES) {
      const rotations = CIRCLE_ROTATIONS[circle.id];
      expect(rotations, circle.id).toBeDefined();
      expect(rotations).toHaveLength(circle.atomicSequence.length);
    }
  });

  it('meter entries sit at each meter\'s startOffset', () => {
    for (const circle of ALL_CIRCLES) {
      const rotations = CIRCLE_ROTATIONS[circle.id];
      for (const meter of circle.meters) {
        const info = rotations[meter.startOffset];
        expect(info.kind, `${circle.id}@${meter.startOffset}`).toBe('meter');
        if (info.kind === 'meter') expect(info.meterId).toBe(meter.id);
      }
      // And every meter entry corresponds to a real meter
      rotations.forEach((info, offset) => {
        if (info.kind === 'meter') {
          const meter = circle.meters.find((m) => m.id === info.meterId);
          expect(meter, `${circle.id}@${offset}`).toBeDefined();
          expect(meter!.startOffset).toBe(offset);
        }
      });
    }
  });

  it('duplicates point at equivalent rotations under the sequence period', () => {
    for (const circle of ALL_CIRCLES) {
      const period = sequencePeriod(circle.atomicSequence);
      CIRCLE_ROTATIONS[circle.id].forEach((info, offset) => {
        if (info.kind === 'duplicate') {
          expect((offset - info.of) % period, `${circle.id}@${offset}`).toBe(0);
          // A duplicate's target is never itself a duplicate
          expect(CIRCLE_ROTATIONS[circle.id][info.of].kind).not.toBe('duplicate');
        }
      });
    }
  });

  it('distinct rotations (period) = meters + muhmal per circle', () => {
    // The heart of the necklace math: 5+2+3+9+2 distinct rotations, 16 used.
    const summary = ALL_CIRCLES.map((circle) => {
      const rotations = CIRCLE_ROTATIONS[circle.id];
      const meters = rotations.filter((r) => r.kind === 'meter').length;
      const muhmal = rotations.filter((r) => r.kind === 'muhmal').length;
      const period = sequencePeriod(circle.atomicSequence);
      expect(meters + muhmal, circle.id).toBe(period);
      return { meters, muhmal };
    });
    expect(summary.reduce((s, c) => s + c.meters, 0)).toBe(16);
    expect(summary.reduce((s, c) => s + c.muhmal, 0)).toBe(5);
  });

  it('satisfies the orbit–stabilizer theorem per circle', () => {
    // C_n acts on the necklace; |orbit| = period, |stabilizer| = n/period.
    const expectedStabilizers: Record<string, number> = {
      'circle1-mixed': 2, // C₂: rotation by 5 of 10 units fixes the sequence
      'circle2-pure': 3, // C₃
      'circle3-contracted': 3, // C₃
      'circle4-accordant': 1, // trivial — no internal symmetry
      'circle5-consonant': 4, // C₄ — most symmetric, fewest meters
    };
    for (const circle of ALL_CIRCLES) {
      const n = circle.atomicSequence.length;
      const orbit = sequencePeriod(circle.atomicSequence);
      const stab = stabilizerOrder(circle.atomicSequence);
      expect(stab, circle.id).toBe(expectedStabilizers[circle.id]);
      expect(orbit * stab, circle.id).toBe(n);
      // Rotation by the period really does fix the sequence
      const rotated = circle.atomicSequence.map(
        (_, i) => circle.atomicSequence[(i + orbit) % n]
      );
      expect(rotated, circle.id).toEqual(circle.atomicSequence);
    }
  });

  it('canonicalOffset resolves duplicates', () => {
    expect(canonicalOffset('circle1-mixed', 7)).toBe(2);
    expect(canonicalOffset('circle1-mixed', 2)).toBe(2);
    expect(canonicalOffset('circle5-consonant', 6)).toBe(0);
  });

  it('muhmal instructions consume exactly one full pass of the pattern span', () => {
    for (const circle of ALL_CIRCLES) {
      CIRCLE_ROTATIONS[circle.id].forEach((info) => {
        if (info.kind === 'muhmal') {
          const span = info.parsingInstructions.reduce((s, n) => s + n, 0);
          // Same span as the circle's own meters use
          const meterSpan = circle.meters[0].parsingInstructions.reduce((s, n) => s + n, 0);
          expect(span).toBe(meterSpan);
        }
      });
    }
  });
});
