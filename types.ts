
/**
 * Represents a single poetic foot (tafila) in both its
 * deconstructed (unmerged) and final (merged) forms.
 */
export interface Tafila {
  unmerged: string;
  merged: string;
}

/**
 * Represents variations of a tafila (supporting Zihaf - prosodic variations)
 */
export interface TafilaVariant {
  base: Tafila;
  variations: Tafila[];
  prosodyPattern: string; // Long/short syllable pattern (e.g., "– ⏑ –")
}

/**
 * Poetry example with historical context
 */
export interface PoetryExample {
  text: string; // Arabic verse
  poet: string;
  translation?: string;
  era: string; // Classical, Abbasid, etc.
}

/**
 * Visual theme configuration for circles
 */
export interface CircleTheme {
  primaryColor: string;
  accentColor: string;
  backgroundGradient: string[];
  borderColor: string;
}

/**
 * Represents one of Al-Khalil's five prosodic circles
 */
export interface Circle {
  id: string;
  name: string; // Arabic name (e.g., "الدائرة المختلطة")
  nameTransliteration: string; // "al-Da'ira al-Mukhtalita"
  description: string;
  atomicSequence: string[]; // Each circle may have unique patterns
  baseSequenceLength: number;
  meters: Meter[];
  visualTheme: CircleTheme;
  order: number; // Display order (1-5)
}

export interface Meter {
  id: string;
  name: string;
  nameTransliteration: string; // Added for consistency
  description: string;
  circleId: string; // Reference to parent circle
  startOffset: number; // Index in the circle's atomic sequence
  parsingInstructions: number[]; // How many atomic units to group for each tafila
  patternTransliteration: string;
  historicalUsage: string; // Classical usage patterns
  famousExamples: PoetryExample[]; // Historical poetry examples
}

/**
 * Application state for navigation between circles and meters
 */
export interface AppState {
  currentView: 'hub' | 'circle'; // Hub view or individual circle view
  selectedCircleId?: string;
  selectedMeterIndex?: number;
}

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  labelAr: string;
  onClick: () => void;
}
