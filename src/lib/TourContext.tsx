import React, { createContext, useCallback, useContext, useState } from 'react';
import { SpotlightTour } from '../components/tour/SpotlightTour';

interface TourContextValue {
  startTour: () => void;
  isOpen: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const startTour = useCallback(() => setIsOpen(true), []);
  const closeTour = useCallback(() => setIsOpen(false), []);

  return (
    <TourContext.Provider value={{ startTour, isOpen }}>
      {children}
      {isOpen && <SpotlightTour onClose={closeTour} />}
    </TourContext.Provider>
  );
}
