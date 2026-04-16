import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Team-level pin store. Entities (donors, policies, signals) can be pinned so
// they show up in the dashboard's "Pinned priorities" band. The store is
// in-memory — no persistence layer yet; pins reset on reload, same as the
// rest of the demo prototype state.

export type PinTargetType = 'donor' | 'policy' | 'signal';

export interface PinRecord {
  type: PinTargetType;
  id: string;
  pinnedBy: string; // team member display name
  pinnedAt: string; // ISO timestamp
}

interface PinContextValue {
  pins: PinRecord[];
  isPinned: (type: PinTargetType, id: string) => boolean;
  togglePin: (type: PinTargetType, id: string, pinnedBy: string) => boolean; // returns next pinned state
}

const PinContext = createContext<PinContextValue | null>(null);

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [pins, setPins] = useState<PinRecord[]>([]);

  const isPinned = useCallback(
    (type: PinTargetType, id: string) => pins.some((p) => p.type === type && p.id === id),
    [pins]
  );

  const togglePin = useCallback(
    (type: PinTargetType, id: string, pinnedBy: string) => {
      let nextPinned = false;
      setPins((prev) => {
        const exists = prev.some((p) => p.type === type && p.id === id);
        if (exists) {
          nextPinned = false;
          return prev.filter((p) => !(p.type === type && p.id === id));
        }
        nextPinned = true;
        return [...prev, { type, id, pinnedBy, pinnedAt: new Date().toISOString() }];
      });
      return nextPinned;
    },
    []
  );

  const value = useMemo<PinContextValue>(() => ({ pins, isPinned, togglePin }), [pins, isPinned, togglePin]);

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
}

export function usePins(): PinContextValue {
  const ctx = useContext(PinContext);
  if (!ctx) throw new Error('usePins must be used inside <PinProvider>');
  return ctx;
}
