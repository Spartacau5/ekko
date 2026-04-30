export interface PeerOrg {
  id: string;
  name: string;
  missionArea: string;
  geography: string;
  orgSize: string;
  revenueBand: string;
  orgType: string;
  recentCampaigns: { theme: string; channels: string[] }[];
  benchmarkStat: { label: string; value: string };
  optInStatus: 'Opted in' | 'Pending' | 'Not opted in';
  // Detail-page KPI strip numbers.
  donorCount: number;
  donorCountUpdatedDaysAgo: number;
  campaignsSharedLast2Months: number;
  performanceScore: number; // 0-100
  trackedPoliciesCount: number;
  // Funds-raised dataset used on the benchmark card.
  fundsRaisedYtd: { yours: number; theirs: number; avg: number; top: number };
}

export const peerOrgs: PeerOrg[] = [
  {
    id: 'bronx-housing',
    name: 'Bronx Food Collective',
    missionArea: 'Food access and emergency food assistance',
    geography: 'Bronx, NY',
    orgSize: 'Mid-size (35 staff)',
    revenueBand: '$3M\u2013$7M',
    orgType: 'Nonprofit',
    recentCampaigns: [
      { theme: 'Emergency food aid awareness', channels: ['Email', 'Social media', 'Community events'] },
      { theme: 'Food Expansion Act advocacy push', channels: ['Direct mail', 'Email', 'Press'] },
    ],
    benchmarkStat: { label: 'Email open rate', value: '34%' },
    optInStatus: 'Opted in',
    donorCount: 162,
    donorCountUpdatedDaysAgo: 2,
    campaignsSharedLast2Months: 2,
    performanceScore: 84,
    trackedPoliciesCount: 4,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 5_400_000, avg: 5_400_000, top: 6_400_000 },
  },
  {
    id: 'queens-tenant',
    name: 'Queens Food Resource Center',
    missionArea: 'Food assistance navigation and nutrition education',
    geography: 'Queens, NY',
    orgSize: 'Small (18 staff)',
    revenueBand: '$1M\u2013$3M',
    recentCampaigns: [
      { theme: 'SNAP enrollment navigation', channels: ['In-person', 'Phone hotline', 'Email'] },
      { theme: 'Know-your-benefits workshops', channels: ['Community events', 'Social media'] },
    ],
    benchmarkStat: { label: 'Donor retention rate', value: '62%' },
    optInStatus: 'Opted in',
    orgType: 'Nonprofit',
    donorCount: 98,
    donorCountUpdatedDaysAgo: 5,
    campaignsSharedLast2Months: 1,
    performanceScore: 71,
    trackedPoliciesCount: 2,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 2_100_000, avg: 5_400_000, top: 6_400_000 },
  },
  {
    id: 'harbor-family',
    name: 'Harbor Family Stability Fund',
    missionArea: 'Family nutrition and child welfare',
    geography: 'Brooklyn, NY',
    orgSize: 'Mid-size (50 staff)',
    revenueBand: '$5M\u2013$10M',
    recentCampaigns: [
      { theme: 'Back-to-school family support', channels: ['Email', 'Direct mail', 'Partner orgs'] },
      { theme: 'Winter shelter access drive', channels: ['Social media', 'Email', 'Press'] },
    ],
    benchmarkStat: { label: 'Donation conversion rate', value: '4.2%' },
    optInStatus: 'Opted in',
    orgType: 'Nonprofit',
    donorCount: 245,
    donorCountUpdatedDaysAgo: 1,
    campaignsSharedLast2Months: 3,
    performanceScore: 78,
    trackedPoliciesCount: 3,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 7_200_000, avg: 5_400_000, top: 8_100_000 },
  },
  {
    id: 'east-river',
    name: 'East River Food Collaborative',
    missionArea: 'Community kitchen and food hub development',
    geography: 'Lower East Side, NY',
    orgSize: 'Mid-size (40 staff)',
    revenueBand: '$4M\u2013$8M',
    recentCampaigns: [
      { theme: 'Food hub zoning support campaign', channels: ['Email', 'Press', 'Community meetings'] },
      { theme: 'Community kitchen expansion', channels: ['Direct mail', 'Email'] },
    ],
    benchmarkStat: { label: 'Average gift size', value: '$128' },
    optInStatus: 'Pending',
    orgType: 'Nonprofit',
    donorCount: 132,
    donorCountUpdatedDaysAgo: 9,
    campaignsSharedLast2Months: 2,
    performanceScore: 68,
    trackedPoliciesCount: 5,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 5_900_000, avg: 5_400_000, top: 6_400_000 },
  },
  {
    id: 'citywide-shelter',
    name: 'Citywide Meals Access Project',
    missionArea: 'Hunger prevention and emergency meals',
    geography: 'New York City (citywide)',
    orgSize: 'Large (85 staff)',
    revenueBand: '$10M\u2013$20M',
    recentCampaigns: [
      { theme: 'Cold weather emergency response', channels: ['Email', 'Social media', 'Text'] },
      { theme: 'Corporate partnership matching drive', channels: ['Email', 'Events'] },
    ],
    benchmarkStat: { label: 'Email open rate', value: '29%' },
    optInStatus: 'Opted in',
    orgType: 'Nonprofit',
    donorCount: 412,
    donorCountUpdatedDaysAgo: 3,
    campaignsSharedLast2Months: 4,
    performanceScore: 82,
    trackedPoliciesCount: 6,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 12_800_000, avg: 5_400_000, top: 14_200_000 },
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
    orgType: 'Nonprofit',
    donorCount: 74,
    donorCountUpdatedDaysAgo: 14,
    campaignsSharedLast2Months: 0,
    performanceScore: 58,
    trackedPoliciesCount: 2,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 3_100_000, avg: 5_400_000, top: 6_400_000 },
  },
  {
    id: 'northern-homes',
    name: 'Northern Foods Action Lab',
    missionArea: 'Food security research and policy innovation',
    geography: 'Upstate NY, NYC',
    orgSize: 'Small (22 staff)',
    revenueBand: '$2M\u2013$4M',
    recentCampaigns: [
      { theme: 'Food access data transparency initiative', channels: ['Email', 'Webinars', 'Reports'] },
      { theme: 'Policy brief dissemination', channels: ['Email', 'Partner networks'] },
    ],
    benchmarkStat: { label: 'Website conversion rate', value: '3.1%' },
    optInStatus: 'Opted in',
    orgType: 'Nonprofit',
    donorCount: 56,
    donorCountUpdatedDaysAgo: 4,
    campaignsSharedLast2Months: 1,
    performanceScore: 74,
    trackedPoliciesCount: 3,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 2_900_000, avg: 5_400_000, top: 6_400_000 },
  },
  {
    id: 'brookfield-resilience',
    name: 'Brookfield Community Resilience Fund',
    missionArea: 'Disaster preparedness and food resilience',
    geography: 'Brooklyn, Queens, NY',
    orgSize: 'Mid-size (38 staff)',
    revenueBand: '$4M\u2013$7M',
    recentCampaigns: [
      { theme: 'Storm-ready food pantry outreach', channels: ['Text', 'Email', 'Community events'] },
      { theme: 'Resilience fund year-end appeal', channels: ['Email', 'Direct mail', 'Social media'] },
    ],
    benchmarkStat: { label: 'Donor retention rate', value: '58%' },
    optInStatus: 'Pending',
    orgType: 'Nonprofit',
    donorCount: 118,
    donorCountUpdatedDaysAgo: 6,
    campaignsSharedLast2Months: 2,
    performanceScore: 69,
    trackedPoliciesCount: 3,
    fundsRaisedYtd: { yours: 4_400_000, theirs: 5_100_000, avg: 5_400_000, top: 6_400_000 },
  },
];

export const benchmarkData = {
  emailOpenRate: { yours: 31, peerAverage: 30, topQuartile: 36 },
  donationConversion: { yours: 3.8, peerAverage: 3.5, topQuartile: 4.5 },
  donorRetention: { yours: 64, peerAverage: 60, topQuartile: 72 },
  topMessagingThemes: [
    { theme: 'Emergency food aid', mentions: 6 },
    { theme: 'Policy advocacy', mentions: 5 },
    { theme: 'Community stories', mentions: 4 },
    { theme: 'Year-end appeals', mentions: 4 },
    { theme: 'Volunteer engagement', mentions: 3 },
  ],
};
