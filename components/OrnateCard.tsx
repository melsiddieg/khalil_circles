import React from 'react';
import { Circle } from '../types';
import IslamicPattern from './IslamicPattern';

interface OrnateCardProps {
  circle: Circle;
  onCircleSelect: (circle: Circle) => void;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const OrnateCard: React.FC<OrnateCardProps> = ({ circle, onCircleSelect }) => {
  return (
    <div
      className="flex flex-col items-center space-y-4 relative z-10"
      style={{ width: '100%', maxWidth: '280px', height: '400px', flexShrink: 0 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={circle.name}
        onClick={() => onCircleSelect(circle)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCircleSelect(circle);
          }
        }}
        style={{ '--card-glow': `${circle.visualTheme.primaryColor}59`, '--card-border': `${circle.visualTheme.primaryColor}80` } as React.CSSProperties}
        className="group cursor-pointer relative transition-all duration-500 ease-out
                   hover:scale-105 w-full h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded-2xl"
      >
        {/* Card backdrop: glass panel with theme glow and geometric pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_45px_-8px_var(--card-glow)] group-hover:border-[color:var(--card-border)]">
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: `radial-gradient(circle at center, ${circle.visualTheme.primaryColor}20, transparent 70%)` }}
          />
          <IslamicPattern
            primaryColor={circle.visualTheme.primaryColor}
            accentColor={circle.visualTheme.accentColor}
            opacity={0.3}
            scale={1.5}
          />
          <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

          {/* Corner accents that grow on hover */}
          <div
            className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 rounded-tl-2xl opacity-60 transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:opacity-100"
            style={{ borderColor: circle.visualTheme.primaryColor }}
          />
          <div
            className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 rounded-tr-2xl opacity-60 transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:opacity-100"
            style={{ borderColor: circle.visualTheme.primaryColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 rounded-bl-2xl opacity-60 transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:opacity-100"
            style={{ borderColor: circle.visualTheme.primaryColor }}
          />
          <div
            className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 rounded-br-2xl opacity-60 transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:opacity-100"
            style={{ borderColor: circle.visualTheme.primaryColor }}
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
          <div className="text-center p-6 rounded-xl backdrop-blur-sm border border-white/5 bg-gray-900/40 shadow-xl transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3
              className="text-3xl font-bold font-amiri mb-3 drop-shadow-md"
              style={{ color: circle.visualTheme.primaryColor }}
            >
              {circle.name}
            </h3>
            <div className="text-sm text-gray-300 font-inter tracking-wider uppercase opacity-80">
              {ARABIC_NUMERALS[circle.meters.length] || circle.meters.length} METERS
            </div>
          </div>
        </div>

        {/* Hover Tooltip - Arabic Only */}
        <div
          className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl rounded-2xl
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        flex flex-col items-center justify-center p-6 z-20 border border-white/10"
        >
          <div className="text-center space-y-4 max-w-full">
            <div className="text-lg text-gray-200 leading-relaxed px-2 font-amiri">
              {circle.description}
            </div>
            <div className="w-12 h-0.5 bg-white/20 mx-auto rounded-full" />
            <div className="space-y-1.5">
              {circle.meters.slice(0, 3).map((meter) => (
                <div key={meter.id} className="text-base text-gray-400 font-amiri text-center hover:text-white transition-colors">
                  {meter.name}
                </div>
              ))}
              {circle.meters.length > 3 && (
                <div className="text-sm text-gray-500 italic font-amiri mt-2">
                  +{ARABIC_NUMERALS[circle.meters.length - 3] || (circle.meters.length - 3)} أبحر أخرى
                </div>
              )}
            </div>
            <div className="mt-4 text-sm font-amiri font-bold animate-pulse" style={{ color: circle.visualTheme.primaryColor }}>
              انقر للاستكشاف ←
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrnateCard;
