// Phase 4: persistent workspace state — pinned modules, tracked peers,
// policy watchlist groups, donor segments. All static, but the shapes are
// real so future phases can plug in real persistence without restructuring.

import { Role } from './team';

// ─────────────────────────────────────────────────────────────────────────────
// Pinned dashboard modules
// ─────────────────────────────────────────────────────────────────────────────

export type PinnedKind = 'donor' | 'policy' | 'peer' | 'view' | 'metric';

export interface PinnedItem {
  id: string;
  kind: PinnedKind;
  title: string;
  subtitle: string;
  link: string;
  pinnedBy: string;     // teamMember.id
  pinnedAt: string;
  // If set, this pin is most relevant for these roles. Pins without
  // roleAffinity show on every role's dashboard.
  roleAffinity?: Role[];
  badge?: string;
}

export const pinnedItems: PinnedItem[] = [
  {
    id: 'pin-rtc',
    kind: 'policy',
    title: 'NYC Right-to-Counsel Expansion',
    subtitle: 'Hearing April 22 — testimony deadline April 15',
    link: '/policy/right-to-counsel',
    pinnedBy: 'ana-rodriguez',
    pinnedAt: '2026-04-08',
    roleAffinity: ['executive', 'policy'],
    badge: 'Hearing in 12 days',
  },
  {
    id: 'pin-jordan',
    kind: 'donor',
    title: 'Jordan Rivera',
    subtitle: 'Recurring donor — 45 days no engagement',
    link: '/people/donors/jordan-rivera',
    pinnedBy: 'leah-kim',
    pinnedAt: '2026-04-09',
    roleAffinity: ['executive', 'fundraising'],
    badge: 'At risk',
  },
  {
    id: 'pin-rar',
    kind: 'policy',
    title: 'Federal rental assistance reporting',
    subtitle: 'Effective May 15 — workflow audit in progress',
    link: '/policy/rental-assistance-reporting',
    pinnedBy: 'marcus-bell',
    pinnedAt: '2026-04-05',
    roleAffinity: ['executive', 'operations', 'program'],
    badge: 'Compliance',
  },
  {
    id: 'pin-bronx',
    kind: 'peer',
    title: 'Bronx Housing Justice Network',
    subtitle: 'Emergency aid campaign — 230% above sector avg',
    link: '/peers/bronx-housing',
    pinnedBy: 'leah-kim',
    pinnedAt: '2026-04-07',
    roleAffinity: ['fundraising', 'program'],
    badge: 'Top performer',
  },
];

export function pinsForRole(role: Role): PinnedItem[] {
  return pinnedItems.filter((p) => !p.roleAffinity || p.roleAffinity.includes(role));
}

// ─────────────────────────────────────────────────────────────────────────────
// Tracked peer organizations (per workspace)
// ─────────────────────────────────────────────────────────────────────────────

export interface TrackedPeer {
  peerId: string;
  trackedBy: string;       // teamMember.id
  trackedSince: string;
  notes?: string;
  shareLevel: 'private' | 'team' | 'shared'; // shared = peer-network visible
}

export const trackedPeers: TrackedPeer[] = [
  { peerId: 'bronx-housing', trackedBy: 'leah-kim', trackedSince: '2026-02-12', notes: 'Best-in-class emergency aid creative.', shareLevel: 'team' },
  { peerId: 'queens-tenant', trackedBy: 'tessa-moore', trackedSince: '2026-01-30', notes: 'Door-knocking model worth shadowing.', shareLevel: 'team' },
  { peerId: 'harbor-family', trackedBy: 'noah-stein', trackedSince: '2026-03-04', notes: 'Different campaign mix — useful counterpoint.', shareLevel: 'private' },
  { peerId: 'east-river', trackedBy: 'ana-rodriguez', trackedSince: '2026-03-22', shareLevel: 'team' },
];

export function isPeerTracked(peerId: string): boolean {
  return trackedPeers.some((t) => t.peerId === peerId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Saved campaigns (from Peers / Campaign library)
// ─────────────────────────────────────────────────────────────────────────────

export interface SavedCampaign {
  id: string;
  peerId: string;
  theme: string;
  savedBy: string;
  savedAt: string;
  reason?: string;
}

export const savedCampaigns: SavedCampaign[] = [
  { id: 'sc-bronx-1', peerId: 'bronx-housing', theme: 'Emergency tenant aid awareness', savedBy: 'leah-kim', savedAt: '2026-04-07', reason: 'Strong cross-channel mix; consider for Q2 outreach.' },
  { id: 'sc-bronx-2', peerId: 'bronx-housing', theme: 'Right-to-counsel advocacy push', savedBy: 'noah-stein', savedAt: '2026-04-08', reason: 'Direct overlap with our advocacy moment.' },
  { id: 'sc-queens-1', peerId: 'queens-tenant', theme: 'Know-your-rights workshops', savedBy: 'tessa-moore', savedAt: '2026-03-29', reason: 'Workshop format we can adapt.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Policy watchlist groups — Phase 4 adds named, multi-policy watchlists
// alongside the per-policy alerts that already exist in watchlist.ts.
// ─────────────────────────────────────────────────────────────────────────────

export interface WatchlistGroup {
  id: string;
  name: string;
  description: string;
  policyIds: string[];
  ownerId: string;
  createdAt: string;
  shareLevel: 'private' | 'team';
}

export const watchlistGroups: WatchlistGroup[] = [
  {
    id: 'wlg-tenant-rights',
    name: 'Tenant rights priorities',
    description: 'Policies directly affecting tenant protections and legal aid.',
    policyIds: ['right-to-counsel', 'tenant-data-privacy'],
    ownerId: 'noah-stein',
    createdAt: '2026-02-10',
    shareLevel: 'team',
  },
  {
    id: 'wlg-compliance',
    name: 'Compliance deadlines',
    description: 'Federal and state changes requiring internal workflow updates.',
    policyIds: ['rental-assistance-reporting', 'tenant-data-privacy'],
    ownerId: 'marcus-bell',
    createdAt: '2025-12-22',
    shareLevel: 'team',
  },
  {
    id: 'wlg-emergency',
    name: 'Emergency aid windows',
    description: 'Open and upcoming emergency funding programs we can apply to.',
    policyIds: ['anti-eviction-funding', 'housing-tax-credit'],
    ownerId: 'tessa-moore',
    createdAt: '2026-03-15',
    shareLevel: 'team',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Notification preferences — used by Settings and previewed by role
// ─────────────────────────────────────────────────────────────────────────────

export interface NotificationPref {
  channel: 'In-app' | 'Email' | 'Daily digest';
  category: 'Donor signals' | 'Policy alerts' | 'Peer activity' | 'Compliance' | 'Team mentions';
  enabledForRoles: Role[];
}

export const notificationPrefs: NotificationPref[] = [
  { channel: 'In-app',       category: 'Donor signals',  enabledForRoles: ['executive', 'fundraising'] },
  { channel: 'Email',        category: 'Donor signals',  enabledForRoles: ['fundraising'] },
  { channel: 'In-app',       category: 'Policy alerts',  enabledForRoles: ['executive', 'policy', 'operations'] },
  { channel: 'Email',        category: 'Policy alerts',  enabledForRoles: ['policy'] },
  { channel: 'Daily digest', category: 'Policy alerts',  enabledForRoles: ['executive'] },
  { channel: 'In-app',       category: 'Peer activity',  enabledForRoles: ['fundraising', 'program'] },
  { channel: 'In-app',       category: 'Compliance',     enabledForRoles: ['executive', 'operations'] },
  { channel: 'Email',        category: 'Compliance',     enabledForRoles: ['operations'] },
  { channel: 'In-app',       category: 'Team mentions',  enabledForRoles: ['executive', 'fundraising', 'policy', 'program', 'operations'] },
];
