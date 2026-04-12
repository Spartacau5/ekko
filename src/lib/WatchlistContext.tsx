import React, { createContext, useCallback, useContext, useState } from 'react';
import { watchlist as seedWatchlist } from '../data/watchlist';

interface WatchlistContextValue {
  watchedIds: Set<string>;
  isWatched: (policyId: string) => boolean;
  toggleWatched: (policyId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchedIds, setWatchedIds] = useState<Set<string>>(
    () => new Set(seedWatchlist.map((w) => w.policyId)),
  );

  const isWatched = useCallback((policyId: string) => watchedIds.has(policyId), [watchedIds]);

  const toggleWatched = useCallback((policyId: string): boolean => {
    let added = false;
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(policyId)) {
        next.delete(policyId);
        added = false;
      } else {
        next.add(policyId);
        added = true;
      }
      return next;
    });
    return added;
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchedIds, isWatched, toggleWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
