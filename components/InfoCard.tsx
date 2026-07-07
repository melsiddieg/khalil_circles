import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const InfoCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, dir } = useLanguage();
  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="panel-engraved rounded-xl p-4 hover:bg-gray-800/90 transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={`flex items-center justify-between w-full ${textAlign}`}
        >
          <h3 className="text-xl font-bold text-amber-300 font-kufi">
            {t.info.title}
          </h3>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 text-gray-300 leading-relaxed">
            <p className={`font-amiri text-lg ${textAlign}`}>
              {t.info.body}
            </p>

            <div className="bg-gray-900/50 rounded-lg p-4 max-w-4xl mx-auto">
              <h4 className="text-amber-200 font-bold mb-3 font-amiri text-center">{t.info.unitsTitle}</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className={`space-y-2 font-amiri ${textAlign}`}>
                  <li><span className="text-amber-300">{t.info.watidMajmu}</span> {t.info.watidMajmuDesc}</li>
                  <li><span className="text-amber-300">{t.info.sababKhafif}</span> {t.info.sababKhafifDesc}</li>
                </ul>
                <ul className={`space-y-2 font-amiri ${textAlign}`}>
                  <li><span className="text-amber-300">{t.info.sababThaqil}</span> {t.info.sababThaqilDesc}</li>
                  <li><span className="text-amber-300">{t.info.watidMafruq}</span> {t.info.watidMafruqDesc}</li>
                </ul>
              </div>
            </div>

            <p className="text-center text-amber-200 font-amiri text-sm">
              {t.info.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
