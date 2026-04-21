import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Session-scoped policy notification subscriptions. When a user clicks
// "Follow for updates" on a policy detail page, the id lands here and
// drives the visible "Following" state across the app.

interface PolicyFollowContextValue {
  followedIds: Set<string>;
  isFollowing: (policyId: string) => boolean;
  toggleFollowing: (policyId: string) => boolean;
}

const PolicyFollowContext = createContext<PolicyFollowContextValue | null>(null);

export function PolicyFollowProvider({ children }: { children: React.ReactNode }) {
  const [followedIds, setFollowedIds] = useState<Set<string>>(() => new Set());

  const isFollowing = useCallback((policyId: string) => followedIds.has(policyId), [followedIds]);

  const toggleFollowing = useCallback((policyId: string): boolean => {
    let nextState = false;
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(policyId)) {
        next.delete(policyId);
        nextState = false;
      } else {
        next.add(policyId);
        nextState = true;
      }
      return next;
    });
    return nextState;
  }, []);

  const value = useMemo(
    () => ({ followedIds, isFollowing, toggleFollowing }),
    [followedIds, isFollowing, toggleFollowing],
  );

  return <PolicyFollowContext.Provider value={value}>{children}</PolicyFollowContext.Provider>;
}

export function usePolicyFollow() {
  const ctx = useContext(PolicyFollowContext);
  if (!ctx) throw new Error('usePolicyFollow must be used within PolicyFollowProvider');
  return ctx;
}
