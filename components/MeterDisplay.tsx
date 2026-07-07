
import React, { useState } from 'react';
import { Meter, Tafila, Circle } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getMeterName } from '../i18n/names';

interface MeterDisplayProps {
  activeMeter: Meter;
  activePattern: Tafila[];
  circle?: Circle;
}

const MeterDisplay: React.FC<MeterDisplayProps> = ({ activeMeter, activePattern, circle }) => {
  const [showArudScript, setShowArudScript] = useState(false);
  const { t, lang, dir } = useLanguage();
  const example = activeMeter.famousExamples[0];
  const sectionAlign = dir === 'rtl' ? 'text-left' : 'text-left';

  return (
    <div key={activeMeter.id} className="panel-engraved rounded-2xl p-6 w-full animate-fade-in" dir={dir}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2
            className="text-3xl font-bold font-amiri"
            style={{ color: circle?.visualTheme.primaryColor || '#FBBF24' }}
          >
            {getMeterName(activeMeter, lang)}
          </h2>
          {lang === 'en' && (
            <p className="text-gray-500 font-amiri text-lg" dir="rtl">
              {activeMeter.name}
            </p>
          )}
          {activeMeter.mnemonic && (
            <p className="text-gray-400 font-amiri text-sm mt-1 opacity-80" dir="rtl">
              {activeMeter.mnemonic}
            </p>
          )}
        </div>
        <span className="text-sm font-mono label-gold bg-gray-900/60 border border-gold-soft px-2 py-1 rounded" dir="ltr">
          {t.meter.offset}: {activeMeter.startOffset}
        </span>
      </div>
      <p className="text-gray-300 text-lg mb-4" dir="ltr">{activeMeter.description}</p>

      {/* Enhanced meter information with circle context */}
      {activeMeter.historicalUsage && (
        <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border-s-4"
          style={{ borderColor: circle?.visualTheme.accentColor || '#F59E0B' }}>
          <h4 className="text-sm font-semibold label-gold mb-2" dir="ltr">{t.meter.historicalUsage}</h4>
          <p className="text-gray-300 text-sm" dir="ltr">{activeMeter.historicalUsage}</p>
        </div>
      )}

      <div className="border-t border-gold-soft pt-4">
        <h3 className={`text-lg font-semibold label-gold mb-2 ${sectionAlign}`} dir="ltr">{t.meter.pattern}</h3>
        <p
          className="font-amiri text-3xl text-right tracking-wider"
          style={{ color: circle?.visualTheme.primaryColor || '#FDE68A' }}
          dir="rtl"
        >
          {activePattern.map((tafila) => tafila.merged).join(' ')}
        </p>
        <p className="font-mono text-sm text-gray-500 mt-1 text-left" dir="ltr">
          {activeMeter.patternTransliteration}
        </p>
      </div>

      {/* Famous Example */}
      {example && (
        <div className="border-t border-gold-soft pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-lg font-semibold label-gold ${sectionAlign}`} dir="ltr">{t.meter.famousExample}</h3>
            {example.arudScript && (
              <button
                onClick={() => setShowArudScript(!showArudScript)}
                className="text-xs px-2 py-1 rounded border border-gold-soft bg-gray-900/60 hover:border-gold text-gray-300 transition-colors font-amiri"
              >
                {showArudScript ? t.meter.showOriginal : t.meter.showArud}
              </button>
            )}
          </div>

          <div className="bg-gray-900/40 rounded-xl p-4 border border-gold-soft">
            {/* Verse — always Arabic, always RTL */}
            <p
              className="font-amiri text-2xl text-center leading-loose mb-3 transition-all duration-300"
              style={{
                color: circle?.visualTheme.primaryColor || '#FDE68A',
                opacity: showArudScript ? 0.9 : 1
              }}
              dir="rtl"
              lang="ar"
            >
              {showArudScript && example.arudScript ? example.arudScript : example.text}
            </p>

            {/* Poet & Translation */}
            <div className="flex flex-col gap-1 text-sm text-gray-400" dir="ltr">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-300">{t.meter.poet}</span>
                <span lang="ar">{example.poet}</span>
                {example.era && (
                  <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">
                    {example.era}
                  </span>
                )}
              </div>
              {example.translation && (
                <p className="italic text-gray-500 mt-1">
                  "{example.translation}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MeterDisplay;
