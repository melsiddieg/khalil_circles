import React, { useMemo, useState } from 'react';
import { Circle } from '../../types';
import { sequencePeriod } from '../../data/rotations';
import { polar, gcd, rotationMatches, chordCycles, unitColor } from './geometry';
import { useLanguage } from '../../i18n/LanguageContext';

const R = 96;

/** Distinct stroke treatments for chord cycles, alternating for legibility. */
const CYCLE_STROKES = ['rgba(216,185,120,0.75)', 'rgba(45,212,191,0.55)', 'rgba(233,200,126,0.45)'];

const DivisorSpiral: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t } = useLanguage();
  const seq = circle.atomicSequence;
  const n = seq.length;
  const [k, setK] = useState(1);

  // Reset k when the circle shrinks below it
  const kSafe = Math.min(k, n - 1);

  const cycles = useMemo(() => chordCycles(n, kSafe), [n, kSafe]);
  const matches = rotationMatches(seq, kSafe);
  const period = sequencePeriod(seq);
  const stabilizerSet = useMemo(
    () => Array.from({ length: n }, (_, i) => i).filter((i) => i !== 0 && i % period === 0),
    [n, period]
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* The ring with candidate chords */}
        <svg viewBox="-120 -120 240 240" className="w-64 h-64 shrink-0" role="img" aria-label={t.explore.spiralTitle}>
          <circle r={R} fill="none" stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))" strokeWidth="1" />
          {cycles.map((cycle, ci) =>
            cycle.map((i, j) => {
              const a = polar(i, n, R);
              const b = polar(cycle[(j + 1) % cycle.length], n, R);
              return (
                <line
                  key={`${ci}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={CYCLE_STROKES[ci % CYCLE_STROKES.length]}
                  strokeWidth="1.4"
                  className="transition-all duration-300"
                />
              );
            })
          )}
          {seq.map((unit, i) => {
            const { x, y } = polar(i, n, R);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="8"
                fill={unitColor(unit, circle)}
                stroke="rgba(13,18,32,0.9)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Controls + readouts */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm label-gold font-amiri">
              {t.explore.spiralK}: <b className="font-inter" dir="ltr">{kSafe}</b>
            </span>
            <input
              type="range"
              min={1}
              max={n - 1}
              value={kSafe}
              onChange={(e) => setK(Number(e.target.value))}
              dir="ltr"
              className="accent-amber-400 cursor-pointer"
            />
          </label>

          <div className="text-sm text-gray-400 font-amiri" dir="auto">
            {t.explore.spiralCycles(String(gcd(n, kSafe)), String(n / gcd(n, kSafe)))}
          </div>

          {/* Match lamp */}
          <div
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 ${
              matches
                ? 'border-amber-400/60 bg-amber-400/10'
                : 'border-gold-soft bg-gray-900/40'
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full shrink-0 transition-all duration-300 ${
                matches ? 'bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-gray-600'
              }`}
              aria-hidden="true"
            />
            <span className={`text-sm font-amiri ${matches ? 'text-amber-200' : 'text-gray-500'}`}>
              {matches ? t.explore.spiralLampOn : t.explore.spiralLampOff}
            </span>
          </div>

          {/* The stabilizer, clickable */}
          {stabilizerSet.length > 0 && (
            <div className="text-sm font-amiri text-gray-400">
              {t.explore.spiralStabSet}
              <span className="inline-flex gap-1.5 ms-2 align-middle">
                {stabilizerSet.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setK(s)}
                    className={`px-2 py-0.5 rounded-md border font-inter text-xs transition-colors ${
                      kSafe === s
                        ? 'border-amber-400/70 bg-amber-400/15 text-amber-200'
                        : 'border-gold-soft text-gray-300 hover:border-gold'
                    }`}
                    dir="ltr"
                  >
                    {s}
                  </button>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DivisorSpiral;
