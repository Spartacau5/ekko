import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { donorGroups as seedGroups, DonorGroup } from '../data/groups';

interface NewGroupInput {
  name: string;
  description: string;
  memberIds: string[];
}

interface GroupsContextValue {
  groups: DonorGroup[];
  deleteMany: (ids: string[]) => void;
  addGroup: (input: NewGroupInput) => DonorGroup;
  setMembers: (groupId: string, memberIds: string[]) => void;
  dismissRecommendation: (groupId: string) => void;
  isRecommendationDismissed: (groupId: string) => boolean;
}

const GroupsContext = createContext<GroupsContextValue | null>(null);

// Session-scoped. Everything resets on reload.
export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<DonorGroup[]>(seedGroups);
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(() => new Set());

  const deleteMany = useCallback((ids: string[]) => {
    setGroups((prev) => prev.filter((g) => !ids.includes(g.id)));
  }, []);

  const addGroup = useCallback((input: NewGroupInput): DonorGroup => {
    const id = `group-${Date.now().toString(36)}`;
    const today = new Date().toISOString().slice(0, 10);
    const newGroup: DonorGroup = {
      id,
      name: input.name,
      description: input.description,
      type: 'segment',
      memberCount: input.memberIds.length,
      totalLifetime: 0,
      avgGift: 0,
      createdBy: 'You',
      createdDate: today,
      lastUpdated: today,
      tags: [],
      topInterests: [],
      memberIds: input.memberIds,
      growthLast90: 0,
      engagementScore: 50,
      membersDelta: 0,
      lifetimeDelta: 0,
      avgGiftDelta: 0,
      engagementDelta: 0,
      givingTrend: [0, 0, 0, 0],
      recommendedAction: 'Set up a welcome email for this new group so members hear from you first.',
    };
    setGroups((prev) => [newGroup, ...prev]);
    return newGroup;
  }, []);

  const setMembers = useCallback((groupId: string, memberIds: string[]) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberIds, memberCount: memberIds.length } : g,
      ),
    );
  }, []);

  const dismissRecommendation = useCallback((groupId: string) => {
    setDismissedRecs((prev) => {
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
  }, []);

  const isRecommendationDismissed = useCallback(
    (groupId: string) => dismissedRecs.has(groupId),
    [dismissedRecs],
  );

  const value = useMemo(
    () => ({
      groups,
      deleteMany,
      addGroup,
      setMembers,
      dismissRecommendation,
      isRecommendationDismissed,
    }),
    [groups, deleteMany, addGroup, setMembers, dismissRecommendation, isRecommendationDismissed],
  );

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroups() {
  const ctx = useContext(GroupsContext);
  if (!ctx) throw new Error('useGroups must be used within GroupsProvider');
  return ctx;
}
