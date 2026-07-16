import React, { useMemo, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { CIRCLE_ROTATIONS, sequencePeriod, stabilizerOrder } from '../data/rotations';
import { Circle, Meter } from '../types';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import OrbitStabEquation from './OrbitStabEquation';
import GroupTheoryGloss from './GroupTheoryGloss';
import { useDrawProgress } from '../utils/animation';
import { easeOutBack, laggedProgress, rushFrom, smooth, window as subWindow } from '../utils/rate';
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
 * The stabilizer subgroup made visible: n unit-dots on a ring, with a
 * gold chord from every dot i to dot i+p (p = the sequence period, the
 * stabilizer's generator). The chords trace the star polygon {n/p} —
 * for the trivial stabilizer (p = n) there are no chords at all.
 *
 * It draws itself in Manim's grammar (one timeline, three staged acts):
 * the dots land first with LaggedStart + easeOutBack, then each chord
 * Writes itself along its own length, then the fundamental-domain arc
 * sweeps in. Replays on every circle change (the host passes a key).
 */
const SymmetryStar: React.FC<{ circle: Circle; period: number }> = ({ circle, period }) => {
  const n = circle.atomicSequence.length;
  const step = 360 / n;
  const R = 82;
  // Paced to be watched, not just noticed: each chord takes ~330ms to
  // write and they start ~150ms apart, so the eye can follow the star
  // being constructed one chord at a time.
  const t = useDrawProgress(2800);
  // Acts: dots [0, .28], chords [.22, .82], domain arc [.78, 1]
  const tDots = subWindow(t, 0, 0.28);
  const tChords = subWindow(t, 0.22, 0.82);
  const tDomain = subWindow(t, 0.78, 1);
  const pos = (i: number) => polar(i, n, R);
  // Each chord once: for p = n/2 (circle 1) i→i+p and i+p→i are one line.
  const chords = period < n ? uniqueChords(n, period) : [];
  const trivial = period >= n;

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
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - rushFrom(tDomain)}
        />
      )}
      {chords.map(([i, j], c) => {
        const a = pos(i);
        const b = pos(j);
        // Each chord Writes itself along its own length (LaggedStart).
        const p = smooth(laggedProgress(tChords, c, chords.length, 0.45));
        return (
          <line
            key={`chord-${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(216,185,120,0.5)"
            strokeWidth="1.3"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
      {circle.atomicSequence.map((unit, i) => {
        const { x, y } = pos(i);
        // Dots land with an overshoot, one after another.
        const p = easeOutBack(laggedProgress(tDots, i, n, 0.5));
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={7 * p}
            fill={unitColor(unit, circle)}
            stroke="rgba(13,18,32,0.9)"
            strokeWidth="2"
          />
        );
      })}
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
          opacity={smooth(subWindow(t, 0.3, 0.7))}
        >
          C₁
        </text>
      )}
    </svg>
  );
};

const MathView: React.FC<MathViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();
  const [circleId, setCircleId] = useState(ALL_CIRCLES[0].id);
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
              {/* The stabilizer drawn: star polygon {n/p}. Keyed so the whole
                  drawing replays whenever the circle changes. */}
              <SymmetryStar key={circle.id} circle={circle} period={period} />
              <p className="text-center text-xs text-gray-400 font-amiri mt-2 leading-relaxed">
                {stabilizer === 1
                  ? t.math.starTrivialCaption
                  : t.math.starCaption(String(period), String(total))}
              </p>
              {period < total && (
                <p
                  className="text-center text-[11px] font-amiri mt-1 leading-snug"
                  style={{ color: circle.visualTheme.primaryColor }}
                >
                  {t.math.fundamentalDomain(String(period))}
                </p>
              )}
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
