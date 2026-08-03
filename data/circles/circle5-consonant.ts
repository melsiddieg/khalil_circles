import { Circle, Meter } from '../../types';

// Circle 5: دائرة المتفق (al-Da'ira al-Muttafiq) - Consonant Circle
// This circle contains meters with consonant-heavy, rapid rhythmic patterns

// Circle 5 atomic sequence - pattern for فعولن repetition (0// 0/ for RTL)
export const CIRCLE5_ATOMIC_SEQUENCE = ['0//', '0/', '0//', '0/', '0//', '0/', '0//', '0/'];

const CIRCLE5_METERS: Meter[] = [
  {
    id: 'al-mutaqarib',
    name: 'البحر المتقارب',
    nameTransliteration: 'al-Bahr al-Mutaqārib',
    circleId: 'circle5-consonant',
    startOffset: 0,
    parsingInstructions: [2, 2, 2, 2], // [فعولن, فعولن, فعولن, فعولن]
    patternTransliteration: 'faʿūlun faʿūlun faʿūlun faʿūlun',
    mnemonic: 'عَنِ المُتَقَارِبِ قَالَ الخَلِيلُ *** فَعُولُنْ فَعُولُنْ فَعُولُنْ فَعُولُنْ',
    description: 'A meter with a steady, marching rhythm, often used for heroic or narrative poetry.',
    historicalUsage: 'Used in the Shahnameh and other epic poetry. Popular for its driving rhythm.',
    famousExamples: [
      {
        text: 'فَأَمَّا تَمِيمٌ تَمِيمُ بْنُ مُرٍّ *** فَأَلْفَاهُمُ الْقَوْمُ رُوبَى نِيَامَا',
        arudScript: 'فَأَمْمَا تَمِيمُنْ تَمِيمُ بْنُ مُرْرِنْ *** فَأَلْفَاهُمُ لْقَوْمُ رُوبَى نِيَامَا',
        poet: 'مجهول',
        translation: 'As for Tamim, Tamim bin Murr, the people found them exhausted and asleep.',
        era: 'Classical'
      }
    ]
  },
  {
    id: 'al-mutadarik',
    name: 'البحر المتدارك',
    nameTransliteration: 'al-Bahr al-Mutadārik',
    circleId: 'circle5-consonant',
    startOffset: 1,
    parsingInstructions: [2, 2, 2, 2], // [فاعلن, فاعلن, فاعلن, فاعلن]
    patternTransliteration: 'fāʿilun fāʿilun fāʿilun fāʿilun',
    mnemonic: 'حَرَكَاتُ المُحْدَثِ تَنْتَقِلُ *** فَعِلُنْ فَعِلُنْ فَعِلُنْ فَعِلُنْ',
    description: 'Also known as "al-Khabab", a very fast, galloping meter.',
    historicalUsage: 'Often used for horse-riding songs and energetic chants. Less common in classical canon.',
    famousExamples: [
      {
        text: 'يَا لَيْلُ الصَّبُّ مَتَى غَدُهُ * أَقِيَامُ السَّاعَةِ مَوْعِدُهُ',
        arudScript: 'يَا لَيْلُ صْصَبْبُ مَتَى غَدُهُو *** أَقِيَامُ سْسَاعَةِ مَوْعِدُهُو',
        poet: 'الحصري القيرواني',
        translation: 'O night of the lover, when is his tomorrow? Is the Day of Judgment his appointment?',
        era: 'Andalusian'
      }
    ]
  }
];

export const CIRCLE5_CONSONANT: Circle = {
  id: 'circle5-consonant',
  name: 'دائرة المتفق',
  nameTransliteration: "Da'irat al-Muttafiq",
  description: 'دائرة المتفق - تحتوي على بحور سريعة ذات أنماط إيقاعية كثيفة الحروف الساكنة',
  descriptionEn:
    'Swift meters whose rhythm is dense with quiescent letters.',
  atomicSequence: CIRCLE5_ATOMIC_SEQUENCE,
  baseSequenceLength: 8,
  meters: CIRCLE5_METERS,
  visualTheme: {
    primaryColor: '#A78BFA', // Violet
    accentColor: '#E5E7EB',
    backgroundGradient: ['#4C1D95', '#5B21B6'],
    borderColor: '#C4B5FD'
  },
  order: 5
};
