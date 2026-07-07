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
  search: {
    placeholder: 'ابحث عن بحر… (مثال: الطويل، مستفعلن، tawil)',
    label: 'البحث في البحور',
    noResults: 'لا نتائج',
  },
  compare: {
    entry: 'قارن بين بحرين',
    title: 'مقارنة البحور',
    firstMeter: 'البحر الأول',
    secondMeter: 'البحر الثاني',
    feetCount: (n: string) => `${n} تفعيلات`,
    sharedFeet: 'التفعيلات المشتركة:',
    noSharedFeet: 'لا توجد تفعيلات مشتركة',
    sameCircle: 'ينتميان إلى الدائرة نفسها',
    differentCircles: 'من دائرتين مختلفتين',
    back: 'العودة إلى الدوائر',
  },
  tour: {
    entry: 'جولة تعريفية',
    next: 'التالي',
    back: 'السابق',
    skip: 'تخطي الجولة',
    done: 'إنهاء',
    progress: (current: string, total: string) => `${current} من ${total}`,
    step1Title: 'مرحباً بك في دوائر الخليل',
    step1Body: 'صمّم الخليل بن أحمد الفراهيدي نظاماً رياضياً بديعاً يجمع بحور الشعر العربي الستة عشر في خمس دوائر فقط. هذه الجولة تشرح لك الفكرة خطوة بخطوة.',
    step2Title: 'الدوائر الخمس',
    step2Body: 'كل بطاقة تمثل دائرة عروضية تضم بحوراً متقاربة البنية. انقر أي بطاقة لاحقاً لاستكشاف بحورها.',
    step3Title: 'التسلسل الأساسي',
    step3Body: 'داخل كل دائرة يدور تسلسل مغلق من الوحدات المقطعية: الأسباب (/0) والأوتاد (//0). هذه هي المادة الخام لكل البحور.',
    step4Title: 'نقطة البداية تصنع البحر',
    step4Body: 'البحور في الدائرة الواحدة تستخدم التسلسل نفسه! الفرق الوحيد هو نقطة البداية على الدائرة — لاحظ سهم البداية أعلى الدائرة.',
    step5Title: 'من الوحدات إلى التفعيلات',
    step5Body: 'يجمّع الشريط المتحرك الوحدات المقطعية في مجموعات لتتشكل التفعيلات المعروفة مثل فعولن ومفاعيلن.',
    step6Title: 'بحر جديد من الدائرة نفسها',
    step6Body: 'انتقلنا الآن إلى البحر المديد — لاحظ كيف دارت الدائرة إلى نقطة بداية مختلفة فظهرت تفعيلات مختلفة من التسلسل ذاته.',
    step7Title: 'استكشف بنفسك!',
    step7Body: 'استخدم البحث للوصول إلى أي بحر مباشرة، أو ميزة المقارنة لرؤية البحور جنباً إلى جنب. رحلة ممتعة في علم العروض!',
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
  search: {
    placeholder: 'Search meters… (e.g. tawil, الطويل, مستفعلن)',
    label: 'Search meters',
    noResults: 'No results',
  },
  compare: {
    entry: 'Compare meters',
    title: 'Meter Comparison',
    firstMeter: 'First meter',
    secondMeter: 'Second meter',
    feetCount: (n: string) => `${n} feet`,
    sharedFeet: 'Shared feet:',
    noSharedFeet: 'No shared feet',
    sameCircle: 'Belong to the same circle',
    differentCircles: 'From two different circles',
    back: 'Back to Circle Hub',
  },
  tour: {
    entry: 'Guided tour',
    next: 'Next',
    back: 'Back',
    skip: 'Skip tour',
    done: 'Finish',
    progress: (current: string, total: string) => `${current} of ${total}`,
    step1Title: "Welcome to Al-Khalil's Circles",
    step1Body: 'Al-Khalil ibn Ahmad al-Farahidi devised an elegant mathematical system that captures all sixteen Arabic poetry meters in just five circles. This tour walks you through the idea step by step.',
    step2Title: 'The five circles',
    step2Body: 'Each card is a prosodic circle grouping meters of similar structure. Click any card later to explore its meters.',
    step3Title: 'The atomic sequence',
    step3Body: 'Inside every circle runs a closed loop of syllabic units: cords (/0) and pegs (//0). These are the raw material of all meters.',
    step4Title: 'The starting point makes the meter',
    step4Body: 'Meters in one circle share the same sequence! The only difference is where on the circle you start reading — note the START arrow at the top.',
    step5Title: 'From units to feet',
    step5Body: 'The sliding banner groups the syllabic units into the familiar feet (tafail) like faʿūlun and mafāʿīlun.',
    step6Title: 'A new meter from the same circle',
    step6Body: 'We just moved to al-Madid — watch how the circle rotated to a different starting point, yielding different feet from the very same sequence.',
    step7Title: 'Explore on your own!',
    step7Body: 'Use search to jump to any meter directly, or the compare feature to see meters side by side. Enjoy your journey through Arud!',
  },
};
