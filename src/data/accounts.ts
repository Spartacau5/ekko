export type AccountType = 'Foundation' | 'Corporation' | 'Household' | 'Government' | 'Religious';
export type AccountStage = 'Active partner' | 'Cultivation' | 'Stewardship' | 'Lapsed' | 'Prospect';

export interface AccountContact {
  name: string;
  role: string;
  email: string;
  isPrimary: boolean;
}

export interface AccountTimelineEvent {
  date: string;
  type: 'meeting' | 'gift' | 'proposal' | 'note' | 'email' | 'event';
  title: string;
  description?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  stage: AccountStage;
  industry?: string;
  location: string;
  website?: string;
  totalLifetime: number;
  lastGift: number;
  lastGiftDate: string;
  nextRenewal?: string;
  accountOwner: string;
  contacts: AccountContact[];
  primaryProgram: string;
  giftHistory: { year: string; amount: number }[];
  timeline: AccountTimelineEvent[];
  notes: string;
  tags: string[];
}

export const accounts: Account[] = [
  {
    id: 'horizon-foundation',
    name: 'Horizon Family Foundation',
    type: 'Foundation',
    stage: 'Active partner',
    location: 'New York, NY',
    website: 'horizonfamilyfdn.org',
    totalLifetime: 425000,
    lastGift: 75000,
    lastGiftDate: '2026-01-15',
    nextRenewal: '2026-12-01',
    accountOwner: 'Noah Stein',
    contacts: [
      { name: 'Priya Narang', role: 'Program Officer', email: 'priya.narang@horizonfdn.org', isPrimary: true },
      { name: 'David Chen', role: 'Senior Director', email: 'david.chen@horizonfdn.org', isPrimary: false },
    ],
    primaryProgram: 'Multi-year housing stability initiative',
    giftHistory: [
      { year: '2022', amount: 50000 },
      { year: '2023', amount: 100000 },
      { year: '2024', amount: 100000 },
      { year: '2025', amount: 125000 },
      { year: '2026', amount: 75000 },
    ],
    timeline: [
      { date: '2026-04-03', type: 'meeting', title: 'Quarterly review', description: 'Discussed program outcomes and renewal timeline with Priya' },
      { date: '2026-03-01', type: 'email', title: 'Sent grant progress report', description: 'Q1 2026 milestone update' },
      { date: '2026-01-15', type: 'gift', title: 'Grant disbursement: $75,000', description: 'Year 4 of 5 multi-year commitment' },
      { date: '2025-10-20', type: 'event', title: 'Site visit', description: 'Foundation team toured Brooklyn program sites' },
    ],
    notes: 'Long-standing partner. Multi-year grant in year 4 of 5. Renewal conversation begins in Q3.',
    tags: ['multi-year', 'major-funder', 'aligned'],
  },
  {
    id: 'brookwood-capital',
    name: 'Brookwood Capital Group',
    type: 'Corporation',
    stage: 'Cultivation',
    industry: 'Financial services',
    location: 'New York, NY',
    website: 'brookwoodcapital.com',
    totalLifetime: 45000,
    lastGift: 25000,
    lastGiftDate: '2025-12-08',
    nextRenewal: '2026-12-01',
    accountOwner: 'Marcus Bell',
    contacts: [
      { name: 'Helen Brooks', role: 'Head of CSR', email: 'helen.brooks@brookwoodcapital.com', isPrimary: true },
      { name: 'James Park', role: 'Community Affairs Manager', email: 'james.park@brookwoodcapital.com', isPrimary: false },
    ],
    primaryProgram: 'Employee volunteer program + sponsorship',
    giftHistory: [
      { year: '2024', amount: 10000 },
      { year: '2025', amount: 35000 },
    ],
    timeline: [
      { date: '2026-04-02', type: 'email', title: 'Opened sponsorship deck', description: 'Community Impact Partnership proposal' },
      { date: '2026-03-20', type: 'meeting', title: 'Intro call with Helen Brooks', description: 'Discussed CSR alignment and volunteer opportunities' },
      { date: '2025-12-08', type: 'gift', title: 'Gift received: $25,000', description: 'Year-end sponsorship' },
    ],
    notes: 'New corporate partner with growth potential. Helen is the champion. Push for board engagement in Q3.',
    tags: ['corporate', 'cultivation', 'csr'],
  },
  {
    id: 'patel-household',
    name: 'Patel Household',
    type: 'Household',
    stage: 'Stewardship',
    location: 'Manhattan, NY',
    totalLifetime: 32500,
    lastGift: 2500,
    lastGiftDate: '2026-03-15',
    accountOwner: 'Leah Kim',
    contacts: [
      { name: 'Maya Patel', role: 'Primary contact', email: 'maya.patel@email.com', isPrimary: true },
      { name: 'Raj Patel', role: 'Spouse', email: 'raj.patel@email.com', isPrimary: false },
    ],
    primaryProgram: 'Annual fund + tenant rights advocacy',
    giftHistory: [
      { year: '2022', amount: 5000 },
      { year: '2023', amount: 7500 },
      { year: '2024', amount: 8500 },
      { year: '2025', amount: 9000 },
      { year: '2026', amount: 2500 },
    ],
    timeline: [
      { date: '2026-04-04', type: 'event', title: 'Maya attended donor breakfast', description: 'Spring donor appreciation breakfast' },
      { date: '2026-03-15', type: 'gift', title: 'Gift received: $2,500', description: 'Annual fund' },
      { date: '2026-02-10', type: 'meeting', title: 'One-on-one with Leah Kim' },
    ],
    notes: 'Maya is the primary engager but Raj is also receptive. Couple may be open to a planned giving conversation in 2027.',
    tags: ['major', 'household', 'policy-aligned'],
  },
  {
    id: 'urban-roots-fund',
    name: 'Urban Roots Community Fund',
    type: 'Foundation',
    stage: 'Stewardship',
    location: 'Brooklyn, NY',
    website: 'urbanrootsfund.org',
    totalLifetime: 180000,
    lastGift: 60000,
    lastGiftDate: '2025-11-30',
    nextRenewal: '2026-09-15',
    accountOwner: 'Noah Stein',
    contacts: [
      { name: 'Karen Williams', role: 'Executive Director', email: 'karen@urbanrootsfund.org', isPrimary: true },
    ],
    primaryProgram: 'Neighborhood stabilization fund',
    giftHistory: [
      { year: '2023', amount: 40000 },
      { year: '2024', amount: 50000 },
      { year: '2025', amount: 60000 },
      { year: '2026', amount: 30000 },
    ],
    timeline: [
      { date: '2026-03-22', type: 'gift', title: 'Spring disbursement: $30,000', description: 'First half of 2026 commitment' },
      { date: '2026-02-15', type: 'proposal', title: 'Renewal proposal submitted', description: '2026-2028 multi-year request' },
      { date: '2025-11-30', type: 'gift', title: 'Year-end disbursement: $60,000' },
    ],
    notes: 'Renewal pending. Karen is enthusiastic but board approval needed for multi-year commitment.',
    tags: ['foundation', 'renewal-pending', 'neighborhood'],
  },
  {
    id: 'meridian-tech',
    name: 'Meridian Tech',
    type: 'Corporation',
    stage: 'Prospect',
    industry: 'Technology',
    location: 'Long Island City, NY',
    website: 'meridiantech.com',
    totalLifetime: 0,
    lastGift: 0,
    lastGiftDate: '',
    accountOwner: 'Marcus Bell',
    contacts: [
      { name: 'Sarah Liu', role: 'VP People Operations', email: 'sarah.liu@meridiantech.com', isPrimary: true },
    ],
    primaryProgram: 'Initial intro — exploring fit',
    giftHistory: [],
    timeline: [
      { date: '2026-04-01', type: 'note', title: 'Added to prospect list', description: 'Referred by board member at industry event' },
    ],
    notes: 'Cold prospect. Sarah expressed interest in employee volunteer program. Schedule discovery call.',
    tags: ['prospect', 'corporate', 'tech'],
  },
  {
    id: 'cohen-trust',
    name: 'Cohen Family Trust',
    type: 'Household',
    stage: 'Lapsed',
    location: 'Westchester, NY',
    totalLifetime: 28000,
    lastGift: 5000,
    lastGiftDate: '2024-12-12',
    accountOwner: 'Leah Kim',
    contacts: [
      { name: 'Daniel Cho', role: 'Trustee', email: 'daniel.cho@email.com', isPrimary: true },
    ],
    primaryProgram: 'Family stability programs (former)',
    giftHistory: [
      { year: '2021', amount: 3000 },
      { year: '2022', amount: 5000 },
      { year: '2023', amount: 7500 },
      { year: '2024', amount: 12500 },
    ],
    timeline: [
      { date: '2025-02-15', type: 'gift', title: 'Last recorded gift: $500' },
      { date: '2024-12-12', type: 'gift', title: 'Year-end gift: $5,000' },
      { date: '2024-10-05', type: 'meeting', title: 'Met at conference', description: 'NYC Housing Summit panel' },
    ],
    notes: 'Lapsed in early 2025. Daniel had previously been highly engaged. Try a personal note from Sofia.',
    tags: ['lapsed', 'recovery', 'household'],
  },
  {
    id: 'st-marks-parish',
    name: 'St. Marks Parish Outreach',
    type: 'Religious',
    stage: 'Active partner',
    location: 'Brooklyn, NY',
    totalLifetime: 67000,
    lastGift: 12000,
    lastGiftDate: '2026-02-20',
    nextRenewal: '2027-02-01',
    accountOwner: 'Ana Rodriguez',
    contacts: [
      { name: 'Father Mark Sullivan', role: 'Outreach Director', email: 'frmark@stmarksbrooklyn.org', isPrimary: true },
    ],
    primaryProgram: 'Joint tenant assistance ministry',
    giftHistory: [
      { year: '2022', amount: 8000 },
      { year: '2023', amount: 10000 },
      { year: '2024', amount: 12000 },
      { year: '2025', amount: 15000 },
      { year: '2026', amount: 12000 },
    ],
    timeline: [
      { date: '2026-02-20', type: 'gift', title: 'Gift received: $12,000', description: 'Annual ministry support' },
      { date: '2026-01-12', type: 'event', title: 'Joint community day', description: 'Co-hosted tenant rights workshop' },
    ],
    notes: 'Long-standing community partner. Father Mark is the champion. Joint programming is the strongest tie.',
    tags: ['religious', 'community', 'joint-programs'],
  },
  {
    id: 'nyc-wellbeing-office',
    name: 'NYC Office of Community Wellbeing',
    type: 'Government',
    stage: 'Active partner',
    location: 'New York, NY',
    website: 'nyc.gov/wellbeing',
    totalLifetime: 320000,
    lastGift: 80000,
    lastGiftDate: '2026-01-30',
    nextRenewal: '2026-06-30',
    accountOwner: 'Ana Rodriguez',
    contacts: [
      { name: 'Marcus Williams', role: 'Program Director', email: 'mwilliams@nyc.gov', isPrimary: true },
      { name: 'Alicia Torres', role: 'Grants Manager', email: 'atorres@nyc.gov', isPrimary: false },
    ],
    primaryProgram: 'City contracted tenant outreach services',
    giftHistory: [
      { year: '2023', amount: 60000 },
      { year: '2024', amount: 75000 },
      { year: '2025', amount: 105000 },
      { year: '2026', amount: 80000 },
    ],
    timeline: [
      { date: '2026-01-30', type: 'gift', title: 'Q1 contract payment: $80,000' },
      { date: '2025-12-15', type: 'meeting', title: 'Annual contract review' },
    ],
    notes: 'Government contract. Renewal tied to fiscal year. Performance metrics are due quarterly.',
    tags: ['government', 'contract', 'compliance'],
  },
];
