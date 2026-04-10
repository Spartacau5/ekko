// Sparkline data is just an array of numbers; we render small SVGs from these.

export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  delta: number; // positive or negative percent
  deltaLabel: string;
  trend: number[]; // sparkline points
  surface: 'people' | 'policy' | 'peers' | 'cross';
}

export const kpiMetrics: KPIMetric[] = [
  {
    id: 'active-donors',
    label: 'Active donors',
    value: '347',
    delta: 6.2,
    deltaLabel: 'vs. 30 days ago',
    trend: [298, 305, 312, 318, 322, 331, 338, 341, 343, 347],
    surface: 'people',
  },
  {
    id: 'lifetime-revenue',
    label: 'Lifetime revenue',
    value: '$2.41M',
    delta: 4.8,
    deltaLabel: 'vs. 30 days ago',
    trend: [2.21, 2.24, 2.27, 2.29, 2.32, 2.34, 2.36, 2.38, 2.39, 2.41],
    surface: 'people',
  },
  {
    id: 'tracked-policies',
    label: 'Tracked policies',
    value: '6',
    delta: 50,
    deltaLabel: '4 watchlist + 2 monitor',
    trend: [4, 4, 5, 5, 5, 6, 6, 6, 6, 6],
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
  { id: 'a1', type: 'gift', title: 'Gift received: $2,500', description: 'Maya Patel \u2014 Annual fund', actor: 'Stripe', timestamp: '2026-04-09T14:22:00', link: '/people/donors/maya-patel' },
  { id: 'a2', type: 'policy', title: 'Hearing scheduled', description: 'Right-to-Counsel public testimony April 22', actor: 'Policy radar', timestamp: '2026-04-08T09:15:00', link: '/policy/right-to-counsel' },
  { id: 'a3', type: 'email', title: 'Email opened', description: 'Samir Gupta \u2014 March policy digest', actor: 'Mailchimp', timestamp: '2026-04-07T16:48:00', link: '/people/donors/samir-gupta' },
  { id: 'a4', type: 'peer', title: 'Peer campaign noted', description: 'Bronx Housing emergency aid \u2014 230% above sector avg', actor: 'Peer signals', timestamp: '2026-04-07T11:02:00', link: '/peers/campaigns' },
  { id: 'a5', type: 'meeting', title: 'Meeting logged', description: 'Quarterly review with Horizon Family Foundation', actor: 'Noah Stein', timestamp: '2026-04-03T15:30:00', link: '/people/accounts/horizon-foundation' },
  { id: 'a6', type: 'team', title: 'Saved view created', description: 'Leah Kim created "At-risk this quarter"', actor: 'Leah Kim', timestamp: '2026-04-02T10:14:00' },
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
