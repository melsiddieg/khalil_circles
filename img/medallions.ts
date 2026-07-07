import teal from './medallion-teal.jpg';
import sapphire from './medallion-sapphire.jpg';
import emerald from './medallion-emerald.jpg';
import ruby from './medallion-ruby.jpg';
import amethyst from './medallion-amethyst.jpg';

/**
 * Engraved bronze medallion backdrops, one per circle (keyed by display
 * order). All five share one composition; only the rosette enamel color
 * differs, echoing each circle's theme.
 */
export const MEDALLIONS: Record<number, string> = {
  1: teal,
  2: sapphire,
  3: emerald,
  4: ruby,
  5: amethyst,
};
