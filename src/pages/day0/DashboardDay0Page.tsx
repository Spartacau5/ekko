import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Check, X, Sparkles, FileText, PlugZap } from 'lucide-react';
import { useRole } from '../../lib/RoleContext';
import { roleMeta } from '../../data/team';
import { dashboardAlerts } from '../../data/alerts';
import { useToast, Button } from '../../components/ui';
import { Panel } from '../../components/dashboard/Panel';
import { StatsStrip } from '../../components/dashboard/StatsStrip';
import { SignalLegend, SignalRow } from '../../components/dashboard/SignalRow';
import { motionDurations, motionEasings } from '../../lib/motion';

// ─────────────────────────────────────────────────────────────────────────────
// Day 0 Dashboard. Same shell as Day X; the content flips to empty / setup
// states. KPIs show skeleton with a "connect to see real numbers" caption;
// Tasks panel is an empty state with a "Create from signal" walkthrough CTA;
// Signals panel shows AI-suggested topics the user can confirm / dismiss +
// an "Add topic" affordance; Activities panel shows a "connect tools" state.
// Pinned priorities is hidden on Day 0 per the spec.
// ─────────────────────────────────────────────────────────────────────────────

const TODAY = new Date('2026-04-12');

export function DashboardDay0Page() {
  const { activeRole, activeMember } = useRole();
  const toast = useToast();

  const firstName = activeMember.name.split(' ')[0];
  const greetingSubtitle = `${roleMeta[activeRole].label}, Provide Food NYC`;
  const dateLine = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Day 0 "at a glance" leans on zeros-with-intent: the numbers are technically
  // correct, but the panel's real job is to anchor the greeting.
  const glance = useMemo(
    () => [
      { label: 'Urgent tasks',      value: '0' },
      { label: 'Signals',           value: '—' },
      { label: 'Upcoming meetings', value: '0' },
      { label: 'Funds raised',      value: '—', tooltip: 'Connect Stripe or a CRM to see giving totals' },
    ],
    []
  );

  // AI-suggested signals, intentionally a small curated list drawn from the
  // seeded alert dataset — gives the Day 0 reviewer something concrete to
  // click confirm on (instead of a fully-empty panel).
  const [suggestions, setSuggestions] = useState(() => dashboardAlerts.slice(0, 4).map((a) => a.id));
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const suggestedSignals = dashboardAlerts.filter((a) => suggestions.includes(a.id));
  const confirmedSignals = dashboardAlerts.filter((a) => confirmed.includes(a.id));

  const confirmSignal = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== id));
    setConfirmed((prev) => [...prev, id]);
    toast.show({ type: 'success', title: 'Signal added', description: 'We\'ll track this going forward.' });
  };
  const dismissSignal = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== id));
    toast.show({ type: 'info', title: 'Suggestion dismissed' });
  };

  return (
    <>
      {/* Greeting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hello-day0-${activeRole}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
          className="mb-6"
        >
          <p className="text-[13px] text-muted mb-1">{dateLine}</p>
          <h1 className="display-title">Welcome, {firstName}</h1>
          <p className="text-[14px] text-secondary mt-1.5">{greetingSubtitle}</p>
          <p className="text-[13px] text-muted mt-2 max-w-2xl">
            Finish the setup steps in the top-right to unlock live numbers, tasks, and signals tailored to your work.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Today at a Glance (mostly zeros) */}
      <div className="mb-6">
        <StatsStrip items={glance} />
      </div>

      {/* KPI skeleton row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPI_SKELETONS.map((k) => (
          <KpiSkeleton key={k.label} label={k.label} hint={k.hint} />
        ))}
      </div>

      {/* Tasks + Signals */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Panel
          eyebrow="Your work"
          title="Tasks"
          subtitle="Nothing to action yet"
          bodyHeight={420}
          flushBody
        >
          <EmptyPanelBody
            icon={<Sparkles size={22} className="text-primary" />}
            title="Tasks start with a signal"
            description="Once your tools are connected, signals turn into actionable tasks. You can also create one manually to see how the flow works."
            primaryCta={{
              label: 'Create from signal',
              onClick: () => toast.show({
                type: 'info',
                title: 'Walkthrough coming soon',
                description: 'This will open a guided flow once connected signals are available.',
              }),
            }}
            secondaryCta={{ label: 'Connect a tool', to: '/settings', icon: <PlugZap size={13} /> }}
          />
        </Panel>

        <Panel
          eyebrow="What's changed"
          title="Recent signals"
          headerRight={<SignalLegend />}
          bodyHeight={420}
          flushBody
        >
          <div className="p-4 flex flex-col gap-5">
            {suggestedSignals.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-primary">Suggested from your setup</p>
                    <p className="text-[12px] text-muted">Based on your CRM connections and documents. Confirm to start tracking.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {suggestedSignals.map((s) => (
                    <SuggestionCard
                      key={s.id}
                      title={s.title}
                      description={s.description}
                      category={s.category}
                      onConfirm={() => confirmSignal(s.id)}
                      onDismiss={() => dismissSignal(s.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {confirmedSignals.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Tracking</p>
                <div className="flex flex-col gap-1">
                  {confirmedSignals.map((s) => (
                    <SignalRow key={s.id} alert={s} />
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                toast.show({ type: 'info', title: 'Add a topic', description: 'This will open the topic picker once live.' })
              }
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border border-dashed border-border-default text-[13px] font-medium text-secondary hover:text-primary hover:bg-surface-muted/40 transition-colors duration-150 cursor-pointer"
            >
              <Plus size={14} /> Add topic to track
            </button>

            {suggestedSignals.length === 0 && confirmedSignals.length === 0 && (
              <p className="text-[13px] text-muted text-center py-4">
                Confirmed signals will appear here. Add a topic to start tracking.
              </p>
            )}
          </div>
        </Panel>
      </div>

      {/* Recent activities — empty */}
      <Panel
        eyebrow="Activity"
        title="Recent activities"
        subtitle="Last 24 hours"
        bodyHeight={240}
        flushBody
      >
        <EmptyPanelBody
          icon={<FileText size={22} className="text-primary" />}
          title="Your activity will show up here"
          description="Once Stripe, Google Calendar, or Mailchimp are connected, gifts, meetings, and opens will stream in."
          primaryCta={{ label: 'Connect tools', to: '/settings', icon: <PlugZap size={13} /> }}
        />
      </Panel>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Local subcomponents
// ─────────────────────────────────────────────────────────────────────────────

const KPI_SKELETONS = [
  { label: 'Active donors',         hint: 'Connect Salesforce to see real numbers' },
  { label: 'Lifetime revenue',      hint: 'Connect Stripe or a CRM' },
  { label: 'Tracked policies',      hint: 'Pick topics to start tracking' },
  { label: 'Avg engagement score',  hint: 'Available once Mailchimp is linked' },
];

function KpiSkeleton({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5 flex flex-col gap-3">
      <p className="text-[13px] text-secondary">{label}</p>
      <p className="text-[32px] leading-none font-semibold text-muted tabular-nums tracking-tight">—</p>
      <div className="flex items-end justify-between gap-3 mt-auto">
        <p className="text-[11px] text-muted leading-snug max-w-[160px]">{hint}</p>
        <div className="w-[110px] h-[30px] rounded-sm bg-surface-muted/70" aria-hidden="true" />
      </div>
    </div>
  );
}

function EmptyPanelBody({
  icon,
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryCta?: { label: string; onClick?: () => void; to?: string; icon?: React.ReactNode };
  secondaryCta?: { label: string; to?: string; icon?: React.ReactNode };
}) {
  const renderCta = (cta: NonNullable<typeof primaryCta>, variant: 'primary' | 'secondary') => {
    const children = (
      <span className="inline-flex items-center gap-1.5">
        {cta.icon}
        {cta.label}
      </span>
    );
    if (cta.to) {
      return (
        <Link to={cta.to} className="no-underline">
          <Button variant={variant}>{children}</Button>
        </Link>
      );
    }
    return (
      <Button variant={variant} onClick={cta.onClick}>
        {children}
      </Button>
    );
  };
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-6 py-8 text-center">
      <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">{icon}</div>
      <div className="flex flex-col gap-1.5 max-w-[380px]">
        <p className="text-[15px] font-semibold text-primary">{title}</p>
        <p className="text-[13px] text-muted leading-relaxed">{description}</p>
      </div>
      {(primaryCta || secondaryCta) && (
        <div className="flex items-center gap-2 mt-1">
          {primaryCta && renderCta(primaryCta, 'primary')}
          {secondaryCta && renderCta(secondaryCta, 'secondary')}
        </div>
      )}
    </div>
  );
}

function SuggestionCard({
  title,
  description,
  category,
  onConfirm,
  onDismiss,
}: {
  title: string;
  description: string;
  category: string;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const dotClass =
    category === 'policy' ? 'bg-info' :
    category === 'people' ? 'bg-success' :
    category === 'peers'  ? 'bg-accent' :
                             'bg-muted';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
      className="flex items-start gap-3 p-3 rounded-md border border-border-subtle bg-surface"
    >
      <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-[13px] font-medium text-primary line-clamp-1">{title}</p>
        <p className="text-[12px] text-muted line-clamp-2">{description}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onConfirm}
          aria-label="Track this signal"
          className="w-7 h-7 flex items-center justify-center rounded-sm border border-border-default bg-surface text-primary hover:bg-accent transition-colors duration-150 cursor-pointer"
        >
          <Check size={13} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss suggestion"
          className="w-7 h-7 flex items-center justify-center rounded-sm border border-border-subtle bg-surface text-muted hover:text-primary hover:border-border-default transition-colors duration-150 cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}
