
import React from 'react';
import { Meter, Tafila, Circle } from '../types';

interface MeterDisplayProps {
  activeMeter: Meter;
  activePattern: Tafila[];
  circle?: Circle;
}

const MeterDisplay: React.FC<MeterDisplayProps> = ({ activeMeter, activePattern, circle }) => {
  return (
    <div key={activeMeter.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 w-full animate-fade-in" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h2
          className="text-3xl font-bold font-amiri"
          style={{ color: circle?.visualTheme.primaryColor || '#FBBF24' }}
        >
          {activeMeter.name}
        </h2>
        <span className="text-sm font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded" dir="ltr">
          OFFSET: {activeMeter.startOffset}
        </span>
      </div>
      <p className="text-gray-300 text-lg mb-4" dir="ltr">{activeMeter.description}</p>

      {/* Enhanced meter information with circle context */}
      {activeMeter.historicalUsage && (
        <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border-l-4"
          style={{ borderLeftColor: circle?.visualTheme.accentColor || '#F59E0B' }}>
          <h4 className="text-sm font-semibold text-gray-400 mb-2" dir="ltr">Historical Usage</h4>
          <p className="text-gray-300 text-sm" dir="ltr">{activeMeter.historicalUsage}</p>
        </div>
      )}

      <div className="border-t border-gray-700/60 pt-4">
        <h3 className="text-lg font-semibold text-gray-400 mb-2 text-left" dir="ltr">Pattern (Taf'īlāt)</h3>
        <p
          className="font-amiri text-3xl text-right tracking-wider"
          style={{ color: circle?.visualTheme.primaryColor || '#FDE68A' }}
          dir="rtl"
        >
          {activePattern.map(t => t.merged).join(' ')}
        </p>
        <p className="font-mono text-sm text-gray-500 mt-1 text-left" dir="ltr">
          {activeMeter.patternTransliteration}
        </p>
      </div>

      {/* Famous Example */}
      {activeMeter.famousExamples && activeMeter.famousExamples.length > 0 && (
        <div className="border-t border-gray-700/60 pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-400 mb-3 text-left" dir="ltr">Famous Example</h3>

          <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50">
            {/* Verse */}
            <p
              className="font-amiri text-2xl text-center leading-loose mb-3"
              style={{ color: circle?.visualTheme.primaryColor || '#FDE68A' }}
              dir="rtl"
            >
              {activeMeter.famousExamples[0].text}
            </p>

            {/* Poet & Translation */}
            <div className="flex flex-col gap-1 text-sm text-gray-400" dir="ltr">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-300">Poet:</span>
                <span>{activeMeter.famousExamples[0].poet}</span>
                {activeMeter.famousExamples[0].era && (
                  <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">
                    {activeMeter.famousExamples[0].era}
                  </span>
                )}
              </div>
              <p className="italic text-gray-500 mt-1">
                "{activeMeter.famousExamples[0].translation}"
              </p>
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
