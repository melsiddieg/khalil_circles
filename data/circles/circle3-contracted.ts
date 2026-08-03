import { Circle, Meter } from '../../types';

// Circle 3: دائرة المجتلب (da'irat al-Mujtalab) - Circle of the Appropriated
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

const CIRCLE3_METERS: Meter[] = [
  {
    id: 'al-hazaj',
    name: 'البحر الهزج',
    nameTransliteration: 'al-Bahr al-Hazaj',
    circleId: 'circle3-contracted',
    startOffset: 0, // Starts at index 0: uniform مفاعيلن pattern
    parsingInstructions: [3, 3, 3], // [مفاعيلن, مفاعيلن, مفاعيلن]
    patternTransliteration: 'mafāʿīlun mafāʿīlun mafāʿīlun',
    mnemonic: 'عَلَى الأَهْزَاجِ تَسْهِيلُ *** مَفَاعِيلُنْ مَفَاعِيلُنْ',
    description: 'A rhythmic meter with a quick, bouncing cadence, often used for light verse.',
    historicalUsage: 'Popular for satirical and humorous poetry, also used in folk songs and children\'s verse.',
    famousExamples: [
      {
        text: 'عَفَا يَا صَاحِ مِنْ سَلْمَى مَرَاعِيهَا *** فَظَلَّتْ مُقْلَتِي تَجْرِي بِمَا فِيهَا',
        arudScript: 'عَفَا يَا صَاحِ مِنْ سَلْمَى مَرَاعِيهَا *** فَظَلْلَتْ مُقْلَتِي تَجْرِي بِمَا فِيهَا',
        poet: 'مجهول',
        translation: 'O friend, Salma\'s pastures have been effaced, so my eye continued to flow [with tears] for what is in them.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-rajaz',
    name: 'البحر الرجز',
    nameTransliteration: 'al-Bahr al-Rajaz',
    circleId: 'circle3-contracted',
    startOffset: 1, // Starts at index 1: uniform مستفعلن pattern
    parsingInstructions: [3, 3, 3], // [مستفعلن, مستفعلن, مستفعلن]
    patternTransliteration: 'mustafʿilun mustafʿilun mustafʿilun',
    mnemonic: 'فِي أَبْحُرِ الأَرْجَازِ بَحْرٌ يَسْهُلُ *** مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ',
    description: 'The most flexible meter in Arabic poetry, allowing many variations and perfect for didactic verse.',
    historicalUsage: 'Extremely versatile, used for epic poetry, religious verse, and pedagogical content.',
    famousExamples: [
      {
        text: 'دَارٌ لِسَلْمَى إِذْ سُلَيْمَى جَارَةٌ *** قَفْرٌ تَرَى آيَاتِهَا مِثْلَ الزُّبُرْ',
        arudScript: 'دَارُنْ لِسَلْمَى إِذْ سُلَيْمَى جَارَتُنْ *** قَفْرُنْ تَرَى آيَاتِهَا مِثْلَ زْزُبُرْ',
        poet: 'مجهول',
        translation: 'A house of Salma when Sulayma was a neighbor, desolate, you see its traces like written scriptures.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-ramal',
    name: 'البحر الرمل',
    nameTransliteration: 'al-Bahr al-Ramal',
    circleId: 'circle3-contracted',
    startOffset: 2, // Starts at index 2: uniform فاعلاتن pattern
    parsingInstructions: [3, 3, 3], // [فاعلاتن, فاعلاتن, فاعلاتن]
    patternTransliteration: 'fāʿilātun fāʿilātun fāʿilātun',
    mnemonic: 'رَمَلُ الأَبْحُرِ يَرْوِيهِ الثِّقَاتُ *** فَاعِلَاتُنْ فَاعِلَاتُنْ فَاعِلَاتُنْ',
    description: 'A graceful, flowing meter that creates a gentle, undulating rhythm like sand dunes.',
    historicalUsage: 'Favored for love poetry and nature descriptions, popular in Andalusian poetry.',
    famousExamples: [
      {
        text: 'يَا خَلِيلَيَّ اعْذُرَانِي إِنَّنِي مِنْ *** حُبِّ سَلْمَى فِي اكْتِئَابٍ وَانْتِحَابِ',
        arudScript: 'يَا خَلِيلَيْ يَ عْذُرَانِي إِنْنَنِي مِنْ *** حُبْبِ سَلْمَى فِ كْتِئَابِنْ وَنْتِحَابِي',
        poet: 'مجهول',
        translation: 'O my two friends, excuse me, for I am in depression and weeping from the love of Salma.',
        era: 'Classical'
      }
    ]
  },
];

export const CIRCLE3_CONTRACTED: Circle = {
  id: 'circle3-contracted',
  name: 'دائرة المجتلب',
  nameTransliteration: "Da'irat al-Mujtalab",
  description: 'دائرة المجتلب - تتكون من تفعيلات سباعية متكررة (مفاعيلن، مستفعلن، فاعلاتن)',
  descriptionEn:
    'Built from one seven-letter foot repeated — mafāʿīlun, mustafʿilun, fāʿilātun.',
  atomicSequence: CIRCLE3_ATOMIC_SEQUENCE,
  baseSequenceLength: 9,
  meters: CIRCLE3_METERS,
  visualTheme: {
    primaryColor: '#10B981', // Emerald
    accentColor: '#D97706',
    backgroundGradient: ['#064E3B', '#065F46'],
    borderColor: '#34D399'
  },
  order: 3
};
