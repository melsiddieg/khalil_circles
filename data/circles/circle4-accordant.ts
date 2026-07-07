import { Circle, Meter } from '../../types';

// Circle 4: دائرة المشتبه (al-Da'ira al-Mushtabiha) - Accordant Circle
// The most complex circle with 6 distinct meters showing harmonic agreement

// Circle 4 atomic sequence - rotating pattern based on the circular diagram
// Includes the watid mafruq (/0/) that distinguishes this circle's meters
export const CIRCLE4_ATOMIC_SEQUENCE = ['0//', '0/', '0/', '/0/', '0/', '0/', '0//', '0/', '0/'];

const CIRCLE4_METERS: Meter[] = [
  {
    id: 'al-mudari',
    name: 'البحر المضارع',
    nameTransliteration: 'al-Bahr al-Mudari',
    circleId: 'circle4-accordant',
    startOffset: 0,
    parsingInstructions: [3, 3, 3], // [مفاعيلن, فاعلاتن, مفاعيلن]
    patternTransliteration: 'mafāʿīlun fāʿilātun mafāʿīlun',
    mnemonic: 'تُعَدُّ المُضَارِعَاتُ *** مَفَاعِيلُ فَاعِلَاتُنْ',
    description: 'A rare meter, similar to al-Mujtath but with a different starting foot.',
    historicalUsage: 'Rarely used in classical poetry, considered difficult and artificial by some.',
    famousExamples: [
      {
        text: 'أَرَى لَيْلَى يَا خَلِيلِي قَلَتْ وَصْلِي *** وَصَدَّتْ مِنْ بَعْدِمَا قَدْ سَبَتْ عَقْلِي',
        arudScript: 'أَرَى لَيْلَى يَا خَلِيلِي قَلَتْ وَصْلِي *** وَصَدْدَتْ مِنْ بَعْدِمَا قَدْ سَبَتْ عَقْلِي',
        poet: 'مجهول',
        translation: 'I see Layla, O my friend, has hated my connection, and turned away after she had captivated my mind.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-muqtadab',
    name: 'البحر المقتضب',
    nameTransliteration: 'al-Bahr al-Muqtadab',
    circleId: 'circle4-accordant',
    startOffset: 1,
    parsingInstructions: [3, 3, 3], // [مفعولات, مستفعلن, مستفعلن]
    patternTransliteration: 'mafʿūlātu mustafʿilun mustafʿilun',
    mnemonic: 'اِقْتَضِبْ كَمَا سَأَلُوا *** مَفْعُولَاتُ مُسْتَفْعِلُنْ',
    description: 'A "truncated" meter, short and punchy.',
    historicalUsage: 'Very rare, mostly found in experimental or later poetry.',
    famousExamples: [
      {
        text: 'يَا مَنْ حَالَ عَنْ عَهْدِنَا بَعْدَ الْوَفَا *** كَمْ لاقَيْتُ لَوْ يُنْصِفُونَا فِي الْهَوَى',
        arudScript: 'يَا مَنْ حَالَ عَنْ عَهْدِنَا بَعْدَ لْوَفَا *** كَمْ لَاقَيْتُ لَوْ يُنْصِفُونَا فِي لْهَوَى',
        poet: 'مجهول',
        translation: 'O you who changed from our covenant after loyalty, how much I encountered—if only they were fair to us in love.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-mujtath',
    name: 'البحر المجتث',
    nameTransliteration: 'al-Bahr al-Mujtath',
    circleId: 'circle4-accordant',
    startOffset: 2,
    parsingInstructions: [3, 3, 3], // [مستفعلن, فاعلاتن, فاعلاتن]
    patternTransliteration: 'mustafʿilun fāʿilātun fāʿilātun',
    mnemonic: 'إِنْ جُثَّتِ الحَرَكَاتُ *** مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
    description: 'A "cut off" meter, light and musical.',
    historicalUsage: 'Used for light verse and songs, popular in the Abbasid era.',
    famousExamples: [
      {
        text: 'صَدَّتْ وَحَالَتْ سُلَيْمَى يَا خَلِيلِي *** عَنْ عَهْدِنَا لَيْتَ شِعْرِي مَا دَهَاهَا',
        arudScript: 'صَدْدَتْ وَحَالَتْ سُلَيْمَى يَا خَلِيلِي *** عَنْ عَهْدِنَا لَيْتَ شِعْرِي مَا دَهَاهَا',
        poet: 'مجهول',
        translation: 'Sulayma turned away and changed, O my friend, from our covenant. I wish I knew what happened to her.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-sari',
    name: 'البحر السريع',
    nameTransliteration: 'al-Bahr al-Sari',
    circleId: 'circle4-accordant',
    startOffset: 4,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مستفعلن, مفعولات]
    patternTransliteration: 'mustafʿilun mustafʿilun mafʿūlātu',
    mnemonic: 'أَبْحُرُ السَّرِيعِ مَا لَهَا سَاحِلُ *** مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلُنْ',
    description: 'A fast-paced meter often used for energetic or urgent expression.',
    historicalUsage: 'Common in later classical poetry, often used for descriptive passages.',
    famousExamples: [
      {
        text: 'يُوزِعْنَ فِي حَافَاتِهِ بِالأَبْوَالِ *** فِي مَنْزِلٍ مُسْتَوْحِشٍ رَثِّ الْحَالِ',
        arudScript: 'يُوزِعْنَ فِي حَافَاتِهِ بِ لْأَبْوَالِي *** فِي مَنْزِلِنْ مُسْتَوْحِشِنْ رَثْثِ لْحَالِي',
        poet: 'مجهول',
        translation: 'They distribute... [Context specific]',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-munsarih',
    name: 'البحر المنسرح',
    nameTransliteration: 'al-Bahr al-Munsarih',
    circleId: 'circle4-accordant',
    startOffset: 7,
    parsingInstructions: [3, 3, 3], // [مستفعلن, مفعولات, مستفعلن]
    patternTransliteration: 'mustafʿilun mafʿūlātu mustafʿilun',
    mnemonic: 'مُنْسَرِحٌ فِيهِ يُضْرَبُ المَثَلُ *** مُسْتَفْعِلُنْ مَفْعُولَاتُ مُسْتَفْعِلُنْ',
    description: 'A flowing meter with a distinct rhythm, often used for lighter verse.',
    historicalUsage: 'Used moderately in classical poetry, gaining popularity in later periods.',
    famousExamples: [
      {
        text: 'إِنَّ ابْنَ زَيْدٍ لا زَالَ مُسْتَعْمَلاً *** لِلْخَيْرِ يُفْشِي فِي مِصْرِهِ عُرْفَهُ',
        arudScript: 'إِنْنَ بْنَ زَيْدِنْ لَا زَالَ مُسْتَعْمَلَنْ *** لِلْخَيْرِ يُفْشِي فِي مِصْرِهِ عُرْفَهُو',
        poet: 'مجهول',
        translation: 'Indeed, Ibn Zayd continues to be employed for good, spreading his kindness in his city.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-khafif',
    name: 'البحر الخفيف',
    nameTransliteration: 'al-Bahr al-Khafif',
    circleId: 'circle4-accordant',
    startOffset: 8,
    parsingInstructions: [3, 3, 3], // [فاعلاتن, مستفع لن, فاعلاتن]
    patternTransliteration: 'fāʿilātun mustafʿilun fāʿilātun',
    mnemonic: 'يَا خَفِيفاً خَفَّتْ بِهِ الحَرَكَاتُ *** فَاعِلَاتُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
    description: 'A "light" meter known for its grace and elegance, popular for ghazal (love poetry).',
    historicalUsage: 'Very popular in the Abbasid and Andalusian periods for lyrical poetry.',
    famousExamples: [
      {
        text: 'حَلَّ أَهْلِي مَا بَيْنَ دُرْنَا فَبَادُو *** لِي وَحَلَّتْ عَلْوِيَّةٌ بِالسِّخَالِ',
        arudScript: 'حَلْلَ أَهْلِي مَا بَيْنَ دُرْنَا فَبَادُو *** لِي وَحَلْلَتْ عَلْوِيْيَتُنْ بِ سْسِخَالِي',
        poet: 'مجهول',
        translation: 'My family settled between Durna and Baduli, and Al-Wiyyah settled in As-Sikhal.',
        era: 'Classical'
      }
    ]
  },
];

export const CIRCLE4_ACCORDANT: Circle = {
  id: 'circle4-accordant',
  name: 'دائرة المشتبه',
  nameTransliteration: 'al-Da\'ira al-Muttafiqa',
  description: 'دائرة المشتبه - أعقد الدوائر بستة بحور متناغمة ومترابطة إيقاعياً',
  atomicSequence: CIRCLE4_ATOMIC_SEQUENCE,
  baseSequenceLength: 9,
  meters: CIRCLE4_METERS,
  visualTheme: {
    primaryColor: '#F87171', // Soft red
    accentColor: '#FCD34D',
    backgroundGradient: ['#7F1D1D', '#991B1B'],
    borderColor: '#F59E0B'
  },
  order: 4
};
