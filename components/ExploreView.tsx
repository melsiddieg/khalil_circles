import React, { useState } from 'react';
import { ALL_CIRCLES } from '../constants';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import DivisorSpiral from './explore/DivisorSpiral';
import OrbitCollapser from './explore/OrbitCollapser';
import SymmetryMachine from './explore/SymmetryMachine';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName } from '../i18n/names';

interface ExploreViewProps {
  onBackToHub: () => void;
}

interface StageProps {
  title: string;
  body: string;
  children: React.ReactNode;
}

/** One explorable stage: kufi title, explanatory prose, then the toy. */
const Stage: React.FC<StageProps> = ({ title, body, children }) => (
  <section className="panel-engraved rounded-2xl p-6 md:p-8 mb-8">
    <h2 className="text-2xl font-bold text-amber-300 font-kufi mb-2 text-center">{title}</h2>
    <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6 leading-relaxed">
      {body}
    </p>
    {children}
  </section>
);

/**
 * «شكل القصيدة» — a small gallery of direct-manipulation explorables in the
 * spirit of setosa.io: one circle, many lenses, each theorem something you
 * can drag. All stages share one selected circle for mental continuity.
 */
const ExploreView: React.FC<ExploreViewProps> = ({ onBackToHub }) => {
  const { t, lang, dir } = useLanguage();
  const [circleId, setCircleId] = useState(ALL_CIRCLES[0].id);
  const circle = ALL_CIRCLES.find((c) => c.id === circleId)!;

  return (
    <div className="w-full max-w-4xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t.circle.back}</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-bold heading-display text-center mb-2">
        {t.explore.title}
      </h1>
      <OrnateDivider className="mb-3" />
      <p className="text-gray-400 font-amiri text-center max-w-2xl mx-auto mb-6">
        {t.explore.subtitle}
      </p>

      {/* Shared circle selector: one object, many lenses */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-sm label-gold font-amiri">{t.explore.chooseCircle}</span>
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCircleId(c.id)}
            aria-current={c.id === circleId}
            className={`px-4 py-1.5 rounded-full border font-amiri text-sm transition-all duration-300 ${
              c.id === circleId
                ? 'text-gray-900 font-bold border-transparent'
                : 'text-gray-300 border-gold-soft hover:border-gold'
            }`}
            style={c.id === circleId ? { backgroundColor: c.visualTheme.primaryColor } : undefined}
          >
            {getCircleName(c, lang)}
          </button>
        ))}
      </div>

      <Stage title={t.explore.collapseTitle} body={t.explore.collapseBody}>
        <OrbitCollapser key={circle.id} circle={circle} />
      </Stage>

      <Stage title={t.explore.symTitle} body={t.explore.symBody}>
        <SymmetryMachine key={circle.id} circle={circle} />
      </Stage>

      <Stage title={t.explore.spiralTitle} body={t.explore.spiralBody}>
        <DivisorSpiral key={circle.id} circle={circle} />
      </Stage>
    </div>
  );
};

export default ExploreView;
