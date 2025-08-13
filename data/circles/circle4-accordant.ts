import { Circle, Meter, PoetryExample } from '../../types';

// Circle 4: الدائرة المتفقة (al-Da'ira al-Muttafiqa) - Accordant Circle
// The most complex circle with 5 distinct meters showing harmonic agreement

// Circle 4 atomic sequence - rotating pattern based on the circular diagram
// The sequence represents the full rotation with stepping points for each meter
// Fixed: '0/0/' -> '0/' (sabab khafif) and '0/0m' -> '/0/' (watid mafroug)
export const CIRCLE4_ATOMIC_SEQUENCE = ['0/', '0/', '0//', '0/', '0/', '0//', '0/', '0/', '/0/'];

// Historical poetry examples for Circle 4 meters
const MUNSARIH_EXAMPLES: PoetryExample[] = [
  {
    text: 'لَيس الغَريبُ غَريبَ الشَام وَاليَمَنِ * إِنَّ الغَريبَ غَريبُ اللَحدِ وَالكَفَنِ',
    poet: 'ابن الرومي',
    translation: 'The stranger is not the stranger of Syria and Yemen; the true stranger is the stranger of the grave and shroud',
    era: 'Abbasid'
  }
];

const KHAFIF_EXAMPLES: PoetryExample[] = [
  {
    text: 'في أَيِّ يَومٍ مِنَ الأَيّامِ نَدفِنُها * نُحسِنُ صُنعاً بِأَن نُحيي وَنُدفِنُها',
    poet: 'نزار قباني',
    translation: 'On which day shall we bury it? We do well to both revive it and bury it',
    era: 'Modern'
  }
];

const MUDARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'أَينَ أَزمانُ الوَصلِ بِالأَندَلُس * لَم تَكُن أَحلامَاً وَلا أَطيافاً',
    poet: 'ابن زيدون',
    translation: 'Where are the times of union in Al-Andalus? They were not dreams nor phantoms',
    era: 'Andalusian'
  }
];

const MUQTADAB_EXAMPLES: PoetryExample[] = [
  {
    text: 'إِنَّ الحَياةَ طَريقُ أَوحَش * مَا بَينَ مَولِدِنا وَمَدفَنِنا',
    poet: 'ميخائيل نعيمة',
    translation: 'Life is a desolate path between our birth and our grave',
    era: 'Modern'
  }
];

const MUJTATH_EXAMPLES: PoetryExample[] = [
  {
    text: 'يا رَبِّ إِن عَظُمَت ذُنوبي كَثرَةً * فَلَقَد عَلِمتُ بِأَنَّ عَفوَكَ أَعظَمُ',
    poet: 'أبو نواس',
    translation: 'O Lord, if my sins have grown great in number, I know that Your forgiveness is greater',
    era: 'Abbasid'
  }
];

const SARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'نَحنُ في هَذِهِ الدُنيا عابِرونَ * وَإِلى الآخِرَةِ صائِرونَ',
    poet: 'ابن سينا',
    translation: 'We are but travelers in this world, and to the afterlife we are bound',
    era: 'Medieval'
  }
];

const CIRCLE4_METERS: Meter[] = [
  // 1. البحر السريع (al-Sari) - First in the image
  {
    id: 'al-sari',
    name: 'البحر السريع',
    nameTransliteration: 'al-Bahr al-Sarīʿ',
    circleId: 'circle4-accordant',
    startOffset: 0,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مستفعلن, مفعولات]
    patternTransliteration: 'mustafʿilun mustafʿilun mafʿūlātu',
    description: 'The "Swift" meter, with rapid, energetic rhythm ideal for dynamic narratives.',
    historicalUsage: 'Popular for epic poetry and heroic tales, conveying speed and action.',
    famousExamples: SARI_EXAMPLES
  },
  // 2. البحر المنسرح (al-Munsarih) - Second in the image  
  {
    id: 'al-munsarih',
    name: 'البحر المنسرح',
    nameTransliteration: 'al-Bahr al-Munsarih',
    circleId: 'circle4-accordant',
    startOffset: 3,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مفعولات, مستفعلن]
    patternTransliteration: 'mustafʿilun mafʿūlātu mustafʿilun',
    description: 'The "Flowing" meter, with an easy, unimpeded rhythm perfect for philosophical reflection.',
    historicalUsage: 'Used for contemplative and philosophical poetry, especially in the Abbasid period.',
    famousExamples: MUNSARIH_EXAMPLES
  },
  // 3. البحر الخفيف (al-Khafif) - Third in the image
  {
    id: 'al-khafif',
    name: 'البحر الخفيف',
    nameTransliteration: 'al-Bahr al-Khafif',
    circleId: 'circle4-accordant',
    startOffset: 4,
    parsingInstructions: [3, 3, 3], // [فاعلاتن, مستفع لن, فاعلاتن]
    patternTransliteration: 'fāʿilātun mustafiʿ lun fāʿilātun',
    description: 'The "Light" meter, creating a swift, airy quality ideal for delicate subjects.',
    historicalUsage: 'Popular for love poetry and nature descriptions, favored by court poets.',
    famousExamples: KHAFIF_EXAMPLES
  },
  // 4. البحر المضارع (al-Mudari) - Fourth in the image
  {
    id: 'al-mudari',
    name: 'البحر المضارع',
    nameTransliteration: 'al-Bahr al-Mudāriʿ',
    circleId: 'circle4-accordant',
    startOffset: 5,
    parsingInstructions: [3, 3, 3], // [مفاعيلن, فاع لاتن, مفاعيلن] 
    patternTransliteration: 'mafāʿīlun fāʿi lātun mafāʿīlun',
    description: 'The "Resembling" meter, creating subtle variations and nuanced rhythmic patterns.',
    historicalUsage: 'Less common but used for sophisticated, nuanced poetry requiring rhythmic variety.',
    famousExamples: MUDARI_EXAMPLES
  },
  // 5. البحر المقتضب (al-Muqtadab) - Fifth in the image
  {
    id: 'al-muqtadab',
    name: 'البحر المقتضب',
    nameTransliteration: 'al-Bahr al-Muqtadab',
    circleId: 'circle4-accordant',
    startOffset: 6,
    parsingInstructions: [3, 3, 3], // [مفعولات, مستفعلن, مستفعلن]
    patternTransliteration: 'mafʿūlātu mustafʿilun mustafʿilun',
    description: 'The "Abbreviated" meter, concise and powerful, often used in its shortened forms.',
    historicalUsage: 'Used for epigrams and brief, impactful verses requiring conciseness.',
    famousExamples: MUQTADAB_EXAMPLES
  },
  // 6. البحر المجتث (al-Mujtath) - Sixth in the image
  {
    id: 'al-mujtath',
    name: 'البحر المجتث',
    nameTransliteration: 'al-Bahr al-Mujtath',
    circleId: 'circle4-accordant',
    startOffset: 10,
    parsingInstructions: [3, 3, 3], // [مستفعلن, فاعلاتن, مستفعلن]
    patternTransliteration: 'mustafʿilun fāʿilātun mustafʿilun',
    description: 'The "Uprooted" meter, creating a sense of urgency and emotional intensity.',
    historicalUsage: 'Often used for prayers, religious verse, and emotionally charged poetry.',
    famousExamples: MUJTATH_EXAMPLES
  },
];

export const CIRCLE4_ACCORDANT: Circle = {
  id: 'circle4-accordant',
  name: 'دائرة المشتبه',
  nameTransliteration: 'al-Da\'ira al-Muttafiqa',
  description: 'The Accordant Circle - the most complex circle with 5 harmonically related meters',
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