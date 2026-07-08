import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle } from '../../types';
import { rotationReading } from '../../data/rotations';
import { unitColor } from './geometry';
import { useLanguage } from '../../i18n/LanguageContext';

const UNIT_W = 36;
const UNIT_H = 24;
const RING_R = 88;
const RING_CY = -30; // ring center sits above the tape
const TAPE_Y = 128;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t * t * (3 - 2 * t);

const UnrollingCircle: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t, lang } = useLanguage();
  const seq = circle.atomicSequence;
  const n = seq.length;
  const step = 360 / n;

  const [progress, setProgress] = useState(0); // 0 = coiled, 1 = flat tape
  const [cut, setCut] = useState(0);
  const target = useRef<number | null>(null);
  const raf = useRef(0);

  const reading = useMemo(() => rotationReading(circle, cut), [circle, cut]);
  const readingName =
    (lang === 'ar' ? reading.nameAr : reading.nameEn) ??
    (lang === 'ar' ? 'دورة مهملة' : 'a neglected rotation');

  // Animate toward target when playing
  useEffect(() => {
    const tick = () => {
      setProgress((p) => {
        const goal = target.current;
        if (goal === null) return p;
        const next = goal > p ? Math.min(goal, p + 0.014) : Math.max(goal, p - 0.014);
        if (next === goal) target.current = null;
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const tapeW = n * UNIT_W;
  const viewW = Math.max(tapeW + 50, 2 * (RING_R + 60));

  // Pose of unit i at the current progress: peel off in reading order.
  const pose = (i: number) => {
    const rel = (i - cut + n) % n;
    // Staggered local progress: the cut unit peels first
    const local = easeInOut(Math.min(1, Math.max(0, (progress * (n + 3) - rel * 0.85) / 3)));

    const deg = -90 - rel * step;
    const rad = (deg * Math.PI) / 180;
    const cx = Math.cos(rad) * RING_R;
    const cy = RING_CY + Math.sin(rad) * RING_R;
    const cRot = -rel * step; // tangent-upright on the ring

    // RTL tape: reading starts at the right edge
    const tx = tapeW / 2 - rel * UNIT_W - UNIT_W / 2;

    return {
      x: lerp(cx, tx, local),
      y: lerp(cy, TAPE_Y, local) - Math.sin(Math.PI * local) * 26,
      rot: lerp(cRot, 0, local),
      local,
    };
  };

  const showBands = progress > 0.96 && reading.parsingInstructions.length > 0;

  // Tafila band geometry along the tape (RTL)
  const bands = useMemo(
    () =>
      reading.parsingInstructions.map((size, g) => {
        const before = reading.parsingInstructions.slice(0, g).reduce((s, x) => s + x, 0);
        return {
          g,
          size,
          xRight: tapeW / 2 - before * UNIT_W,
          w: size * UNIT_W,
          name: reading.tafail[g],
        };
      }),
    [reading, tapeW]
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => (target.current = 1)}
          className="px-4 py-1.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900
                     font-bold font-amiri text-sm hover:shadow-amber-500/40 hover:shadow-lg active:scale-95 transition-all"
        >
          {t.explore.unrollPlay}
        </button>
        <button
          type="button"
          onClick={() => (target.current = 0)}
          className="px-4 py-1.5 rounded-full border border-gold-soft text-gray-300 font-amiri text-sm
                     hover:text-amber-300 hover:border-gold transition-all"
        >
          {t.explore.unrollRewind}
        </button>
        <label className="flex items-center gap-2">
          <span className="text-xs label-gold font-amiri">{t.explore.unrollSlider}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => {
              target.current = null;
              setProgress(Number(e.target.value));
            }}
            dir="ltr"
            className="accent-amber-400 cursor-pointer w-40"
          />
        </label>
      </div>
      <p className="text-center text-xs text-gray-500 font-amiri mb-1">{t.explore.unrollCutHint}</p>

      {/* The morphing scene */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`${-viewW / 2} -150 ${viewW} 330`}
          className="mx-auto h-80 max-w-full"
          role="img"
          aria-label={t.explore.unrollTitle}
        >
          {/* ring ghost fades as the tape forms */}
          <circle
            cx="0"
            cy={RING_CY}
            r={RING_R}
            fill="none"
            stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))"
            strokeWidth="1"
            opacity={1 - progress * 0.8}
          />
          {/* tape baseline grows in from the reading edge (right) */}
          <line
            x1={tapeW / 2}
            y1={TAPE_Y + UNIT_H / 2 + 4}
            x2={tapeW / 2 - tapeW * progress}
            y2={TAPE_Y + UNIT_H / 2 + 4}
            stroke="var(--gold-hairline, rgba(212,176,106,0.32))"
            strokeWidth="1.5"
          />

          {/* tafila bands under the finished tape */}
          {showBands &&
            bands.map(({ g, xRight, w, name }) => (
              <g key={g} className="animate-view-fade">
                <line
                  x1={xRight - w + 3}
                  y1={TAPE_Y + UNIT_H / 2 + 12}
                  x2={xRight - 3}
                  y2={TAPE_Y + UNIT_H / 2 + 12}
                  stroke={g % 2 === 0 ? circle.visualTheme.primaryColor : circle.visualTheme.accentColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x={xRight - w / 2}
                  y={TAPE_Y + UNIT_H / 2 + 30}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill={g % 2 === 0 ? circle.visualTheme.primaryColor : circle.visualTheme.accentColor}
                  className="font-amiri"
                >
                  {name}
                </text>
              </g>
            ))}

          {/* the units */}
          {seq.map((unit, i) => {
            const p = pose(i);
            const isCut = i === cut;
            return (
              <g
                key={i}
                transform={`translate(${p.x}, ${p.y}) rotate(${p.rot})`}
                onClick={() => setCut(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCut(i);
                  }
                }}
                className="cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={`${unit} — ${i}`}
              >
                <rect
                  x={-UNIT_W / 2 + 2}
                  y={-UNIT_H / 2}
                  width={UNIT_W - 4}
                  height={UNIT_H}
                  rx="5"
                  fill={`${unitColor(unit, circle)}26`}
                  stroke={isCut ? 'var(--gold-bright, #E9C87E)' : 'var(--gold-hairline-soft, rgba(212,176,106,0.16))'}
                  strokeWidth={isCut ? 2 : 1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="bold"
                  fill={unitColor(unit, circle)}
                  className="font-mono select-none"
                >
                  {unit.split('').reverse().join('')}
                </text>
              </g>
            );
          })}

          {/* cut marker on the ring while coiled */}
          {progress < 0.5 && (
            <path
              d={`M0,${RING_CY - RING_R - 22} L-6,${RING_CY - RING_R - 10} L6,${RING_CY - RING_R - 10} Z`}
              fill="var(--gold-bright, #E9C87E)"
              opacity={1 - progress * 2}
            />
          )}
        </svg>
      </div>

      {/* What this cut reads as */}
      <p className="text-center font-amiri text-base mt-1">
        <span className="text-gray-500">{t.explore.unrollResultLabel}</span>
        <span
          className="font-bold"
          style={{ color: reading.kind === 'meter' ? circle.visualTheme.primaryColor : '#9CA3AF' }}
        >
          {readingName}
        </span>
      </p>
    </div>
  );
};

export default UnrollingCircle;
