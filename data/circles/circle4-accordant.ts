import { Circle, Meter, PoetryExample } from '../../types';

// Circle 4: الدائرة المتفقة (al-Da'ira al-Muttafiqa) - Accordant Circle
// The most complex circle with 5 distinct meters showing harmonic agreement

// Circle 4 atomic sequence - rotating pattern based on the circular diagram
// The sequence represents the full rotation with stepping points for each meter
// Fixed: '0/0/' -> '0/' (sabab khafif) and '0/0m' -> '/0/' (watid mafroug)
export const CIRCLE4_ATOMIC_SEQUENCE = ['0/', '0/', '0//', '0/', '0/', '0//', '0/', '0/', '/0/'];

// Historical poetry examples for Circle 4 meters
const SARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'ما أَبتَغي جَلَّ أَن يُسَمّى * وَالحَقُّ قَد يَعرى فَلا يُكسى',
    poet: 'المتنبي',
    translation: 'What I seek is too great to be named; and truth may be bare and not clothed.',
    era: 'Abbasid'
  }
];

const MUNSARIH_EXAMPLES: PoetryExample[] = [
  {
    text: 'إِنَّ اِبنَ زَيدٍ لا زالَ مُستَعمِلاً * لِلخَيرِ يُفشي في مِصرِهِ العُرفا',
    poet: 'الأعشى',
    translation: 'Indeed, Ibn Zayd continues to practice good, spreading kindness in his city.',
    era: 'Pre-Islamic'
  }
];

const KHAFIF_EXAMPLES: PoetryExample[] = [
  {
    text: 'يا لَيلُ الصَبُّ مَتى غَدُهُ * أَقيامُ السّاعَةِ مَوعِدُهُ',
    poet: 'الحصري القيرواني',
    translation: 'O night of the lover, when is his tomorrow? Is the Day of Judgment his appointment?',
    era: 'Andalusian'
  }
];

const MUDARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'دَعاني إِلى سُعادٍ * دَواعي هَوى سُعادِ',
    poet: 'أبو العتاهية',
    translation: 'The calls of Su\'ad\'s love summoned me to Su\'ad.',
    era: 'Abbasid'
  }
];

const MUQTADAB_EXAMPLES: PoetryExample[] = [
  {
    text: 'حامِلُ الهَوى تَعِبُ * يَستَخِفُّهُ الطَرَبُ',
    poet: 'أبو نواس',
    translation: 'The bearer of love is weary; joy makes him light-headed.',
    era: 'Abbasid'
  }
];

const MUJTATH_EXAMPLES: PoetryExample[] = [
  {
    text: 'البَطنُ مِنها خَميصُ * وَالوَجهُ مِثلُ الهِلالِ',
    poet: 'ابن المعتز',
    translation: 'Her waist is slender, and her face is like the crescent moon.',
    era: 'Abbasid'
  }
];

const CIRCLE4_METERS: Meter[] = [
  // 1. البحر المضارع (al-Mudari) - Starts the circle per user request
  {
    id: 'al-mudari',
    name: 'البحر المضارع',
    nameTransliteration: 'al-Bahr al-Mudāriʿ',
    circleId: 'circle4-accordant',
    startOffset: 5,
    parsingInstructions: [3, 3, 3], // [مفاعيلن, فاع لاتن, مفاعيلن] 
    patternTransliteration: 'mafāʿīlun fāʿi lātun mafāʿīlun',
    description: 'بحر المضارع - إيقاع متنوع بتنويعات خفيفة وأنماط إيقاعية دقيقة',
    historicalUsage: 'أقل شيوعاً لكن يُستخدم للشعر المتطور الذي يتطلب تنوعاً إيقاعياً',
    famousExamples: MUDARI_EXAMPLES
  },
  // 2. البحر المقتضب (al-Muqtadab)
  {
    id: 'al-muqtadab',
    name: 'البحر المقتضب',
    nameTransliteration: 'al-Bahr al-Muqtadab',
    circleId: 'circle4-accordant',
    startOffset: 6,
    parsingInstructions: [3, 3, 3], // [مفعولات, مستفعلن, مستفعلن]
    patternTransliteration: 'mafʿūlātu mustafʿilun mustafʿilun',
    description: 'بحر المقتضب - إيقاع مختصر قوي، غالباً ما يُستخدم في أشكاله المقصورة',
    historicalUsage: 'يُستخدم للحكم والأبيات المؤثرة المختصرة التي تتطلب الإيجاز',
    famousExamples: MUQTADAB_EXAMPLES
  },
  // 3. البحر المجتث (al-Mujtath)
  {
    id: 'al-mujtath',
    name: 'البحر المجتث',
    nameTransliteration: 'al-Bahr al-Mujtath',
    circleId: 'circle4-accordant',
    startOffset: 7,
    parsingInstructions: [3, 3, 3], // [مستفعلن, فاعلاتن, فاعلاتن]
    patternTransliteration: 'mustafʿilun fāʿilātun fāʿilātun',
    description: 'بحر المجتث - إيقاع مقطوع يخلق إحساساً بالعجلة والشدة العاطفية',
    historicalUsage: 'يُستخدم كثيراً في الأدعية والشعر الديني والشعر المشحون عاطفياً',
    famousExamples: MUJTATH_EXAMPLES
  },
  // 4. البحر السريع (al-Sari)
  {
    id: 'al-sari',
    name: 'البحر السريع',
    nameTransliteration: 'al-Bahr al-Sarīʿ',
    circleId: 'circle4-accordant',
    startOffset: 0,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مستفعلن, مفعولات]
    patternTransliteration: 'mustafʿilun mustafʿilun mafʿūlātu',
    description: 'بحر السريع - إيقاع سريع نشيط مناسب للحماسة والفخر',
    historicalUsage: 'يُستخدم في الشعر الحماسي والقصص البطولية، ينقل السرعة والحركة',
    famousExamples: SARI_EXAMPLES
  },
  // 5. البحر المنسرح (al-Munsarih)
  {
    id: 'al-munsarih',
    name: 'البحر المنسرح',
    nameTransliteration: 'al-Bahr al-Munsarih',
    circleId: 'circle4-accordant',
    startOffset: 3,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مفعولات, مستفعلن]
    patternTransliteration: 'mustafʿilun mafʿūlātu mustafʿilun',
    description: 'بحر المنسرح - إيقاع منساب سهل مناسب للتأمل الفلسفي',
    historicalUsage: 'يُستخدم في الشعر التأملي والفلسفي، خاصة في العصر العباسي',
    famousExamples: MUNSARIH_EXAMPLES
  },
  // 6. البحر الخفيف (al-Khafif)
  {
    id: 'al-khafif',
    name: 'البحر الخفيف',
    nameTransliteration: 'al-Bahr al-Khafif',
    circleId: 'circle4-accordant',
    startOffset: 4,
    parsingInstructions: [3, 3, 3], // [فاعلاتن, مستفع لن, فاعلاتن]
    patternTransliteration: 'fāʿilātun mustafiʿ lun fāʿilātun',
    description: 'بحر الخفيف - إيقاع خفيف رشيق مناسب للموضوعات الرقيقة',
    historicalUsage: 'محبوب في شعر الغزل ووصف الطبيعة، مفضل لدى شعراء البلاط',
    famousExamples: KHAFIF_EXAMPLES
  },
];

export const CIRCLE4_ACCORDANT: Circle = {
  id: 'circle4-accordant',
  name: 'دائرة المشتبه',
  nameTransliteration: 'al-Da\'ira al-Muttafiqa',
  description: 'دائرة المشتبه - أعقد الدوائر بستة بحور متناغمة ومترابطة إيقاعياً',
  atomicSequence: CIRCLE4_ATOMIC_SEQUENCE,
  baseSequenceLength: 12,
  meters: CIRCLE4_METERS,
  visualTheme: {
    primaryColor: '#8B5CF6', // Violet
    accentColor: '#7C3AED',
    backgroundGradient: ['#EDE9FE', '#C4B5FD'],
    borderColor: '#6D28D9'
  },
  order: 4
};