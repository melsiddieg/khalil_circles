import React, { useMemo, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { Circle, Meter } from '../types';
import MeterPatternCard from './MeterPatternCard';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface CompareViewProps {
  onBackToHub: () => void;
}

interface MeterOption {
  meter: Meter;
  circle: Circle;
}

const CompareView: React.FC<CompareViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();

  const options = useMemo<MeterOption[]>(
    () => ALL_CIRCLES.flatMap((circle) => circle.meters.map((meter) => ({ meter, circle }))),
    []
  );

  // Pedagogically interesting cross-circle default: al-Taweel vs al-Kamil
  const [firstId, setFirstId] = useState('al-tawil');
  const [secondId, setSecondId] = useState('al-kamil');

  const first = options.find((o) => o.meter.id === firstId) ?? options[0];
  const second = options.find((o) => o.meter.id === secondId) ?? options[1];

  const sharedFeet = useMemo(() => {
    const firstFeet = new Set(parseMeterPattern(first.meter, first.circle).map((tf) => tf.merged));
    return new Set(
      parseMeterPattern(second.meter, second.circle)
        .map((tf) => tf.merged)
        .filter((foot) => firstFeet.has(foot))
    );
  }, [first, second]);

  const renderSelect = (
    label: string,
    value: string,
    onChange: (id: string) => void
  ) => (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-sm label-gold font-amiri">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900/70 border border-gold-soft rounded-xl px-4 py-2.5 text-gray-200 font-amiri text-lg
                   outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
      >
        {ALL_CIRCLES.map((circle) => (
          <optgroup key={circle.id} label={getCircleName(circle, lang)}>
            {circle.meters.map((meter) => (
              <option key={meter.id} value={meter.id}>
                {getMeterName(meter, lang)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );

  const firstCount = first.meter.parsingInstructions.length;
  const secondCount = second.meter.parsingInstructions.length;

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      {/* Back navigation */}
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.compare.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold heading-display text-center mb-3">
        {t.compare.title}
      </h1>
      <OrnateDivider className="mb-6" />

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {renderSelect(t.compare.firstMeter, firstId, setFirstId)}
        {renderSelect(t.compare.secondMeter, secondId, setSecondId)}
      </div>

      {/* Side-by-side pattern cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-6">
        <MeterPatternCard meter={first.meter} circle={first.circle} highlightFeet={sharedFeet} />
        <MeterPatternCard meter={second.meter} circle={second.circle} highlightFeet={sharedFeet} />
      </div>

      {/* Difference summary */}
      <div className="panel-engraved rounded-2xl p-5 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400 font-amiri">
          <span>
            <span style={{ color: first.circle.visualTheme.primaryColor }}>{getMeterName(first.meter, lang)}</span>
            {' — '}
            {t.compare.feetCount(String(firstCount))}
          </span>
          <span>
            <span style={{ color: second.circle.visualTheme.primaryColor }}>{getMeterName(second.meter, lang)}</span>
            {' — '}
            {t.compare.feetCount(String(secondCount))}
          </span>
          <span className="text-gray-500">
            {first.circle.id === second.circle.id ? t.compare.sameCircle : t.compare.differentCircles}
          </span>
        </div>

        <div className="font-amiri text-lg" dir="rtl">
          {sharedFeet.size > 0 ? (
            <>
              <span className="text-gray-400 me-2">{t.compare.sharedFeet}</span>
              {[...sharedFeet].map((foot) => (
                <span key={foot} className="inline-block mx-1 px-2.5 py-0.5 rounded-md border border-amber-400/50 bg-amber-400/10 text-amber-200">
                  {foot}
                </span>
              ))}
            </>
          ) : (
            <span className="text-gray-500">{t.compare.noSharedFeet}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareView;
