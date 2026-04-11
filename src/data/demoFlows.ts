// Phase 5: demo flow registry.
// Five canonical walkthroughs that connect Ekko's surfaces into coherent
// product stories. Each flow is a sequence of steps with a route, a focus
// area, and a one-line narrative pointer for the presenter or reviewer.
//
// The flows are the connective tissue of the prototype: they make sure that
// when a reviewer asks "show me how a fundraiser uses this", there is a real,
// rehearsed answer rather than a list of disconnected screens.

import { Maturity } from '../lib/MaturityContext';
import { Role } from './team';

export type DemoFlowId =
  | 'day0-activation'
  | 'fundraising-jordan'
  | 'policy-rtc'
  | 'peer-bronx'
  | 'executive-overview';

export interface DemoStep {
  id: string;
  title: string;          // short label, used in the strip and step list
  body: string;           // 1-2 sentence narrative pointer for the presenter
  route: string;          // canonical route (no /day-0 or /day-x prefix)
  focus?: string;         // optional name of the section/module to look at
}

export interface DemoFlow {
  id: DemoFlowId;
  name: string;
  audience: string;       // e.g. "Fundraising lead"
  duration: string;       // e.g. "~2 min"
  rationale: string;      // why this flow matters — used as card description
  recommendedRole?: Role;
  recommendedMaturity: Maturity;
  steps: DemoStep[];
}

export const demoFlows: DemoFlow[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Day 0 — activation to first value
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'day0-activation',
    name: 'Day 0 → first value',
    audience: 'Any new team',
    duration: '~2 min',
    rationale:
      'Walk through what a brand-new Ekko workspace looks like and how it becomes useful as data, topics, and teammates are connected.',
    recommendedMaturity: 'day0',
    steps: [
      {
        id: 'd0-1',
        title: 'Land in Day 0',
        body: 'Welcome hero, role-aware copy, and a setup state grounded in real numbers (1 of 6 sources, 0 policies tracked).',
        route: '/dashboard',
        focus: 'Day 0 hero',
      },
      {
        id: 'd0-2',
        title: 'Connect Salesforce',
        body: 'Salesforce is the most valuable starting point — it unlocks risk detection, full timelines, and suggested next steps on every donor.',
        route: '/settings',
        focus: 'Integrations',
      },
      {
        id: 'd0-3',
        title: 'Pick what to track',
        body: 'On the Policy page, choose tracked topics. Each one starts a feed of hearings, amendments, and votes scoped to your mission.',
        route: '/policy',
        focus: 'Tracked topics',
      },
      {
        id: 'd0-4',
        title: 'Opt in to peer benchmarking',
        body: 'Aggregated and anonymized only. Once on, you compare against nonprofits in your bucket on retention, conversion, and channel mix.',
        route: '/peers',
        focus: 'Benchmarking opt-in',
      },
      {
        id: 'd0-5',
        title: 'See the mature workspace',
        body: 'Switch to Day X to see what the same dashboard becomes after a few weeks of connected data, tracked topics, and assigned actions.',
        route: '/dashboard',
        focus: 'Maturity switcher',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Fundraising — Jordan Rivera at risk
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'fundraising-jordan',
    name: 'Fundraising · Save Jordan Rivera',
    audience: 'Fundraising lead',
    duration: '~2 min',
    rationale:
      'A monthly recurring donor stops engaging. Ekko flags the risk, surfaces context, and turns a quiet drift into an assignable follow-up.',
    recommendedRole: 'fundraising',
    recommendedMaturity: 'dayX',
    steps: [
      {
        id: 'fr-1',
        title: 'Spot the at-risk pin',
        body: 'On the Fundraising dashboard, Jordan Rivera shows up in pinned priorities — "45 days no engagement, At risk."',
        route: '/dashboard',
        focus: 'Pinned priorities',
      },
      {
        id: 'fr-2',
        title: 'Open the donor profile',
        body: 'Risk badge, persona insight, full engagement timeline, and the exact gift cadence that triggered the risk score.',
        route: '/people/donors/jordan-rivera',
        focus: 'Risk + timeline',
      },
      {
        id: 'fr-3',
        title: 'Use the suggested next step',
        body: 'Ekko proposes a re-engagement email tied to a tenant-rights story Jordan has clicked on before. One click prefills the follow-up composer.',
        route: '/people/donors/jordan-rivera',
        focus: 'Suggested next step',
      },
      {
        id: 'fr-4',
        title: 'See the action on the dashboard',
        body: 'The follow-up shows up in your priority tasks list with owner and due date. Status edits propagate back here in real time.',
        route: '/dashboard',
        focus: 'Priority tasks',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Policy — Right-to-Counsel hearing
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'policy-rtc',
    name: 'Policy · Right-to-Counsel hearing',
    audience: 'Policy lead',
    duration: '~2 min',
    rationale:
      'A high-opportunity housing bill is heading to a hearing. Ekko shows the stakeholder map, the testimony deadline, and the recommended next move.',
    recommendedRole: 'policy',
    recommendedMaturity: 'dayX',
    steps: [
      {
        id: 'pl-1',
        title: 'Catch the policy alert',
        body: 'The Policy dashboard column highlights NYC Right-to-Counsel — "Hearing in 12 days, testimony deadline April 15."',
        route: '/dashboard',
        focus: 'Policy column',
      },
      {
        id: 'pl-2',
        title: 'Open the policy detail',
        body: 'Summary, jurisdiction, stakeholder alignment bar (supporters / mixed / opposed), and the live timeline of bill movement.',
        route: '/policy/right-to-counsel',
        focus: 'Stakeholders + timeline',
      },
      {
        id: 'pl-3',
        title: 'See the cross-link to fundraising',
        body: 'Three Rivergate donors — including Jordan Rivera — care about tenant rights. This is where People, Policy, and Peers connect.',
        route: '/policy/right-to-counsel',
        focus: 'Linked donors',
      },
      {
        id: 'pl-4',
        title: 'Assign the testimony task',
        body: 'Recommended action: "Submit testimony for Right-to-Counsel hearing." Assign to Noah Stein with a due date inside the deadline.',
        route: '/policy/right-to-counsel',
        focus: 'Recommended action',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Peer — Bronx Housing Justice Network
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'peer-bronx',
    name: 'Peer · Learn from Bronx Housing',
    audience: 'Fundraising or program lead',
    duration: '~2 min',
    rationale:
      'A peer org\u2019s emergency-aid campaign is outperforming sector averages by 230%. Ekko shows what they\u2019re doing differently and how to borrow it.',
    recommendedRole: 'fundraising',
    recommendedMaturity: 'dayX',
    steps: [
      {
        id: 'pe-1',
        title: 'See the peer signal',
        body: 'On the dashboard, the Peers column flags "Bronx Housing Justice — 230% above sector average on emergency-aid creative."',
        route: '/dashboard',
        focus: 'Peers column',
      },
      {
        id: 'pe-2',
        title: 'Open the peer profile',
        body: 'Mission area, geography, opt-in status, and a benchmark comparison across email open rate, retention, and conversion vs. sector.',
        route: '/peers/bronx-housing',
        focus: 'Benchmark vs sector',
      },
      {
        id: 'pe-3',
        title: 'Inspect the winning campaign',
        body: 'Theme, channel mix, and message structure. Save the campaign so it appears in your team\u2019s campaign library next quarter.',
        route: '/peers/bronx-housing',
        focus: 'Saved campaigns',
      },
      {
        id: 'pe-4',
        title: 'See the cross-link to fundraising',
        body: 'The same campaign is the messaging hook the Jordan Rivera re-engagement uses. Peers learning loops back into People work.',
        route: '/peers/bronx-housing',
        focus: 'Linked donors',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Executive — cross-org overview
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'executive-overview',
    name: 'Executive · Scan the org',
    audience: 'Executive director',
    duration: '~90 sec',
    rationale:
      'A 90-second scan of the highest-leverage signals across People, Policy, and Peers. The dashboard shows what the team owns, what\u2019s urgent, and where attention should go this week.',
    recommendedRole: 'executive',
    recommendedMaturity: 'dayX',
    steps: [
      {
        id: 'ex-1',
        title: 'Glance at the day',
        body: 'Hero shows the count of urgent items, your role context, and the day. Pinned priorities sit above the fold.',
        route: '/dashboard',
        focus: 'Hero + pins',
      },
      {
        id: 'ex-2',
        title: 'Read the three columns',
        body: 'People / Policy / Peers in priority order. Each column shows the highest-signal item with one-click drill-in.',
        route: '/dashboard',
        focus: 'Triple column',
      },
      {
        id: 'ex-3',
        title: 'Drill into a priority',
        body: 'Click into the Right-to-Counsel hearing. As an executive, you can see the stakeholder map and reassign the testimony if needed.',
        route: '/policy/right-to-counsel',
        focus: 'Stakeholders',
      },
      {
        id: 'ex-4',
        title: 'See the team\u2019s actions',
        body: 'Back on the dashboard, the priority task list shows everything assigned across your team this week — owner, due date, status.',
        route: '/dashboard',
        focus: 'Priority tasks',
      },
    ],
  },
];

export function getDemoFlow(id: DemoFlowId): DemoFlow | undefined {
  return demoFlows.find((f) => f.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-feature linked insights — drives LinkedInsightCard placement
// ─────────────────────────────────────────────────────────────────────────────

export type LinkedInsightSurface = 'donor' | 'policy' | 'peer';

export interface LinkedInsight {
  fromType: LinkedInsightSurface;
  fromId: string;
  toType: LinkedInsightSurface;
  toId: string;
  toLabel: string;
  toRoute: string;
  reason: string;       // human-readable: why this is linked
  badge?: string;       // optional small chip
}

// The narrative spine: Jordan Rivera ↔ Right-to-Counsel ↔ Bronx Housing.
// These cross-links are what make the prototype feel like one product instead
// of three disconnected modules.
export const linkedInsights: LinkedInsight[] = [
  // Jordan ↔ RTC
  {
    fromType: 'donor', fromId: 'jordan-rivera',
    toType: 'policy',  toId: 'right-to-counsel',
    toLabel: 'NYC Right-to-Counsel Expansion',
    toRoute: '/policy/right-to-counsel',
    reason: 'Jordan has clicked on three tenant-rights updates this quarter and gave $250 after the last RTC vote.',
    badge: 'Hearing in 12 days',
  },
  // Jordan ↔ Bronx campaign
  {
    fromType: 'donor', fromId: 'jordan-rivera',
    toType: 'peer',    toId: 'bronx-housing',
    toLabel: 'Bronx Housing Justice — Emergency aid creative',
    toRoute: '/peers/bronx-housing',
    reason: 'Bronx Housing\u2019s outperforming campaign messaging is the recommended hook for Jordan\u2019s re-engagement email.',
    badge: '230% vs sector',
  },
  // RTC ↔ donors who care
  {
    fromType: 'policy', fromId: 'right-to-counsel',
    toType: 'donor',   toId: 'jordan-rivera',
    toLabel: 'Jordan Rivera',
    toRoute: '/people/donors/jordan-rivera',
    reason: 'Recurring donor, tenant-rights interest. At risk — re-engagement is overdue.',
    badge: 'At risk',
  },
  {
    fromType: 'policy', fromId: 'right-to-counsel',
    toType: 'donor',   toId: 'maya-patel',
    toLabel: 'Maya Patel',
    toRoute: '/people/donors/maya-patel',
    reason: 'Major donor — explicitly named tenant protection as a giving priority on her last call with Leah.',
    badge: 'Major donor',
  },
  // RTC ↔ Bronx (coalition partner)
  {
    fromType: 'policy', fromId: 'right-to-counsel',
    toType: 'peer',    toId: 'bronx-housing',
    toLabel: 'Bronx Housing Justice Network',
    toRoute: '/peers/bronx-housing',
    reason: 'Coalition partner on the right-to-counsel coalition letter. Their advocacy push is running in parallel.',
  },
  // Bronx ↔ RTC
  {
    fromType: 'peer', fromId: 'bronx-housing',
    toType: 'policy', toId: 'right-to-counsel',
    toLabel: 'NYC Right-to-Counsel Expansion',
    toRoute: '/policy/right-to-counsel',
    reason: 'Bronx Housing\u2019s right-to-counsel campaign aligns with our advocacy moment. Hearing April 22.',
    badge: 'Active campaign',
  },
  // Bronx ↔ Jordan
  {
    fromType: 'peer', fromId: 'bronx-housing',
    toType: 'donor', toId: 'jordan-rivera',
    toLabel: 'Jordan Rivera',
    toRoute: '/people/donors/jordan-rivera',
    reason: 'Their winning emergency-aid creative is the recommended messaging hook for Jordan\u2019s re-engagement.',
    badge: 'Use this hook',
  },
];

export function linksFor(type: LinkedInsightSurface, id: string): LinkedInsight[] {
  return linkedInsights.filter((l) => l.fromType === type && l.fromId === id);
}

// The three entities that form the canonical Phase 5 narrative spine. Any
// surface that wants to flag "this item is part of this week's story" can
// check membership here.
export const NARRATIVE_SPINE_IDS = new Set<string>([
  'jordan-rivera',
  'right-to-counsel',
  'bronx-housing',
]);

export function isOnNarrativeSpine(link: string): boolean {
  return Array.from(NARRATIVE_SPINE_IDS).some((id) => link.includes(id));
}
