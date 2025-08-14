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
        <h2 className="text-2xl md:text-3xl text-gray-300 font-amiri mb-2">
          نظام الخليل بن أحمد الفراهيدي للعروض العربي
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-amiri text-center">
          استكشف النظام الكامل لبحور الشعر العربي للخليل بن أحمد الفراهيدي،
          المنظم في خمس دوائر تقليدية تحتوي على جميع البحور الكلاسيكية الستة عشر
        </p>
      </div>

      {/* Circle Cluster - Grape Layout */}
      <div className="flex flex-col items-center gap-12 mb-12 px-4">
        {/* Top Row - 3 Circles */}
        <div className="flex justify-center gap-20">
          {ALL_CIRCLES.slice(0, 3).map((circle) => (
            <div key={circle.id} className="flex flex-col items-center space-y-4">
              {/* Circle Number Above */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center 
                           text-white font-bold text-base border border-white/20"
                style={{ 
                  backgroundColor: circle.visualTheme.primaryColor
                }}
              >
                {circle.order}
              </div>
              
              {/* Main Circle */}
              <div
                onClick={() => onCircleSelect(circle)}
                className="group cursor-pointer aspect-square w-80 h-80 relative
                           border-2 rounded-full flex flex-col items-center justify-center
                           transition-all duration-500 ease-out
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
                style={{
                  background: `radial-gradient(circle at center, ${circle.visualTheme.backgroundGradient[0]}15, ${circle.visualTheme.backgroundGradient[1]}25, transparent 70%)`,
                  borderColor: circle.visualTheme.borderColor,
                  boxShadow: `0 0 20px ${circle.visualTheme.primaryColor}20`
                }}
              >
                {/* Center Arabic Name Only */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold font-amiri mb-2" 
                      style={{ color: circle.visualTheme.primaryColor }}>
                    {circle.name}
                  </h3>
                  <div className="text-base text-gray-400 font-inter">
                    {circle.meters.length} بحر
                  </div>
                </div>

                {/* Hover Tooltip Content */}
                <div className="absolute inset-2 rounded-full bg-gray-900/95 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-all duration-300
                                flex flex-col items-center justify-center p-6 overflow-hidden"
                     style={{ borderColor: circle.visualTheme.borderColor }}>
                  <div className="text-center space-y-2 max-w-full">
                    <h4 className="text-lg font-inter text-gray-300 mb-2 leading-tight">
                      {circle.nameTransliteration}
                    </h4>
                    <div className="text-sm text-gray-300 leading-tight mb-3 px-2">
                      {circle.description}
                    </div>
                    <div className="space-y-1 px-2">
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
                    <div className="mt-2 text-sm font-inter" style={{ color: circle.visualTheme.primaryColor }}>
                      Click to explore →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - 2 Circles */}
        <div className="flex justify-center gap-20">
          {ALL_CIRCLES.slice(3).map((circle) => (
            <div key={circle.id} className="flex flex-col items-center space-y-4">
              {/* Circle Number Above */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center 
                           text-white font-bold text-base border border-white/20"
                style={{ 
                  backgroundColor: circle.visualTheme.primaryColor
                }}
              >
                {circle.order}
              </div>
              
              {/* Main Circle */}
              <div
                onClick={() => onCircleSelect(circle)}
                className="group cursor-pointer aspect-square w-80 h-80 relative
                           border-2 rounded-full flex flex-col items-center justify-center
                           transition-all duration-500 ease-out
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
                style={{
                  background: `radial-gradient(circle at center, ${circle.visualTheme.backgroundGradient[0]}15, ${circle.visualTheme.backgroundGradient[1]}25, transparent 70%)`,
                  borderColor: circle.visualTheme.borderColor,
                  boxShadow: `0 0 20px ${circle.visualTheme.primaryColor}20`
                }}
              >
                {/* Center Arabic Name Only */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold font-amiri mb-2" 
                      style={{ color: circle.visualTheme.primaryColor }}>
                    {circle.name}
                  </h3>
                  <div className="text-base text-gray-400 font-inter">
                    {circle.meters.length} بحر
                  </div>
                </div>

                {/* Hover Tooltip Content */}
                <div className="absolute inset-2 rounded-full bg-gray-900/95 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-all duration-300
                                flex flex-col items-center justify-center p-6 overflow-hidden"
                     style={{ borderColor: circle.visualTheme.borderColor }}>
                  <div className="text-center space-y-2 max-w-full">
                    <h4 className="text-lg font-inter text-gray-300 mb-2 leading-tight">
                      {circle.nameTransliteration}
                    </h4>
                    <div className="text-sm text-gray-300 leading-tight mb-3 px-2">
                      {circle.description}
                    </div>
                    <div className="space-y-1 px-2">
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
                    <div className="mt-2 text-sm font-inter" style={{ color: circle.visualTheme.primaryColor }}>
                      Click to explore →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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