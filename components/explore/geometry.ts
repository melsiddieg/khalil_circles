import { Circle } from '../../types';

/** Position of unit i of n on a ring of radius r (CCW from top, app convention). */
export const polar = (i: number, n: number, r: number) => {
  const deg = -90 - (i * 360) / n;
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r, deg };
};

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Does rotation by k map the unit sequence onto itself? */
export const rotationMatches = (seq: string[], k: number): boolean =>
  seq.every((u, i) => u === seq[(i + k) % seq.length]);

/** The chord system i → i+k decomposed into its closed cycles. */
export const chordCycles = (n: number, k: number): number[][] => {
  const seen = new Set<number>();
  const cycles: number[][] = [];
  for (let start = 0; start < n; start++) {
    if (seen.has(start)) continue;
    const cycle: number[] = [];
    let cur = start;
    do {
      cycle.push(cur);
      seen.add(cur);
      cur = (cur + k) % n;
    } while (cur !== start);
    cycles.push(cycle);
  }
  return cycles;
};

/** Theme color for a unit dot — shared visual vocabulary of the explorables. */
export const unitColor = (unit: string, circle: Circle): string => {
  if (unit === '0//') return circle.visualTheme.primaryColor; // watid majmūʿ
  if (unit === '/0/') return '#E9C87E'; // watid mafrūq
  if (unit === '0///') return circle.visualTheme.accentColor; // fāṣila cluster
  return '#64748B'; // sabab khafīf
};

export interface ProsodicLetter {
  /** '1' moving (mutaḥarrik) or '0' quiescent (sākin) */
  sym: '1' | '0';
  unitIndex: number;
  /** first letter of its unit — the natural percussive downbeat */
  unitInitial: boolean;
}

/**
 * Expand a unit sequence into its prosodic letter stream. Units are stored
 * RTL-style ('0//' = watid = moving, moving, quiescent), so each unit's
 * characters are reversed to temporal order; '/' = 1, '0' = 0.
 */
export const expandUnits = (seq: string[]): ProsodicLetter[] => {
  const letters: ProsodicLetter[] = [];
  seq.forEach((unit, unitIndex) => {
    const chars = unit.split('').reverse();
    chars.forEach((c, j) => {
      letters.push({ sym: c === '/' ? '1' : '0', unitIndex, unitInitial: j === 0 });
    });
  });
  return letters;
};
