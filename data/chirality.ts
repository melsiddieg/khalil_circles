import { expandUnits } from '../components/explore/geometry';

/**
 * The mirror test: is a circle's rhythm the same played backwards?
 *
 * The circles record rotation — the cyclic group Cₙ acting on the necklace.
 * That is only half of the necklace's natural symmetry group. The other half
 * is reflection, and on a rhythm circle reflection means *time reversal*:
 * reading the meter from its end to its beginning.
 *
 * This matters structurally. A rotation of a circle has no fixed point, so the
 * quotient is another circle. A reflection fixes two points, so quotienting by
 * it gives an interval with two mirror endpoints — the only other compact
 * one-dimensional orbifold there is. Whether a circle admits a mirror decides
 * which of the two it folds into.
 *
 * The test has to run on letters, not units. Reversal does not respect unit
 * boundaries: reversed, sabab `10` becomes `01`, watid majmūʿ `110` becomes
 * `011`, fāṣila `1110` becomes `0111` — none of which are units at all. Only
 * watid mafrūq `101` is its own reverse. So a mirror that looks plausible on
 * the unit ring can still fail on the letters underneath, and for دائرة
 * المشتبه that is exactly what happens: its unit arrangement is
 * mirror-symmetric, and its letter stream is not.
 */

/** Temporal letter stream of a unit sequence: moving = '1', quiescent = '0'. */
export const moraicString = (seq: string[]): string =>
  expandUnits(seq)
    .map((l) => l.sym)
    .join('');

/** Parent unit index of each letter, for colouring the ring by unit. */
export const letterUnits = (seq: string[]): number[] =>
  expandUnits(seq).map((l) => l.unitIndex);

/**
 * Reflection about axis `m` sends position i to (m − i) mod L.
 *
 * Every m in 0…L−1 names a distinct reflection of the cycle. The axis itself
 * passes through position m/2 — a letter when m is even, the gap between two
 * letters when m is odd.
 */
export const reflect = (i: number, m: number, len: number): number =>
  ((m - i) % len + len) % len;

/** Positions the reflection about `m` sets onto an unlike letter. */
export const mirrorMismatches = (bits: string, m: number): number[] => {
  const L = bits.length;
  const out: number[] = [];
  for (let i = 0; i < L; i++) if (bits[i] !== bits[reflect(i, m, L)]) out.push(i);
  return out;
};

/** Does the rhythm read the same reflected about `m`? */
export const isMirrorAxis = (bits: string, m: number): boolean =>
  mirrorMismatches(bits, m).length === 0;

/**
 * Every axis about which the rhythm reads the same.
 *
 * Empty means chiral: no reading direction and starting point recovers the
 * original, so the rhythm is genuinely distinguishable from its retrograde.
 */
export const mirrorAxes = (bits: string): number[] => {
  const out: number[] = [];
  for (let m = 0; m < bits.length; m++) if (isMirrorAxis(bits, m)) out.push(m);
  return out;
};

/** A rhythm is achiral when some reflection maps it onto itself. */
export const isAchiral = (bits: string): boolean => mirrorAxes(bits).length > 0;

/**
 * The full symmetry group of the necklace, counted.
 *
 * Reflections that fix the necklace form a coset of the rotations that fix it,
 * so there are either none or exactly as many as there are such rotations.
 * The dihedral stabilizer is therefore the cyclic one, doubled — unless the
 * necklace is chiral, in which case reflection adds nothing.
 */
export const dihedralStabilizerOrder = (bits: string, rotationStabilizer: number): number =>
  rotationStabilizer + mirrorAxes(bits).length;
