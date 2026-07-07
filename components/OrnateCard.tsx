import React from 'react';
import { Circle } from '../types';
import { MEDALLIONS } from '../img/medallions';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface OrnateCardProps {
  circle: Circle;
  onCircleSelect: (circle: Circle) => void;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// Radii inside the 300×300 viewBox (center 0,0): the medallion's empty
// engraved band runs roughly r=60..108; curved inscriptions sit in it.
const TITLE_ARC_R = 94;
const METERS_ARC_R = 90;

/** Meter name without the generic بحر/al-Bahr prefix, for the bottom arc. */
const shortMeterName = (name: string): string =>
  name.replace(/^البحر /, '').replace(/^al-Bahr /i, '');

/** Rough advance width of a word (diacritics are zero-width). */
const wordWidth = (word: string, fontSize: number, factor: number): number => {
  const visible = word.match(/[^ً-ْٰ]/g)?.length ?? 1;
  return Math.max(1, visible) * fontSize * factor;
};

interface CurvedTextProps {
  words: string[];
  radius: number;
  fontSize: number;
  position: 'top' | 'bottom';
  rtl: boolean;
  fill: string;
  /** Font utility class; kufi runs wider than amiri, so pair with widthFactor. */
  fontClass?: string;
  widthFactor?: number;
}

/**
 * Curved inscription rendered as one straight <text> per word, each
 * rotated to its position on the arc. Chromium breaks Arabic glyph
 * joining on <textPath>, so shaping stays intact within each word and
 * only the word placement follows the curve — the classic approach on
 * engraved medallions.
 */
const CurvedText: React.FC<CurvedTextProps> = ({
  words,
  radius,
  fontSize,
  position,
  rtl,
  fill,
  fontClass = 'font-amiri',
  widthFactor = 0.46,
}) => {
  const gap = fontSize * 0.38;
  // Visual order along the arc, left → right
  const visual = rtl ? [...words].reverse() : words;
  const widths = visual.map((w) => wordWidth(w, fontSize, widthFactor));
  const total = widths.reduce((s, w) => s + w, 0) + gap * (visual.length - 1);
  const toDeg = (px: number) => (px / radius) * (180 / Math.PI);

  let cursor = -total / 2;
  return (
    <>
      {visual.map((word, i) => {
        const center = cursor + widths[i] / 2;
        cursor += widths[i] + gap;
        // Top: rotate(+a) carries the up-vector (0,-r) rightward. Bottom:
        // rotate(+a) carries (0,+r) leftward, so negate. Glyphs at y=+r
        // already face the center — readable coin-style, no flip needed.
        const angle = position === 'top' ? toDeg(center) : -toDeg(center);
        return (
          <g key={`${word}-${i}`} transform={`rotate(${angle})`}>
            <text
              x={0}
              y={position === 'top' ? -radius : radius}
              textAnchor="middle"
              fill={fill}
              fontSize={fontSize}
              fontWeight="bold"
              className={fontClass}
              style={{ paintOrder: 'stroke', stroke: 'rgba(18,11,4,0.7)', strokeWidth: fontSize * 0.22 }}
            >
              {word}
            </text>
          </g>
        );
      })}
    </>
  );
};

const OrnateCard: React.FC<OrnateCardProps> = ({ circle, onCircleSelect }) => {
  const { t, lang } = useLanguage();
  const rtl = lang === 'ar';

  const meterCount =
    lang === 'ar'
      ? ARABIC_NUMERALS[circle.meters.length] || String(circle.meters.length)
      : String(circle.meters.length);

  const titleWords = getCircleName(circle, lang).split(' ');
  const meterWords = circle.meters
    .map((m) => shortMeterName(getMeterName(m, lang)))
    .join(' · ')
    .split(' ');
  const metersFont = circle.meters.length > 4 ? 10.5 : 12.5;

  return (
    <div className="flex flex-col items-center relative z-10 w-full" style={{ maxWidth: '300px' }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={getCircleName(circle, lang)}
        onClick={() => onCircleSelect(circle)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCircleSelect(circle);
          }
        }}
        style={{ '--card-glow': `${circle.visualTheme.primaryColor}66` } as React.CSSProperties}
        className="group cursor-pointer relative w-full aspect-square rounded-full
                   transition-all duration-500 ease-out hover:scale-105
                   shadow-2xl hover:shadow-[0_0_60px_-10px_var(--card-glow)]
                   focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
      >
        {/* Engraved bronze medallion */}
        <img
          src={MEDALLIONS[circle.order]}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover rounded-full select-none"
        />

        {/* Soft theme halo behind the disc */}
        <div
          className="absolute -inset-2 rounded-full -z-10 opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-xl"
          style={{ background: `radial-gradient(circle, ${circle.visualTheme.primaryColor}33, transparent 70%)` }}
        />

        {/* Curved inscriptions */}
        <svg viewBox="-150 -150 300 300" className="absolute inset-0 w-full h-full pointer-events-none">
          <CurvedText
            words={titleWords}
            radius={TITLE_ARC_R}
            fontSize={16}
            position="top"
            rtl={rtl}
            fill="#E9C87E"
            fontClass="font-kufi"
            widthFactor={0.62}
          />
          <CurvedText
            words={meterWords}
            radius={METERS_ARC_R}
            fontSize={metersFont}
            position="bottom"
            rtl={rtl}
            fill={circle.visualTheme.primaryColor}
          />
        </svg>

        {/* Hover veil: description + count + CTA */}
        <div
          className="absolute inset-0 rounded-full bg-gray-950/90 backdrop-blur-md
                     opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
                     transition-all duration-300 flex flex-col items-center justify-center
                     text-center p-10 z-20 border border-white/10 overflow-hidden"
        >
          <div className="text-base text-gray-200 leading-relaxed font-amiri mb-3">
            {circle.description}
          </div>
          <div className="text-sm text-gray-400 font-amiri mb-3">
            {meterCount} {t.card.metersSuffix}
          </div>
          <div
            className="text-sm font-amiri font-bold animate-pulse"
            style={{ color: circle.visualTheme.primaryColor }}
          >
            {t.card.explore}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrnateCard;
