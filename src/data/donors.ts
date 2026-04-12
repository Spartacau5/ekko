export type DonorType = 'Individual major donor' | 'Recurring donor' | 'Prospective donor' | 'Lapsed donor' | 'Foundation contact' | 'Corporate contact' | 'Major donor' | 'Small donor';
export type GivingStatus = 'Active' | 'At risk' | 'Warm' | 'Inactive' | 'Cold';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Stage = 'Growing' | 'Slipping' | 'Early' | 'Lapsed' | 'Stewardship' | 'Stable' | 'Evaluation' | 'Unqualified';

export interface TimelineEvent {
  date: string;
  type: 'gift' | 'email' | 'event' | 'meeting' | 'note' | 'call' | 'download';
  title: string;
  description?: string;
}

export interface Donor {
  id: string;
  name: string;
  donorType: DonorType;
  givingStatus: GivingStatus;
  persona: string;
  interests: string[];
  lastEngagement: string;
  accountOwner: string;
  stage: Stage;
  risk: RiskLevel;
  suggestedNextAction: string;
  suggestedReason?: string;
  lifetimeGiving?: number;
  lastGift?: number | string;
  email: string;
  phone: string;
  timeline: TimelineEvent[];
}

export const donors: Donor[] = [
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    donorType: 'Individual major donor',
    givingStatus: 'Active',
    persona: 'Policy-minded civic supporter',
    interests: ['Tenant rights', 'Community safety'],
    lastEngagement: 'Attended donor breakfast 6 days ago',
    accountOwner: 'Leah Kim',
    stage: 'Growing',
    risk: 'Low',
    suggestedNextAction: 'Send tailored update on tenant protection policy wins',
    suggestedReason: 'Maya attended the donor breakfast 6 days ago and asked about Right-to-Counsel. She sits on a Crown Heights community board — this lands directly.',
    lifetimeGiving: 18500,
    lastGift: 2500,
    email: 'maya.patel@email.com',
    phone: '(212) 555-0142',
    timeline: [
      { date: '2026-04-04', type: 'event', title: 'Attended donor breakfast', description: 'Spring donor appreciation breakfast at Brooklyn Community Center' },
      { date: '2026-03-15', type: 'gift', title: 'Gift received: $2,500', description: 'Annual fund contribution' },
      { date: '2026-03-01', type: 'email', title: 'Opened policy update email', description: 'Tenant protection legislative summary' },
      { date: '2026-02-10', type: 'meeting', title: 'One-on-one with Leah Kim', description: 'Discussed housing policy priorities and giving plans' },
      { date: '2026-01-20', type: 'email', title: 'Clicked year-in-review email', description: '2025 impact report link' },
      { date: '2025-12-15', type: 'gift', title: 'Gift received: $5,000', description: 'Year-end gift' },
      { date: '2025-11-01', type: 'event', title: 'Attended annual gala', description: 'Table sponsor at fall fundraiser' },
    ],
  },
  {
    id: 'jordan-rivera',
    name: 'Jordan Rivera',
    donorType: 'Recurring donor',
    givingStatus: 'At risk',
    persona: 'Neighborhood loyalist',
    interests: ['Mutual aid', 'Local families'],
    lastEngagement: 'No opens in 45 days',
    accountOwner: 'Leah Kim',
    stage: 'Slipping',
    risk: 'High',
    suggestedNextAction: 'Re-engage with community impact story and simple renewal CTA',
    suggestedReason: 'No email opens in 45 days but he was previously active (opened 2 of 3). Bronx Housing\u2019s emergency aid messaging resonates in his neighborhoods — use that hook.',
    lifetimeGiving: 4200,
    lastGift: '$50/month',
    email: 'jordan.rivera@email.com',
    phone: '(718) 555-0298',
    timeline: [
      { date: '2026-02-24', type: 'email', title: 'Email sent: Monthly update', description: 'No open recorded' },
      { date: '2026-02-01', type: 'gift', title: 'Recurring gift: $50', description: 'Monthly auto-donation processed' },
      { date: '2026-01-15', type: 'email', title: 'Email sent: Volunteer invite', description: 'No open recorded' },
      { date: '2026-01-01', type: 'gift', title: 'Recurring gift: $50', description: 'Monthly auto-donation processed' },
      { date: '2025-12-01', type: 'gift', title: 'Recurring gift: $50', description: 'Monthly auto-donation processed' },
      { date: '2025-11-15', type: 'email', title: 'Opened neighborhood impact story', description: 'Clicked through to full story' },
      { date: '2025-10-20', type: 'event', title: 'Attended block party', description: 'Community outreach event in Crown Heights' },
    ],
  },
  {
    id: 'amira-hassan',
    name: 'Amira Hassan',
    donorType: 'Prospective donor',
    givingStatus: 'Warm',
    persona: 'Values-first connector',
    interests: ['Youth programs', 'Housing justice'],
    lastEngagement: 'Downloaded annual report',
    accountOwner: 'Noah Stein',
    stage: 'Early',
    risk: 'Medium',
    suggestedNextAction: 'Invite to small briefing event',
    suggestedReason: 'Downloaded the annual report last week and subscribed to the newsletter — strong warm signals. A low-pressure briefing converts her profile type well.',
    email: 'amira.hassan@email.com',
    phone: '(646) 555-0187',
    timeline: [
      { date: '2026-03-28', type: 'download', title: 'Downloaded annual report', description: '2025 annual impact report PDF' },
      { date: '2026-03-20', type: 'email', title: 'Subscribed to newsletter', description: 'Via website form' },
      { date: '2026-03-10', type: 'note', title: 'Referred by board member', description: 'Introduction via Sarah Chen, board treasurer' },
    ],
  },
  {
    id: 'daniel-cho',
    name: 'Daniel Cho',
    donorType: 'Lapsed donor',
    givingStatus: 'Inactive',
    persona: 'Outcome-focused professional',
    interests: ['Data transparency', 'Measurable impact'],
    lastEngagement: 'Last donated 14 months ago',
    accountOwner: 'Leah Kim',
    stage: 'Lapsed',
    risk: 'High',
    suggestedNextAction: 'Send concise impact snapshot with renewal ask',
    suggestedReason: 'Lapsed 14 months but kept opening emails through Q1 2025 — soft signal he can be re-warmed. He\u2019s outcome-focused, so a single-page snapshot fits his pattern.',
    lifetimeGiving: 7800,
    lastGift: 500,
    email: 'daniel.cho@email.com',
    phone: '(917) 555-0334',
    timeline: [
      { date: '2025-02-15', type: 'gift', title: 'Gift received: $500', description: 'Last recorded donation' },
      { date: '2025-01-10', type: 'email', title: 'Opened impact report email', description: '2024 outcomes summary' },
      { date: '2024-12-20', type: 'gift', title: 'Gift received: $1,000', description: 'Year-end contribution' },
      { date: '2024-10-05', type: 'meeting', title: 'Met at conference', description: 'NYC Housing Summit panel discussion' },
      { date: '2024-06-15', type: 'gift', title: 'Gift received: $500', description: 'Mid-year gift' },
    ],
  },
  {
    id: 'priya-narang',
    name: 'Priya Narang',
    donorType: 'Foundation contact',
    givingStatus: 'Active',
    persona: 'Strategic partner',
    interests: ['Systems change', 'Coalition work'],
    lastEngagement: 'Met last week',
    accountOwner: 'Noah Stein',
    stage: 'Stewardship',
    risk: 'Low',
    suggestedNextAction: 'Share peer benchmark report before renewal meeting',
    suggestedReason: 'Priya specifically asked for benchmark context last quarter. Renewal meeting is in two weeks — the housing finance cohort data is the right frame.',
    lifetimeGiving: 75000,
    lastGift: 25000,
    email: 'priya.narang@foundation.org',
    phone: '(212) 555-0501',
    timeline: [
      { date: '2026-04-03', type: 'meeting', title: 'Quarterly review meeting', description: 'Discussed program outcomes and renewal timeline' },
      { date: '2026-03-01', type: 'email', title: 'Sent grant progress report', description: 'Q1 2026 milestone update' },
      { date: '2026-01-15', type: 'gift', title: 'Grant disbursement: $25,000', description: 'Annual program grant \u2013 Year 2 of 3' },
      { date: '2025-10-20', type: 'meeting', title: 'Site visit', description: 'Foundation team toured Brooklyn program sites' },
      { date: '2025-07-01', type: 'note', title: 'Grant approved for renewal', description: 'Multi-year housing stability initiative' },
    ],
  },
  {
    id: 'luis-martinez',
    name: 'Luis Martinez',
    donorType: 'Recurring donor',
    givingStatus: 'Active',
    persona: 'Community-first giver',
    interests: ['Tenant support', 'Legal aid'],
    lastEngagement: 'Clicked email yesterday',
    accountOwner: 'Leah Kim',
    stage: 'Stable',
    risk: 'Low',
    suggestedNextAction: 'Thank and invite to volunteer night',
    suggestedReason: 'Clicked yesterday\u2019s email and attended a volunteer orientation last month. He\u2019s a consistent monthly giver — volunteer night deepens that tie.',
    email: 'luis.martinez@email.com',
    phone: '(347) 555-0219',
    timeline: [
      { date: '2026-04-09', type: 'email', title: 'Clicked tenant support email', description: 'Legal aid expansion announcement' },
      { date: '2026-04-01', type: 'gift', title: 'Recurring gift: $35', description: 'Monthly auto-donation' },
      { date: '2026-03-15', type: 'event', title: 'Attended volunteer orientation', description: 'Weekend tenant assistance program' },
      { date: '2026-03-01', type: 'gift', title: 'Recurring gift: $35', description: 'Monthly auto-donation' },
      { date: '2026-02-01', type: 'gift', title: 'Recurring gift: $35', description: 'Monthly auto-donation' },
    ],
  },
  {
    id: 'helen-brooks',
    name: 'Helen Brooks',
    donorType: 'Corporate contact',
    givingStatus: 'Warm',
    persona: 'CSR evaluator',
    interests: ['Community partnership', 'Employee volunteerism'],
    lastEngagement: 'Opened sponsorship deck',
    accountOwner: 'Marcus Bell',
    stage: 'Evaluation',
    risk: 'Medium',
    suggestedNextAction: 'Send partnership concept note',
    suggestedReason: 'Helen opened the sponsorship deck and had an intro call with Marcus. CSR evaluators at this stage convert 40% of the time with a tailored concept note.',
    email: 'helen.brooks@corp.com',
    phone: '(212) 555-0788',
    timeline: [
      { date: '2026-04-02', type: 'email', title: 'Opened sponsorship deck', description: 'Community Impact Partnership proposal' },
      { date: '2026-03-20', type: 'meeting', title: 'Intro call with Marcus Bell', description: 'Discussed CSR alignment and volunteer opportunities' },
      { date: '2026-03-10', type: 'note', title: 'Contact added via referral', description: 'Introduced by NYC Chamber of Commerce event' },
    ],
  },
  {
    id: 'samir-gupta',
    name: 'Samir Gupta',
    donorType: 'Major donor',
    givingStatus: 'Active',
    persona: 'Research-driven backer',
    interests: ['Policy reform', 'Housing data'],
    lastEngagement: 'Read policy digest',
    accountOwner: 'Noah Stein',
    stage: 'Growing',
    risk: 'Low',
    suggestedNextAction: 'Schedule one-to-one policy update',
    suggestedReason: 'Samir just read the March policy digest and gave $10K last quarter. He\u2019s research-driven — a 1:1 policy update with Noah matches his engagement pattern.',
    lifetimeGiving: 32000,
    lastGift: 10000,
    email: 'samir.gupta@email.com',
    phone: '(646) 555-0456',
    timeline: [
      { date: '2026-04-07', type: 'email', title: 'Read policy digest', description: 'March 2026 housing policy roundup' },
      { date: '2026-03-01', type: 'gift', title: 'Gift received: $10,000', description: 'Q1 major gift' },
      { date: '2026-01-15', type: 'meeting', title: 'Policy briefing lunch', description: 'One-on-one with Noah Stein on housing data trends' },
      { date: '2025-12-20', type: 'gift', title: 'Gift received: $5,000', description: 'Year-end contribution' },
      { date: '2025-09-10', type: 'event', title: 'Attended research panel', description: 'Housing data transparency forum' },
    ],
  },
  {
    id: 'erin-wallace',
    name: 'Erin Wallace',
    donorType: 'Small donor',
    givingStatus: 'Active',
    persona: 'Story-led supporter',
    interests: ['Family services', 'Neighborhood stories'],
    lastEngagement: 'Shared campaign post',
    accountOwner: 'Leah Kim',
    stage: 'Stable',
    risk: 'Low',
    suggestedNextAction: 'Offer ambassador toolkit',
    suggestedReason: 'Erin shared a campaign post on social — she\u2019s already advocating unprompted. Ambassador toolkit formalizes what she\u2019s doing naturally.',
    email: 'erin.wallace@email.com',
    phone: '(718) 555-0167',
    timeline: [
      { date: '2026-04-06', type: 'email', title: 'Shared campaign post on social', description: 'Family housing success story' },
      { date: '2026-03-15', type: 'gift', title: 'Gift received: $25', description: 'One-time donation via social campaign' },
      { date: '2026-02-28', type: 'email', title: 'Opened family spotlight email', description: 'Monthly neighborhood stories digest' },
      { date: '2026-01-10', type: 'gift', title: 'Gift received: $25', description: 'Response to year-start appeal' },
    ],
  },
  {
    id: 'omar-el-sayed',
    name: 'Omar El-Sayed',
    donorType: 'Prospective donor',
    givingStatus: 'Cold',
    persona: 'Analytical evaluator',
    interests: ['Affordable housing', 'Program efficiency'],
    lastEngagement: 'Visited donation page only',
    accountOwner: 'Marcus Bell',
    stage: 'Unqualified',
    risk: 'Medium',
    suggestedNextAction: 'Nurture with one short case study email',
    suggestedReason: 'Omar clicked an ad and visited the donation page but didn\u2019t convert. A single case study email is the lightest next touch that keeps the thread alive.',
    email: 'omar.elsayed@email.com',
    phone: '(917) 555-0602',
    timeline: [
      { date: '2026-03-25', type: 'note', title: 'Visited donation page', description: 'No conversion \u2013 exited before completing form' },
      { date: '2026-03-20', type: 'email', title: 'Clicked ad: affordable housing outcomes', description: 'Paid social campaign click-through' },
    ],
  },
];
