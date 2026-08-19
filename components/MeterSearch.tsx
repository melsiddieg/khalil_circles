import React, { useMemo, useState, useRef } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { normalizeArabic } from '../utils/arabicNormalize';
import { useLanguage } from '../i18n/LanguageContext';
import { trackEvent } from '../utils/analytics';

interface MeterSearchProps {
  onMeterSelect: (circleId: string, meterIndex: number) => void;
}

interface SearchEntry {
  circleId: string;
  meterIndex: number;
  circleColor: string;
  circleNameAr: string;
  circleNameEn: string;
  meterNameAr: string;
  meterNameEn: string;
  haystack: string;
}

const buildIndex = (): SearchEntry[] =>
  ALL_CIRCLES.flatMap((circle) =>
    circle.meters.map((meter, meterIndex) => ({
      circleId: circle.id,
      meterIndex,
      circleColor: circle.visualTheme.primaryColor,
      circleNameAr: circle.name,
      circleNameEn: circle.nameTransliteration,
      meterNameAr: meter.name,
      meterNameEn: meter.nameTransliteration,
      haystack: normalizeArabic(
        [
          meter.name,
          meter.nameTransliteration,
          meter.patternTransliteration,
          parseMeterPattern(meter, circle)
            .map((t) => t.merged)
            .join(' '),
        ].join(' ')
      ),
    }))
  );

const MeterSearch: React.FC<MeterSearchProps> = ({ onMeterSelect }) => {
  const { t, lang, dir } = useLanguage();
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const q = normalizeArabic(query);
    if (!q) return [];
    return index.filter((entry) => entry.haystack.includes(q)).slice(0, 8);
  }, [index, query]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setHighlighted(0);
  };

  const select = (entry: SearchEntry) => {
    trackEvent('search_select', { circle: entry.circleId, meter_index: entry.meterIndex });
    setQuery('');
    onMeterSelect(entry.circleId, entry.meterIndex);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(results[highlighted]);
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-10 relative animate-fade-up" style={{ animationDelay: '860ms' }}>
      <div className="relative">
        <svg
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none ${dir === 'rtl' ? 'right-4' : 'left-4'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.search.placeholder}
          aria-label={t.search.label}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="meter-search-results"
          className={`w-full bg-gray-800/70 backdrop-blur-md border border-gold-soft rounded-full py-3 text-gray-200
                      placeholder-gray-500 font-amiri text-lg outline-none transition-all duration-300
                      focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 focus:bg-gray-800
                      ${dir === 'rtl' ? 'pr-12 pl-5' : 'pl-12 pr-5'}`}
        />
      </div>

      {query && (
        <ul
          id="meter-search-results"
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-gold-soft rounded-2xl shadow-2xl overflow-hidden"
        >
          {results.length === 0 && (
            <li className="px-5 py-3 text-gray-500 font-amiri">{t.search.noResults}</li>
          )}
          {results.map((entry, i) => (
            <li key={`${entry.circleId}-${entry.meterIndex}`} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                onClick={() => select(entry)}
                onMouseEnter={() => setHighlighted(i)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3 transition-colors text-start
                           ${i === highlighted ? 'bg-gray-800' : 'hover:bg-gray-800/60'}`}
              >
                <span className="font-amiri text-lg text-gray-200">
                  {lang === 'ar' ? entry.meterNameAr : entry.meterNameEn}
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-500 font-amiri shrink-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.circleColor }}
                    aria-hidden="true"
                  />
                  {lang === 'ar' ? entry.circleNameAr : entry.circleNameEn}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeterSearch;
