import React, { useState, useCallback } from 'react';
import { Circle, Meter, Tafila } from '../types';
import { parseMeterPattern } from '../constants';
import ArudBanner from './ArudCircle';
import CircularArud from './CircularArud';
import MeterDisplay from './MeterDisplay';
import Controls from './Controls';
import { ChevronLeftIcon } from './Icons';

interface CircleViewProps {
  circle: Circle;
  onBackToHub: () => void;
}

const CircleView: React.FC<CircleViewProps> = ({ circle, onBackToHub }) => {
  const [currentMeterIndex, setCurrentMeterIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentMeterIndex((prevIndex) => (prevIndex + 1) % circle.meters.length);
  }, [circle.meters.length]);

  const handlePrev = useCallback(() => {
    setCurrentMeterIndex((prevIndex) => (prevIndex - 1 + circle.meters.length) % circle.meters.length);
  }, [circle.meters.length]);

  const activeMeter: Meter = circle.meters[currentMeterIndex];
  const activePattern: Tafila[] = parseMeterPattern(activeMeter, circle);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mb-2">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 
                     transition-colors duration-300 font-inter"
        >
          <ChevronLeftIcon className="w-4 h-4 rotate-180" />
          <span>Back to Circle Hub</span>
        </button>
        <div className="mt-1 text-xs text-gray-500 font-inter">
          Circle Hub → {circle.nameTransliteration} → {activeMeter.nameTransliteration}
        </div>
      </div>

      {/* Circle Header */}
      <header className="text-center mb-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{ backgroundColor: circle.visualTheme.primaryColor }}
          >
            {circle.order}
          </div>
          <div className="text-right">
            <h1 className="text-3xl md:text-4xl font-bold font-amiri"
              style={{ color: circle.visualTheme.primaryColor }}>
              {circle.name}
            </h1>
            <p className="text-gray-400 text-base font-inter">
              {circle.nameTransliteration}
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
          {circle.meters.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentMeterIndex
                ? 'scale-125 shadow-lg'
                : 'opacity-50'
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
      <main className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-7xl px-4">

        {/* Info Column (Left on Desktop, Bottom on Mobile) */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4 order-2 lg:order-1">
          <MeterDisplay
            activeMeter={activeMeter}
            activePattern={activePattern}
            circle={circle}
          />


        </div>

        {/* Visualization Column (Right on Desktop, Top on Mobile) */}
        <div className="w-full lg:w-3/5 flex flex-col items-center gap-4 order-1 lg:order-2">
          {/* Circular Visualization */}
          <div className="transition-transform duration-500">
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
              meterName={activeMeter.name}
              circleName={circle.name}
            />
          </div>

          {/* Linear Visualization */}
          <div className="w-full flex items-center justify-center p-2 h-[130px]">
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
            <strong style={{ color: circle.visualTheme.primaryColor }}>
              {circle.name}
            </strong> contains {circle.meters.length} meters
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
                {meter.name}
              </span>
            ))}
          </div>
        </div>
        <p>Inspired by the work of Al-Khalil ibn Ahmad al-Farahidi.</p>
        <p>Use the controls to explore the poetic meters of this circle.</p>
      </footer>
    </div>
  );
};

export default CircleView;