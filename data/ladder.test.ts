import { describe, expect, it } from 'vitest';
import {
  ALL_FEET,
  COLLISIONS,
  COMPOSITIONS_BUILT,
  LADDER_COUNTS,
  UNITS,
  arrangements,
  moraOf,
  unitById,
} from './ladder';
import { ALL_CIRCLES } from '../constants';

describe('the ladder of abstraction', () => {
  it('agrees with the circles about what a unit is', () => {
    // Every atomic unit any circle actually uses must be in the alphabet,
    // so the ladder cannot drift from the data the rest of the app draws.
    const used = new Set(ALL_CIRCLES.flatMap((c) => c.atomicSequence));
    for (const id of used) expect(unitById(id), id).toBeTruthy();
  });

  it('three of the five units are the single family 1^k 0', () => {
    const family = UNITS.filter((u) => u.family !== null);
    expect(family).toHaveLength(3);
    for (const u of family) expect(u.mora).toBe('1'.repeat(u.family!) + '0');
    expect(family.map((u) => u.family)).toEqual([1, 2, 3]);
  });

  it('names the two irregulars, and مفروق really is مجموع split', () => {
    const odd = UNITS.filter((u) => u.family === null).map((u) => u.mora);
    expect(odd.sort()).toEqual(['101', '11']);
    const majmu = unitById('0//')!.mora; // 110 — the movings joined
    const mafruq = unitById('/0/')!.mora; // 101 — the quiescent between them
    expect(majmu).toBe('110');
    expect(mafruq).toBe('101');
    // same letters, same count of each — only the quiescent's position moves
    const bag = (s: string) => [...s].sort().join('');
    expect(bag(majmu)).toBe(bag(mafruq));
  });

  it('produces distinct orderings of a multiset, without duplicates', () => {
    expect(arrangements(['a', 'b'])).toHaveLength(2);
    expect(arrangements(['a', 'a', 'b'])).toHaveLength(3);
    expect(arrangements(['a', 'b', 'c'])).toHaveLength(6);
    const ps = arrangements(['x', 'x', 'y', 'y']);
    expect(ps).toHaveLength(6);
    expect(new Set(ps.map((p) => p.join(','))).size).toBe(6);
  });

  it('the classical feet fall out of the arrangements', () => {
    const named = (id: string) =>
      COMPOSITIONS_BUILT.find((c) => c.id === id)!.feet.map((f) => f.nameAr);
    // a peg and a cord: two orderings, two feet
    expect(named('watid-sabab')).toEqual(['فعولن', 'فاعلن']);
    // a peg and two cords: three orderings, the three seven-letter feet
    expect(named('watid-2sabab').sort()).toEqual(['فاعلاتن', 'مستفعلن', 'مفاعيلن'].sort());
    // a peg and a cluster: the two feet of circle 2
    expect(named('watid-fasila').sort()).toEqual(['متفاعلن', 'مفاعلتن'].sort());
    // every foot the construction yields is a named classical foot
    for (const f of ALL_FEET) expect(f.nameAr, f.units.join(',')).not.toBe('—');
  });

  it('moraic strings concatenate the units in reading order', () => {
    expect(moraOf(['0//', '0/'])).toBe('11010'); // فعولن
    expect(moraOf(['0/', '0/', '0//'])).toBe('1010110'); // مستفعلن
    expect(moraOf(['0///', '0//'])).toBe('1110110'); // متفاعلن
  });

  it('abstraction loses information: exactly two feet are sound-collisions', () => {
    expect(COLLISIONS).toHaveLength(2);
    const pairs = COLLISIONS.map((c) => ({
      mora: c.mora,
      names: c.feet.map((f) => f.nameAr).sort(),
    })).sort((a, b) => a.mora.localeCompare(b.mora));
    expect(pairs).toEqual([
      { mora: '1010110', names: ['مستفع لن', 'مستفعلن'] },
      { mora: '1011010', names: ['فاع لاتن', 'فاعلاتن'] },
    ]);
  });

  it('every collision involves the split peg — the source of المشتبه', () => {
    for (const c of COLLISIONS) {
      const withMafruq = c.feet.filter((f) => f.units.includes('/0/'));
      expect(withMafruq, c.mora).toHaveLength(1);
    }
    // and the composition that carries it belongs to circle 4
    const mafruqClass = COMPOSITIONS_BUILT.find((c) => c.id === 'mafruq-2sabab')!;
    expect(mafruqClass.circleIds).toContain('circle4-accordant');
  });

  it('the funnel counts are consistent with what was built', () => {
    expect(LADDER_COUNTS.units).toBe(UNITS.length);
    expect(LADDER_COUNTS.arrangements).toBe(ALL_FEET.length);
    expect(LADDER_COUNTS.distinctFeet).toBe(LADDER_COUNTS.arrangements - COLLISIONS.length);
    // 10 arrangements, 8 distinct sounds
    expect(LADDER_COUNTS.arrangements).toBe(10);
    expect(LADDER_COUNTS.distinctFeet).toBe(8);
    expect(LADDER_COUNTS.circles).toBe(ALL_CIRCLES.length);
  });
});
