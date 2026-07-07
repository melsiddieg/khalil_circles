
import React, { useState, useCallback, useEffect } from 'react';
import { ALL_CIRCLES } from './constants';
import { trackPageview, trackEvent } from './utils/analytics';
import CircleHub from './components/CircleHub';
import CircleView from './components/CircleView';
import CompareView from './components/CompareView';
import DialView from './components/DialView';
import MathView from './components/MathView';
import ScanView from './components/ScanView';
import InfoCard from './components/InfoCard';
import LanguageToggle from './components/LanguageToggle';
import TourOverlay from './components/TourOverlay';
import { TOUR_STEPS } from './tour/tourSteps';
import { Circle, AppState } from './types';

const TOUR_SEEN_KEY = 'arud-tour-seen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'hub',
    selectedCircleId: undefined,
    selectedMeterIndex: 0
  });

  const handleCircleSelect = useCallback((circle: Circle) => {
    setAppState({
      currentView: 'circle',
      selectedCircleId: circle.id,
      selectedMeterIndex: 0
    });
  }, []);

  // Deep-link directly to a specific meter inside a circle (used by search).
  const handleMeterSelect = useCallback((circleId: string, meterIndex: number) => {
    setAppState({
      currentView: 'circle',
      selectedCircleId: circleId,
      selectedMeterIndex: meterIndex
    });
  }, []);

  const handleMeterChange = useCallback((meterIndex: number) => {
    setAppState((prev) => ({ ...prev, selectedMeterIndex: meterIndex }));
  }, []);

  const handleCompare = useCallback(() => {
    setAppState({ currentView: 'compare', selectedCircleId: undefined, selectedMeterIndex: 0 });
  }, []);

  const handleShowView = useCallback((view: 'dial' | 'math' | 'scan') => {
    setAppState({ currentView: view, selectedCircleId: undefined, selectedMeterIndex: 0 });
  }, []);

  const [tourStep, setTourStep] = useState<number | null>(null);

  const applyTourStep = useCallback((index: number) => {
    const action = TOUR_STEPS[index]?.action;
    if (action) {
      if (action.view === 'hub') {
        setAppState({ currentView: 'hub', selectedCircleId: undefined, selectedMeterIndex: 0 });
      } else {
        setAppState({
          currentView: 'circle',
          selectedCircleId: action.circleId,
          selectedMeterIndex: action.meterIndex
        });
      }
    }
    setTourStep(index);
  }, []);

  const handleStartTour = useCallback(() => {
    trackEvent('tour_start');
    applyTourStep(0);
  }, [applyTourStep]);

  const handleExitTour = useCallback(() => {
    trackEvent('tour_exit', { step: tourStep ?? 0 });
    setTourStep(null);
    try {
      localStorage.setItem(TOUR_SEEN_KEY, '1');
    } catch {
      // Preference just won't persist.
    }
  }, [tourStep]);

  const handleBackToHub = useCallback(() => {
    setAppState({
      currentView: 'hub',
      selectedCircleId: undefined,
      selectedMeterIndex: 0
    });
  }, []);

  // Get selected circle for circle view
  const selectedCircle = appState.selectedCircleId ?
    ALL_CIRCLES.find((c: Circle) => c.id === appState.selectedCircleId) : null;

  // Virtual pageviews for SPA navigation
  useEffect(() => {
    const path =
      appState.currentView === 'hub'
        ? '/'
        : appState.currentView === 'circle'
          ? `/circle/${appState.selectedCircleId}/${appState.selectedMeterIndex ?? 0}`
          : `/${appState.currentView}`;
    trackPageview(path);
  }, [appState.currentView, appState.selectedCircleId, appState.selectedMeterIndex]);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <LanguageToggle />
      {appState.currentView === 'hub' ? (
        <div key="hub" className="animate-view-fade w-full flex flex-col items-center">
          <InfoCard />
          <CircleHub
            onCircleSelect={handleCircleSelect}
            onMeterSelect={handleMeterSelect}
            onCompare={handleCompare}
            onStartTour={handleStartTour}
            onShowView={handleShowView}
          />
        </div>
      ) : appState.currentView === 'compare' ? (
        <div key="compare" className="animate-view-fade w-full">
          <CompareView onBackToHub={handleBackToHub} />
        </div>
      ) : appState.currentView === 'dial' ? (
        <div key="dial" className="animate-view-fade w-full">
          <DialView onBackToHub={handleBackToHub} />
        </div>
      ) : appState.currentView === 'math' ? (
        <div key="math" className="animate-view-fade w-full">
          <MathView onBackToHub={handleBackToHub} />
        </div>
      ) : appState.currentView === 'scan' ? (
        <div key="scan" className="animate-view-fade w-full">
          <ScanView onBackToHub={handleBackToHub} />
        </div>
      ) : selectedCircle ? (
        <div key={selectedCircle.id} className="animate-view-fade w-full">
          <CircleView
            circle={selectedCircle}
            currentMeterIndex={appState.selectedMeterIndex ?? 0}
            onMeterChange={handleMeterChange}
            onBackToHub={handleBackToHub}
          />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-400">Error: Circle not found</p>
          <button
            onClick={handleBackToHub}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Return to Hub
          </button>
        </div>
      )}

      {tourStep !== null && (
        <TourOverlay stepIndex={tourStep} onStepChange={applyTourStep} onExit={handleExitTour} />
      )}
    </div>
  );
};

export default App;
