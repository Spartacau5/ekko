// Phase 4.5: maturity-state data layer.
// We do NOT duplicate every data file. Instead, the existing arrays are the
// "Day X" (mature) source of truth. This module exposes filter/projection
// helpers that return a smaller, setup-oriented slice for "Day 0", along with
// a few new constructs (setup checklist, integration catalog, value previews,
// tracked-topic library) that only make sense in the early product state.

import { Maturity } from '../lib/MaturityContext';
import { donors, Donor } from './donors';
import { policies, Policy } from './policies';
import { peerOrgs, PeerOrg } from './peers';
import { actions, ActionItem } from './actions';
import { pinnedItems, PinnedItem, trackedPeers, watchlistGroups, savedCampaigns } from './workspace';
import { policyAlerts, watchlist, policyTopics } from './watchlist';
import { Role } from './team';

// ─────────────────────────────────────────────────────────────────────────────
// Org-level maturity profile
// ─────────────────────────────────────────────────────────────────────────────

export interface MaturityProfile {
  setupCompletion: number;
  daysInProduct: string;
  connectedSourcesCount: number;
  totalSourcesCount: number;
  activeUsersCount: number;
  totalSeats: number;
  donorsLoaded: number;
  policiesTracked: number;
  peersTracked: number;
  watchlistsCount: number;
  savedViewsCount: number;
  goalsDefined: boolean;
  benchmarkOptIn: boolean;
}

export const maturityProfiles: Record<Maturity, MaturityProfile> = {
  day0: {
    setupCompletion: 28,
    daysInProduct: 'Week 1',
    connectedSourcesCount: 1,
    totalSourcesCount: 6,
    activeUsersCount: 2,
    totalSeats: 8,
    donorsLoaded: 12,
    policiesTracked: 0,
    peersTracked: 0,
    watchlistsCount: 0,
    savedViewsCount: 0,
    goalsDefined: false,
    benchmarkOptIn: false,
  },
  dayX: {
    setupCompletion: 86,
    daysInProduct: '6+ months',
    connectedSourcesCount: 5,
    totalSourcesCount: 6,
    activeUsersCount: 7,
    totalSeats: 8,
    donorsLoaded: 1284,
    policiesTracked: 6,
    peersTracked: trackedPeers.length,
    watchlistsCount: watchlistGroups.length,
    savedViewsCount: 6,
    goalsDefined: true,
    benchmarkOptIn: true,
  },
};

export function profileFor(m: Maturity): MaturityProfile {
  return maturityProfiles[m];
}

// ─────────────────────────────────────────────────────────────────────────────
// Day 0 sample slices — small, illustrative
// ─────────────────────────────────────────────────────────────────────────────

const DAY0_DONOR_IDS = ['maya-patel', 'jordan-rivera', 'samuel-okafor'];
const DAY0_PEER_IDS  = ['bronx-housing', 'queens-tenant'];
// We do NOT seed Day 0 with policies or actions — those are unlocked by setup.

export function donorsForMaturity(m: Maturity): Donor[] {
  if (m === 'dayX') return donors;
  return donors.filter((d) => DAY0_DONOR_IDS.includes(d.id));
}

export function policiesForMaturity(m: Maturity): Policy[] {
  if (m === 'dayX') return policies;
  // Day 0: no policies tracked yet — page focuses on tracked-topic setup.
  return [];
}

export function peerOrgsForMaturity(m: Maturity): PeerOrg[] {
  if (m === 'dayX') return peerOrgs;
  return peerOrgs.filter((p) => DAY0_PEER_IDS.includes(p.id));
}

export function actionsForMaturity(m: Maturity): ActionItem[] {
  if (m === 'dayX') return actions;
  // Day 0: actions are setup-focused; surface only the system-checklist tasks
  // (see day0SetupActions below).
  return [];
}

export function pinsForMaturity(role: Role, m: Maturity): PinnedItem[] {
  if (m === 'dayX') {
    return pinnedItems.filter((p) => !p.roleAffinity || p.roleAffinity.includes(role));
  }
  return [];
}

export function watchlistGroupsForMaturity(m: Maturity) {
  if (m === 'dayX') return watchlistGroups;
  return [];
}

export function trackedPeersForMaturity(m: Maturity) {
  if (m === 'dayX') return trackedPeers;
  return [];
}

export function savedCampaignsForMaturity(m: Maturity) {
  if (m === 'dayX') return savedCampaigns;
  return [];
}

export function policyAlertsForMaturity(m: Maturity) {
  if (m === 'dayX') return policyAlerts;
  return [];
}

export function watchedPolicyIdsForMaturity(m: Maturity): string[] {
  if (m === 'dayX') return watchlist.map((w) => w.policyId);
  return [];
}

export function policyTopicsCatalog() {
  return policyTopics;
}

// ─────────────────────────────────────────────────────────────────────────────
// Day 0 setup model — checklist + integration catalog
// ─────────────────────────────────────────────────────────────────────────────

export type SetupTaskStatus = 'done' | 'in_progress' | 'todo';

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  status: SetupTaskStatus;
  ctaLabel: string;
  ctaLink?: string;        // internal route or null for "no link"
  estimateMinutes?: number;
  unlocks: string;         // one-line copy: what becomes available when done
}

// Day 0 setup checklist — drives Dashboard, Settings, and the SetupProgressCard.
export const day0SetupTasks: SetupTask[] = [
  {
    id: 'setup-org',
    title: 'Confirm organization profile',
    description: 'Mission area, geography, and team size — used to tailor signals.',
    status: 'done',
    ctaLabel: 'Review profile',
    ctaLink: '/settings',
    estimateMinutes: 2,
    unlocks: 'Personalized peer matching and policy filtering.',
  },
  {
    id: 'setup-crm',
    title: 'Connect Salesforce',
    description: 'Import donor records, gift history, and engagement events.',
    status: 'in_progress',
    ctaLabel: 'Resume connection',
    ctaLink: '/settings',
    estimateMinutes: 8,
    unlocks: 'At-risk donor signals, suggested next steps, full timelines.',
  },
  {
    id: 'setup-google',
    title: 'Connect Google Workspace',
    description: 'Auto-log meetings and emails into donor activity.',
    status: 'todo',
    ctaLabel: 'Connect',
    ctaLink: '/settings',
    estimateMinutes: 3,
    unlocks: 'Auto-logged meetings and email engagement on every donor.',
  },
  {
    id: 'setup-policy',
    title: 'Choose tracked policy topics',
    description: 'Pick the issues, jurisdictions, and bills Ekko should monitor.',
    status: 'todo',
    ctaLabel: 'Pick topics',
    ctaLink: '/policy',
    estimateMinutes: 4,
    unlocks: 'Real-time policy alerts and stakeholder watchlists.',
  },
  {
    id: 'setup-peers',
    title: 'Opt in to peer benchmarking',
    description: 'Share aggregated metrics anonymously to compare with similar orgs.',
    status: 'todo',
    ctaLabel: 'Review opt-in',
    ctaLink: '/peers',
    estimateMinutes: 2,
    unlocks: 'Side-by-side comparisons against similar nonprofits.',
  },
  {
    id: 'setup-goals',
    title: 'Define organizational goals',
    description: 'Set 2–3 measurable goals so Ekko can recommend actions against them.',
    status: 'todo',
    ctaLabel: 'Set goals',
    ctaLink: '/settings',
    estimateMinutes: 5,
    unlocks: 'Goal-aligned dashboards and weekly progress summaries.',
  },
  {
    id: 'setup-team',
    title: 'Invite teammates and assign roles',
    description: '2 of 8 seats used. Bring in fundraising, policy, and ops leads.',
    status: 'todo',
    ctaLabel: 'Invite team',
    ctaLink: '/settings',
    estimateMinutes: 3,
    unlocks: 'Per-role dashboards, assigned actions, and shared notes.',
  },
];

export function setupTasksForMaturity(m: Maturity): SetupTask[] {
  if (m === 'day0') return day0SetupTasks;
  // Day X: everything is done. Returned for parity, not generally rendered.
  return day0SetupTasks.map((t) => ({ ...t, status: 'done' as SetupTaskStatus }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Integration catalog — used in Day 0 connection prompts and Settings
// ─────────────────────────────────────────────────────────────────────────────

export type IntegrationStatus = 'connected' | 'in_progress' | 'not_connected';

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'CRM' | 'Email' | 'Calendar' | 'Docs' | 'Marketing' | 'Finance';
  description: string;
  unlocks: string;
  statusByMaturity: Record<Maturity, IntegrationStatus>;
}

export const integrations: IntegrationItem[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Donor records, gift history, opportunities.',
    unlocks: 'At-risk donor detection and full giving timelines.',
    statusByMaturity: { day0: 'in_progress', dayX: 'connected' },
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'Email',
    description: 'Email and calendar from your team\'s Google accounts.',
    unlocks: 'Auto-logged meetings and email engagement on every contact.',
    statusByMaturity: { day0: 'not_connected', dayX: 'connected' },
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Marketing',
    description: 'Campaign sends, opens, and click-throughs.',
    unlocks: 'Donor engagement scoring and campaign benchmarks.',
    statusByMaturity: { day0: 'not_connected', dayX: 'connected' },
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Finance',
    description: 'Gift acknowledgments, restricted funds, financial reporting.',
    unlocks: 'Reconciled lifetime giving and fund-aware reporting.',
    statusByMaturity: { day0: 'not_connected', dayX: 'connected' },
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    category: 'Docs',
    description: 'Pledge agreements and grant signatures.',
    unlocks: 'Pledge tracking on donor profiles.',
    statusByMaturity: { day0: 'not_connected', dayX: 'connected' },
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Calendar',
    description: 'Donor meetings and program calls.',
    unlocks: 'Meeting summaries on donor and peer profiles.',
    statusByMaturity: { day0: 'not_connected', dayX: 'not_connected' },
  },
];

export interface ResolvedIntegration extends IntegrationItem {
  currentStatus: IntegrationStatus;
}

export function integrationsForMaturity(m: Maturity): ResolvedIntegration[] {
  return integrations.map((i) => ({ ...i, currentStatus: i.statusByMaturity[m] }));
}

export function connectedCount(m: Maturity): { connected: number; total: number } {
  const connected = integrations.filter((i) => i.statusByMaturity[m] === 'connected').length;
  return { connected, total: integrations.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Value previews — used on Day 0 to tease what mature state offers
// ─────────────────────────────────────────────────────────────────────────────

export interface ValuePreview {
  id: string;
  surface: 'people' | 'policy' | 'peers' | 'dashboard';
  title: string;
  description: string;
  unlockedBy: string;     // human-readable: what setup step unlocks this
  exampleStat?: { label: string; value: string };
}

export const valuePreviews: ValuePreview[] = [
  {
    id: 'vp-donor-risk',
    surface: 'people',
    title: 'At-risk donor detection',
    description: 'Ekko flags donors whose engagement is slipping before they lapse, with a suggested re-engagement step.',
    unlockedBy: 'Connect Salesforce',
    exampleStat: { label: 'Avg donors flagged early per month', value: '8' },
  },
  {
    id: 'vp-donor-timeline',
    surface: 'people',
    title: 'Full engagement timelines',
    description: 'Every gift, meeting, email open, and event interaction in one chronological view per donor.',
    unlockedBy: 'Connect Google + Mailchimp',
  },
  {
    id: 'vp-policy-alerts',
    surface: 'policy',
    title: 'Live policy alerts',
    description: 'Hearings, amendments, and votes on the bills you care about, delivered to the right teammate.',
    unlockedBy: 'Pick tracked policy topics',
    exampleStat: { label: 'Avg alerts delivered weekly', value: '14' },
  },
  {
    id: 'vp-policy-stakeholders',
    surface: 'policy',
    title: 'Stakeholder alignment maps',
    description: 'See which coalitions, councilmembers, and opposition groups are behind each policy at a glance.',
    unlockedBy: 'Pick tracked policy topics',
  },
  {
    id: 'vp-peer-benchmarks',
    surface: 'peers',
    title: 'Anonymous peer benchmarks',
    description: 'See how your retention, conversion, and engagement compare to nonprofits like yours.',
    unlockedBy: 'Opt in to benchmarking',
    exampleStat: { label: 'Peer orgs in your bucket', value: '24' },
  },
  {
    id: 'vp-peer-campaigns',
    surface: 'peers',
    title: 'Campaign intelligence library',
    description: 'Browse messaging, channel mix, and themes from peer campaigns that beat sector averages.',
    unlockedBy: 'Opt in to benchmarking',
  },
  {
    id: 'vp-dashboard-priorities',
    surface: 'dashboard',
    title: 'Role-aware priorities',
    description: 'Each teammate lands on a dashboard ordered by what their role actually owns.',
    unlockedBy: 'Invite teammates',
  },
];

export function previewsForSurface(surface: ValuePreview['surface']): ValuePreview[] {
  return valuePreviews.filter((v) => v.surface === surface);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tracked-topic catalog — used on Day 0 Policy page for setup
// ─────────────────────────────────────────────────────────────────────────────

export interface TrackedTopicOption {
  id: string;
  label: string;
  description: string;
  matchesMission: boolean;     // true = pre-suggested for Rivergate
  signalCount: number;         // illustrative weekly volume
}

export const trackedTopicOptions: TrackedTopicOption[] = [
  { id: 'tenant-rights',     label: 'Tenant rights & eviction protection', description: 'Right-to-counsel, lease protections, eviction moratoria.', matchesMission: true,  signalCount: 18 },
  { id: 'affordable-housing',label: 'Affordable housing finance',           description: 'Tax credits, bond programs, capital subsidies.',          matchesMission: true,  signalCount: 11 },
  { id: 'rental-assistance', label: 'Rental and emergency assistance',      description: 'Federal and state ERAP-style programs.',                  matchesMission: true,  signalCount: 9  },
  { id: 'fair-housing',      label: 'Fair housing and anti-discrimination', description: 'Source-of-income, accessibility, and HUD enforcement.',   matchesMission: true,  signalCount: 7  },
  { id: 'zoning',            label: 'Zoning and land use',                  description: 'Local zoning reform, ADU rules, density.',                matchesMission: false, signalCount: 6  },
  { id: 'workforce',         label: 'Workforce and economic mobility',      description: 'Job programs, childcare, transportation access.',         matchesMission: false, signalCount: 5  },
  { id: 'health-housing',    label: 'Health-housing intersections',         description: 'Medicaid waivers, supportive housing, harm reduction.',   matchesMission: false, signalCount: 4  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Day 0 KPI / glance helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface MaturityGlance {
  headline: string;
  body: string;
}

export const day0Glance: Record<Role, MaturityGlance> = {
  executive: {
    headline: 'Welcome to Ekko',
    body: 'You are 28% set up. Connect Salesforce and pick tracked policy topics to start seeing real signals across your team.',
  },
  fundraising: {
    headline: 'Get your donor view connected',
    body: 'Importing Salesforce will unlock at-risk donor detection, suggested next steps, and full giving timelines.',
  },
  policy: {
    headline: 'Choose what to monitor',
    body: 'Pick tracked policy topics to start receiving live alerts on hearings, amendments, and votes.',
  },
  program: {
    headline: 'Connect the team\'s data',
    body: 'Salesforce and Google will start filling in donor and program activity. Peer benchmarks unlock once you opt in.',
  },
  operations: {
    headline: 'Set up the workspace',
    body: 'Invite teammates, configure permissions, and connect data sources so each role lands on a tailored dashboard.',
  },
};
