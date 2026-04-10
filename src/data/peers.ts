export interface PeerOrg {
  id: string;
  name: string;
  missionArea: string;
  geography: string;
  orgSize: string;
  revenueBand: string;
  recentCampaigns: { theme: string; channels: string[] }[];
  benchmarkStat: { label: string; value: string };
  optInStatus: 'Opted in' | 'Pending' | 'Not opted in';
}

export const peerOrgs: PeerOrg[] = [
  {
    id: 'bronx-housing',
    name: 'Bronx Housing Justice Network',
    missionArea: 'Tenant rights and legal advocacy',
    geography: 'Bronx, NY',
    orgSize: 'Mid-size (35 staff)',
    revenueBand: '$3M\u2013$7M',
    recentCampaigns: [
      { theme: 'Emergency tenant aid awareness', channels: ['Email', 'Social media', 'Community events'] },
      { theme: 'Right-to-counsel advocacy push', channels: ['Direct mail', 'Email', 'Press'] },
    ],
    benchmarkStat: { label: 'Email open rate', value: '34%' },
    optInStatus: 'Opted in',
  },
  {
    id: 'queens-tenant',
    name: 'Queens Tenant Resource Center',
    missionArea: 'Tenant services and housing education',
    geography: 'Queens, NY',
    orgSize: 'Small (18 staff)',
    revenueBand: '$1M\u2013$3M',
    recentCampaigns: [
      { theme: 'Rental assistance navigation', channels: ['In-person', 'Phone hotline', 'Email'] },
      { theme: 'Know-your-rights workshops', channels: ['Community events', 'Social media'] },
    ],
    benchmarkStat: { label: 'Donor retention rate', value: '62%' },
    optInStatus: 'Opted in',
  },
  {
    id: 'harbor-family',
    name: 'Harbor Family Stability Fund',
    missionArea: 'Family housing and child welfare',
    geography: 'Brooklyn, NY',
    orgSize: 'Mid-size (50 staff)',
    revenueBand: '$5M\u2013$10M',
    recentCampaigns: [
      { theme: 'Back-to-school family support', channels: ['Email', 'Direct mail', 'Partner orgs'] },
      { theme: 'Winter shelter access drive', channels: ['Social media', 'Email', 'Press'] },
    ],
    benchmarkStat: { label: 'Donation conversion rate', value: '4.2%' },
    optInStatus: 'Opted in',
  },
  {
    id: 'east-river',
    name: 'East River Housing Collaborative',
    missionArea: 'Affordable housing development',
    geography: 'Lower East Side, NY',
    orgSize: 'Mid-size (40 staff)',
    revenueBand: '$4M\u2013$8M',
    recentCampaigns: [
      { theme: 'Zoning reform support campaign', channels: ['Email', 'Press', 'Community meetings'] },
      { theme: 'Affordable unit preservation', channels: ['Direct mail', 'Email'] },
    ],
    benchmarkStat: { label: 'Average gift size', value: '$128' },
    optInStatus: 'Pending',
  },
  {
    id: 'citywide-shelter',
    name: 'Citywide Shelter Access Project',
    missionArea: 'Homelessness prevention and shelter',
    geography: 'New York City (citywide)',
    orgSize: 'Large (85 staff)',
    revenueBand: '$10M\u2013$20M',
    recentCampaigns: [
      { theme: 'Cold weather emergency response', channels: ['Email', 'Social media', 'Text'] },
      { theme: 'Corporate partnership matching drive', channels: ['Email', 'Events'] },
    ],
    benchmarkStat: { label: 'Email open rate', value: '29%' },
    optInStatus: 'Opted in',
  },
  {
    id: 'metro-neighborhood',
    name: 'Metro Neighborhood Alliance',
    missionArea: 'Community organizing and neighborhood development',
    geography: 'Manhattan, Brooklyn, NY',
    orgSize: 'Mid-size (30 staff)',
    revenueBand: '$2M\u2013$5M',
    recentCampaigns: [
      { theme: 'Neighborhood safety survey', channels: ['Door-to-door', 'Social media'] },
      { theme: 'Community land trust awareness', channels: ['Email', 'Community events', 'Press'] },
    ],
    benchmarkStat: { label: 'Recurring donor growth', value: '+18% YoY' },
    optInStatus: 'Not opted in',
  },
  {
    id: 'northern-homes',
    name: 'Northern Homes Action Lab',
    missionArea: 'Housing research and policy innovation',
    geography: 'Upstate NY, NYC',
    orgSize: 'Small (22 staff)',
    revenueBand: '$2M\u2013$4M',
    recentCampaigns: [
      { theme: 'Housing data transparency initiative', channels: ['Email', 'Webinars', 'Reports'] },
      { theme: 'Policy brief dissemination', channels: ['Email', 'Partner networks'] },
    ],
    benchmarkStat: { label: 'Website conversion rate', value: '3.1%' },
    optInStatus: 'Opted in',
  },
  {
    id: 'brookfield-resilience',
    name: 'Brookfield Community Resilience Fund',
    missionArea: 'Disaster preparedness and housing resilience',
    geography: 'Brooklyn, Queens, NY',
    orgSize: 'Mid-size (38 staff)',
    revenueBand: '$4M\u2013$7M',
    recentCampaigns: [
      { theme: 'Storm preparedness tenant outreach', channels: ['Text', 'Email', 'Community events'] },
      { theme: 'Resilience fund year-end appeal', channels: ['Email', 'Direct mail', 'Social media'] },
    ],
    benchmarkStat: { label: 'Donor retention rate', value: '58%' },
    optInStatus: 'Pending',
  },
];

export const benchmarkData = {
  emailOpenRate: { yours: 31, peerAverage: 30, topQuartile: 36 },
  donationConversion: { yours: 3.8, peerAverage: 3.5, topQuartile: 4.5 },
  donorRetention: { yours: 64, peerAverage: 60, topQuartile: 72 },
  topMessagingThemes: [
    { theme: 'Emergency tenant aid', mentions: 6 },
    { theme: 'Policy advocacy', mentions: 5 },
    { theme: 'Community stories', mentions: 4 },
    { theme: 'Year-end appeals', mentions: 4 },
    { theme: 'Volunteer engagement', mentions: 3 },
  ],
};
