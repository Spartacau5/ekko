import React, { createContext, useCallback, useContext, useState } from 'react';

export interface RecentItem {
  type: 'donor' | 'policy' | 'peer' | 'account' | 'group';
  id: string;
  label: string;
  path: string;
  visitedAt: string;
}

interface RecentContextValue {
  recent: RecentItem[];
  trackVisit: (item: Omit<RecentItem, 'visitedAt'>) => void;
}

const RecentContext = createContext<RecentContextValue | null>(null);

const MAX_RECENT = 6;

export function RecentProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<RecentItem[]>([]);

  const trackVisit = useCallback((item: Omit<RecentItem, 'visitedAt'>) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => !(r.type === item.type && r.id === item.id));
      return [{ ...item, visitedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  return (
    <RecentContext.Provider value={{ recent, trackVisit }}>
      {children}
    </RecentContext.Provider>
  );
}

export function useRecent() {
  const ctx = useContext(RecentContext);
  if (!ctx) throw new Error('useRecent must be used within RecentProvider');
  return ctx;
}
