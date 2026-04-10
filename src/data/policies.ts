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

export interface Policy {
  id: string;
  title: string;
  jurisdiction: Jurisdiction;
  topic: string;
  status: PolicyStatus;
  effectiveDate: string;
  impactLevel: ImpactLevel;
  teams: string[];
  summary: string;
  recommendedAction: string;
  stakeholders: Stakeholder[];
  timeline: PolicyTimelineEvent[];
}

export const policies: Policy[] = [
  {
    id: 'right-to-counsel',
    title: 'New York City Right-to-Counsel Expansion',
    jurisdiction: 'City',
    topic: 'Tenant protection',
    status: 'Under review',
    effectiveDate: 'June 2026',
    impactLevel: 'High opportunity',
    teams: ['Advocacy', 'Programs', 'Communications'],
    summary: 'Expansion could increase legal support eligibility for vulnerable tenants in Brooklyn, Queens, and Bronx. This would directly align with Rivergate\'s mission area and could open new program funding channels.',
    recommendedAction: 'Prepare explainer for donors and residents',
    stakeholders: [
      { name: 'NYC Council Housing Committee', stance: 'supportive' },
      { name: 'Tenant Rights Coalition', stance: 'strong ally' },
      { name: 'Property Owners Association', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-08', title: 'Committee hearing scheduled', description: 'Public testimony session announced for April 22' },
      { date: '2026-03-15', title: 'Amendment proposed', description: 'Income threshold adjusted to 250% of federal poverty level' },
      { date: '2026-02-20', title: 'Bill introduced', description: 'Council Member Rodriguez filed expansion bill' },
      { date: '2026-01-10', title: 'Coalition advocacy meeting', description: 'Rivergate joined 12 orgs in drafting support letter' },
    ],
  },
  {
    id: 'housing-tax-credit',
    title: 'State Affordable Housing Tax Credit Revision',
    jurisdiction: 'State',
    topic: 'Affordable housing finance',
    status: 'Proposed',
    effectiveDate: 'Q3 2026',
    impactLevel: 'Medium opportunity',
    teams: ['Leadership', 'Partnerships'],
    summary: 'Changes may improve funding conditions for community housing projects. Revised credit structure could incentivize more investment in Rivergate\'s target neighborhoods.',
    recommendedAction: 'Brief leadership and coalition partners',
    stakeholders: [
      { name: 'State Housing Finance Agency', stance: 'mixed' },
      { name: 'Tenant Rights Coalition', stance: 'strong ally' },
    ],
    timeline: [
      { date: '2026-04-01', title: 'Draft revision circulated', description: 'State finance committee shared preliminary language' },
      { date: '2026-03-10', title: 'Stakeholder input period opened', description: '30-day public comment window' },
      { date: '2026-02-15', title: 'Initial proposal filed', description: 'State Assembly housing subcommittee' },
    ],
  },
  {
    id: 'rental-assistance-reporting',
    title: 'Federal Rental Assistance Reporting Change',
    jurisdiction: 'Federal',
    topic: 'Compliance',
    status: 'Approved',
    effectiveDate: 'May 2026',
    impactLevel: 'High risk',
    teams: ['Operations', 'Finance'],
    summary: 'New reporting requirements may increase administrative load for organizations receiving federal rental assistance funds. Compliance updates needed before May deadline.',
    recommendedAction: 'Audit internal reporting workflow now',
    stakeholders: [
      { name: 'State Housing Finance Agency', stance: 'mixed' },
      { name: "Mayor's Office of Housing Recovery", stance: 'supportive' },
    ],
    timeline: [
      { date: '2026-04-05', title: 'Implementation guidance released', description: 'HUD published detailed reporting templates' },
      { date: '2026-03-20', title: 'Final rule published', description: 'Federal Register notice with May 2026 effective date' },
      { date: '2026-02-01', title: 'Comment period closed', description: 'Rivergate submitted compliance concerns' },
      { date: '2025-12-15', title: 'Proposed rule announced', description: 'Initial notice of reporting changes' },
    ],
  },
  {
    id: 'anti-eviction-funding',
    title: 'City Anti-Eviction Emergency Funding Package',
    jurisdiction: 'City',
    topic: 'Emergency aid',
    status: 'Passed',
    effectiveDate: 'Immediate',
    impactLevel: 'High opportunity',
    teams: ['Programs', 'Outreach'],
    summary: 'Creates near-term opportunity to support at-risk households. Emergency funds available for organizations providing direct tenant services in qualifying neighborhoods.',
    recommendedAction: 'Launch outreach campaign this week',
    stakeholders: [
      { name: 'NYC Council Housing Committee', stance: 'supportive' },
      { name: "Mayor's Office of Housing Recovery", stance: 'supportive' },
      { name: 'Tenant Rights Coalition', stance: 'strong ally' },
    ],
    timeline: [
      { date: '2026-04-09', title: 'Funding applications open', description: 'Applications accepted through May 15' },
      { date: '2026-04-05', title: 'Bill signed into law', description: 'Mayor signed emergency funding package' },
      { date: '2026-03-28', title: 'Council vote: passed', description: 'Unanimous approval in full council session' },
      { date: '2026-03-15', title: 'Committee approval', description: 'Housing committee advanced bill to full council' },
    ],
  },
  {
    id: 'tenant-data-privacy',
    title: 'State Tenant Data Privacy Bill',
    jurisdiction: 'State',
    topic: 'Privacy',
    status: 'In committee',
    effectiveDate: 'Unknown',
    impactLevel: 'Medium risk',
    teams: ['Operations', 'Legal'],
    summary: 'Could limit how tenant data is stored and shared. May require changes to Rivergate\'s data management practices and third-party data sharing agreements.',
    recommendedAction: 'Monitor closely and prepare data handling review',
    stakeholders: [
      { name: 'Tenant Rights Coalition', stance: 'strong ally' },
      { name: 'Property Owners Association', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-02', title: 'Subcommittee hearing', description: 'Expert testimony on data privacy standards' },
      { date: '2026-03-18', title: 'Bill assigned to committee', description: 'State Senate judiciary committee' },
      { date: '2026-03-01', title: 'Bill introduced', description: 'Bipartisan sponsorship by 4 state senators' },
    ],
  },
  {
    id: 'zoning-reform',
    title: 'Regional Zoning Reform Proposal',
    jurisdiction: 'Regional',
    topic: 'Land use',
    status: 'Draft',
    effectiveDate: 'Unknown',
    impactLevel: 'Mixed impact',
    teams: ['Advocacy', 'Executive'],
    summary: 'May affect long-term housing development strategy. Proposed changes to residential zoning could create new opportunities but also raise density concerns in target communities.',
    recommendedAction: 'Create stakeholder map and scenario summary',
    stakeholders: [
      { name: 'Regional Land Use Board', stance: 'uncertain' },
      { name: "Mayor's Office of Housing Recovery", stance: 'supportive' },
      { name: 'Property Owners Association', stance: 'opposed' },
    ],
    timeline: [
      { date: '2026-04-01', title: 'Draft proposal published', description: 'Regional planning commission released initial framework' },
      { date: '2026-03-15', title: 'Scoping sessions announced', description: 'Community input meetings scheduled for May' },
    ],
  },
];
