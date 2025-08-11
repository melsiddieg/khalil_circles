import React from 'react';
import { Circle } from '../types';
import { ALL_CIRCLES } from '../constants';

interface CircleHubProps {
  onCircleSelect: (circle: Circle) => void;
}

const CircleHub: React.FC<CircleHubProps> = ({ onCircleSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-400 font-amiri mb-4">
          دوائر العروض الخمس
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 font-inter mb-2">
          The Five Circles of Arabic Prosody
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
          Explore Al-Khalil ibn Ahmad al-Farahidi's complete system of Arabic poetry meters, 
          organized into five traditional circles containing all sixteen classical meters.
        </p>
      </div>

      {/* Circle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {ALL_CIRCLES.map((circle) => (
          <div
            key={circle.id}
            onClick={() => onCircleSelect(circle)}
            className="group cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700 
                       rounded-2xl p-6 transition-all duration-500 ease-out
                       hover:border-gray-500 hover:bg-gray-700/60 hover:scale-105
                       hover:shadow-2xl hover:shadow-black/25"
            style={{
              background: `linear-gradient(135deg, ${circle.visualTheme.backgroundGradient[0]}05, ${circle.visualTheme.backgroundGradient[1]}10)`,
              borderColor: `${circle.visualTheme.borderColor}40`
            }}
          >
            {/* Circle Number */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: circle.visualTheme.primaryColor }}
              >
                {circle.order}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 font-inter">
                  {circle.meters.length} meters
                </div>
              </div>
            </div>

            {/* Circle Names */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold font-amiri text-right mb-2" 
                  style={{ color: circle.visualTheme.primaryColor }}>
                {circle.name}
              </h3>
              <h4 className="text-gray-300 font-inter text-sm">
                {circle.nameTransliteration}
              </h4>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {circle.description}
            </p>

            {/* Meter List Preview */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 font-inter uppercase tracking-wide mb-2">
                Meters in this circle:
              </div>
              {circle.meters.slice(0, 3).map((meter, index) => (
                <div key={meter.id} className="text-sm text-gray-400 font-amiri text-right">
                  {meter.name}
                </div>
              ))}
              {circle.meters.length > 3 && (
                <div className="text-xs text-gray-500 italic">
                  +{circle.meters.length - 3} more...
                </div>
              )}
            </div>

            {/* Hover Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-700/50 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center">
                <span className="text-sm text-gray-400 font-inter">
                  Click to explore →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="text-center bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-amber-400">16</div>
            <div className="text-gray-400 text-sm font-inter">Classical Meters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">5</div>
            <div className="text-gray-400 text-sm font-inter">Prosodic Circles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">1000+</div>
            <div className="text-gray-400 text-sm font-inter">Years of Tradition</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          This digital representation preserves Al-Khalil ibn Ahmad al-Farahidi's foundational 
          work in Arabic prosody, offering an interactive exploration of classical Arabic poetry meters.
        </p>
      </div>
    </div>
  );
};

export default CircleHub;