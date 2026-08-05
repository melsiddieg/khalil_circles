/**
 * «سُلَّم التجريد» — the ladder of abstraction, computed rather than asserted.
 *
 * Al-Khalīl's system is usually presented top-down: here are five circles,
 * here are the sixteen meters they yield. Read bottom-up it is something
 * else — a combinatorial construction in five steps, where each rung is
 * built from the one below by an operation you can carry out yourself:
 *
 *   1. الحرف      two letter states, moving (1) and quiescent (0)
 *   2. الوحدات    the admissible clusters — almost one arithmetic family
 *   3. التفاعيل   the feet, as ARRANGEMENTS of a chosen multiset of units
 *   4. البحور     the meters, as sequences of feet
 *   5. الدوائر    the circles, as those sequences closed into a loop
 *
 * Everything here is derived from the unit alphabet by permutation and
 * concatenation; nothing is a hand-written table of results. The point of
 * the exercise is that the feet FALL OUT of the counting, and the counting
 * is reproducible.
 */

/** A moving letter (متحرك) is 1, a quiescent letter (ساكن) is 0. */
export type Mora = string;

export interface Unit {
  /** storage form, as used everywhere else in the app (RTL-authored) */
  id: string;
  /** temporal order: first sound first, 1 = moving, 0 = quiescent */
  mora: Mora;
  nameAr: string;
  nameEn: string;
  /** k, where the unit is 1^k·0 — null for the two irregulars */
  family: number | null;
}

/**
 * The unit alphabet. Three of the five are the single family **1^k 0** —
 * k moving letters closed by one quiescent — for k = 1, 2, 3. The other
 * two are the exceptions that make the system interesting:
 *
 *   · سبب ثقيل  11   two movings with no closing quiescent
 *   · وتد مفروق 101  the ONE unit whose quiescent sits inside it
 *
 * The Arabic names are not labels bolted onto the patterns; they describe
 * them. مجموع means *joined*: 110, the two movings together. مفروق means
 * *split*: 101, the quiescent splitting the two movings apart. The
 * terminology is a reading of the bit string.
 */
export const UNITS: Unit[] = [
  { id: '0/', mora: '10', nameAr: 'سبب خفيف', nameEn: 'light cord', family: 1 },
  { id: '0//', mora: '110', nameAr: 'وتد مجموع', nameEn: 'joined peg', family: 2 },
  { id: '0///', mora: '1110', nameAr: 'فاصلة صغرى', nameEn: 'minor cluster', family: 3 },
  { id: '//', mora: '11', nameAr: 'سبب ثقيل', nameEn: 'heavy cord', family: null },
  { id: '/0/', mora: '101', nameAr: 'وتد مفروق', nameEn: 'split peg', family: null },
];

export const unitById = (id: string): Unit | undefined => UNITS.find((u) => u.id === id);

/** Moraic string of a unit sequence, in temporal order. */
export const moraOf = (ids: string[]): Mora =>
  ids.map((id) => unitById(id)?.mora ?? '').join('');

/** Distinct orderings of a multiset, in a deterministic order. */
export const arrangements = <T>(items: T[]): T[][] => {
  if (items.length <= 1) return [items];
  const out: T[][] = [];
  const seen = new Set<string>();
  items.forEach((x, i) => {
    const key = String(x);
    if (seen.has(key)) return; // same value already used at this position
    seen.add(key);
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of arrangements(rest)) out.push([x, ...tail]);
  });
  return out;
};

export interface Foot {
  /** unit ids in reading order */
  units: string[];
  mora: Mora;
  nameAr: string;
  /** true when another decomposition in the system sounds identical */
  collides: boolean;
}

export interface Composition {
  id: string;
  /** the multiset of units being arranged */
  multiset: string[];
  labelAr: string;
  labelEn: string;
  /** circles whose feet this composition produces */
  circleIds: string[];
  feet: Foot[];
}

/** Classical names, keyed by the arrangement that produces them. */
const FOOT_NAMES: Record<string, string> = {
  '0//,0/': 'فعولن',
  '0/,0//': 'فاعلن',
  '0//,0/,0/': 'مفاعيلن',
  '0/,0//,0/': 'فاعلاتن',
  '0/,0/,0//': 'مستفعلن',
  '0//,0///': 'مفاعلتن',
  '0///,0//': 'متفاعلن',
  '/0/,0/,0/': 'فاع لاتن',
  '0/,/0/,0/': 'مستفع لن',
  '0/,0/,/0/': 'مفعولات',
};

const COMPOSITIONS: Omit<Composition, 'feet'>[] = [
  {
    id: 'watid-sabab',
    multiset: ['0//', '0/'],
    labelAr: 'وتد + سبب',
    labelEn: 'a peg and a cord',
    circleIds: ['circle5-consonant', 'circle1-mixed'],
  },
  {
    id: 'watid-2sabab',
    multiset: ['0//', '0/', '0/'],
    labelAr: 'وتد + سببان',
    labelEn: 'a peg and two cords',
    circleIds: ['circle3-contracted', 'circle1-mixed'],
  },
  {
    id: 'watid-fasila',
    multiset: ['0//', '0///'],
    labelAr: 'وتد + فاصلة',
    labelEn: 'a peg and a cluster',
    circleIds: ['circle2-pure'],
  },
  {
    id: 'mafruq-2sabab',
    multiset: ['/0/', '0/', '0/'],
    labelAr: 'وتد مفروق + سببان',
    labelEn: 'a split peg and two cords',
    circleIds: ['circle4-accordant'],
  },
];

/** Build every composition class, marking the sound-collisions across all of them. */
const buildCompositions = (): Composition[] => {
  const raw = COMPOSITIONS.map((c) => ({
    ...c,
    feet: arrangements(c.multiset).map((units) => ({
      units,
      mora: moraOf(units),
      nameAr: FOOT_NAMES[units.join(',')] ?? '—',
      collides: false,
    })),
  }));
  // A foot collides when some OTHER decomposition anywhere in the system
  // produces the same moraic string. This is the whole system's first
  // information loss, and it happens two rungs below the circles.
  const tally = new Map<Mora, number>();
  raw.forEach((c) => c.feet.forEach((f) => tally.set(f.mora, (tally.get(f.mora) ?? 0) + 1)));
  raw.forEach((c) => c.feet.forEach((f) => (f.collides = (tally.get(f.mora) ?? 0) > 1)));
  return raw;
};

export const COMPOSITIONS_BUILT: Composition[] = buildCompositions();

/** All feet the construction yields, across every composition class. */
export const ALL_FEET: Foot[] = COMPOSITIONS_BUILT.flatMap((c) => c.feet);

/** Pairs of feet that sound identical but decompose differently. */
export const COLLISIONS: { mora: Mora; feet: Foot[] }[] = (() => {
  const by = new Map<Mora, Foot[]>();
  ALL_FEET.forEach((f) => by.set(f.mora, [...(by.get(f.mora) ?? []), f]));
  return [...by.entries()].filter(([, fs]) => fs.length > 1).map(([mora, feet]) => ({ mora, feet }));
})();

/** The funnel: how many objects live on each rung. */
export const LADDER_COUNTS = {
  states: 2,
  units: UNITS.length,
  arrangements: ALL_FEET.length,
  distinctFeet: new Set(ALL_FEET.map((f) => f.mora)).size,
  circles: 5,
  rotations: 21,
  meters: 16,
} as const;
