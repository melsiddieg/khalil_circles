/**
 * Rate functions ported faithfully from Manim (ManimCommunity/manim,
 * manim/utils/rate_functions.py) — the easing curves behind 3Blue1Brown's
 * motion. They are what make an animation read as *explanatory* rather
 * than decorative: `smooth` eases both ends symmetrically so the eye can
 * track a moving object; `easeOutBack` overshoots so an arriving object
 * announces itself; `thereAndBack` is the shape of an "look here" pulse.
 *
 * All take and return the unit interval; inputs are clamped like Manim's
 * @unit_interval decorator.
 */

export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));

export type RateFn = (t: number) => number;

export const linear: RateFn = (t) => clamp01(t);

/**
 * Manim's signature easing: a sigmoid normalized so that smooth(0)=0 and
 * smooth(1)=1 exactly (the `error` term removes the sigmoid's tails).
 */
export const smooth = (t: number, inflection = 10.0): number => {
  const u = clamp01(t);
  const error = sigmoid(-inflection / 2);
  return clamp01((sigmoid(inflection * (u - 0.5)) - error) / (1 - 2 * error));
};

/** Accelerates: `smooth`'s first half, arriving at full speed. */
export const rushInto = (t: number, inflection = 10.0): number =>
  2 * smooth(clamp01(t) / 2, inflection);

/** Decelerates: `smooth`'s second half, leaving at full speed. */
export const rushFrom = (t: number, inflection = 10.0): number =>
  2 * smooth(clamp01(t) / 2 + 0.5, inflection) - 1;

export const slowInto: RateFn = (t) => {
  const u = clamp01(t);
  return Math.sqrt(1 - (1 - u) * (1 - u));
};

export const doubleSmooth: RateFn = (t) => {
  const u = clamp01(t);
  return u < 0.5 ? 0.5 * smooth(2 * u) : 0.5 * (1 + smooth(2 * u - 1));
};

/** 0 → 1 → 0. The shape of a pulse. */
export const thereAndBack = (t: number, inflection = 10.0): number => {
  const u = clamp01(t);
  const v = u < 0.5 ? 2 * u : 2 * (1 - u);
  return smooth(v, inflection);
};

export const thereAndBackWithPause = (t: number, pauseRatio = 1 / 3): number => {
  const u = clamp01(t);
  const a = 2 / (1 - pauseRatio);
  if (u < 0.5 - pauseRatio / 2) return smooth(a * u);
  if (u < 0.5 + pauseRatio / 2) return 1;
  return smooth(a - a * u);
};

/** Pulls back before launching forward (a Bézier with a negative pull). */
export const runningStart = (t: number, pullFactor = -0.5): number => {
  const u = clamp01(t);
  const m = 1 - u;
  return (
    15 * u * u * m * m * m * m * pullFactor +
    20 * u * u * u * m * m * m * pullFactor +
    15 * u * u * u * u * m * m +
    6 * u * u * u * u * u * m +
    u * u * u * u * u * u
  );
};

export const wiggle = (t: number, wiggles = 2): number =>
  thereAndBack(clamp01(t)) * Math.sin(wiggles * Math.PI * clamp01(t));

export const easeOutBounce: RateFn = (t) => {
  const u = clamp01(t);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (u < 1 / d1) return n1 * u * u;
  if (u < 2 / d1) {
    const v = u - 1.5 / d1;
    return n1 * v * v + 0.75;
  }
  if (u < 2.5 / d1) {
    const v = u - 2.25 / d1;
    return n1 * v * v + 0.9375;
  }
  const v = u - 2.625 / d1;
  return n1 * v * v + 0.984375;
};

/** Overshoots past 1 before settling — an arrival with weight. */
export const easeOutBack: RateFn = (t) => {
  const u = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const v = u - 1;
  return 1 + c3 * v * v * v + c1 * v * v;
};

export const easeInOutBack: RateFn = (t) => {
  const u = clamp01(t);
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return u < 0.5
    ? (2 * u * (2 * u) * ((c2 + 1) * 2 * u - c2)) / 2
    : ((2 * u - 2) * (2 * u - 2) * ((c2 + 1) * (2 * u - 2) + c2) + 2) / 2;
};

export const easeInOutCubic: RateFn = (t) => {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};

/**
 * Local progress of sub-animation `i` of `n` under Manim's LaggedStart
 * timing (AnimationGroup.build_animations_with_timings): with equal run
 * times, animation i starts at i·lagRatio·d and the group's total run time
 * is d·((n−1)·lagRatio + 1). Given the group's normalized progress `t`,
 * this returns that child's own normalized progress.
 *
 * lagRatio 0 → all children move together; 1 → strictly one after another.
 */
export const laggedProgress = (t: number, i: number, n: number, lagRatio: number): number => {
  if (n <= 1) return clamp01(t);
  const total = (n - 1) * lagRatio + 1;
  return clamp01(clamp01(t) * total - i * lagRatio);
};

/** Normalized progress of a sub-window [start, end] of a parent timeline. */
export const window = (t: number, start: number, end: number): number =>
  end <= start ? clamp01(t) : clamp01((clamp01(t) - start) / (end - start));
