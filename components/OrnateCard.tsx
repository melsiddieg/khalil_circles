import React from 'react';
import { Circle } from '../types';

interface OrnateCardProps {
  circle: Circle;
  onCircleSelect: (circle: Circle) => void;
}

const OrnateCard: React.FC<OrnateCardProps> = ({ circle, onCircleSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circle Number Above */}
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center 
                   text-white font-bold text-lg border border-white/20 z-10"
        style={{ 
          backgroundColor: circle.visualTheme.primaryColor
        }}
      >
        {circle.order}
      </div>
      
      {/* Ornate SVG Card */}
      <div
        onClick={() => onCircleSelect(circle)}
        className="group cursor-pointer relative transition-all duration-500 ease-out
                   hover:scale-105 hover:drop-shadow-2xl"
        style={{ width: '300px', height: '400px' }}
      >
        {/* Islamic Ornate Card using your SVG */}
        <img 
          src="/assets/islamic_ring_card_transparent.svg"
          alt="Islamic ornate border"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ 
            filter: `drop-shadow(0 0 20px ${circle.visualTheme.primaryColor}60) hue-rotate(${(circle.order - 1) * 72}deg) saturate(1.2)`
          }}
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="text-center bg-gray-900/80 rounded-xl p-4 backdrop-blur-sm max-w-48">
            <h3 className="text-2xl font-bold font-amiri mb-2" 
                style={{ color: circle.visualTheme.primaryColor }}>
              {circle.name}
            </h3>
            <div className="text-sm text-gray-400 font-inter">
              {circle.meters.length} بحر
            </div>
          </div>
        </div>
        
        {/* Hover Tooltip */}
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-2xl
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-3 max-w-full">
            <h4 className="text-lg font-inter text-gray-300 leading-tight">
              {circle.nameTransliteration}
            </h4>
            <div className="text-sm text-gray-300 leading-tight px-2">
              {circle.description}
            </div>
            <div className="space-y-1">
              {circle.meters.slice(0, 3).map((meter, index) => (
                <div key={meter.id} className="text-sm text-gray-400 font-amiri text-center">
                  {meter.name}
                </div>
              ))}
              {circle.meters.length > 3 && (
                <div className="text-sm text-gray-500 italic">
                  +{circle.meters.length - 3} بحر آخر
                </div>
              )}
            </div>
            <div className="mt-3 text-sm font-inter" style={{ color: circle.visualTheme.primaryColor }}>
              انقر للاستكشاف ←
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrnateCard;