import { Circle, Meter, PoetryExample } from '../../types';

// Circle 3: دائرة المجتلب (da'irat al-Mujtathab) - Circle of the Appropriated
// This circle contains meters with seven-syllable repeated metrical feet

// Circle 3 atomic sequence - preserves correct patterns for each meter with subtle offsets
// al-Hazaj: مفاعيلن (//0,/0,/0) - starts at index 0
// al-Rajaz: مستفعلن (//0,/0,/0) - starts at index 3 (shifted for RTL: "0// 0/ 0/")  
// al-Ramal: فاعلاتن (/0,//0,/0) - starts at index 5
export const CIRCLE3_ATOMIC_SEQUENCE = [
  '0//', '0/', '0/',
  '0//', '0/', '0/',
  '0//', '0/', '0/'
];

// Historical poetry examples for Circle 3 meters
const HAZAJ_EXAMPLES: PoetryExample[] = [
  {
    text: 'صَفَحنا عَن بَني ذُهلٍ * وَقُلنا القَومُ إِخوانُ',
    poet: 'قيس بن الملوح (مجنون ليلى)',
    translation: 'We forgave the Banu Dhuhl, and said: "The people are brothers."',
    era: 'Umayyad'
  }
];

const RAJAZ_EXAMPLES: PoetryExample[] = [
  {
    text: 'ما هاجَ أَحزاناً وَشَجواً قَد شَجا * تَأمُّلُ العَينِ بِأَعناقِ الدُمى',
    poet: 'الفرزدق',
    translation: 'What stirred sorrows and grief that was already grieving? The eye contemplating the necks of the statues.',
    era: 'Umayyad'
  }
];

const RAMAL_EXAMPLES: PoetryExample[] = [
  {
    text: 'أَضحى التَنائي بَديلاً مِن تَدانينا * وَنابَ عَن طيبِ لُقيانا تَجافينا',
    poet: 'ابن زيدون',
    translation: 'Distance has become a substitute for our nearness, and separation has replaced the sweetness of our meeting.',
    era: 'Andalusian'
  }
];

const CIRCLE3_METERS: Meter[] = [
  {
    id: 'al-hazaj',
    name: 'البحر الهزج',
    nameTransliteration: 'al-Bahr al-Hazaj',
    circleId: 'circle3-contracted',
    startOffset: 0, // Starts at index 0: uniform مفاعيلن pattern
    parsingInstructions: [3, 3, 3], // [مفاعيلن, مفاعيلن, مفاعيلن]
    patternTransliteration: 'mafāʿīlun mafāʿīlun mafāʿīlun',
    description: 'A rhythmic meter with a quick, bouncing cadence, often used for light verse.',
    historicalUsage: 'Popular for satirical and humorous poetry, also used in folk songs and children\'s verse.',
    famousExamples: HAZAJ_EXAMPLES
  },
  {
    id: 'al-rajaz',
    name: 'البحر الرجز',
    nameTransliteration: 'al-Bahr al-Rajaz',
    circleId: 'circle3-contracted',
    startOffset: 1, // Starts at index 1: uniform مستفعلن pattern
    parsingInstructions: [3, 3, 3], // [مستفعلن, مستفعلن, مستفعلن]
    patternTransliteration: 'mustafʿilun mustafʿilun mustafʿilun',
    description: 'The most flexible meter in Arabic poetry, allowing many variations and perfect for didactic verse.',
    historicalUsage: 'Extremely versatile, used for epic poetry, religious verse, and pedagogical content.',
    famousExamples: RAJAZ_EXAMPLES
  },
  {
    id: 'al-ramal',
    name: 'البحر الرمل',
    nameTransliteration: 'al-Bahr al-Ramal',
    circleId: 'circle3-contracted',
    startOffset: 2, // Starts at index 2: uniform فاعلاتن pattern
    parsingInstructions: [3, 3, 3], // [فاعلاتن, فاعلاتن, فاعلاتن]
    patternTransliteration: 'fāʿilātun fāʿilātun fāʿilātun',
    description: 'A graceful, flowing meter that creates a gentle, undulating rhythm like sand dunes.',
    historicalUsage: 'Favored for love poetry and nature descriptions, popular in Andalusian poetry.',
    famousExamples: RAMAL_EXAMPLES
  },
];

export const CIRCLE3_CONTRACTED: Circle = {
  id: 'circle3-contracted',
  name: 'دائرة المجتلب',
  nameTransliteration: 'da\'irat al-Mujtathab',
  description: 'دائرة المجتلب - تتكون من تفعيلات سباعية متكررة (مفاعيلن، مستفعلن، فاعلاتن)',
  atomicSequence: CIRCLE3_ATOMIC_SEQUENCE,
  baseSequenceLength: 9,
  meters: CIRCLE3_METERS,
  visualTheme: {
    primaryColor: '#10B981', // Emerald
    accentColor: '#059669',
    backgroundGradient: ['#D1FAE5', '#6EE7B7'],
    borderColor: '#047857'
  },
  order: 3
};