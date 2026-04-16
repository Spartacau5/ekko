import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRole } from '../lib/RoleContext';
import { useMaturity } from '../lib/MaturityContext';
import { useActions } from '../lib/ActionContext';
import { DashboardDay0Page } from './day0/DashboardDay0Page';
import { ActionItem, ActionStatus } from '../data/actions';
import { Role, teamMembers, roleMeta } from '../data/team';
import { donors } from '../data/donors';
import { kpiMetrics, recentActivity } from '../data/dashboardMetrics';
import { dashboardAlerts } from '../data/alerts';
import { policyAlerts } from '../data/watchlist';
import { policies } from '../data/policies';
import { usePins, PinRecord } from '../lib/PinContext';
import { useToast, ActionDrawer } from '../components/ui';
import { motionDurations, motionEasings } from '../lib/motion';
import { Panel } from '../components/dashboard/Panel';
import { StatsStrip } from '../components/dashboard/StatsStrip';
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
  'avg-engagement':   '/peers',
};

// "Today" is static for the prototype so demo numbers stay stable.
const TODAY = new Date('2026-04-12');

export function DashboardPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <DashboardDay0Page />;
  return <DashboardDayXPage />;
}

function DashboardDayXPage() {
  const { activeRole, activeMember } = useRole();
  const toast = useToast();
  const { actions: actionState, updateStatus, updateOwner } = useActions();
  const { pins } = usePins();
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const pinnedItems: PinnedItem[] = useMemo(() => resolvePins(pins), [pins]);

  const signals = useMemo(() => dashboardAlerts.slice(0, 8), []);

  const atAGlance = useMemo(() => {
    const unreadAlerts = policyAlerts.filter((a) => a.isUnread).length;
    const upcomingMeetings = donors
      .flatMap((d) => d.timeline.filter((e) => e.type === 'meeting' && e.date >= '2026-04-12'))
      .length;
    const giftsThisWeek = donors
      .flatMap((d) => d.timeline.filter((e) => e.type === 'gift' && e.date >= '2026-04-05'))
      .reduce((sum, e: any) => sum + (e.amount || 0), 0);
    const giftsLabel = giftsThisWeek >= 1000 ? `$${(giftsThisWeek / 1000).toFixed(0)}K` : `$${giftsThisWeek}`;
    return [
      { label: 'Urgent tasks',      value: urgentCount.toString() },
      { label: 'Signals',           value: unreadAlerts.toString() },
      { label: 'Upcoming meetings', value: upcomingMeetings.toString() },
      { label: 'Funds raised',      value: giftsLabel, tooltip: 'Gifts received in the last 7 days' },
    ];
  }, [urgentCount]);

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

  const greetingSubtitle = `${roleMeta[activeRole].label}, Rivergate Community Alliance`;
  const dateLine = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const kpiWithLinks = kpiMetrics;

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

      {/* Today at a Glance */}
      <div className="mb-6">
        <StatsStrip items={atAGlance} />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiWithLinks.map((m) => (
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

      {/* Tasks + Signals (equal-height, internal scroll) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Panel
          eyebrow="Your work"
          title="Tasks"
          subtitle={buildTasksSubtitle(urgentCount, openTasks.length, inProgressCount)}
          viewAllLink="/settings"
          bodyHeight={420}
          flushBody
        >
          <AnimatePresence initial={false}>
            {myTasks.length > 0 ? (
              <div className="flex flex-col gap-2 p-3">
                {myTasks.map((task) => (
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
              <EmptyBody message="No tasks for this role right now." />
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

      {/* Recent activities (full-width) */}
      <Panel
        eyebrow="Activity"
        title="Recent activities"
        subtitle="Last 24 hours"
        viewAllLink="/settings"
        bodyHeight={320}
        flushBody
      >
        <div className="divide-y divide-border-subtle">
          {recentActivity.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </Panel>

      <ActionDrawer
        action={drawerAction}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleToggleComplete}
        onOwnerChange={handleOwnerChange}
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
