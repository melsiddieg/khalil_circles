import React from 'react';
import { Circle } from '../types';
import { ALL_CIRCLES } from '../constants';
import OrnateCard from './OrnateCard';
import MeterSearch from './MeterSearch';
import { useLanguage } from '../i18n/LanguageContext';

interface CircleHubProps {
  onCircleSelect: (circle: Circle) => void;
  onMeterSelect: (circleId: string, meterIndex: number) => void;
  onCompare: () => void;
  onStartTour: () => void;
  onShowView: (view: 'dial' | 'math' | 'scan') => void;
}

const CircleHub: React.FC<CircleHubProps> = ({
  onCircleSelect,
  onMeterSelect,
  onCompare,
  onStartTour,
  onShowView,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="text-5xl md:text-7xl font-bold text-gradient-gold font-amiri mb-4 drop-shadow-[0_2px_12px_rgba(251,191,36,0.25)]">
          {t.hub.title}
        </h1>
        <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <span className="h-px w-16 md:w-24 bg-gradient-to-l from-amber-500/60 to-transparent" />
          <span className="text-amber-500/80 text-lg">✦</span>
          <span className="h-px w-16 md:w-24 bg-gradient-to-r from-amber-500/60 to-transparent" />
        </div>
        <h2 className="text-2xl md:text-3xl text-gray-300 font-amiri mb-2">
          {t.hub.subtitle}
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-amiri text-center">
          {t.hub.intro}
        </p>
      </div>

      {/* Meter Search */}
      <MeterSearch onMeterSelect={onMeterSelect} />

      {/* Exploration tools */}
      <div className="flex flex-wrap items-center justify-center gap-3 -mt-4 mb-10 animate-fade-up" style={{ animationDelay: '160ms' }}>
        {(
          [
            { icon: '⇄', label: t.compare.entry, onClick: onCompare },
            { icon: '✦', label: t.tour.entry, onClick: onStartTour },
            { icon: '◎', label: t.dial.entry, onClick: () => onShowView('dial') },
            { icon: '∑', label: t.math.entry, onClick: () => onShowView('math') },
            { icon: '҂', label: t.scan.entry, onClick: () => onShowView('scan') },
          ] as const
        ).map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={tool.onClick}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-700
                       bg-gray-800/60 text-gray-300 font-amiri text-base hover:text-amber-300
                       hover:border-amber-500/50 transition-all duration-300"
          >
            <span aria-hidden="true">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Ornate Cards Cluster - Grape Layout */}
      <div id="tour-cards" className="flex flex-col items-center gap-12 md:gap-24 mb-16 px-4 w-full max-w-7xl">
        {/* Top Row - 3 Ornate Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 w-full items-center flex-wrap">
          {ALL_CIRCLES.slice(0, 3).map((circle, i) => (
            <div key={circle.id} className="animate-fade-up w-full max-w-[280px] flex justify-center" style={{ animationDelay: `${120 + i * 110}ms` }}>
              <OrnateCard circle={circle} onCircleSelect={onCircleSelect} />
            </div>
          ))}
        </div>

        {/* Bottom Row - 2 Ornate Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 w-full items-center flex-wrap">
          {ALL_CIRCLES.slice(3).map((circle, i) => (
            <div key={circle.id} className="animate-fade-up w-full max-w-[280px] flex justify-center" style={{ animationDelay: `${450 + i * 110}ms` }}>
              <OrnateCard circle={circle} onCircleSelect={onCircleSelect} />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="text-center bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">{t.hub.statMetersValue}</div>
            <div className="text-gray-400 text-sm font-amiri">{t.hub.statMetersLabel}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">{t.hub.statCirclesValue}</div>
            <div className="text-gray-400 text-sm font-amiri">{t.hub.statCirclesLabel}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">{t.hub.statHeritageValue}</div>
            <div className="text-gray-400 text-sm font-amiri">{t.hub.statHeritageLabel}</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          {t.hub.preservationNote}
        </p>
      </div>

      {/* Author Trademark Footer */}
      <div className="mt-6 text-center border-t border-gray-700/30 pt-6">
        <p className="text-gray-400 text-sm font-amiri">
          {t.hub.attribution} <span className="text-amber-300 font-bold">{t.hub.author}</span>
        </p>
        <p className="text-gray-500 text-xs mt-1 font-inter">
          {t.hub.tagline}
        </p>
      </div>
    </div>
  );
};

export default CircleHub;
