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
    era: 'Abbasid',
    significance: 'This masterpiece exemplifies المنسرح meter\'s flowing quality, perfect for ابن الرومي\'s philosophical reflection on life\'s true meaning.'
  },
  {
    text: 'وَإِذا المَنِيَّةُ أَنشَبَت أَظفارَها * أَلفَيتَ كُلَّ تَميمَةٍ لا تَنفَعُ',
    poet: 'أبو ذؤيب الهذلي',
    translation: 'When death sinks in its claws, you find that every amulet is of no avail',
    era: 'Early Islamic',
    significance: 'This profound verse demonstrates المنسرح\'s capacity for contemplative wisdom about mortality and fate.'
  }
];

const KHAFIF_EXAMPLES: PoetryExample[] = [
  {
    text: 'يا لَيلُ الصَبُّ مَتى غَدُهُ * أَقيامُ السّاعَةِ مَوعِدُهُ',
    poet: 'أبو نواس',
    translation: 'O night of the lover, when will his tomorrow come? Is the Hour of Judgment his promised time?',
    era: 'Abbasid',
    significance: 'This delicate verse showcases الخفيف meter\'s light, airy quality perfectly suited to أبو نواس\'s romantic poetry.'
  },
  {
    text: 'لا تَعذُليهِ فَإِنَّ العَذلَ يولِعُهُ * قَد قُلتِ حَقّاً وَلَكِن لَيسَ يَسمَعُهُ',
    poet: 'جرير',
    translation: 'Do not blame him, for blame inflames him; you speak truth but he does not hear it',
    era: 'Umayyad',
    significance: 'جرير uses الخفيف\'s swift rhythm to capture the futility of reasoning with a lover, demonstrating the meter\'s psychological subtlety.'
  }
];

const MUDARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'أَينَ أَزمانُ الوَصلِ بِالأَندَلُس * لَم تَكُن أَحلامَاً وَلا أَطيافاً',
    poet: 'ابن زيدون',
    translation: 'Where are the times of union in Al-Andalus? They were not dreams nor phantoms',
    era: 'Andalusian',
    significance: 'ابن زيدون masterfully employs المضارع meter\'s subtle variations to evoke nostalgic longing for lost Andalusian paradise.'
  },
  {
    text: 'مَلَكٌ تَخِرُّ لَهُ الوُجوهُ سُجوداً * وَتَضيءُ مِن نورِ الجَبينِ جِباهُ',
    poet: 'البحتري',
    translation: 'A king before whom faces fall prostrate, and foreheads are illuminated by the light of his brow',
    era: 'Abbasid',
    significance: 'البحتري uses المضارع\'s nuanced rhythm to create a portrait of royal majesty with refined poetic craftsmanship.'
  }
];

const MUQTADAB_EXAMPLES: PoetryExample[] = [
  {
    text: 'الخَيلُ وَاللَيلُ وَالبَيداءُ تَعرِفُني * وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ',
    poet: 'المتنبي',
    translation: 'The horses, night, and desert know me, as do the sword, spear, parchment, and pen',
    era: 'Abbasid',
    significance: 'This powerful verse demonstrates المقتضب meter\'s concise force, perfectly capturing المتنبي\'s confident self-assertion.'
  },
  {
    text: 'كُن كَيفَ شِئتَ فَإِنَّ الحُبَّ ذو عَجَبٍ * يُرضيكَ بِالوَصلِ حيناً ثُمَّ يُؤذيكا',
    poet: 'عنترة بن شداد',
    translation: 'Be as you wish, for love is wondrous - it pleases you with union at times, then hurts you',
    era: 'Pre-Islamic',
    significance: 'عنترة employs المقتضب\'s abbreviated power to express love\'s paradoxical nature with warrior-poet directness.'
  }
];

const MUJTATH_EXAMPLES: PoetryExample[] = [
  {
    text: 'يا رَبِّ إِن عَظُمَت ذُنوبي كَثرَةً * فَلَقَد عَلِمتُ بِأَنَّ عَفوَكَ أَعظَمُ',
    poet: 'أبو نواس',
    translation: 'O Lord, if my sins have grown great in number, I know that Your forgiveness is greater',
    era: 'Abbasid',
    significance: 'This famous penitential verse demonstrates المجتث meter\'s emotional intensity, perfect for أبو نواس\'s spiritual confession.'
  },
  {
    text: 'أَرى المَنايا خَبط عَشواءَ مَن تُصِب * تُمِته وَمَن تُخطِئ يُعَمَّر فَيَهرَم',
    poet: 'طرفة بن العبد',
    translation: 'I see deaths strike blindly - whom they hit dies, whom they miss lives on to grow old',
    era: 'Pre-Islamic',
    significance: 'طرفة uses المجتث\'s urgent rhythm to express his fatalistic view of death\'s arbitrary nature with youthful intensity.'
  }
];

const SARI_EXAMPLES: PoetryExample[] = [
  {
    text: 'ما أَبتغي جَلَّ أَن يُسمى وَأَن يُذكرا * وَالمُبتغي مَن إِليهِ المُشتكى صَبرا',
    poet: 'المتنبي',
    translation: 'What I seek is too sublime to be named or mentioned, and the sought is he to whom complaints are made for patience',
    era: 'Abbasid',
    significance: 'This verse demonstrates the Swift meter\'s energetic rhythm, perfectly suited to express المتنبي\'s philosophical contemplation of divine transcendence.'
  },
  {
    text: 'أَلا كُلُّ شَيءٍ ما خَلا اللَهَ باطِلُ * وَكُلُّ نَعيمٍ لا مَحالَةَ زائِلُ',
    poet: 'لبيد بن ربيعة',
    translation: 'Indeed, all things save Allah are vanity, and all bliss shall inevitably pass away',
    era: 'Pre-Islamic',
    significance: 'This famous verse from لبيد exemplifies the السريع meter\'s ability to convey profound philosophical truths with swift, memorable rhythm.'
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
    description: 'بحر السريع - إيقاع سريع نشيط مناسب للحماسة والفخر',
    historicalUsage: 'يُستخدم في الشعر الحماسي والقصص البطولية، ينقل السرعة والحركة',
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
    description: 'بحر المنسرح - إيقاع منساب سهل مناسب للتأمل الفلسفي',
    historicalUsage: 'يُستخدم في الشعر التأملي والفلسفي، خاصة في العصر العباسي',
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
    description: 'بحر الخفيف - إيقاع خفيف رشيق مناسب للموضوعات الرقيقة',
    historicalUsage: 'محبوب في شعر الغزل ووصف الطبيعة، مفضل لدى شعراء البلاط',
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
    description: 'بحر المضارع - إيقاع متنوع بتنويعات خفيفة وأنماط إيقاعية دقيقة',
    historicalUsage: 'أقل شيوعاً لكن يُستخدم للشعر المتطور الذي يتطلب تنوعاً إيقاعياً',
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
    description: 'بحر المقتضب - إيقاع مختصر قوي، غالباً ما يُستخدم في أشكاله المقصورة',
    historicalUsage: 'يُستخدم للحكم والأبيات المؤثرة المختصرة التي تتطلب الإيجاز',
    famousExamples: MUQTADAB_EXAMPLES
  },
  // 6. البحر المجتث (al-Mujtath) - Sixth in the image
  {
    id: 'al-mujtath',
    name: 'البحر المجتث',
    nameTransliteration: 'al-Bahr al-Mujtath',
    circleId: 'circle4-accordant',
    startOffset: 7,
    parsingInstructions: [3, 3, 3], // [مستفعلن, فاعلاتن, فاعلاتن]
    patternTransliteration: 'mustafʿilun fāʿilātun fāʿilātun',
    description: 'بحر المجتث - إيقاع مقطوع يخلق إحساساً بالعجلة والشدة العاطفية',
    historicalUsage: 'يُستخدم كثيراً في الأدعية والشعر الديني والشعر المشحون عاطفياً',
    famousExamples: MUJTATH_EXAMPLES
  },
];

export const CIRCLE4_ACCORDANT: Circle = {
  id: 'circle4-accordant',
  name: 'دائرة المشتبه',
  nameTransliteration: 'al-Da\'ira al-Muttafiqa',
  description: 'دائرة المشتبه - أعقد الدوائر بستة بحور متناغمة ومترابطة إيقاعياً',
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