import React, { useMemo, useState } from 'react';
import { Circle } from '../types';
import {
  isMirrorAxis,
  letterUnits,
  mirrorAxes,
  mirrorMismatches,
  moraicString,
  reflect,
} from '../data/chirality';
import { polar, unitColor } from './explore/geometry';
import { useLanguage } from '../i18n/LanguageContext';
import { ChevronLeftIcon } from './Icons';

/**
 * The mirror test — the half of the necklace's symmetry the circles leave out.
 *
 * Rotation is what al-Khalīl's circles record, and SymmetryStar performs it.
 * Reflection is the other generator of the necklace's natural group, and on a
 * rhythm circle it means playing the meter backwards. The reader drags a
 * mirror around the ring and watches each letter fall onto its partner; when
 * every pair agrees, the rhythm is its own retrograde.
 *
 * Deliberately drawn on letters rather than units. Reversal does not respect
 * unit boundaries — only watid mafrūq is its own reverse — which is why
 * دائرة المشتبه can look mirror-symmetric as an arrangement of units and
 * still fail here. That failure is the point of the panel.
 */

const R = 82;
const HIT_R = 104;

const MirrorTest: React.FC<{ circle: Circle; rotationStabilizer: number }> = ({
  circle,
  rotationStabilizer,
}) => {
  const { t, dir } = useLanguage();
  const seq = circle.atomicSequence;

  const { bits, units, axes, L } = useMemo(() => {
    const bits = moraicString(seq);
    return {
      bits,
      units: letterUnits(seq),
      axes: mirrorAxes(bits),
      L: bits.length,
    };
  }, [seq]);

  // Start one step off a real axis where there is one, so the panel opens on
  // a near miss and the match is something the reader arrives at.
  const [axis, setAxis] = useState(() => (axes.length ? (axes[0] + 1) % bits.length : 0));
  const [revealed, setRevealed] = useState(false);

  const matches = isMirrorAxis(bits, axis);
  const bad = useMemo(() => new Set(mirrorMismatches(bits, axis)), [bits, axis]);
  const chiral = axes.length === 0;

  const step = (delta: number) => setAxis((m) => ((m + delta) % L + L) % L);

  // The axis runs through position m/2 and its antipode: reflection sends i to
  // m − i, so the midpoint of every pair sits on that diameter.
  const axisDeg = -90 - (axis / 2) * (360 / L);
  const axisRad = (axisDeg * Math.PI) / 180;
  const ax = Math.cos(axisRad) * (R + 22);
  const ay = Math.sin(axisRad) * (R + 22);

  // Each reflected pair drawn once.
  const pairs = useMemo(() => {
    const seen = new Set<string>();
    const out: [number, number][] = [];
    for (let i = 0; i < L; i++) {
      const j = reflect(i, axis, L);
      if (i === j) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([i, j]);
    }
    return out;
  }, [axis, L]);

  const fixed = useMemo(
    () => Array.from({ length: L }, (_, i) => i).filter((i) => reflect(i, axis, L) === i),
    [axis, L]
  );

  const accent = circle.visualTheme.primaryColor;
  const gold = 'var(--gold-bright, #E9C87E)';

  return (
    <div className="panel-engraved rounded-2xl p-5 mb-4">
      <h3 className="text-lg font-bold text-amber-300 font-kufi mb-1 text-center">
        {t.math.mirrorTitle}
      </h3>
      <p className="text-sm text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-4 leading-relaxed">
        {t.math.mirrorIntro}
      </p>

      <div className="grid md:grid-cols-[13rem_minmax(0,1fr)] gap-5 items-start">
        <div className="flex flex-col items-center">
          <svg
            viewBox="-115 -115 230 230"
            className="w-52 h-52 mx-auto"
            role="img"
            aria-label={t.math.mirrorRingLabel}
          >
            <circle r={R} fill="none" stroke="rgba(216,185,120,0.25)" strokeWidth="1" />

            {/* The mirror. Gold once the rhythm reads the same through it. */}
            <line
              x1={ax}
              y1={ay}
              x2={-ax}
              y2={-ay}
              stroke={matches ? gold : 'rgba(156,163,175,0.55)'}
              strokeWidth={matches ? 2.4 : 1.6}
              strokeDasharray={matches ? undefined : '5 4'}
              style={{ transition: 'stroke 200ms ease-out, stroke-width 200ms ease-out' }}
            />

            {/* Tie-lines: every letter joined to the one the mirror sends it
                to. Agreement stays faint — twenty-odd chords at full strength
                bury the ring — while a disagreement is drawn to be seen. A
                clean landing therefore reads as calm, a failure as clutter. */}
            {pairs.map(([i, j]) => {
              const a = polar(i, L, R);
              const b = polar(j, L, R);
              const ok = bits[i] === bits[j];
              return (
                <line
                  key={`tie-${i}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={ok ? unitColor(seq[units[i]], circle) : '#9CA3AF'}
                  strokeOpacity={ok ? 0.18 : 0.85}
                  strokeWidth={ok ? 0.8 : 1.6}
                  strokeDasharray={ok ? undefined : '3 3'}
                />
              );
            })}

            {/* The letters. Moving is filled, quiescent is an open ring — the
                same bead vocabulary the ladder uses. */}
            {[...bits].map((sym, i) => {
              const { x, y } = polar(i, L, R);
              const c = unitColor(seq[units[i]], circle);
              const wrong = bad.has(i);
              return (
                <circle
                  key={`bit-${i}`}
                  cx={x}
                  cy={y}
                  r={sym === '1' ? 5 : 4.2}
                  fill={sym === '1' ? c : 'rgba(13,18,32,0.9)'}
                  stroke={wrong ? '#9CA3AF' : c}
                  strokeWidth={sym === '1' ? (wrong ? 2 : 0) : 1.8}
                  opacity={wrong ? 0.55 : 1}
                  style={{ transition: 'opacity 180ms ease-out, stroke 180ms ease-out' }}
                />
              );
            })}

            {/* Where the mirror meets the ring: the points a reflection holds
                still. These would be the boundary of the folded space. */}
            {matches &&
              fixed.map((i) => {
                const { x, y } = polar(i, L, R);
                return (
                  <circle
                    key={`fix-${i}`}
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke={gold}
                    strokeWidth="1.4"
                    opacity="0.8"
                  />
                );
              })}

            {/* Clicking the rim aims the mirror straight at that letter. */}
            {[...bits].map((_, i) => {
              const { x, y } = polar(i, L, HIT_R);
              return (
                <circle
                  key={`hit-${i}`}
                  cx={x}
                  cy={y}
                  r={9}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setAxis((2 * i) % L)}
                />
              );
            })}
          </svg>

          {/* The verdict sits under the ring, not in it: the mirror line and
              every tie-line converge on the centre, so a label there is
              unreadable exactly when it matters. */}
          <div
            className="mt-1 rounded-full px-3 py-0.5 font-amiri text-sm font-bold"
            style={{
              color: matches ? gold : '#9CA3AF',
              backgroundColor: matches ? 'rgba(233,200,126,0.12)' : 'transparent',
              border: `1px solid ${matches ? 'rgba(233,200,126,0.45)' : 'transparent'}`,
              transition: 'color 200ms ease-out, background-color 200ms ease-out',
            }}
            aria-live="polite"
          >
            {matches ? t.math.symIdentical : t.math.symNoMatch}
          </div>

          {/* Aim the mirror. The axis always advances with the reading order
              around the ring; only the chevrons mirror, since a flex row in
              RTL already puts the first child on the reading-start side. */}
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.math.mirrorPrev}
              className="p-1 text-gray-400 hover:text-amber-300 transition-colors"
            >
              <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
            <span className="font-inter text-xs text-gray-500 tabular-nums" dir="ltr">
              {t.math.mirrorAxis} {axis} / {L}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.math.mirrorNext}
              className="p-1 text-gray-400 hover:text-amber-300 transition-colors"
            >
              <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        <div>
          {/* The tally. Pips are the axes that work; clicking one aims there. */}
          <div className="bg-gray-900/40 rounded-xl p-3 mb-3">
            <div className="text-xs label-gold font-amiri mb-2">
              {t.math.mirrorAxesFound(String(axes.length), String(L))}
            </div>
            {chiral ? (
              <p className="text-sm text-gray-400 font-amiri leading-relaxed">
                {t.math.mirrorChiralNote}
              </p>
            ) : revealed ? (
              <div className="flex flex-wrap gap-1.5">
                {axes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAxis(m)}
                    aria-current={m === axis}
                    className="rounded-full border px-2.5 py-0.5 font-inter text-xs transition-colors"
                    dir="ltr"
                    style={{
                      color: m === axis ? '#111827' : accent,
                      borderColor: accent,
                      backgroundColor: m === axis ? accent : 'transparent',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="rounded-full border border-gold-soft px-3 py-1 font-amiri text-xs
                           text-gray-300 hover:text-amber-300 hover:border-gold transition-colors"
              >
                {t.math.mirrorReveal}
              </button>
            )}
          </div>

          {/* What the count means: the group is twice as big, or it is not. */}
          <div className="bg-gray-900/40 rounded-xl p-3 mb-3 text-center">
            <div className="font-inter text-xl font-bold" dir="ltr" style={{ color: accent }}>
              {chiral ? (
                <>
                  C<sub>{rotationStabilizer}</sub>
                </>
              ) : (
                <>
                  D<sub>{rotationStabilizer}</sub>
                </>
              )}
            </div>
            <div className="text-xs label-gold font-amiri mt-1">{t.math.mirrorGroupLabel}</div>
            <div className="text-xs text-gray-500 font-amiri mt-0.5">
              {chiral
                ? t.math.mirrorGroupChiral
                : t.math.mirrorGroupAchiral(
                    String(rotationStabilizer),
                    String(axes.length),
                    String(2 * rotationStabilizer)
                  )}
            </div>
          </div>

          <p className="text-sm text-gray-400 font-amiri leading-relaxed">
            {chiral ? t.math.mirrorLessonChiral : t.math.mirrorLesson}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MirrorTest;
