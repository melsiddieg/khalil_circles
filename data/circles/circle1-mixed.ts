import { Circle, Meter, PoetryExample } from '../../types';

// Circle 1: الدائرة المختلطة (al-Da'ira al-Mukhtalita) - Mixed Circle
// This is the first and most fundamental circle in Al-Khalil's system

// Circle 1 atomic sequence - should total 24 letters when expanded
// Pattern: //0(3) /0(2) //0(3) /0(2) /0(2) //0(3) /0(2) //0(3) /0(2) /0(2) = 24 letters
export const CIRCLE1_ATOMIC_SEQUENCE = ['0//', '0/', '0//', '0/', '0/', '0//', '0/', '0//', '0/', '0/'];

// Historical poetry examples for Circle 1 meters
const TAWIL_EXAMPLES: PoetryExample[] = [
  {
    text: 'قِفا نَبكِ مِن ذِكرى حَبيبٍ وَمَنزِلِ * بِسِقطِ اللِوى بَينَ الدَخولِ فَحَومَلِ',
    poet: 'امرؤ القيس',
    translation: 'Halt, friends both! Let us weep, recalling a love and a lodging by the rim of the twisted sands between Ad-Dakhul and Haumal.',
    era: 'Pre-Islamic'
  }
];

const MADID_EXAMPLES: PoetryExample[] = [
  {
    text: 'يا لَيتَ الشَبابَ يَعودُ يَوماً * فَأُخبِرَهُ بِما فَعَلَ المَشيبُ',
    poet: 'أبو العتاهية',
    translation: 'I wish that youth would return one day, so that I might tell it what gray hair has done.',
    era: 'Abbasid'
  }
];

const BASIT_EXAMPLES: PoetryExample[] = [
  {
    text: 'الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني * وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ',
    poet: 'المتنبي',
    translation: 'The horses, the night, and the desert know me; as do the sword, the spear, the paper, and the pen.',
    era: 'Abbasid'
  }
];

const CIRCLE1_METERS: Meter[] = [
  {
    id: 'al-tawil',
    name: 'البحر الطويل',
    nameTransliteration: 'al-Bahr al-Tawil',
    circleId: 'circle1-mixed',
    startOffset: 0,
    parsingInstructions: [2, 3, 2, 3], // [فعولن, مفاعيلن, فعولن, مفاعيلن]
    patternTransliteration: 'faʿūlun mafāʿīlun faʿūlun mafāʿīlun',
    description: 'One of the most common meters, often used for praise, satire, and themes of pride.',
    historicalUsage: 'Predominantly used in pre-Islamic poetry and the Mu\'allaqa. Favored for heroic and panegyric poetry.',
    famousExamples: TAWIL_EXAMPLES
  },
  {
    id: 'al-madid',
    name: 'البحر المديد',
    nameTransliteration: 'al-Bahr al-Madid',
    circleId: 'circle1-mixed',
    startOffset: 1,
    parsingInstructions: [3, 2, 3, 2], // [فاعلاتن, فاعلن, فاعلاتن, فاعلن]
    patternTransliteration: 'fāʿilātun fāʿilun fāʿilātun fāʿilun',
    description: 'A lighter meter, suitable for descriptive poetry and expressions of personal feeling.',
    historicalUsage: 'Often used in its shorter, 3-foot form. Popular for elegiac and contemplative poetry.',
    famousExamples: MADID_EXAMPLES
  },
  {
    id: 'al-basit',
    name: 'البحر البسيط',
    nameTransliteration: 'al-Bahr al-Basit',
    circleId: 'circle1-mixed',
    startOffset: 3,
    parsingInstructions: [3, 2, 3, 2], // [مستفعلن, فاعلن, مستفعلن, فاعلن]
    patternTransliteration: 'mustafʿilun fāʿilun mustafʿilun fāʿilun',
    description: 'A versatile and smooth-flowing meter, used for a wide range of narrative and descriptive topics.',
    historicalUsage: 'Highly versatile, used across many genres from narrative to didactic poetry.',
    famousExamples: BASIT_EXAMPLES
  },
];

export const CIRCLE1_MIXED: Circle = {
  id: 'circle1-mixed',
  name: 'دائرة المختلف',
  nameTransliteration: 'al-Da\'ira al-Mukhtalita',
  description: 'دائرة المختلف - الدائرة الأولى والأساسية تحتوي على أكثر البحور استخداماً في الشعر العربي',
  atomicSequence: CIRCLE1_ATOMIC_SEQUENCE,
  baseSequenceLength: 10,
  meters: CIRCLE1_METERS,
  visualTheme: {
    primaryColor: '#FBBF24', // Amber
    accentColor: '#F59E0B',
    backgroundGradient: ['#FEF3C7', '#FCD34D'],
    borderColor: '#D97706'
  },
  order: 1
};