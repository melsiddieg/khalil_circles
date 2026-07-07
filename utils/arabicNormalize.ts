/**
 * Normalizes Arabic (and Latin) text for search matching:
 * - strips tashkeel (harakat), tatweel, and superscript alef
 * - unifies hamza-carrying alef forms (أ إ آ → ا)
 * - unifies ta marbuta (ة → ه) and alef maqsura (ى → ي)
 * - lowercases Latin script and collapses whitespace
 */
export const normalizeArabic = (input: string): string =>
  input
    .replace(/[ً-ْٰـ]/g, '') // tashkeel + superscript alef + tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/** True when the normalized haystack contains the normalized needle. */
export const arabicIncludes = (haystack: string, needle: string): boolean =>
  normalizeArabic(haystack).includes(normalizeArabic(needle));
