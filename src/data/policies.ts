export type Jurisdiction = 'City' | 'State' | 'Federal' | 'Regional';
export type PolicyStatus = 'Under review' | 'Proposed' | 'Approved' | 'Passed' | 'In committee' | 'Draft';
export type ImpactLevel = 'High opportunity' | 'Medium opportunity' | 'High risk' | 'Medium risk' | 'Mixed impact';
export type Urgency = 'Immediate' | 'Near-term' | 'Monitor';

export interface Stakeholder {
  name: string;
  stance: 'supportive' | 'mixed' | 'strong ally' | 'uncertain' | 'opposed';
}

export interface PolicyTimelineEvent {
  date: string;
  title: string;
  description?: string;
}

export interface RelatedDonorLink {
  donorId: string;
  strength: 'Strong' | 'Medium' | 'Low';
}

export interface RelatedPolicyLink {
  policyId: string;
  reason: string;
}

export interface Policy {
  id: string;
  title: string;
  jurisdiction: Jurisdiction;
  topic: string;
  status: PolicyStatus;
  effectiveDate: string;
  lastUpdate: string;
  impactLevel: ImpactLevel;
  teams: string[];
  summary: string;
  recommendedAction: string;
  stakeholders: Stakeholder[];
  timeline: PolicyTimelineEvent[];
  relatedDonors?: RelatedDonorLink[];
  relatedPolicyIds?: string[];
}

export const policies: Policy[] = [
  {
    id: 'nyc-food-expansion',
    title: 'NYC Food Expansion Act',
    jurisdiction: 'City',
    topic: 'Food security',
    status: 'Under review',
    effectiveDate: 'June 2026',
    lastUpdate: '2026-04-22',
    impactLevel: 'High opportunity',
    teams: ['Executive', 'Programs', 'Communications'],
    summary:
      "This expansion would bring 85,000 more people into our service area — and unlock new funding to serve them. Here's who's involved and what we should do.",
    recommendedAction:
      'Draft donor update to RobinHood Foundation highlighting expanded service-area overlap. Brief comms on advocacy messaging for the June 10 hearing.',
    relatedDonors: [
      { donorId: 'maya-patel', strength: 'Strong' },
      { donorId: 'amira-hassan', strength: 'Medium' },
    ],
    relatedPolicyIds: ['anti-eviction-funding', 'housing-tax-credit'],
    stakeholders: [
      { name: 'NYC Council Health & Food Committee', stance: 'supportive' },
      { name: 'Restaurant Industry Council', stance: 'opposed' },
      { name: 'City Budget Office', stance: 'uncertain' },
      { name: 'RobinHood Foundation', stance: 'mixed' },
    ],
    timeline: [
      { date: '2026-01-12', title: 'Policy Identified', description: "Detected by Ekko's policy monitor" },
      { date: '2026-02-20', title: 'Impact Assessment', description: 'Assessed as high opportunity' },
      { date: '2026-03-15', title: 'Council Committee Hearing', description: 'Public testimony is open' },
      { date: '2026-05-01', title: 'Coalition Agreement', description: 'Coalition positions confirmed' },
      { date: '2026-06-10', title: 'Council Floor Vote', description: 'Awaiting full council vote' },
      { date: '2026-09-01', title: 'Implementation Begins', description: 'New coverage areas go live' },
    ],
  },
  {
    id: 'right-to-counsel',
    title: 'NYC SNAP Eligibility Reform',
    jurisdiction: 'City',
    topic: 'Food access',
    status: 'Under review',
    effectiveDate: 'June 2026',
    lastUpdate: '2026-04-10',
    impactLevel: 'High opportunity',
    teams: ['Advocacy', 'Programs', 'Communications'],
    summary: 'Reform could broaden SNAP enrollment support eligibility for low-income New Yorkers in Brooklyn, Queens, and Bronx. Aligns with Provide Food NYC\'s mission area and could open new program funding channels.',
    recommendedAction: 'Prepare explainer for donors and residents. Highlight income eligibility expansion and how it strengthens existing food access programs.',
    relatedDonors: [
      { donorId: 'maya-patel', strength: 'Strong' },
      { donorId: 'amira-hassan', strength: 'Medium' },
      { donorId: 'priya-narang', strength: 'Low' },
    ],
    relatedPolicyIds: ['housing-tax-credit', 'anti-eviction-funding'],
    stakeholders: [
      { name: 'NYC Council Health & Food Committee', stance: 'supportive' },
      { name: 'NYC Food Policy Alliance', stance: 'strong ally' },
      { name: 'Restaurant Industry Council', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-08', title: 'Committee hearing scheduled', description: 'Public testimony session announced for April 22' },
      { date: '2026-03-15', title: 'Amendment proposed', description: 'Income threshold adjusted to 250% of federal poverty level' },
      { date: '2026-02-20', title: 'Bill introduced', description: 'Council Member Rodriguez filed expansion bill' },
      { date: '2026-01-10', title: 'Coalition advocacy meeting', description: 'Provide Food NYC joined 12 orgs in drafting support letter' },
    ],
  },
  {
    id: 'housing-tax-credit',
    title: 'State Community Food Bank Tax Credit Revision',
    jurisdiction: 'State',
    topic: 'Food security finance',
    status: 'Proposed',
    effectiveDate: 'Q3 2026',
    lastUpdate: '2026-04-09',
    impactLevel: 'Medium opportunity',
    teams: ['Leadership', 'Partnerships'],
    summary: 'Changes may improve funding conditions for community food bank operations. Revised credit structure could incentivize more investment in Provide Food NYC\'s target neighborhoods.',
    recommendedAction: 'Brief leadership and coalition partners. Align talking points with the finance committee\'s draft revision before the comment period closes.',
    relatedDonors: [
      { donorId: 'priya-narang', strength: 'Strong' },
      { donorId: 'samir-gupta', strength: 'Medium' },
    ],
    relatedPolicyIds: ['right-to-counsel', 'zoning-reform'],
    stakeholders: [
      { name: 'State Department of Agriculture & Markets', stance: 'mixed' },
      { name: 'NYC Food Policy Alliance', stance: 'strong ally' },
    ],
    timeline: [
      { date: '2026-04-01', title: 'Draft revision circulated', description: 'State finance committee shared preliminary language' },
      { date: '2026-03-10', title: 'Stakeholder input period opened', description: '30-day public comment window' },
      { date: '2026-02-15', title: 'Initial proposal filed', description: 'State Assembly food security subcommittee' },
    ],
  },
  {
    id: 'rental-assistance-reporting',
    title: 'Federal Food Assistance Reporting Change',
    jurisdiction: 'Federal',
    topic: 'Compliance',
    status: 'Approved',
    effectiveDate: 'May 2026',
    lastUpdate: '2026-04-03',
    impactLevel: 'High risk',
    teams: ['Operations', 'Finance'],
    summary: 'New USDA reporting requirements may increase administrative load for organizations distributing federal food assistance funds. Compliance updates needed before May deadline.',
    recommendedAction: 'Audit internal reporting workflow now. Assign a compliance lead and confirm your reporting templates match USDA\'s April guidance before the May deadline.',
    relatedDonors: [
      { donorId: 'priya-narang', strength: 'Strong' },
      { donorId: 'daniel-cho', strength: 'Medium' },
    ],
    relatedPolicyIds: ['tenant-data-privacy'],
    stakeholders: [
      { name: 'State Department of Agriculture & Markets', stance: 'mixed' },
      { name: "Mayor's Office of Food Policy", stance: 'supportive' },
    ],
    timeline: [
      { date: '2026-04-05', title: 'Implementation guidance released', description: 'USDA published detailed reporting templates' },
      { date: '2026-03-20', title: 'Final rule published', description: 'Federal Register notice with May 2026 effective date' },
      { date: '2026-02-01', title: 'Comment period closed', description: 'Provide Food NYC submitted compliance concerns' },
      { date: '2025-12-15', title: 'Proposed rule announced', description: 'Initial notice of reporting changes' },
    ],
  },
  {
    id: 'anti-eviction-funding',
    title: 'City Emergency Food Aid Funding Package',
    jurisdiction: 'City',
    topic: 'Emergency aid',
    status: 'Passed',
    effectiveDate: 'Immediate',
    lastUpdate: '2026-03-28',
    impactLevel: 'High opportunity',
    teams: ['Programs', 'Outreach'],
    summary: 'Creates near-term opportunity to support food-insecure households. Emergency funds available for organizations providing direct food assistance services in qualifying neighborhoods.',
    recommendedAction: 'Launch outreach campaign this week. Applications close May 15 — prioritize neighborhoods where Provide Food NYC already has intake workflows.',
    relatedDonors: [
      { donorId: 'maya-patel', strength: 'Strong' },
      { donorId: 'luis-martinez', strength: 'Strong' },
      { donorId: 'jordan-rivera', strength: 'Medium' },
    ],
    relatedPolicyIds: ['right-to-counsel'],
    stakeholders: [
      { name: 'NYC Council Health & Food Committee', stance: 'supportive' },
      { name: "Mayor's Office of Food Policy", stance: 'supportive' },
      { name: 'NYC Food Policy Alliance', stance: 'strong ally' },
    ],
    timeline: [
      { date: '2026-04-09', title: 'Funding applications open', description: 'Applications accepted through May 15' },
      { date: '2026-04-05', title: 'Bill signed into law', description: 'Mayor signed emergency funding package' },
      { date: '2026-03-28', title: 'Council vote: passed', description: 'Unanimous approval in full council session' },
      { date: '2026-03-15', title: 'Committee approval', description: 'Health & Food committee advanced bill to full council' },
    ],
  },
  {
    id: 'tenant-data-privacy',
    title: 'State Food Recipient Data Privacy Bill',
    jurisdiction: 'State',
    topic: 'Privacy',
    status: 'In committee',
    effectiveDate: 'Effective date TBD',
    lastUpdate: '2026-04-10',
    impactLevel: 'Medium risk',
    teams: ['Operations', 'Legal'],
    summary: 'Could limit how food assistance recipient data is stored and shared. May require changes to data management practices and third-party data sharing agreements.',
    recommendedAction: 'Monitor closely and prepare a data handling review. Identify every third-party vendor that touches recipient records before the bill advances out of committee.',
    relatedDonors: [
      { donorId: 'samir-gupta', strength: 'Medium' },
      { donorId: 'daniel-cho', strength: 'Low' },
    ],
    relatedPolicyIds: ['rental-assistance-reporting'],
    stakeholders: [
      { name: 'NYC Food Policy Alliance', stance: 'strong ally' },
      { name: 'Restaurant Industry Council', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-02', title: 'Subcommittee hearing', description: 'Expert testimony on data privacy standards' },
      { date: '2026-03-18', title: 'Bill assigned to committee', description: 'State Senate judiciary committee' },
      { date: '2026-03-01', title: 'Bill introduced', description: 'Bipartisan sponsorship by 4 state senators' },
    ],
  },
  {
    id: 'zoning-reform',
    title: 'Regional Food Hub Zoning Proposal',
    jurisdiction: 'Regional',
    topic: 'Land use',
    status: 'Draft',
    effectiveDate: 'Effective date TBD',
    lastUpdate: '2026-04-01',
    impactLevel: 'Mixed impact',
    teams: ['Advocacy', 'Executive'],
    summary: 'May affect where community kitchens and food distribution hubs can operate. Proposed zoning changes could create new opportunities but also raise concerns in target communities.',
    recommendedAction: 'Create a stakeholder map and scenario summary. Share with advocacy and executive teams so positions are aligned before scoping sessions begin.',
    relatedDonors: [
      { donorId: 'samir-gupta', strength: 'Medium' },
      { donorId: 'helen-brooks', strength: 'Low' },
    ],
    relatedPolicyIds: ['housing-tax-credit'],
    stakeholders: [
      { name: 'Regional Land Use Board', stance: 'uncertain' },
      { name: "Mayor's Office of Food Policy", stance: 'supportive' },
      { name: 'Restaurant Industry Council', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-01', title: 'Draft proposal published', description: 'Regional planning commission released initial framework' },
      { date: '2026-03-15', title: 'Scoping sessions announced', description: 'Community input meetings scheduled for May' },
    ],
  },
];
