export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'danger' | 'success';
  title: string;
  description: string;
  category: 'people' | 'policy' | 'peers' | 'setup';
  actionLabel?: string;
  actionLink?: string;
}

export const dashboardAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'danger',
    title: 'Jordan Rivera has not engaged in 45 days',
    description: 'Recurring donor showing signs of disengagement. Consider a re-engagement outreach.',
    category: 'people',
    actionLabel: 'View donor',
    actionLink: '/people/jordan-rivera',
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Federal rental assistance reporting change goes into effect next month',
    description: 'New compliance requirements take effect May 2026. Audit your reporting workflow.',
    category: 'policy',
    actionLabel: 'View policy',
    actionLink: '/policy/rental-assistance-reporting',
  },
  {
    id: 'alert-3',
    type: 'success',
    title: 'Peer campaign on emergency tenant aid is outperforming sector average',
    description: 'Similar orgs are seeing 2.3x average engagement on emergency aid messaging.',
    category: 'peers',
    actionLabel: 'View benchmarks',
    actionLink: '/peers',
  },
  {
    id: 'alert-4',
    type: 'info',
    title: 'Setup incomplete: connect calendar or meeting notes source',
    description: 'Connecting your calendar helps Ekko surface relationship insights automatically.',
    category: 'setup',
    actionLabel: 'Go to settings',
    actionLink: '/settings',
  },
  {
    id: 'alert-5',
    type: 'info',
    title: 'New stakeholder activity detected on zoning reform proposal',
    description: 'Regional Land Use Board published draft scoping session schedule.',
    category: 'policy',
    actionLabel: 'View policy',
    actionLink: '/policy/zoning-reform',
  },
];
