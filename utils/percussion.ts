/**
 * The app's shared drum voice. One percussive hit: dum (low, round) for
 * unit starts, tak (high, dry) otherwise — used by the Rhythm Clock and
 * the confusion map's listening bench, so a meter sounds the same
 * wherever it is heard.
 */
export const hit = (ctx: AudioContext, time: number, isDum: boolean): void => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  if (isDum) {
    osc.frequency.setValueAtTime(165, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.12);
    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.17);
    osc.start(time);
    osc.stop(time + 0.19);
  } else {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
    osc.start(time);
    osc.stop(time + 0.07);
  }
};

/** Construct-or-reuse an AudioContext across vendor prefixes. */
export const ensureAudioContext = (existing: AudioContext | null): AudioContext => {
  if (existing) return existing;
  type Win = typeof window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext!;
  return new Ctor();
};
