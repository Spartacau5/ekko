import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ArrowUpRight,
  Minus,
  Maximize2,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  List,
  MoreHorizontal,
  Pencil,
  Check,
  Type as TypeIcon,
  Plus,
  Users,
  Search,
  FileText,
  Eye,
  Share2,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useRole } from '../lib/RoleContext';
import { useMaturity } from '../lib/MaturityContext';
import { useActions } from '../lib/ActionContext';
import { DashboardDay0Page } from './day0/DashboardDay0Page';
import { ActionItem, ActionStatus } from '../data/actions';
import { Role, teamMembers, roleMeta } from '../data/team';
import { donors } from '../data/donors';
import { kpiMetrics, recentActivity } from '../data/dashboardMetrics';
import { dashboardAlerts } from '../data/alerts';
import { policies } from '../data/policies';
import { usePins, PinRecord } from '../lib/PinContext';
import { useToast, ActionDrawer } from '../components/ui';
import { motionDurations, motionEasings } from '../lib/motion';
import { Panel } from '../components/dashboard/Panel';
import { KpiCard } from '../components/dashboard/KpiCard';
import { TaskRow } from '../components/dashboard/TaskRow';
import { SignalRow, SignalLegend } from '../components/dashboard/SignalRow';
import { ActivityRow } from '../components/dashboard/ActivityRow';
import { PinnedCard, PinnedItem } from '../components/dashboard/PinnedCard';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard (Day X). Greeting → at-a-glance strip → KPI cards → pinned
// priorities (if any) → Tasks + Signals (equal-height side-by-side with
// internal scroll) → Activities (full-width). Role still reorders what's
// surfaced; role-specific "glance titles" and the demo/walkthrough strips
// from the previous version are gone.
// ─────────────────────────────────────────────────────────────────────────────

interface RoleSurface {
  glanceFocus: string;
  // Which surface links get featured in the greeting subtitle.
  primary: 'people' | 'policy' | 'peers';
}

const ROLE_SURFACE: Record<Role, RoleSurface> = {
  executive:      { glanceFocus: 'Cross-functional priorities and top risks',      primary: 'people' },
  fundraising:    { glanceFocus: 'Donor risk, retention, and outreach',             primary: 'people' },
  communications: { glanceFocus: 'Donor messaging, campaign storytelling, outreach',primary: 'people' },
  policy:         { glanceFocus: 'Watchlist, hearings, and advocacy actions',       primary: 'policy' },
  program:        { glanceFocus: 'Resident impact and operational signals',         primary: 'policy' },
  operations:     { glanceFocus: 'Compliance, integrations, and team access',       primary: 'policy' },
};

const KPI_LINKS: Record<string, string> = {
  'active-donors':    '/people/donors',
  'lifetime-revenue': '/people/donors',
  'tracked-policies': '/policy',
  'avg-engagement':   '/peers/organizations',
};

// "Today" is static for the prototype so demo numbers stay stable.
const TODAY = new Date('2026-04-30');

// Demo overrides for the Fundraising Director (Leah) view. The narrative
// continues from the policy page: Sofia just assigned the RobinHood memo,
// so Leah's dashboard surfaces that task at the top.
const FUNDRAISING_KPI_VALUES: Record<string, { value: string; delta: number; trend: number[] }> = {
  'active-donors':    { value: '180',   delta: 6.2,  trend: [168, 170, 167, 165, 168, 172, 170, 173, 178, 180] },
  'lifetime-revenue': { value: '$4.41M', delta: 4.8, trend: [4.02, 3.98, 4.00, 4.05, 4.12, 4.18, 4.22, 4.30, 4.38, 4.41] },
  'tracked-policies': { value: '6',     delta: 50,   trend: [4, 4, 3.7, 3.5, 4, 4.3, 4.8, 5.4, 5.9, 6] },
  'avg-engagement':   { value: '67',    delta: -2.1, trend: [66, 68, 70, 71, 70, 69, 68, 66, 65, 67] },
};

// Comms-specific KPIs reflect Hannah's actual job: reach, scheduled output,
// engagement quality, and engagement vs the sector benchmark — not donor
// counts. Each trend rises or falls in proportion to its delta so the
// sparkline visibly tracks the headline number (engagement vs sector is
// intentionally a decline, to show what a down-trend looks like).
const COMMS_KPI_VALUES: Record<string, { value: string; delta: number; trend: number[] }> = {
  'active-donors':    { value: '142K', delta: 12.4, trend: [126, 128, 130, 132, 134, 136, 138, 140, 141, 142] },
  'lifetime-revenue': { value: '8',    delta: 33.3, trend: [6, 6, 6, 7, 7, 7, 7, 8, 8, 8] },
  'tracked-policies': { value: '6.4%', delta: 1.8,  trend: [6.25, 6.28, 6.30, 6.32, 6.33, 6.35, 6.36, 6.38, 6.39, 6.40] },
  'avg-engagement':   { value: '+3.1%', delta: -5.2, trend: [3.7, 3.6, 3.5, 3.5, 3.4, 3.3, 3.3, 3.2, 3.1, 3.1] },
};

interface DemoTask {
  id: string;
  status: 'urgent' | 'in_progress';
  title: string;
  /** Plain string OR JSX so descriptions can underline team-member names. */
  description: React.ReactNode;
  meta: Array<{ icon: 'folder' | 'progress' | 'comment' | 'clock'; value: string }>;
  ctaLabel: string;
  ctaVariant: 'primary' | 'secondary';
}

// Inline marker for team-member names. Underlined wherever a person is
// named in description copy — gives the eye an immediate "this person is
// involved" cue without breaking sentence flow.
function Person({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-primary underline decoration-1 underline-offset-2">{children}</span>;
}

const COMMUNICATIONS_TASKS: DemoTask[] = [
  {
    id: 'hannah-task-advocacy',
    status: 'urgent',
    title: 'Create advocacy campaign responding to NYC Food Expansion Act',
    description: (
      <>
        <Person>Sofia</Person> needs a campaign before the June 10 floor vote — social posts, a
        policy brief, and event promo.
      </>
    ),
    meta: [
      { icon: 'folder', value: '2' },
      { icon: 'comment', value: '1' },
      { icon: 'clock', value: '1d' },
    ],
    ctaLabel: 'Start',
    ctaVariant: 'primary',
  },
  {
    id: 'hannah-task-wrap',
    status: 'in_progress',
    title: "Post campaign wrap-up for 'Full Hearts, Full Plates' fundraiser",
    description:
      'Fundraiser closed at $80K. Draft a thank-you post celebrating the milestone.',
    meta: [
      { icon: 'folder', value: '4' },
      { icon: 'progress', value: '45%' },
      { icon: 'comment', value: '3' },
      { icon: 'clock', value: '7d' },
    ],
    ctaLabel: 'Continue',
    ctaVariant: 'secondary',
  },
];

interface DemoCampaign {
  id: string;
  title: string;
  tag: string;
  tagTone: 'success' | 'brand';
  by: string;
  views: string;
  shares: string;
  raised: string;
  imageUrl: string;
  // Lifecycle indicator shown under the byline.
  status: 'live' | 'closed';
  duration: string; // e.g. "Running for 3 months", "Closed · ran for 6 weeks"
}

const COMMUNICATIONS_CAMPAIGNS: DemoCampaign[] = [
  {
    id: 'feed-every-block',
    title: 'Feed Every Block',
    tag: 'Food Justice',
    tagTone: 'success',
    by: 'Hannah Win',
    views: '12,304',
    shares: '1,280',
    raised: '$128,400',
    status: 'live',
    duration: 'Running for 3 months',
    // Harlem brownstone block — anchors the campaign in the neighborhoods
    // Provide Food NYC actually serves.
    imageUrl: 'https://images.unsplash.com/photo-1582647509711-c8aa8a8bda71?w=600&h=360&fit=crop&q=80',
  },
  {
    id: 'pantry-stories',
    title: 'Pantry Stories: Voices from East New York',
    tag: 'Storytelling',
    tagTone: 'success',
    by: 'Hannah Win',
    views: '4,932',
    shares: '615',
    raised: '$24,800',
    status: 'live',
    duration: 'Running for 5 weeks',
    // Fresh produce / market stall — pantry vibe.
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=360&fit=crop&q=80',
  },
];

const FUNDRAISING_TASKS: DemoTask[] = [
  {
    id: 'leah-task-robinhood',
    status: 'urgent',
    title: 'Draft donor memo for RobinHood Foundation on the Food Expansion Act',
    description:
      "The Food Expansion Act aligns with RobinHood's 2026 funding priorities. Sofia has asked you to connect the new eligibility zones to our existing programs in Brownsville and East New York — show them why we're well-positioned to scale.",
    meta: [
      { icon: 'folder', value: '2' },
      { icon: 'comment', value: '1' },
      { icon: 'clock', value: '1d' },
    ],
    ctaLabel: 'Start',
    ctaVariant: 'primary',
  },
  {
    id: 'leah-task-cityharvest',
    status: 'in_progress',
    title: 'Prepare City Harvest grant renewal — due May 15',
    description:
      "Annual renewal deadline is May 15. Last year's application scored 92/100 — just needs updated March outcomes data.",
    meta: [
      { icon: 'folder', value: '4' },
      { icon: 'progress', value: '45%' },
      { icon: 'comment', value: '3' },
      { icon: 'clock', value: '4d' },
    ],
    ctaLabel: 'Continue',
    ctaVariant: 'secondary',
  },
];

interface DemoSignal {
  id: string;
  category: 'policy' | 'people' | 'peers';
  title: string;
  description: string;
  relevance?: number;
}

// Fundraising director's reactive inbox — donor signals that need a glance
// before producing more outreach. Mirrors the structure of COMMS_NEEDS.
const LEAH_NEEDS: AttentionItem[] = [
  {
    id: 'leah-eyes-maya',
    tone: 'approval',
    title: 'Maya Patel asked when the FY26 annual report drops',
    body: 'Her last email is sitting unread in your inbox — major donor, fast turnaround expected.',
    cta: 'Reply',
  },
  {
    id: 'leah-eyes-robinhood',
    tone: 'peer',
    title: 'RobinHood Foundation announced a $5M food-access tranche',
    body: 'Q3 supplemental window opens July 1. Worth aligning the donor memo to the new criteria.',
    cta: 'Open',
  },
];

const FUNDRAISING_SIGNALS: DemoSignal[] = [
  {
    id: 'leah-sig-1',
    category: 'policy',
    title: 'Federal Food Program Reporting Change',
    description: 'New compliance requirements take effect May 2026.',
    relevance: 92,
  },
  {
    id: 'leah-sig-2',
    category: 'policy',
    title: 'State SNAP Expansion bill introduced in Albany',
    description: 'Would extend eligibility statewide. Overlaps with our Bronx and Brooklyn service areas.',
    relevance: 88,
  },
  {
    id: 'leah-sig-3',
    category: 'peers',
    title: 'Bronx Food Collective Q1 results',
    description:
      'Their emergency food campaign outperformed the sector average by 18%. Worth reviewing their messaging approach.',
  },
  {
    id: 'leah-sig-4',
    category: 'policy',
    title: 'NYC Food Expansion Act: Full council vote confirmed for June 10',
    description: 'Opposition amendment still active.',
    relevance: 97,
  },
];

export function DashboardPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <DashboardDay0Page />;
  return <DashboardDayXPage />;
}

function DashboardDayXPage() {
  const navigate = useNavigate();
  const { activeRole, activeMember } = useRole();
  const toast = useToast();
  const { actions: actionState, updateStatus, updateOwner } = useActions();
  const { pins } = usePins();
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fundraising-demo composer state — RobinHood email draft → success.
  const [composerOpen, setComposerOpen] = useState(false);
  const [emailSuccessOpen, setEmailSuccessOpen] = useState(false);
  const [robinhoodSent, setRobinhoodSent] = useState(false);

  const surface = ROLE_SURFACE[activeRole];
  const firstName = activeMember.name.split(' ')[0];

  // Role-aware priority ordering. Open/in-progress first, completed sink.
  const myTasks = useMemo(() => {
    const pri = { urgent: 0, high: 1, medium: 2, low: 3 };
    const stat = { open: 0, in_progress: 1, completed: 2 };
    return actionState
      .filter((a) => a.visibleTo.includes(activeRole))
      .slice()
      .sort((a, b) => {
        if (stat[a.status] !== stat[b.status]) return stat[a.status] - stat[b.status];
        if (pri[a.priority] !== pri[b.priority]) return pri[a.priority] - pri[b.priority];
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [actionState, activeRole]);

  const openTasks = myTasks.filter((a) => a.status !== 'completed');
  const urgentCount = openTasks.filter((a) => a.priority === 'urgent').length;
  const inProgressCount = myTasks.filter((a) => a.status === 'in_progress').length;

  type TaskFilter = 'all' | 'urgent' | 'open' | 'in_progress';
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const filteredTasks = useMemo(() => {
    switch (taskFilter) {
      case 'urgent':
        return myTasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');
      case 'open':
        return myTasks.filter((t) => t.status === 'open');
      case 'in_progress':
        return myTasks.filter((t) => t.status === 'in_progress');
      default:
        return myTasks;
    }
  }, [myTasks, taskFilter]);

  const pinnedItems: PinnedItem[] = useMemo(() => resolvePins(pins), [pins]);

  const signals = useMemo(() => dashboardAlerts.slice(0, 8), []);

  const isFundraisingDemo = activeRole === 'fundraising';
  const isCommsDemo = activeRole === 'communications';
  const isDemoView = isFundraisingDemo || isCommsDemo;

  const handleToggleComplete = (id: string, next: ActionStatus) => {
    updateStatus(id, next);
    const action = actionState.find((a) => a.id === id);
    toast.show({
      type: next === 'completed' ? 'success' : 'info',
      title: next === 'completed' ? 'Task completed' : 'Task reopened',
      description: action?.title,
    });
  };

  const handleOwnerChange = (id: string, ownerId: string) => {
    updateOwner(id, ownerId);
    const action = actionState.find((a) => a.id === id);
    toast.show({ type: 'success', title: 'Task reassigned', description: action?.title });
  };

  const handlePrimaryAction = (task: ActionItem) => {
    setDrawerAction(task);
    setDrawerOpen(true);
  };

  const greetingSubtitle = `${roleMeta[activeRole].label}, Provide Food NYC`;
  const dateLine = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const FUNDRAISING_LABELS: Record<string, string> = {
    'active-donors':    'Active Donors',
    'lifetime-revenue': 'Revenue',
    'tracked-policies': 'Tracked Policies',
    'avg-engagement':   'Average Engagement',
  };
  // Comms reuses kpiMetrics IDs but relabels them to match Hannah's work —
  // total reach, scheduled output, engagement, and engagement-rate trend.
  const COMMS_LABELS: Record<string, string> = {
    'active-donors':    'Total reach',
    'lifetime-revenue': 'Posts scheduled',
    'tracked-policies': 'Avg engagement rate',
    'avg-engagement':   'Engagement vs sector',
  };
  const valueMap = isCommsDemo ? COMMS_KPI_VALUES : isFundraisingDemo ? FUNDRAISING_KPI_VALUES : null;
  const labelMap = isCommsDemo ? COMMS_LABELS : isFundraisingDemo ? FUNDRAISING_LABELS : null;
  const kpiWithLinks = isDemoView
    ? kpiMetrics.map((m) => {
        const o = valueMap?.[m.id];
        const label = labelMap?.[m.id] ?? m.label;
        return o ? { ...m, label, value: o.value, delta: o.delta, trend: o.trend } : { ...m, label };
      })
    : kpiMetrics;

  return (
    <>
      {/* Greeting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hello-${activeRole}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
          className="mb-6"
        >
          <p className="text-[13px] text-muted mb-1">{dateLine}</p>
          <h1 className="display-title">Good morning, {firstName}</h1>
          <p className="text-[14px] text-secondary mt-1.5">{greetingSubtitle}</p>
          {openTasks.length > 0 && (
            <p className="sr-only">
              {urgentCount > 0
                ? `${urgentCount} urgent ${urgentCount === 1 ? 'task' : 'tasks'} and ${openTasks.length - urgentCount} more open. ${surface.glanceFocus}.`
                : `${openTasks.length} open tasks. ${surface.glanceFocus}.`}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiWithLinks.map((m) => (
          isDemoView ? (
            <FundraisingKpiCard
              key={m.id}
              id={m.id}
              label={m.label}
              value={m.value}
              delta={m.delta}
              trend={m.trend}
              link={KPI_LINKS[m.id]}
            />
          ) : (
            <KpiCard
              key={m.id}
              id={m.id}
              label={m.label}
              value={m.value}
              delta={m.delta}
              deltaLabel={m.deltaLabel}
              trend={m.trend}
              link={KPI_LINKS[m.id]}
            />
          )
        ))}
      </div>

      {/* Pinned priorities (hidden when empty) */}
      {pinnedItems.length > 0 && (
        <section className="mb-6">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <p className="eyebrow mb-1.5">This week</p>
              <h2 className="text-[18px] font-serif font-semibold text-primary tracking-tight">Pinned priorities</h2>
              <p className="text-[12px] text-muted mt-0.5">Items the team is keeping close</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pinnedItems.slice(0, 3).map((item, idx) => (
              <PinnedCard key={item.id} item={item} accent={idx === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Hannah (Fundraising Director) drives campaigns — her dashboard
          surfaces the campaign-creation flow + the My Campaigns panel.
          Leah (Communications Director) handles donor messaging — her
          dashboard surfaces the donor-memo task + email-composer trigger
          + donor signals. Same panel structure, content swapped to fit. */}
      {isFundraisingDemo ? (
        <div className="flex flex-col gap-6 mb-6">
          <FundraisingTasksPanel
            tasks={COMMUNICATIONS_TASKS}
            newIds={['hannah-task-advocacy']}
            attentionItems={COMMS_NEEDS}
            onPrimaryAction={(task) => {
              if (task.id === 'hannah-task-advocacy') {
                navigate('/campaigns/new?policy=nyc-food-expansion');
              }
            }}
          />
          <div className="grid grid-cols-2 gap-6">
            <TopCampaignsPanel campaigns={COMMUNICATIONS_CAMPAIGNS} />
            <CompactActivityPanel />
          </div>
        </div>
      ) : isCommsDemo ? (
        <div className="flex flex-col gap-6 mb-6">
          <FundraisingTasksPanel
            tasks={FUNDRAISING_TASKS}
            attentionItems={LEAH_NEEDS}
            newIds={['leah-task-robinhood']}
            sentIds={robinhoodSent ? ['leah-task-robinhood'] : []}
            onPrimaryAction={(task) => {
              if (task.id === 'leah-task-robinhood') setComposerOpen(true);
            }}
          />
          <div className="grid grid-cols-2 gap-6">
            <FundraisingSignalsPanel signals={FUNDRAISING_SIGNALS} />
            <CompactActivityPanel items={LEAH_ACTIVITY} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Panel
            eyebrow="Your work"
            title="Tasks"
            subtitle={buildTasksSubtitle(urgentCount, openTasks.length, inProgressCount)}
            headerRight={
              <TaskFilterPills
                value={taskFilter}
                onChange={setTaskFilter}
                counts={{
                  all: myTasks.length,
                  urgent: urgentCount,
                  open: openTasks.filter((t) => t.status === 'open').length,
                  in_progress: inProgressCount,
                }}
              />
            }
            bodyHeight={420}
            flushBody
          >
            <AnimatePresence initial={false}>
              {filteredTasks.length > 0 ? (
                <div className="flex flex-col gap-2 p-3">
                  {filteredTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      ownerName={teamMembers.find((m) => m.id === task.ownerId)?.name.split(' ')[0]}
                      onToggleComplete={handleToggleComplete}
                      onPrimaryAction={handlePrimaryAction}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBody message={emptyMessageForFilter(taskFilter)} />
              )}
            </AnimatePresence>
          </Panel>

          <Panel
            eyebrow="What's changed"
            title="Recent signals"
            headerRight={<SignalLegend />}
            bodyHeight={420}
            flushBody
          >
            {signals.length > 0 ? (
              <div className="flex flex-col gap-1 p-2">
                {signals.map((alert) => (
                  <SignalRow key={alert.id} alert={alert} />
                ))}
              </div>
            ) : (
              <EmptyBody message="No new signals in your workspace." />
            )}
          </Panel>
        </div>
      )}

      {/* Recent activities (full-width) — Leah and Hannah views render
          their activity feed in the 2-column grid above, so suppress the
          duplicate here. */}
      {!isCommsDemo && !isFundraisingDemo && (
        <Panel
          eyebrow="Activity"
          title="Recent activities"
          subtitle="Last 24 hours"
          bodyHeight={320}
          flushBody
        >
          <div className="divide-y divide-border-subtle">
            {recentActivity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        </Panel>
      )}

      <ActionDrawer
        action={drawerAction}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleToggleComplete}
        onOwnerChange={handleOwnerChange}
      />

      <EmailComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSend={() => {
          setComposerOpen(false);
          setRobinhoodSent(true);
          setEmailSuccessOpen(true);
        }}
      />

      <EmailSuccessModal
        open={emailSuccessOpen}
        onClose={() => setEmailSuccessOpen(false)}
      />
    </>
  );
}

function EmptyBody({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <p className="text-[13px] text-muted text-center">{message}</p>
    </div>
  );
}

function buildTasksSubtitle(urgent: number, open: number, inProgress: number): string {
  const parts: string[] = [];
  if (urgent > 0) parts.push(`${urgent} urgent`);
  if (open > 0) parts.push(`${open} open`);
  if (inProgress > 0) parts.push(`${inProgress} in progress`);
  return parts.length > 0 ? parts.join(' · ') : 'Nothing to action';
}

type TaskFilterValue = 'all' | 'urgent' | 'open' | 'in_progress';

function TaskFilterPills({
  value,
  onChange,
  counts,
}: {
  value: TaskFilterValue;
  onChange: (v: TaskFilterValue) => void;
  counts: { all: number; urgent: number; open: number; in_progress: number };
}) {
  const options: Array<{ value: TaskFilterValue; label: string; count: number }> = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'urgent', label: 'Urgent', count: counts.urgent },
    { value: 'open', label: 'Open', count: counts.open },
    { value: 'in_progress', label: 'In progress', count: counts.in_progress },
  ];
  return (
    <div className="inline-flex items-center bg-surface-muted/60 border border-border-subtle rounded-sm p-0.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium rounded-sm transition-colors
              ${active
                ? 'bg-surface text-primary shadow-[0_1px_0_rgba(17,17,17,0.05)] border border-border-subtle'
                : 'text-secondary hover:text-primary'
              }`}
          >
            {opt.label}
            <span className={`tabular-nums ${active ? 'text-primary' : 'text-muted'}`}>{opt.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function emptyMessageForFilter(filter: TaskFilterValue): string {
  switch (filter) {
    case 'urgent':
      return 'No urgent tasks right now.';
    case 'open':
      return 'No open tasks. Nicely done.';
    case 'in_progress':
      return 'Nothing in progress.';
    default:
      return 'No tasks for this role right now.';
  }
}

// Resolve live pin records against source data (donors, policies, signals).
// Unresolvable pins (entity deleted, bad id) are silently dropped.
function resolvePins(pins: PinRecord[]): PinnedItem[] {
  const out: PinnedItem[] = [];
  for (const pin of pins) {
    if (pin.type === 'donor') {
      const donor = donors.find((d) => d.id === pin.id);
      if (!donor) continue;
      out.push({
        id: pin.id,
        category: 'donor',
        title: donor.name,
        description: donor.persona || '',
        statusChip: donor.risk === 'High' ? { label: 'At risk', variant: 'warning' } : undefined,
        teamChip: true,
        pinnedBy: pin.pinnedBy,
        link: `/people/donors/${donor.id}`,
      });
    } else if (pin.type === 'policy') {
      const policy = policies.find((p) => p.id === pin.id);
      if (!policy) continue;
      out.push({
        id: pin.id,
        category: 'policy',
        title: policy.title,
        description: policy.summary || '',
        statusChip: policy.impactLevel?.includes('risk')
          ? { label: 'At risk', variant: 'danger' }
          : policy.impactLevel?.includes('opportunity')
          ? { label: 'Opportunity', variant: 'info' }
          : undefined,
        teamChip: true,
        pinnedBy: pin.pinnedBy,
        link: `/policy/${policy.id}`,
      });
    } else if (pin.type === 'signal') {
      const signal = dashboardAlerts.find((a) => a.id === pin.id);
      if (!signal) continue;
      out.push({
        id: pin.id,
        category: 'signal',
        title: signal.title,
        description: signal.description,
        statusChip: signal.type === 'danger'
          ? { label: 'Needs attention', variant: 'danger' }
          : signal.type === 'warning'
          ? { label: 'Watch', variant: 'warning' }
          : undefined,
        teamChip: true,
        pinnedBy: pin.pinnedBy,
        link: signal.actionLink,
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// Fundraising-demo (Leah) panels — narrative-specific Tasks + Recent Signals
// for the post-policy-assignment scene.
// ─────────────────────────────────────────────────────────────────────────

function FundraisingKpiCard({
  id, label, value, delta, trend, link,
}: {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: number[];
  link?: string;
}) {
  const positive = delta >= 0;
  const isRevenue = id === 'lifetime-revenue';
  const stroke = positive ? '#02066F' : '#EF4444';
  const fill   = positive ? '#02066F' : '#EF4444';

  const card = (
    <div className="group h-full bg-surface border border-border-subtle rounded-lg shadow-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-semibold text-primary">{label}</p>
        {isRevenue ? (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); }}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:text-brand-hover"
          >
            April <ChevronDown size={12} />
          </button>
        ) : (
          <ArrowUpRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[40px] leading-none font-bold text-primary tabular-nums tracking-tight">{value}</p>
        <span className={`text-[14px] font-semibold tabular-nums ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? '+' : ''}{delta.toFixed(1)}%
        </span>
      </div>
      <p className="text-[13px] text-muted">Compared to last month</p>
      <div className="mt-1">
        <BigSparkline data={trend} stroke={stroke} fill={fill} />
      </div>
    </div>
  );
  return link ? <Link to={link} className="no-underline block h-full">{card}</Link> : card;
}

function BigSparkline({ data, stroke, fill }: { data: number[]; stroke: string; fill: string }) {
  if (!data.length) return null;
  const W = 240;
  const H = 100;
  const pad = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = W - pad * 2;
  const h = H - pad * 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y] as const;
  });

  // Smooth cubic-bezier between two adjacent points, mid-handle smoothing.
  const seg = (prev: readonly [number, number], p: readonly [number, number]) => {
    const cpx = prev[0] + (p[0] - prev[0]) * 0.5;
    return `C ${cpx},${prev[1]} ${cpx},${p[1]} ${p[0]},${p[1]}`;
  };
  const buildPath = (slice: ReadonlyArray<readonly [number, number]>) =>
    slice
      .map((p, i, arr) => (i === 0 ? `M ${p[0]},${p[1]}` : seg(arr[i - 1], p)))
      .join(' ');

  // Two emphasized data points: a fixed midpoint dot plus the final value.
  // Anchoring the first dot at the middle of the dataset (instead of the
  // calculated peak) keeps the two dots visibly spaced even when the trend
  // is monotonic, so the bold segment spans roughly half the chart.
  const endIdx = pts.length - 1;
  const midIdx = Math.max(1, Math.min(endIdx - 1, Math.floor(pts.length / 2)));

  const fullLine = buildPath(pts);
  const boldLine = buildPath(pts.slice(midIdx, endIdx + 1));
  const area     = `${fullLine} L ${pad + w},${pad + h} L ${pad},${pad + h} Z`;

  // Baseline runs through the value of the first data point — gives a
  // "where we started" reference so the upward drift reads at a glance.
  const baselineY = pts[0][1];
  const id = stroke.replace('#', '');
  const fillGradId = `cc-spark-fill-${id}`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={fillGradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={fill} stopOpacity="0.18" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Dashed neutral baseline at the start value */}
      <line
        x1={pad}
        y1={baselineY}
        x2={W - pad}
        y2={baselineY}
        stroke="#D8D7DD"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Soft fill under the whole curve */}
      <path d={area} fill={`url(#${fillGradId})`} />

      {/* Faded full-length line — sits underneath the bold segment */}
      <path
        d={fullLine}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.28"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bold segment between the two dots */}
      <path
        d={boldLine}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Highlighted data points — one at the midpoint, one at the end */}
      {[pts[midIdx], pts[endIdx]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4.5} fill="#FFFFFF" />
          <circle cx={x} cy={y} r={3.2} fill={stroke} />
        </g>
      ))}
    </svg>
  );
}

// "What needs my eyes today" — reactive inbox surfaced inside the Tasks
// panel. Each row offers two paths: handle it now (Review/Open) or convert
// it into a task and come back later.
type EyesTone = 'approval' | 'peer' | 'event';

interface AttentionItem {
  id: string;
  tone: EyesTone;
  title: string;
  body: string;
  cta: string;
}

const COMMS_NEEDS: AttentionItem[] = [
  {
    id: 'eyes-peer',
    tone: 'peer',
    title: 'Bronx Food Collective just posted a Food Expansion Act explainer',
    body: 'Their thread is at 4.2K shares in 6 hours. Worth checking before launching ours.',
    cta: 'Open',
  },
  {
    id: 'eyes-event',
    tone: 'event',
    title: 'Brownsville kitchen RSVPs passed 200',
    body: 'Capacity is 250 — consider closing registration or moving to a larger venue.',
    cta: 'Open',
  },
];

const EYES_STYLES: Record<EyesTone, { dot: string; label: string; chip: string }> = {
  approval: { dot: 'bg-warning',  label: 'APPROVAL',      chip: 'text-warning bg-warning-soft' },
  peer:     { dot: 'bg-accent',   label: 'PEER ACTIVITY', chip: 'text-accent bg-accent/10' },
  event:    { dot: 'bg-brand',    label: 'EVENT',         chip: 'text-brand bg-brand-soft' },
};

function FundraisingTasksPanel({
  tasks,
  sentIds = [],
  newIds = [],
  attentionItems,
  onPrimaryAction,
}: {
  tasks: DemoTask[];
  sentIds?: string[];
  /** Tasks rendered with a NEW pill + soft accent background. */
  newIds?: string[];
  /** Optional reactive-inbox items pinned at the top of the panel. */
  attentionItems?: AttentionItem[];
  onPrimaryAction?: (task: DemoTask) => void;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-[22px] font-semibold text-primary tracking-tight">Tasks</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors"
        >
          <Plus size={14} strokeWidth={2.4} />
          Create
        </button>
      </div>

      {attentionItems && attentionItems.length > 0 && (
        <NeedsAttentionBlock items={attentionItems} />
      )}

      <div className="px-3 pt-2 pb-4 flex flex-col gap-2">
        {tasks.map((t) => (
          <FundraisingTaskCard
            key={t.id}
            task={t}
            sent={sentIds.includes(t.id)}
            isNew={newIds.includes(t.id)}
            onPrimaryAction={onPrimaryAction}
          />
        ))}
      </div>
    </div>
  );
}

function NeedsAttentionBlock({ items }: { items: AttentionItem[] }) {
  return (
    <div className="mx-3 mb-3 rounded-xl bg-page/70 border border-border-subtle">
      <div className="flex items-center justify-between px-3 pt-3.5 pb-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-secondary">
          Needs your eyes today
        </p>
        <span className="inline-flex items-center px-2 h-5 rounded-full bg-surface text-secondary text-[11px] font-semibold tabular-nums border border-border-subtle">
          {items.length}
        </span>
      </div>
      <ul className="divide-y divide-border-subtle/70">
        {items.map((it) => {
          const s = EYES_STYLES[it.tone];
          return (
            <li key={it.id} className="flex items-start gap-3 px-3 py-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${s.dot}`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-primary leading-snug">
                  {it.title}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted leading-relaxed">{it.body}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-center">
                {/* Category pill lives next to the actions — keeps the title
                    rows visually aligned regardless of pill width. */}
                <span
                  className={`inline-flex items-center px-2 h-[18px] rounded-full text-[9px] font-bold uppercase tracking-[0.12em] ${s.chip}`}
                >
                  {s.label}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-brand text-white text-[12px] font-semibold hover:bg-brand-hover transition-colors"
                >
                  {it.cta}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-8 px-3 rounded-full border border-border-subtle text-[12px] font-medium text-secondary hover:border-brand/40 hover:text-primary transition-colors"
                >
                  Create task
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FundraisingTaskCard({
  task,
  sent,
  isNew,
  onPrimaryAction,
}: {
  task: DemoTask;
  sent?: boolean;
  isNew?: boolean;
  onPrimaryAction?: (task: DemoTask) => void;
}) {
  // Pull progress (if any) and remaining-time meta out of the icon list so
  // we can render a real progress bar + a clean "due" indicator.
  const progressMeta = task.meta.find((m) => m.icon === 'progress');
  const progressPct = progressMeta ? parseInt(progressMeta.value, 10) || 0 : null;
  const dueMeta = task.meta.find((m) => m.icon === 'clock');

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        isNew
          ? 'bg-accent/8 border-accent/30'
          : 'bg-surface border-border-subtle hover:border-brand/30'
      }`}
    >
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isNew && (
              <span className="inline-flex items-center px-2 h-[18px] rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-[0.12em]">
                New
              </span>
            )}
            {dueMeta && (
              <span className="text-[11px] font-semibold text-secondary tabular-nums">
                Due in {dueMeta.value}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-[16px] font-semibold text-primary leading-snug">
            {task.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-muted leading-relaxed">{task.description}</p>

          {/* Progress bar — only when a progress value is reported. */}
          {progressPct !== null && (
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex-1 h-1.5 rounded-full bg-page overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-secondary">
                {progressPct}%
              </span>
            </div>
          )}
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {sent ? (
            <motion.span
              key="sent-badge"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
              className="status-transition inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-success-soft text-success text-[13px] font-semibold shrink-0 self-center"
            >
              <Check size={14} strokeWidth={2.5} /> Sent
            </motion.span>
          ) : (
            <motion.button
              key="cta-button"
              type="button"
              onClick={() => onPrimaryAction?.(task)}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
              className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors shrink-0 self-center"
            >
              {task.ctaLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Per-category styling for signals — tinted icon avatar + label, plus a
// human-readable category name so the row tells you what kind of signal it
// is at a glance instead of forcing a legend lookup. Policy and Peer share
// the brand blue treatment; Donor keeps the warning amber so it stays
// visually distinct from the other two.
const SIGNAL_STYLES: Record<DemoSignal['category'], { iconBg: string; iconText: string; label: string; icon: React.ReactNode }> = {
  policy: { iconBg: 'bg-brand-soft',    iconText: 'text-brand',    label: 'POLICY', icon: <FileText size={13} /> },
  people: { iconBg: 'bg-warning-soft',  iconText: 'text-warning',  label: 'DONOR',  icon: <Users size={13} /> },
  peers:  { iconBg: 'bg-brand-soft',    iconText: 'text-brand',    label: 'PEER',   icon: <Sparkles size={13} /> },
};

// Match-score color scale — green for strong matches, amber for medium,
// red for weak. Threshold tuned so the demo data (88, 92, 97) reads as
// "one is borderline, two are strong."
function relevanceChipClass(pct: number): string {
  if (pct >= 90) return 'bg-success-soft text-success';
  if (pct >= 80) return 'bg-warning-soft text-warning';
  return 'bg-danger-soft text-danger';
}

function FundraisingSignalsPanel({ signals }: { signals: DemoSignal[] }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
      <div className="px-6 pt-6 pb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-primary tracking-tight">Recent signals</h2>
        <button
          type="button"
          className="text-[12px] font-medium text-brand hover:text-brand-hover"
        >
          View all
        </button>
      </div>
      <ul className="px-3 pb-4 flex flex-col gap-1">
        {signals.map((s) => {
          const style = SIGNAL_STYLES[s.category];
          return (
            <li
              key={s.id}
              className="group flex items-start gap-3 px-3 py-3 rounded-md hover:bg-page transition-colors"
            >
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${style.iconBg} ${style.iconText}`}
                aria-hidden="true"
              >
                {style.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${style.iconText}`}>
                    {style.label}
                  </span>
                  {typeof s.relevance === 'number' && (
                    <span
                      className={`inline-flex items-center px-1.5 h-[16px] rounded-full text-[10px] font-bold tabular-nums ${relevanceChipClass(s.relevance)}`}
                    >
                      {s.relevance}% match
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[13.5px] font-semibold text-primary leading-snug">
                  {s.title}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted leading-relaxed">{s.description}</p>
              </div>
              <button
                type="button"
                className="shrink-0 self-center inline-flex items-center justify-center h-8 px-3 rounded-full border border-border-subtle text-[12px] font-medium text-secondary hover:border-brand/40 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                View
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Email composer + success modal — Leah's RobinHood draft flow.
// ─────────────────────────────────────────────────────────────────────────

interface RecipientGroup {
  id: string;
  label: string;
  count: number;
  description?: string;
}

// Donor → org affiliation. Surfaced inline next to the recipient pill so
// the writer sees who they're talking to at a glance.
const RECIPIENT_AFFILIATIONS: Record<string, string> = {
  'Sarah Chen': 'RobinHood Foundation',
};

const RECIPIENT_GROUPS: RecipientGroup[] = [
  { id: 'all-active',     label: 'All active donors',           count: 142, description: 'Active giving status, last 12 months' },
  { id: 'major-gifts',    label: 'Major gifts portfolio',       count: 28,  description: 'Lifetime giving > $50K' },
  { id: 'foundations',    label: 'Foundation partners',         count: 9,   description: 'Institutional / private foundations' },
  { id: 'food-aligned',   label: 'Food-security aligned donors', count: 47,  description: 'Donors flagged on food access programs' },
  { id: 'at-risk',        label: 'At-risk re-engagement',       count: 18,  description: 'No engagement in 45+ days' },
];

// Citations link phrases in the email body back to specific policy details
// the user already saw on the Policy Detail page. The `id` is shared between
// a sidebar list item and the inline highlight so hovering one (or hovering
// the highlight) reveals the same source context.
// Only the three numbers a recipient might double-check get highlighted —
// the date, the resident count, and the dollar range. Everything else is
// plain text so the email reads as prose, not a wiki.
type CiteId = 'floor-vote' | 'eligibility-expansion' | 'funding-streams';

interface Citation {
  id: CiteId;
  label: string;
  source: string;
  detail: string;
}

const POLICY_CITATIONS: Record<CiteId, Citation> = {
  'floor-vote': {
    id: 'floor-vote',
    label: 'June 10 floor vote',
    source: 'Policy timeline',
    detail: 'Full council vote. Bill passed committee 7–2.',
  },
  'eligibility-expansion': {
    id: 'eligibility-expansion',
    label: '85,000 newly eligible',
    source: 'For Our Org summary',
    detail: 'Brooklyn, Queens, and the Bronx — overlaps with our active service areas.',
  },
  'funding-streams': {
    id: 'funding-streams',
    label: '$200K–$400K / year',
    source: 'For Our Org summary',
    detail: 'Two new city funding streams open if the bill passes.',
  },
};

type BodyNode = string | { cite: CiteId; text: string };
type Paragraph = { kind: 'p' | 'li' | 'blank'; nodes: BodyNode[] };

// Tightened to ~120 words across three short paragraphs. Leads with the
// donor's frame ("aligns with RobinHood's priorities"), tucks the data
// into one sentence so it works on mobile, and closes with a single
// 20-minute ask.
const ROBINHOOD_BODY: Paragraph[] = [
  { kind: 'p', nodes: ['Hi Sarah,'] },
  { kind: 'blank', nodes: [] },
  { kind: 'p', nodes: [
    "Quick heads-up on something that aligns directly with RobinHood's 2026 food-access priorities.",
  ] },
  { kind: 'blank', nodes: [] },
  { kind: 'p', nodes: [
    'The NYC Food Expansion Act goes to a council vote on ',
    { cite: 'floor-vote', text: 'June 10' },
    '. If it passes, eligibility opens up for ',
    { cite: 'eligibility-expansion', text: '85,000 more residents' },
    ' across Brooklyn, Queens, and the Bronx — including the neighborhoods we already serve from our Brownsville and East New York kitchens.',
  ] },
  { kind: 'blank', nodes: [] },
  { kind: 'p', nodes: [
    'Our existing infrastructure can absorb the demand on day one. Two new city funding streams (',
    { cite: 'funding-streams', text: '$200K–$400K/year' },
    ") become available, and the timing matches RobinHood's Q3 supplemental window unusually cleanly.",
  ] },
  { kind: 'blank', nodes: [] },
  { kind: 'p', nodes: [
    "Open to a 20-minute call in the next two weeks? I'd love to walk you through our coverage map. I've added the policy brief for your reference.",
  ] },
  { kind: 'blank', nodes: [] },
  { kind: 'p', nodes: ['Thanks,'] },
  { kind: 'p', nodes: ['Leah'] },
];

function EmailComposer({
  open,
  onClose,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
}) {
  const [recipients, setRecipients] = useState<string[]>(['Sarah Chen']);
  const [recipientInput, setRecipientInput] = useState('');
  const [groups, setGroups] = useState<RecipientGroup[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [activeCite, setActiveCite] = useState<CiteId | null>(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('nyc-food-expansion');

  useEffect(() => {
    if (open) {
      setRecipients(['Sarah Chen']);
      setRecipientInput('');
      setGroups([]);
      setMinimized(false);
      setMaximized(false);
      setActiveCite(null);
      setSelectedPolicyId('nyc-food-expansion');
    }
  }, [open]);

  const toggleGroup = (g: RecipientGroup) =>
    setGroups((prev) => (prev.some((x) => x.id === g.id) ? prev.filter((x) => x.id !== g.id) : [...prev, g]));
  const toggleDonorByName = (name: string) =>
    setRecipients((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  if (!open) return null;

  const removeRecipient = (name: string) =>
    setRecipients((r) => r.filter((n) => n !== name));

  const addRecipient = (name: string) => {
    const trimmed = name.trim().replace(/,$/, '');
    if (!trimmed) return;
    setRecipients((r) => (r.includes(trimmed) ? r : [...r, trimmed]));
    setRecipientInput('');
  };

  const widthCls = maximized ? 'w-[1240px]' : 'w-[1000px]';
  const heightCls = minimized
    ? 'h-[52px]'
    : 'h-[calc(100vh-48px)] max-h-[1000px]';

  return (
    <div
      className={`fixed bottom-6 right-6 ${widthCls} ${heightCls} max-w-[calc(100vw-32px)] bg-surface border border-border-subtle rounded-lg shadow-elevated overflow-hidden z-[80] flex flex-col`}
      role="dialog"
      aria-label="New email message"
    >
      <div className="flex items-center justify-between gap-3 px-4 h-[52px] bg-page border-b border-border-subtle shrink-0">
        <p className="text-[14px] font-semibold text-primary">New Email Message</p>
        <div className="flex items-center gap-1">
          <ComposerHeaderBtn label="Minimize" onClick={() => { setMinimized((m) => !m); if (maximized) setMaximized(false); }}>
            <Minus size={14} />
          </ComposerHeaderBtn>
          <ComposerHeaderBtn label="Expand" onClick={() => { setMaximized((m) => !m); if (minimized) setMinimized(false); }}>
            <Maximize2 size={13} />
          </ComposerHeaderBtn>
          <ComposerHeaderBtn label="Close" onClick={onClose}>
            <X size={14} />
          </ComposerHeaderBtn>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-1 min-h-0">
          <PolicySourcePanel
            activeCite={activeCite}
            onCiteHover={setActiveCite}
            selectedPolicyId={selectedPolicyId}
            onSelectPolicy={setSelectedPolicyId}
          />

          <div className="flex-1 flex flex-col min-w-0">
            {/* From — author identity inline at the top of the email so the
                bottom signature strip can be removed. */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle shrink-0">
              <span className="text-[12px] font-medium text-muted">From</span>
              <span className="text-[13px] font-semibold text-primary">Leah Kim</span>
              <span className="text-[12px] text-muted">· Communications Director</span>
            </div>

            {/* Recipients */}
            <div className="flex items-start gap-2 px-4 py-2.5 border-b border-border-subtle shrink-0">
              <span className="text-[12px] font-medium text-muted mt-1">To</span>
              <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                {groups.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1.5 h-6 pl-2 pr-1 rounded-full bg-accent-soft text-accent text-[12px] font-medium"
                    title={g.description}
                  >
                    <Users size={11} />
                    <span>{g.label}</span>
                    <span className="text-accent/70 font-mono text-[10px]">{g.count}</span>
                    <button
                      type="button"
                      onClick={() => toggleGroup(g)}
                      className="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-accent/15"
                      aria-label={`Remove ${g.label}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {recipients.map((r) => {
                  // Show donor affiliation inline next to the recipient pill
                  // so the writer knows who they're writing to without having
                  // to bounce out to the donor record.
                  const affiliation = RECIPIENT_AFFILIATIONS[r];
                  return (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 h-6 pl-2.5 pr-1 rounded-full bg-brand-soft text-brand text-[12px] font-medium"
                    >
                      <span>{r}</span>
                      {affiliation && (
                        <span className="text-brand/60 font-normal">· {affiliation}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeRecipient(r)}
                        className="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-brand/15"
                        aria-label={`Remove ${r}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  );
                })}
                <input
                  value={recipientInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v.endsWith(',') || v.endsWith(';')) {
                      addRecipient(v);
                    } else {
                      setRecipientInput(v);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                      if (recipientInput.trim()) {
                        e.preventDefault();
                        addRecipient(recipientInput);
                      }
                    } else if (e.key === 'Backspace' && recipientInput === '' && recipients.length > 0) {
                      e.preventDefault();
                      setRecipients((r) => r.slice(0, -1));
                    }
                  }}
                  placeholder={recipients.length === 0 && groups.length === 0 ? 'Add recipients…' : ''}
                  className="flex-1 min-w-[80px] h-6 text-[13px] text-primary placeholder:text-muted bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <AddRecipientsButton
                  groups={groups}
                  recipients={recipients}
                  onToggleGroup={toggleGroup}
                  onToggleDonor={toggleDonorByName}
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border-subtle shrink-0">
              <ToolbarSelect label="Normal" />
              <ToolbarDivider />
              <ToolbarBtn label="Bold"><Bold size={13} /></ToolbarBtn>
              <ToolbarBtn label="Italic"><Italic size={13} /></ToolbarBtn>
              <ToolbarBtn label="Underline"><Underline size={13} /></ToolbarBtn>
              <ToolbarBtn label="Text color">
                <span className="inline-flex flex-col items-center leading-none">
                  <TypeIcon size={12} />
                  <span className="block w-3 h-0.5 bg-brand mt-0.5" />
                </span>
              </ToolbarBtn>
              <ToolbarDivider />
              <ToolbarBtn label="Align">
                <span className="inline-flex items-center gap-0.5"><AlignLeft size={13} /><ChevronDown size={10} /></span>
              </ToolbarBtn>
              <ToolbarBtn label="List">
                <span className="inline-flex items-center gap-0.5"><List size={13} /><ChevronDown size={10} /></span>
              </ToolbarBtn>
              <ToolbarBtn label="More"><MoreHorizontal size={13} /></ToolbarBtn>
            </div>

            {/* Body — rendered with hoverable cite highlights */}
            <div className="flex-1 overflow-auto px-5 py-4">
              <EmailBody body={ROBINHOOD_BODY} activeCite={activeCite} onCiteHover={setActiveCite} />
            </div>

            {/* Attachments — pre-loaded with the policy brief PDF that the
                email body references. Removable but defaults to attached. */}
            <EmailAttachments />

            <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={onSend}
                className="inline-flex items-center justify-center h-10 px-7 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Per-policy meta used by the source panel — the bill ref + the chip the
// dropdown surfaces. Falls back to a reasonable default for policies without
// an explicit override.
interface PolicySourceMeta {
  ref: string;
  jurisdictionLabel: string;
  urgencyLabel?: string;
  urgencyTone?: 'danger' | 'warning' | 'brand';
  highlightDate?: string; // "Floor vote · Jun 10"
}
const POLICY_SOURCE_META: Record<string, PolicySourceMeta> = {
  'nyc-food-expansion':       { ref: 'Int. 2026-0347',     jurisdictionLabel: 'Citywide',  urgencyLabel: 'Urgent',     urgencyTone: 'danger',   highlightDate: 'Floor vote · Jun 10' },
  'right-to-counsel':         { ref: 'Int. 2026-0421',     jurisdictionLabel: 'Citywide',  urgencyLabel: 'High',       urgencyTone: 'warning',  highlightDate: 'Hearing · Apr 22' },
  'housing-tax-credit':       { ref: 'S.2026-104',         jurisdictionLabel: 'State',     urgencyLabel: 'Monitor',    urgencyTone: 'brand',    highlightDate: 'Vote · TBD' },
  'rental-assistance-reporting': { ref: 'HUD-CFR-2026-12', jurisdictionLabel: 'Federal',   urgencyLabel: 'Compliance', urgencyTone: 'danger',   highlightDate: 'Effective · May 15' },
  'anti-eviction-funding':    { ref: 'NYC-EM-2026-08',     jurisdictionLabel: 'Citywide',  urgencyLabel: 'Funding',    urgencyTone: 'warning',  highlightDate: 'RFP closes · May 15' },
  'tenant-data-privacy':      { ref: 'A.2026-578',         jurisdictionLabel: 'State',     urgencyLabel: 'Monitor',    urgencyTone: 'brand',    highlightDate: 'Committee · Q3' },
  'zoning-reform':            { ref: 'RPB-2026-31',        jurisdictionLabel: 'Regional',  urgencyLabel: 'Monitor',    urgencyTone: 'brand',    highlightDate: 'Comment · open' },
};

function formatShortDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function PolicySourcePanel({
  activeCite,
  onCiteHover,
  selectedPolicyId,
  onSelectPolicy,
}: {
  activeCite: CiteId | null;
  onCiteHover: (id: CiteId | null) => void;
  selectedPolicyId: string;
  onSelectPolicy: (id: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPickerOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  const policy = policies.find((p) => p.id === selectedPolicyId) ?? policies[0];
  const meta = POLICY_SOURCE_META[policy.id] ?? { ref: policy.id, jurisdictionLabel: policy.jurisdiction };
  const isCitedPolicy = policy.id === 'nyc-food-expansion';

  // Citations rail — only the three numerical references the new email
  // actually highlights. Order matches their appearance in the body.
  const cites: CiteId[] = ['floor-vote', 'eligibility-expansion', 'funding-streams'];

  // Pick first 4 timeline events for the "Key dates" mini-list.
  const keyDates = policy.timeline.slice(0, 4);
  const floorVoteIdx = policy.timeline.findIndex((t) => /vote/i.test(t.title));

  return (
    <aside className="w-[300px] shrink-0 border-r border-border-subtle bg-surface flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
        <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Source Policy</p>

        {/* Title + ref dropdown */}
        <div ref={pickerRef} className="relative mt-1.5">
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={pickerOpen}
            className="w-full text-left flex items-start gap-2 -mx-1.5 px-1.5 py-1 rounded-md hover:bg-page transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-primary leading-tight">{policy.title}</h3>
              <p className="mt-1 text-[11px] font-mono text-muted truncate">
                {meta.ref} · {meta.jurisdictionLabel}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`mt-1 text-muted shrink-0 transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {pickerOpen && (
            <div
              role="listbox"
              className="absolute z-40 left-0 right-0 mt-1.5 bg-surface border border-border-subtle rounded-md shadow-elevated overflow-hidden"
            >
              <div className="max-h-[320px] overflow-auto py-1">
                {policies.map((p) => {
                  const m = POLICY_SOURCE_META[p.id] ?? { ref: p.id };
                  const sel = p.id === selectedPolicyId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="option"
                      aria-selected={sel}
                      onClick={() => { onSelectPolicy(p.id); setPickerOpen(false); }}
                      className={`w-full flex items-start gap-2 px-3 py-2.5 text-left transition-colors ${
                        sel ? 'bg-brand-soft' : 'hover:bg-page/60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] font-semibold leading-tight ${sel ? 'text-brand' : 'text-primary'}`}>
                          {p.title}
                        </p>
                        <p className="text-[10px] font-mono text-muted mt-0.5">{m.ref} · {p.jurisdiction}</p>
                      </div>
                      {sel && <Check size={14} className="text-brand shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Donor-relevance line — replaces the verbose policy summary with
          the one-sentence "why are we writing this donor about it." */}
      <div className="px-4 py-3 border-b border-border-subtle">
        <p className="text-[12px] text-primary/85 leading-relaxed">
          Aligns with RobinHood's 2026 food-access priorities — strong fit for their Q3 supplemental window.
        </p>
      </div>

      {keyDates.length > 0 && (
        <div className="px-4 py-3 border-b border-border-subtle">
          <p className="text-[10px] font-mono tracking-[0.14em] text-muted uppercase mb-2.5">Key dates</p>
          <ul className="space-y-1.5 text-[11px]">
            {keyDates.map((t, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="text-muted truncate">{t.title}</span>
                <span className={`font-mono shrink-0 ${i === floorVoteIdx ? 'text-accent' : 'text-primary'}`}>
                  {formatShortDate(t.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-4 py-3 flex-1 overflow-auto">
        <p className="text-[10px] font-mono tracking-[0.14em] text-muted uppercase mb-2.5">Citations in this draft</p>
        {isCitedPolicy ? (
          <>
            <p className="text-[11px] text-muted mb-3 leading-relaxed">
              Hover a highlighted phrase in the email to see the source.
            </p>
            <ul className="space-y-1">
              {cites.map((id) => {
                const c = POLICY_CITATIONS[id];
                const active = activeCite === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onMouseEnter={() => onCiteHover(id)}
                      onMouseLeave={() => onCiteHover(null)}
                      className={`w-full text-left rounded-md px-2.5 py-2 transition-colors ${
                        active ? 'bg-brand-soft' : 'hover:bg-page'
                      }`}
                    >
                      <p className={`text-[12px] font-semibold leading-tight ${active ? 'text-brand' : 'text-primary'}`}>
                        {c.label}
                      </p>
                      <p className="text-[10.5px] text-muted mt-0.5 leading-snug">{c.detail}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="rounded-md border border-border-subtle bg-page p-3">
            <p className="text-[12px] text-primary leading-snug font-medium">
              Citations only mapped for the original draft.
            </p>
            <p className="text-[11px] text-muted leading-relaxed mt-1.5">
              The current email body cites <strong>NYC Food Expansion Act</strong>. Switch back, or regenerate the draft to use <strong>{policy.title}</strong>.
            </p>
            <button
              type="button"
              className="mt-3 inline-flex items-center justify-center h-8 px-3.5 rounded-full border border-brand text-brand text-[12px] font-semibold hover:bg-brand-soft transition-colors"
            >
              Regenerate draft
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// Pre-loaded attachment row that sits above the Send action. Defaults to
// the policy brief — the email body explicitly references "the policy brief
// I've added," so the attachment should be the first thing the recipient
// expects to see.
function EmailAttachments() {
  const [attached, setAttached] = useState(true);
  if (!attached) return null;
  return (
    <div className="px-5 py-3 border-t border-border-subtle flex items-center gap-2 shrink-0">
      <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted shrink-0">
        Attachment
      </p>
      <span className="inline-flex items-center gap-2 max-w-full pl-2 pr-1 py-1 rounded-md border border-border-subtle bg-page text-[12px] text-primary">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-danger-soft text-danger shrink-0">
          <FileText size={13} />
        </span>
        <span className="flex flex-col leading-tight min-w-0">
          <span className="font-semibold truncate">NYC Food Expansion Act — Policy Brief.pdf</span>
          <span className="text-muted text-[11px]">2 pages · 184 KB</span>
        </span>
        <button
          type="button"
          onClick={() => setAttached(false)}
          className="ml-1 w-6 h-6 inline-flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-page/80 transition-colors shrink-0"
          aria-label="Remove attachment"
        >
          <X size={12} />
        </button>
      </span>
    </div>
  );
}

function EmailBody({
  body,
  activeCite,
  onCiteHover,
}: {
  body: Paragraph[];
  activeCite: CiteId | null;
  onCiteHover: (id: CiteId | null) => void;
}) {
  const renderNodes = (nodes: BodyNode[]) =>
    nodes.map((n, i) =>
      typeof n === 'string' ? (
        <React.Fragment key={i}>{n}</React.Fragment>
      ) : (
        <CiteSpan key={i} cite={n.cite} text={n.text} active={activeCite === n.cite} onHover={onCiteHover} />
      ),
    );

  return (
    <div className="text-[13.5px] leading-[1.65] text-primary space-y-3">
      {body.map((para, i) => {
        if (para.kind === 'blank') return <div key={i} className="h-1.5" aria-hidden="true" />;
        if (para.kind === 'li') {
          return (
            <div key={i} className="flex gap-2 ml-1">
              <span className="text-muted shrink-0" aria-hidden="true">•</span>
              <p className="flex-1">{renderNodes(para.nodes)}</p>
            </div>
          );
        }
        return <p key={i}>{renderNodes(para.nodes)}</p>;
      })}
    </div>
  );
}

function CiteSpan({
  cite, text, active, onHover,
}: {
  cite: CiteId;
  text: string;
  active: boolean;
  onHover: (id: CiteId | null) => void;
}) {
  const c = POLICY_CITATIONS[cite];
  return (
    <span
      className={`relative inline cursor-help rounded transition-colors px-0.5 ${
        active
          ? 'bg-accent/25 text-primary'
          : 'bg-accent/10 text-primary hover:bg-accent/20'
      }`}
      style={{ boxShadow: active ? 'inset 0 -2px 0 0 rgba(237,75,0,0.55)' : 'inset 0 -2px 0 0 rgba(237,75,0,0.30)' }}
      onMouseEnter={() => onHover(cite)}
      onMouseLeave={() => onHover(null)}
    >
      {text}
      {active && (
        <span
          role="tooltip"
          className="absolute z-30 left-0 bottom-full mb-2 w-[280px] cc-popover-anim pointer-events-none"
        >
          <span className="block rounded-md bg-surface border border-border-subtle shadow-elevated p-3" style={{ borderTop: '3px solid #ED4B00' }}>
            <span className="block text-[9px] font-mono tracking-[0.18em] text-accent uppercase">Policy citation</span>
            <span className="block mt-1 text-[12px] font-semibold text-primary leading-snug">{c.label}</span>
            <span className="block mt-0.5 text-[10px] font-mono text-muted">{c.source}</span>
            <span className="block mt-2 text-[12px] text-primary/85 leading-relaxed">{c.detail}</span>
          </span>
        </span>
      )}
    </span>
  );
}

function ComposerHeaderBtn({
  label, onClick, children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-surface transition-colors"
    >
      {children}
    </button>
  );
}

function ToolbarBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-7 h-7 inline-flex items-center justify-center rounded text-secondary hover:text-primary hover:bg-page transition-colors"
    >
      {children}
    </button>
  );
}

function ToolbarSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 h-7 px-2 rounded text-[12px] text-secondary hover:text-primary hover:bg-page transition-colors"
    >
      {label}
      <ChevronDown size={11} />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-4 bg-border-subtle mx-1" aria-hidden="true" />;
}

function EmailSuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-overlay"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        >
          <motion.div
            className="relative w-[440px] max-w-[calc(100vw-32px)] bg-surface rounded-lg shadow-elevated px-8 py-10 text-center"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: motionDurations.success, ease: motionEasings.out }}
          >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-7 h-7 inline-flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-page transition-colors"
        >
          <X size={14} />
        </button>
        <div className="mx-auto w-14 h-14 rounded-full bg-success flex items-center justify-center">
          <Check size={28} strokeWidth={3} className="text-white" />
        </div>
        <p className="mt-5 text-[15px] font-semibold text-primary">
          Your email has been sent successfully!
        </p>
        <p className="mt-1.5 text-[12px] text-muted">Sent to 1 donor · via Leah Kim</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center h-10 px-8 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors"
        >
          Close
        </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AddRecipientsButton({
  groups,
  recipients,
  onToggleGroup,
  onToggleDonor,
}: {
  groups: RecipientGroup[];
  recipients: string[];
  onToggleGroup: (g: RecipientGroup) => void;
  onToggleDonor: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? RECIPIENT_GROUPS.filter((g) => g.label.toLowerCase().includes(q))
    : RECIPIENT_GROUPS;
  const filteredDonors = q
    ? donors.filter((d) => d.name.toLowerCase().includes(q))
    : donors;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-1 h-6 px-2 rounded-full border border-brand/40 text-brand text-[11px] font-semibold hover:bg-brand-soft transition-colors"
      >
        <Plus size={11} />
        Add
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute z-50 right-0 mt-1.5 w-[320px] bg-surface border border-brand/30 rounded-md shadow-elevated overflow-hidden"
        >
          <div className="px-3 pt-3 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-page border border-border-subtle">
              <Search size={12} className="text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search donors or groups…"
                className="flex-1 text-[12px] text-primary placeholder:text-muted bg-transparent outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[340px] overflow-auto">
            {filteredGroups.length > 0 && (
              <div className="py-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-mono tracking-[0.16em] text-muted uppercase">Groups</p>
                {filteredGroups.map((g) => {
                  const sel = groups.some((x) => x.id === g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onToggleGroup(g)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors ${
                        sel ? 'bg-brand-soft' : 'hover:bg-page'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                          sel ? 'bg-brand text-white' : 'bg-accent-soft text-accent'
                        }`}
                      >
                        <Users size={13} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[12.5px] font-semibold leading-tight ${sel ? 'text-brand' : 'text-primary'}`}>
                            {g.label}
                          </p>
                          <span className="text-[10px] font-mono text-muted shrink-0">{g.count}</span>
                        </div>
                        {g.description && (
                          <p className="text-[10.5px] text-muted leading-snug mt-0.5 truncate">{g.description}</p>
                        )}
                      </div>
                      {sel && <Check size={13} className="text-brand shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredDonors.length > 0 && (
              <div className="py-1 border-t border-border-subtle">
                <p className="px-3 pt-2 pb-1 text-[10px] font-mono tracking-[0.16em] text-muted uppercase">Individual donors</p>
                {filteredDonors.map((d) => {
                  const sel = recipients.includes(d.name);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onToggleDonor(d.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        sel ? 'bg-brand-soft' : 'hover:bg-page'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          sel ? 'bg-brand text-white' : 'bg-page text-primary border border-border-subtle'
                        }`}
                      >
                        {d.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12.5px] font-medium leading-tight truncate ${sel ? 'text-brand' : 'text-primary'}`}>
                          {d.name}
                        </p>
                        <p className="text-[10.5px] text-muted leading-tight mt-0.5 truncate">{d.persona}</p>
                      </div>
                      {sel && <Check size={13} className="text-brand shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredGroups.length === 0 && filteredDonors.length === 0 && (
              <p className="text-[12px] text-muted text-center py-6">No matches.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TopCampaignsPanel({
  campaigns,
  compact = false,
}: {
  campaigns: DemoCampaign[];
  /** Compact list-row variant for sitting in a 2-column grid. */
  compact?: boolean;
}) {
  // Live campaigns float to the top; closed ones sink. Stable within each
  // group so the input order still controls the live-vs-live ranking.
  const orderedCampaigns = useMemo(() => {
    const live = campaigns.filter((c) => c.status === 'live');
    const closed = campaigns.filter((c) => c.status !== 'live');
    return [...live, ...closed];
  }, [campaigns]);

  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
        <h2 className={`font-semibold text-primary tracking-tight ${compact ? 'text-[18px]' : 'text-[22px]'}`}>
          My Campaigns
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors"
        >
          <Plus size={14} strokeWidth={2.4} />
          Create
        </button>
      </div>
      <div className={`flex flex-col ${compact ? 'px-3 pb-4 gap-1.5' : 'px-3 pb-4 gap-3'}`}>
        {orderedCampaigns.map((c) =>
          compact ? <CampaignRow key={c.id} campaign={c} /> : <CampaignCard key={c.id} campaign={c} />,
        )}
      </div>
    </div>
  );
}

// Compact list-row campaign — fits inside a 2-column dashboard grid alongside
// the activity feed without overpowering it.
function CampaignRow({ campaign }: { campaign: DemoCampaign }) {
  const isLive = campaign.status === 'live';
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-page transition-colors">
      <div className="relative w-[68px] h-[52px] rounded-md bg-surface-muted shrink-0 overflow-hidden">
        <img
          src={campaign.imageUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-1 left-1 inline-flex items-center gap-1 px-1.5 h-[14px] rounded-full text-[8.5px] font-bold uppercase tracking-[0.1em] ${
            isLive ? 'bg-success/90 text-white' : 'bg-black/60 text-white'
          }`}
        >
          {isLive && <span className="w-1 h-1 rounded-full bg-white animate-pulse" aria-hidden="true" />}
          {isLive ? 'Live' : 'Closed'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-primary leading-tight truncate">
          {campaign.title}
        </p>
        <p className="mt-0.5 text-[12px] text-muted truncate">
          {campaign.tag} · {campaign.duration.replace(/^Closed · /, '')}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[15px] font-bold text-success leading-none tabular-nums">
          {campaign.raised}
        </p>
        <p className="mt-1 text-[11px] text-muted tabular-nums">
          {campaign.views} views · {campaign.shares} shares
        </p>
      </div>
    </div>
  );
}

// Comms-specific activity feed. Items flagged `highlight: true` represent
// signals Hannah cares most about — campaign milestones, big mentions, and
// approvals she initiated — and render with an accent treatment.
type CommsActivityType = 'post' | 'mention' | 'campaign' | 'approval' | 'gift' | 'open' | 'press' | 'team';

interface CommsActivityItem {
  id: string;
  type: CommsActivityType;
  title: string;
  meta: string;
  highlight?: boolean;
}

const COMMS_ACTIVITY_ICONS: Record<CommsActivityType, React.ReactNode> = {
  post:     <Pencil size={14} />,
  mention:  <MoreHorizontal size={14} />,
  campaign: <Sparkles size={14} />,
  approval: <Check size={14} />,
  gift:     <DollarSign size={14} />,
  open:     <Eye size={14} />,
  press:    <List size={14} />,
  team:     <Users size={14} />,
};

// Activity feed reads chronologically — highlighted items mix in with the
// rest rather than stacking at the top. Trimmed to 6 rows so the panel
// height matches the My Campaigns panel (now 2 campaigns).
const COMMS_ACTIVITY: Array<CommsActivityItem & { titleNode?: React.ReactNode }> = [
  {
    id: 'act-mention',
    type: 'mention',
    title: '',
    titleNode: <>Mayor's office reposted Feed Every Block on X</>,
    meta: 'Via X mentions · 1h ago',
    highlight: true,
  },
  {
    id: 'act-floor-vote',
    type: 'campaign',
    title: 'Floor vote scheduled for the Food Expansion Act',
    meta: 'Via Policy radar · 2h ago',
  },
  {
    id: 'act-mailchimp',
    type: 'open',
    title: 'Pantry Stories email crossed 35% open rate',
    meta: 'Via Mailchimp · 3h ago',
    highlight: true,
  },
  {
    id: 'act-approval',
    type: 'approval',
    title: '',
    titleNode: <><Person>Sofia</Person> approved the Brownsville event poster draft</>,
    meta: 'Via Approvals · 5h ago',
  },
  {
    id: 'act-gift-campaign',
    type: 'gift',
    title: '$2,500 gift attributed to Feed Every Block',
    meta: 'Via Salesforce · 6h ago',
    highlight: true,
  },
  {
    id: 'act-press',
    type: 'press',
    title: 'Pantry Stories featured in NY Daily News op-ed',
    meta: 'Via Press monitor · 1d ago',
  },
  {
    id: 'act-rsvp',
    type: 'campaign',
    title: 'Brownsville kitchen RSVPs passed 200',
    meta: 'Via Eventbrite · 1d ago',
  },
  {
    id: 'act-coalition',
    type: 'press',
    title: 'NYC Food Policy Alliance shared our policy brief',
    meta: 'Via Coalition channel · 2d ago',
  },
];

// Leah's activity feed — donor + grant flavor. Three items highlighted in
// accent orange (gifts, funder windows, attribution) since those are the
// signals she scans for first.
const LEAH_ACTIVITY: Array<CommsActivityItem & { titleNode?: React.ReactNode }> = [
  {
    id: 'leah-act-gift-maya',
    type: 'gift',
    title: '',
    titleNode: <>$2,500 gift received from <Person>Maya Patel</Person></>,
    meta: 'Via Salesforce · 1h ago',
    highlight: true,
  },
  {
    id: 'leah-act-floor-vote',
    type: 'campaign',
    title: 'Floor vote scheduled for the Food Expansion Act',
    meta: 'Via Policy radar · 2h ago',
  },
  {
    id: 'leah-act-robinhood-window',
    type: 'campaign',
    title: 'RobinHood Q3 supplemental window opens July 1',
    meta: 'Via Funder radar · 4h ago',
    highlight: true,
  },
  {
    id: 'leah-act-approval',
    type: 'approval',
    title: '',
    titleNode: <><Person>Sofia</Person> approved the FY26 donor report draft</>,
    meta: 'Via Approvals · 5h ago',
  },
  {
    id: 'leah-act-attribution',
    type: 'gift',
    title: 'Gift attribution updated on Feed Every Block',
    meta: 'Via Salesforce · 6h ago',
    highlight: true,
  },
  {
    id: 'leah-act-jordan',
    type: 'open',
    title: 'Jordan Rivera reactivated email subscriptions',
    meta: 'Via Mailchimp · 1d ago',
  },
  {
    id: 'leah-act-cityharvest',
    type: 'press',
    title: 'City Harvest renewal portal opened for FY26',
    meta: 'Via Funder portal · 1d ago',
  },
];

function CompactActivityPanel({
  items = COMMS_ACTIVITY,
}: {
  items?: Array<CommsActivityItem & { titleNode?: React.ReactNode }>;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
      <div className="px-6 pt-6 pb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-primary tracking-tight">Recent activity</h2>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); }}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:text-brand-hover"
        >
          April <ChevronDown size={12} />
        </button>
      </div>
      <ul className="px-3 pb-4 flex flex-col gap-0.5">
        {items.map((item) => (
          <CommsActivityRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function CommsActivityRow({
  item,
}: {
  item: CommsActivityItem & { titleNode?: React.ReactNode };
}) {
  const highlight = !!item.highlight;
  return (
    <li
      className={`flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-page ${
        highlight ? 'bg-accent/5' : ''
      }`}
    >
      <span
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          highlight ? 'bg-accent/15 text-accent' : 'bg-surface-muted text-secondary'
        }`}
        aria-hidden="true"
      >
        {COMMS_ACTIVITY_ICONS[item.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] leading-snug font-medium text-primary line-clamp-2">
          {item.titleNode ?? item.title}
        </p>
        <p className="mt-0.5 text-[12px] leading-tight text-muted">{item.meta}</p>
      </div>
    </li>
  );
}

function CampaignCard({ campaign }: { campaign: DemoCampaign }) {
  const tagCls = 'bg-brand-soft text-brand';
  const isLive = campaign.status === 'live';
  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden">
      {/* Top — image + meta */}
      <div className="bg-surface p-4 flex gap-4">
        <div className="relative w-[180px] h-[110px] rounded-md bg-surface-muted shrink-0 overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={`${campaign.title} cover`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Status corner pill — universal CMS/streaming pattern. */}
          <span
            className={`absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 h-[22px] rounded-full text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur-sm ${
              isLive ? 'bg-success/90 text-white' : 'bg-black/60 text-white'
            }`}
          >
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />}
            {isLive ? 'Live' : 'Closed'}
          </span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className={`inline-flex items-center self-start px-3 h-6 rounded-full text-[12px] font-semibold ${tagCls}`}>
            {campaign.tag}
          </span>
          <h3 className="mt-2 text-[18px] font-bold text-primary leading-tight">{campaign.title}</h3>
          <p className="mt-1 text-[13px] text-muted">By {campaign.by}</p>
          <p className="mt-1.5 text-[12px] text-muted">
            {campaign.duration.replace(/^Closed · /, '')}
          </p>
        </div>
      </div>
      {/* Bottom — stat strip on brand-soft wash. The raised dollar value uses
          the success-green token so it pops as the number Hannah scans for. */}
      <div className="bg-brand-soft/60 border-t border-border-subtle px-4 py-3 grid grid-cols-3 gap-3">
        <CampaignStat icon="views"  label="Total views"  value={campaign.views} />
        <CampaignStat icon="shares" label="Total shares" value={campaign.shares} />
        <CampaignStat icon="raised" label="Raised"       value={campaign.raised} accent="success" />
      </div>
    </div>
  );
}

function CampaignStat({
  icon, label, value, accent = 'brand',
}: {
  icon: 'views' | 'shares' | 'raised';
  label: string;
  value: string;
  accent?: 'brand' | 'success';
}) {
  // Icon color stays brand-blue for visual consistency across all three
  // stats; only the value text picks up the accent color (green for raised).
  const valueClass = accent === 'success' ? 'text-success' : 'text-brand';
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="w-9 h-9 rounded-md bg-surface flex items-center justify-center shrink-0 shadow-card text-brand">
        {icon === 'views'  && <Eye size={15} strokeWidth={2.2} />}
        {icon === 'shares' && <Share2 size={15} strokeWidth={2.2} />}
        {icon === 'raised' && <DollarSign size={15} strokeWidth={2.4} />}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-secondary leading-tight truncate">{label}</p>
        <p className={`text-[16px] font-bold leading-tight tabular-nums mt-0.5 ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
