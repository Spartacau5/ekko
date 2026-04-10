export const organization = {
  name: 'Rivergate Community Alliance',
  type: 'Mid-size nonprofit',
  missionArea: 'Housing stability and community development',
  headquarters: 'New York, NY',
  geographicFocus: ['Brooklyn', 'Queens', 'Bronx'],
  staffCount: 42,
  revenueRange: '$5M\u2013$10M',
  goals: [
    'Increase recurring donor retention',
    'Track policy changes',
    'Learn from peer campaigns in similar cities',
  ],
  connectedTools: [
    { name: 'Salesforce CRM', status: 'connected' as const, icon: 'database' },
    { name: 'Google Workspace', status: 'connected' as const, icon: 'mail' },
    { name: 'Mailchimp', status: 'connected' as const, icon: 'send' },
  ],
  setupCompletion: 68,
};

// Phase 4 moved the canonical team list into data/team.ts so it can carry
// roles and capabilities. This re-export keeps any older import path working.
export { teamMembers } from './team';
