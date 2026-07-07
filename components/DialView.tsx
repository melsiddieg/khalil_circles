import React, { useMemo, useRef, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { CIRCLE_ROTATIONS, RotationInfo, canonicalOffset } from '../data/rotations';
import { Circle, Meter, Tafila } from '../types';
import { ChevronLeftIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';
import { trackEvent } from '../utils/analytics';

interface DialViewProps {
  onBackToHub: () => void;
}

const RADIUS = 150;
const INNER_RADIUS = 75;
const MARKER_RADIUS = 205;

/** Parse the pattern produced by starting the circle at an arbitrary offset. */
const parseRotation = (circle: Circle, offset: number): { tafail: Tafila[]; info: RotationInfo } => {
  const rotations = CIRCLE_ROTATIONS[circle.id];
  const canonical = canonicalOffset(circle.id, offset);
  const info = rotations[canonical];

  if (info.kind === 'meter') {
    const meter = circle.meters.find((m) => m.id === info.meterId)!;
    return { tafail: parseMeterPattern(meter, circle), info: rotations[offset] };
  }

  // Neglected rotation: synthesize a meter-like probe with its instructions.
  const instructions = info.kind === 'muhmal' ? info.parsingInstructions : [];
  const probe: Meter = {
    id: `muhmal-${circle.id}-${canonical}`,
    name: '',
    nameTransliteration: '',
    description: '',
    circleId: circle.id,
    startOffset: canonical,
    parsingInstructions: instructions,
    patternTransliteration: '',
    historicalUsage: '',
    famousExamples: [],
  };
  return { tafail: parseMeterPattern(probe, circle), info: rotations[offset] };
};

const DialView: React.FC<DialViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();
  const [circleId, setCircleId] = useState(ALL_CIRCLES[0].id);
  const [offset, setOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ startAngle: number; startOffset: number } | null>(null);

  const circle = ALL_CIRCLES.find((c) => c.id === circleId)!;
  const totalUnits = circle.atomicSequence.length;
  const anglePerUnit = 360 / totalUnits;
  const rotations = CIRCLE_ROTATIONS[circle.id];

  const { tafail, info } = useMemo(() => parseRotation(circle, offset), [circle, offset]);
  const canonical = canonicalOffset(circle.id, offset);
  const canonicalInfo = rotations[canonical];

  const selectCircle = (id: string) => {
    setCircleId(id);
    setOffset(0);
  };

  const setOffsetTracked = (next: number) => {
    const wrapped = ((next % totalUnits) + totalUnits) % totalUnits;
    setOffset(wrapped);
    trackEvent('dial_rotate', { circle: circleId, offset: wrapped });
  };

  // Pointer-angle helpers for dragging
  const pointerAngle = (e: React.PointerEvent): number => {
    const rect = svgRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = { startAngle: pointerAngle(e), startOffset: offset };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const delta = pointerAngle(e) - dragState.current.startAngle;
    // Counter-clockwise drag advances the offset (matches CircularArud's CCW layout)
    const unitDelta = Math.round(delta / anglePerUnit);
    const next = ((dragState.current.startOffset + unitDelta) % totalUnits + totalUnits) % totalUnits;
    if (next !== offset) setOffset(next);
  };

  const onPointerUp = () => {
    if (dragState.current) {
      dragState.current = null;
      trackEvent('dial_rotate', { circle: circleId, offset });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOffsetTracked(offset + 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOffsetTracked(offset - 1);
    }
  };

  const rotation = offset * anglePerUnit;
  const reverse = (unit: string) => unit.split('').reverse().join('');

  // Status line for the current rotation
  const statusLine = (() => {
    if (canonicalInfo.kind === 'meter') {
      const meter = circle.meters.find((m) => m.id === canonicalInfo.meterId)!;
      return { label: t.dial.usedRotation, name: getMeterName(meter, lang), color: circle.visualTheme.primaryColor };
    }
    if (canonicalInfo.kind === 'muhmal') {
      const name = lang === 'ar' ? canonicalInfo.nameAr : canonicalInfo.nameEn;
      return { label: t.dial.muhmalRotation, name: name ?? t.dial.muhmalGeneric, color: '#9CA3AF' };
    }
    return { label: '', name: '', color: '#9CA3AF' };
  })();

  const isDuplicate = info.kind === 'duplicate';

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.dial.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold font-amiri text-center mb-2">
        {t.dial.title}
      </h1>
      <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6">{t.dial.subtitle}</p>

      {/* Circle selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCircle(c.id)}
            aria-current={c.id === circleId}
            className={`px-4 py-1.5 rounded-full border font-amiri text-sm transition-all duration-300 ${
              c.id === circleId
                ? 'text-gray-900 font-bold border-transparent'
                : 'text-gray-300 border-gray-700 hover:border-gray-500'
            }`}
            style={c.id === circleId ? { backgroundColor: c.visualTheme.primaryColor } : undefined}
          >
            {getCircleName(c, lang)}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500 font-amiri mb-2">{t.dial.dragHint}</p>

      {/* The dial */}
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width="460"
          height="460"
          viewBox="-230 -230 460 460"
          className="cursor-grab active:cursor-grabbing touch-none select-none max-w-full h-auto"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="slider"
          aria-label={t.dial.offsetLabel}
          aria-valuemin={0}
          aria-valuemax={totalUnits - 1}
          aria-valuenow={offset}
        >
          {/* START pointer (fixed at top) */}
          <g>
            <path d="M0,-222 L-7,-208 L7,-208 Z" fill="#FBBF24" />
          </g>

          {/* Rotating unit ring */}
          <g
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {circle.atomicSequence.map((unit, index) => {
              const start = -90 - index * anglePerUnit;
              const end = -90 - (index + 1) * anglePerUnit;
              const sRad = (start * Math.PI) / 180;
              const eRad = (end * Math.PI) / 180;
              const largeArc = anglePerUnit > 180 ? 1 : 0;
              const d = [
                `M ${Math.cos(sRad) * RADIUS} ${Math.sin(sRad) * RADIUS}`,
                `A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${Math.cos(eRad) * RADIUS} ${Math.sin(eRad) * RADIUS}`,
                `L ${Math.cos(eRad) * INNER_RADIUS} ${Math.sin(eRad) * INNER_RADIUS}`,
                `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 1 ${Math.cos(sRad) * INNER_RADIUS} ${Math.sin(sRad) * INNER_RADIUS}`,
                'Z',
              ].join(' ');

              // Color by tafila group relative to current offset
              let rel = (index - offset) % totalUnits;
              if (rel < 0) rel += totalUnits;
              let fill = 'transparent';
              let acc = 0;
              const instructions =
                canonicalInfo.kind === 'meter'
                  ? circle.meters.find((m) => m.id === canonicalInfo.meterId)!.parsingInstructions
                  : canonicalInfo.kind === 'muhmal'
                    ? canonicalInfo.parsingInstructions
                    : [];
              for (let g = 0; g < instructions.length; g++) {
                if (rel >= acc && rel < acc + instructions[g]) {
                  fill = g % 2 === 0 ? circle.visualTheme.primaryColor : circle.visualTheme.accentColor;
                  break;
                }
                acc += instructions[g];
              }

              const mid = ((start - anglePerUnit / 2) * Math.PI) / 180;
              const labelR = (RADIUS + INNER_RADIUS) / 2;
              return (
                <g key={index}>
                  <path d={d} fill={fill} fillOpacity="0.3" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <text
                    x={Math.cos(mid) * labelR}
                    y={Math.sin(mid) * labelR}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="17"
                    fontWeight="bold"
                    className="font-mono pointer-events-none"
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      transform: `rotate(${start - anglePerUnit / 2 + 90}deg)`,
                    }}
                  >
                    {reverse(unit)}
                  </text>
                </g>
              );
            })}

            {/* Rotation markers: solid = meter, dashed ghost = muhmal, tick = duplicate */}
            {rotations.map((rot, idx) => {
              const angle = (-90 - idx * anglePerUnit) * (Math.PI / 180);
              const x = Math.cos(angle) * MARKER_RADIUS;
              const y = Math.sin(angle) * MARKER_RADIUS;
              const active = idx === offset;
              if (rot.kind === 'duplicate') {
                return (
                  <circle
                    key={idx}
                    cx={Math.cos(angle) * (RADIUS + 14)}
                    cy={Math.sin(angle) * (RADIUS + 14)}
                    r="3"
                    fill="rgba(156,163,175,0.35)"
                  />
                );
              }
              const isMeter = rot.kind === 'meter';
              const meter = isMeter ? circle.meters.find((m) => m.id === rot.meterId) : undefined;
              const label = isMeter
                ? getMeterName(meter!, lang)
                : (lang === 'ar' ? rot.nameAr : rot.nameEn) ?? (lang === 'ar' ? 'مهمل' : 'unused');
              return (
                <g key={idx} className="cursor-pointer" onClick={() => setOffsetTracked(idx)}>
                  <line
                    x1={Math.cos(angle) * RADIUS}
                    y1={Math.sin(angle) * RADIUS}
                    x2={Math.cos(angle) * (MARKER_RADIUS - 16)}
                    y2={Math.sin(angle) * (MARKER_RADIUS - 16)}
                    stroke={active ? 'white' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={active ? 2 : 1}
                    strokeDasharray={isMeter ? '0' : '4 3'}
                  />
                  <g transform={`rotate(${-rotation} ${x} ${y})`}>
                    <foreignObject x={x - 56} y={y - 13} width="112" height="26" className="overflow-visible">
                      <div
                        className={`flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-500 font-amiri ${
                          active
                            ? 'bg-white text-gray-900 shadow-lg scale-110'
                            : isMeter
                              ? 'bg-gray-800/90 text-gray-300 border border-gray-600'
                              : 'bg-gray-900/70 text-gray-500 border border-dashed border-gray-600'
                        }`}
                        style={{ direction: 'rtl' }}
                      >
                        {label}
                      </div>
                    </foreignObject>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Center readout */}
          <g className="pointer-events-none">
            <circle r={INNER_RADIUS - 8} fill="#111827" stroke="#374151" strokeWidth="3" />
            <text y="-12" textAnchor="middle" fill={statusLine.color} fontSize="19" fontWeight="bold" className="font-amiri">
              {statusLine.name}
            </text>
            <text y="12" textAnchor="middle" fill="#9CA3AF" fontSize="11" className="font-inter">
              {t.dial.offsetLabel} {offset}
            </text>
            <text y="30" textAnchor="middle" fill="#6B7280" fontSize="10" className="font-amiri">
              {statusLine.label}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 text-xs text-gray-500 font-amiri mt-1 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-gray-300 inline-block" /> {t.dial.legendUsed}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t border-dashed border-gray-400 inline-block" /> {t.dial.legendMuhmal}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" /> {t.dial.legendDuplicate}
        </span>
      </div>

      {/* Live parse readout */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5 text-center max-w-2xl mx-auto">
        {isDuplicate && (
          <p className="text-xs text-gray-500 font-amiri mb-2">
            {t.dial.duplicateOf(String(canonical))}
          </p>
        )}
        <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
          {tafail.map((tf, i) => (
            <span
              key={`${offset}-${i}`}
              className="font-amiri text-2xl px-3 py-1 rounded-lg border animate-view-fade"
              style={{
                animationDelay: `${i * 90}ms`,
                borderColor: `${statusLine.color}66`,
                color: statusLine.color,
                backgroundColor: `${statusLine.color}12`,
              }}
            >
              {tf.merged}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DialView;
