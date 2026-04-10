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

export const teamMembers = [
  { name: 'Leah Kim', role: 'Development Director', email: 'leah@rivergate.org' },
  { name: 'Noah Stein', role: 'Partnerships Lead', email: 'noah@rivergate.org' },
  { name: 'Marcus Bell', role: 'Corporate Relations Manager', email: 'marcus@rivergate.org' },
  { name: 'Sofia Reyes', role: 'Executive Director', email: 'sofia@rivergate.org' },
];
