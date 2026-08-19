import React from 'react';

/**
 * A display heading that arrives the way the medallions do — each word
 * blooming out with the petals' overshoot instead of sliding up.
 *
 * Two constraints shape this:
 *
 * Split on spaces, never on characters. Arabic shapes every letter to its
 * neighbours inside a word, so one box per glyph would strand each letter in
 * its isolated form and destroy the ligatures the Kufi face is chosen for. A
 * space is already a non-joining boundary, so cutting there changes nothing.
 *
 * The gold gradient rides each word rather than the heading. `heading-display`
 * paints a gradient and clips it to its text; a transformed descendant is
 * composited on its own layer, where that clip is unreliable. Per-word is
 * safe, and because the gradient is vertical and every word is one
 * line-height tall, it renders identically to a single shared sweep.
 */
const TitleReveal: React.FC<{
  text: string;
  className?: string;
  /** Delay before the first word, ms. Later words follow by `stagger`. */
  delay?: number;
  stagger?: number;
}> = ({ text, className = '', delay = 0, stagger = 80 }) => (
  <h1 className={className}>
    {text.split(/\s+/).filter(Boolean).map((word, i, all) => (
      <React.Fragment key={`${word}-${i}`}>
        <span
          className="rs-title heading-display"
          style={{ ['--d' as string]: delay + i * stagger }}
        >
          {word}
        </span>
        {/* A real space between words, outside the animated boxes, so the
            line still breaks and justifies normally. */}
        {i < all.length - 1 ? ' ' : null}
      </React.Fragment>
    ))}
  </h1>
);

export default TitleReveal;
