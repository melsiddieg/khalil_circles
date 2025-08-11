import React, { useEffect, useState } from 'react';
import { ATOMIC_SEQUENCE } from '../constants';
import { Meter, Tafila, Circle } from '../types';

interface ArudBannerProps {
  activeMeter: Meter;
  activePattern: Tafila[];
  circle?: Circle; // Optional circle for enhanced theming and sequences
}

const ArudBanner: React.FC<ArudBannerProps> = ({ activeMeter, activePattern, circle }) => {
  // Use circle's atomic sequence if provided, otherwise fall back to legacy sequence
  const atomicSequence = circle?.atomicSequence || ATOMIC_SEQUENCE;
  
  // Create a much longer sequence for infinite scrolling effect
  const repeatedSequence = Array(10).fill(atomicSequence).flat();
  const unitWidth = 90; // pixels
  const sequenceLength = atomicSequence.length;

  const totalUnitsInPattern = activeMeter.parsingInstructions.reduce((sum, val) => sum + val, 0);
  const patternWidth = totalUnitsInPattern * unitWidth;
  
  // Calculate shift with modular arithmetic for circular behavior
  const normalizedOffset = ((activeMeter.startOffset % sequenceLength) + sequenceLength) % sequenceLength;
  const shift = normalizedOffset * unitWidth;

  // State for sliding window effect
  const [currentOffset, setCurrentOffset] = useState(0);
  const [showGroupings, setShowGroupings] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDisintegrating, setIsDisintegrating] = useState(false);
  const [isReforming, setIsReforming] = useState(false);
  const [visibleBoxes, setVisibleBoxes] = useState<boolean[]>(() => 
    new Array(activePattern.length).fill(true)
  );

  // Sliding window animation sequence with smooth transitions
  useEffect(() => {
    // Calculate the target offset for smooth sliding
    const targetOffset = normalizedOffset;
    
    // Reset visible boxes
    setVisibleBoxes(new Array(activePattern.length).fill(false));
    
    // Phase 1: Start disintegration animation
    setIsDisintegrating(true);
    setIsAnimating(true);
    
    // Phase 2: After disintegration, hide groupings and start sliding
    const hideTimer = setTimeout(() => {
      setShowGroupings(false);
      setIsDisintegrating(false);
      setCurrentOffset(targetOffset);
    }, 300); // Allow disintegration animation to complete
    
    // Phase 3: After slide completes, start reformation
    const reformTimer = setTimeout(() => {
      setShowGroupings(true);
      setIsReforming(true);
      
      // Start showing boxes from right to left (index 0 first in RTL)
      activePattern.forEach((_, index) => {
        setTimeout(() => {
          setVisibleBoxes(prev => {
            const newVisible = [...prev];
            newVisible[index] = true;
            return newVisible;
          });
        }, index * 150); // 150ms delay between each box
      });
    }, 1100); // After slide animation completes
    
    // Phase 4: Complete reformation
    const completeTimer = setTimeout(() => {
      setIsReforming(false);
      setIsAnimating(false);
    }, 1600 + (activePattern.length * 150)); // Allow all boxes to appear
    
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(reformTimer);
      clearTimeout(completeTimer);
    };
  }, [activeMeter.id, activePattern.length]);

  return (
    <div 
      className="relative h-[140px] bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 shadow-lg"
      style={{ width: `${patternWidth}px` }}
    >
      {/* Film reel: Continuous sliding window */}
      <div
        className="absolute top-0 h-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: `${repeatedSequence.length * unitWidth}px`,
          transform: `translateX(${currentOffset * unitWidth}px)`,
          right: `-${sequenceLength * unitWidth}px`,
        }}
      >
        {repeatedSequence.map((unit, index) => (
          <div
            key={index}
            className="absolute top-0 h-full flex items-center justify-center"
            style={{
              right: `${index * unitWidth}px`,
              width: `${unitWidth}px`,
            }}
          >
            <span className="text-3xl font-mono select-none text-gray-500 transition-colors duration-300" dir="ltr">
              {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Pattern groupings with disintegration/reformation animations */}
      {showGroupings && (
        <div 
          className={`absolute top-0 w-full h-full transition-all duration-500 ease-out ${
            isDisintegrating 
              ? 'opacity-0 scale-95 blur-sm' 
              : isReforming 
                ? 'opacity-100 scale-100 blur-0 animate-pulse' 
                : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {(() => {
            let cursorInPatternUnits = 0;
            return activePattern.map((tafila, tafilaIndex) => {
              const groupSize = activeMeter.parsingInstructions[tafilaIndex];
              const width = groupSize * unitWidth;
              const rightPosition = cursorInPatternUnits * unitWidth;
              
              cursorInPatternUnits += groupSize;

              return (
                <div
                  key={`group-${tafilaIndex}-${activeMeter.id}`}
                  className={`absolute top-0 h-full flex flex-col transition-all duration-700 ease-out ${
                    isReforming 
                      ? 'transform translate-y-0 opacity-100' 
                      : ''
                  }`}
                  style={{
                    right: `${rightPosition}px`,
                    width: `${width}px`,
                    animationDelay: isReforming ? `${tafilaIndex * 150}ms` : '0ms',
                  }}
                >
                  {/* Highlighting overlay for grouped atomic units - right to left appearance */}
                  <div 
                    className={`absolute rounded-lg transition-all duration-300 ease-out ${
                      visibleBoxes[tafilaIndex] 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-75'
                    } ${
                      isDisintegrating
                        ? 'opacity-0 scale-50'
                        : ''
                    }`}
                    style={{
                      top: '40px',
                      height: '60px',
                      left: '50%',
                      width: `${width}px`,
                      transform: 'translateX(-50%)',
                      transformOrigin: 'center center',
                      backgroundColor: circle?.visualTheme.accentColor ? `${circle.visualTheme.accentColor}15` : '#F59E0B15',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: circle?.visualTheme.accentColor || '#F59E0B',
                    }}
                  />

                  {/* SVG brace connector - upward-pointing curly brace */}
                  <div 
                    className={`absolute w-full flex items-center justify-center transition-all duration-300 ease-out ${
                      visibleBoxes[tafilaIndex]
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-90'
                    } ${
                      isDisintegrating
                        ? 'opacity-0 scale-75'
                        : ''
                    }`}
                    style={{
                      top: '102px',
                      height: '8px'
                    }}
                  >
                    <svg 
                      width={width} 
                      height="8" 
                      viewBox={`0 0 ${width} 8`}
                      className="overflow-visible"
                    >
                      <path
                        d={`M 5 8 Q ${width/4} 0 ${width/2} 2 Q ${3*width/4} 0 ${width-5} 8`}
                        fill="none"
                        stroke={circle?.visualTheme.accentColor || '#F59E0B'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  
                  {/* Tafila text - positioned lower to give more space */}
                  <div 
                    className="absolute w-full flex items-center justify-center"
                    style={{
                      top: '110px',
                      height: '30px'
                    }}
                  >
                    <span 
                      className={`font-amiri text-xl md:text-2xl tracking-wide font-bold transition-all duration-300 ease-out ${
                        visibleBoxes[tafilaIndex]
                          ? 'opacity-100 scale-100 translate-y-0' 
                          : 'opacity-0 scale-90 translate-y-2'
                      } ${
                        isDisintegrating
                          ? 'opacity-0 scale-75 translate-y-1'
                          : ''
                      }`}
                      style={{
                        transitionDelay: visibleBoxes[tafilaIndex] ? '100ms' : '0ms',
                        color: circle?.visualTheme.primaryColor || '#FDE68A',
                      }}
                    >
                      {tafila.merged}
                    </span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
};

export default ArudBanner;