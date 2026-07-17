import React, { useMemo, useRef, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { CIRCLE_ROTATIONS, sequencePeriod, stabilizerOrder } from '../data/rotations';
import { Circle, Meter } from '../types';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import OrbitStabEquation from './OrbitStabEquation';
import GroupTheoryGloss from './GroupTheoryGloss';
import { useDrawProgress } from '../utils/animation';
import {
  easeOutBack,
  laggedProgress,
  rushFrom,
  smooth,
  thereAndBack,
  window as subWindow,
} from '../utils/rate';
// Shared circle geometry — the same helpers the explorables draw with, so
// a dot's colour and a chord's endpoints are computed once for the app.
import { polar, unitColor, uniqueChords } from './explore/geometry';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface MathViewProps {
  onBackToHub: () => void;
}

/**
 * Moraic digits of one atomic unit: '/' (moving letter) = 1, '0'
 * (quiescent letter) = 0. Units are stored RTL-style ('0//' = watid),
 * so reverse to read left-to-right as digits.
 */
const unitDigits = (unit: string): string =>
  unit
    .split('')
    .reverse()
    .map((c) => (c === '/' ? '1' : '0'))
    .join('');

const rotationPattern = (circle: Circle, offset: number): string => {
  const info = CIRCLE_ROTATIONS[circle.id][offset];
  if (info.kind === 'duplicate') return '';
  const instructions =
    info.kind === 'meter'
      ? circle.meters.find((m) => m.id === info.meterId)!.parsingInstructions
      : info.parsingInstructions;
  const probe: Meter = {
    id: `probe-${circle.id}-${offset}`,
    name: '',
    nameTransliteration: '',
    description: '',
    circleId: circle.id,
    startOffset: offset,
    parsingInstructions: instructions,
    patternTransliteration: '',
    historicalUsage: '',
    famousExamples: [],
  };
  // For used meters, parse via the real meter to hit circle-3's special case
  if (info.kind === 'meter') {
    const meter = circle.meters.find((m) => m.id === info.meterId)!;
    return parseMeterPattern(meter, circle)
      .map((t) => t.merged)
      .join(' ');
  }
  return parseMeterPattern(probe, circle)
    .map((t) => t.merged)
    .join(' ');
};

/** Cn rendered as C with a real subscript. */
const GroupSymbol: React.FC<{ order: number }> = ({ order }) => (
  <span className="font-inter" dir="ltr">
    C<sub>{order}</sub>
  </span>
);

/**
 * The stabilizer made visible ON the circle itself: the ring carries the
 * circle's own units — glyphs, colors, reading order — and the symmetry
 * is performed, not asserted. A ghost copy of the units lifts off,
 * rotates by p positions, and lands with every unit on an identical
 * unit; the chords then write themselves as the trails of that landing
 * (each in its unit's color — both endpoints are the same unit, which
 * is the whole claim). The star polygon {n/p} falls out as the record.
 *
 * The trivial stabilizer gets the counter-demonstration: the ghost tries
 * the smallest turn, lands wrong, the failed positions keep their ✕
 * marks, and C₁ names the result.
 *
 * One timeline in Manim's grammar (Succession of acts): dots+labels land
 * → ghost lifts and rotates → verdict flash → ghost departs → chords
 * Write / ✕ marks settle → fundamental-domain arc / C₁. Remount (the
 * host's key) to replay.
 */
const SymmetryStar: React.FC<{
  circle: Circle;
  period: number;
  /** True while the fundamental-domain arc is being explained. */
  arcActive?: boolean;
  onArcHover?: (over: boolean) => void;
}> = ({ circle, period, arcActive = false, onArcHover }) => {
  const { t } = useLanguage();
  const seq = circle.atomicSequence;
  const n = seq.length;
  const step = 360 / n;
  const R = 82;
  const LABEL_R = 56;
  const trivial = period >= n;
  // The rotation the scene demonstrates: the stabilizer's generator — or,
  // when the stabilizer is trivial, the smallest turn, shown failing.
  const k = trivial ? 1 : period;
  const time = useDrawProgress(trivial ? 4000 : 4600);
  const tDots = subWindow(time, 0, trivial ? 0.17 : 0.15);
  const tGhostIn = subWindow(time, trivial ? 0.17 : 0.15, trivial ? 0.23 : 0.2);
  const tRot = subWindow(time, trivial ? 0.23 : 0.2, trivial ? 0.46 : 0.44);
  const tFlash = subWindow(time, trivial ? 0.46 : 0.44, trivial ? 0.6 : 0.56);
  const tGhostOut = subWindow(time, trivial ? 0.58 : 0.54, trivial ? 0.7 : 0.62);
  const tChords = trivial ? 0 : subWindow(time, 0.58, 0.87);
  const tDomain = subWindow(time, 0.85, 1);
  const tC1 = trivial ? subWindow(time, 0.7, 0.88) : 0;

  const ghostOpacity = smooth(tGhostIn) * (1 - smooth(tGhostOut));
  // rotate(−k·step) sends the dot at position i to position i+k — the
  // ghost travels in the reading direction (CCW, like the dial).
  const ghostAngle = -k * step * smooth(tRot);
  const flash = thereAndBack(tFlash);

  const pos = (i: number) => polar(i, n, R);
  // Each chord once: for p = n/2 (circle 1) i→i+p and i+p→i are one line.
  const chords = trivial ? [] : uniqueChords(n, k);

  // Trivial only — where the landing fails: position b receives ghost dot
  // b−k, so a mismatch is a unit set down on an unlike unit. The ✕ marks
  // flash with the verdict, then settle in as the lasting evidence.
  const mismatches = trivial
    ? seq.map((_, b) => b).filter((b) => seq[(b - k + n) % n] !== seq[b])
    : [];
  const missOpacity = Math.max(0.8 * flash, 0.5 * smooth(subWindow(time, 0.64, 0.8)));

  // While a chord writes itself its endpoint dots swell: this unit landed
  // on that one.
  const dotPulse = new Array<number>(n).fill(0);
  chords.forEach(([i, j], c) => {
    const w = thereAndBack(laggedProgress(tChords, c, chords.length, 0.45));
    if (w > dotPulse[i]) dotPulse[i] = w;
    if (w > dotPulse[j]) dotPulse[j] = w;
  });

  // Fundamental domain arc: spans dots 0 .. period-1 (only meaningful when p < n)
  const domain = (() => {
    if (period >= n) return null;
    const r = R + 16;
    const a0 = ((-90 + step * 0.35) * Math.PI) / 180;
    const a1 = ((-90 - (period - 1) * step - step * 0.35) * Math.PI) / 180;
    const large = (period - 0.3) * step > 180 ? 1 : 0;
    return `M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 ${large} 0 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`;
  })();

  return (
    <svg viewBox="-115 -115 230 230" className="w-52 h-52 mx-auto" role="img" aria-hidden="true">
      <circle r={R} fill="none" stroke="rgba(216,185,120,0.25)" strokeWidth="1" />
      {domain && (
        // Sweeps in last: pathLength normalizes the dash to 0…1 regardless
        // of the arc's real length.
        <path
          d={domain}
          fill="none"
          stroke={circle.visualTheme.primaryColor}
          strokeOpacity={arcActive ? 0.95 : 0.55}
          strokeWidth={arcActive ? 5.5 : 4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - rushFrom(tDomain)}
          style={{ transition: 'stroke-width 180ms ease-out, stroke-opacity 180ms ease-out' }}
        />
      )}
      {chords.map(([i, j], c) => {
        const a = pos(i);
        const b = pos(j);
        // Each chord Writes itself along its own length (LaggedStart), in
        // its unit's color — both of its endpoints are that same unit.
        const p = smooth(laggedProgress(tChords, c, chords.length, 0.45));
        return (
          <line
            key={`chord-${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={unitColor(seq[i], circle)}
            strokeOpacity="0.55"
            strokeWidth="1.4"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
      {/* Trivial only: the positions where the attempted turn set a unit
          down on an unlike unit — the reason there is no symmetry. */}
      {mismatches.map((b) => {
        const { x, y } = polar(b, n, R + 15);
        return (
          <g key={`miss-${b}`} opacity={missOpacity} stroke="#9CA3AF" strokeWidth="1.5">
            <line x1={x - 3.2} y1={y - 3.2} x2={x + 3.2} y2={y + 3.2} />
            <line x1={x - 3.2} y1={y + 3.2} x2={x + 3.2} y2={y - 3.2} />
          </g>
        );
      })}
      {seq.map((unit, i) => {
        const { x, y } = pos(i);
        // Dots land with an overshoot, one after another.
        const p = easeOutBack(laggedProgress(tDots, i, n, 0.5));
        // While the arc is explained, ring the very units it spans and fade
        // the rest: the arc's claim ("the first p units") becomes something
        // you can count off the drawing.
        const inDomain = i < period;
        // Recede a little while the ghost performs, swell when your chord
        // arrives.
        const fade = (arcActive && !inDomain ? 0.3 : 1) * (1 - 0.35 * ghostOpacity);
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={7 * p * (1 + 0.22 * dotPulse[i])}
            fill={unitColor(unit, circle)}
            fillOpacity={fade}
            stroke={arcActive && inDomain ? circle.visualTheme.primaryColor : 'rgba(13,18,32,0.9)'}
            strokeWidth="2"
            style={{ transition: 'fill-opacity 180ms ease-out, stroke 180ms ease-out' }}
          />
        );
      })}
      {/* The units themselves, inside the rim — the same glyphs, colors and
          reading order as the dial, so this ring IS the selected circle. */}
      {seq.map((unit, i) => {
        const { x, y } = polar(i, n, LABEL_R);
        const p = easeOutBack(laggedProgress(tDots, i, n, 0.5));
        const inDomain = i < period;
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8.5"
            fontWeight="bold"
            fill={unitColor(unit, circle)}
            opacity={0.9 * p * (arcActive && !inDomain ? 0.35 : 1)}
            className="font-mono select-none"
            // Prosodic symbols are written RTL like the script, so the raw
            // string ('0//' = watid) shown in storage order IS the classical
            // appearance: slashes to the right, read from the right. The
            // bidi override pins that order in both language modes — the
            // glyphs are direction-neutral and would otherwise flip with
            // the page.
            style={{
              transition: 'opacity 180ms ease-out',
              direction: 'ltr',
              unicodeBidi: 'bidi-override',
            }}
          >
            {unit}
          </text>
        );
      })}
      {/* On a successful landing every dot gets a brief gold halo: each
          unit has been set down on its own kind. */}
      {!trivial &&
        flash > 0.01 &&
        seq.map((_, i) => {
          const { x, y } = pos(i);
          return (
            <circle
              key={`halo-${i}`}
              cx={x}
              cy={y}
              r={11}
              fill="none"
              stroke="var(--gold-bright, #E9C87E)"
              strokeWidth="1.5"
              opacity={0.55 * flash}
            />
          );
        })}
      {/* The ghost: a lifted copy of the very same units, performing the
          rotation. SVG's transform attribute pivots on the viewBox origin
          — the hub — by default. */}
      {ghostOpacity > 0.01 && (
        <g transform={`rotate(${ghostAngle})`} opacity={ghostOpacity}>
          {seq.map((unit, i) => {
            const { x, y } = pos(i);
            return (
              <circle
                key={`ghost-${i}`}
                cx={x}
                cy={y}
                r="4.5"
                fill={unitColor(unit, circle)}
                stroke={
                  !trivial && flash > 0.05
                    ? 'var(--gold-bright, #E9C87E)'
                    : 'rgba(255,255,255,0.8)'
                }
                strokeWidth="1.2"
              />
            );
          })}
        </g>
      )}
      {/* The verdict of the landing. */}
      {flash > 0.01 && (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="15"
          fontWeight="bold"
          fill={trivial ? '#9CA3AF' : 'var(--gold-bright, #E9C87E)'}
          className="font-amiri"
          opacity={flash}
        >
          {trivial ? t.math.symNoMatch : t.math.symIdentical}
        </text>
      )}
      {/* A trivial stabilizer has no chords at all. Name it in the middle
          so the empty ring reads as the answer, not a failed drawing. */}
      {trivial && (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="26"
          fontWeight="bold"
          fill="rgba(216,185,120,0.5)"
          className="font-inter"
          opacity={smooth(tC1)}
        >
          C₁
        </text>
      )}
      {/* Hit target for the arc, last so nothing sits over it. The arc is a
          4px stroke at r=98 and the dots reach r=89, so a 16px-wide grab
          band widens it to the pointer without stealing their space.
          Mouse only: a touch pointer is destroyed on lift, so pointerleave
          would follow pointerenter within the same tap and merely flash the
          tooltip. Touch gets at it through the legend button instead. */}
      {domain && (
        <path
          d={domain}
          fill="none"
          stroke="transparent"
          strokeWidth="16"
          strokeLinecap="round"
          className="cursor-help"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') onArcHover?.(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') onArcHover?.(false);
          }}
        />
      )}
    </svg>
  );
};

const MathView: React.FC<MathViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();
  const [circleId, setCircleId] = useState(ALL_CIRCLES[0].id);
  const [starRun, setStarRun] = useState(0);
  const [domainTip, setDomainTip] = useState(false);
  /** What opened the arc tooltip last — a tap must not be read as a hover. */
  const pointerKind = useRef<string>('mouse');
  const circle = ALL_CIRCLES.find((c) => c.id === circleId)!;

  const period = useMemo(() => sequencePeriod(circle.atomicSequence), [circle]);
  const stabilizer = useMemo(() => stabilizerOrder(circle.atomicSequence), [circle]);
  const rotations = CIRCLE_ROTATIONS[circle.id];
  const usedCount = rotations.filter((r) => r.kind === 'meter').length;
  const muhmalCount = rotations.filter((r) => r.kind === 'muhmal').length;
  const total = circle.atomicSequence.length;

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.math.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold heading-display text-center mb-2">
        {t.math.title}
      </h1>
      <OrnateDivider className="mb-3" />
      <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6">
        {t.math.subtitle}
      </p>

      {/* Circle selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCircleId(c.id)}
            aria-current={c.id === circleId}
            className={`px-4 py-1.5 rounded-full border font-amiri text-sm transition-all duration-300 ${
              c.id === circleId
                ? 'text-gray-900 font-bold border-transparent'
                : 'text-gray-300 border-gold-soft hover:border-gold'
            }`}
            style={c.id === circleId ? { backgroundColor: c.visualTheme.primaryColor } : undefined}
          >
            {getCircleName(c, lang)}
          </button>
        ))}
      </div>

      {/* Group theory: the dense treatment, with its plain-language gloss
          alongside — the manuscript habit of a ḥāshiya in the margin.
          On narrow screens the gloss leads, so newcomers meet the
          everyday explanation before the notation.

          This section leads the view: the drawing star and the theorem are
          the payoff, so they open above the fold and the binary encoding
          follows as supporting detail. */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem] gap-4 mb-4 items-start">
        <div className="panel-engraved rounded-2xl p-5">
          <h3 className="text-lg font-bold text-amber-300 font-kufi mb-2 text-center">
            {t.math.groupTitle}
          </h3>
          {/* The star leads, on the reading-start side (right in RTL), so the
              drawing is in view the moment the panel is — no scrolling to
              find the payoff. The intro and the three terms sit beside it. */}
          <div className="grid md:grid-cols-[13rem_minmax(0,1fr)] gap-5 items-start mb-5">
            <div className="flex flex-col items-center">
              {/* This ring IS the selected circle — say so above it. */}
              <p
                className="text-center text-[11px] font-kufi mb-0.5"
                style={{ color: circle.visualTheme.primaryColor }}
              >
                {t.math.ringTitle(getCircleName(circle, lang))}
              </p>
              {/* The stabilizer performed on the circle's own units. Keyed so
                  the whole scene replays on circle change or on ↻. The arc's
                  legend sits directly under it; the tooltip hangs below both. */}
              <div className="relative w-52 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setStarRun((r) => r + 1)}
                  aria-label={t.math.replayStar}
                  title={t.math.replayStar}
                  className="absolute top-0 start-0 z-10 p-1 text-base leading-none text-gray-500
                             hover:text-amber-300 transition-colors"
                >
                  ↻
                </button>
                <SymmetryStar
                  key={`${circle.id}#${starRun}`}
                  circle={circle}
                  period={period}
                  arcActive={domainTip}
                  onArcHover={setDomainTip}
                />
                {/* What the colors are: the circle's own building blocks. */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1">
                  {Array.from(new Set(circle.atomicSequence)).map((u) => (
                    <span key={u} className="flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: unitColor(u, circle) }}
                      />
                      <span className="text-[10px] font-amiri text-gray-400">
                        {(t.math.units as Record<string, string>)[u] ?? u}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500" dir="ltr">
                        {u}
                      </span>
                    </span>
                  ))}
                </div>
                {/* The arc can only be hovered, and the svg is decorative — so
                    the legend below carries the same tooltip, giving keyboard
                    and touch a way in. Reaching either lights up the arc.

                    Three input modes, three triggers, each guarded so they
                    don't cancel each other out: a tap fires a compatibility
                    pointerenter, which would open the tooltip just in time for
                    the click to toggle it shut again — hence the pointerType
                    check. Likewise focus only opens it when focus-visible,
                    i.e. from the keyboard and not from the tap itself. */}
                {period < total && (
                  <button
                    type="button"
                    aria-describedby={domainTip ? 'domain-tip' : undefined}
                    onPointerDown={(e) => (pointerKind.current = e.pointerType)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') setDomainTip(true);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') setDomainTip(false);
                    }}
                    onFocus={(e) => {
                      if (e.currentTarget.matches(':focus-visible')) setDomainTip(true);
                    }}
                    onBlur={() => setDomainTip(false)}
                    onClick={() => {
                      if (pointerKind.current !== 'mouse') setDomainTip((v) => !v);
                    }}
                    className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-0.5 cursor-help
                               text-[11px] font-amiri leading-snug
                               hover:bg-gray-900/60 focus:outline-none focus-visible:ring-1
                               focus-visible:ring-amber-400/70 transition-colors"
                    style={{ color: circle.visualTheme.primaryColor }}
                  >
                    {/* a swatch of the arc itself, so the words have a referent */}
                    <span
                      aria-hidden="true"
                      className="w-4 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: circle.visualTheme.primaryColor, opacity: 0.75 }}
                    />
                    {t.math.fundamentalDomain(String(period), String(total))}
                    <span aria-hidden="true" className="opacity-60">
                      ⓘ
                    </span>
                  </button>
                )}
                {/* Hangs below the legend, tail pointing back up at it. Above
                    the ring would be the natural place — the arc lives at the
                    top — but only ~40px separate the ring from the panel
                    heading, so it would spill out of the panel. Width matches
                    the column, so it never spills sideways either.
                    pointer-events-none so it can overlay the caption without
                    stealing the hover that keeps it open. */}
                {period < total && domainTip && (
                  <div
                    role="tooltip"
                    id="domain-tip"
                    className="absolute z-20 left-1/2 -translate-x-1/2 top-[calc(100%+0.45rem)]
                               w-52 rounded-xl px-3 py-2 pointer-events-none
                               bg-gray-950/95 backdrop-blur-sm shadow-2xl animate-view-fade"
                    style={{ border: `1px solid ${circle.visualTheme.primaryColor}66` }}
                  >
                    <p
                      className="font-kufi text-[11px] mb-1"
                      style={{ color: circle.visualTheme.primaryColor }}
                    >
                      {t.math.domainTipTitle}
                    </p>
                    <p className="font-amiri text-[11px] leading-relaxed text-gray-300">
                      {t.math.domainTip(String(period), String(total), String(stabilizer))}
                    </p>
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 -top-[5px] -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-950"
                      style={{
                        borderInlineStart: `1px solid ${circle.visualTheme.primaryColor}66`,
                        borderBlockStart: `1px solid ${circle.visualTheme.primaryColor}66`,
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-gray-400 font-amiri mt-2 leading-relaxed">
                {stabilizer === 1
                  ? t.math.starTrivialCaption
                  : t.math.starCaption(String(period), String(total))}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 font-amiri mb-4 leading-relaxed">
                {t.math.groupIntro(String(total))}
              </p>

              {/* Acting group / stabilizer / orbit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-gray-900/40 rounded-xl p-3">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: circle.visualTheme.primaryColor }}
                  >
                    <GroupSymbol order={total} />
                  </div>
                  <div className="text-xs label-gold font-amiri mt-1">{t.math.actingGroup}</div>
                  <div className="text-xs text-gray-500 font-amiri">
                    {t.math.actingGroupDesc(String(total))}
                  </div>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-3">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: circle.visualTheme.primaryColor }}
                  >
                    <GroupSymbol order={stabilizer} />
                  </div>
                  <div className="text-xs label-gold font-amiri mt-1">{t.math.stabilizer}</div>
                  <div className="text-xs text-gray-500 font-amiri">
                    {stabilizer === 1
                      ? t.math.stabilizerTrivial
                      : t.math.stabilizerDesc(String(period))}
                  </div>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-3">
                  <div
                    className="text-2xl font-bold font-inter"
                    style={{ color: circle.visualTheme.primaryColor }}
                    dir="ltr"
                  >
                    {period}
                  </div>
                  <div className="text-xs label-gold font-amiri mt-1">{t.math.orbit}</div>
                  <div className="text-xs text-gray-500 font-amiri">{t.math.orbitDesc}</div>
                </div>
              </div>
            </div>
          </div>

          {/* The theorem keeps the full measure — it is the punchline */}
          <div className="bg-gray-900/50 border border-gold-soft rounded-xl p-4 text-center">
            <div className="text-xs label-gold font-amiri mb-2">{t.math.orbitStabilizerName}</div>
            <OrbitStabEquation
              n={total}
              orbit={period}
              stab={stabilizer}
              color={circle.visualTheme.primaryColor}
            />
            <div className="text-sm text-gray-400 font-amiri mt-2">
              {t.math.orbitStabilizerReading(String(period), String(stabilizer), String(total))}
            </div>
          </div>
        </div>

        <div className="order-first lg:order-none">
          <GroupTheoryGloss />
        </div>
      </div>

      {/* Binary lens */}
      <div className="panel-engraved rounded-2xl p-5 mb-4">
        <h3 className="text-sm label-gold font-amiri mb-3">{t.math.binaryLabel}</h3>
        <div className="flex flex-wrap gap-1.5 justify-center" dir="rtl">
          {circle.atomicSequence.map((unit, i) => (
            <span
              key={i}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gray-900/50 border border-gold-soft"
            >
              <span
                className="font-mono text-base tracking-widest"
                style={{ color: circle.visualTheme.primaryColor }}
                dir="ltr"
              >
                {unitDigits(unit)}
              </span>
              <span className="font-mono text-[10px] text-gray-500" dir="ltr">
                {unit.split('').reverse().join('')}
              </span>
            </span>
          ))}
        </div>

        {/* Symmetry facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 text-center">
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div
              className="text-2xl font-bold font-amiri"
              style={{ color: circle.visualTheme.primaryColor }}
            >
              {total}
            </div>
            <div className="text-xs text-gray-500 font-amiri">
              {t.math.unitsCount(String(total))}
            </div>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div
              className="text-2xl font-bold font-amiri"
              style={{ color: circle.visualTheme.primaryColor }}
            >
              {period}
            </div>
            <div className="text-xs text-gray-500 font-amiri">{t.math.periodLabel}</div>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div
              className="text-2xl font-bold font-amiri"
              style={{ color: circle.visualTheme.primaryColor }}
            >
              {period}
            </div>
            <div className="text-xs text-gray-500 font-amiri">
              {t.math.distinctLabel} {t.math.formula(String(usedCount), String(muhmalCount))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 font-amiri mt-4">
          {period < total
            ? t.math.symmetryNote(String(period), String(total))
            : t.math.noSymmetryNote}
        </p>
      </div>

      {/* Rotation table */}
      <div className="panel-engraved rounded-2xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="label-gold font-amiri bg-gray-900/40">
              <th className="py-2.5 px-4 font-normal">{t.math.tableOffset}</th>
              <th className="py-2.5 px-4 font-normal">{t.math.tablePattern}</th>
              <th className="py-2.5 px-4 font-normal">{t.math.tableStatus}</th>
            </tr>
          </thead>
          <tbody>
            {rotations.map((info, offset) => {
              const isDup = info.kind === 'duplicate';
              return (
                <tr
                  key={offset}
                  className={`border-t border-gold-soft ${isDup ? 'opacity-40' : ''}`}
                >
                  <td className="py-2 px-4 text-center font-mono text-gray-400">{offset}</td>
                  <td className="py-2 px-4 text-center font-amiri text-lg" dir="rtl">
                    {isDup ? (
                      '—'
                    ) : (
                      <span
                        style={{
                          color:
                            info.kind === 'meter' ? circle.visualTheme.primaryColor : '#9CA3AF',
                        }}
                      >
                        {rotationPattern(circle, offset)}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center font-amiri">
                    {info.kind === 'meter' && (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: circle.visualTheme.primaryColor }}
                        />
                        <span className="text-gray-200">
                          {getMeterName(
                            circle.meters.find((m) => m.id === info.meterId)!,
                            lang
                          )}
                        </span>
                      </span>
                    )}
                    {info.kind === 'muhmal' && (
                      <span className="text-gray-400 border border-dashed border-gray-600 rounded-full px-2.5 py-0.5 text-xs">
                        {(lang === 'ar' ? info.nameAr : info.nameEn) ?? t.math.statusMuhmal}
                      </span>
                    )}
                    {isDup && (
                      <span className="text-gray-500 text-xs">
                        {t.math.statusDuplicate(String(info.of))}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Symmetry across all five circles */}
      <div className="panel-engraved rounded-2xl overflow-hidden mb-4">
        <h3 className="text-base font-bold text-amber-300 font-kufi text-center pt-4 pb-1">
          {t.math.crossTableTitle}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="label-gold font-amiri bg-gray-900/40">
              <th className="py-2 px-3 font-normal">{t.math.thCircle}</th>
              <th className="py-2 px-3 font-normal">{t.math.thUnits}</th>
              <th className="py-2 px-3 font-normal">{t.math.thStab}</th>
              <th className="py-2 px-3 font-normal">{t.math.thOrbit}</th>
              <th className="py-2 px-3 font-normal">{t.math.thMeters}</th>
            </tr>
          </thead>
          <tbody>
            {ALL_CIRCLES.map((c) => {
              const cn = c.atomicSequence.length;
              const cOrbit = sequencePeriod(c.atomicSequence);
              const cStab = stabilizerOrder(c.atomicSequence);
              const isSelected = c.id === circleId;
              return (
                <tr
                  key={c.id}
                  className={`border-t border-gold-soft cursor-pointer transition-colors ${isSelected ? 'bg-gray-900/50' : 'hover:bg-gray-900/30'}`}
                  onClick={() => setCircleId(c.id)}
                >
                  <td
                    className="py-2 px-3 text-center font-amiri"
                    style={{ color: c.visualTheme.primaryColor }}
                  >
                    {getCircleName(c, lang)}
                  </td>
                  <td className="py-2 px-3 text-center font-inter text-gray-300" dir="ltr">
                    {cn}
                  </td>
                  <td className="py-2 px-3 text-center text-gray-300">
                    <GroupSymbol order={cStab} />
                  </td>
                  <td className="py-2 px-3 text-center font-inter text-gray-300" dir="ltr">
                    {cOrbit}
                  </td>
                  <td className="py-2 px-3 text-center font-inter text-gray-300" dir="ltr">
                    {c.meters.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-sm text-gray-400 font-amiri text-center px-5 py-4">
          {t.math.inverseLaw}
        </p>
      </div>

      <p className="text-center text-amber-200/80 font-amiri text-sm bg-amber-400/5 border border-amber-500/20 rounded-2xl p-4">
        {t.math.grandTotal}
      </p>
    </div>
  );
};

export default MathView;
