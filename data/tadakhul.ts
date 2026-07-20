/**
 * تداخل البحور — the confusion map.
 *
 * The circles record when two meters ARE the same (rotation: exact,
 * invertible, within one circle). This file records when two meters can
 * SOUND the same (ziḥāf/ʿilla: lossy, one-way, almost always across
 * circles). Each edge says which licensed transformation makes one
 * meter's performed form collide with another's, at the atomic-unit
 * level, so the collision is checkable — and tested — against the same
 * sequences the circles are drawn from.
 *
 * Sources for the pairs and the adjudication rule (يُحمل المشترك على
 * الأصل): classical تداخل doctrine as summarized in adab.com's
 * «ما لا يسع المحقق جهله من تداخل بحور الشعر» and the standard manuals;
 * the شواهد are the ones those sources cite.
 */

/** A licensed transformation at the atomic-unit level. */
export interface UnitRewrite {
  /** unit pattern consumed, e.g. '0///' (fāṣila) */
  from: string[];
  /** unit patterns produced, e.g. ['0/', '0/'] (two light cords) */
  to: string[];
}

export type EdgeKind = 'collapse' | 'lossy' | 'rotation';

export interface ConfusionEdge {
  id: string;
  /** the meter whose VARIANT collides… */
  fromMeterId: string;
  /** …with this meter's territory (its ideal, for collapse edges) */
  toMeterId: string;
  kind: EdgeKind;
  /** ziḥāf/ʿilla name */
  mechanismAr: string;
  mechanismEn: string;
  /** what happens, one line */
  effectAr: string;
  effectEn: string;
  /**
   * Foot-level before/after. `units` (reading order, first unit first)
   * when the form decomposes cleanly; otherwise `mora`, a prosodic-letter
   * string in the app's storage convention (rightmost symbol = first
   * sound, like the units themselves). Ziḥāf does not respect unit
   * boundaries — that a derived foot may have no unit decomposition is
   * part of what "lossy" means.
   */
  footBefore: { nameAr: string; units?: string[]; mora?: string };
  footAfter: { nameAr: string; units?: string[]; mora?: string };
  /** unit-level rewrite driving it, when one exists */
  rewrite?: UnitRewrite;
  /** which forms actually coincide */
  whereAr: string;
  whereEn: string;
  /** how the tradition adjudicates the ambiguous case */
  rulingAr?: string;
  rulingEn?: string;
  /** a classically cited disputed verse, if any */
  shahid?: { textAr: string; noteAr: string; noteEn: string };
}

/**
 * The one rewrite behind both celebrated confusions: a fāṣila collapses
 * into two light cords. Applied to a whole necklace it maps circle 2
 * onto circle 3 exactly (tested in tadakhul.test.ts).
 */
export const FASILA_COLLAPSE: UnitRewrite = { from: ['0///'], to: ['0/', '0/'] };

/** Apply a unit rewrite to a unit sequence (first match per pass, all positions). */
export const applyRewrite = (seq: string[], rw: UnitRewrite): string[] =>
  seq.flatMap((u) => (rw.from.length === 1 && u === rw.from[0] ? rw.to : [u]));

export const CONFUSION_EDGES: ConfusionEdge[] = [
  {
    id: 'kamil-rajaz',
    fromMeterId: 'al-kamil',
    toMeterId: 'al-rajaz',
    kind: 'collapse',
    mechanismAr: 'الإضمار',
    mechanismEn: 'iḍmār',
    effectAr: 'تسكينُ الثاني المتحرك من متفاعلن: الفاصلة ///0 تنطوي إلى سببين /0 /0',
    effectEn: 'quiescing the second mover of mutafāʿilun: the fāṣila folds into two light cords',
    footBefore: { nameAr: 'مُتَفَاعِلُن', units: ['0///', '0//'] },
    footAfter: { nameAr: 'مُسْتَفْعِلُن', units: ['0/', '0/', '0//'] },
    rewrite: FASILA_COLLAPSE,
    whereAr: 'الكامل التام المُضمَر كلُّه يُسمَع رجزاً تاماً',
    whereEn: 'a fully muḍmar Kāmil is heard as a complete Rajaz',
    rulingAr:
      'قاعدة المحقّقين: يُحمل المشترك على الأصل — فإن وردت متفاعلن واحدةٌ في القصيدة فهي كاملٌ قطعاً، وإلا حُملت على الرجز حيث مستفعلن أصلٌ لا فرع.',
    rulingEn:
      'The editors’ rule: carry the shared form to its home. One mutafāʿilun anywhere certifies Kāmil; failing that, the poem defaults to Rajaz, where mustafʿilun is original, not derived.',
    shahid: {
      textAr: 'إنِّي امْرُؤٌ مِنْ خَيْرِ عَبْسٍ مَنْصِبَا',
      noteAr: 'شاهد المحقّقين للكامل المضمر المشتبه بالرجز',
      noteEn: 'the stock example of a muḍmar Kāmil wearing Rajaz’s sound',
    },
  },
  {
    id: 'wafir-hazaj',
    fromMeterId: 'al-wafir',
    toMeterId: 'al-hazaj',
    kind: 'collapse',
    mechanismAr: 'العَصْب',
    mechanismEn: 'ʿaṣb',
    effectAr: 'تسكينُ الخامس من مفاعلتن: الفاصلة ///0 تنطوي إلى سببين /0 /0',
    effectEn: 'quiescing the fifth letter of mufāʿalatun: again the fāṣila folds into two cords',
    footBefore: { nameAr: 'مُفَاعَلَتُن', units: ['0//', '0///'] },
    footAfter: { nameAr: 'مَفَاعِيلُن', units: ['0//', '0/', '0/'] },
    rewrite: FASILA_COLLAPSE,
    whereAr: 'مجزوء الوافر المعصوب كلُّه يطابق الهزجَ حرفاً بحرف',
    whereEn: 'a fully maʿṣūb majzūʼ Wāfir coincides with Hazaj letter for letter',
    rulingAr:
      'فإن ظهرت مفاعلتن واحدةٌ فهو وافر؛ وإلا حُمل على الهزج حيث مفاعيلن أصل.',
    rulingEn: 'One mufāʿalatun reveals Wāfir; otherwise the poem is carried to Hazaj, whose mafāʿīlun is original.',
    shahid: {
      textAr: 'فَنَفْسُ الحُرِّ لا تَرْضَى بِغَيْضٍ مِنْ مَعَانِيهِ',
      noteAr: 'شاهدٌ متنازَع بين مجزوء الوافر المعصوب والهزج',
      noteEn: 'a verse disputed between maʿṣūb Wāfir and Hazaj',
    },
  },
  {
    id: 'sari-rajaz',
    fromMeterId: 'al-sari',
    toMeterId: 'al-rajaz',
    kind: 'lossy',
    mechanismAr: 'الطيّ والكسف',
    mechanismEn: 'ṭayy & kasf',
    effectAr: 'مفعولاتُ تُطوى وتُكسَف فتؤول إلى فاعلن — فتتقارب صور السريع من الرجز',
    effectEn: 'mafʿūlātu, folded and clipped, ends as fāʿilun — and Sarīʿ’s short forms close in on Rajaz',
    footBefore: { nameAr: 'مَفْعُولَاتُ', units: ['0/', '0/', '/0/'] },
    footAfter: { nameAr: 'فَاعِلُن', mora: '0//0/' },
    whereAr: 'المشطور خاصة: مستفعلن مستفعلن + تفعيلة منقوصة تُسمع رجزاً',
    whereEn: 'especially the mashṭūr: two mustafʿilun plus a clipped foot passes for Rajaz',
    rulingAr: 'التمييز بالقرائن: ورودُ مفعولاتُ سالمةً في موضعٍ ما يشهد للسريع.',
    rulingEn: 'Disambiguation is contextual: an intact mafʿūlātu anywhere testifies for Sarīʿ.',
  },
  {
    id: 'munsarih-rajaz',
    fromMeterId: 'al-munsarih',
    toMeterId: 'al-rajaz',
    kind: 'lossy',
    mechanismAr: 'النَّهْك والطيّ',
    mechanismEn: 'nahk & ṭayy',
    effectAr: 'منهوك المنسرح (مستفعلن مفعولاتُ) يجاور منهوكَ الرجز حتى ليُختلَف في الشاهد الواحد',
    effectEn: 'the manhūk Munsariḥ (mustafʿilun mafʿūlātu) sits so close to manhūk Rajaz that single verses are disputed',
    footBefore: { nameAr: 'مَفْعُولَاتُ', units: ['0/', '0/', '/0/'] },
    footAfter: { nameAr: 'فَاعِلَاتُ (مطوية)', mora: '/0//0/' },
    whereAr: 'المنهوك والمشطور من البحرين',
    whereEn: 'the manhūk and mashṭūr forms of both',
    rulingAr: 'الخلاف فيه قديم؛ والعبرة بسائر القصيدة وبمجيء الوتد المفروق.',
    rulingEn: 'The dispute is ancient; the rest of the poem — and the split peg’s appearance — decides.',
  },
  {
    id: 'khafif-mujtath',
    fromMeterId: 'al-khafif',
    toMeterId: 'al-mujtath',
    kind: 'rotation',
    mechanismAr: 'الجزء (قِصَر المرساة)',
    mechanismEn: 'truncation (a weakened anchor)',
    effectAr:
      'هما دورتان لقلادةٍ واحدة (دائرة المشتبه). البيت التامُّ يرسو على أوله فلا لبس؛ فإذا جُزئ البحر قصُر «الرمز» فضعفت المرساة: فاعلاتن مستفع لن أم مستفع لن فاعلاتن؟',
    effectEn:
      'They are two rotations of one necklace (circle 4). A full line anchors at its opening; truncate it and the codeword shortens, the anchor weakens: fāʿilātun mustafʿi lun — or the other way round?',
    footBefore: { nameAr: 'فَاعِلَاتُن', units: ['0/', '0//', '0/'] },
    footAfter: { nameAr: 'مُسْتَفْعِ لُن', units: ['0/', '/0/', '0/'] },
    whereAr: 'القصار المجزوءة، حيث لا يبقى من البيت ما يثبّت نقطة البدء',
    whereEn: 'the short truncated forms, where too little line remains to pin the starting point',
    rulingAr: 'هذا هو الاستثناء الذي يثبت القاعدة: الدوران لا يُلبِس إلا إذا قصُرت المرساة.',
    rulingEn: 'The exception that proves the rule: rotation confuses only when the anchor runs short.',
  },
];

/** Meter ids that no confusion edge touches — the isolated families. */
export const isolatedMeterIds = (allMeterIds: string[]): string[] => {
  const touched = new Set<string>();
  CONFUSION_EDGES.forEach((e) => {
    touched.add(e.fromMeterId);
    touched.add(e.toMeterId);
  });
  return allMeterIds.filter((id) => !touched.has(id));
};
