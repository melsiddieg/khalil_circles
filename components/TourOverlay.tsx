import React, { useEffect, useRef, useState } from 'react';
import { TOUR_STEPS } from '../tour/tourSteps';
import { useLanguage } from '../i18n/LanguageContext';

interface TourOverlayProps {
  stepIndex: number;
  onStepChange: (index: number) => void;
  onExit: () => void;
}

interface SpotRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const SPOT_PADDING = 12;

const TourOverlay: React.FC<TourOverlayProps> = ({ stepIndex, onStepChange, onExit }) => {
  const { t, dir } = useLanguage();
  const [spot, setSpot] = useState<SpotRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  // Locate the spotlight target after the step's navigation has rendered.
  // Poll briefly because view transitions mount targets asynchronously.
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const locate = () => {
      if (cancelled) return;
      const el = step.targetId ? document.getElementById(step.targetId) : null;
      if (el) {
        const r = el.getBoundingClientRect();
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setSpot({
          top: r.top - SPOT_PADDING,
          left: r.left - SPOT_PADDING,
          width: r.width + SPOT_PADDING * 2,
          height: r.height + SPOT_PADDING * 2,
        });
      } else if (step.targetId && attempts < 10) {
        attempts += 1;
        setTimeout(locate, 150);
        return;
      } else {
        setSpot(null);
      }
    };

    // Give the target's view a moment to mount, then track resizes/scrolls.
    const initial = setTimeout(locate, 250);
    const refresh = () => locate();
    window.addEventListener('resize', refresh);
    window.addEventListener('scroll', refresh, true);
    return () => {
      cancelled = true;
      clearTimeout(initial);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh, true);
    };
  }, [step]);

  // Escape exits; keep focus on the card.
  useEffect(() => {
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepIndex, onExit]);

  return (
    <div className="fixed inset-0 z-[70]" dir={dir}>
      {/* Spotlight: a transparent hole punched by an enormous shadow */}
      {spot ? (
        <div
          className="absolute rounded-2xl transition-all duration-500 ease-out pointer-events-none"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: '0 0 0 9999px rgba(3, 7, 18, 0.8)',
            border: '2px solid rgba(251, 191, 36, 0.6)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-950/80" />
      )}

      {/* Step card */}
      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t.tour[step.titleKey] as string}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,540px)]
                   bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl
                   shadow-2xl p-6 outline-none animate-view-fade"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-amber-300 font-amiri">{t.tour[step.titleKey] as string}</h3>
          <span className="text-xs text-gray-500 font-inter" dir="ltr">
            {t.tour.progress(String(stepIndex + 1), String(TOUR_STEPS.length))}
          </span>
        </div>
        <p className="text-gray-300 font-amiri text-base leading-relaxed mb-5">
          {t.tour[step.bodyKey] as string}
        </p>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors font-amiri"
          >
            {t.tour.skip}
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => onStepChange(stepIndex - 1)}
                className="px-4 py-2 rounded-full border border-gold-soft text-gray-300 hover:border-gold transition-colors font-amiri text-sm"
              >
                {t.tour.back}
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? onExit() : onStepChange(stepIndex + 1))}
              className="px-5 py-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 font-bold hover:shadow-amber-500/40 hover:shadow-lg transition-all font-amiri text-sm"
            >
              {isLast ? t.tour.done : t.tour.next}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4" aria-hidden="true">
          {TOUR_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourOverlay;
