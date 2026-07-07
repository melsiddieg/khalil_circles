
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  isPlaying: boolean;
}

// Direction-relative layout: the first child renders on the reading-start
// side (right in RTL, left in LTR). Previous always sits on the start side
// with a backward-pointing chevron; Next sits on the end side pointing
// forward, so the sequence always advances in the reading direction.
const Controls: React.FC<ControlsProps> = ({ onPrev, onNext, onPlay, isPlaying }) => {
  const { t, dir } = useLanguage();
  const Backward = dir === 'rtl' ? ChevronRightIcon : ChevronLeftIcon;
  const Forward = dir === 'rtl' ? ChevronLeftIcon : ChevronRightIcon;
  const backwardHover =
    dir === 'rtl' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1';
  const forwardHover =
    dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1';

  return (
    <div className="relative flex items-center justify-center gap-8 bg-gray-900/60 backdrop-blur-xl px-10 py-5 rounded-full border border-white/10 shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:shadow-amber-900/20 hover:border-amber-500/30">
      <button
        onClick={onPrev}
        className="p-4 rounded-full hover:bg-white/5 active:bg-white/10 text-gray-400 hover:text-amber-400 transition-all duration-200 group"
        aria-label={t.controls.prev}
      >
        <Backward className={`w-8 h-8 ${backwardHover} transition-transform`} />
      </button>

      <button
        onClick={onPlay}
        className="relative p-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label={isPlaying ? t.controls.pause : t.controls.play}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isPlaying ? (
          <PauseIcon className="w-8 h-8 fill-current drop-shadow-sm" />
        ) : (
          <PlayIcon className="w-8 h-8 fill-current ms-1 drop-shadow-sm" />
        )}
      </button>

      <button
        onClick={onNext}
        className="p-4 rounded-full hover:bg-white/5 active:bg-white/10 text-gray-400 hover:text-amber-400 transition-all duration-200 group"
        aria-label={t.controls.next}
      >
        <Forward className={`w-8 h-8 ${forwardHover} transition-transform`} />
      </button>
    </div>
  );
};

export default Controls;
