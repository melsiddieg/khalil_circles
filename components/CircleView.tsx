import React, { useState, useCallback, useEffect } from 'react';
import { Circle, Meter, Tafila } from '../types';
import { parseMeterPattern } from '../constants';
import ArudBanner from './ArudCircle';
import CircularArud from './CircularArud';
import MeterDisplay from './MeterDisplay';
import Controls from './Controls';
import { ChevronLeftIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface CircleViewProps {
  circle: Circle;
  onBackToHub: () => void;
}

const CircleView: React.FC<CircleViewProps> = ({ circle, onBackToHub }) => {
  const [currentMeterIndex, setCurrentMeterIndex] = useState(0);
  const { t, lang, dir } = useLanguage();

  const handleNext = useCallback(() => {
    setCurrentMeterIndex((prevIndex) => (prevIndex + 1) % circle.meters.length);
  }, [circle.meters.length]);

  const handlePrev = useCallback(() => {
    setCurrentMeterIndex((prevIndex) => (prevIndex - 1 + circle.meters.length) % circle.meters.length);
  }, [circle.meters.length]);

  const activeMeter: Meter = circle.meters[currentMeterIndex];
  const activePattern: Tafila[] = parseMeterPattern(activeMeter, circle);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance through the circle's meters while playing. The interval
  // leaves room for the roulette animation chain (~1.6s + reveal) to finish.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mb-2">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400
                     transition-colors duration-300 font-inter"
        >
          <ChevronLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t.circle.back}</span>
        </button>
        <div className="mt-1 text-xs text-gray-500 font-inter">
          {[t.circle.breadcrumbHub, getCircleName(circle, lang), getMeterName(activeMeter, lang)].join(
            dir === 'rtl' ? ' ← ' : ' → '
          )}
        </div>
      </div>

      {/* Circle Header */}
      <header className="text-center mb-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/20"
            style={{
              backgroundColor: circle.visualTheme.primaryColor,
              boxShadow: `0 0 24px ${circle.visualTheme.primaryColor}66`
            }}
          >
            {circle.order}
          </div>
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl md:text-4xl font-bold font-amiri"
              style={{ color: circle.visualTheme.primaryColor }}>
              {getCircleName(circle, lang)}
            </h1>
            <p className="text-gray-400 text-base font-inter">
              {lang === 'ar' ? circle.nameTransliteration : circle.name}
            </p>
          </div>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm">
          {circle.description}
        </p>
      </header>

      {/* Meter Progress Indicator */}
      <div className="mb-4 bg-gray-800/50 rounded-full p-1.5 border border-gray-700">
        <div className="flex items-center gap-2">
          {circle.meters.map((meter, index) => (
            <button
              key={meter.id}
              type="button"
              onClick={() => setCurrentMeterIndex(index)}
              aria-label={getMeterName(meter, lang)}
              aria-current={index === currentMeterIndex}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentMeterIndex
                ? 'scale-125 shadow-lg'
                : 'opacity-50 hover:opacity-100'
                }`}
              style={{
                backgroundColor: index === currentMeterIndex
                  ? circle.visualTheme.primaryColor
                  : circle.visualTheme.accentColor
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-7xl px-2 md:px-4">

        {/* Info Column (Left on Desktop, Bottom on Mobile) */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4 order-2 lg:order-1 pb-20 lg:pb-0">
          <MeterDisplay
            activeMeter={activeMeter}
            activePattern={activePattern}
            circle={circle}
          />
        </div>

        {/* Visualization Column (Right on Desktop, Top on Mobile; sticky on mobile scroll) */}
        <div className="w-full lg:w-3/5 flex flex-col items-center gap-4 order-1 lg:order-2 sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md py-4 -mx-4 px-4 shadow-xl lg:static lg:bg-transparent lg:shadow-none lg:p-0 lg:m-0">
          {/* Circular Visualization */}
          <div className="transition-transform duration-500 scale-90 md:scale-100">
            <CircularArud
              circle={circle}
              activeMeter={activeMeter}
              activePattern={activePattern}
            />
          </div>

          {/* Controls */}
          <div className="w-full flex justify-center -my-2">
            <Controls
              onNext={handleNext}
              onPrev={handlePrev}
              onPlay={() => setIsPlaying(!isPlaying)}
              isPlaying={isPlaying}
            />
          </div>

          {/* Linear Visualization */}
          <div className="w-full flex items-center justify-center p-2 h-[130px] overflow-hidden">
            <ArudBanner
              activeMeter={activeMeter}
              activePattern={activePattern}
              circle={circle}
            />
          </div>
        </div>

      </main>

      {/* Circle Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm max-w-4xl">
        <div className="mb-4">
          <p className="mb-2">
            {t.circle.containsMeters(getCircleName(circle, lang), String(circle.meters.length))}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {circle.meters.map((meter, index) => (
              <span
                key={meter.id}
                className={`px-2 py-1 rounded ${index === currentMeterIndex
                  ? 'text-white font-medium'
                  : 'text-gray-400'
                  }`}
                style={{
                  backgroundColor: index === currentMeterIndex
                    ? circle.visualTheme.primaryColor
                    : 'transparent',
                  border: `1px solid ${circle.visualTheme.borderColor}40`
                }}
              >
                {getMeterName(meter, lang)}
              </span>
            ))}
          </div>
        </div>
        <p>{t.circle.inspired}</p>
        <p>{t.circle.useControls}</p>
      </footer>
    </div>
  );
};

export default CircleView;