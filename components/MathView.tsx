import React, { useMemo, useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { CIRCLE_ROTATIONS, sequencePeriod } from '../data/rotations';
import { Circle, Meter } from '../types';
import { ChevronLeftIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface MathViewProps {
  onBackToHub: () => void;
}

/**
 * Moraic digits of one atomic unit: '/' (moving letter) = 1, '0'
 * (quiescent letter) = 0. Units are stored RTL-style ('0//' = watid),
 * so reverse to read left-to-right as digits.
 */
const unitDigits = (unit: string): string =>
  unit.split('').reverse().map((c) => (c === '/' ? '1' : '0')).join('');

const rotationPattern = (circle: Circle, offset: number): string => {
  const info = CIRCLE_ROTATIONS[circle.id][offset];
  if (info.kind === 'duplicate') return '';
  const instructions =
    info.kind === 'meter'
      ? circle.meters.find((m) => m.id === info.meterId)!.parsingInstructions
      : info.parsingInstructions;
  const probe: Meter = {
    id: `probe-${circle.id}-${offset}`,
    name: '',
    nameTransliteration: '',
    description: '',
    circleId: circle.id,
    startOffset: offset,
    parsingInstructions: instructions,
    patternTransliteration: '',
    historicalUsage: '',
    famousExamples: [],
  };
  // For used meters, parse via the real meter to hit circle-3's special case
  if (info.kind === 'meter') {
    const meter = circle.meters.find((m) => m.id === info.meterId)!;
    return parseMeterPattern(meter, circle).map((t) => t.merged).join(' ');
  }
  return parseMeterPattern(probe, circle).map((t) => t.merged).join(' ');
};

const MathView: React.FC<MathViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();
  const [circleId, setCircleId] = useState(ALL_CIRCLES[0].id);
  const circle = ALL_CIRCLES.find((c) => c.id === circleId)!;

  const period = useMemo(() => sequencePeriod(circle.atomicSequence), [circle]);
  const rotations = CIRCLE_ROTATIONS[circle.id];
  const usedCount = rotations.filter((r) => r.kind === 'meter').length;
  const muhmalCount = rotations.filter((r) => r.kind === 'muhmal').length;
  const total = circle.atomicSequence.length;

  return (
    <div className="w-full max-w-4xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.math.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold font-amiri text-center mb-2">
        {t.math.title}
      </h1>
      <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6">{t.math.subtitle}</p>

      {/* Circle selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCircleId(c.id)}
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

      {/* Binary lens */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5 mb-4">
        <h3 className="text-sm text-gray-400 font-amiri mb-3">{t.math.binaryLabel}</h3>
        <div className="flex flex-wrap gap-1.5 justify-center" dir="rtl">
          {circle.atomicSequence.map((unit, i) => (
            <span
              key={i}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg bg-gray-900/50 border border-gray-700/50"
            >
              <span className="font-mono text-base tracking-widest" style={{ color: circle.visualTheme.primaryColor }} dir="ltr">
                {unitDigits(unit)}
              </span>
              <span className="font-mono text-[10px] text-gray-500" dir="ltr">
                {unit.split('').reverse().join('')}
              </span>
            </span>
          ))}
        </div>

        {/* Symmetry facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 text-center">
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div className="text-2xl font-bold font-amiri" style={{ color: circle.visualTheme.primaryColor }}>
              {total}
            </div>
            <div className="text-xs text-gray-500 font-amiri">{t.math.unitsCount(String(total))}</div>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div className="text-2xl font-bold font-amiri" style={{ color: circle.visualTheme.primaryColor }}>
              {period}
            </div>
            <div className="text-xs text-gray-500 font-amiri">{t.math.periodLabel}</div>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-3">
            <div className="text-2xl font-bold font-amiri" style={{ color: circle.visualTheme.primaryColor }}>
              {period}
            </div>
            <div className="text-xs text-gray-500 font-amiri">
              {t.math.distinctLabel} {t.math.formula(String(usedCount), String(muhmalCount))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 font-amiri mt-4">
          {period < total ? t.math.symmetryNote(String(period), String(total)) : t.math.noSymmetryNote}
        </p>
      </div>

      {/* Rotation table */}
      <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 font-amiri bg-gray-900/40">
              <th className="py-2.5 px-4 font-normal">{t.math.tableOffset}</th>
              <th className="py-2.5 px-4 font-normal">{t.math.tablePattern}</th>
              <th className="py-2.5 px-4 font-normal">{t.math.tableStatus}</th>
            </tr>
          </thead>
          <tbody>
            {rotations.map((info, offset) => {
              const isDup = info.kind === 'duplicate';
              return (
                <tr
                  key={offset}
                  className={`border-t border-gray-700/40 ${isDup ? 'opacity-40' : ''}`}
                >
                  <td className="py-2 px-4 text-center font-mono text-gray-400">{offset}</td>
                  <td className="py-2 px-4 text-center font-amiri text-lg" dir="rtl">
                    {isDup ? '—' : (
                      <span style={{ color: info.kind === 'meter' ? circle.visualTheme.primaryColor : '#9CA3AF' }}>
                        {rotationPattern(circle, offset)}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center font-amiri">
                    {info.kind === 'meter' && (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: circle.visualTheme.primaryColor }} />
                        <span className="text-gray-200">
                          {getMeterName(circle.meters.find((m) => m.id === info.meterId)!, lang)}
                        </span>
                      </span>
                    )}
                    {info.kind === 'muhmal' && (
                      <span className="text-gray-400 border border-dashed border-gray-600 rounded-full px-2.5 py-0.5 text-xs">
                        {(lang === 'ar' ? info.nameAr : info.nameEn) ?? t.math.statusMuhmal}
                      </span>
                    )}
                    {isDup && <span className="text-gray-500 text-xs">{t.math.statusDuplicate(String(info.of))}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-center text-amber-200/80 font-amiri text-sm bg-amber-400/5 border border-amber-500/20 rounded-2xl p-4">
        {t.math.grandTotal}
      </p>
    </div>
  );
};

export default MathView;
