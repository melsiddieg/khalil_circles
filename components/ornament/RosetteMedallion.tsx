import React, { useId } from 'react';
import type { Circle } from '../../types';
import { unitColor } from '../explore/geometry';
import { mixHex, R, RAMP, ROSETTES } from './rosette';

/**
 * The hub card's ornament: a layered paper-cut shamsa generated from the
 * circle's own atomicSequence.
 *
 * Structure — TWO stacked SVGs, deliberately:
 *   .rosette-plate  everything that is static once the entrance finishes.
 *   .rosette-live   the two things that animate forever (the breathing bloom
 *                   and the enamel ring performing the stabilizer turn).
 * Rotating a <g> inside a big SVG repaints that whole SVG every frame. The
 * live layer holds ~n+1 elements, so its repaint is nothing, and its one
 * rotating group is promoted with will-change. Five composited layers total.
 *
 * The existing inscription <svg> stacks unchanged on top of both.
 */

/* ------------------------------------------------------------------ *
 * Palette. Bone, not ivory — five pure-ivory discs on #111827 read as
 * headlights and break the app's graphite/gold engraved language. The
 * outer band stays graphite so the card's silhouette still speaks
 * `panel-engraved`, and only the inner two thirds are luminous.
 * ------------------------------------------------------------------ */
const PAPER_LIT = '#F4E9D2';
const PAPER_MID = '#E4D3AE';
const PAPER_SHADE = '#BFA57A';
const GOLD_LIT = '#F2D89A';
const GOLD_MID = '#C09A52';
const GOLD_DEEP = '#8C6B2F';
const EDGE_DARK = 'rgba(58,40,18,0.55)';
const EDGE_LIGHT = 'rgba(255,250,238,0.5)';
const SHADOW = '#05070C';

/** Entrance beats, ms. Kept here so the CSS and the JSX agree in one place. */
const T = {
  ground: 60,
  tendril: 520,
  petal: 200,
  petalStep: 42,
  inner: 470,
  innerStep: 36,
  rim: 240,
  band: 820,
  pearls: 1000,
  centre: 1120,
  enamel: 1320,
} as const;

const css = (v: Record<string, string | number>) => v as React.CSSProperties;

interface Props {
  circle: Circle;
  /** Reduced motion or ?frozen=1: render the complete final frame, no motion. */
  still: boolean;
}

const RosetteMedallion: React.FC<Props> = ({ circle, still }) => {
  // React 19's useId emits «r0»; strip the guillemets so url(#…) stays tame.
  const uid = `ro${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const g = ROSETTES[circle.id];
  const { n, step, units } = g;
  const theme = circle.visualTheme;
  const [bg0, bg1] = theme.backgroundGradient;

  // The enamel ground: the circle's own colours, deepened and vignetted, so
  // it reads as enamel under cut paper rather than a flat sticker.
  const ground0 = mixHex(bg1, '#0A1020', 0.3);
  const ground1 = mixHex(bg0, '#070C18', 0.24);
  const ground2 = mixHex(bg0, '#04060E', 0.7);

  const id = (k: string) => `${uid}-${k}`;
  const url = (k: string) => `url(#${id(k)})`;
  const still0 = still ? ' is-still' : '';

  /** One petal ring: n wrapper <g>s carrying the resting rotation as an SVG
   *  attribute, each holding one <use> that only ever animates opacity and
   *  scale. Keeping the rotation OUT of the keyframes is the whole trick —
   *  a CSS transform completely overrides the SVG transform attribute, so a
   *  rotation living in keyframes has to be restated in every one of them
   *  (including the reduced-motion override), which is a permanent footgun. */
  const ring = (href: string, cls: string, t0: number, dt: number, phase = 0) =>
    Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`rotate(${-(i + phase) * step})`}>
        <use href={`#${href}`} className={cls} style={css({ '--d': t0 + i * dt })} />
      </g>
    ));

  return (
    <>
      {/* ---------------------------------------------------------- *
       * PLATE — static after the entrance.
       * `isolation: isolate` confines the key-light rect's soft-light
       * blend to this SVG; without it the rect blends with the page
       * backdrop and the card washes out.
       * ---------------------------------------------------------- */}
      <svg
        viewBox="-150 -150 300 300"
        className={`rosette-plate absolute inset-0 w-full h-full${still0}`}
        style={css({ isolation: 'isolate' })}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* userSpaceOnUse is MANDATORY. The objectBoundingBox default is
              resolved per-<use>, which gives every petal its own private
              light source and scrambles the ring. Because these are resolved
              in the referencing element's user space, each rotated <use>
              carries the gradient round with it — which is exactly the
              per-petal axial lighting we want: base in shade, tip lit. */}
          <linearGradient id={id('paper')} gradientUnits="userSpaceOnUse" x1={-10} y1={-R.petal0} x2={8} y2={-R.petal1}>
            <stop offset="0" stopColor={PAPER_SHADE} />
            <stop offset="0.42" stopColor={PAPER_MID} />
            <stop offset="1" stopColor={PAPER_LIT} />
          </linearGradient>
          <linearGradient id={id('gold')} gradientUnits="userSpaceOnUse" x1={-6} y1={-R.inner0} x2={5} y2={-R.inner1}>
            <stop offset="0" stopColor={GOLD_DEEP} />
            <stop offset="0.5" stopColor={GOLD_MID} />
            <stop offset="1" stopColor={GOLD_LIT} />
          </linearGradient>
          <radialGradient id={id('ground')} gradientUnits="userSpaceOnUse" cx={-34} cy={-46} r={200}>
            <stop offset="0" stopColor={ground0} />
            <stop offset="0.52" stopColor={ground1} />
            <stop offset="1" stopColor={ground2} />
          </radialGradient>
          <linearGradient id={id('band')} gradientUnits="userSpaceOnUse" x1={-120} y1={-130} x2={110} y2={140}>
            <stop offset="0" stopColor="#1B2739" />
            <stop offset="1" stopColor="#080D18" />
          </linearGradient>
          <linearGradient id={id('rim')} gradientUnits="userSpaceOnUse" x1={-120} y1={-130} x2={110} y2={140}>
            <stop offset="0" stopColor={GOLD_LIT} />
            <stop offset="0.45" stopColor={GOLD_MID} />
            <stop offset="1" stopColor={GOLD_DEEP} />
          </linearGradient>
          {/* One directional light for the entire card, applied above the
              whole stack and never rotated, so every sheet reads as lit from
              the upper left no matter what turns underneath it. */}
          <linearGradient id={id('key')} gradientUnits="userSpaceOnUse" x1={-150} y1={-150} x2={140} y2={150}>
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="0.46" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.34" />
          </linearGradient>
          {/* Laid-paper texture: two hairlines in a 7×7 tile. Deterministic,
              three nodes, and no feTurbulence — which is re-rasterized on
              every repaint in every engine. */}
          <pattern id={id('laid')} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(34)">
            <path d="M0,0V7M3.5,0V7" stroke="#ffffff" strokeWidth="0.55" strokeOpacity="0.55" />
          </pattern>
          {/* The scalloped silhouette, reused as the clip — so the medallion's
              outline is a multifoil, not a plain circle. */}
          <clipPath id={id('clip')}>
            <path d={g.ring.rim} />
          </clipPath>

          <g id={id('petal')}>
            <path d={g.def.petal} fillRule="evenodd" fill={url('paper')} stroke={EDGE_DARK} strokeWidth="0.7" />
            <path d={g.def.petalInset} fillRule="evenodd" fill="none" stroke={EDGE_LIGHT} strokeWidth="1" />
          </g>
          <g id={id('inner')}>
            <path d={g.def.inner} fill={url('gold')} stroke="rgba(48,32,10,0.5)" strokeWidth="0.6" />
            <path d={g.def.innerInset} fill="none" stroke="rgba(255,246,214,0.42)" strokeWidth="0.8" />
          </g>
        </defs>

        <g clipPath={url('clip')}>
          {/* 1 — enamel ground */}
          <circle r={R.ground} fill={url('ground')} className={`rs-fade${still0}`} style={css({ '--d': T.ground })} />

          {/* 2 — arabesque, lying on the ground between the petals. Filled
                  tapered ribbons on a log spiral: a 1px stroked spiral
                  aliases to mush at a 280px card. */}
          <path
            d={g.ring.tendril}
            fill={url('rim')}
            fillOpacity="0.85"
            className={`rs-ink${still0}`}
            style={css({ '--d': T.tendril })}
          />

          {/* 3 — cast shadows. Each plate is the SAME generator re-run
                  fatter, with the window shrunk by the same amount, so the
                  shadow spills outward past the silhouette AND inward into
                  every cut-out. A scale() gets the holes backwards. */}
          {RAMP.map((r, j) => (
            <g key={j} transform={`translate(0 ${r.dy})`} className={`rs-fade${still0}`} style={css({ '--d': T.petal })}>
              <path d={g.ring.petalShadow[j]} fillRule="evenodd" fill={SHADOW} fillOpacity={r.alpha} />
            </g>
          ))}

          {/* 4 — the cream sheet. The window is a true even-odd hole, so you
                  look through the paper at the enamel below. */}
          {ring(id('petal'), `rs-petal${still0}`, T.petal, T.petalStep)}

          {/* 5 — the interleaved gold sheet, half a step round */}
          {RAMP.map((r, j) => (
            <g key={j} transform={`translate(0 ${r.dy * 0.7})`} className={`rs-fade${still0}`} style={css({ '--d': T.inner })}>
              <path d={g.ring.innerShadow[j]} fill={SHADOW} fillOpacity={r.alpha * 0.85} />
            </g>
          ))}
          {ring(id('inner'), `rs-petal${still0}`, T.inner, T.innerStep, 0.5)}

          {/* 7 — the centre */}
          <g className={`rs-pop${still0}`} style={css({ '--d': T.centre })}>
            <circle r={R.boss} fill="#0B111E" stroke={GOLD_MID} strokeWidth="1" strokeOpacity="0.55" />
            {/* q-plate: |C_q| lobes — vesica, trefoil, quatrefoil… or, for a
                trivial stabilizer, a single teardrop aimed at the mafrūq. */}
            <path d={g.centre.qplate} fill={theme.primaryColor} fillOpacity="0.16" stroke={theme.primaryColor} strokeWidth="0.8" strokeOpacity="0.5" />
            {/* Circle 4 only: the C₃ it almost has. Seven chords hold; two
                fail, both touching the lone watid mafrūq. */}
            {g.centre.ghostOk && <path d={g.centre.ghostOk} fill="none" stroke={GOLD_LIT} strokeWidth="0.7" strokeOpacity="0.28" />}
            {g.centre.ghostBad && (
              <path d={g.centre.ghostBad} fill="none" stroke={theme.accentColor} strokeWidth="1.3" strokeOpacity="0.75" strokeDasharray="2.5 2.5" />
            )}
            {g.centre.star && <path d={g.centre.star} fill={GOLD_LIT} fillOpacity="0.3" stroke={GOLD_LIT} strokeWidth="1.6" strokeLinejoin="round" />}
            <circle r={R.stone} fill={theme.primaryColor} stroke="#1A1207" strokeWidth="0.9" />
            <circle r={R.stone * 0.42} cx={-1.4} cy={-1.6} fill="#ffffff" fillOpacity="0.34" />
          </g>

          {/* 8 — paper grain, then the single global key light */}
          <rect x={-150} y={-150} width={300} height={300} fill={url('laid')} opacity="0.05" style={css({ mixBlendMode: 'overlay' })} />
          <rect x={-150} y={-150} width={300} height={300} fill={url('key')} style={css({ mixBlendMode: 'soft-light' })} />

          {/* 9 — the epigraphic band, promoted to its own floating graphite
                  sheet with the biggest lift in the stack. That shadow is
                  what makes the words look carved into a separate plate, and
                  it keeps the dark backdrop CurvedText's stroke halo was
                  tuned against — so CurvedText itself needs no changes. */}
          <g className={`rs-fade${still0}`} style={css({ '--d': T.band })}>
            {RAMP.map((r, j) => (
              <path key={j} d={g.ring.band} fillRule="evenodd" fill={SHADOW} fillOpacity={r.alpha * 0.9} transform={`translate(0 ${r.dy * 1.7})`} />
            ))}
            <path d={g.ring.band} fillRule="evenodd" fill={url('band')} />
            <path d={g.ring.bandInner} fill="none" stroke={GOLD_MID} strokeWidth="0.9" strokeOpacity="0.55" />
            <circle r={R.bandOut} fill="none" stroke={GOLD_MID} strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Guilloché tick course: 4n perfectly aligned ticks from ONE
                element. pathLength renormalizes the circumference so the dash
                pattern divides it exactly — the same trick MathView uses. */}
            <circle
              r={R.ticks}
              fill="none"
              stroke={GOLD_MID}
              strokeWidth="2.6"
              strokeOpacity="0.4"
              pathLength={4 * n}
              strokeDasharray="1 3"
            />
          </g>

          {/* The pearl course sits ON the band and reads CIRCLE_ROTATIONS
              directly: a filled pearl for a canonized meter, a hollow ring for
              a مهمل, a dim dot for a duplicate. Across the hub that is exactly
              16 pearls and 5 rings — the app's headline statistic, engraved. */}
          <g className={`rs-fade${still0}`} style={css({ '--d': T.pearls })}>
            <path d={g.pearl.duplicate} fill={GOLD_DEEP} fillOpacity="0.6" />
            <path d={g.pearl.muhmal} fill="none" stroke={GOLD_LIT} strokeWidth="1" strokeOpacity="0.85" />
            <path d={g.pearl.meter} fill={GOLD_LIT} />
          </g>

          {/* 10 — the scalloped gold rim, as an annulus */}
          <path
            d={g.ring.rimBand}
            fillRule="evenodd"
            fill={url('rim')}
            fillOpacity="0.92"
            className={`rs-fade${still0}`}
            style={css({ '--d': T.rim })}
          />
        </g>

        {/* Outside the clip so the hairline is not shaved by its own path */}
        <path
          d={g.ring.rim}
          fill="none"
          stroke={GOLD_LIT}
          strokeWidth="1.4"
          strokeOpacity="0.75"
          pathLength={100}
          className={`rs-write${still0}`}
          style={css({ '--d': T.rim })}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* ---------------------------------------------------------- *
       * LIVE — the only two things that animate forever.
       * ---------------------------------------------------------- */}
      <svg
        viewBox="-150 -150 300 300"
        className={`rosette-live absolute inset-0 w-full h-full pointer-events-none${still0}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id={id('bloom')} gradientUnits="userSpaceOnUse" r={120}>
            <stop offset="0" stopColor={theme.primaryColor} stopOpacity="0.5" />
            <stop offset="0.55" stopColor={theme.primaryColor} stopOpacity="0.12" />
            <stop offset="1" stopColor={theme.primaryColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('cabo')} cx="0.34" cy="0.28" r="0.8">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.32" />
          </radialGradient>
          <clipPath id={id('clip2')}>
            <path d={g.ring.rim} />
          </clipPath>
        </defs>

        <g clipPath={url('clip2')}>
          <circle r={120} fill={url('bloom')} className={`rs-breathe${still0}`} />

          {/* The enamel inlay is the ONLY layer whose symmetry is C_(n/p)
              rather than C_n — beauty is carried by SHAPE symmetry, the
              stabilizer by COLOUR symmetry, and they are independent
              channels. Rotating the ring by −360·p/n carries cabochon i onto
              position i+p; seq[i] === seq[i+p], so the ornament performs its
              own symmetry and visibly LANDS ON ITSELF. That is also why the
              infinite loop has no seam: the end keyframe is pixel-identical
              to the start, by theorem. */}
          <g className={`rs-enamel${still0}`} style={css({ '--d': T.enamel })}>
            <g
              className={`${g.trivial ? 'rs-turn-fail' : 'rs-turn'}${still0}`}
              style={css({
                '--turn': `${g.turnDeg}deg`,
                '--seek': `${-step * 0.9}deg`,
                // Negative delay starts each card mid-cycle, so the five
                // never turn in unison.
                animationDelay: `${T.enamel - circle.order * 2600}ms`,
              })}
            >
              {g.cab.map((d, i) => (
                <g key={i}>
                  <path
                    d={d}
                    fill={unitColor(units[i], circle)}
                    // Circle 4's symmetry-breaker wears an ivory bezel, so the
                    // eye finds it immediately and reads it as the signature
                    // stone rather than a mistake.
                    stroke={i === g.mafruq ? '#FFF7E6' : 'rgba(26,18,7,0.7)'}
                    strokeWidth={i === g.mafruq ? 1.5 : 0.7}
                  />
                  <path d={d} fill={url('cabo')} />
                </g>
              ))}
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export default RosetteMedallion;
