import { Circle, Meter, PoetryExample } from '../../types';

// Circle 5: دائرة المتقارب (al-Da'ira al-Mutaqarib) - Consonant Circle
// This circle contains meters with consonant-heavy, rapid rhythmic patterns

// Circle 5 atomic sequence - pattern for فعولن repetition (0// 0/ for RTL)
export const CIRCLE5_ATOMIC_SEQUENCE = ['0//', '0/', '0//', '0/', '0//', '0/', '0//', '0/'];

// Historical poetry examples for Circle 5 meters
const MUTAQARIB_EXAMPLES: PoetryExample[] = [
  {
    text: 'أَلا كُلُّ شَيءٍ ما خَلا اللَهَ باطِلُ * وَكُلُّ نَعيمٍ لا مَحالَةَ زائِلُ',
    poet: 'لبيد بن ربيعة',
    translation: 'Indeed, everything other than Allah is false, and every bliss is inevitably fleeting.',
    era: 'Pre-Islamic'
  }
];

const MUTADARIK_EXAMPLES: PoetryExample[] = [
  {
    text: 'جاءَنا الأَشعَثُ حَقّاً * بِنِكاحٍ لا يُبالي',
    poet: 'الخنساء',
    translation: 'Al-Ash\'ath truly came to us with a marriage proposal, indifferent.',
    era: 'Early Islamic'
  }
];

const CIRCLE5_METERS: Meter[] = [
  {
    id: 'al-mutaqarib',
    name: 'البحر المتقارب',
    nameTransliteration: 'al-Bahr al-Mutaqārib',
    circleId: 'circle5-consonant',
    startOffset: 0,
    parsingInstructions: [2, 2, 2, 2], // [فعولن, فعولن, فعولن, فعولن]
    patternTransliteration: 'faʿūlun faʿūlun faʿūlun faʿūlun',
    description: 'The "Approaching" meter, with closely spaced beats creating rapid, urgent rhythm.',
    historicalUsage: 'Perfect for dramatic monologues and emotional outbursts, popular in modern poetry.',
    famousExamples: MUTAQARIB_EXAMPLES
  },
  {
    id: 'al-mutadarik',
    name: 'البحر المتدارك',
    nameTransliteration: 'al-Bahr al-Mutadārik',
    circleId: 'circle5-consonant',
    startOffset: 1,
    parsingInstructions: [2, 2, 2, 2], // [فاعلن, فاعلن, فاعلن, فاعلن]
    patternTransliteration: 'fāʿilun fāʿilun fāʿilun fāʿilun',
    description: 'The "Compensating" meter, filling gaps left by other meters with its unique cadence.',
    historicalUsage: 'Relatively late addition to classical prosody, popular in folk songs and modern verse.',
    famousExamples: MUTADARIK_EXAMPLES
  }
];

export const CIRCLE5_CONSONANT: Circle = {
  id: 'circle5-consonant',
  name: 'دائرة المتفق',
  nameTransliteration: "al-Da'ira al-Muttafiq",
  description: 'دائرة المتفق - تحتوي على بحور سريعة ذات أنماط إيقاعية كثيفة الحروف الساكنة',
  atomicSequence: CIRCLE5_ATOMIC_SEQUENCE,
  baseSequenceLength: 8,
  meters: CIRCLE5_METERS,
  visualTheme: {
    primaryColor: '#EF4444', // Red
    accentColor: '#DC2626',
    backgroundGradient: ['#FEE2E2', '#FCA5A5'],
    borderColor: '#B91C1C'
  },
  order: 5
};
