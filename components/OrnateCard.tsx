import React from 'react';
import { Circle } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleDescription, getCircleName, getMeterName } from '../i18n/names';
import { usePrefersReducedMotion } from '../utils/animation';
import RosetteMedallion from './ornament/RosetteMedallion';
import { METERS_ARC_R, TITLE_ARC_R, mixHex } from './ornament/rosette';

interface OrnateCardProps {
  circle: Circle;
  onCircleSelect: (circle: Circle) => void;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Screenshot determinism for scripts/verify-ink.mjs and render-chapter.mjs:
 * ?frozen=1 renders the complete final frame, on the same branch as reduced
 * motion. Read once at module load, so it is a constant, not render state.
 */
const FROZEN =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('frozen') === '1';

/**
 * Hover does NOT blank the medallion. A near-opaque veil hides the very
 * thing the card is for, and the rosette is the most expensive art on the
 * page. Instead the disc is lightly smoked — just enough to seat the text —
 * and the legend is set in a CARTOUCHE across the middle, the way a struck
 * medal carries its inscription. The petals, the pearl course, the gold rim
 * and both curved inscriptions all stay legible around it.
 */
const smoke = (c: string): string =>
  `radial-gradient(circle at 50% 46%, ${c}4d 0%, ${c}3d 52%, ${c}1a 78%, ${c}00 100%)`;

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
  // Arc-length start position of each word, from -total/2
  const starts = widths.map((_, i) =>
    widths.slice(0, i).reduce((s, w) => s + w + gap, -total / 2)
  );

  return (
    <>
      {visual.map((word, i) => {
        const center = starts[i] + widths[i] / 2;
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
  const still = usePrefersReducedMotion() || FROZEN;

  const meterCount =
    lang === 'ar'
      ? ARABIC_NUMERALS[circle.meters.length] || String(circle.meters.length)
      : String(circle.meters.length);

  // The cartouche is filled with the circle's own colour taken almost to
  // ink, so each card's legend still belongs to its enamel rather than
  // being a generic black plate.
  const deepEnamel = mixHex(circle.visualTheme.backgroundGradient[0], '#05070C', 0.82);

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
        // The count left the visible plaque (the meter names are already
        // inscribed on the rim), but it stays in the accessible name, where
        // a curved inscription is not much use.
        aria-label={`${getCircleName(circle, lang)} — ${meterCount} ${t.card.metersSuffix}`}
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
        {/* «الشمسة» — the generated paper-cut rosette: n petals for n atomic
            units, enamel coloured by unitColor so the inlay carries exactly
            this circle's stabilizer symmetry, and a centre star that is the
            same chord figure MathView draws. */}
        <RosetteMedallion circle={circle} still={still} />

        {/* Soft theme halo behind the disc */}
        <div
          className="absolute -inset-2 rounded-full -z-10 opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-xl"
          style={{ background: `radial-gradient(circle, ${circle.visualTheme.primaryColor}33, transparent 70%)` }}
        />

        {/* Curved inscriptions */}
        <svg
          viewBox="-150 -150 300 300"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          aria-hidden="true"
          focusable="false"
        >
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

        {/* Smoke: seats the text without hiding the ornament. */}
        <div
          aria-hidden="true"
          style={{ background: smoke(deepEnamel) }}
          className="absolute inset-0 rounded-full pointer-events-none
                     opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
                     transition-opacity duration-300 z-20"
        />

        {/* The cartouche. Sits across the middle third, so the petal tips,
            pearl course, gold rim and both inscriptions stay in view. */}
        <div
          className="absolute inset-x-[11%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center
                     text-center rounded-[1.5rem] px-4 py-3.5
                     opacity-0 translate-y-1 scale-[0.97]
                     group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                     group-focus-visible:opacity-100 group-focus-visible:translate-y-0
                     group-focus-visible:scale-100
                     transition-all duration-300 ease-out"
          style={{
            transform: 'translateY(-50%)',
            background: `linear-gradient(180deg, ${deepEnamel}f2, ${deepEnamel}fa)`,
            border: '1px solid rgba(212,176,106,0.55)',
            boxShadow:
              'inset 0 0 0 1px rgba(233,200,126,0.14), 0 14px 34px -14px rgba(0,0,0,0.85)',
          }}
        >
          <p
            className="text-gray-100 font-amiri text-[12.5px]"
            style={{ lineHeight: 1.55, textWrap: 'balance' }}
          >
            {getCircleDescription(circle, lang)}
          </p>

          {/* The app's ornate rule, echoing the medallion's epigraphic band */}
          <div className="flex items-center gap-2 w-full my-2" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-l from-amber-500/45 to-transparent" />
            <span className="text-amber-400/70 text-[9px]">✦</span>
            <span className="h-px flex-1 bg-gradient-to-r from-amber-500/45 to-transparent" />
          </div>

          <span
            className="font-amiri font-bold text-[13px] px-3 py-1 rounded-full
                       border transition-colors"
            style={{
              color: circle.visualTheme.primaryColor,
              borderColor: `${circle.visualTheme.primaryColor}66`,
              background: `${circle.visualTheme.primaryColor}14`,
            }}
          >
            {t.card.explore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrnateCard;
