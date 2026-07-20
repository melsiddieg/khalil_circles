import { describe, expect, it } from 'vitest';
import { CONFUSION_EDGES, FASILA_COLLAPSE, applyRewrite, isolatedMeterIds } from './tadakhul';
import { getCircleById, getMeterById } from './circles';
import { getTotalMeterCount, ALL_CIRCLES } from '../constants';

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
