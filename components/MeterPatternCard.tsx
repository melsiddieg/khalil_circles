import React from 'react';
import { Circle, Meter } from '../types';
import { parseMeterPattern } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface MeterPatternCardProps {
  meter: Meter;
  circle: Circle;
  /** Merged tafila strings to highlight as shared with the other meter. */
  highlightFeet?: Set<string>;
}

/**
 * Compact pattern card: meter name, parent-circle badge, tafila chips, and
 * transliteration. Used by the comparison view (one card per side).
 */
const MeterPatternCard: React.FC<MeterPatternCardProps> = ({ meter, circle, highlightFeet }) => {
  const { lang } = useLanguage();
  const pattern = parseMeterPattern(meter, circle);

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full h-full"
      style={{ borderTopColor: circle.visualTheme.primaryColor, borderTopWidth: '3px' }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-2xl font-bold font-amiri" style={{ color: circle.visualTheme.primaryColor }}>
          {getMeterName(meter, lang)}
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-amiri shrink-0 bg-gray-900/50 px-2 py-1 rounded-full border border-gray-700/60">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: circle.visualTheme.primaryColor }}
            aria-hidden="true"
          />
          {getCircleName(circle, lang)}
        </span>
      </div>
      {meter.mnemonic && (
        <p className="text-gray-500 font-amiri text-xs mb-3 opacity-90" dir="rtl">
          {meter.mnemonic}
        </p>
      )}

      <div className="flex flex-wrap gap-2 justify-center my-4" dir="rtl">
        {pattern.map((tafila, i) => {
          const shared = highlightFeet?.has(tafila.merged);
          return (
            <span
              key={`${meter.id}-${i}`}
              className={`font-amiri text-xl px-3 py-1.5 rounded-lg border transition-colors ${
                shared
                  ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                  : 'border-gray-600/60 bg-gray-900/40 text-gray-300'
              }`}
            >
              {tafila.merged}
            </span>
          );
        })}
      </div>

      <p className="font-mono text-xs text-gray-500 text-center" dir="ltr">
        {meter.patternTransliteration}
      </p>
    </div>
  );
};

export default MeterPatternCard;
