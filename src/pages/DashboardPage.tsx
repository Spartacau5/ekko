import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { organization } from '../data/organization';
import { dashboardAlerts } from '../data/alerts';
import { donors } from '../data/donors';
import { policies } from '../data/policies';
import { benchmarkData } from '../data/peers';
import { peerCampaigns } from '../data/campaigns';
import { kpiMetrics, recentActivity, fundraisingTrend } from '../data/dashboardMetrics';
import { ActionItem, ActionStatus } from '../data/actions';
import { useActions } from '../lib/ActionContext';
import { useRecent } from '../lib/RecentContext';
import { policyAlerts, watchlist } from '../data/watchlist';
import { pinsForRole, trackedPeers, watchlistGroups, savedCampaigns } from '../data/workspace';
import { roleMeta, Role } from '../data/team';
import { useRole } from '../lib/RoleContext';
import { useMaturity } from '../lib/MaturityContext';
import { DashboardDay0Page } from './day0/DashboardDay0Page';
import {
  ProgressBar,
  Chip,
  BarChart,
  TaskCard,
  PinnedModuleCard,
  ActionDrawer,
  DemoPathCard,
  NarrativeSpineBadge,
  MaturityComparisonStrip,
  useToast,
} from '../components/ui';
import { demoFlows } from '../data/demoFlows';
import { useTour } from '../lib/TourContext';
import { motionDurations, motionEasings } from '../lib/motion';
import {
  AlertCircle, AlertTriangle, Info, CheckCircle, ArrowUpRight,
  MapPin, Building2, Gift, Mail, Users as UsersIcon, FileText,
  Megaphone, TrendingUp, Clock, Bell, Eye, Sprout,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Role-aware Dashboard. Same shell, same nav. The hero copy, the priority
// task list, the pinned modules, and the secondary modules all reorder
// based on the active role.
// ─────────────────────────────────────────────────────────────────────────────

type Surface = 'people' | 'policy' | 'peers';

interface ModuleConfig {
  glanceTitle: string;
  glanceFocus: string;
  // Triple-column ordering across People / Policy / Peers. The first item
  // is what this role looks at first.
  surfaceOrder: Surface[];
  // Whether the fundraising-trend strip is emphasized for this role.
  showFundraising: boolean;
}

const roleModules: Record<Role, ModuleConfig> = {
  executive: {
    glanceTitle: 'Across the org',
    glanceFocus: 'Cross-functional priorities and top risks',
    surfaceOrder: ['people', 'policy', 'peers'],
    showFundraising: true,
  },
  fundraising: {
    glanceTitle: 'Fundraising at a glance',
    glanceFocus: 'Donor risk, retention, and outreach',
    surfaceOrder: ['people', 'peers', 'policy'],
    showFundraising: true,
  },
  policy: {
    glanceTitle: 'Policy at a glance',
    glanceFocus: 'Watchlist, hearings, and advocacy actions',
    surfaceOrder: ['policy', 'peers', 'people'],
    showFundraising: false,
  },
  program: {
    glanceTitle: 'Program at a glance',
    glanceFocus: 'Resident impact and operational signals',
    surfaceOrder: ['policy', 'people', 'peers'],
    showFundraising: false,
  },
  operations: {
    glanceTitle: 'Operations at a glance',
    glanceFocus: 'Compliance, integrations, and team access',
    surfaceOrder: ['policy', 'people', 'peers'],
    showFundraising: false,
  },
};

// "Today" is static for the prototype so demo numbers stay stable.
const TODAY = new Date('2026-04-12');
const daysUntil = (iso: string) => {
  const d = new Date(iso);
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
};

interface GlanceItem {
  label: string;
  value: string;
  sublabel?: string;
  accent?: 'danger' | 'warning' | 'success';
  link?: string;
}

export function DashboardPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <DashboardDay0Page />;
  return <DashboardDayXPage />;
}

function DashboardDayXPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { startTour } = useTour();
  const { activeRole, activeMember } = useRole();
  const { setActiveMaturity } = useMaturity();
  const toast = useToast();
  const { actions: actionState, updateStatus, updateOwner } = useActions();
  const { recent } = useRecent();
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      startTour();
      searchParams.delete('tour');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, startTour]);

  const cfg = roleModules[activeRole];

  // Sort: open & in-progress first (urgent → low, then due date),
  // completed sink to the bottom but stay visible in counts.
  const myActions = useMemo(() => {
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

  const openOrInProgress = myActions.filter((a) => a.status !== 'completed');
  const openCount = openOrInProgress.length;
  const inProgressCount = myActions.filter((a) => a.status === 'in_progress').length;
  const urgentCount = openOrInProgress.filter((a) => a.priority === 'urgent').length;

  const myPins = useMemo(() => pinsForRole(activeRole), [activeRole]);

  const priorityDonors = donors.filter((d) => d.risk === 'High' || d.stage === 'Growing').slice(0, 4);
  const criticalPolicies = policies
    .filter((p) => p.impactLevel === 'High risk' || p.impactLevel === 'High opportunity')
    .slice(0, 3);

  // KPI → surface link mapping
  const kpiLinks: Record<string, string> = {
    'active-donors': '/people/donors',
    'lifetime-revenue': '/people/accounts',
    'tracked-policies': '/policy',
    'avg-engagement': '/peers',
  };

  const greeting = `Good morning, ${activeMember.name.split(' ')[0]}`;

  // Per-role glance content. Each row pulls from real workspace data so
  // the numbers actually mean something the active role would care about.
  const glanceItems: GlanceItem[] = useMemo(() => {
    const unreadAlerts = policyAlerts.filter((a) => a.isUnread).length;
    const donorsAtRisk = donors.filter((d) => d.risk === 'High').length;
    const fundraisingActions = actionState.filter(
      (a) => a.entity?.type === 'donor' && a.status !== 'completed'
    ).length;
    const policyActionsOpen = actionState.filter(
      (a) => a.entity?.type === 'policy' && a.status !== 'completed'
    ).length;
    const programActionsOpen = actionState.filter(
      (a) => a.visibleTo.includes('program') && a.status !== 'completed'
    ).length;
    const opsActionsOpen = actionState.filter(
      (a) => a.visibleTo.includes('operations') && a.status !== 'completed'
    ).length;
    const complianceDeadline = policies.find((p) => p.id === 'rental-assistance-reporting');
    const daysToCompliance = complianceDeadline ? daysUntil('2026-05-15') : 0;

    switch (activeRole) {
      case 'fundraising': {
        const foundationCount = donors.filter((d) => d.donorType === 'Foundation contact').length;
        const recentGifts = donors
          .flatMap((d) => d.timeline.filter((e) => e.type === 'gift' && e.date >= '2026-04-05'))
          .length;
        return [
          { label: 'Donors at risk', value: donorsAtRisk.toString(), accent: donorsAtRisk > 0 ? 'danger' : undefined, link: '/people/donors' },
          { label: 'Open follow-ups', value: fundraisingActions.toString(), sublabel: 'with donors', accent: 'warning' },
          { label: 'Foundation pipeline', value: foundationCount.toString(), sublabel: 'in stewardship', link: '/people/donors' },
          { label: 'Gifts this week', value: recentGifts.toString(), sublabel: 'since Apr 5', accent: 'success' },
        ];
      }
      case 'policy':
        return [
          { label: 'Watchlist alerts', value: unreadAlerts.toString(), sublabel: 'unread', accent: unreadAlerts > 0 ? 'warning' : undefined, link: '/policy/watchlist' },
          { label: 'Open advocacy actions', value: policyActionsOpen.toString(), accent: urgentCount > 0 ? 'danger' : undefined },
          { label: 'Tracked policies', value: watchlist.length.toString(), sublabel: `${watchlistGroups.length} topic groups`, link: '/policy/watchlist' },
          { label: 'Hearings this month', value: '2', sublabel: 'incl. RTC Apr 22', accent: 'warning' },
        ];
      case 'program':
        return [
          { label: 'Open program actions', value: programActionsOpen.toString(), accent: 'warning' },
          { label: 'Emergency aid window', value: `${daysUntil('2026-05-15')}d`, sublabel: 'until close', accent: 'warning', link: '/policy/anti-eviction-funding' },
          { label: 'Resident outreach', value: '3', sublabel: 'sites active' },
          { label: 'Volunteer signals', value: '+18%', sublabel: 'vs. last month', accent: 'success' },
        ];
      case 'operations':
        return [
          { label: 'Compliance deadline', value: `${daysToCompliance}d`, sublabel: 'rental assistance', accent: daysToCompliance < 30 ? 'danger' : 'warning', link: '/policy/rental-assistance-reporting' },
          { label: 'Open ops tasks', value: opsActionsOpen.toString(), accent: 'warning' },
          { label: 'Integrations', value: '3 of 5', sublabel: 'connected', link: '/settings' },
          { label: 'Pending invites', value: '0', sublabel: 'team complete', accent: 'success' },
        ];
      case 'executive':
      default: {
        const recentGiftCount = donors
          .flatMap((d) => d.timeline.filter((e) => e.type === 'gift' && e.date >= '2026-04-05'))
          .length;
        return [
          { label: 'Urgent tasks', value: urgentCount.toString(), accent: urgentCount > 0 ? 'danger' : undefined },
          { label: 'In progress', value: inProgressCount.toString(), accent: 'warning' },
          { label: 'Policy alerts', value: unreadAlerts.toString(), sublabel: 'unread', link: '/policy/watchlist' },
          { label: 'Gifts this week', value: recentGiftCount.toString(), sublabel: 'since Apr 5', accent: 'success' },
        ];
      }
    }
  }, [activeRole, actionState, urgentCount, inProgressCount]);

  // Real counts for the quick links sidebar.
  const quickLinkCounts = {
    donors: donors.length,
    watchlist: watchlist.length,
    campaigns: peerCampaigns.length,
    tracked: trackedPeers.length,
  };

  const handleStatusChange = (id: string, next: ActionStatus) => {
    updateStatus(id, next);
    const action = actionState.find((a) => a.id === id);
    toast.show({
      type: next === 'completed' ? 'success' : 'info',
      title:
        next === 'completed' ? 'Task completed' :
        next === 'in_progress' ? 'Task started' :
        'Task reopened',
      description: action?.title,
    });
  };

  const handleOwnerChange = (id: string, ownerId: string) => {
    updateOwner(id, ownerId);
    const action = actionState.find((a) => a.id === id);
    toast.show({
      type: 'success',
      title: 'Task reassigned',
      description: action ? `"${action.title}" reassigned.` : undefined,
    });
  };

  const openDrawer = (action: ActionItem) => {
    setDrawerAction(action);
    setDrawerOpen(true);
  };

  return (
    <>
      {/* Welcome heading — animates between roles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hello-${activeRole}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
          className="mb-6"
          id="dashboard-welcome"
          data-walkthrough-focus="Hero + pins"
        >
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <p className="eyebrow">Day X · Mature workspace</p>
            <span className="text-border-subtle">·</span>
            <p className="text-[12px] text-secondary">
              {TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Previewing as <span className="text-primary font-medium">{roleMeta[activeRole].label}</span>
            </p>
          </div>
          <h1 className="display-title">
            {greeting}
          </h1>
          <div className="flex items-start justify-between gap-6 mt-3 flex-wrap">
            <p className="text-base text-secondary max-w-2xl">
              {urgentCount > 0
                ? `${urgentCount} urgent ${urgentCount === 1 ? 'task' : 'tasks'} and ${openCount - urgentCount} more open. ${cfg.glanceFocus}.`
                : openCount > 0
                ? `${openCount} open tasks. ${cfg.glanceFocus}.`
                : `Nothing urgent. ${cfg.glanceFocus}.`}
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Setup</p>
                <p className="text-[13px] text-secondary mt-0.5 font-medium">
                  <span className="text-muted">Day 0: 28%</span>
                  <span className="mx-1.5 text-muted">→</span>
                  <span className="text-primary">Day X: 86%</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMaturity('day0')}
                className="inline-flex items-center gap-1.5 bg-surface text-primary border border-border-default px-3 py-1.5 text-[12px] font-semibold rounded-sm hover:bg-surface-muted transition-colors duration-150 whitespace-nowrap"
                title="Rewind to the Day 0 setup view"
              >
                <Sprout size={11} className="text-success" /> See Day 0 view
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Phase 5 polish: Day 0 ↔ Day X comparison strip — every metric, in
          both states, at a glance. Gives a presenter a single object to point
          at when explaining what maturity actually changes. */}
      <MaturityComparisonStrip />

      {/* Phase 5: Demo walkthroughs — guided paths into the product story.
          Lives just under the hero so a presenter or reviewer can pick a flow
          and the walkthrough strip will guide them step by step. */}
      <section className="mb-8">
        <div className="flex items-end justify-between gap-6 mb-4">
          <div className="min-w-0">
            <p className="eyebrow mb-2">For presenters &amp; reviewers</p>
            <h2 className="text-[22px] font-serif font-semibold text-primary leading-tight tracking-tight">
              Demo walkthroughs
            </h2>
            <p className="text-[13px] text-secondary mt-1.5 leading-relaxed max-w-2xl">
              Five rehearsed product stories. Each one auto-sets the recommended role and maturity, then guides you step by step.
            </p>
          </div>
          <span className="text-[11px] text-muted font-medium tabular-nums whitespace-nowrap">{demoFlows.length} flows</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {demoFlows.map((f) => (
            <DemoPathCard key={f.id} flow={f} />
          ))}
        </div>
      </section>

      {/* Pinned priorities — always visible above the fold */}
      {myPins.length > 0 && (
        <section className="mb-6" data-walkthrough-focus="Pinned priorities">
          <SectionHeading
            eyebrow="This week"
            title="Pinned priorities"
            subtitle="Items the team is keeping close"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={`pins-${activeRole}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              className="grid grid-cols-4 gap-3"
            >
              {myPins.map((p) => (
                <PinnedModuleCard key={p.id} item={p} />
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* Hero: Priority tasks (role-aware) + glance panel */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div
          className="col-span-8 bg-surface border border-border-default rounded-md overflow-hidden"
          data-walkthrough-focus="Priority tasks"
        >
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/30">
            <div className="min-w-0">
              <p className="eyebrow mb-1.5">Your work</p>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-primary leading-tight tracking-tight">Priority tasks</h2>
                <Chip
                  label={`${urgentCount} urgent`}
                  variant={urgentCount > 0 ? 'danger' : 'default'}
                />
                <Chip label={`${openCount} open`} variant="default" />
                {inProgressCount > 0 && (
                  <Chip label={`${inProgressCount} in progress`} variant="info" />
                )}
              </div>
            </div>
            <span className="text-[11px] text-muted tabular-nums whitespace-nowrap">
              Top {Math.min(5, myActions.length)} of {myActions.length}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`tasks-${activeRole}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              className="p-3 flex flex-col gap-2"
            >
              {myActions.slice(0, 5).map((a) => (
                <TaskCard
                  key={a.id}
                  action={a}
                  onStatusChange={handleStatusChange}
                  onOwnerChange={handleOwnerChange}
                  onOpenDrawer={openDrawer}
                />
              ))}
              {myActions.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-secondary">
                    No tasks assigned to {roleMeta[activeRole].label} right now.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Glance panel — content shifts per role */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <div className="mb-3">
              <p className="eyebrow mb-1.5">At a glance</p>
              <h3 className="text-[14px] font-semibold text-primary leading-tight tracking-tight flex items-center gap-2">
                <Clock size={13} className="text-muted" /> {cfg.glanceTitle}
              </h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`glance-${activeRole}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
                className="flex flex-col gap-3"
              >
                {glanceItems.map((g, i) => (
                  <GlanceRow key={i} {...g} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <p className="eyebrow mb-2">Navigate</p>
            <h3 className="text-[14px] font-semibold text-primary mb-3 tracking-tight">Quick links</h3>
            <div className="flex flex-col gap-1.5">
              <QuickLink to="/people/donors" label="Donors" count={quickLinkCounts.donors} icon={<UsersIcon size={12} />} />
              <QuickLink to="/policy/watchlist" label="Policy watchlist" count={quickLinkCounts.watchlist} icon={<Bell size={12} />} />
              <QuickLink to="/peers/campaigns" label="Campaign library" count={quickLinkCounts.campaigns} icon={<Megaphone size={12} />} />
              <QuickLink to="/peers" label="Tracked peers" count={quickLinkCounts.tracked} icon={<Eye size={12} />} />
              <QuickLink to="/settings" label="Settings" icon={<FileText size={12} />} />
            </div>
            {recent.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border-subtle">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Recently viewed</p>
                <div className="flex flex-col gap-1">
                  {recent.slice(0, 4).map((r) => (
                    <Link
                      key={`${r.type}-${r.id}`}
                      to={r.path}
                      className="text-[12px] text-secondary hover:text-primary no-underline truncate py-0.5 transition-colors"
                    >
                      <span className="text-muted mr-1.5">{r.type === 'donor' ? '●' : r.type === 'policy' ? '◆' : '▲'}</span>
                      {r.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiMetrics.map((m) => (
          <Link
            key={m.id}
            to={kpiLinks[m.id] || '/'}
            className="no-underline group rounded-md
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:ring-border-default"
          >
            <div className="bg-surface border border-border-subtle rounded-md p-5 h-full
              transition-[border-color,background-color] duration-150 ease-out
              group-hover:border-border-default group-hover:bg-surface-muted/20">
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow-plain">{m.label}</p>
                <ArrowUpRight
                  size={12}
                  className="text-muted opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0
                    transition-[opacity,transform] duration-150 ease-out"
                />
              </div>
              <div className="flex items-end justify-between gap-3 mb-2">
                <p className="metric-display">{m.value}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {m.delta >= 0 ? (
                  <TrendingUp size={13} className="text-success" />
                ) : (
                  <AlertCircle size={13} className="text-danger" />
                )}
                <span className={`text-[13px] font-medium ${m.delta >= 0 ? 'text-success' : 'text-danger'}`}>
                  {m.delta >= 0 ? '+' : ''}{m.delta.toFixed(1)}%
                </span>
                <span className="text-[13px] text-muted">{m.deltaLabel}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent signals */}
      <section className="mb-6">
        <SectionHeading
          eyebrow="Signals"
          title="What's changed"
          subtitle="Across your accounts, policy feed, and peer network"
        />
        <div className="grid grid-cols-2 gap-3">
          {dashboardAlerts.slice(0, 4).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* Fundraising / setup row — only emphasized for executive + fundraising */}
      {cfg.showFundraising && (
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-8 bg-surface border border-border-subtle rounded-md p-6">
            <div className="flex items-start justify-between gap-6 mb-5">
              <div>
                <p className="eyebrow mb-2">Revenue</p>
                <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight tracking-tight">Fundraising trend</h2>
                <p className="text-[12px] text-muted mt-1">Last 6 months — actual vs. target</p>
              </div>
              <div className="text-right">
                <p className="eyebrow-plain mb-1">YTD raised</p>
                <p className="text-[24px] font-semibold text-primary tabular-nums leading-none">
                  ${(fundraisingTrend.reduce((sum, m) => sum + m.raised, 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
            <div className="mt-2">
              <BarChart
                data={fundraisingTrend.map((m) => ({ label: m.month, value: m.raised, target: m.target }))}
                height={180}
                format={(n) => `$${(n / 1000).toFixed(0)}K`}
              />
            </div>
          </div>

          <div className="col-span-4 bg-surface border border-border-subtle rounded-md p-6">
            <div className="mb-4">
              <p className="eyebrow mb-2">Onboarding</p>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-primary leading-tight tracking-tight">Setup progress</h3>
                <span className="text-[13px] text-muted tabular-nums">{organization.setupCompletion}%</span>
              </div>
            </div>
            <ProgressBar value={organization.setupCompletion} showPercent={false} />
            <div className="mt-4 flex flex-col gap-2">
              <ChecklistItem done label="Verify organization details" />
              <ChecklistItem done label="Connect Salesforce CRM" />
              <ChecklistItem done label="Set fundraising goals" />
              <ChecklistItem label="Connect calendar" />
              <ChecklistItem label="Invite remaining team" />
            </div>
          </div>
        </div>
      )}

      {/* Three-column row — column order rotates by role.
          The first column is what this role looks at first. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`surfaces-${activeRole}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
          className="grid grid-cols-12 gap-6 mb-6"
          data-walkthrough-focus="Triple column"
        >
          {cfg.surfaceOrder.map((surface, idx) => {
            const isPrimary = idx === 0;
            if (surface === 'people') {
              return <PeopleColumn key="people" priorityDonors={priorityDonors} primary={isPrimary} actionState={actionState} />;
            }
            if (surface === 'policy') {
              return <PolicyColumn key="policy" criticalPolicies={criticalPolicies} primary={isPrimary} />;
            }
            return <PeersColumn key="peers" primary={isPrimary} />;
          })}
        </motion.div>
      </AnimatePresence>

      {/* Recent activity */}
      <section className="mb-6">
        <SectionHeading eyebrow="Activity" title="Recent activity" subtitle="Cross-feature signals from across your workspace" />
        <div className="bg-surface border border-border-subtle rounded-md">
          <div className="divide-y divide-border-subtle">
            {recentActivity.map((item) => <ActivityRow key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* Org summary footer */}
      <div className="bg-surface border border-border-subtle rounded-md p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-soft border border-border-default rounded-sm flex items-center justify-center flex-shrink-0 shadow-[0_1px_0_rgba(17,17,17,0.06)]">
              <Building2 size={22} className="text-primary" />
            </div>
            <div>
              <p className="eyebrow mb-1.5">Your organization</p>
              <h2 className="text-[22px] leading-[28px] font-serif font-semibold text-primary tracking-tight">{organization.name}</h2>
              <p className="text-[13px] text-secondary mt-0.5">{organization.missionArea}</p>
            </div>
          </div>
          <Link to="/settings" className="text-[12px] text-secondary hover:text-primary no-underline border-b border-transparent hover:border-primary/40 pb-px">
            Edit →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
          <OrgStat label="Headquarters" value={organization.headquarters} icon={<MapPin size={13} />} />
          <OrgStat label="Focus areas" value={organization.geographicFocus.join(', ')} />
          <OrgStat label="Staff" value={`${organization.staffCount} people`} />
          <OrgStat label="Revenue" value={organization.revenueRange} />
        </div>
      </div>

      <ActionDrawer
        action={drawerAction}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onOwnerChange={handleOwnerChange}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function PeopleColumn({ priorityDonors, primary, actionState }: { priorityDonors: any[]; primary: boolean; actionState: ActionItem[] }) {
  return (
    <section className="col-span-4" id="dashboard-people" data-walkthrough-focus="People column">
      <SectionHeading
        eyebrow="People"
        title="Priority donors"
        link="/people/donors"
        accent={primary}
      />
      <div className={`bg-surface rounded-md divide-y divide-border-subtle border
        ${primary ? 'border-border-default' : 'border-border-subtle'}`}>
        {priorityDonors.map((donor) => {
          const openActions = actionState.filter(
            (a) => a.entity?.type === 'donor' && a.entity?.id === donor.id && a.status !== 'completed'
          ).length;
          return (
            <Link
              key={donor.id}
              to={`/people/donors/${donor.id}`}
              className="flex items-start justify-between gap-3 p-4 hover:bg-surface-muted/30 transition-colors no-underline"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-primary truncate">{donor.name}</p>
                  <NarrativeSpineBadge id={donor.id} compact />
                </div>
                <p className="text-[13px] text-secondary truncate">{donor.persona}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Chip
                    variant={donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success'}
                    label={`${donor.risk} risk`}
                  />
                  <span className="text-[12px] text-muted">{donor.stage}</span>
                  {openActions > 0 && (
                    <span className="text-[11px] text-info font-medium">{openActions} open {openActions === 1 ? 'task' : 'tasks'}</span>
                  )}
                </div>
              </div>
              <ArrowUpRight size={14} className="text-muted mt-0.5 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PolicyColumn({ criticalPolicies, primary }: { criticalPolicies: any[]; primary: boolean }) {
  return (
    <section className="col-span-4" id="dashboard-policy" data-walkthrough-focus="Policy column">
      <SectionHeading eyebrow="Policy" title="Policy radar" link="/policy" accent={primary} />
      <div className={`bg-surface rounded-md divide-y divide-border-subtle border
        ${primary ? 'border-border-default' : 'border-border-subtle'}`}>
        {criticalPolicies.map((policy) => {
          const alerts = policyAlerts.filter((a) => a.policyId === policy.id);
          const unread = alerts.filter((a) => a.isUnread).length;
          return (
            <Link
              key={policy.id}
              to={`/policy/${policy.id}`}
              className="flex items-start gap-3 p-4 hover:bg-surface-muted/30 transition-colors no-underline"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-1.5">
                  <p className="text-sm font-medium text-primary line-clamp-2 flex-1">{policy.title}</p>
                  <NarrativeSpineBadge id={policy.id} compact />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Chip
                    variant={policy.impactLevel.includes('risk') ? 'danger' : 'success'}
                    label={policy.impactLevel}
                  />
                  <span className="text-[12px] text-muted">{policy.jurisdiction}</span>
                  {unread > 0 && (
                    <span className="text-[11px] text-warning font-medium">{unread} new {unread === 1 ? 'alert' : 'alerts'}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PeersColumn({ primary }: { primary: boolean }) {
  return (
    <section className="col-span-4" id="dashboard-peers" data-walkthrough-focus="Peers column">
      <SectionHeading eyebrow="Peers" title="Benchmarks" link="/peers" accent={primary} subtitle={`${trackedPeers.length} peers tracked · ${savedCampaigns.length} campaigns saved`} />
      <div className={`bg-surface rounded-md p-5 border
        ${primary ? 'border-border-default' : 'border-border-subtle'}`}>
        <BenchmarkRow
          label="Email open rate"
          yours={benchmarkData.emailOpenRate.yours}
          peer={benchmarkData.emailOpenRate.peerAverage}
          suffix="%"
        />
        <BenchmarkRow
          label="Donation conversion"
          yours={benchmarkData.donationConversion.yours}
          peer={benchmarkData.donationConversion.peerAverage}
          suffix="%"
        />
        <BenchmarkRow
          label="Donor retention"
          yours={benchmarkData.donorRetention.yours}
          peer={benchmarkData.donorRetention.peerAverage}
          suffix="%"
        />
      </div>
    </section>
  );
}

// Phase 6: dashboard section heading with editorial rhythm.
// Small eyebrow overline, sans section title, optional meta line, optional
// "View all" link. The `accent` flag (used for the active role's primary
// surface column) adds a printed yellow bar before the eyebrow so the eye
// lands on the role's home surface first.
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  accent,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  link?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className={accent ? 'eyebrow mb-1.5' : 'eyebrow-plain mb-1.5'}>{eyebrow}</p>
        )}
        <h2 className="text-[15px] font-semibold text-primary leading-tight tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="text-[12px] font-medium text-secondary hover:text-primary whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1 no-underline border-b border-transparent hover:border-primary/40 pb-px"
        >
          View all →
        </Link>
      )}
    </div>
  );
}

function ChecklistItem({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0
        ${done ? 'bg-accent border-border-default' : 'border-border-subtle bg-surface'}`}>
        {done && <CheckCircle size={11} className="text-primary" strokeWidth={2.5} />}
      </div>
      <span className={`text-[13px] ${done ? 'text-muted line-through' : 'text-primary'}`}>
        {label}
      </span>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const iconMap: Record<string, React.ReactNode> = {
    danger: <AlertCircle size={16} className="text-danger" />,
    warning: <AlertTriangle size={16} className="text-warning" />,
    info: <Info size={16} className="text-info" />,
    success: <CheckCircle size={16} className="text-success" />,
  };
  const dotColor: Record<string, string> = {
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
    success: 'bg-success',
  };
  const timeAgo = alert.timestamp ? (() => {
    const now = new Date('2026-04-12T10:00:00');
    const d = new Date(alert.timestamp);
    const diffH = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    return diffH < 1 ? 'just now' : diffH < 24 ? `${diffH}h ago` : `${Math.floor(diffH / 24)}d ago`;
  })() : null;
  return (
    <Link
      to={alert.actionLink || '#'}
      className="group flex items-start gap-3 p-4 bg-surface border border-border-subtle rounded-md no-underline
        transition-[border-color,background-color] duration-150 ease-out
        hover:border-border-default hover:bg-surface-muted/30"
    >
      <div className={`w-1 self-stretch rounded-full ${dotColor[alert.type]} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          {iconMap[alert.type]}
          <p className="text-sm font-medium text-primary line-clamp-1">{alert.title}</p>
        </div>
        <p className="text-[13px] text-secondary line-clamp-2 ml-6">{alert.description}</p>
        {(alert.source || timeAgo) && (
          <p className="text-[11px] text-muted mt-1 ml-6">
            {alert.source && <>via {alert.source}</>}
            {alert.source && timeAgo && <> · </>}
            {timeAgo}
          </p>
        )}
      </div>
      <ArrowUpRight
        size={13}
        className="text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-0.5 flex-shrink-0"
      />
    </Link>
  );
}

function BenchmarkRow({ label, yours, peer, suffix }: { label: string; yours: number; peer: number; suffix?: string }) {
  const diff = yours - peer;
  const ahead = diff >= 0;
  return (
    <div className="py-3 first:pt-0 last:pb-0 border-b border-border-subtle last:border-0">
      <div className="flex items-end justify-between mb-1">
        <span className="text-[13px] text-secondary">{label}</span>
        <span className={`text-[12px] font-medium ${ahead ? 'text-success' : 'text-danger'}`}>
          {ahead ? '+' : ''}{diff.toFixed(1)}{suffix} vs. peers
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-semibold text-primary leading-none">{yours}{suffix}</span>
        <span className="text-[13px] text-muted">peer avg {peer}{suffix}</span>
      </div>
    </div>
  );
}

function GlanceRow({ label, value, sublabel, accent, link }: { label: string; value: string; sublabel?: string; accent?: 'danger' | 'warning' | 'success'; link?: string }) {
  const valueClass =
    accent === 'danger' ? 'text-danger' :
    accent === 'warning' ? 'text-warning' :
    accent === 'success' ? 'text-success' :
    'text-primary';
  const content = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[12px] text-secondary">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-[17px] font-semibold tabular-nums tracking-tight ${valueClass}`}>{value}</span>
        {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
      </div>
    </div>
  );
  if (link) {
    return (
      <Link to={link} className="no-underline hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }
  return content;
}

function QuickLink({ to, label, count, icon }: { to: string; label: string; count?: number; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-sm hover:bg-surface-muted transition-colors no-underline"
    >
      <span className="flex items-center gap-2 text-[13px] text-primary">
        <span className="text-muted">{icon}</span>
        {label}
      </span>
      {count !== undefined && <span className="text-[12px] text-muted">{count}</span>}
    </Link>
  );
}

function ActivityRow({ item }: { item: any }) {
  const iconMap: Record<string, React.ReactNode> = {
    gift: <Gift size={13} />,
    meeting: <UsersIcon size={13} />,
    email: <Mail size={13} />,
    policy: <FileText size={13} />,
    peer: <Megaphone size={13} />,
    team: <TrendingUp size={13} />,
  };
  const date = new Date(item.timestamp);
  const now = new Date('2026-04-12T10:00:00');
  const diffH = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  const timeAgo = diffH < 1 ? 'just now' : diffH < 24 ? `${diffH}h ago` : `${Math.floor(diffH / 24)}d ago`;

  return (
    <Link to={item.link || '#'} className="flex items-start gap-3 p-4 hover:bg-surface-muted/30 no-underline">
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0
        ${item.type === 'gift' ? 'bg-accent-soft border-accent text-primary' : 'bg-surface-muted border-border-subtle text-secondary'}`}>
        {iconMap[item.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-0.5">
          <p className="text-sm font-medium text-primary">{item.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{timeAgo}</span>
        </div>
        <p className="text-[13px] text-secondary line-clamp-1">{item.description}</p>
        <p className="text-[11px] text-muted mt-0.5">via {item.actor}</p>
      </div>
    </Link>
  );
}

function OrgStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow-plain mb-1.5">{label}</p>
      <p className="text-[13px] text-primary flex items-center gap-1.5">
        {icon && <span className="text-muted">{icon}</span>}
        {value}
      </p>
    </div>
  );
}
