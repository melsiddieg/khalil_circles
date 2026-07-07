import { Meter, Tafila, Circle } from './types';
import { ALL_CIRCLES, getCircleById } from './data/circles';

// Comprehensive tafila mapping for all prosodic patterns across all circles
export const TAFILA_MAP: Record<string, Tafila> = {
  // Circle 1 (Mixed) tafila patterns
  '0//,0/': { unmerged: 'فعو لن', merged: 'فعولن' },
  '0//,0/,0/': { unmerged: 'مفا عي لن', merged: 'مفاعيلن' },
  '0/,0//,0/': { unmerged: 'فا علا تن', merged: 'فاعلاتن' },
  '0/,0//': { unmerged: 'فا علن', merged: 'فاعلن' },
  '0/,0/,0//': { unmerged: 'مس تف علن', merged: 'مستفعلن' },

  // Circle 2 (Pure) tafila patterns
  'c2:0///,0//': { unmerged: 'مت فا علن', merged: 'متفاعلن' },
  'c2:0//,0///': { unmerged: 'مفا عل تن', merged: 'مفاعلتن' },

  // Circle 3 (Mujtathab) tafila patterns - corrected for RTL
  'c3:0//,0/,0/': { unmerged: 'مَـفا عِـي لُـن', merged: 'مفاعيلن' },
  'c3:0/,0//,0/': { unmerged: 'فا عِلا تُن', merged: 'فاعلاتن' },

  // Circle 4 (Accordant) / Circle 6 (Mushtabih) - CORRECTED
  'c6:0/,0/,0//': { unmerged: 'مس تف علن', merged: 'مستفعلن' },
  'c6:0/,0/,/0/': { unmerged: 'مف عو لات', merged: 'مفعولات' }, // watid mafroug at end

  'c6:0/,/0/,0/': { unmerged: 'مس تف ع لن', merged: 'مستفع لن' }, // For al-Khafif - sabab + watid mafroug + sabab
  'c6:0/,0//,0/': { unmerged: 'فا علا تن', merged: 'فاعلاتن' }, // Alternative فاعلاتن pattern
  'c6:/0/,0/,0/': { unmerged: 'فا ع لا تن', merged: 'فاع لاتن' }, // For al-Mudari - watid mafroug + sabab + sabab
  'c6:0//,0/,0/': { unmerged: 'مفا عي لن', merged: 'مفاعيلن' }, // For al-Mudari context - watid majmu + sabab + sabab = مفاعيلن

  // Circle 5 (Consonant) tafila patterns
  'c5:0/,0//': { unmerged: 'فَا عِلُن', merged: 'فَاعِلُن' },
  'c5:0//,0/': { unmerged: 'فَعُو لُن', merged: 'فَعُولُن' },
};

// Enhanced utility function to parse meters from their respective circles
export const parseMeterPattern = (meter: Meter, circle?: Circle): Tafila[] => {
  const pattern: Tafila[] = [];
  let atomicSequence: string[];

  // Get the appropriate atomic sequence for this meter's circle
  if (circle) {
    atomicSequence = circle.atomicSequence;
  } else {
    // Find the circle by meter's circleId
    const meterCircle = getCircleById(meter.circleId);
    if (!meterCircle && import.meta.env.DEV) {
      console.warn(`parseMeterPattern: unknown circleId "${meter.circleId}" on meter "${meter.id}"`);
    }
    atomicSequence = meterCircle?.atomicSequence ?? ALL_CIRCLES[0].atomicSequence;
  }

  // Special handling for Circle 3 (contracted) - force uniform tafila repetition
  if (meter.circleId === 'circle3-contracted') {
    let baseTafila: Tafila;

    // Determine the base tafila for each meter in circle 3
    switch (meter.id) {
      case 'al-hazaj':
        baseTafila = { unmerged: 'مَـفا عِـي لُـن', merged: 'مفاعيلن' }; // //0,/0,/0 مفاعيلن
        break;
      case 'al-rajaz':
        baseTafila = { unmerged: 'مُس تَف عِلُن', merged: 'مستفعلن' }; // //0,/0,/0 مستفعلن (RTL: 0// 0/ 0/)
        break;
      case 'al-ramal':
        baseTafila = TAFILA_MAP['c3:0/,0//,0/']; // فاعلاتن
        break;
      default:
        baseTafila = { unmerged: 'unknown', merged: 'unknown' };
    }

    // Return 3 repetitions of the same tafila
    return [baseTafila, baseTafila, baseTafila];
  }

  let cursor = meter.startOffset;
  const circlePrefix = meter.circleId === 'circle1-mixed' ? '' :
    meter.circleId === 'circle2-pure' ? 'c2:' :
      meter.circleId === 'circle3-contracted' ? 'c3:' :
        meter.circleId === 'circle4-accordant' ? 'c6:' : // Remap c4 to c6
          meter.circleId === 'circle6-mushtabih' ? 'c6:' : // Add c6
            meter.circleId === 'circle5-consonant' ? 'c5:' : '';

  for (const groupSize of meter.parsingInstructions) {
    const atomicGroup = [];
    for (let i = 0; i < groupSize; i++) {
      atomicGroup.push(atomicSequence[(cursor + i) % atomicSequence.length]);
    }
    const key = atomicGroup.join(',');
    const prefixedKey = circlePrefix + key;

    // Try circle-specific key first, then fallback to generic key
    if (TAFILA_MAP[prefixedKey]) {
      pattern.push(TAFILA_MAP[prefixedKey]);
    } else if (TAFILA_MAP[key]) {
      pattern.push(TAFILA_MAP[key]);
    } else {
      // Fallback for unmapped patterns — masks a missing TAFILA_MAP entry,
      // so surface it loudly during development.
      if (import.meta.env.DEV) {
        console.warn(
          `parseMeterPattern: no TAFILA_MAP entry for "${prefixedKey}" (meter "${meter.id}") — rendering raw atomic units`
        );
      }
      pattern.push({
        unmerged: atomicGroup.join(' '),
        merged: atomicGroup.join('')
      });
    }
    cursor += groupSize;
  }
  return pattern;
};

// Export circles and utility functions
export { ALL_CIRCLES, getCircleById, getMeterById, getTotalMeterCount } from './data/circles';