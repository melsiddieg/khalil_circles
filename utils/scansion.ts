/**
 * Tokenize prosodic writing (الكتابة العروضية) into letters: each token is
 * one base Arabic letter plus its trailing diacritics. Spaces, tatweel, and
 * punctuation are dropped. In prosodic writing every written letter is
 * exactly one prosodic letter ('/' = moving, '0' = quiescent), so tokens
 * map 1:1 onto the unit symbols of the canonical pattern.
 */
export const tokenizeArudScript = (text: string): string[] => {
  const tokens: string[] = [];
  const BASE = /[ء-يٱ-ۓ]/;
  const MARK = /[ً-ْٰ]/;
  for (const ch of text) {
    if (BASE.test(ch)) tokens.push(ch);
    else if (MARK.test(ch) && tokens.length > 0) tokens[tokens.length - 1] += ch;
  }
  return tokens;
};
