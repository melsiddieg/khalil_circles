import React, { useMemo, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { ChevronLeftIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';
import { trackEvent } from '../utils/analytics';
import { tokenizeArudScript } from '../utils/scansion';

interface ScanViewProps {
  onBackToHub: () => void;
}

const ScanView: React.FC<ScanViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();

  const options = useMemo(
    () => ALL_CIRCLES.flatMap((circle) => circle.meters.map((meter) => ({ circle, meter }))),
    []
  );
  // Default to al-Taweel: its shahid aligns perfectly with the template
  const [meterId, setMeterId] = useState('al-tawil');
  const [hemistich, setHemistich] = useState<0 | 1>(0);
  const [runId, setRunId] = useState(0);

  const { circle, meter } = options.find((o) => o.meter.id === meterId) ?? options[0];
  const example = meter.famousExamples[0];
  const pattern = useMemo(() => parseMeterPattern(meter, circle), [meter, circle]);

  // The unit layout of one hemistich: units grouped per tafila
  const groups = useMemo(() => {
    const result: { tafila: string; units: string[] }[] = [];
    let cursor = meter.startOffset;
    meter.parsingInstructions.forEach((size, g) => {
      const units: string[] = [];
      for (let i = 0; i < size; i++) {
        units.push(circle.atomicSequence[(cursor + i) % circle.atomicSequence.length]);
      }
      result.push({ tafila: pattern[g]?.merged ?? '', units });
      cursor += size;
    });
    return result;
  }, [meter, circle, pattern]);

  const expectedLetters = groups.reduce(
    (sum, g) => sum + g.units.reduce((s, u) => s + u.length, 0),
    0
  );

  const letters = useMemo(() => {
    if (!example?.arudScript) return [];
    const parts = example.arudScript.split('***');
    const half = (parts[hemistich] ?? parts[0] ?? '').trim();
    return tokenizeArudScript(half);
  }, [example, hemistich]);

  const mismatch = letters.length !== expectedLetters;

  // Assign letters sequentially to unit cells
  let letterCursor = 0;

  const selectMeter = (id: string) => {
    setMeterId(id);
    setHemistich(0);
    setRunId((r) => r + 1);
    trackEvent('scan_select', { meter: id });
  };

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.scan.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold font-amiri text-center mb-2">
        {t.scan.title}
      </h1>
      <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6">{t.scan.subtitle}</p>

      {/* Meter selector + hemistich toggle + replay */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-amiri">{t.scan.meterLabel}</span>
          <select
            value={meterId}
            onChange={(e) => selectMeter(e.target.value)}
            className="bg-gray-900/70 border border-gold-soft rounded-xl px-4 py-2 text-gray-200 font-amiri
                       outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
          >
            {ALL_CIRCLES.map((c) => (
              <optgroup key={c.id} label={getCircleName(c, lang)}>
                {c.meters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {getMeterName(m, lang)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="flex rounded-full border border-gold-soft overflow-hidden">
          {([0, 1] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setHemistich(h);
                setRunId((r) => r + 1);
              }}
              aria-pressed={hemistich === h}
              className={`px-4 py-1.5 text-sm font-amiri transition-colors ${
                hemistich === h ? 'bg-amber-500/90 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {h === 0 ? t.scan.sadr : t.scan.ajuz}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRunId((r) => r + 1)}
          className="px-4 py-1.5 rounded-full border border-gold-soft text-gray-300 font-amiri text-sm
                     hover:text-amber-300 hover:border-amber-500/50 transition-all duration-300"
        >
          ↺ {t.scan.replay}
        </button>
      </div>

      {/* Full verse for reference */}
      {example && (
        <p className="text-center font-amiri text-xl text-gray-400 mb-1 leading-loose" dir="rtl" lang="ar">
          <span className="text-gray-600 text-sm">{t.scan.verseLabel}</span>{' '}
          {example.text}
        </p>
      )}
      <p className="text-center text-gray-600 text-xs font-inter mb-6" dir="ltr">
        {meter.patternTransliteration}
      </p>

      {/* The alignment board: tafila groups of unit cells, letters flow in */}
      <div key={runId} className="flex flex-wrap justify-center gap-x-6 gap-y-8 mb-6" dir="rtl">
        {groups.map((group, g) => (
          <div key={g} className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {group.units.map((unit, u) => {
                const cellLetters = letters.slice(letterCursor, letterCursor + unit.length);
                const startIndex = letterCursor;
                letterCursor += unit.length;
                // unit chars are stored RTL-style; reverse for LTR digit order,
                // then re-reverse for display alongside RTL letters
                const prosody = unit.split('').reverse();
                return (
                  <div
                    key={u}
                    className="flex flex-col items-center rounded-xl border border-gold-soft bg-gray-900/50 px-2 pt-2 pb-1.5 min-w-[3.2rem]"
                  >
                    <div className="flex gap-1" dir="rtl">
                      {prosody.map((symbol, s) => {
                        const letter = cellLetters[s];
                        const overall = startIndex + s;
                        return (
                          <div key={s} className="flex flex-col items-center w-6">
                            <span
                              className="font-amiri text-xl leading-none h-7 flex items-end animate-view-fade"
                              style={{
                                animationDelay: `${overall * 110}ms`,
                                color:
                                  symbol === '/'
                                    ? circle.visualTheme.primaryColor
                                    : '#9CA3AF',
                              }}
                              lang="ar"
                            >
                              {letter ?? ''}
                            </span>
                            <span
                              className={`text-[10px] font-mono mt-1 ${symbol === '/' ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              {symbol === '/' ? '/' : '0'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <span
              className="font-amiri text-lg animate-view-fade"
              style={{
                color: circle.visualTheme.accentColor,
                animationDelay: `${(startOf(groups, g) + spanOf(groups[g])) * 110 + 200}ms`,
              }}
            >
              {group.tafila}
            </span>
          </div>
        ))}
      </div>

      {mismatch && (
        <p className="text-center text-xs text-amber-300/70 font-amiri bg-amber-400/5 border border-amber-500/20 rounded-xl p-3 max-w-xl mx-auto mb-4">
          {t.scan.mismatchNote}
        </p>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-gray-500 font-amiri">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: circle.visualTheme.primaryColor }} />
          {t.scan.legendMutaharrik}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
          {t.scan.legendSakin}
        </span>
      </div>
    </div>
  );
};

/** Letter index at which group g starts. */
const startOf = (groups: { units: string[] }[], g: number): number =>
  groups.slice(0, g).reduce((sum, gr) => sum + spanOf(gr), 0);

/** Total letters spanned by one group. */
const spanOf = (group: { units: string[] }): number =>
  group.units.reduce((s, u) => s + u.length, 0);

export default ScanView;
