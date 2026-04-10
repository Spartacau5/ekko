// Phase 4: team members, roles, and capability map.
// Replaces the older flat list in organization.ts. The Phase 4 product is
// role-aware, so every member belongs to one of the five primary roles below.

export type Role =
  | 'executive'
  | 'fundraising'
  | 'policy'
  | 'program'
  | 'operations';

export interface RoleMeta {
  id: Role;
  label: string;
  short: string;
  description: string;
  focus: string;
}

export const roleMeta: Record<Role, RoleMeta> = {
  executive: {
    id: 'executive',
    label: 'Executive Director',
    short: 'Executive',
    description: 'Cross-functional overview, top risks, board reporting',
    focus: 'Sees the whole picture across people, policy, programs, and peers.',
  },
  fundraising: {
    id: 'fundraising',
    label: 'Development Lead',
    short: 'Development',
    description: 'Donor relationships, retention, campaign performance',
    focus: 'Sees donor risk, next steps, and fundraising trends first.',
  },
  policy: {
    id: 'policy',
    label: 'Policy Lead',
    short: 'Policy',
    description: 'Watchlist, hearings, advocacy actions',
    focus: 'Sees policy movement, stakeholder shifts, and advocacy deadlines first.',
  },
  program: {
    id: 'program',
    label: 'Program Manager',
    short: 'Program',
    description: 'Resident impact, operational signals, community implications',
    focus: 'Sees impact-related alerts and operational recommendations first.',
  },
  operations: {
    id: 'operations',
    label: 'Operations & Admin',
    short: 'Operations',
    description: 'Compliance, integrations, permissions, data hygiene',
    focus: 'Sees setup, compliance, integrations, and governance tasks first.',
  },
};

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  title: string;
  email: string;
  phone?: string;
  joinedDate: string;
  initials: string;
  bio?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'ana-rodriguez',
    name: 'Ana Rodriguez',
    role: 'executive',
    title: 'Executive Director',
    email: 'ana@rivergate.org',
    phone: '(212) 555-0100',
    joinedDate: '2021-06-01',
    initials: 'AR',
    bio: 'Leads strategy, governance, and external partnerships across Rivergate.',
  },
  {
    id: 'leah-kim',
    name: 'Leah Kim',
    role: 'fundraising',
    title: 'Development Lead',
    email: 'leah@rivergate.org',
    phone: '(212) 555-0142',
    joinedDate: '2022-09-12',
    initials: 'LK',
    bio: 'Owns the major-gifts pipeline, donor stewardship, and annual campaigns.',
  },
  {
    id: 'noah-stein',
    name: 'Noah Stein',
    role: 'policy',
    title: 'Policy & Advocacy Lead',
    email: 'noah@rivergate.org',
    phone: '(212) 555-0188',
    joinedDate: '2023-02-20',
    initials: 'NS',
    bio: 'Tracks legislative movement, builds coalition relationships, and runs advocacy.',
  },
  {
    id: 'tessa-moore',
    name: 'Tessa Moore',
    role: 'program',
    title: 'Program Manager',
    email: 'tessa@rivergate.org',
    phone: '(718) 555-0210',
    joinedDate: '2023-05-08',
    initials: 'TM',
    bio: 'Coordinates direct-service programs and resident outreach across boroughs.',
  },
  {
    id: 'marcus-bell',
    name: 'Marcus Bell',
    role: 'operations',
    title: 'Operations & Admin',
    email: 'marcus@rivergate.org',
    phone: '(212) 555-0199',
    joinedDate: '2022-04-15',
    initials: 'MB',
    bio: 'Owns finance ops, integrations, compliance reporting, and team access.',
  },
];

export function getTeamMember(id: string): TeamMember | undefined {
  return teamMembers.find((m) => m.id === id);
}

export function getMembersByRole(role: Role): TeamMember[] {
  return teamMembers.filter((m) => m.role === role);
}

// Capability matrix — what each role can do in the workspace.
// Used by the PermissionMatrix in Settings and to gate edit affordances
// across the product (we still show the surface, just disable edit/assign
// when the active role lacks the capability).
export type Capability =
  | 'viewAll'
  | 'editDonors'
  | 'assignActions'
  | 'exportData'
  | 'manageWatchlist'
  | 'manageTeam'
  | 'manageIntegrations'
  | 'managePeerSharing'
  | 'manageAi'
  | 'manageBilling';

export const capabilityLabels: Record<Capability, string> = {
  viewAll: 'View all surfaces',
  editDonors: 'Edit donor records',
  assignActions: 'Assign actions to others',
  exportData: 'Export data',
  manageWatchlist: 'Manage shared watchlists',
  manageTeam: 'Manage team & roles',
  manageIntegrations: 'Manage integrations',
  managePeerSharing: 'Configure peer sharing',
  manageAi: 'Configure AI & privacy',
  manageBilling: 'Manage billing',
};

export const rolePermissions: Record<Role, Record<Capability, boolean>> = {
  executive: {
    viewAll: true,
    editDonors: true,
    assignActions: true,
    exportData: true,
    manageWatchlist: true,
    manageTeam: true,
    manageIntegrations: true,
    managePeerSharing: true,
    manageAi: true,
    manageBilling: true,
  },
  fundraising: {
    viewAll: true,
    editDonors: true,
    assignActions: true,
    exportData: true,
    manageWatchlist: true,
    manageTeam: false,
    manageIntegrations: false,
    managePeerSharing: false,
    manageAi: false,
    manageBilling: false,
  },
  policy: {
    viewAll: true,
    editDonors: false,
    assignActions: true,
    exportData: true,
    manageWatchlist: true,
    manageTeam: false,
    manageIntegrations: false,
    managePeerSharing: false,
    manageAi: false,
    manageBilling: false,
  },
  program: {
    viewAll: true,
    editDonors: false,
    assignActions: true,
    exportData: false,
    manageWatchlist: false,
    manageTeam: false,
    manageIntegrations: false,
    managePeerSharing: false,
    manageAi: false,
    manageBilling: false,
  },
  operations: {
    viewAll: true,
    editDonors: false,
    assignActions: true,
    exportData: true,
    manageWatchlist: false,
    manageTeam: true,
    manageIntegrations: true,
    managePeerSharing: true,
    manageAi: true,
    manageBilling: true,
  },
};

export function can(role: Role, capability: Capability): boolean {
  return rolePermissions[role][capability];
}
