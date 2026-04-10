// Phase 4 action / task model. The action layer is what makes Ekko feel like
// a working tool: insight surfaces (donors, policies, peers, alerts) generate
// actions, actions get owners + due dates + statuses, and dashboards show the
// right ones to the right roles.

import { Role } from './team';

export type ActionStatus = 'open' | 'in_progress' | 'completed';
export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ActionEntityType = 'donor' | 'policy' | 'peer' | 'campaign' | 'alert' | 'system';

export interface ActionEntity {
  type: ActionEntityType;
  id: string;
  label: string;
  link: string;
}

export interface ActionItem {
  id: string;
  title: string;
  context: string;
  ownerId: string;
  dueDate: string;        // ISO date
  priority: ActionPriority;
  status: ActionStatus;
  source: string;         // human-readable origin: "Engagement risk model", "Policy radar", etc.
  cta: string;
  entity?: ActionEntity;
  visibleTo: Role[];      // roles that should see it on their dashboard
  createdBy: string;      // teamMember.id (or "ekko" for system-generated)
  createdAt: string;
}

export const actions: ActionItem[] = [
  {
    id: 'act-policy-rtc-testimony',
    title: 'Submit testimony for Right-to-Counsel hearing',
    context: 'Public hearing scheduled April 22. Submission deadline April 15.',
    ownerId: 'noah-stein',
    dueDate: '2026-04-15',
    priority: 'urgent',
    status: 'in_progress',
    source: 'Policy radar',
    cta: 'Open testimony draft',
    entity: { type: 'policy', id: 'right-to-counsel', label: 'NYC Right-to-Counsel Expansion', link: '/policy/right-to-counsel' },
    visibleTo: ['executive', 'policy'],
    createdBy: 'ekko',
    createdAt: '2026-04-08',
  },
  {
    id: 'act-people-jordan-reengage',
    title: 'Re-engage Jordan Rivera with neighborhood story',
    context: 'No engagement in 45 days. Recurring monthly donor at risk of churn.',
    ownerId: 'leah-kim',
    dueDate: '2026-04-14',
    priority: 'urgent',
    status: 'open',
    source: 'Engagement risk model',
    cta: 'Draft re-engagement email',
    entity: { type: 'donor', id: 'jordan-rivera', label: 'Jordan Rivera', link: '/people/donors/jordan-rivera' },
    visibleTo: ['executive', 'fundraising'],
    createdBy: 'ekko',
    createdAt: '2026-04-09',
  },
  {
    id: 'act-policy-aef-apply',
    title: 'Apply for anti-eviction emergency funding',
    context: 'Application window closes May 15. Up to $250K available for direct services.',
    ownerId: 'tessa-moore',
    dueDate: '2026-05-15',
    priority: 'high',
    status: 'open',
    source: 'Policy radar',
    cta: 'Start application',
    entity: { type: 'policy', id: 'anti-eviction-funding', label: 'City Anti-Eviction Emergency Funding', link: '/policy/anti-eviction-funding' },
    visibleTo: ['executive', 'program', 'policy'],
    createdBy: 'noah-stein',
    createdAt: '2026-04-09',
  },
  {
    id: 'act-ops-rar-audit',
    title: 'Audit reporting workflow for rental assistance change',
    context: 'Federal compliance change effective May 15. Operations and finance must complete review.',
    ownerId: 'marcus-bell',
    dueDate: '2026-05-01',
    priority: 'high',
    status: 'in_progress',
    source: 'Compliance radar',
    cta: 'Open audit checklist',
    entity: { type: 'policy', id: 'rental-assistance-reporting', label: 'Federal Rental Assistance Reporting Change', link: '/policy/rental-assistance-reporting' },
    visibleTo: ['executive', 'operations', 'program'],
    createdBy: 'ekko',
    createdAt: '2026-04-05',
  },
  {
    id: 'act-people-maya-brief',
    title: 'Send tailored policy update to Maya Patel',
    context: 'Major donor highly engaged on tenant rights. Good moment to share Right-to-Counsel progress.',
    ownerId: 'leah-kim',
    dueDate: '2026-04-16',
    priority: 'medium',
    status: 'open',
    source: 'Donor signals',
    cta: 'Draft brief',
    entity: { type: 'donor', id: 'maya-patel', label: 'Maya Patel', link: '/people/donors/maya-patel' },
    visibleTo: ['executive', 'fundraising'],
    createdBy: 'ekko',
    createdAt: '2026-04-08',
  },
  {
    id: 'act-peer-bronx-extract',
    title: 'Extract messaging from Bronx Housing emergency aid campaign',
    context: 'Peer campaign outperformed sector average by 230%. Worth borrowing themes.',
    ownerId: 'leah-kim',
    dueDate: '2026-04-22',
    priority: 'medium',
    status: 'open',
    source: 'Peer intelligence',
    cta: 'Open campaign',
    entity: { type: 'peer', id: 'bronx-housing', label: 'Bronx Housing Justice Network', link: '/peers/bronx-housing' },
    visibleTo: ['fundraising', 'program'],
    createdBy: 'noah-stein',
    createdAt: '2026-04-07',
  },
  {
    id: 'act-people-priya-brief',
    title: 'Share peer benchmark report with Priya Narang',
    context: 'Foundation renewal meeting in two weeks. Priya specifically asked for benchmark context last quarter.',
    ownerId: 'noah-stein',
    dueDate: '2026-04-19',
    priority: 'high',
    status: 'open',
    source: 'Donor signals',
    cta: 'Compose update',
    entity: { type: 'donor', id: 'priya-narang', label: 'Priya Narang', link: '/people/donors/priya-narang' },
    visibleTo: ['executive', 'fundraising'],
    createdBy: 'leah-kim',
    createdAt: '2026-04-08',
  },
  {
    id: 'act-program-tessa-resident',
    title: 'Brief residents on emergency aid window opening',
    context: 'City emergency funding opens April 9. Coordinate flyer and outreach in Brooklyn and Queens program sites.',
    ownerId: 'tessa-moore',
    dueDate: '2026-04-17',
    priority: 'high',
    status: 'in_progress',
    source: 'Program signals',
    cta: 'Open outreach plan',
    entity: { type: 'policy', id: 'anti-eviction-funding', label: 'City Anti-Eviction Emergency Funding', link: '/policy/anti-eviction-funding' },
    visibleTo: ['executive', 'program'],
    createdBy: 'tessa-moore',
    createdAt: '2026-04-08',
  },
  {
    id: 'act-ops-calendar',
    title: 'Connect calendar source for fuller donor context',
    context: 'Meeting notes integration is missing. Connecting Google Calendar would unlock auto-logged meetings.',
    ownerId: 'marcus-bell',
    dueDate: '2026-04-24',
    priority: 'medium',
    status: 'open',
    source: 'Setup checklist',
    cta: 'Open integrations',
    entity: { type: 'system', id: 'calendar-integration', label: 'Calendar integration', link: '/settings' },
    visibleTo: ['executive', 'operations'],
    createdBy: 'ekko',
    createdAt: '2026-04-02',
  },
  {
    id: 'act-exec-board-brief',
    title: 'Brief leadership on tax credit revision',
    context: 'State affordable housing tax credit revision in proposed status. Board wants a position by next meeting.',
    ownerId: 'ana-rodriguez',
    dueDate: '2026-04-29',
    priority: 'medium',
    status: 'open',
    source: 'Policy radar',
    cta: 'Open briefing template',
    entity: { type: 'policy', id: 'housing-tax-credit', label: 'State Affordable Housing Tax Credit Revision', link: '/policy/housing-tax-credit' },
    visibleTo: ['executive', 'policy'],
    createdBy: 'noah-stein',
    createdAt: '2026-04-06',
  },
  {
    id: 'act-people-daniel-renew',
    title: 'Send concise impact snapshot to Daniel Cho',
    context: 'Lapsed for 14 months. Outcome-focused — single-page snapshot fits his pattern.',
    ownerId: 'leah-kim',
    dueDate: '2026-04-23',
    priority: 'medium',
    status: 'open',
    source: 'Donor signals',
    cta: 'Build snapshot',
    entity: { type: 'donor', id: 'daniel-cho', label: 'Daniel Cho', link: '/people/donors/daniel-cho' },
    visibleTo: ['fundraising'],
    createdBy: 'ekko',
    createdAt: '2026-04-04',
  },
];

export function actionsForRole(role: Role): ActionItem[] {
  return actions.filter((a) => a.visibleTo.includes(role));
}

export function actionsForOwner(ownerId: string): ActionItem[] {
  return actions.filter((a) => a.ownerId === ownerId);
}

export function actionsForEntity(type: ActionEntityType, id: string): ActionItem[] {
  return actions.filter((a) => a.entity?.type === type && a.entity?.id === id);
}

export function openActionsForRole(role: Role): ActionItem[] {
  return actionsForRole(role).filter((a) => a.status !== 'completed');
}
