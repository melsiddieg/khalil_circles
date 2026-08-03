import { Circle, Meter } from '../../types';

// Circle 1: دائرة المختلف (al-Da'ira al-Mukhtalita) - Mixed Circle
// This is the first and most fundamental circle in Al-Khalil's system

// Circle 1 atomic sequence - should total 24 letters when expanded
// Pattern: //0(3) /0(2) //0(3) /0(2) /0(2) //0(3) /0(2) //0(3) /0(2) /0(2) = 24 letters
export const CIRCLE1_ATOMIC_SEQUENCE = ['0//', '0/', '0//', '0/', '0/', '0//', '0/', '0//', '0/', '0/'];

const CIRCLE1_METERS: Meter[] = [
  {
    id: 'al-tawil',
    name: 'البحر الطويل',
    nameTransliteration: 'al-Bahr al-Tawil',
    circleId: 'circle1-mixed',
    startOffset: 0,
    parsingInstructions: [2, 3, 2, 3], // [فعولن, مفاعيلن, فعولن, مفاعيلن]
    patternTransliteration: 'faʿūlun mafāʿīlun faʿūlun mafāʿīlun',
    mnemonic: 'طَوِيلٌ لَهُ دُونَ البُحُورِ فَضَائِلُ  ***  فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِيلُنْ',
    description: 'One of the most common meters, often used for praise, satire, and themes of pride.',
    historicalUsage: 'Predominantly used in pre-Islamic poetry and the Mu\'allaqa. Favored for heroic and panegyric poetry.',
    famousExamples: [
      {
        text: 'أَلا يَا لِقَوْمٍ لِلتَّنَائِي وَلِلْهَجْرِ *** وَمُرِّ اللَّيَالِي كَيْفَ يُزْرِينَ بِالْعُمْرِ',
        arudScript: 'أَلَا يَا لِقَوْمِنْ لِتْتَنَائِي وَلِلْهَجْرِي *** وَمُرْرِ لْلَيَالِي كَيْفَ يُزْرِينَ بِ لْعُمْرِي',
        poet: 'مجهول',
        translation: 'Oh people, what of separation and abandonment, and the passing of nights—how they wear down life.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-madid',
    name: 'البحر المديد',
    nameTransliteration: 'al-Bahr al-Madid',
    circleId: 'circle1-mixed',
    startOffset: 1,
    parsingInstructions: [3, 2, 3, 2], // [فاعلاتن, فاعلن, فاعلاتن, فاعلن]
    patternTransliteration: 'fāʿilātun fāʿilun fāʿilātun fāʿilun',
    mnemonic: 'لِمَدِيدِ الشِّعْرِ عِنْدِي صِفَاتُ  ***  فَاعِلَاتُنْ فَاعِلُنْ فَاعِلَاتُنْ',
    description: 'A lighter meter, suitable for descriptive poetry and expressions of personal feeling.',
    historicalUsage: 'Often used in its shorter, 3-foot form. Popular for elegiac and contemplative poetry.',
    famousExamples: [
      {
        text: 'إِنَّ قَوْمِي وَتْرُهُمْ ذُو طُلُولٍ ذَلَّ مَنْ *** يَرْتَجِيهِمْ سَائِلاً حِينَ يَعْرُو مَنْ وَمَنْ',
        arudScript: 'إِنْنَ قَوْمِي وَتْرُهُمْ ذُو طُلُولِنْ ذَلْلَ مَنْ *** يَرْتَجِيهِمْ سَائِلَنْ حِينَ يَعْرُو مَنْ وَمَنْ',
        poet: 'مجهول',
        translation: 'Indeed, my people... [Context specific translation unavailable]',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-basit',
    name: 'البحر البسيط',
    nameTransliteration: 'al-Bahr al-Basit',
    circleId: 'circle1-mixed',
    startOffset: 3,
    parsingInstructions: [3, 2, 3, 2], // [مستفعلن, فاعلن, مستفعلن, فاعلن]
    patternTransliteration: 'mustafʿilun fāʿilun mustafʿilun fāʿilun',
    mnemonic: 'إِنَّ البَسِيطَ لَدَيْهِ يُبْسَطُ الأَمَلُ  ***  مُسْتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَاعِلُنْ',
    description: 'A versatile and smooth-flowing meter, used for a wide range of narrative and descriptive topics.',
    historicalUsage: 'Highly versatile, used across many genres from narrative to didactic poetry.',
    famousExamples: [
      {
        text: 'يَا حَارِ لا أُرْمَيَنَّ مِنْكُمْ بِأُعْجُوبَةٍ *** لَمْ يَلْقَهَا سُوقَةٌ قَبْلِي وَلا مَلِكُ',
        arudScript: 'يَا حَارِ لَا أُرْمَيَنْ نَ مِنْكُمْ بِأُعْجُوبَتِنْ *** لَمْ يَلْقَهَا سُوقَتُنْ قَبْلِي وَلَا مَلِكُو',
        poet: 'مجهول',
        translation: 'O Harith, let me not be struck by a wonder from you, that neither a commoner nor a king has encountered before me.',
        era: 'Classical'
      }
    ]
  },
];

export const CIRCLE1_MIXED: Circle = {
  id: 'circle1-mixed',
  name: 'دائرة المختلف',
  nameTransliteration: "Da'irat al-Mukhtalif",
  description: 'دائرة المختلف - الدائرة الأولى والأساسية تحتوي على أكثر البحور استخداماً في الشعر العربي',
  descriptionEn:
    'The first and most fundamental circle, carrying the meters most used in Arabic verse.',
  atomicSequence: CIRCLE1_ATOMIC_SEQUENCE,
  baseSequenceLength: 10,
  meters: CIRCLE1_METERS,
  visualTheme: {
    primaryColor: '#2DD4BF', // Teal
    accentColor: '#FBBF24', // Amber
    backgroundGradient: ['#134E4A', '#0F766E'],
    borderColor: '#F59E0B'
  },
  order: 1
};
