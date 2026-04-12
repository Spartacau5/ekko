// Sparkline data is just an array of numbers; we render small SVGs from these.

import { donors } from './donors';
import { policies } from './policies';
import { watchlist } from './watchlist';

export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  delta: number; // positive or negative percent
  deltaLabel: string;
  trend: number[]; // sparkline points
  surface: 'people' | 'policy' | 'peers' | 'cross';
}

const activeDonorCount = donors.filter((d) => d.givingStatus !== 'Inactive' && d.givingStatus !== 'Cold').length;
const lifetimeTotal = donors.reduce((sum, d) => sum + (d.lifetimeGiving || 0), 0);
const lifetimeFormatted = lifetimeTotal >= 1000 ? `$${(lifetimeTotal / 1000).toFixed(1)}K` : `$${lifetimeTotal.toLocaleString()}`;

export const kpiMetrics: KPIMetric[] = [
  {
    id: 'active-donors',
    label: 'Active donors',
    value: activeDonorCount.toString(),
    delta: 6.2,
    deltaLabel: 'vs. 30 days ago',
    trend: [5, 5, 6, 6, 7, 7, 7, 8, 8, activeDonorCount],
    surface: 'people',
  },
  {
    id: 'lifetime-revenue',
    label: 'Lifetime revenue',
    value: lifetimeFormatted,
    delta: 4.8,
    deltaLabel: 'vs. 30 days ago',
    trend: [100, 105, 110, 115, 120, 125, 128, 130, 133, lifetimeTotal / 1000],
    surface: 'people',
  },
  {
    id: 'tracked-policies',
    label: 'Tracked policies',
    value: policies.length.toString(),
    delta: 50,
    deltaLabel: `${watchlist.length} watchlist + ${policies.length - watchlist.length} monitor`,
    trend: [4, 4, 5, 5, 5, 6, 6, 6, 6, policies.length],
    surface: 'policy',
  },
  {
    id: 'avg-engagement',
    label: 'Avg engagement score',
    value: '67',
    delta: -2.1,
    deltaLabel: 'vs. 30 days ago',
    trend: [70, 69, 70, 68, 68, 67, 67, 66, 67, 67],
    surface: 'cross',
  },
];

export interface PriorityTask {
  id: string;
  title: string;
  context: string;
  source: 'people' | 'policy' | 'peers' | 'system';
  dueLabel: string;
  priority: 'urgent' | 'high' | 'medium';
  link: string;
}

export const priorityTasks: PriorityTask[] = [
  {
    id: 'task-1',
    title: 'Submit testimony for Right-to-Counsel hearing',
    context: 'Public hearing April 22 \u2014 deadline April 15',
    source: 'policy',
    dueLabel: 'Due in 5 days',
    priority: 'urgent',
    link: '/policy/right-to-counsel',
  },
  {
    id: 'task-2',
    title: 'Re-engage Jordan Rivera',
    context: 'No engagement in 45 days, recurring at risk',
    source: 'people',
    dueLabel: 'Recommended this week',
    priority: 'urgent',
    link: '/people/donors/jordan-rivera',
  },
  {
    id: 'task-3',
    title: 'Apply for anti-eviction emergency funding',
    context: 'Application window closes May 15',
    source: 'policy',
    dueLabel: 'Due in 35 days',
    priority: 'high',
    link: '/policy/anti-eviction-funding',
  },
  {
    id: 'task-4',
    title: 'Audit reporting workflow before May 15',
    context: 'Federal rental assistance compliance change',
    source: 'policy',
    dueLabel: 'Due in 35 days',
    priority: 'high',
    link: '/policy/rental-assistance-reporting',
  },
  {
    id: 'task-5',
    title: 'Send brief on tenant protection policy wins to Maya Patel',
    context: 'Major donor — engagement opportunity',
    source: 'people',
    dueLabel: 'Recommended this week',
    priority: 'medium',
    link: '/people/donors/maya-patel',
  },
  {
    id: 'task-6',
    title: 'Renewal proposal for Horizon Family Foundation',
    context: 'Year 5 of multi-year grant \u2014 renewal cycle starts Q3',
    source: 'people',
    dueLabel: 'Due in 60 days',
    priority: 'medium',
    link: '/people/accounts/horizon-foundation',
  },
];

export interface ActivityItem {
  id: string;
  type: 'gift' | 'meeting' | 'email' | 'policy' | 'peer' | 'team';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  link?: string;
}

export const recentActivity: ActivityItem[] = [
  { id: 'a1', type: 'gift', title: 'Gift received: $2,500', description: 'Maya Patel \u2014 Annual fund contribution', actor: 'Salesforce sync', timestamp: '2026-04-11T14:22:00', link: '/people/donors/maya-patel' },
  { id: 'a2', type: 'policy', title: 'Hearing scheduled', description: 'Right-to-Counsel public testimony April 22 \u2014 submission deadline in 3 days', actor: 'Policy radar', timestamp: '2026-04-11T09:15:00', link: '/policy/right-to-counsel' },
  { id: 'a3', type: 'email', title: 'Email opened', description: 'Samir Gupta opened the March policy digest \u2014 his 3rd open this month', actor: 'Mailchimp', timestamp: '2026-04-10T16:48:00', link: '/people/donors/samir-gupta' },
  { id: 'a4', type: 'peer', title: 'Peer campaign flagged', description: 'Bronx Housing emergency aid campaign \u2014 230% above sector avg. Saved by Leah Kim.', actor: 'Peer signals', timestamp: '2026-04-10T11:02:00', link: '/peers/bronx-housing' },
  { id: 'a5', type: 'meeting', title: 'Meeting logged', description: 'Quarterly review with Priya Narang at Horizon Family Foundation \u2014 renewal timeline discussed', actor: 'Noah Stein', timestamp: '2026-04-09T15:30:00', link: '/people/donors/priya-narang' },
  { id: 'a6', type: 'team', title: 'Saved view created', description: 'Leah Kim created "At-risk this quarter" \u2014 4 donors matched', actor: 'Leah Kim', timestamp: '2026-04-08T10:14:00' },
];

export interface FundraisingMonth {
  month: string;
  raised: number;
  target: number;
}

export const fundraisingTrend: FundraisingMonth[] = [
  { month: 'Nov', raised: 187000, target: 175000 },
  { month: 'Dec', raised: 412000, target: 350000 },
  { month: 'Jan', raised: 195000, target: 200000 },
  { month: 'Feb', raised: 168000, target: 180000 },
  { month: 'Mar', raised: 224000, target: 200000 },
  { month: 'Apr', raised: 92000, target: 200000 },
];
