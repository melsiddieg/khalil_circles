import { describe, expect, it } from 'vitest';
import { ALL_CIRCLES } from '../../constants';
import { CIRCLE_ROTATIONS, sequencePeriod, stabilizerOrder } from '../../data/rotations';
import { chordCycles, uniqueChords } from '../explore/geometry';
import { buildRosette, mixHex, petalPath, ROSETTES, scallopPath, starStep } from './rosette';

/**
 * Geometry emitted as strings is exactly the thing that rots silently, so it
 * gets golden tests in the same idiom as data/rotations.test.ts.
 */

const NUMBER_TOKEN = /-?\d+(\.\d+)?/g;

/** Every numeric token in a `d` string must be finite. */
const allFinite = (d: string): boolean =>
  (d.match(NUMBER_TOKEN) ?? []).every((t) => Number.isFinite(Number(t)));

describe('rosette geometry', () => {
  it('emits clean path data for every circle', () => {
    for (const circle of ALL_CIRCLES) {
      const g = ROSETTES[circle.id];
      const paths = [
        g.def.petal,
        g.def.petalInset,
        g.def.inner,
        g.def.innerInset,
        ...g.cab,
        ...g.ring.petalShadow,
        ...g.ring.innerShadow,
        g.ring.tendril,
        g.ring.rim,
        g.ring.rimBand,
        g.ring.band,
        g.ring.bandInner,
        g.centre.qplate,
        g.centre.star,
      ];
      for (const d of paths) {
        expect(d.length, circle.id).toBeGreaterThan(0);
        expect(d, circle.id).not.toMatch(/NaN|Infinity|undefined/);
        expect(allFinite(d), `${circle.id}: ${d.slice(0, 80)}`).toBe(true);
      }
    }
  });

  it('is deterministic — two builds are byte-identical', () => {
    for (const circle of ALL_CIRCLES) {
      expect(JSON.stringify(buildRosette(circle))).toBe(JSON.stringify(buildRosette(circle)));
    }
  });

  it('reads its structure off the circle, not off a table', () => {
    for (const circle of ALL_CIRCLES) {
      const g = ROSETTES[circle.id];
      const seq = circle.atomicSequence;
      // One petal, one cabochon, one pearl slot per atomic unit.
      expect(g.n).toBe(seq.length);
      expect(g.cab).toHaveLength(seq.length);
      expect(g.period).toBe(sequencePeriod(seq));
      expect(g.stabilizer).toBe(stabilizerOrder(seq));
      expect(g.ring.petalShadow).toHaveLength(2);
      // n petals + n windows in the compound shadow path.
      expect((g.ring.petalShadow[0].match(/M/g) ?? []).length).toBe(2 * g.n);
      // A mirrored scroll pair per gap.
      expect((g.ring.tendril.match(/M/g) ?? []).length).toBe(2 * g.n);
    }
  });

  it('turns by the stabilizer generator, and lands on itself', () => {
    for (const circle of ALL_CIRCLES) {
      const g = ROSETTES[circle.id];
      const seq = circle.atomicSequence;
      if (g.trivial) {
        expect(g.turnDeg).toBe(0);
        continue;
      }
      expect(g.turnDeg).toBeCloseTo(-(360 * g.period) / g.n, 10);
      // The whole point: the rotation carries cabochon i onto position i+p,
      // and the colouring is unchanged — so the infinite loop has no seam.
      for (let i = 0; i < g.n; i++) expect(seq[i]).toBe(seq[(i + g.period) % g.n]);
    }
  });

  it('draws the same centre figure MathView draws', () => {
    // {10/5} five diameters · {6/2} hexagram · {9/3} three triangles ·
    // {8/2} two squares (the rub el hizb) · circle 4 has no stabilizer figure.
    const expected: Record<string, number> = {
      'circle1-mixed': 5,
      'circle2-pure': 6,
      'circle3-contracted': 9,
      'circle4-accordant': 0,
      'circle5-consonant': 8,
    };
    for (const circle of ALL_CIRCLES) {
      const g = ROSETTES[circle.id];
      const k = g.trivial ? 0 : g.period;
      expect(uniqueChords(g.n, k), circle.id).toHaveLength(expected[circle.id]);
    }
  });

  it('gives circle 4 a unicursal star, because its orbit is the whole group', () => {
    const g = ROSETTES['circle4-accordant'];
    expect(g.trivial).toBe(true);
    expect(g.stabilizer).toBe(1);
    const k = starStep(g.n, g.period);
    expect(k).toBe(4); // {9/4}
    // One closed circuit through all nine vertices.
    const cycles = chordCycles(g.n, k);
    expect(cycles).toHaveLength(1);
    expect(cycles[0]).toHaveLength(9);
    // Its q-plate is the single teardrop needle, aimed at the mafrūq.
    expect(g.mafruq).toBe(3);
    // The C₃ it almost has: exactly two of the nine k=3 chords fail, both of
    // them touching that one watid mafrūq.
    const bad = uniqueChords(9, 3).filter(([i, j]) => g.units[i] !== g.units[j]);
    expect(bad).toEqual([
      [0, 3],
      [3, 6],
    ]);
  });

  it('engraves the rotation table into the pearl course', () => {
    let meters = 0;
    let muhmal = 0;
    for (const circle of ALL_CIRCLES) {
      const g = ROSETTES[circle.id];
      const kinds = CIRCLE_ROTATIONS[circle.id].map((r) => r.kind);
      const count = (d: string) => (d.match(/M/g) ?? []).length;
      expect(count(g.pearl.meter), circle.id).toBe(kinds.filter((k) => k === 'meter').length);
      expect(count(g.pearl.muhmal), circle.id).toBe(kinds.filter((k) => k === 'muhmal').length);
      expect(count(g.pearl.duplicate), circle.id).toBe(
        kinds.filter((k) => k === 'duplicate').length
      );
      meters += count(g.pearl.meter);
      muhmal += count(g.pearl.muhmal);
    }
    // The app's headline statistic, engraved: 16 meters, 5 neglected.
    expect(meters).toBe(16);
    expect(muhmal).toBe(5);
  });

  it('inflates petals outward and shrinks their windows (the shadow ramp)', () => {
    const rMax = (d: string): number =>
      Math.max(
        ...(d.match(/-?\d+(\.\d+)?,-?\d+(\.\d+)?/g) ?? []).map((pt) => {
          const [x, y] = pt.split(',').map(Number);
          return Math.hypot(x, y);
        })
      );
    const base = petalPath({ n: 9, r0: 24, r1: 94 });
    const fat = petalPath({ n: 9, r0: 24, r1: 94, grow: 3.2 });
    const thin = petalPath({ n: 9, r0: 24, r1: 94, grow: -3.2 });
    expect(rMax(fat)).toBeGreaterThan(rMax(base));
    expect(rMax(thin)).toBeLessThan(rMax(base));
  });

  it('places the scallop apex exactly on its target radius', () => {
    // Sample the quadratic at t=½ and check it hits rApex. The closed form is
    // rc = 2·rApex − rv·cos(π/lobes); an error here shows up as a rim that is
    // subtly the wrong size, which is very hard to see by eye.
    const d = scallopPath(18, 137, 149);
    const nums = (d.match(NUMBER_TOKEN) ?? []).map(Number);
    const [x0, y0, cx, cy, x1, y1] = nums;
    const mx = (x0 + 2 * cx + x1) / 4;
    const my = (y0 + 2 * cy + y1) / 4;
    expect(Math.hypot(mx, my)).toBeCloseTo(149, 1);
  });

  it('mixes colours deterministically', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000');
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff');
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mixHex('#134e4a', '#04060e', 0.7)).toMatch(/^#[0-9a-f]{6}$/);
  });
});
