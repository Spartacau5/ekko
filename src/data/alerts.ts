export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'danger' | 'success';
  title: string;
  description: string;
  category: 'people' | 'policy' | 'peers' | 'setup';
  actionLabel?: string;
  actionLink?: string;
  timestamp: string;
  source: string;
  reason?: string;
}

export const dashboardAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'danger',
    title: 'Jordan Rivera has not engaged in 45 days',
    description: 'Recurring donor showing signs of disengagement. Last email sent Feb 24 — no opens recorded since.',
    category: 'people',
    actionLabel: 'View donor',
    actionLink: '/people/donors/jordan-rivera',
    timestamp: '2026-04-11T08:00:00',
    source: 'Engagement risk model',
    reason: 'Based on 45-day silence window. Jordan was previously opening 2 of 3 emails.',
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Federal rental assistance reporting change in 33 days',
    description: 'New compliance requirements take effect May 15. Marcus Bell\'s workflow audit is in progress.',
    category: 'policy',
    actionLabel: 'View policy',
    actionLink: '/policy/rental-assistance-reporting',
    timestamp: '2026-04-11T07:30:00',
    source: 'Compliance radar',
    reason: 'Countdown trigger: effective date is within 60 days and audit is still in progress.',
  },
  {
    id: 'alert-3',
    type: 'success',
    title: 'Bronx Housing emergency aid campaign outperforming sector 230%',
    description: 'Their messaging mix across email, social, and direct mail is worth studying. Leah Kim saved this campaign yesterday.',
    category: 'peers',
    actionLabel: 'View campaign',
    actionLink: '/peers/bronx-housing',
    timestamp: '2026-04-10T11:02:00',
    source: 'Peer intelligence',
    reason: 'Flagged because Bronx Housing is a tracked peer and this campaign exceeds 200% of cohort average.',
  },
  {
    id: 'alert-4',
    type: 'info',
    title: 'Calendar integration missing — meeting context gaps detected',
    description: '3 donor meetings last week had no auto-logged notes. Connecting Google Calendar would close the gap.',
    category: 'setup',
    actionLabel: 'Go to settings',
    actionLink: '/settings',
    timestamp: '2026-04-09T10:00:00',
    source: 'Setup checklist',
    reason: 'Detected 3 meetings without auto-logged context. Calendar sync resolves this.',
  },
  {
    id: 'alert-5',
    type: 'info',
    title: 'Zoning reform: new stakeholder activity detected',
    description: 'Regional Land Use Board published draft scoping schedule. Public comment opens May 1.',
    category: 'policy',
    actionLabel: 'View policy',
    actionLink: '/policy/zoning-reform',
    timestamp: '2026-04-10T09:15:00',
    source: 'Policy radar',
    reason: 'New document published by a tracked stakeholder on a monitored policy.',
  },
];
