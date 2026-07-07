
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from './Icons';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  isPlaying: boolean;
}

// RTL layout: the first child renders on the RIGHT. Previous sits on the
// right with a right-pointing chevron; Next sits on the LEFT with a
// left-pointing chevron, moving the sequence forward for RTL readers.
const Controls: React.FC<ControlsProps> = ({ onPrev, onNext, onPlay, isPlaying }) => {
  return (
    <div className="relative flex items-center justify-center gap-8 bg-gray-900/60 backdrop-blur-xl px-10 py-5 rounded-full border border-white/10 shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:shadow-amber-900/20 hover:border-amber-500/30">
      <button
        onClick={onPrev}
        className="p-4 rounded-full hover:bg-white/5 active:bg-white/10 text-gray-400 hover:text-amber-400 transition-all duration-200 group"
        aria-label="Previous Meter"
      >
        <ChevronRightIcon className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
      </button>

      <button
        onClick={onPlay}
        className="relative p-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isPlaying ? (
          <PauseIcon className="w-8 h-8 fill-current drop-shadow-sm" />
        ) : (
          <PlayIcon className="w-8 h-8 fill-current ml-1 drop-shadow-sm" />
        )}
      </button>

      <button
        onClick={onNext}
        className="p-4 rounded-full hover:bg-white/5 active:bg-white/10 text-gray-400 hover:text-amber-400 transition-all duration-200 group"
        aria-label="Next Meter"
      >
        <ChevronLeftIcon className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default Controls;
