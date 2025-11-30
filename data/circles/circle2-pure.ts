import { Circle, Meter, PoetryExample } from '../../types';

// Circle 2: الدائرة المجتلبة (al-Da'ira al-Mujtaliба) - Pure Circle  
// This circle contains meters with "pure" prosodic patterns

// Circle 2 atomic sequence - fundamental pattern
// الوافر (index 0): //0 ///0 | //0 ///0 | //0 ///0 = مفاعلتن مفاعلتن مفاعلتن
// الكامل (index 1): ///0 //0 | ///0 //0 | ///0 //0 = متفاعلن متفاعلن متفاعلن
export const CIRCLE2_ATOMIC_SEQUENCE = ['0//', '0///', '0//', '0///', '0//', '0///'];

// Historical poetry examples for Circle 2 meters
const WAFIR_EXAMPLES: PoetryExample[] = [
  {
    text: 'أَلا هُبّي بِصَحنِكِ فَاِصبَحينا * وَلا تُبقي خُمورَ الأَندَرينا',
    poet: 'عمرو بن كلثوم',
    translation: 'Wake up and bring us your morning draught in your goblet, and do not spare the wines of Al-Andarin.',
    era: 'Pre-Islamic'
  }
];

const KAMIL_EXAMPLES: PoetryExample[] = [
  {
    text: 'هَل غادَرَ الشُعَراءُ مِن مُتَرَدَّمِ * أَم هَل عَرَفتَ الدارَ بَعدَ تَوَهُّمِ',
    poet: 'عنترة بن شداد',
    translation: 'Have the poets left anything to be patched? Or did you recognize the abode after imagining it?',
    era: 'Pre-Islamic'
  }
];

const CIRCLE2_METERS: Meter[] = [
  {
    id: 'al-wafir',
    name: 'البحر الوافر',
    nameTransliteration: 'al-Bahr al-Wafir',
    circleId: 'circle2-pure',
    startOffset: 0,
    parsingInstructions: [2, 2, 2], // Three instances of مفاعلتن (//0 ///0)
    patternTransliteration: 'mufāʿilatun mufāʿilatun mufāʿilatun',
    description: 'A flowing meter with compound feet, creating a sense of abundance and completeness.',
    historicalUsage: 'Popular in classical Arabic poetry, especially for philosophical and contemplative themes.',
    famousExamples: WAFIR_EXAMPLES
  },
  {
    id: 'al-kamil',
    name: 'البحر الكامل',
    nameTransliteration: 'al-Bahr al-Kamil',
    circleId: 'circle2-pure',
    startOffset: 1,
    parsingInstructions: [2, 2, 2], // Three instances of متفاعلن (///0,//0 pattern, shifted by 3)
    patternTransliteration: 'mutafāʿilun mutafāʿilun mutafāʿilun',
    description: 'The "Complete" meter, known for its perfect symmetry and musical quality.',
    historicalUsage: 'Extremely popular across all periods, used for panegyric, elegiac, and narrative poetry.',
    famousExamples: KAMIL_EXAMPLES
  },
];

export const CIRCLE2_PURE: Circle = {
  id: 'circle2-pure',
  name: 'دائرة المؤتلف',
  nameTransliteration: 'al-Da\'ira al-Mujtaliба',
  description: 'دائرة المؤتلف - تحتوي على بحور متناغمة ذات أنماط عروضية مكتملة',
  atomicSequence: CIRCLE2_ATOMIC_SEQUENCE,
  baseSequenceLength: 6,
  meters: CIRCLE2_METERS,
  visualTheme: {
    primaryColor: '#3B82F6', // Blue
    accentColor: '#1D4ED8',
    backgroundGradient: ['#DBEAFE', '#93C5FD'],
    borderColor: '#1E40AF'
  },
  order: 2
};