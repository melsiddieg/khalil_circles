import { describe, it, expect } from 'vitest';
import { normalizeArabic, arabicIncludes } from './arabicNormalize';

describe('normalizeArabic', () => {
  it('strips tashkeel', () => {
    expect(normalizeArabic('الطَّوِيلُ')).toBe('الطويل');
  });

  it('strips tatweel', () => {
    expect(normalizeArabic('مـفـاعـيـلـن')).toBe('مفاعيلن');
  });

  it('unifies hamza forms of alef', () => {
    expect(normalizeArabic('أبحر')).toBe('ابحر');
    expect(normalizeArabic('إيقاع')).toBe('ايقاع');
    expect(normalizeArabic('آمال')).toBe('امال');
  });

  it('unifies ta marbuta and alef maqsura', () => {
    expect(normalizeArabic('دائرة')).toBe('دايره');
    expect(normalizeArabic('مصطفى')).toBe('مصطفي');
  });

  it('lowercases and trims Latin', () => {
    expect(normalizeArabic('  Al-Bahr  al-Tawil ')).toBe('al-bahr al-tawil');
  });
});

describe('arabicIncludes', () => {
  it('matches unvocalized queries against vocalized text', () => {
    expect(arabicIncludes('البحر الطَّوِيل', 'طويل')).toBe(true);
  });

  it('matches hamza-insensitively', () => {
    expect(arabicIncludes('أبحر الشعر', 'ابحر')).toBe(true);
  });

  it('matches Latin case-insensitively', () => {
    expect(arabicIncludes('al-Bahr al-Tawil', 'TAWIL')).toBe(true);
  });

  it('rejects non-matches', () => {
    expect(arabicIncludes('البحر الطويل', 'الكامل')).toBe(false);
  });
});
