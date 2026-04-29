// Phase 4: app-wide active role context. The product itself is one shared
// system; the active role just changes priorities and recommendation surfaces.
// Switching is instant — no permission denial pages, no full re-renders, just
// reordered modules and a few capability-gated affordances.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, TeamMember, teamMembers, getMembersByRole, can, Capability } from '../data/team';

interface RoleContextValue {
  activeRole: Role;
  activeMember: TeamMember;
  setActiveRole: (role: Role) => void;
  cycleRole: () => void;
  hasCapability: (cap: Capability) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const ROLE_ORDER: Role[] = ['executive', 'fundraising', 'communications', 'policy', 'program', 'operations'];

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>('communications');

  const activeMember =
    getMembersByRole(activeRole)[0] || teamMembers[0];

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
  }, []);

  const cycleRole = useCallback(() => {
    setActiveRoleState((prev) => {
      const idx = ROLE_ORDER.indexOf(prev);
      return ROLE_ORDER[(idx + 1) % ROLE_ORDER.length];
    });
  }, []);

  const hasCapability = useCallback(
    (cap: Capability) => can(activeRole, cap),
    [activeRole]
  );

  return (
    <RoleContext.Provider value={{ activeRole, activeMember, setActiveRole, cycleRole, hasCapability }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}
