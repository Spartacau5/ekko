// Phase 4: team members, roles, and capability map.
// Replaces the older flat list in organization.ts. The Phase 4 product is
// role-aware, so every member belongs to one of the five primary roles below.

export type Role =
  | 'executive'
  | 'fundraising'
  | 'communications'
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
    label: 'Fundraising Director',
    short: 'Fundraising',
    description: 'Donor relationships, retention, campaign performance',
    focus: 'Sees donor risk, next steps, and fundraising trends first.',
  },
  communications: {
    id: 'communications',
    label: 'Communications Specialist',
    short: 'Communications',
    description: 'Donor messaging, campaign storytelling, stakeholder comms',
    focus: 'Sees donor messaging opportunities and campaign storytelling cues first.',
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
  /** Public path to a head-cropped illustration used by <Avatar />. */
  imageUrl?: string;
}

const ROLE_ILLUSTRATION: Record<Role, string> = {
  executive:      '/images/onboarding/roles/executive-director.png',
  fundraising:    '/images/onboarding/roles/fundraising-coordinator.png',
  communications: '/images/onboarding/roles/communications-specialist.png',
  policy:         '/images/onboarding/roles/other.png',
  program:        '/images/onboarding/roles/program-manager.png',
  operations:     '/images/onboarding/roles/operator.png',
};

export function imageForRole(role: Role): string {
  return ROLE_ILLUSTRATION[role];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'ana-rodriguez',
    name: 'Ana Rodriguez',
    role: 'executive',
    title: 'Executive Director',
    email: 'ana@providefoodnyc.org',
    phone: '(212) 555-0100',
    joinedDate: '2021-06-01',
    initials: 'AR',
    bio: 'Leads strategy, governance, and external partnerships across Provide Food NYC.',
    imageUrl: ROLE_ILLUSTRATION.executive,
  },
  {
    id: 'leah-kim',
    name: 'Leah Kim',
    role: 'communications',
    title: 'Communications Director',
    email: 'leah@providefoodnyc.org',
    phone: '(212) 555-0142',
    joinedDate: '2022-09-12',
    initials: 'LK',
    bio: 'Shapes donor messaging, campaign storytelling, and stakeholder comms.',
    imageUrl: ROLE_ILLUSTRATION.communications,
  },
  {
    id: 'hannah-win',
    name: 'Hannah Win',
    role: 'fundraising',
    title: 'Fundraising Director',
    email: 'hannah@providefoodnyc.org',
    phone: '(212) 555-0165',
    joinedDate: '2023-01-09',
    initials: 'HW',
    bio: 'Owns the major-gifts pipeline, donor stewardship, and annual campaigns.',
    imageUrl: ROLE_ILLUSTRATION.fundraising,
  },
  {
    id: 'noah-stein',
    name: 'Noah Stein',
    role: 'policy',
    title: 'Policy & Advocacy Lead',
    email: 'noah@providefoodnyc.org',
    phone: '(212) 555-0188',
    joinedDate: '2023-02-20',
    initials: 'NS',
    bio: 'Tracks legislative movement, builds coalition relationships, and runs advocacy.',
    imageUrl: ROLE_ILLUSTRATION.policy,
  },
  {
    id: 'tessa-moore',
    name: 'Tessa Moore',
    role: 'program',
    title: 'Program Manager',
    email: 'tessa@providefoodnyc.org',
    phone: '(718) 555-0210',
    joinedDate: '2023-05-08',
    initials: 'TM',
    bio: 'Coordinates direct-service programs and resident outreach across boroughs.',
    imageUrl: ROLE_ILLUSTRATION.program,
  },
  {
    id: 'marcus-bell',
    name: 'Marcus Bell',
    role: 'operations',
    title: 'Operations & Admin',
    email: 'marcus@providefoodnyc.org',
    phone: '(212) 555-0199',
    joinedDate: '2022-04-15',
    initials: 'MB',
    bio: 'Owns finance ops, integrations, compliance reporting, and team access.',
    imageUrl: ROLE_ILLUSTRATION.operations,
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
  communications: {
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
