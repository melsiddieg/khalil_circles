import { describe, expect, it } from 'vitest';
import { CONFUSION_EDGES, FASILA_COLLAPSE, applyRewrite, isolatedMeterIds } from './tadakhul';
import { getCircleById, getMeterById } from './circles';
import { getTotalMeterCount, ALL_CIRCLES } from '../constants';
import { expandUnits } from '../components/explore/geometry';

describe('the confusion map (تداخل البحور)', () => {
  it('every edge references real meters', () => {
    for (const e of CONFUSION_EDGES) {
      expect(getMeterById(e.fromMeterId), e.id).toBeTruthy();
      expect(getMeterById(e.toMeterId), e.id).toBeTruthy();
    }
  });

  it('collapse edges transform the foot exactly as claimed', () => {
    for (const e of CONFUSION_EDGES.filter((e) => e.kind === 'collapse')) {
      expect(e.rewrite).toBeTruthy();
      expect(applyRewrite(e.footBefore.units!, e.rewrite!)).toEqual(e.footAfter.units);
    }
  });

  it('a collapse quiesces exactly one letter — at the position the ziḥāf is named for', () => {
    // iḍmār = quiescing the SECOND letter; ʿaṣb = quiescing the FIFTH.
    const expected: Record<string, number> = { 'kamil-rajaz': 1, 'wafir-hazaj': 4 };
    for (const e of CONFUSION_EDGES.filter((e) => e.kind === 'collapse')) {
      const before = expandUnits(e.footBefore.units!).map((l) => l.sym);
      const after = expandUnits(e.footAfter.units!).map((l) => l.sym);
      expect(before, e.id).toHaveLength(after.length);
      const diffs = before.map((s, i) => (s === after[i] ? -1 : i)).filter((i) => i >= 0);
      expect(diffs, e.id).toEqual([expected[e.id]]);
      // and the change is a silencing, never an awakening
      expect(before[diffs[0]]).toBe('1');
      expect(after[diffs[0]]).toBe('0');
    }
  });

  it('the rotation pair is one cyclic word: swapping the feet only moves the cut', () => {
    const e = CONFUSION_EDGES.find((x) => x.kind === 'rotation')!;
    const a = expandUnits(e.footBefore.units!).map((l) => l.sym);
    const b = expandUnits(e.footAfter.units!).map((l) => l.sym);
    const ab = [...a, ...b].join('');
    const ba = [...b, ...a].join('');
    // ba is ab rotated by |a| — identical as a loop, distinct as a line
    expect((ab + ab).includes(ba)).toBe(true);
    expect(ab).not.toBe(ba);
  });

  it('the fāṣila collapse maps circle 2 onto circle 3, necklace for necklace', () => {
    const c2 = getCircleById('circle2-pure')!.atomicSequence;
    const c3 = getCircleById('circle3-contracted')!.atomicSequence;
    expect(applyRewrite(c2, FASILA_COLLAPSE)).toEqual(c3);
  });

  it('collapse confusions cross from circle 2 to circle 3; the rotation edge stays home', () => {
    for (const e of CONFUSION_EDGES) {
      const from = getMeterById(e.fromMeterId)!.meter.circleId;
      const to = getMeterById(e.toMeterId)!.meter.circleId;
      if (e.kind === 'collapse') {
        expect(from).toBe('circle2-pure');
        expect(to).toBe('circle3-contracted');
      }
      if (e.kind === 'rotation') expect(from).toBe(to);
      if (e.kind === 'lossy') expect(from).not.toBe(to);
    }
  });

  it('al-Rajaz is the sink of the graph: three edges drain into it', () => {
    expect(CONFUSION_EDGES.filter((e) => e.toMeterId === 'al-rajaz')).toHaveLength(3);
  });

  it('exactly eight meters stand outside all confusion', () => {
    const all = ALL_CIRCLES.flatMap((c) => c.meters.map((m) => m.id));
    expect(all).toHaveLength(getTotalMeterCount());
    const isolated = isolatedMeterIds(all);
    expect(isolated.sort()).toEqual(
      [
        'al-tawil',
        'al-madid',
        'al-basit',
        'al-ramal',
        'al-mudari',
        'al-muqtadab',
        'al-mutaqarib',
        'al-mutadarik',
      ].sort()
    );
  });
});
