export interface SavedView {
  id: string;
  name: string;
  description: string;
  scope: 'donors' | 'policy' | 'peers';
  createdBy: string;
  isShared: boolean;
  resultCount: number;
  filters: Record<string, string[]>;
  isDefault?: boolean;
}

export const savedViews: SavedView[] = [
  // Donor views
  {
    id: 'view-major-active',
    name: 'Major donors — active',
    description: 'Major-tier donors actively engaged',
    scope: 'donors',
    createdBy: 'Leah Kim',
    isShared: true,
    resultCount: 18,
    filters: { donorType: ['Major donor', 'Individual major donor'], givingStatus: ['Active'] },
    isDefault: true,
  },
  {
    id: 'view-at-risk-now',
    name: 'At-risk this quarter',
    description: 'High-risk donors needing immediate outreach',
    scope: 'donors',
    createdBy: 'Leah Kim',
    isShared: true,
    resultCount: 4,
    filters: { risk: ['High'] },
  },
  {
    id: 'view-foundation-pipeline',
    name: 'Foundation pipeline',
    description: 'Active foundation contacts at any stage',
    scope: 'donors',
    createdBy: 'Noah Stein',
    isShared: true,
    resultCount: 12,
    filters: { donorType: ['Foundation contact'] },
  },
  {
    id: 'view-corporate-q2',
    name: 'Corporate Q2 outreach',
    description: 'Corporate contacts to engage in Q2 2026',
    scope: 'donors',
    createdBy: 'Marcus Bell',
    isShared: false,
    resultCount: 7,
    filters: { donorType: ['Corporate contact'] },
  },
  {
    id: 'view-new-prospects',
    name: 'New prospects',
    description: 'Warm and cold prospects added in last 30 days',
    scope: 'donors',
    createdBy: 'Leah Kim',
    isShared: false,
    resultCount: 9,
    filters: { stage: ['Early', 'Unqualified'] },
  },
  // Policy views
  {
    id: 'view-policy-watchlist',
    name: 'My watchlist',
    description: 'Personally tracked policies',
    scope: 'policy',
    createdBy: 'Sofia Reyes',
    isShared: false,
    resultCount: 4,
    filters: {},
    isDefault: true,
  },
  {
    id: 'view-policy-immediate',
    name: 'Immediate action needed',
    description: 'High-risk or high-opportunity policies effective in next 60 days',
    scope: 'policy',
    createdBy: 'Sofia Reyes',
    isShared: true,
    resultCount: 3,
    filters: { impactLevel: ['High risk', 'High opportunity'] },
  },
];
