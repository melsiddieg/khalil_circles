
import React, { useState, useCallback } from 'react';
import { parseMeterPattern, ALL_CIRCLES } from './constants';
import CircleHub from './components/CircleHub';
import CircleView from './components/CircleView';
import InfoCard from './components/InfoCard';
import { Circle, AppState } from './types';

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

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {appState.currentView === 'hub' ? (
        <>
          <InfoCard />
          <CircleHub onCircleSelect={handleCircleSelect} />
        </>
      ) : selectedCircle ? (
        <CircleView 
          circle={selectedCircle}
          onBackToHub={handleBackToHub}
        />
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
    </div>
  );
};

export default App;
