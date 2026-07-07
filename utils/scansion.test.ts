import { describe, it, expect } from 'vitest';
import { tokenizeArudScript } from './scansion';
import { getMeterById } from '../data/circles';

describe('tokenizeArudScript', () => {
  it('keeps diacritics attached to their base letter', () => {
    expect(tokenizeArudScript('فَعُو')).toEqual(['فَ', 'عُ', 'و']);
  });

  it('drops spaces and separators', () => {
    expect(tokenizeArudScript('أَبْ *** جَدْ')).toEqual(['أَ', 'بْ', 'جَ', 'دْ']);
  });

  it("al-Taweel's shahid first hemistich matches the 24-letter template", () => {
    const { meter, circle } = getMeterById('al-tawil')!;
    const half = meter.famousExamples[0].arudScript!.split('***')[0];
    const expected = meter.parsingInstructions.reduce((sum, size, g) => {
      const cursor = meter.startOffset + meter.parsingInstructions.slice(0, g).reduce((s, n) => s + n, 0);
      let letters = 0;
      for (let i = 0; i < size; i++) {
        letters += circle.atomicSequence[(cursor + i) % circle.atomicSequence.length].length;
      }
      return sum + letters;
    }, 0);
    expect(expected).toBe(24); // فعولن(5) مفاعيلن(7) فعولن(5) مفاعيلن(7)
    expect(tokenizeArudScript(half)).toHaveLength(24);
  });
});
