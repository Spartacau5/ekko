// Phase 4.5: app-wide product maturity context.
// Same product, two states. Day 0 is a guided activation workspace; Day X is
// the mature, connected, intelligence-rich experience. Switching is instant —
// pages branch on activeMaturity and re-render with reordered modules,
// different density, and different copy. Persisted to localStorage so demos
// keep their state across reloads.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Maturity = 'day0' | 'dayX';

export const maturityMeta: Record<Maturity, {
  label: string;
  short: string;
  tagline: string;
  description: string;
  setupCompletion: number;
  daysInProduct: string;
}> = {
  day0: {
    label: 'Day 0',
    short: 'Day 0',
    tagline: 'Just getting started',
    description:
      'A first-week workspace. Lighter, more guided, focused on connecting data and choosing what to track.',
    setupCompletion: 28,
    daysInProduct: 'Week 1',
  },
  dayX: {
    label: 'Day X',
    short: 'Day X',
    tagline: 'Mature & connected',
    description:
      'A mature operating workspace. Connected sources, real signals, assigned actions, and cross-feature intelligence.',
    setupCompletion: 86,
    daysInProduct: '6+ months',
  },
};

const MATURITY_ORDER: Maturity[] = ['day0', 'dayX'];

const STORAGE_KEY = 'ekko.maturity';

interface MaturityContextValue {
  activeMaturity: Maturity;
  setActiveMaturity: (m: Maturity) => void;
  cycleMaturity: () => void;
  isDay0: boolean;
  isDayX: boolean;
}

const MaturityContext = createContext<MaturityContextValue | null>(null);

function readInitial(): Maturity {
  if (typeof window === 'undefined') return 'dayX';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'day0' || stored === 'dayX') return stored;
  } catch {}
  return 'dayX';
}

export function MaturityProvider({ children }: { children: React.ReactNode }) {
  const [activeMaturity, setActiveMaturityState] = useState<Maturity>(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, activeMaturity);
    } catch {}
  }, [activeMaturity]);

  const setActiveMaturity = useCallback((m: Maturity) => {
    setActiveMaturityState(m);
  }, []);

  const cycleMaturity = useCallback(() => {
    setActiveMaturityState((prev) => {
      const idx = MATURITY_ORDER.indexOf(prev);
      return MATURITY_ORDER[(idx + 1) % MATURITY_ORDER.length];
    });
  }, []);

  return (
    <MaturityContext.Provider
      value={{
        activeMaturity,
        setActiveMaturity,
        cycleMaturity,
        isDay0: activeMaturity === 'day0',
        isDayX: activeMaturity === 'dayX',
      }}
    >
      {children}
    </MaturityContext.Provider>
  );
}

export function useMaturity(): MaturityContextValue {
  const ctx = useContext(MaturityContext);
  if (!ctx) throw new Error('useMaturity must be used inside <MaturityProvider>');
  return ctx;
}
