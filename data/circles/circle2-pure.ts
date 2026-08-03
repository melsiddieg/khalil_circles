import { Circle, Meter } from '../../types';

// Circle 2: دائرة المؤتلف (al-Da'ira al-Mu'talifa) - Pure Circle
// This circle contains meters with "pure" prosodic patterns

// Circle 2 atomic sequence - fundamental pattern
// الوافر (index 0): //0 ///0 | //0 ///0 | //0 ///0 = مفاعلتن مفاعلتن مفاعلتن
// الكامل (index 1): ///0 //0 | ///0 //0 | ///0 //0 = متفاعلن متفاعلن متفاعلن
export const CIRCLE2_ATOMIC_SEQUENCE = ['0//', '0///', '0//', '0///', '0//', '0///'];

const CIRCLE2_METERS: Meter[] = [
  {
    id: 'al-wafir',
    name: 'البحر الوافر',
    nameTransliteration: 'al-Bahr al-Wafir',
    circleId: 'circle2-pure',
    startOffset: 0,
    parsingInstructions: [2, 2, 2], // Three instances of مفاعلتن (//0 ///0)
    patternTransliteration: 'mufāʿilatun mufāʿilatun mufāʿilatun',
    mnemonic: 'بُحُورُ الشِّعْرِ وَافِرُهَا جَمِيلُ *** مُفَاعَلَتُنْ مُفَاعَلَتُنْ فَعُولُنْ',
    description: 'A flowing meter with compound feet, creating a sense of abundance and completeness.',
    historicalUsage: 'Popular in classical Arabic poetry, especially for philosophical and contemplative themes.',
    famousExamples: [
      {
        text: 'إِذَا غَضِبَتْ بَنُو أَسَدٍ عَلَى مَلِكٍ *** تَخَالُهُمُ الْمُلُوكَ لأَجْلِهَا غَضِبُوا',
        arudScript: 'إِذَا غَضِبَتْ بَنُو أَسَدِنْ عَلَى مَلِكِنْ *** تَخَالُهُمُ لْمُلُوكَ لِأَجْلِهَا غَضِبُوا',
        poet: 'مجهول',
        translation: 'When Banu Asad gets angry at a king, you would think the kings got angry for their sake.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-kamil',
    name: 'البحر الكامل',
    nameTransliteration: 'al-Bahr al-Kamil',
    circleId: 'circle2-pure',
    startOffset: 1,
    parsingInstructions: [2, 2, 2], // Three instances of متفاعلن (///0,//0 pattern, shifted by 3)
    patternTransliteration: 'mutafāʿilun mutafāʿilun mutafāʿilun',
    mnemonic: 'كَمَلَ الجَمَالُ مِنَ البُحُورِ الكَامِلُ *** مُتَفَاعِلُنْ مُتَفَاعِلُنْ مُتَفَاعِلُنْ',
    description: 'The "Complete" meter, known for its perfect symmetry and musical quality.',
    historicalUsage: 'Extremely popular across all periods, used for panegyric, elegiac, and narrative poetry.',
    famousExamples: [
      {
        text: 'وَإِذَا صَحَوْتُ فَمَا أُقَصِّرُ عَنْ نَدًى *** وَكَمَا عَلِمْتِ شَمَائِلِي وَتَكَرُّمِي',
        arudScript: 'وَإِذَا صَحَوْتُ فَمَا أُقَصْصِرُ عَنْ نَدَنْ *** وَكَمَا عَلِمْتِ شَمَائِلِي وَتَكَرْرُمِي',
        poet: 'عنترة بن شداد',
        translation: 'And when I am sober, I do not fall short of generosity, as you know my character and my nobility.',
        era: 'Pre-Islamic'
      }
    ]
  },
];

export const CIRCLE2_PURE: Circle = {
  id: 'circle2-pure',
  name: 'دائرة المؤتلف',
  nameTransliteration: "Da'irat al-Mu'talif",
  description: 'دائرة المؤتلف - تحتوي على بحور متناغمة ذات أنماط عروضية مكتملة',
  descriptionEn:
    'Concordant meters, built on complete and evenly balanced prosodic patterns.',
  atomicSequence: CIRCLE2_ATOMIC_SEQUENCE,
  baseSequenceLength: 6,
  meters: CIRCLE2_METERS,
  visualTheme: {
    primaryColor: '#3B82F6', // Blue
    accentColor: '#E5E7EB',
    backgroundGradient: ['#1E3A8A', '#1D4ED8'],
    borderColor: '#60A5FA'
  },
  order: 2
};
