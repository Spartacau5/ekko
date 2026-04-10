export interface WatchlistItem {
  policyId: string;
  addedDate: string;
  addedBy: string;
  notes?: string;
  alertsEnabled: boolean;
  lastAlertDate?: string;
  alertCount: number;
}

export interface PolicyAlert {
  id: string;
  policyId: string;
  policyTitle: string;
  type: 'status_change' | 'hearing_scheduled' | 'amendment' | 'new_stakeholder' | 'media_mention' | 'committee_action' | 'effective_date_set';
  title: string;
  description: string;
  date: string;
  isUnread: boolean;
  severity: 'info' | 'warning' | 'urgent';
}

export const watchlist: WatchlistItem[] = [
  {
    policyId: 'right-to-counsel',
    addedDate: '2026-01-15',
    addedBy: 'Sofia Reyes',
    notes: 'Top priority. Coordinate with advocacy team on testimony prep.',
    alertsEnabled: true,
    lastAlertDate: '2026-04-08',
    alertCount: 6,
  },
  {
    policyId: 'rental-assistance-reporting',
    addedDate: '2025-12-20',
    addedBy: 'Sofia Reyes',
    notes: 'Operations and finance must complete workflow audit before May 2026.',
    alertsEnabled: true,
    lastAlertDate: '2026-04-05',
    alertCount: 9,
  },
  {
    policyId: 'anti-eviction-funding',
    addedDate: '2026-03-15',
    addedBy: 'Sofia Reyes',
    notes: 'Apply ASAP. Application window closes May 15.',
    alertsEnabled: true,
    lastAlertDate: '2026-04-09',
    alertCount: 4,
  },
  {
    policyId: 'tenant-data-privacy',
    addedDate: '2026-03-18',
    addedBy: 'Sofia Reyes',
    notes: 'Monitor. Legal team to review draft language.',
    alertsEnabled: true,
    lastAlertDate: '2026-04-02',
    alertCount: 2,
  },
];

export const policyAlerts: PolicyAlert[] = [
  {
    id: 'alert-rtc-1',
    policyId: 'right-to-counsel',
    policyTitle: 'NYC Right-to-Counsel Expansion',
    type: 'hearing_scheduled',
    title: 'Public hearing scheduled for April 22',
    description: 'NYC Council Housing Committee will hold public testimony session. Submission deadline April 15.',
    date: '2026-04-08',
    isUnread: true,
    severity: 'urgent',
  },
  {
    id: 'alert-rar-1',
    policyId: 'rental-assistance-reporting',
    policyTitle: 'Federal Rental Assistance Reporting Change',
    type: 'effective_date_set',
    title: 'Effective date confirmed: May 15, 2026',
    description: 'HUD published implementation guidance with detailed reporting templates. Internal audit needed within 30 days.',
    date: '2026-04-05',
    isUnread: true,
    severity: 'urgent',
  },
  {
    id: 'alert-aef-1',
    policyId: 'anti-eviction-funding',
    policyTitle: 'City Anti-Eviction Emergency Funding',
    type: 'committee_action',
    title: 'Funding applications now open',
    description: 'Application window: April 9 \u2013 May 15. Eligible orgs may request up to $250K for direct tenant services.',
    date: '2026-04-09',
    isUnread: true,
    severity: 'warning',
  },
  {
    id: 'alert-rtc-2',
    policyId: 'right-to-counsel',
    policyTitle: 'NYC Right-to-Counsel Expansion',
    type: 'amendment',
    title: 'Income threshold amendment proposed',
    description: 'Council Member Rodriguez proposed raising income eligibility threshold to 250% federal poverty level. Coalition response needed.',
    date: '2026-03-15',
    isUnread: false,
    severity: 'info',
  },
  {
    id: 'alert-rar-2',
    policyId: 'rental-assistance-reporting',
    policyTitle: 'Federal Rental Assistance Reporting Change',
    type: 'media_mention',
    title: 'NYT coverage: nonprofit compliance burden',
    description: 'New York Times article highlights administrative burden on smaller orgs. Op-ed opportunity for Sofia.',
    date: '2026-03-28',
    isUnread: false,
    severity: 'info',
  },
  {
    id: 'alert-zr-1',
    policyId: 'zoning-reform',
    policyTitle: 'Regional Zoning Reform Proposal',
    type: 'new_stakeholder',
    title: 'New stakeholder activity detected',
    description: 'Regional Land Use Board published draft scoping schedule. Public comment period opens May 1.',
    date: '2026-04-01',
    isUnread: true,
    severity: 'info',
  },
  {
    id: 'alert-tdp-1',
    policyId: 'tenant-data-privacy',
    policyTitle: 'State Tenant Data Privacy Bill',
    type: 'committee_action',
    title: 'Subcommittee hearing held',
    description: 'Expert testimony covered data minimization standards. Final committee vote expected within 4 weeks.',
    date: '2026-04-02',
    isUnread: false,
    severity: 'info',
  },
  {
    id: 'alert-aef-2',
    policyId: 'anti-eviction-funding',
    policyTitle: 'City Anti-Eviction Emergency Funding',
    type: 'status_change',
    title: 'Bill signed into law',
    description: 'Mayor signed emergency funding package. Funds available immediately upon application approval.',
    date: '2026-04-05',
    isUnread: false,
    severity: 'warning',
  },
];

// Policy topics for organized browse
export interface PolicyTopic {
  id: string;
  name: string;
  description: string;
  policyCount: number;
  watchedCount: number;
  recentActivity: number;
}

export const policyTopics: PolicyTopic[] = [
  {
    id: 'tenant-protection',
    name: 'Tenant protection',
    description: 'Renter rights, eviction defense, legal aid',
    policyCount: 1,
    watchedCount: 1,
    recentActivity: 3,
  },
  {
    id: 'affordable-housing',
    name: 'Affordable housing finance',
    description: 'Tax credits, subsidies, development incentives',
    policyCount: 1,
    watchedCount: 0,
    recentActivity: 2,
  },
  {
    id: 'compliance',
    name: 'Compliance & reporting',
    description: 'Federal, state, and local reporting requirements',
    policyCount: 1,
    watchedCount: 1,
    recentActivity: 4,
  },
  {
    id: 'emergency-aid',
    name: 'Emergency aid',
    description: 'Direct relief, anti-eviction, crisis response',
    policyCount: 1,
    watchedCount: 1,
    recentActivity: 2,
  },
  {
    id: 'privacy',
    name: 'Privacy & data',
    description: 'Tenant data, surveillance, information sharing',
    policyCount: 1,
    watchedCount: 1,
    recentActivity: 2,
  },
  {
    id: 'land-use',
    name: 'Land use & zoning',
    description: 'Zoning, development, neighborhood planning',
    policyCount: 1,
    watchedCount: 0,
    recentActivity: 2,
  },
];
