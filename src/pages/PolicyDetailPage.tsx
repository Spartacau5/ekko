import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../lib/motion';
import {
  ArrowLeft,
  Star,
  Sparkles,
  Search as SearchIcon,
  ChevronDown,
  AlertTriangle,
  Check,
  Lightbulb,
  User as UserIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Building2,
  DollarSign,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2,
} from 'lucide-react';
import { policies, Policy } from '../data/policies';
import { useToast, ComposeNoteModal, FollowUpComposer, AssignDropdown } from '../components/ui';
import { useRecent } from '../lib/RecentContext';
import { usePolicyRead } from '../lib/PolicyReadContext';
import { useMaturity } from '../lib/MaturityContext';
import { useActions } from '../lib/ActionContext';
import { useRole } from '../lib/RoleContext';
import { PolicyDetailDay0Page } from './day0/PolicyDetailDay0Page';

export function PolicyDetailPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PolicyDetailDay0Page />;
  return <PolicyDetailDayXPage />;
}

// ─────────────────────────────────────────────────────────────────────────
// Day-X Policy Detail
// First major screen in the demo flow: Sofia (ED of Provide Food NYC) opens
// this after a notification. The page tells one story — what changed, when,
// and how it affects us — with the impact graph as the visual centerpiece.
// ─────────────────────────────────────────────────────────────────────────

type SummaryTab = 'org' | 'ai' | 'official';
type Priority = 'critical' | 'high' | 'medium' | 'low' | 'none';

const SUMMARY_COPY: Record<SummaryTab, { title: string; body: React.ReactNode }> = {
  org: {
    title: 'For Our Org',
    body: (
      <>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <SummaryStat label="New residents eligible" value="85,000" />
          <SummaryStat label="Our reach expands by"  value="~40%" />
          <SummaryStat label="New funding potential" value="$200–400K" suffix="/yr" highlight />
        </div>
        <p>
          This bill would extend emergency food assistance eligibility across Brooklyn, Queens, and
          the Bronx — with the strongest overlap in <strong>Brownsville</strong> and{' '}
          <strong>East New York</strong>, where we already run 3 community kitchens. It opens two
          new city funding streams and strengthens our position in the RobinHood Foundation Q3
          grant cycle.
        </p>
      </>
    ),
  },
  ai: {
    title: 'AI Summary',
    body: (
      <p>
        This bill proposes expanding the geographic boundaries and income thresholds for NYC's
        emergency food assistance program. It amends Local Law 12-2024 to include census tracts
        previously excluded from emergency food coverage, adds inflation-adjusted income
        qualifications, and allocates <strong>$12M</strong> in new program funding through
        FY2027. The bill has bipartisan committee support but faces an opposition amendment that
        would narrow the geographic scope.
      </p>
    ),
  },
  official: {
    title: 'Official',
    body: (
      <>
        <p className="font-medium text-primary">Int. 2026-0347</p>
        <p className="mt-1">
          A Local Law to amend the administrative code of the city of New York, in relation to
          expanding eligibility for emergency food assistance programs, including but not limited
          to community kitchen partnerships, mobile pantry routes, and home-delivered meal
          services administered through the Department of Social Services…
        </p>
        <button className="mt-3 text-[13px] font-medium text-brand hover:underline underline-offset-2">
          See full text →
        </button>
      </>
    ),
  },
};

function PolicyDetailDayXPage() {
  const { id } = useParams<{ id: string }>();
  // Demo flow centerpiece: when no id is in the URL, show the NYC Food
  // Expansion story by default so the policy entry from the dashboard works.
  const policy =
    policies.find((p) => p.id === id) ?? policies.find((p) => p.id === 'nyc-food-expansion');
  const { trackVisit } = useRecent();
  const { markRead } = usePolicyRead();
  const { activeMember } = useRole();
  const { addAction } = useActions();
  const toast = useToast();
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerTitle] = useState<string>('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [summaryTab, setSummaryTab] = useState<SummaryTab>('org');
  const [priority, setPriority] = useState<Priority>('high');

  useEffect(() => {
    if (policy) {
      trackVisit({ type: 'policy', id: policy.id, label: policy.title, path: `/policy/${policy.id}` });
      markRead(policy.id);
    }
  }, [policy?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Policy not found.</p>
        <Link to="/policy" className="text-primary underline mt-2 inline-block">Back to policy</Link>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/policy"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-primary mb-4 no-underline"
      >
        <ArrowLeft size={14} /> Back to policy
      </Link>

      {/* HEADER + SUMMARY (combined) */}
      <section className="bg-surface border border-border-subtle rounded-lg p-7 mb-6 shadow-card">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="page-title">{policy.title}</h1>
          <PriorityMenu value={priority} onChange={setPriority} />
        </div>

        {/* Summary toggle */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h2 className="section-title">Summary</h2>
          </div>
          <SummaryToggle value={summaryTab} onChange={setSummaryTab} />
        </div>
        <div className="text-[14px] leading-relaxed text-primary/85 space-y-1 relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={summaryTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
            >
              {SUMMARY_COPY[summaryTab].body}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* TIMELINE — leads with the recent change so the strip and the visual
          timeline read as one unit: what just shifted, then where it sits
          on the broader arc. */}
      <section className="bg-surface border border-border-subtle rounded-lg p-7 mb-6 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="section-title">Policy Timeline</h2>
            <p className="text-[12px] text-muted mt-0.5">Recent changes, hearings, and milestones</p>
          </div>
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-end px-3 py-2 rounded-md bg-brand/5 border border-brand/15">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Floor vote in</span>
              <span className="text-[13px] font-semibold text-brand mt-0.5">42 days</span>
            </div>
          </div>
        </div>

        {/* Recent change strip + visual tether to the Jun 10 column. The
            tether is a dashed amber line dropped at the column's center
            (75% across the 6-column grid) so the eye flows from row → node. */}
        <div className="relative">
          <div className="rounded-lg bg-amber-50/70 border border-amber-200 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-amber-800 mb-2">
              Recent change
            </p>
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 bg-amber-500"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-primary leading-snug">
                  Hearing date moved up
                </p>
                <p className="text-[13px] text-secondary mt-0.5 leading-relaxed">
                  Council Committee Hearing rescheduled from July 15 to June 10. Preparation
                  window <strong>shortened by 5 weeks</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <PolicyTimeline events={policy.timeline} />
        </div>

        <SuggestedActions />
      </section>

      {/* IMPACT NETWORK — command-center centerpiece. Shows everyone touched
          by this policy and the actions we should take in response. Heading
          lives inside the card so it sits on the white surface, not the page
          background. */}
      <section className="mb-6">
        <CommandCenter />
      </section>

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultTitle={composerTitle || policy.recommendedAction}
        defaultContext={`Linked to policy: ${policy.title}. ${policy.summary}`}
        defaultEntity={{ type: 'policy', id: policy.id, label: policy.title, link: `/policy/${policy.id}` }}
        onCreate={(payload) => {
          addAction(
            {
              ...payload,
              entity:
                payload.entity ?? {
                  type: 'policy',
                  id: policy.id,
                  label: policy.title,
                  link: `/policy/${policy.id}`,
                },
            },
            activeMember.id,
            ['executive', 'policy'],
          );
          toast.show({ type: 'success', title: 'Assigned to team', description: payload.title });
        }}
      />

      <ComposeNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        entityLabel={policy.title}
        onSubmit={(body) => {
          toast.show({ type: 'success', title: 'Note added', description: body.slice(0, 60) });
          setNoteOpen(false);
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: Array<{
  id: Priority;
  label: string;
  star: 'fill' | 'outline' | 'none';
  starClass: string;
  pillClass: string;
}> = [
  { id: 'critical', label: 'Critical',    star: 'fill',    starClass: 'fill-danger text-danger',     pillClass: 'text-danger' },
  { id: 'high',     label: 'High',        star: 'fill',    starClass: 'fill-accent text-accent',     pillClass: 'text-primary' },
  { id: 'medium',   label: 'Medium',      star: 'fill',    starClass: 'fill-warning text-warning',   pillClass: 'text-primary' },
  { id: 'low',      label: 'Low',         star: 'outline', starClass: 'text-brand',                  pillClass: 'text-primary' },
  { id: 'none',     label: 'No priority', star: 'none',    starClass: 'text-muted',                  pillClass: 'text-muted' },
];

function PriorityMenu({ value, onChange }: { value: Priority; onChange: (v: Priority) => void }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = PRIORITY_OPTIONS.find((o) => o.id === value)!;

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium rounded-md border border-border-subtle bg-surface hover:border-brand/50 transition-colors"
      >
        <Star
          size={14}
          strokeWidth={1.8}
          className={current.starClass}
          fill={current.star === 'fill' ? 'currentColor' : 'none'}
        />
        <span className={current.pillClass}>
          {value === 'none' ? 'Set priority' : `Priority: ${current.label}`}
        </span>
        <ChevronDown size={12} className="text-muted" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border-subtle rounded-md shadow-elevated overflow-hidden z-30"
        >
          <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Set priority
          </p>
          <div className="py-1">
            {PRIORITY_OPTIONS.map((opt) => {
              const active = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => { onChange(opt.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-page transition-colors ${
                    active ? 'bg-brand/5' : ''
                  }`}
                >
                  <Star
                    size={14}
                    strokeWidth={1.8}
                    className={opt.starClass}
                    fill={opt.star === 'fill' ? 'currentColor' : 'none'}
                  />
                  <span className="flex-1 text-left text-primary">{opt.label}</span>
                  {active && <Check size={14} className="text-brand" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact stat tile used at the top of the "For Our Org" summary. Three of
// these sit in a row to give the at-a-glance numbers (eligible residents,
// reach expansion, funding potential) before the prose.
function SummaryStat({
  label,
  value,
  suffix,
  highlight = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-page px-3 py-2.5">
      <p className="text-[10px] font-mono tracking-[0.14em] text-muted uppercase leading-tight">
        {label}
      </p>
      <p
        className={`mt-1.5 text-[20px] font-semibold leading-none tabular-nums ${
          highlight ? 'text-success' : 'text-primary'
        }`}
      >
        {value}
        {suffix && (
          <span className="text-[12px] font-medium text-muted ml-0.5">{suffix}</span>
        )}
      </p>
    </div>
  );
}

function SummaryToggle({
  value,
  onChange,
}: {
  value: SummaryTab;
  onChange: (v: SummaryTab) => void;
}) {
  const tabs: Array<{ id: SummaryTab; label: string }> = [
    { id: 'org', label: 'For Our Org' },
    { id: 'ai', label: 'AI Summary' },
    { id: 'official', label: 'Official' },
  ];
  return (
    <div className="inline-flex items-center p-1 bg-page border border-border-subtle rounded-full">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-3.5 h-8 text-[13px] font-medium rounded-full transition-colors ${
              active
                ? 'bg-surface text-primary shadow-sm'
                : 'text-muted hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function PolicyTimeline({ events }: { events: Policy['timeline'] }) {
  // Demo-flow timeline: hard-codes the 6 steps for the NYC Food Expansion
  // story so the visual treatment (completed / current / future + flags)
  // matches the design without needing a richer data model.
  type Step = {
    date: string;
    title: string;
    subtitle: string;
    state: 'done' | 'current' | 'future';
    progress?: number;
    rescheduledFrom?: string;
  };
  const steps: Step[] = [
    { date: 'Jan 12', title: 'Policy Identified',          subtitle: "Detected by Ekko's policy monitor", state: 'done' },
    { date: 'Feb 20', title: 'Impact Assessment',          subtitle: '',                                  state: 'done' },
    { date: 'Mar 15', title: 'Council Committee Hearing',  subtitle: 'Public testimony is open',          state: 'current' },
    { date: 'May 1',  title: 'Coalition Agreement',        subtitle: 'Coalition positions confirmed',    state: 'future' },
    { date: 'Jun 10', title: 'Council Floor Vote',         subtitle: 'Awaiting full council vote',       state: 'future', rescheduledFrom: 'Jul 15' },
    { date: 'Sep 1',  title: 'Implementation Begins',      subtitle: 'New coverage areas go live',       state: 'future' },
  ];

  return (
    <div className="relative pt-4 pb-2">
      <div className="grid grid-cols-6 gap-2 relative">
        {/* Connecting line — runs behind the dots. */}
        <div className="absolute left-[8.33%] right-[8.33%] top-[42px] h-[2px] bg-border-subtle" aria-hidden="true">
          <div className="h-full bg-brand" style={{ width: '40%' }} />
        </div>

        {steps.map((s, i) => {
          const isImpact = s.date === 'Feb 20';
          const isRescheduled = !!s.rescheduledFrom;
          return (
            <div
              key={i}
              className={`flex flex-col items-center text-center relative ${isImpact ? 'group cursor-default' : ''}`}
            >
              {/* Date label — when rescheduled, show old → new with
                  strikethrough on old. The date is the single primary signal
                  for the move; the dot and chip below are subtle supporting
                  cues so the column doesn't read as three competing alerts. */}
              {isRescheduled ? (
                <span className="text-[12px] font-semibold mb-2 inline-flex items-baseline gap-1 text-amber-700">
                  <span className="line-through text-muted font-medium">{s.rescheduledFrom}</span>
                  <span aria-hidden="true">→</span>
                  <span>{s.date}</span>
                </span>
              ) : (
                <span
                  className={`text-[12px] font-semibold mb-2 ${
                    s.state === 'future' ? 'text-muted' : 'text-brand'
                  }`}
                >
                  {s.date}
                </span>
              )}

              {/* Dot */}
              <TimelineDot state={s.state} progress={s.progress} rescheduled={isRescheduled} />

              {/* Title */}
              <p className="mt-3 text-[12px] font-semibold text-primary leading-tight px-1">
                {s.title}
              </p>

              {/* Detail row — fixed min-height so chip rows and subtitle rows
                  share the same vertical rhythm across all six columns. */}
              <div className="mt-1 min-h-[32px] flex items-start justify-center px-1">
                {isImpact ? (
                  <span className="inline-flex items-center px-2 h-[20px] rounded-full bg-success-soft text-success text-[11px] font-semibold leading-none">
                    High Opportunity
                  </span>
                ) : isRescheduled ? (
                  <span className="inline-flex items-center px-2 h-[20px] rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold leading-none">
                    Preponed 5 weeks
                  </span>
                ) : (
                  s.subtitle && (
                    <p className="text-[11px] text-muted leading-tight">{s.subtitle}</p>
                  )
                )}
              </div>

              {/* Impact Assessment hover popover */}
              {isImpact && (
                <div className="absolute hidden group-hover:block bottom-full left-0 -translate-x-6 pb-3 z-30">
                  <ImpactAssessmentCard />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* avoid unused warning */}
      <span className="hidden">{events.length}</span>
    </div>
  );
}

function TimelineDot({
  state,
  progress,
  rescheduled = false,
}: {
  state: 'done' | 'current' | 'future';
  progress?: number;
  rescheduled?: boolean;
}) {
  // Rescheduled future node — single amber border. The date treatment above
  // (Jul 15 → Jun 10) carries the primary "this moved" signal, so the dot
  // stays understated to avoid stacking three amber alerts on one column.
  if (rescheduled) {
    return (
      <span className="w-9 h-9 rounded-full bg-surface border-2 border-amber-500 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3.5 3.5L12 4" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === 'done') {
    return (
      <span className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center shadow-sm">
        <SearchIcon size={14} strokeWidth={2} />
      </span>
    );
  }
  if (state === 'current') {
    return (
      <span className="w-9 h-9 rounded-full bg-surface border-2 border-brand text-brand flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (progress !== undefined) {
    return (
      <span className="relative w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-semibold">
        {progress}%
      </span>
    );
  }
  return (
    <span className="w-9 h-9 rounded-full bg-surface border-2 border-border-subtle flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7l3.5 3.5L12 4" stroke="#C4C4CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ImpactAssessmentCard() {
  return (
    <div className="w-[440px] bg-surface border border-border-subtle rounded-lg shadow-elevated p-6 pointer-events-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-[20px] font-bold text-primary leading-tight">Impact Assessment</h3>
        <span className="inline-flex items-center px-3 h-7 rounded-full bg-success-soft text-success text-[12px] font-semibold whitespace-nowrap">
          High Opportunity
        </span>
      </div>

      {/* Tip card */}
      <div className="flex items-center gap-3 bg-warning-soft/70 rounded-md px-3 py-3 mb-5">
        <Lightbulb size={22} className="text-warning shrink-0" />
        <p className="flex-1 text-[12px] text-primary leading-snug text-left">
          This policy intersects with <strong>your program areas</strong> &amp; may unlock{' '}
          <strong>2 new funding streams</strong>.
        </p>
        <button
          type="button"
          className="inline-flex items-center px-3 h-7 rounded-full bg-primary text-white text-[11px] font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          View Report
        </button>
      </div>

      {/* Relevance Scores */}
      <p className="text-[13px] text-muted mb-3">Relevance Scores</p>
      <div className="grid grid-cols-3 gap-3">
        <ScoreRing
          percent={92}
          label="Mission Alignment"
          subtitle="Expands food access in your active service zones"
        />
        <ScoreRing
          percent={85}
          label="Funding Potential"
          subtitle="Opens HUD Community Dev & Robinhood housing grants"
        />
        <ScoreRing
          percent={78}
          label="Advocacy Leverage"
          subtitle="3 coalition partners already mobilizing"
          tone="warm"
        />
      </div>

      {/* Timestamp */}
      <p className="mt-4 text-right text-[11px] text-muted">Feb 20, 2026</p>
    </div>
  );
}

function ScoreRing({
  percent,
  label,
  subtitle,
  tone = 'success',
}: {
  percent: number;
  label: string;
  subtitle: string;
  tone?: 'success' | 'warm';
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);
  const stroke = tone === 'warm' ? '#84CC16' : '#16A34A';
  return (
    <div className="flex flex-col items-start text-left">
      <div className="relative w-[68px] h-[68px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={r} stroke="#E5E7EB" strokeWidth="5" fill="none" />
          <circle
            cx="34"
            cy="34"
            r={r}
            stroke={stroke}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-primary">
          {percent}%
        </span>
      </div>
      <p className="mt-2 text-[12px] font-semibold text-primary leading-tight">{label}</p>
      <p className="mt-1 text-[10px] text-muted leading-tight">{subtitle}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Command Center — stakeholder network / impact radar / internal action map
// Three boards in one dark "intelligence view" panel. Each board has its
// own visualization but they share the right rail (Detail / Legend / Case
// File) so context stays put as users switch boards.
// ─────────────────────────────────────────────────────────────────────────

type BoardId = 'people' | 'policy' | 'peers';
type StanceTone = 'supportive' | 'opposed' | 'uncertain';
type Influence = 'high' | 'med' | 'low';

interface HoverDetail {
  category: 'PEOPLE' | 'POLICY' | 'PEERS';
  title: string;
  meta?: string;
  body: string;
  opportunity?: string;
  benchmark?: { coverageLabel: string; coveragePct: number; peerLabel: string; peerValue: string };
  action?: string;
  accent?: string;
}

interface HoverState {
  id: string;
  detail: HoverDetail;
  rect: { x: number; y: number; w: number; h: number };
}

// Hand-pinned-string curve helper (from design handoff).
function curvedPath(x1: number, y1: number, x2: number, y2: number, sag = 0.18, jitter = 0) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py =  dx / len;
  const off = len * sag + jitter;
  const cx = mx + px * off;
  const cy = my + py * off;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width || 1000, h: r.height || 600 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

const BOARD_TABS: Array<{ id: BoardId; label: string; count: number; icon: React.ReactNode }> = [
  { id: 'people', label: 'People',  count: 6, icon: <UserIcon size={14} /> },
  { id: 'policy', label: 'Policy',  count: 3, icon: <TargetIcon size={14} /> },
  { id: 'peers',  label: 'Peers',   count: 4, icon: <UsersIcon size={14} /> },
];

function CommandCenter() {
  const [board, setBoard] = useState<BoardId>('people');
  const [stanceFilter, setStanceFilter] = useState<'all' | StanceTone>('all');
  const [hover, setHover] = useState<HoverState | null>(null);
  // Clearing hover on board switch keeps stale popovers from sticking.
  useEffect(() => { setHover(null); }, [board]);

  return (
    <div className="rounded-lg bg-surface border border-border-subtle shadow-card overflow-hidden">
      <div className="relative">
        {/* HEADING — sits on the card surface so the section title travels
            with the panel rather than floating on the page background. */}
        <div className="px-5 pt-5 pb-4">
          <h2 className="section-title">Impact network</h2>
          <p className="text-[14px] text-muted leading-relaxed mt-1 max-w-3xl">
            Who's involved in this policy and what actions should we take.
          </p>
        </div>

        {/* TAB BAR — board switcher on the left, stance filter on the right
            (only for the People board, since Policy/Peers boards don't use
            stance). */}
        <div className="px-5 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {BOARD_TABS.map((t) => {
              const active = board === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBoard(t.id)}
                  className={`flex items-center gap-2.5 h-11 px-3.5 rounded-md border transition-colors ${
                    active
                      ? 'bg-brand/5 border-brand/30'
                      : 'bg-surface border-border-subtle hover:border-brand/30 hover:bg-page'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      active ? 'bg-brand text-white' : 'bg-page text-muted'
                    }`}
                  >
                    {t.icon}
                  </span>
                  <span className={`text-[13px] font-semibold ${active ? 'text-brand' : 'text-primary'}`}>
                    {t.label}
                  </span>
                  <span
                    className={`tabular-nums text-[11px] font-semibold px-1.5 h-[18px] inline-flex items-center rounded ${
                      active ? 'bg-brand/15 text-brand' : 'bg-page text-muted'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
          {board === 'people' && (
            <StanceFilterRow value={stanceFilter} onChange={setStanceFilter} />
          )}
        </div>

        {/* BODY — graph spans the full card width; legend + case file moved
            out so the network has the room to breathe. */}
        <div className="px-5 pb-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={board}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
            >
              {board === 'people' && (
                <PeopleBoard
                  hoverId={hover?.id ?? null}
                  onHover={setHover}
                  stanceFilter={stanceFilter}
                />
              )}
              {board === 'policy' && <PolicyBoard hoverId={hover?.id ?? null} onHover={setHover} />}
              {board === 'peers'  && <PeersBoard  hoverId={hover?.id ?? null} onHover={setHover} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <HoverPopover hover={hover} board={board} />
    </div>
  );
}

// ── PEOPLE BOARD ─────────────────────────────────────────────────────────

interface NodeDef {
  id: string;
  name: string;
  initials?: string;
  icon?: 'building' | 'dollar';
  stance: StanceTone;
  influence: Influence;
  x: number; // % within canvas
  y: number;
  href: string;
  detail: HoverDetail;
}

const PEOPLE_NODES: NodeDef[] = [
  // Center hub — the policy itself. Every stakeholder edge connects here, so
  // the graph reads as "who is for/against/uncertain about this bill" instead
  // of an arbitrary tangle of stakeholder-to-stakeholder lines.
  {
    id: 'policy-hub',
    name: 'NYC Food Expansion Act',
    icon: 'building',
    stance: 'supportive',
    influence: 'high',
    x: 50, y: 50,
    href: '/policy/nyc-food-expansion',
    detail: {
      category: 'POLICY',
      title: 'NYC Food Expansion Act',
      meta: 'Int. 2026-0347 · Council floor vote · Jun 10',
      body: 'The bill at the center of this network. Lines show how each stakeholder is positioned relative to the expansion: green for support, red for opposition, amber for unclear.',
    },
  },
  {
    id: 'nyc-council-health-food',
    name: 'NYC Council Health & Food Committee',
    icon: 'building',
    stance: 'supportive',
    influence: 'high',
    x: 50, y: 14,
    href: '/peers/nyc-council-health-food',
    detail: {
      category: 'PEOPLE',
      title: 'NYC Council Health & Food Committee',
      meta: 'Government · Supportive · High influence',
      body: 'Chaired by Councilmember Davis. Voted yes in committee 7–2 and authored the original eligibility expansion. The committee\'s position carries weight with swing council members heading into the June 10 floor vote.',
      opportunity: 'Request a testimony slot for the June 10 floor vote — committee staff have signaled openness to organizational input.',
    },
  },
  {
    id: 'nyc-food-policy-alliance',
    name: 'NYC Food Policy Alliance',
    initials: 'FA',
    stance: 'supportive',
    influence: 'med',
    x: 16, y: 32,
    href: '/peers/nyc-food-policy-alliance',
    detail: {
      category: 'PEOPLE',
      title: 'NYC Food Policy Alliance',
      meta: 'Coalition partner · Supportive · Medium influence',
      body: 'Coalition of 40+ food access organizations. Co-signed the coalition letter backing the bill and is coordinating joint testimony for the June 10 hearing.',
      opportunity: 'Coordinate joint testimony and share Provide Food NYC\'s service-area data to strengthen the coalition\'s case.',
    },
  },
  {
    id: 'restaurant-industry-council',
    name: 'Restaurant Industry Council',
    initials: 'RI',
    stance: 'opposed',
    influence: 'high',
    x: 84, y: 32,
    href: '/peers/restaurant-industry-council',
    detail: {
      category: 'PEOPLE',
      title: 'Restaurant Industry Council',
      meta: 'Industry group · Opposed · High influence',
      body: 'Trade group representing commercial food establishments. Opposes the expansion, citing competition from subsidized programs and added compliance costs. Lobbying three council members to back a narrowing amendment.',
      opportunity: 'Track the amendment\'s sponsor list weekly so the coalition can respond before the floor vote.',
    },
  },
  {
    id: 'city-budget-office',
    name: 'City Budget Office',
    icon: 'dollar',
    stance: 'uncertain',
    influence: 'high',
    x: 16, y: 68,
    href: '/peers/city-budget-office',
    detail: {
      category: 'PEOPLE',
      title: 'City Budget Office',
      meta: 'Government · Uncertain · High influence',
      body: 'Fiscal impact review pending; their cost analysis will move swing votes. Previous food-program notes flagged implementation timeline concerns rather than opposing the policy outright.',
      opportunity: 'Provide outcomes data from current coverage areas to shape the fiscal note before its May 15 release.',
    },
  },
  {
    id: 'robinhood-foundation',
    name: 'RobinHood Foundation',
    icon: 'dollar',
    stance: 'supportive',
    influence: 'med',
    x: 50, y: 86,
    href: '/peers/robinhood-foundation',
    detail: {
      category: 'PEOPLE',
      title: 'RobinHood Foundation',
      meta: 'Funder · Lifetime donation: $120K',
      body: 'RobinHood\'s 2026 food access priorities overlap with the bill\'s newly eligible neighborhoods. Their Q3 supplemental funding window opens July 1 — well-timed if the bill passes on schedule.',
      action: 'Ask Leah to draft a donor memo for RobinHood showing how the expansion overlaps with our existing programs.',
    },
  },
  {
    id: 'bronx-grocers-association',
    name: 'Bronx Grocers Association',
    initials: 'BX',
    stance: 'opposed',
    influence: 'low',
    x: 84, y: 68,
    href: '/peers/bronx-grocers-association',
    detail: {
      category: 'PEOPLE',
      title: 'Bronx Grocers Association',
      meta: 'Trade group · Opposed · Low influence',
      body: 'Local trade group for independent Bronx grocery stores. Opposes a separate nutrition-labeling provision rather than the food access expansion itself. Low influence on the overall vote.',
      opportunity: 'Monitor only — common ground exists on Bronx coverage if the labeling provision is clarified.',
    },
  },
];

type EdgeKind = 'advocacy' | 'opposition' | 'uncertain' | 'funding' | 'information';
const EDGE_COLOR: Record<EdgeKind, string> = {
  advocacy: '#22C55E',
  opposition: '#EF4444',
  uncertain: '#F59E0B',
  funding: '#F59E0B',
  information: '#22D3EE',
};

// Hub-and-spoke topology — every stakeholder connects to the policy itself.
// Edge color reflects each stakeholder's stance toward the bill so the graph
// reads at a glance: green = supports, red = opposes, amber = unclear.
const PEOPLE_EDGES: Array<{ from: string; to: string; kind: EdgeKind }> = [
  { from: 'nyc-council-health-food',      to: 'policy-hub', kind: 'advocacy' },
  { from: 'nyc-food-policy-alliance',     to: 'policy-hub', kind: 'advocacy' },
  { from: 'robinhood-foundation',         to: 'policy-hub', kind: 'advocacy' },
  { from: 'restaurant-industry-council',  to: 'policy-hub', kind: 'opposition' },
  { from: 'bronx-grocers-association',    to: 'policy-hub', kind: 'opposition' },
  { from: 'city-budget-office',           to: 'policy-hub', kind: 'uncertain' },
];

function PeopleBoard({
  hoverId,
  onHover,
  stanceFilter,
}: {
  hoverId: string | null;
  onHover: (h: HoverState | null) => void;
  stanceFilter: 'all' | StanceTone;
}) {
  const indexed = useMemo(() => Object.fromEntries(PEOPLE_NODES.map((n) => [n.id, n])), []);
  const [boardRef, size] = useElementSize();
  const { zoom, tx, ty, beginPan, zoomIn, zoomOut, reset, onWheel } = useGraphZoomPan();

  const pos = (n: NodeDef) => ({ x: (n.x / 100) * size.w, y: (n.y / 100) * size.h });
  // The policy hub is always visible — it's the bill itself, the anchor for
  // the network, so a stance filter on stakeholders should never hide it.
  const visible = (n: NodeDef) =>
    n.id === 'policy-hub' || stanceFilter === 'all' || n.stance === stanceFilter;
  const linked = (id: string) =>
    PEOPLE_EDGES.some((e) => (e.from === hoverId && e.to === id) || (e.to === hoverId && e.from === id));

  return (
    <div className="relative rounded-md bg-page border border-border-subtle overflow-hidden">

      <div
        ref={boardRef}
        className="relative w-full h-[620px] overflow-hidden"
        onWheel={onWheel}
      >
        {/* Pan-capture background — fills the canvas behind the graph; nodes
            stack above it so node clicks still go to their Links. */}
        <div
          data-graph-pan="true"
          onMouseDown={beginPan}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: 'radial-gradient(circle, #D6D6DC 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Transformed graph content. pointer-events: none on the wrapper lets
            clicks fall through to the pan layer in empty areas; nodes opt back
            in with pointer-events: auto. */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
            transformOrigin: '0 0',
            pointerEvents: 'none',
            transition: 'transform 140ms ease-out',
          }}
        >
          {/* SVG strings (curved with marching-ants) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              {Object.entries(EDGE_COLOR).map(([k, v]) => (
                <filter id={`cc-glow-${k}`} key={k} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              ))}
            </defs>
            {PEOPLE_EDGES.map((e, i) => {
              const a = indexed[e.from];
              const b = indexed[e.to];
              if (!a || !b) return null;
              if (!visible(a) || !visible(b)) return null;
              // The wrapper around each node contains the avatar circle plus
              // a label card below it, so the wrapper's vertical center sits
              // ~24px below the circle's center. Shift each edge endpoint up
              // by that amount so connections terminate on the circle, not on
              // the label card.
              const NODE_LABEL_OFFSET = 24;
              const A = { x: pos(a).x, y: pos(a).y - NODE_LABEL_OFFSET };
              const B = { x: pos(b).x, y: pos(b).y - NODE_LABEL_OFFSET };
              const focused = hoverId === e.from || hoverId === e.to;
              const dimmed = hoverId && !focused;
              const sag = ((i % 3) - 1) * 0.08 + 0.12;
              const d = curvedPath(A.x, A.y, B.x, B.y, sag, (i * 7) % 14 - 7);
              const c = EDGE_COLOR[e.kind];
              return (
                <g key={i} style={{ opacity: dimmed ? 0.18 : 1, transition: 'opacity .25s' }}>
                  <path d={d} fill="none" stroke={c} strokeOpacity={0.18} strokeWidth={focused ? 4 : 2.5} />
                  <path
                    d={d}
                    fill="none"
                    stroke={c}
                    strokeWidth={focused ? 1.6 : 1.2}
                    className={focused ? 'cc-string' : 'cc-string-slow'}
                    filter={`url(#cc-glow-${e.kind})`}
                  />
                </g>
              );
            })}
          </svg>

          {/* nodes */}
          <div className="absolute inset-0" style={{ zIndex: 2, pointerEvents: 'auto' }}>
            {PEOPLE_NODES.map((n, i) => {
              const focused = hoverId === n.id;
              const dim =
                !visible(n) ||
                (!!hoverId && !focused && !linked(n.id));
              const { x, y } = pos(n);
              return (
                <StakeholderNode
                  key={n.id}
                  node={n}
                  index={i}
                  left={x}
                  top={y}
                  focused={focused}
                  dimmed={dim}
                  onEnter={(rect) => onHover({ id: n.id, detail: n.detail, rect })}
                  onLeave={() => onHover(null)}
                />
              );
            })}
          </div>
        </div>

        {/* Footer label — outside the transform so it stays anchored. */}
        <div className="absolute bottom-3 left-4 text-[10px] font-mono tracking-[0.14em] text-muted/70 uppercase pointer-events-none z-30">
          Provide Food NYC · Internal · 2026-04-26
        </div>

        {/* Zoom controls — top-right inside the canvas. */}
        <GraphZoomControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
        />

        {/* Suggested-action panel — bottom-right inside the canvas. Surfaces
            the top action tied to a node in the graph (currently RobinHood)
            without crowding the node itself. */}
        <SuggestedActionPanel />
      </div>
    </div>
  );
}

function SuggestedActionPanel() {
  const [assignedId, setAssignedId] = useState<string | undefined>(undefined);
  return (
    <div className="absolute top-3 left-3 z-30 w-[300px] rounded-lg bg-surface border border-accent/40 shadow-elevated p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={12} className="text-accent" />
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
          Suggested action
        </p>
      </div>
      <div className="flex items-start gap-2.5">
        <p className="flex-1 text-[12px] text-primary leading-snug">
          Ask <span className="font-semibold underline decoration-1 underline-offset-2">Leah</span>{' '}
          to draft a donor memo for RobinHood.
        </p>
        <AssignDropdown
          assignedId={assignedId}
          onAssign={(m) => setAssignedId(m.id)}
          placement="bottom"
          align="right"
        />
      </div>
    </div>
  );
}

// ─── Zoom + pan ─────────────────────────────────────────────────────────────

function useGraphZoomPan() {
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

  const zoomIn  = () => setZoom((z) => clamp(z + 0.2, 0.5, 2.5));
  const zoomOut = () => setZoom((z) => clamp(z - 0.2, 0.5, 2.5));
  const reset   = () => { setZoom(1); setTx(0); setTy(0); };

  const onWheel = (e: React.WheelEvent) => {
    // Only zoom when the meta/ctrl key is pressed OR the user is scrolling
    // horizontally (trackpad pinch gesture surfaces as ctrl+wheel). Otherwise
    // we'd hijack page scroll, which feels worse than no zoom.
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.0025;
    setZoom((z) => clamp(z + delta * z, 0.5, 2.5));
  };

  const beginPan = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const start = { x: e.clientX, y: e.clientY, tx, ty };
    const onMove = (ev: MouseEvent) => {
      setTx(start.tx + (ev.clientX - start.x));
      setTy(start.ty + (ev.clientY - start.y));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  return { zoom, tx, ty, beginPan, zoomIn, zoomOut, reset, onWheel };
}

function GraphZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-30 inline-flex items-center bg-surface border border-border-subtle rounded-md shadow-card overflow-hidden">
      <ControlBtn onClick={onZoomOut} ariaLabel="Zoom out" disabled={zoom <= 0.5}>
        <ZoomOutIcon size={13} />
      </ControlBtn>
      <span className="px-2 h-7 inline-flex items-center text-[10px] font-mono tabular-nums text-muted border-x border-border-subtle">
        {Math.round(zoom * 100)}%
      </span>
      <ControlBtn onClick={onZoomIn} ariaLabel="Zoom in" disabled={zoom >= 2.5}>
        <ZoomInIcon size={13} />
      </ControlBtn>
      <span className="w-px h-7 bg-border-subtle" />
      <ControlBtn onClick={onReset} ariaLabel="Reset view">
        <Maximize2 size={12} />
      </ControlBtn>
    </div>
  );
}

function ControlBtn({
  children,
  onClick,
  ariaLabel,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className="w-8 h-7 inline-flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Suggested actions ──────────────────────────────────────────────────────
// Lives at the bottom of the timeline card. Replaces both the standalone
// "Next: Add to calendar" footer and the floating Recommended Actions blue
// card that used to overlay the impact graph.

interface QuickAction {
  id: string;
  label: React.ReactNode;
  suggestedId?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'q2',
    label: (
      <>Ask <span className="font-semibold underline decoration-1 underline-offset-2">Hannah</span> to launch an advocacy campaign supporting the bill before the June 10 vote</>
    ),
    suggestedId: 'hannah-win',
  },
];

function SuggestedActions() {
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  return (
    <div className="mt-8 pt-6 border-t border-border-subtle">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={14} className="text-accent" />
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
          Suggested Actions
        </h3>
      </div>
      <ul className="flex flex-col gap-4">
        {QUICK_ACTIONS.map((a) => (
          <li key={a.id} className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
            <p className="flex-1 text-[13px] leading-relaxed text-primary pr-2">{a.label}</p>
            <AssignDropdown
              assignedId={assigned[a.id]}
              onAssign={(m) => setAssigned((prev) => ({ ...prev, [a.id]: m.id }))}
              placement="top"
              align="right"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StanceFilterRow({
  value,
  onChange,
}: {
  value: 'all' | StanceTone;
  onChange: (v: 'all' | StanceTone) => void;
}) {
  const filters: Array<{ id: 'all' | StanceTone; label: string }> = [
    { id: 'all', label: 'ALL' },
    { id: 'supportive', label: 'SUPPORTIVE' },
    { id: 'opposed', label: 'OPPOSED' },
    { id: 'uncertain', label: 'UNCERTAIN' },
  ];
  return (
    <div className="inline-flex items-center gap-1 bg-page border border-border-subtle rounded-md p-1">
      {filters.map((f) => {
        const sel = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`px-3 h-7 text-[10px] font-mono tracking-[0.12em] rounded transition-colors ${
              sel ? 'bg-brand text-white' : 'text-muted hover:text-primary'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function StakeholderNode({
  node, left, top, focused, dimmed, onEnter, onLeave,
}: {
  node: NodeDef;
  left: number;
  top: number;
  focused: boolean;
  dimmed: boolean;
  index?: number;
  onEnter: (rect: { x: number; y: number; w: number; h: number }) => void;
  onLeave: () => void;
}) {
  const sizes: Record<Influence, { avatar: number; cls: string; icon: number }> = {
    high: { avatar: 60, cls: 'w-[60px] h-[60px] text-[14px]', icon: 20 },
    med:  { avatar: 50, cls: 'w-[50px] h-[50px] text-[12px]', icon: 16 },
    low:  { avatar: 40, cls: 'w-[40px] h-[40px] text-[11px]', icon: 14 },
  };
  const stanceMap: Record<StanceTone, { ring: string; bg: string; text: string; glow: string; label: string; chipText: string }> = {
    supportive: { ring: '#16A34A', bg: '#DCFCE7', text: '#15803D', glow: 'rgba(22,163,74,0.30)', label: 'SUPPORTIVE', chipText: '#15803D' },
    opposed:    { ring: '#EF4444', bg: '#FEE2E2', text: '#B91C1C', glow: 'rgba(239,68,68,0.30)', label: 'OPPOSED',    chipText: '#B91C1C' },
    uncertain:  { ring: '#F59E0B', bg: '#FEF3C7', text: '#B45309', glow: 'rgba(245,158,11,0.35)', label: 'UNCERTAIN',  chipText: '#B45309' },
  };
  // Policy hub overrides the stance palette — it's the bill itself, not a
  // stakeholder, so it gets the brand navy treatment to read as the center.
  const isHub = node.id === 'policy-hub';
  // Spotlight node — the stakeholder tied to the top suggested action. Gets
  // an extra accent-orange pulsing ring + a small "Suggested action" pill so
  // the eye lands on it as the answer to "where do we move first?"
  const isSpotlight = node.id === 'robinhood-foundation';
  const s = isHub
    ? { ring: '#02066F', bg: '#02066F', text: '#FFFFFF', glow: 'rgba(2,6,111,0.35)', label: 'POLICY', chipText: '#02066F' }
    : stanceMap[node.stance];
  const sz = sizes[node.influence];
  const inflLabel: Record<Influence, string> = { high: 'HIGH INFL.', med: 'MEDIUM INFL.', low: 'LOW INFL.' };
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onEnter({ x: r.left + r.width / 2, y: r.top, w: r.width, h: r.height });
  };

  return (
    <div
      ref={wrapRef}
      className={`absolute ${dimmed ? 'cc-node-dim' : ''} ${focused ? 'cc-node-focus' : '-translate-x-1/2 -translate-y-1/2'}`}
      style={{ left, top, zIndex: focused ? 20 : 5, transition: 'opacity .25s, filter .25s' }}
      onMouseEnter={handleEnter}
      onMouseLeave={onLeave}
    >
      <Link to={node.href} className="flex flex-col items-center no-underline">
        {/* Avatar wrapper — its own positioning context so the influence ring
            stays concentric with the disc (not pulled down toward the name
            label, which is a sibling). */}
        <div className="relative flex items-center justify-center">
          {/* Influence ring — a single soft halo per stance, plus an animated
              pulse on focus/uncertain. Sized off the avatar radius (sz.avatar)
              so it sits a consistent ~6px outside the disc edge for every
              influence tier. */}
          <svg
            width={sz.avatar + 24}
            height={sz.avatar + 24}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            <circle
              cx={(sz.avatar + 24) / 2}
              cy={(sz.avatar + 24) / 2}
              r={sz.avatar / 2 + 6}
              fill="none"
              stroke={s.ring}
              strokeOpacity={focused ? 0.45 : 0.22}
              strokeWidth={1.25}
            />
            {(focused || node.stance === 'uncertain' || isSpotlight) && (
              <circle
                cx={(sz.avatar + 24) / 2}
                cy={(sz.avatar + 24) / 2}
                r={sz.avatar / 2 + 6}
                fill="none"
                stroke={isSpotlight ? '#ED4B00' : s.ring}
                strokeOpacity={isSpotlight ? '0.7' : '0.55'}
                strokeWidth={1.25}
                className="cc-ring-pulse"
              />
            )}
            {isSpotlight && (
              <circle
                cx={(sz.avatar + 24) / 2}
                cy={(sz.avatar + 24) / 2}
                r={sz.avatar / 2 + 11}
                fill="none"
                stroke="#ED4B00"
                strokeOpacity="0.55"
                strokeWidth={1.5}
                className="cc-ring-pulse"
                style={{ animationDelay: '1.7s' }}
              />
            )}
          </svg>

          <span
            className={`relative ${sz.cls} rounded-full flex items-center justify-center font-bold`}
            style={{
              border: `2px solid ${s.ring}`,
              background: s.bg,
              color: s.text,
              boxShadow: focused
                ? `0 0 0 2px ${s.ring}33, 0 8px 22px ${s.glow}`
                : `0 0 14px ${s.glow}`,
            }}
          >
            {node.icon === 'building' && <Building2 size={sz.icon} strokeWidth={2.2} />}
            {node.icon === 'dollar'   && <DollarSign size={sz.icon} strokeWidth={2.4} />}
            {node.initials && <span>{node.initials}</span>}
          </span>
        </div>

        <div className={`mt-2 px-2.5 py-1.5 rounded-md bg-surface border ${isSpotlight ? 'border-accent/50' : 'border-border-subtle'} shadow-card min-w-[150px] text-center`}>
          <p className="text-[11px] font-semibold text-primary leading-tight">{node.name}</p>
          {isHub ? (
            <p className="mt-1 text-[9px] font-mono tracking-[0.1em] text-muted">
              FLOOR VOTE · JUN 10
            </p>
          ) : (
            <p className="mt-1 text-[9px] font-mono tracking-[0.1em] flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full" style={{ background: s.ring }} />
                <span style={{ color: s.chipText }}>{s.label}</span>
              </span>
              <span className="text-muted/40">·</span>
              <span className="text-muted">{inflLabel[node.influence]}</span>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

function HoverPopover({ hover, board }: { hover: HoverState | null; board: BoardId }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 340, h: 220 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
  }, [hover?.id, board]);

  if (!hover) return null;

  const detail = hover.detail;
  const PAD = 14;
  const W = 340;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const placeAbove = hover.rect.y - PAD - box.h > 8;
  const top = placeAbove ? hover.rect.y - box.h - PAD : hover.rect.y + hover.rect.h + PAD;
  let left = hover.rect.x - W / 2;
  left = Math.max(12, Math.min(vw - W - 12, left));
  const arrowLeft = hover.rect.x - left;
  const accent = detail.accent ?? '#02066F';

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none cc-popover-anim"
      style={{ left, top, width: W, zIndex: 100 }}
    >
      <div
        className="rounded-lg bg-surface border border-border-subtle p-4"
        style={{
          boxShadow: '0 18px 48px -12px rgba(2, 6, 111, 0.20), 0 4px 14px -4px rgba(2, 0, 53, 0.12)',
          borderTop: `3px solid ${accent}`,
        }}
      >
        <h4 className="text-[15px] font-bold text-primary leading-snug">{detail.title}</h4>
        {detail.meta && (
          <p className="mt-1 text-[10px] font-mono tracking-[0.1em] text-muted">{detail.meta}</p>
        )}
        <p className="mt-2.5 text-[12.5px] text-primary/85 leading-relaxed">{detail.body}</p>

        {/* Suggested action takes precedence over the generic Opportunity
            callout — when a node has a concrete next step it should read as
            an action, not an observation. */}
        {detail.action ? (
          <div className="mt-3 rounded-md border border-accent/40 bg-accent/10 p-2.5">
            <p className="text-[9px] font-mono tracking-[0.16em] text-accent uppercase">Suggested action</p>
            <p className="mt-1 text-[12px] text-primary leading-snug">{detail.action}</p>
          </div>
        ) : detail.opportunity && (
          <div className="mt-3 rounded-md border border-success/30 bg-success-soft/60 p-2.5">
            <p className="text-[9px] font-mono tracking-[0.16em] text-success uppercase">Opportunity</p>
            <p className="mt-1 text-[12px] text-primary leading-snug">{detail.opportunity}</p>
          </div>
        )}
      </div>

      <div
        className="absolute"
        style={{
          left: arrowLeft - 8,
          [placeAbove ? 'bottom' : 'top']: -7,
          width: 16,
          height: 16,
          transform: placeAbove ? 'rotate(45deg)' : 'rotate(225deg)',
          background: '#FFFFFF',
          borderRight: '1px solid #E0E0E4',
          borderBottom: '1px solid #E0E0E4',
        } as React.CSSProperties}
      />
    </div>
  );
}

// ── POLICY BOARD (impact radar — simplified placeholder) ─────────────────

// Related policies that orbit the NYC Food Expansion Act. The board reads
// like a radar of nearby legislation that touches the same mission area —
// state SNAP reform, city emergency food funding, and a state-level food
// bank tax credit. Three nodes is enough to show context without crowding.
const POLICY_ITEMS: Array<{
  id: string;
  ring: 1 | 2 | 3;
  angle: number;
  tone: 'info' | 'success' | 'danger' | 'funder';
  label: string;
  meta: string;
}> = [
  { id: 'state-snap',         ring: 2, angle: 30,  tone: 'success', label: 'State SNAP Eligibility Reform',  meta: 'In committee · 78% relevance' },
  { id: 'city-emergency-food', ring: 2, angle: 150, tone: 'funder',  label: 'City Emergency Food Aid Funding', meta: 'Passed · RFP closes May 15' },
  { id: 'food-bank-credit',   ring: 3, angle: 270, tone: 'info',    label: 'State Food Bank Tax Credit',     meta: 'Proposed · Q3 2026' },
];

const POLICY_TONE_COLOR: Record<'info' | 'success' | 'danger' | 'funder', string> = {
  info: '#02066F',
  success: '#16A34A',
  danger: '#EF4444',
  funder: '#ED4B00',
};

const POLICY_DETAILS: Record<string, HoverDetail> = {
  'state-snap': {
    category: 'POLICY',
    title: 'State SNAP Eligibility Reform',
    meta: 'State · Albany · In committee',
    body: 'Would extend SNAP eligibility statewide — overlaps directly with our Bronx and Brooklyn service areas and amplifies the city-level expansion if both pass.',
    opportunity: 'Coordinate testimony with state advocates so the city and state expansions reinforce each other.',
  },
  'city-emergency-food': {
    category: 'POLICY',
    title: 'City Emergency Food Aid Funding',
    meta: 'City · Passed · Effective immediately',
    body: 'Already-passed emergency funding package. Up to $250K available per qualified org for direct food assistance services. Application window closes May 15.',
    opportunity: 'Apply before May 15 — overlaps with the same coverage areas the Food Expansion Act would unlock.',
  },
  'food-bank-credit': {
    category: 'POLICY',
    title: 'State Food Bank Tax Credit',
    meta: 'State · Proposed · Q3 2026',
    body: 'Revised tax credit structure to incentivize investment in community food banks. Aligned with the Food Expansion Act\'s neighborhood priorities.',
    opportunity: 'Brief leadership before the comment period closes; tax credit could fund expansion-era growth.',
  },
};

function PolicyBoard({
  hoverId,
  onHover,
}: {
  hoverId: string | null;
  onHover: (h: HoverState | null) => void;
}) {
  const [boardRef, size] = useElementSize();
  const cx = size.w / 2;
  const cy = size.h / 2;
  const minDim = Math.min(size.w, size.h);
  const ringR = [minDim * 0.18, minDim * 0.32, minDim * 0.44];

  const itemPos = (it: typeof POLICY_ITEMS[number]) => {
    const r = ringR[it.ring - 1];
    const a = (it.angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const ringMeta = [
    { label: 'FUNDING' },
    { label: 'LIFECYCLE' },
    { label: 'RISK / OPP' },
  ];

  return (
    <div className="relative rounded-md bg-page border border-border-subtle overflow-hidden">
      <div
        ref={boardRef}
        className="relative w-full h-[620px]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D6D6DC 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <radialGradient id="cc-nucleus-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(237,75,0,0.16)" />
              <stop offset="60%"  stopColor="rgba(237,75,0,0.04)" />
              <stop offset="100%" stopColor="rgba(237,75,0,0)" />
            </radialGradient>
            <linearGradient id="cc-sweep-grad" x1="0" x2="1">
              <stop offset="0%"   stopColor="rgba(237,75,0,0)" />
              <stop offset="100%" stopColor="rgba(237,75,0,0.32)" />
            </linearGradient>
          </defs>

          <circle cx={cx} cy={cy} r={ringR[2] + 60} fill="url(#cc-nucleus-grad)" />

          {ringR.map((r, i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D8D7DD" strokeOpacity="0.7" />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D8D7DD" strokeOpacity="0.35" strokeDasharray="2 5" />
              <text x={cx + r + 6} y={cy - 4} fill="#9A9BB0" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
                {ringMeta[i].label}
              </text>
            </g>
          ))}

          {/* crosshairs */}
          <line x1={cx - ringR[2] - 30} y1={cy} x2={cx + ringR[2] + 30} y2={cy} stroke="#E0E0E4" strokeDasharray="1 6" />
          <line x1={cx} y1={cy - ringR[2] - 30} x2={cx} y2={cy + ringR[2] + 30} stroke="#E0E0E4" strokeDasharray="1 6" />

          {/* sweep wedge — rotates around center */}
          <g style={{ transformOrigin: `${cx}px ${cy}px` }} className="cc-radar-sweep">
            <path
              d={`M ${cx} ${cy} L ${cx + ringR[2] + 40} ${cy} A ${ringR[2] + 40} ${ringR[2] + 40} 0 0 1 ${
                cx + Math.cos(-Math.PI / 4) * (ringR[2] + 40)
              } ${cy + Math.sin(-Math.PI / 4) * (ringR[2] + 40)} Z`}
              fill="url(#cc-sweep-grad)"
            />
          </g>

          {/* spokes from nucleus to satellite items */}
          {POLICY_ITEMS.map((it) => {
            const p = itemPos(it);
            const focused = hoverId === it.id;
            const dimmed = !!hoverId && !focused;
            const c = POLICY_TONE_COLOR[it.tone];
            return (
              <g key={`spoke-${it.id}`} style={{ opacity: dimmed ? 0.2 : 1, transition: 'opacity .25s' }}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke={c}
                  strokeOpacity={focused ? 0.7 : 0.28}
                  strokeWidth={focused ? 1.6 : 1}
                  className="cc-string-slow"
                />
              </g>
            );
          })}
        </svg>

        {/* center policy card */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[260px] rounded-lg bg-surface border border-border-subtle px-5 py-4 text-center shadow-elevated"
          style={{ left: cx, top: cy, zIndex: 5 }}
        >
          <p className="text-[10px] font-mono tracking-[0.18em] text-accent uppercase">● Active Policy</p>
          <h3 className="mt-2 text-[18px] font-bold text-primary leading-tight">NYC Food Expansion Act</h3>
          <p className="mt-2 text-[10px] font-mono tracking-[0.14em] text-muted">NYC · Citywide · Floor vote Jun 10</p>
        </div>

        {POLICY_ITEMS.map((it) => {
          const { x, y } = itemPos(it);
          const focused = hoverId === it.id;
          const dim = !!hoverId && !focused;
          return (
            <RadarChip
              key={it.id}
              id={it.id}
              label={it.label}
              meta={it.meta}
              tone={it.tone}
              left={x}
              top={y}
              focused={focused}
              dimmed={dim}
              detail={POLICY_DETAILS[it.id]}
              onHover={onHover}
            />
          );
        })}
      </div>
    </div>
  );
}

function RadarChip({
  id, label, meta, tone, left, top, focused, dimmed, detail, onHover,
}: {
  id: string;
  label: string;
  meta: string;
  tone: 'info' | 'success' | 'danger' | 'funder';
  left: number;
  top: number;
  focused: boolean;
  dimmed: boolean;
  detail?: HoverDetail;
  onHover: (h: HoverState | null) => void;
}) {
  const toneStyles = {
    info:    { ring: '#02066F', chip: '#E6E7F2', text: '#02066F' },
    success: { ring: '#16A34A', chip: '#DCFCE7', text: '#15803D' },
    danger:  { ring: '#EF4444', chip: '#FEE2E2', text: '#B91C1C' },
    funder:  { ring: '#ED4B00', chip: '#FCE3D6', text: '#C53E00' },
  };
  const t = toneStyles[tone];
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    const el = wrapRef.current;
    if (!el || !detail) return;
    const r = el.getBoundingClientRect();
    onHover({ id, detail: { ...detail, accent: t.ring }, rect: { x: r.left + r.width / 2, y: r.top, w: r.width, h: r.height } });
  };

  return (
    <div
      ref={wrapRef}
      className={`absolute ${dimmed ? 'cc-node-dim' : ''} ${focused ? 'cc-node-focus' : '-translate-x-1/2 -translate-y-1/2'}`}
      style={{ left, top, zIndex: focused ? 20 : 6 }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-default shadow-card bg-surface"
        style={{ border: `1px solid ${t.ring}${focused ? '66' : '33'}`, minWidth: 156 }}
      >
        <span
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: t.chip, color: t.text }}
        >
          {tone === 'danger' ? <AlertTriangle size={13} /> : tone === 'funder' ? <DollarSign size={13} /> : <TargetIcon size={13} />}
        </span>
        <div className="text-left">
          <p className="text-[12px] font-semibold text-primary leading-tight">{label}</p>
          <p className="text-[10px] font-mono text-muted leading-tight mt-0.5">{meta}</p>
        </div>
      </div>
    </div>
  );
}

// ── PEERS BOARD (peer orgs aligned with this policy) ─────────────────────

// Peer organizations relevant to the Food Expansion Act. Two buckets:
//   PARTNER     — already in coalition with us on this bill
//   OPPORTUNITY — adjacent orgs worth reaching out to
type PeerRelationship = 'PARTNER' | 'OPPORTUNITY';

interface ActionCard {
  id: string;
  team: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
  lead: string;
  body: string;
  priority: PeerRelationship;
  due: string;
  x: number; // % within canvas
  y: number;
  detail: HoverDetail;
}

const PRIORITY_STYLES: Record<PeerRelationship, { text: string; bg: string }> = {
  PARTNER:     { text: '#15803D', bg: '#DCFCE7' },
  OPPORTUNITY: { text: '#02066F', bg: '#E6E7F2' },
};

const ACTION_CARDS: ActionCard[] = [
  {
    id: 'bronx-food',
    team: 'Bronx Food Collective',
    initials: 'BFC',
    initialsBg: '#DCFCE7',
    initialsText: '#15803D',
    lead: 'Bronx, NY · 35 staff',
    body: 'Co-signed the coalition letter and is running a parallel advocacy push. Their emergency-aid creative is outperforming sector by 230%.',
    priority: 'PARTNER',
    due: 'CO-SIGNED LETTER',
    x: 22, y: 30,
    detail: {
      category: 'PEERS',
      title: 'Bronx Food Collective',
      meta: 'Coalition partner · Bronx, NY',
      body: 'Already co-signed the coalition letter backing the bill. Coordinating joint testimony and amplifying messaging across overlapping service areas.',
      opportunity: 'Borrow their winning emergency-aid creative for our own advocacy posts.',
    },
  },
  {
    id: 'food-policy-alliance',
    team: 'NYC Food Policy Alliance',
    initials: 'FPA',
    initialsBg: '#DCFCE7',
    initialsText: '#15803D',
    lead: 'Citywide · 40+ member orgs',
    body: 'Coalition of 40+ food access organizations across NYC. Coordinating joint testimony and grassroots mobilization for the June 10 hearing.',
    priority: 'PARTNER',
    due: 'JOINT TESTIMONY',
    x: 65, y: 22,
    detail: {
      category: 'PEERS',
      title: 'NYC Food Policy Alliance',
      meta: 'Coalition partner · Citywide',
      body: 'The hub coalition aligning food-access orgs around the bill. They are the primary channel for coordinating shared talking points and testimony slots.',
      opportunity: 'Share Provide Food NYC service-area data so the coalition\'s testimony cites our footprint.',
    },
  },
  {
    id: 'queens-food',
    team: 'Queens Food Resource Center',
    initials: 'QFR',
    initialsBg: '#E6E7F2',
    initialsText: '#02066F',
    lead: 'Queens, NY · 18 staff',
    body: 'Runs SNAP enrollment navigation in Queens. Hasn\'t weighed in on the bill yet — adding their voice would strengthen the coalition\'s Queens coverage.',
    priority: 'OPPORTUNITY',
    due: 'NOT ENGAGED',
    x: 30, y: 70,
    detail: {
      category: 'PEERS',
      title: 'Queens Food Resource Center',
      meta: 'Worth reaching out · Queens, NY',
      body: 'Mission-aligned org with deep Queens reach but no public stance on the bill yet. A short outreach call could bring them into the coalition before the floor vote.',
      opportunity: 'Send a one-page bill brief and propose joint Queens-focused testimony.',
    },
  },
  {
    id: 'east-river',
    team: 'East River Food Collaborative',
    initials: 'ERF',
    initialsBg: '#E6E7F2',
    initialsText: '#02066F',
    lead: 'Lower East Side · 40 staff',
    body: 'Operates community kitchens in newly-eligible LES corridors. A natural ally on the expansion — currently focused on the food-hub zoning proposal.',
    priority: 'OPPORTUNITY',
    due: 'POTENTIAL ALLY',
    x: 72, y: 70,
    detail: {
      category: 'PEERS',
      title: 'East River Food Collaborative',
      meta: 'Worth reaching out · Lower East Side',
      body: 'Their LES kitchen footprint sits inside the bill\'s newly-eligible zones. Coalition reinforcement is straightforward — same neighborhoods, same population.',
      opportunity: 'Invite to co-sign a joint testimony letter centered on LES coverage.',
    },
  },
];

function PeersBoard({
  hoverId,
  onHover,
}: {
  hoverId: string | null;
  onHover: (h: HoverState | null) => void;
}) {
  const indexed = useMemo(() => Object.fromEntries(ACTION_CARDS.map((c) => [c.id, c])), []);
  const [boardRef, size] = useElementSize();
  const pos = (id: string) => {
    const c = indexed[id];
    return { x: (c.x / 100) * size.w, y: (c.y / 100) * size.h };
  };

  return (
    <div className="relative rounded-md bg-page border border-border-subtle overflow-hidden">
      <div
        ref={boardRef}
        className="relative w-full h-[620px]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D6D6DC 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {ACTION_CARDS.map((c) => {
            const focused = hoverId === c.id;
            const dim = !!hoverId && !focused;
            const { x, y } = pos(c.id);
            return (
              <ActionCardNode
                key={c.id}
                card={c}
                left={x}
                top={y}
                focused={focused}
                dimmed={dim}
                onHover={onHover}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActionCardNode({
  card, left, top, focused, dimmed, onHover,
}: {
  card: ActionCard;
  left: number;
  top: number;
  focused: boolean;
  dimmed: boolean;
  onHover: (h: HoverState | null) => void;
}) {
  const p = PRIORITY_STYLES[card.priority];
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onHover({
      id: card.id,
      detail: { ...card.detail, accent: p.text },
      rect: { x: r.left + r.width / 2, y: r.top, w: r.width, h: r.height },
    });
  };

  return (
    <div
      ref={wrapRef}
      className={`absolute w-[260px] ${dimmed ? 'cc-node-dim' : ''} ${focused ? 'cc-node-focus' : '-translate-x-1/2 -translate-y-1/2'}`}
      style={{ left, top, zIndex: focused ? 20 : 5 }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className="rounded-md bg-surface p-4 shadow-card cursor-default transition-colors"
        style={{
          border: focused ? `1px solid ${p.text}` : '1px solid #E0E0E4',
          boxShadow: focused ? `0 12px 30px rgba(2,0,53,0.10), 0 0 0 1px ${p.text}33` : undefined,
          borderLeft: `3px solid ${p.text}`,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold tracking-wider shrink-0"
              style={{ background: card.initialsBg, color: card.initialsText }}
            >
              {card.initials}
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-primary leading-tight">{card.team}</p>
              <p className="text-[10px] font-mono text-muted mt-0.5">{card.lead}</p>
            </div>
          </div>
          <span
            className="px-1.5 h-5 inline-flex items-center text-[9px] font-mono font-semibold tracking-[0.1em] rounded shrink-0"
            style={{ background: p.bg, color: p.text }}
          >
            {card.priority}
          </span>
        </div>
        <p className="text-[12px] text-primary/85 leading-snug mb-3">{card.body}</p>
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-[10px] font-mono tracking-[0.12em] text-muted">{card.due}</p>
        </div>
      </div>
    </div>
  );
}

