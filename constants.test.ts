import { describe, it, expect } from 'vitest';
import { parseMeterPattern, ALL_CIRCLES, getCircleById } from './constants';
import { Meter } from './types';

/**
 * Golden expectations: the merged tafila sequence for every one of the 16
 * classical meters, keyed by meter id. Derived from Al-Khalil's system —
 * if parseMeterPattern or the circle data drifts, these fail loudly.
 */
const EXPECTED_TAFAIL: Record<string, string[]> = {
  // Circle 1 — المختلف
  'al-tawil': ['فعولن', 'مفاعيلن', 'فعولن', 'مفاعيلن'],
  'al-madid': ['فاعلاتن', 'فاعلن', 'فاعلاتن', 'فاعلن'],
  'al-basit': ['مستفعلن', 'فاعلن', 'مستفعلن', 'فاعلن'],
  // Circle 2 — المؤتلف
  'al-wafir': ['مفاعلتن', 'مفاعلتن', 'مفاعلتن'],
  'al-kamil': ['متفاعلن', 'متفاعلن', 'متفاعلن'],
  // Circle 3 — المجتلب (uniform repetition special case)
  'al-hazaj': ['مفاعيلن', 'مفاعيلن', 'مفاعيلن'],
  'al-rajaz': ['مستفعلن', 'مستفعلن', 'مستفعلن'],
  'al-ramal': ['فاعلاتن', 'فاعلاتن', 'فاعلاتن'],
  // Circle 4 — المشتبه
  'al-mudari': ['مفاعيلن', 'فاع لاتن', 'مفاعيلن'],
  'al-muqtadab': ['مفعولات', 'مستفعلن', 'مستفعلن'],
  'al-mujtath': ['مستفع لن', 'فاعلاتن', 'فاعلاتن'],
  'al-sari': ['مستفعلن', 'مستفعلن', 'مفعولات'],
  'al-munsarih': ['مستفعلن', 'مفعولات', 'مستفعلن'],
  'al-khafif': ['فاعلاتن', 'مستفع لن', 'فاعلاتن'],
  // Circle 5 — المتفق
  'al-mutaqarib': ['فَعُولُن', 'فَعُولُن', 'فَعُولُن', 'فَعُولُن'],
  'al-mutadarik': ['فَاعِلُن', 'فَاعِلُن', 'فَاعِلُن', 'فَاعِلُن'],
};

describe('parseMeterPattern', () => {
  const allMeters = ALL_CIRCLES.flatMap((circle) =>
    circle.meters.map((meter) => ({ circle, meter }))
  );

  it('covers all 16 classical meters', () => {
    expect(allMeters).toHaveLength(16);
    expect(Object.keys(EXPECTED_TAFAIL).sort()).toEqual(allMeters.map((m) => m.meter.id).sort());
  });

  it.each(allMeters.map(({ circle, meter }) => [meter.id, meter, circle] as const))(
    '%s parses to its golden tafila sequence',
    (id, meter, circle) => {
      const merged = parseMeterPattern(meter, circle).map((t) => t.merged);
      expect(merged).toEqual(EXPECTED_TAFAIL[id]);
    }
  );

  it('resolves the circle from circleId when no circle is passed', () => {
    for (const { circle, meter } of allMeters) {
      const withCircle = parseMeterPattern(meter, circle).map((t) => t.merged);
      const withoutCircle = parseMeterPattern(meter).map((t) => t.merged);
      expect(withoutCircle).toEqual(withCircle);
    }
  });

  it('wraps around the atomic sequence without crashing (circle 4 regression)', () => {
    const circle = getCircleById('circle4-accordant')!;
    const wrapped: Meter = {
      ...circle.meters[0],
      startOffset: circle.atomicSequence.length - 1, // group spans the wrap point
    };
    const pattern = parseMeterPattern(wrapped, circle);
    expect(pattern).toHaveLength(wrapped.parsingInstructions.length);
    for (const tafila of pattern) {
      expect(tafila.merged.length).toBeGreaterThan(0);
    }
  });

  it('computes shared feet for every meter pair without crashing (compare view)', () => {
    for (const a of allMeters) {
      const aFeet = new Set(parseMeterPattern(a.meter, a.circle).map((tf) => tf.merged));
      for (const b of allMeters) {
        const shared = parseMeterPattern(b.meter, b.circle)
          .map((tf) => tf.merged)
          .filter((foot) => aFeet.has(foot));
        expect(shared.length).toBeLessThanOrEqual(b.meter.parsingInstructions.length);
      }
    }
  });

  it('falls back to raw atomic units for unmapped patterns', () => {
    const circle = getCircleById('circle1-mixed')!;
    const synthetic: Meter = {
      ...circle.meters[0],
      id: 'synthetic-test-meter',
      parsingInstructions: [5], // no 5-unit tafila exists in the map
    };
    const pattern = parseMeterPattern(synthetic, circle);
    expect(pattern).toHaveLength(1);
    // Fallback joins the raw atomic units
    expect(pattern[0].merged).toBe(circle.atomicSequence.slice(0, 5).join(''));
  });
});
