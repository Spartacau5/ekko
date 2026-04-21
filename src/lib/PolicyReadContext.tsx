import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { policies } from '../data/policies';

interface PolicyReadContextValue {
  isRead: (policyId: string) => boolean;
  markRead: (policyId: string) => void;
  unreadCount: number;
}

const PolicyReadContext = createContext<PolicyReadContextValue | null>(null);

// Seed: a couple of older policies start as read so the "New" chip is a
// meaningful signal on Day X rather than covering every row.
const INITIALLY_READ = new Set(['anti-eviction-funding', 'zoning-reform']);

export function PolicyReadProvider({ children }: { children: React.ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set(INITIALLY_READ));

  const isRead = useCallback((policyId: string) => readIds.has(policyId), [readIds]);

  const markRead = useCallback((policyId: string) => {
    setReadIds((prev) => {
      if (prev.has(policyId)) return prev;
      const next = new Set(prev);
      next.add(policyId);
      return next;
    });
  }, []);

  const unreadCount = useMemo(
    () => policies.filter((p) => !readIds.has(p.id)).length,
    [readIds],
  );

  return (
    <PolicyReadContext.Provider value={{ isRead, markRead, unreadCount }}>
      {children}
    </PolicyReadContext.Provider>
  );
}

export function usePolicyRead() {
  const ctx = useContext(PolicyReadContext);
  if (!ctx) throw new Error('usePolicyRead must be used within PolicyReadProvider');
  return ctx;
}
