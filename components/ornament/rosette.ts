/**
 * Geometry for the hub's rosette medallions — a paper-cut shamsa that is a
 * PORTRAIT of its prosodic circle rather than generic ornament.
 *
 *   petals            = n, one per atomic unit
 *   enamel cabochons  = unitColor(seq[i]) — so the inlay's colouring has
 *                       exactly the circle's stabilizer symmetry C_(n/p)
 *   pearl course      = CIRCLE_ROTATIONS[i].kind (meter / muhmal / duplicate)
 *   centre q-plate    = |C_(n/p)| lobes
 *   centre star       = the stabilizer's own chord system {n/p}, the same
 *                       figure MathView's SymmetryStar draws
 *
 * Everything here is a pure function of the circle's data: no Math.random, no
 * React, no DOM. `ROSETTES` is built eagerly at module load, so nothing is
 * computed (or memoised, or mutated) during render.
 *
 * COORDINATE CONVENTION — read this before editing.
 * All geometry is authored around (0,0) for the existing viewBox
 * "-150 -150 300 300", matching every other SVG in the app. Chrome's UA sheet
 * gives SVG children `transform-origin: 0px 0px`, so rotations pivot on the
 * medallion centre for free. Never write `transform-origin: 50% 50%` here:
 * measured, that resolves to (150,150) and flings the art off the card. The
 * same warning is already in components/GroupTheoryGloss.tsx.
 *
 * Angles follow components/explore/geometry.ts `polar()`: unit i sits at
 * absolute angle −90° − i·360/n, so petal i is index-aligned with the dial,
 * MathView and the explorables.
 */

import { chordCycles, gcd, uniqueChords } from '../explore/geometry';
import { CIRCLE_ROTATIONS, sequencePeriod, stabilizerOrder } from '../../data/rotations';
import { ALL_CIRCLES } from '../../constants';
import type { Circle } from '../../types';

export type Pt = readonly [number, number];

/** 2dp: deterministic across engines, and keeps the `d` strings short. */
const f = (v: number): number => Math.round(v * 100) / 100;
const s = ([x, y]: Pt): string => `${f(x)},${f(y)}`;

/** Point at absolute angle `a` (radians, 0 = +x, y down), radius `r`. */
export const pa = (a: number, r: number): Pt => [r * Math.cos(a), r * Math.sin(a)];

/** Straight up (−y), the axis every local form is authored around. */
const UP = -Math.PI / 2;

/** Absolute angle of unit `i` of `n` — the `polar()` convention. */
export const axisOf = (i: number, n: number): number => UP - (2 * Math.PI * i) / n;

/** A full circle as a path, for use as an even-odd counter-subpath. */
export const circlePath = (r: number): string =>
  `M${f(r)},0A${f(r)},${f(r)} 0 1,0 ${f(-r)},0A${f(r)},${f(r)} 0 1,0 ${f(r)},0Z`;

/* ------------------------------------------------------------------ */
/* Petals                                                              */
/* ------------------------------------------------------------------ */

export interface PetalSpec {
  /** Petals in the ring — the circle's atomic-unit count. */
  n: number;
  /** Inner (base) and outer (tip) radii. */
  r0: number;
  r1: number;
  /** Fraction of the 2π/n slice the petal fills; <1 leaves ground showing. */
  spread?: number;
  /** Where the flank is widest, as a fraction of (r1 − r0). */
  shoulder?: number;
  /** Tip tangent: smaller ⇒ more radial approach ⇒ sharper ogee cusp. */
  tipPull?: number;
  /** Absolute angle of the petal's axis. Defaults to straight up. */
  axis?: number;
  /**
   * Uniform outward inflation in user units. This is the shadow-ramp knob:
   * a cast shadow is the SAME generator re-run fatter, never a scale(). Pass
   * a negative value to a cut-out so its hole SHRINKS while the silhouette
   * grows — which is what makes the shadow fall outward past the petal and
   * inward into the window. A scale() gets the holes backwards.
   */
  grow?: number;
}

/**
 * One lobed, ogee-tipped petal, as a closed path.
 *
 * The right flank is two cubics; the left is their mirror. Note that the
 * control points SWAP ORDER on the return leg: reversing a cubic
 * B(P0,C1,C2,P3) yields B(P3,C2,C1,P0). Emitting them in the original order
 * is the classic way to get a kinked, asymmetric petal.
 */
export const petalPath = ({
  n,
  r0,
  r1,
  spread = 0.82,
  shoulder = 0.55,
  tipPull = 0.14,
  axis = UP,
  grow = 0,
}: PetalSpec): string => {
  const rMid = (r0 + r1) / 2 + grow;
  const gr0 = r0 - grow * 0.5;
  const gr1 = r1 + grow;
  // Inflate the angular half-width by `grow` units of arc measured at mid
  // radius, so the ramp thickens the flanks by the same amount it thickens
  // the tip. Clamped so a fat ramp on a narrow ring can never self-overlap.
  const phi = Math.min(
    (Math.PI / n) * 0.995,
    (Math.PI / n) * spread + (rMid > 0 ? grow / rMid : 0)
  );
  const d = gr1 - gr0;

  /** Points at ±half-angle `th` from this petal's axis, at radius `r`. */
  const p = (th: number, r: number): Pt => pa(axis + th, r);
  const m = (th: number, r: number): Pt => pa(axis - th, r);

  const base = p(0, gr0);
  // a1 hugs the base ring (+0.03d): that pinch is what reads as a split
  // palmette rather than a plain teardrop.
  const a1 = 0.45 * phi;
  const a2 = 0.98 * phi;
  // b2 swings almost onto the axis, so the tangent arrives near-radial and
  // the two halves close as a CUSP — the onion arch.
  const b1 = 0.95 * phi;
  const b2 = tipPull * phi;
  const ra1 = gr0 + 0.03 * d;
  const ra2 = gr0 + 0.26 * d;
  const rsh = gr0 + shoulder * d;
  const rb1 = gr0 + 0.8 * d;
  const rb2 = gr1 - 0.16 * d;

  return (
    `M${s(base)}C${s(p(a1, ra1))} ${s(p(a2, ra2))} ${s(p(phi, rsh))}` +
    `C${s(p(b1, rb1))} ${s(p(b2, rb2))} ${s(p(0, gr1))}` +
    `C${s(m(b2, rb2))} ${s(m(b1, rb1))} ${s(m(phi, rsh))}` +
    `C${s(m(a2, ra2))} ${s(m(a1, ra1))} ${s(base)}Z`
  );
};

/**
 * A whole ring of petals as ONE compound path (n subpaths, already placed).
 * Used for the shadow plates and any layer that needs no per-petal
 * animation: one element instead of n, and no <use> shadow trees.
 */
export const petalRing = (spec: Omit<PetalSpec, 'axis'>, phase = 0): string => {
  let d = '';
  for (let i = 0; i < spec.n; i++) d += petalPath({ ...spec, axis: axisOf(i + phase, spec.n) });
  return d;
};

/* ------------------------------------------------------------------ */
/* Scalloped edges                                                     */
/* ------------------------------------------------------------------ */

/**
 * A cusped scalloped boundary: `lobes` quadratics, real cusps at the valleys.
 *
 * A quadratic's midpoint is (V0 + 2C + V1)/4. Both valleys sit ±hs off the
 * control's bearing at radius `rv`, so they contribute 2·rv·cos(hs) along it
 * and nothing across it; apex = (rv·cos(hs) + rc)/2. Solving for rc:
 *
 *     rc = 2·rApex − rv·cos(π/lobes)
 *
 * Pass rApex < rv for INWARD lobes (used for the epigraphic band's inner
 * edge, which dips between the petal tips). With phase 0 the apex lands on
 * the up-axis, so lobe i is centred on petal i; phase 0.5 puts it in the gap.
 */
export const scallopPath = (lobes: number, rv: number, rApex: number, phase = 0): string => {
  const step = (2 * Math.PI) / lobes;
  const hs = step / 2;
  const rc = 2 * rApex - rv * Math.cos(hs);
  const a0 = UP - hs - phase * step;
  let d = `M${s(pa(a0, rv))}`;
  for (let k = 0; k < lobes; k++) {
    const a = a0 + k * step;
    d += `Q${s(pa(a + hs, rc))} ${s(pa(a + step, rv))}`;
  }
  return `${d}Z`;
};

/* ------------------------------------------------------------------ */
/* Chord figures                                                       */
/* ------------------------------------------------------------------ */

/**
 * A tapered lens (spindle) between two points, bulging ±w at the midpoint.
 * A quadratic's apex is (P + 2C + Q)/4 = (M + C)/2, so C = M ± 2w·n̂.
 * Chords are drawn as lenses rather than lines so a degenerate star — circle
 * 1's five diameters, {10/5} — still has area and reads as a sunburst
 * instead of a spoke icon.
 */
export const lensPath = (p: Pt, q: Pt, w: number): string => {
  const mx = (p[0] + q[0]) / 2;
  const my = (p[1] + q[1]) / 2;
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return (
    `M${s(p)}Q${s([mx + 2 * w * nx, my + 2 * w * ny])} ${s(q)}` +
    `Q${s([mx - 2 * w * nx, my - 2 * w * ny])} ${s(p)}Z`
  );
};

/**
 * The chord step the centre star is drawn with.
 *
 * p = sequencePeriod(seq) generates the stabilizer, so four of the five cards
 * draw the same figure MathView draws: {10/5} five diameters, {6/2} hexagram,
 * {9/3} three triangles, {8/2} two squares — the rub el hizb, and the
 * reference image's centre, arrived at from the data.
 *
 * When the stabilizer is trivial (circle 4, p = n) there is no such figure.
 * Substitute the largest k < n/2 coprime to n: {9/4}, the UNICURSAL nonagram,
 * a single closed circuit that must visit all nine vertices before it shuts.
 * (MathView draws no star at all for that circle — it stages the failing k=1
 * attempt instead — so nothing disagrees.)
 */
export const starStep = (n: number, p: number): number => {
  if (p < n) return p;
  for (let k = Math.floor((n - 1) / 2); k > 1; k--) if (gcd(n, k) === 1) return k;
  return 1;
};

/** {n/k} as gcd(n,k) closed loops; 2-cycles become lenses. */
export const starPath = (n: number, k: number, r: number, lensW = 5.5): string => {
  const v = (i: number): Pt => pa(axisOf(i, n), r);
  let d = '';
  for (const cycle of chordCycles(n, k)) {
    if (cycle.length < 2) continue;
    if (cycle.length === 2) {
      d += lensPath(v(cycle[0]), v(cycle[1]), lensW);
      continue;
    }
    d += `M${s(v(cycle[0]))}${cycle.slice(1).map((i) => `L${s(v(i))}`).join('')}Z`;
  }
  return d;
};

/** Plain chord segments — used for circle 4's ghosted near-miss. */
const chordLines = (
  n: number,
  k: number,
  r: number,
  keep: (i: number, j: number) => boolean
): string => {
  let d = '';
  for (const [i, j] of uniqueChords(n, k)) {
    if (!keep(i, j)) continue;
    d += `M${s(pa(axisOf(i, n), r))}L${s(pa(axisOf(j, n), r))}`;
  }
  return d;
};

/* ------------------------------------------------------------------ */
/* Arabesque tendrils                                                  */
/* ------------------------------------------------------------------ */

export interface TendrilSpec {
  n: number;
  /** Anchor and tip radii of the scroll's centreline. */
  r0: number;
  r1: number;
  /** Angular sweep, as a fraction of one 2π/n slice. */
  sweep: number;
  /** Half-width of the ribbon at its base. */
  width: number;
  axis?: number;
  steps?: number;
}

/**
 * A rūmī scroll as a FILLED TAPERED RIBBON on a logarithmic spiral —
 * deliberately not a stroke. A 1px stroked spiral aliases to mush at a 280px
 * card; a filled ribbon keeps its calligraphic weight at any size.
 *
 * Centreline r(u) = r0·e^{κu}, θ(u) = ±λu. The half-width
 *
 *     h(u) = width·(1−u)^1.3 + 0.4 + bud·exp(−((u−0.86)/0.10)²)
 *
 * tapers to a hairline and then swells once near the tip: that Gaussian bump
 * IS the terminal bud, so the leaflet costs no extra geometry.
 */
export const tendrilPath = ({
  n,
  r0,
  r1,
  sweep,
  width,
  axis = UP,
  steps = 30,
}: TendrilSpec): string => {
  const kappa = Math.log(r1 / r0);
  const lambda = sweep * ((2 * Math.PI) / n);
  const bud = width * 0.62;

  const centre = (u: number, sign: number): Pt =>
    pa(axis + sign * lambda * u, r0 * Math.exp(kappa * u));
  const half = (u: number): number =>
    width * Math.pow(1 - u, 1.3) + 0.4 + bud * Math.exp(-Math.pow((u - 0.86) / 0.1, 2));

  /** One offset edge of one scroll. `side` picks which side of the spine. */
  const edge = (sign: number, side: 1 | -1): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const c = centre(u, sign);
      const a = centre(Math.max(0, u - 0.004), sign);
      const b = centre(Math.min(1, u + 0.004), sign);
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      const h = half(u) * side;
      out.push([c[0] - (dy / len) * h, c[1] + (dx / len) * h]);
    }
    return out;
  };

  const scroll = (sign: number): string => {
    const pts = [...edge(sign, 1), ...edge(sign, -1).reverse()];
    return `M${s(pts[0])}${pts.slice(1).map((p) => `L${s(p)}`).join('')}Z`;
  };

  // A mirrored pair per gap: the two scrolls spring from one root.
  return scroll(1) + scroll(-1);
};

/** Mirrored scroll pairs in every gap, as ONE compound path. */
export const tendrilRing = (spec: Omit<TendrilSpec, 'axis'>): string => {
  let d = '';
  for (let i = 0; i < spec.n; i++) d += tendrilPath({ ...spec, axis: axisOf(i + 0.5, spec.n) });
  return d;
};

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */

const hex = (c: string): [number, number, number] => {
  const v = parseInt(c.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

/** Deterministic hex lerp — the ground gradients are derived, not invented. */
export const mixHex = (a: string, b: string, t: number): string => {
  const [ar, ag, ab] = hex(a);
  const [br, bg, bb] = hex(b);
  const ch = (x: number, y: number): string =>
    Math.max(0, Math.min(255, Math.round(x + (y - x) * t)))
      .toString(16)
      .padStart(2, '0');
  return `#${ch(ar, br)}${ch(ag, bg)}${ch(ab, bb)}`;
};

/* ------------------------------------------------------------------ */
/* The radial budget                                                   */
/* ------------------------------------------------------------------ */

export const R = {
  ground: 149,
  rimPeak: 149,
  rimValley: 137,
  /** Inner edge of the gold rim annulus. */
  rimInner: 132,
  bandOut: 141,
  /** The band's inner edge scallops INWARD, one lobe per petal. */
  bandInValley: 105,
  bandInPeak: 99,
  pearl: 109,
  petal0: 25,
  petal1: 95,
  cut0: 33,
  cut1: 80,
  inner0: 14,
  inner1: 60,
  tendril0: 30,
  tendril1: 88,
  cabochon: 66,
  boss: 33,
  qplate: 29,
  star: 24,
  stone: 5.5,
} as const;

/**
 * CurvedText radii. The dark band moved out from 94/90, which buys the bottom
 * arc ~30% more length — circle 4's six meter names are the tightest string
 * on the hub, and this is the one card the change is for. These are the ONLY
 * two lines of OrnateCard's text machinery that change.
 */
/* The clear dark band runs from bandInValley (105) to rimInner (132).
   The top arc's baseline sits at its radius and the glyphs grow OUTWARD
   from there, so at 124 a 16-unit face put its ascenders at ~137 — on
   the gold rim. 115 keeps the tallest letter inside 128. The bottom arc
   grows inward from its baseline and needs no such headroom. */
export const TITLE_ARC_R = 115;
export const METERS_ARC_R = 120;

/**
 * Shadow ramp: a tight contact plate plus one inflated ambient plate. Two
 * steps of different character read as contact + ambient; three or more
 * equal steps band into concentric outlines. Do not add a step before
 * looking at it at 2× DPR.
 */
export const RAMP = [
  { dy: 2.4, grow: 0, alpha: 0.5 },
  { dy: 5.6, grow: 3.2, alpha: 0.17 },
] as const;

/* ------------------------------------------------------------------ */
/* The built rosette                                                   */
/* ------------------------------------------------------------------ */

export interface RosetteGeometry {
  n: number;
  /** Smallest period; rotation by p generates the stabilizer C_(n/p). */
  period: number;
  stabilizer: number;
  step: number;
  /** The stabilizer's generator as an SVG rotation. 0 when trivial. */
  turnDeg: number;
  trivial: boolean;
  /** Index of the watid mafrūq that breaks circle 4's symmetry, else −1. */
  mafruq: number;
  units: readonly string[];
  /**
   * Local-frame defs, authored pointing up, instanced with <use>. The
   * `*Inset` variants are the bevel: an inset copy stroked in light cream, so
   * the highlight lands inside the silhouette and just OUTSIDE the window,
   * with no clip needed. Deliberately non-directional — one global key-light
   * rect supplies direction for the whole card, and a directional bevel baked
   * per petal would be wrong the moment anything rotates.
   */
  def: { petal: string; petalInset: string; inner: string; innerInset: string };
  /** Enamel cabochons, pre-placed on each petal's axis. */
  cab: readonly string[];
  /** Pre-placed compound paths — one element each, no <use>. */
  ring: {
    petalShadow: readonly string[];
    innerShadow: readonly string[];
    tendril: string;
    /** The scalloped silhouette; also the clip path. */
    rim: string;
    /** The gold rim as an annulus (silhouette minus an inner disc). */
    rimBand: string;
    /** The epigraphic band as an annulus with a scalloped inner edge. */
    band: string;
    bandInner: string;
  };
  centre: { qplate: string; star: string; ghostOk: string; ghostBad: string };
  pearl: { meter: string; muhmal: string; duplicate: string };
  /** Scallop lobe count of the rim — also the clip silhouette. */
  lobes: number;
}

/** Outer petal + its window, as one even-odd compound path. */
const petalWithWindow = (n: number, grow: number, axis = UP): string =>
  petalPath({ n, r0: R.petal0, r1: R.petal1, spread: 0.82, axis, grow }) +
  petalPath({ n, r0: R.cut0, r1: R.cut1, spread: 0.5, tipPull: 0.2, axis, grow: -grow });

const dot = (c: Pt, r: number): string =>
  `M${f(c[0] + r)},${f(c[1])}A${r},${r} 0 1,0 ${f(c[0] - r)},${f(c[1])}A${r},${r} 0 1,0 ${f(c[0] + r)},${f(c[1])}Z`;

export const buildRosette = (circle: Circle): RosetteGeometry => {
  const units = circle.atomicSequence;
  const n = units.length;
  const period = sequencePeriod(units);
  const q = stabilizerOrder(units);
  const trivial = period >= n;
  // Keep the rim's lobes visually even across circles: 2n is chunky at n=6.
  const lobes = n < 8 ? 3 * n : 2 * n;

  // Circle 4's single watid mafrūq: the one unit unlike any other, and the
  // entire reason that circle has no symmetry.
  const mafruq = units.indexOf('/0/');

  const rotations = CIRCLE_ROTATIONS[circle.id] ?? [];
  const pearlOf = (kind: string): string => {
    let d = '';
    for (let i = 0; i < n; i++) {
      if ((rotations[i]?.kind ?? 'duplicate') !== kind) continue;
      d += dot(pa(axisOf(i, n), R.pearl), kind === 'duplicate' ? 1.3 : 2.2);
    }
    return d;
  };

  // The q-plate: |C_q| lobes, a second and quieter reading of the stabilizer.
  // q = 1 is not a failed rosette, it is a NEEDLE — a single teardrop, aimed
  // at the mafrūq that broke the symmetry.
  const qplate =
    q === 1
      ? petalPath({
          n: 1,
          r0: 3,
          r1: R.qplate,
          spread: 0.4,
          tipPull: 0.24,
          axis: axisOf(mafruq >= 0 ? mafruq : 0, n),
        })
      : scallopPath(q, R.qplate * 0.44, R.qplate);

  // Circle 2's {6/2} is two triangles. The hexagram is a genuine classical
  // motif, but it reads as loaded to a modern audience and this is an
  // Arabic-first app, so that card leans on its trefoil q-plate instead —
  // which expresses the same C₃. One constant, one-line reversal.
  const star = circle.id === 'circle2-pure' ? '' : starPath(n, starStep(n, period), R.star);

  // Circle 4 only: the C₃ it ALMOST has. Exactly two of the nine k=3 chords
  // fail, both touching the lone mafrūq — the same mismatch logic MathView
  // uses, so the two views agree about where the break is.
  const same = (i: number, j: number): boolean => units[i] === units[j];
  const ghostOk = trivial ? chordLines(n, 3, R.star, same) : '';
  const ghostBad = trivial ? chordLines(n, 3, R.star, (i, j) => !same(i, j)) : '';

  const innerSpec = { n, r0: R.inner0, r1: R.inner1, spread: 0.62, tipPull: 0.2 };

  return {
    n,
    period,
    stabilizer: q,
    step: 360 / n,
    turnDeg: trivial ? 0 : -(360 * period) / n,
    trivial,
    mafruq,
    units,
    def: {
      petal: petalWithWindow(n, 0),
      petalInset: petalWithWindow(n, -1.3),
      inner: petalPath(innerSpec),
      innerInset: petalPath({ ...innerSpec, grow: -1.1 }),
    },
    cab: units.map((_, i) =>
      petalPath({
        n: 1,
        r0: R.cabochon - 7.5,
        r1: R.cabochon + 7.5,
        spread: 0.028,
        tipPull: 0.3,
        axis: axisOf(i, n),
      })
    ),
    ring: {
      petalShadow: RAMP.map(({ grow }) => {
        let d = '';
        for (let i = 0; i < n; i++) d += petalWithWindow(n, grow, axisOf(i, n));
        return d;
      }),
      innerShadow: RAMP.map(({ grow }) => petalRing({ ...innerSpec, grow }, 0.5)),
      tendril: tendrilRing({ n, r0: R.tendril0, r1: R.tendril1, sweep: 0.42, width: 4.6 }),
      rim: scallopPath(lobes, R.rimValley, R.rimPeak),
      rimBand: scallopPath(lobes, R.rimValley, R.rimPeak) + circlePath(R.rimInner),
      band: circlePath(R.bandOut) + scallopPath(n, R.bandInValley, R.bandInPeak),
      bandInner: scallopPath(n, R.bandInValley, R.bandInPeak),
    },
    centre: { qplate, star, ghostOk, ghostBad },
    pearl: {
      meter: pearlOf('meter'),
      muhmal: pearlOf('muhmal'),
      duplicate: pearlOf('duplicate'),
    },
    lobes,
  };
};

/**
 * Built eagerly at module load: five plain objects, debuggable in DevTools,
 * no useMemo, and nothing for the react-hooks purity rules to object to.
 */
export const ROSETTES: Record<string, RosetteGeometry> = Object.fromEntries(
  ALL_CIRCLES.map((c) => [c.id, buildRosette(c)])
);
