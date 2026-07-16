import React, { useMemo, useRef, useState } from 'react';
import { Circle } from '../../types';
import { sequencePeriod, stabilizerOrder } from '../../data/rotations';
import { polar, rotationMatches, unitColor, uniqueChords } from './geometry';
import { useLanguage } from '../../i18n/LanguageContext';

const R = 96;

const SymmetryMachine: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t } = useLanguage();
  const seq = circle.atomicSequence;
  const n = seq.length;
  const step = 360 / n;
  const period = sequencePeriod(seq);
  const stab = stabilizerOrder(seq);

  // Continuous ghost angle while dragging; snapped k when released.
  const [angle, setAngle] = useState(0);
  const [snapped, setSnapped] = useState(0); // current snapped rotation in units
  const [found, setFound] = useState<Set<number>>(() => new Set([0]));
  const [flash, setFlash] = useState<'match' | 'mismatch' | null>(null);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ startPointer: number; startAngle: number } | null>(null);

  // The nontrivial symmetries to discover (identity is free)
  const targets = useMemo(
    () => Array.from({ length: n }, (_, i) => i).filter((i) => i !== 0 && rotationMatches(seq, i)),
    [seq, n]
  );
  // NB: the host remounts this component with key={circle.id}, so all
  // game state resets naturally when the circle changes.
  const complete = targets.every((k) => found.has(k));

  const pointerAngle = (e: React.PointerEvent): number => {
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { startPointer: pointerAngle(e), startAngle: angle };
    setDragging(true);
    setFlash(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setAngle(drag.current.startAngle + (pointerAngle(e) - drag.current.startPointer));
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    // Snap to the nearest unit rotation. Screen-clockwise drag increases
    // the CSS angle; a rotation by +k units turns the ring by +k*step deg.
    const kRaw = Math.round(angle / step);
    const k = ((kRaw % n) + n) % n;
    setAngle(kRaw * step);
    setSnapped(k);
    if (rotationMatches(seq, k)) {
      setFlash('match');
      setFound((f) => new Set(f).add(k));
    } else {
      setFlash('mismatch');
    }
  };

  const nudge = (dir: 1 | -1) => {
    const kRaw = Math.round(angle / step) + dir;
    const k = ((kRaw % n) + n) % n;
    setAngle(kRaw * step);
    setSnapped(k);
    setFlash(rotationMatches(seq, k) ? 'match' : 'mismatch');
    if (rotationMatches(seq, k)) setFound((f) => new Set(f).add(k));
  };

  const isMatch = flash === 'match';

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      <svg
        ref={svgRef}
        viewBox="-120 -120 240 240"
        className="w-72 h-72 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="slider"
        aria-label={t.explore.symDragHint}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={snapped}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            nudge(1);
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            nudge(-1);
          }
        }}
      >
        <circle
          r={R}
          fill="none"
          stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))"
          strokeWidth="1"
        />

        {/* Found symmetries as gold ticks; the completed group draws its star */}
        {[...found].map((k) => {
          const { x, y } = polar(0, n, R + 14);
          return (
            <g key={k} transform={`rotate(${k * step})`}>
              <circle cx={x} cy={y} r="3.5" fill="var(--gold-bright, #E9C87E)" />
            </g>
          );
        })}
        {complete &&
          period < n &&
          uniqueChords(n, period).map(([i, j]) => {
            const a = polar(i, n, R);
            const b = polar(j, n, R);
            return (
              <line
                key={`star-${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(216,185,120,0.55)"
                strokeWidth="1.3"
                className="animate-view-fade"
              />
            );
          })}

        {/* Fixed ring */}
        {seq.map((unit, i) => {
          const { x, y } = polar(i, n, R);
          return (
            <circle
              key={`base-${i}`}
              cx={x}
              cy={y}
              r="9"
              fill={unitColor(unit, circle)}
              stroke="rgba(13,18,32,0.9)"
              strokeWidth="2"
            />
          );
        })}

        {/* Ghost ring — rotates with the drag */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transition: dragging ? 'none' : 'transform 250ms ease-out',
          }}
        >
          {seq.map((unit, i) => {
            const { x, y } = polar(i, n, R);
            return (
              <circle
                key={`ghost-${i}`}
                cx={x}
                cy={y}
                r="5"
                fill={unitColor(unit, circle)}
                stroke={isMatch ? 'var(--gold-bright, #E9C87E)' : 'rgba(255,255,255,0.75)'}
                strokeWidth={isMatch ? 2 : 1.2}
                opacity="0.95"
              />
            );
          })}
        </g>
      </svg>

      <div className="w-full max-w-xs flex flex-col gap-3 text-center md:text-start">
        <p className="text-xs text-gray-500 font-amiri">{t.explore.symDragHint}</p>

        <div className="text-sm font-amiri text-gray-300">
          {t.explore.symFound(String(found.size), String(stab))}
        </div>

        {flash && (
          <div
            className={`rounded-xl border px-3 py-2 text-sm font-amiri transition-all duration-300 ${
              isMatch
                ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
                : 'border-gold-soft bg-gray-900/40 text-gray-500'
            }`}
            role="status"
          >
            {isMatch ? t.explore.symMatch : t.explore.symMismatch}
          </div>
        )}

        {complete && stab > 1 && (
          <div className="rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2 text-sm font-amiri text-amber-200 animate-view-fade">
            {t.explore.symComplete(String(stab))}
          </div>
        )}
        {stab === 1 && (
          <div className="text-sm font-amiri text-gray-500 border border-dashed border-gold-soft rounded-xl px-3 py-2">
            {t.explore.symTrivialNote}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymmetryMachine;
