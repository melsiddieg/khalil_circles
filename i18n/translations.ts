/**
 * UI dictionary. Arabic is the source of truth; the `Translations` type
 * derived from it forces the English dictionary to cover every key at
 * compile time.
 */
export const ar = {
  hub: {
    title: 'دوائر الخليل العروضية',
    subtitle: 'نظام الخليل بن أحمد الفراهيدي للعروض العربي',
    intro:
      'استكشف النظام الكامل لبحور الشعر العربي للخليل بن أحمد الفراهيدي، المنظم في خمس دوائر تقليدية تحتوي على جميع البحور الكلاسيكية الستة عشر',
    statMetersValue: '١٦',
    statMetersLabel: 'بحراً كلاسيكياً',
    statCirclesValue: '٥',
    statCirclesLabel: 'دوائر عروضية',
    statHeritageValue: '+١٢٠٠',
    statHeritageLabel: 'سنة من التراث',
    preservationNote:
      'يحفظ هذا التمثيل الرقمي العمل التأسيسي للخليل بن أحمد الفراهيدي في العروض العربي، ويقدم استكشافاً تفاعلياً لبحور الشعر العربي الكلاسيكية.',
    attribution: '© تطوير وتصميم:',
    author: 'د.محمد عمر الصديق',
    tagline: 'Interactive Arud Explorer - Digital Heritage Preservation',
  },
  card: {
    metersSuffix: 'أبحر',
    moreMeters: 'أبحر أخرى',
    explore: 'انقر للاستكشاف ←',
  },
  info: {
    title: 'عن دوائر العروض',
    body: 'دائرة العروض هي نظام رياضي عبقري وضعه الخليل بن أحمد الفراهيدي (ت ١٧٥هـ) لتنظيم بحور الشعر العربي. تقوم هذه الدائرة على تسلسل أساسي من الوحدات المقطعية التي تتكرر في حلقة مغلقة.',
    unitsTitle: 'الوحدات الأساسية:',
    watidMajmu: 'الوتد المجموع (//0):',
    watidMajmuDesc: 'مقطعان قصيران + مقطع طويل',
    sababKhafif: 'السبب الخفيف (/0):',
    sababKhafifDesc: 'مقطع قصير + مقطع طويل',
    sababThaqil: 'السبب الثقيل (//):',
    sababThaqilDesc: 'مقطعان قصيران',
    watidMafruq: 'الوتد المفروق (/0/):',
    watidMafruqDesc: 'مقطع قصير + مقطع طويل + مقطع قصير',
    hint: 'استخدم الأسهم للانتقال بين البحور ومشاهدة كيف تتحرك الأنماط في الدائرة',
  },
  circle: {
    back: 'العودة إلى الدوائر',
    breadcrumbHub: 'الدوائر',
    containsMeters: (name: string, count: string) => `${name} تضم ${count} بحور`,
    inspired: 'مستلهم من أعمال الخليل بن أحمد الفراهيدي.',
    useControls: 'استخدم الأزرار لاستكشاف بحور هذه الدائرة.',
  },
  meter: {
    offset: 'OFFSET',
    historicalUsage: 'الاستخدام التاريخي',
    pattern: 'التفعيلات',
    famousExample: 'شاهد شعري',
    poet: 'الشاعر:',
    showArud: 'الكتابة العروضية',
    showOriginal: 'النص الأصلي',
  },
  controls: {
    prev: 'البحر السابق',
    next: 'البحر التالي',
    play: 'تشغيل',
    pause: 'إيقاف',
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends object
      ? DeepStringify<T[K]>
      : string;
};

export type Translations = DeepStringify<typeof ar>;

export const en: Translations = {
  hub: {
    title: "Al-Khalil's Prosodic Circles",
    subtitle: "Al-Khalil ibn Ahmad al-Farahidi's system of Arabic prosody",
    intro:
      "Explore the complete system of Arabic poetry meters devised by Al-Khalil ibn Ahmad al-Farahidi, organized into five classical circles containing all sixteen canonical meters.",
    statMetersValue: '16',
    statMetersLabel: 'classical meters',
    statCirclesValue: '5',
    statCirclesLabel: 'prosodic circles',
    statHeritageValue: '+1200',
    statHeritageLabel: 'years of heritage',
    preservationNote:
      "This digital representation preserves Al-Khalil ibn Ahmad al-Farahidi's foundational work in Arabic prosody, offering an interactive exploration of classical Arabic poetry meters.",
    attribution: '© Design & development:',
    author: 'Dr. Mohammed Omar Elsiddieg',
    tagline: 'Interactive Arud Explorer - Digital Heritage Preservation',
  },
  card: {
    metersSuffix: 'METERS',
    moreMeters: 'more meters',
    explore: 'Click to explore →',
  },
  info: {
    title: 'About the Circles of Prosody',
    body: 'The circle of prosody is an ingenious mathematical system devised by Al-Khalil ibn Ahmad al-Farahidi (d. 175 AH) to organize the meters of Arabic poetry. Each circle is built on a fundamental sequence of syllabic units repeating in a closed loop.',
    unitsTitle: 'The fundamental units:',
    watidMajmu: 'Joined peg — watid majmūʿ (//0):',
    watidMajmuDesc: 'two short syllables + one long',
    sababKhafif: 'Light cord — sabab khafīf (/0):',
    sababKhafifDesc: 'one short syllable + one long',
    sababThaqil: 'Heavy cord — sabab thaqīl (//):',
    sababThaqilDesc: 'two short syllables',
    watidMafruq: 'Split peg — watid mafrūq (/0/):',
    watidMafruqDesc: 'short + long + short',
    hint: 'Use the arrows to move between meters and watch the patterns rotate around the circle',
  },
  circle: {
    back: 'Back to Circle Hub',
    breadcrumbHub: 'Circle Hub',
    containsMeters: (name: string, count: string) => `${name} contains ${count} meters`,
    inspired: 'Inspired by the work of Al-Khalil ibn Ahmad al-Farahidi.',
    useControls: 'Use the controls to explore the poetic meters of this circle.',
  },
  meter: {
    offset: 'OFFSET',
    historicalUsage: 'Historical Usage',
    pattern: "Pattern (Taf'īlāt)",
    famousExample: 'Famous Example',
    poet: 'Poet:',
    showArud: 'Prosodic writing',
    showOriginal: 'Original text',
  },
  controls: {
    prev: 'Previous Meter',
    next: 'Next Meter',
    play: 'Play',
    pause: 'Pause',
  },
};
