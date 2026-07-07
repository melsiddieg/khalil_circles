import { describe, it, expect } from 'vitest';
import { ALL_CIRCLES, getCircleById, getMeterById, getTotalMeterCount } from './index';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

describe('circle data integrity', () => {
  it('has exactly 5 circles and 16 meters', () => {
    expect(ALL_CIRCLES).toHaveLength(5);
    expect(getTotalMeterCount()).toBe(16);
  });

  it('has unique circle ids and orders 1..5', () => {
    const ids = ALL_CIRCLES.map((c) => c.id);
    expect(new Set(ids).size).toBe(5);
    expect(ALL_CIRCLES.map((c) => c.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it('has unique meter ids across all circles', () => {
    const meterIds = ALL_CIRCLES.flatMap((c) => c.meters.map((m) => m.id));
    expect(new Set(meterIds).size).toBe(meterIds.length);
  });

  it.each(ALL_CIRCLES.map((c) => [c.id, c] as const))('%s is internally consistent', (_, circle) => {
    expect(circle.baseSequenceLength).toBe(circle.atomicSequence.length);
    expect(circle.atomicSequence.length).toBeGreaterThan(0);

    // Theme colors are 6-digit hex (components append alpha suffixes like "20")
    expect(circle.visualTheme.primaryColor).toMatch(HEX_COLOR);
    expect(circle.visualTheme.accentColor).toMatch(HEX_COLOR);
    expect(circle.visualTheme.borderColor).toMatch(HEX_COLOR);
    for (const stop of circle.visualTheme.backgroundGradient) {
      expect(stop).toMatch(HEX_COLOR);
    }

    for (const meter of circle.meters) {
      expect(meter.circleId).toBe(circle.id);
      expect(meter.startOffset).toBeGreaterThanOrEqual(0);
      expect(meter.startOffset).toBeLessThan(circle.atomicSequence.length);
      expect(meter.parsingInstructions.length).toBeGreaterThan(0);
      for (const size of meter.parsingInstructions) {
        expect(size).toBeGreaterThan(0);
      }
      expect(meter.name).toBeTruthy();
      expect(meter.nameTransliteration).toBeTruthy();
      expect(meter.patternTransliteration).toBeTruthy();
      for (const example of meter.famousExamples) {
        expect(example.text).toBeTruthy();
        expect(example.poet).toBeTruthy();
        expect(example.era).toBeTruthy();
      }
    }
  });
});

describe('lookup utilities', () => {
  it('getCircleById finds every circle and misses unknown ids', () => {
    for (const circle of ALL_CIRCLES) {
      expect(getCircleById(circle.id)).toBe(circle);
    }
    expect(getCircleById('circle9-nope')).toBeUndefined();
  });

  it('getMeterById returns circle, meter, and index', () => {
    const result = getMeterById('al-kamil');
    expect(result).toBeDefined();
    expect(result!.circle.id).toBe('circle2-pure');
    expect(result!.meter.name).toBe('البحر الكامل');
    expect(result!.circle.meters[result!.meterIndex]).toBe(result!.meter);
    expect(getMeterById('al-nonexistent')).toBeUndefined();
  });
});
