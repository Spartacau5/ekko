import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../lib/motion';
import {
  ArrowLeft,
  Star,
  Plus,
  Sparkles,
  Search as SearchIcon,
  ChevronDown,
  ChevronRight,
  Flag,
  AlertTriangle,
  Check,
  Lightbulb,
  User as UserIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Filter as FilterIcon,
  Building2,
  DollarSign,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2,
} from 'lucide-react';
import { policies, Policy } from '../data/policies';
import { notesForEntity } from '../data/notes';
import { useToast, InternalNotePreview, Button, ComposeNoteModal, FollowUpComposer, AssignDropdown } from '../components/ui';
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
        <p>
          The NYC Food Expansion Act would extend emergency food assistance eligibility to an
          additional <strong>85,000 residents</strong> across Brooklyn, Queens, and the Bronx. For
          Provide Food NYC, this directly expands our addressable service area by approximately
          <strong> 40%</strong>, with the strongest overlap in Brownsville and East New York —
          neighborhoods where we already operate 3 community kitchen partnerships.
        </p>
        <p className="mt-3">
          If passed, this opens eligibility for two new city contract funding streams (estimated
          <strong> $200K–$400K annually</strong>) and strengthens our position in the Robin Hood
          Foundation Q3 grant cycle.
        </p>
        <RiskAlert
          label="Immediate risk"
          body="If the opposition amendment passes, eligibility zones would exclude our Bronx service corridor."
        />
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

  const linkedNotes = useMemo(() => (policy ? notesForEntity('policy', policy.id) : []), [policy?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Policy not found.</p>
        <Link to="/policy" className="text-primary underline mt-2 inline-block">Back to policy</Link>
      </div>
    );
  }

  const relatedPolicies = (policy.relatedPolicyIds ?? [])
    .map((pid) => policies.find((p) => p.id === pid))
    .filter((p): p is Policy => Boolean(p))
    .slice(0, 2);

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
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="inline-flex items-center px-2.5 h-[24px] text-[11px] font-medium leading-none rounded-full bg-danger-soft text-danger">
            Urgent
          </span>
          <PriorityMenu value={priority} onChange={setPriority} />
        </div>

        <h1 className="page-title mb-5">{policy.title}</h1>

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

      {/* TIMELINE */}
      <section className="bg-surface border border-border-subtle rounded-lg p-7 mb-6 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="section-title">Policy Timeline</h2>
            <p className="text-[12px] text-muted mt-0.5">Recent changes, hearings, and milestones</p>
          </div>
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-end px-3 py-2 rounded-md bg-brand/5 border border-brand/15">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Time Left</span>
              <span className="text-[13px] font-semibold text-brand mt-0.5">5 months</span>
            </div>
          </div>
        </div>

        <PolicyTimeline events={policy.timeline} />

        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <p className="text-[13px] text-primary">
              <span className="font-semibold">Next:</span> Council Committee Hearing —{' '}
              <span className="text-muted">June 10, 2026</span>
            </p>
          </div>
          <Button variant="secondary" size="sm">Add to calendar</Button>
        </div>
      </section>

      {/* HOW DOES THIS AFFECT US — command-center centerpiece */}
      <section className="mb-6">
        <div className="mb-4">
          <h2 className="section-title">How does this affect us?</h2>
          <p className="text-[14px] text-muted leading-relaxed mt-1 max-w-3xl">
            {policy.summary}
          </p>
        </div>
        <CommandCenter />
      </section>

      {/* RELATED POLICIES + INTERNAL DISCUSSION — side-by-side */}
      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        {/* RELATED POLICIES */}
        <section className="lg:col-span-2 bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
          <div className="px-6 pt-6 pb-4">
            <h2 className="section-title">Related Policies</h2>
            <p className="text-[12px] text-muted mt-0.5">Other movements that touch our service area</p>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-4 flex-1">
            <RelatedPolicyCard
              title="State Food Assistance Expansion"
              relevance={78}
              blurb="Proposed additional SNAP funding for emergency food providers."
              status="In committee"
              href={relatedPolicies[0] ? `/policy/${relatedPolicies[0].id}` : undefined}
            />
            <RelatedPolicyCard
              title="Federal Nutrition Program Reauthorization"
              relevance={65}
              blurb="USDA block grant restructuring could affect city-level funding."
              status="Proposed"
              href={relatedPolicies[1] ? `/policy/${relatedPolicies[1].id}` : undefined}
            />
          </div>
        </section>

        {/* INTERNAL DISCUSSION */}
        <section className="lg:col-span-3 bg-surface border border-border-subtle rounded-lg shadow-card flex flex-col">
          <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">Internal Discussion</h2>
              <p className="text-[12px] text-muted mt-0.5">Notes from the team</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setNoteOpen(true)}>
              <Plus size={13} className="mr-1" /> Add Note
            </Button>
          </div>
          <div className="px-6 pb-6 flex-1">
            {linkedNotes.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                {linkedNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)}
              </div>
            ) : (
              <div className="space-y-3">
                <DiscussionNote
                  author="Sofia Reyes"
                  role="Executive Director"
                  date="Apr 15, 2026"
                  body="Briefed board on potential impact. Leah to prep donor talking points by next week."
                />
                <DiscussionNote
                  author="Noah Stein"
                  role="Policy Lead"
                  date="Apr 10, 2026"
                  body="Committee staff confirmed June 10 vote date. Opposition amendment sponsor is Councilmember Torres — scheduling meeting."
                />
              </div>
            )}
          </div>
        </section>
      </div>

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

function RiskAlert({ label, body }: { label: string; body: string }) {
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-3 rounded-md border-l-[3px] border-l-danger bg-danger-soft/60 border border-danger/20 px-4 py-3"
    >
      <AlertTriangle size={16} className="text-danger mt-0.5 shrink-0" />
      <div className="text-[13px] leading-relaxed text-primary/90">
        <span className="font-semibold text-danger">{label}: </span>
        <span>{body}</span>
      </div>
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
  type Step = { date: string; title: string; subtitle: string; state: 'done' | 'current' | 'future'; progress?: number };
  const steps: Step[] = [
    { date: 'Jan 12', title: 'Policy Identified',          subtitle: 'Flagged by monitoring system', state: 'done' },
    { date: 'Feb 20', title: 'Impact Assessment',          subtitle: 'Scored: High Opportunity',     state: 'done' },
    { date: 'Mar 15', title: 'Council Committee Hearing',  subtitle: 'Public Testimony Phase',        state: 'current' },
    { date: 'May 1',  title: 'Coalition Agreement',        subtitle: 'Partners confirmed positions', state: 'future' },
    { date: 'Jun 10', title: 'Council Floor Vote',         subtitle: 'Passed committee, awaiting full vote', state: 'future' },
    { date: 'Sep 1',  title: 'Implementation Begins',      subtitle: 'New eligibility zones go live', state: 'future', progress: 18 },
  ];

  return (
    <div className="relative pt-4 pb-2 min-h-[280px]">
      <div className="grid grid-cols-6 gap-2 relative">
        {/* Connecting line — runs behind the dots. */}
        <div className="absolute left-[8.33%] right-[8.33%] top-[42px] h-[2px] bg-border-subtle" aria-hidden="true">
          <div className="h-full bg-brand" style={{ width: '40%' }} />
        </div>

        {steps.map((s, i) => {
          const isImpact = s.date === 'Feb 20';
          return (
            <div
              key={i}
              className={`flex flex-col items-center text-center relative ${isImpact ? 'group cursor-default' : ''}`}
            >
              {/* Date label */}
              <span
                className={`text-[12px] font-semibold mb-2 ${
                  s.state === 'future' ? 'text-muted' : 'text-brand'
                }`}
              >
                {s.date}
              </span>

              {/* Dot */}
              <TimelineDot state={s.state} progress={s.progress} />

              {/* Title + subtitle */}
              <p className="mt-3 text-[12px] font-semibold text-primary leading-tight px-1">
                {s.title}
              </p>
              <p className="mt-1 text-[11px] text-muted leading-tight px-1">{s.subtitle}</p>

              {/* Annotation flags — keyed off date so they appear under the right step */}
              {s.date === 'Feb 20' && (
                <TimelineFlag color="success" label="Jan 12" body="ED briefed board on policy implications" />
              )}
              {s.date === 'Jun 10' && (
                <TimelineFlag color="danger" label="Feb 20" prefix="Risk Alert" body="Opposition amendment introduced" />
              )}

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

function TimelineDot({ state, progress }: { state: 'done' | 'current' | 'future'; progress?: number }) {
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

function TimelineFlag({
  color,
  label,
  prefix,
  body,
}: {
  color: 'success' | 'danger';
  label: string;
  prefix?: string;
  body: string;
}) {
  const tone = color === 'danger' ? 'text-danger' : 'text-success';
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[140px] w-[170px] flex flex-col items-center pointer-events-none">
      {/* short connector tying the flag back to the timeline column */}
      <span className="w-px h-5 bg-border-subtle" aria-hidden="true" />
      <Flag size={14} className={`${tone} fill-current mt-1`} />
      <p className="text-[11px] font-semibold text-primary mt-2">{label}</p>
      {prefix && <p className={`text-[11px] font-semibold ${tone}`}>{prefix}</p>}
      <p className="text-[11px] text-muted leading-tight mt-0.5 px-1">{body}</p>
    </div>
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
        <p className="flex-1 text-[12px] text-primary leading-snug">
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
    <div className="flex flex-col items-center text-center">
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

const BOARD_TABS: Array<{ id: BoardId; label: string; sub: string; icon: React.ReactNode }> = [
  { id: 'people', label: 'People',  sub: 'EXTERNAL STAKEHOLDERS · 6', icon: <UserIcon size={14} /> },
  { id: 'policy', label: 'Policy',  sub: 'IMPACT RADAR · 11',         icon: <TargetIcon size={14} /> },
  { id: 'peers',  label: 'Peers',   sub: 'INTERNAL TEAM ACTIONS · 5', icon: <UsersIcon size={14} /> },
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
        {/* TAB BAR */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3 flex-wrap border-b border-border-subtle">
          <div className="flex items-center gap-2">
            {BOARD_TABS.map((t) => {
              const active = board === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBoard(t.id)}
                  className={`flex items-center gap-2.5 h-12 px-3.5 rounded-md border transition-colors ${
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
                  <span className="flex flex-col items-start leading-tight text-left">
                    <span className={`text-[13px] font-semibold ${active ? 'text-brand' : 'text-primary'}`}>
                      {t.label}
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.1em] text-muted">{t.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md border border-border-subtle bg-surface text-[12px]">
            <FilterIcon size={13} className="text-muted" />
            <span className="font-mono uppercase tracking-[0.12em] text-muted text-[10px]">Layer</span>
            <span className="text-muted/60">·</span>
            <span className="text-primary font-medium">All connections</span>
          </div>
        </div>

        {/* BODY: 2-column with right sidebar */}
        <div className="grid grid-cols-12 gap-4 px-5 pb-5">
          <div className="col-span-12 lg:col-span-9">
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
                    onStanceFilter={setStanceFilter}
                  />
                )}
                {board === 'policy' && <PolicyBoard hoverId={hover?.id ?? null} onHover={setHover} />}
                {board === 'peers'  && <PeersBoard  hoverId={hover?.id ?? null} onHover={setHover} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
            <SidebarHint />
            <SidebarLegend />
            <SidebarCaseFile />
          </div>
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
  {
    id: 'nyc-council-housing',
    name: 'NYC Council Housing Committee',
    icon: 'building',
    stance: 'supportive',
    influence: 'high',
    x: 50, y: 22,
    href: '/peers/nyc-council-housing',
    detail: {
      category: 'PEOPLE',
      title: 'NYC Council Housing Committee',
      meta: 'Government · Supportive · High influence',
      body: 'Chaired by Councilmember Davis. Voted yes in committee 7–2. Authored the original eligibility expansion clause.',
      opportunity: 'Request meeting to discuss Provide Food NYC\'s testimony for the June 10 floor vote.',
      action: 'No prior relationship — Noah Stein to initiate outreach.',
    },
  },
  {
    id: 'tenant-rights-coalition',
    name: 'Tenant Rights Coalition',
    initials: 'TR',
    stance: 'supportive',
    influence: 'med',
    x: 22, y: 45,
    href: '/peers/tenant-rights-coalition',
    detail: {
      category: 'PEOPLE',
      title: 'Tenant Rights Coalition',
      meta: 'Coalition partner · Supportive · Medium influence',
      body: 'Co-signed the open letter advocating expanded eligibility zones. Active in Brooklyn and Bronx.',
      opportunity: 'Joint testimony slot available for the June 10 floor vote.',
      action: 'Hannah Win to align messaging on shared talking points.',
    },
  },
  {
    id: 'property-owners-assoc',
    name: 'Property Owners Association',
    initials: 'PO',
    stance: 'opposed',
    influence: 'high',
    x: 80, y: 42,
    href: '/peers/property-owners-assoc',
    detail: {
      category: 'PEOPLE',
      title: 'Property Owners Association',
      meta: 'Industry group · Opposed · High influence',
      body: 'Sponsored the opposition amendment that narrows the geographic scope to exclude Bronx corridors.',
      opportunity: 'Counter-narrative needed before floor vote.',
      action: 'Devon Kim to draft response brief; Sofia Reyes to brief board.',
    },
  },
  {
    id: 'city-comptroller',
    name: "City Comptroller's Office",
    icon: 'dollar',
    stance: 'uncertain',
    influence: 'high',
    x: 22, y: 72,
    href: '/peers/city-comptroller',
    detail: {
      category: 'PEOPLE',
      title: "City Comptroller's Office",
      meta: 'Government · Uncertain · High influence',
      body: 'Reviewing fiscal impact analysis. Position depends on FY2027 budget projections.',
      opportunity: 'Provide impact data showing program ROI in current zones.',
      action: 'Aisha Park to package service-area outcome data this week.',
    },
  },
  {
    id: 'robinhood-foundation',
    name: 'RobinHood Foundation',
    icon: 'dollar',
    stance: 'supportive',
    influence: 'med',
    x: 50, y: 80,
    href: '/peers/robinhood-foundation',
    detail: {
      category: 'PEOPLE',
      title: 'RobinHood Foundation',
      meta: 'Funder · Current grant: $120K across 2 active grants',
      body: '2026 priority areas include expanded eligibility zones. 84% overlap with your updated service map. Q3 supplemental window opens July 1.',
      opportunity: 'Position for Q3 supplemental grant. Window opens July 1.',
      benchmark: {
        coverageLabel: 'Your coverage overlap',
        coveragePct: 84,
        peerLabel: 'Peer benchmark · Bronx Food Collective',
        peerValue: '$95K supplemental (2025)',
      },
      action: 'Leah Kim to draft impact memo connecting expanded zones to existing program outcomes.',
    },
  },
  {
    id: 'bronx-housing-justice',
    name: 'Bronx Housing Justice Network',
    initials: 'BX',
    stance: 'opposed',
    influence: 'low',
    x: 80, y: 72,
    href: '/peers/bronx-housing-justice',
    detail: {
      category: 'PEOPLE',
      title: 'Bronx Housing Justice Network',
      meta: 'Advocacy group · Opposed · Low influence',
      body: 'Concerned the bill diverts attention from housing justice priorities. Aligned with Property Owners on amendment.',
      opportunity: 'Listen + share program outcomes data; common ground on Bronx coverage.',
      action: 'Programs team to attend their May community forum.',
    },
  },
];

type EdgeKind = 'advocacy' | 'opposition' | 'funding' | 'information';
const EDGE_COLOR: Record<EdgeKind, string> = {
  advocacy: '#22C55E',
  opposition: '#EF4444',
  funding: '#F59E0B',
  information: '#22D3EE',
};

const PEOPLE_EDGES: Array<{ from: string; to: string; kind: EdgeKind }> = [
  { from: 'tenant-rights-coalition',  to: 'nyc-council-housing',    kind: 'advocacy' },
  { from: 'property-owners-assoc',    to: 'nyc-council-housing',    kind: 'opposition' },
  { from: 'city-comptroller',         to: 'robinhood-foundation',   kind: 'funding' },
  { from: 'property-owners-assoc',    to: 'bronx-housing-justice',  kind: 'advocacy' },
  { from: 'tenant-rights-coalition',  to: 'city-comptroller',       kind: 'information' },
  { from: 'tenant-rights-coalition',  to: 'robinhood-foundation',   kind: 'information' },
  { from: 'nyc-council-housing',      to: 'robinhood-foundation',   kind: 'information' },
  { from: 'robinhood-foundation',     to: 'bronx-housing-justice',  kind: 'information' },
  { from: 'city-comptroller',         to: 'bronx-housing-justice',  kind: 'information' },
];

function PeopleBoard({
  hoverId,
  onHover,
  stanceFilter,
  onStanceFilter,
}: {
  hoverId: string | null;
  onHover: (h: HoverState | null) => void;
  stanceFilter: 'all' | StanceTone;
  onStanceFilter: (s: 'all' | StanceTone) => void;
}) {
  const indexed = useMemo(() => Object.fromEntries(PEOPLE_NODES.map((n) => [n.id, n])), []);
  const [boardRef, size] = useElementSize();
  const { zoom, tx, ty, beginPan, zoomIn, zoomOut, reset, onWheel } = useGraphZoomPan();

  const pos = (n: NodeDef) => ({ x: (n.x / 100) * size.w, y: (n.y / 100) * size.h });
  const visible = (n: NodeDef) => stanceFilter === 'all' || n.stance === stanceFilter;
  const linked = (id: string) =>
    PEOPLE_EDGES.some((e) => (e.from === hoverId && e.to === id) || (e.to === hoverId && e.from === id));

  return (
    <div className="relative rounded-md bg-page border border-border-subtle overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Stakeholder Network</p>
          <span className="text-muted/40 text-[10px]">·</span>
          <p className="text-[10px] font-mono tracking-[0.12em] text-muted">board 01 / 03</p>
        </div>
        <p className="text-[10px] font-mono tracking-[0.12em] text-muted">06 STAKEHOLDERS · 09 CONNECTIONS</p>
      </div>

      <StanceFilterRow value={stanceFilter} onChange={onStanceFilter} />

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
              const A = pos(a);
              const B = pos(b);
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

        {/* Persistent recommended-actions panel — bottom-right. */}
        <RecommendedActionsPanel />
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

// ─── Recommended actions panel ──────────────────────────────────────────────

const QUICK_ACTIONS: Array<{ id: string; label: string; suggestedId?: string }> = [
  { id: 'q1', label: 'Reach out to RobinHood Foundation highlighting this change', suggestedId: 'leah-kim' },
  { id: 'q2', label: 'Start advocating on social media',                            suggestedId: 'hannah-win' },
];

function RecommendedActionsPanel() {
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  return (
    <div className="absolute bottom-3 right-3 z-30 w-[340px] bg-brand text-white rounded-lg shadow-elevated">
      <div className="px-4 pt-3 pb-2.5 border-b border-white/10 flex items-center gap-2">
        <Sparkles size={12} className="text-accent" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
          Recommended Actions
        </p>
      </div>
      <div className="p-3 space-y-2.5">
        {QUICK_ACTIONS.map((a) => (
          <div key={a.id} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <p className="flex-1 text-[12px] leading-snug text-white/95">{a.label}</p>
            <AssignDropdown
              assignedId={assigned[a.id]}
              onAssign={(m) => setAssigned((prev) => ({ ...prev, [a.id]: m.id }))}
              placement="top"
              align="right"
            />
          </div>
        ))}
      </div>
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
    <div className="flex justify-end px-4 py-2 border-b border-border-subtle bg-surface">
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
  const s = stanceMap[node.stance];
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
            {(focused || node.stance === 'uncertain') && (
              <circle
                cx={(sz.avatar + 24) / 2}
                cy={(sz.avatar + 24) / 2}
                r={sz.avatar / 2 + 6}
                fill="none"
                stroke={s.ring}
                strokeOpacity="0.55"
                strokeWidth={1.25}
                className="cc-ring-pulse"
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

        <div className="mt-2 px-2.5 py-1.5 rounded-md bg-surface border border-border-subtle shadow-card min-w-[150px] text-center">
          <p className="text-[11px] font-semibold text-primary leading-tight">{node.name}</p>
          <p className="mt-1 text-[9px] font-mono tracking-[0.1em] flex items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1">
              <span className="w-1 h-1 rounded-full" style={{ background: s.ring }} />
              <span style={{ color: s.chipText }}>{s.label}</span>
            </span>
            <span className="text-muted/40">·</span>
            <span className="text-muted">{inflLabel[node.influence]}</span>
          </p>
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono tracking-[0.22em] text-muted uppercase">
            {detail.category}
          </span>
          <span className="text-[9px] font-mono tracking-[0.16em] text-muted/70 uppercase">
            {board}
          </span>
        </div>
        <h4 className="text-[15px] font-bold text-primary leading-snug">{detail.title}</h4>
        {detail.meta && (
          <p className="mt-1 text-[10px] font-mono tracking-[0.1em] text-muted">{detail.meta}</p>
        )}
        <p className="mt-2.5 text-[12.5px] text-primary/85 leading-relaxed">{detail.body}</p>

        {detail.opportunity && (
          <div className="mt-3 rounded-md border border-success/30 bg-success-soft/60 p-2.5">
            <p className="text-[9px] font-mono tracking-[0.16em] text-success uppercase">Opportunity</p>
            <p className="mt-1 text-[12px] text-primary leading-snug">{detail.opportunity}</p>
          </div>
        )}

        {detail.benchmark && (
          <div className="mt-3 rounded-md border border-border-subtle bg-page p-2.5 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted">{detail.benchmark.coverageLabel}</span>
                <span className="text-success font-semibold">{detail.benchmark.coveragePct}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${detail.benchmark.coveragePct}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-border-subtle">
              <span className="text-muted">{detail.benchmark.peerLabel}</span>
              <span className="text-accent font-semibold">{detail.benchmark.peerValue}</span>
            </div>
          </div>
        )}

        {detail.action && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-[9px] font-mono tracking-[0.18em] text-accent uppercase mb-1">● Suggested action</p>
            <p className="text-[12px] text-primary leading-relaxed">{detail.action}</p>
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

const POLICY_ITEMS: Array<{
  id: string;
  ring: 1 | 2 | 3;
  angle: number;
  tone: 'info' | 'success' | 'danger' | 'funder';
  label: string;
  meta: string;
}> = [
  // ring 1 — funding (Kimchi accent)
  { id: 'robinhood',        ring: 1, angle: 35,  tone: 'funder',  label: 'Robin Hood Foundation', meta: '$420k Q3 ask · alignment ↑' },
  { id: 'hud',              ring: 1, angle: 145, tone: 'funder',  label: 'HUD CoC Grant',         meta: 'Eligibility broadens · +18%' },
  { id: 'fund-justice',     ring: 1, angle: 250, tone: 'funder',  label: 'Fund for Justice',      meta: 'New RFP opens July 2026' },
  // ring 2 — lifecycle (brand navy)
  { id: 'introduced',       ring: 2, angle: 20,  tone: 'info',    label: 'Introduced',            meta: 'Mar 2026 · ✓ complete' },
  { id: 'committee',        ring: 2, angle: 90,  tone: 'info',    label: 'Committee Review',      meta: 'Now · public comment open' },
  { id: 'floor-vote',       ring: 2, angle: 180, tone: 'info',    label: 'Floor Vote',            meta: 'Jun 18 · projected' },
  { id: 'implementation',   ring: 2, angle: 280, tone: 'info',    label: 'Implementation',        meta: 'Aug 2026 if passed' },
  // ring 3 — risk / opportunity
  { id: 'service-area',     ring: 3, angle: 60,  tone: 'success', label: 'Service-area expansion', meta: '+12k eligible households' },
  { id: 'cross-org',        ring: 3, angle: 200, tone: 'success', label: 'Cross-org coalition',    meta: '3 partner orgs aligned' },
  { id: 'funder-confusion', ring: 3, angle: 320, tone: 'danger',  label: 'Funder confusion',       meta: 'Eligibility shift mid-grant' },
  { id: 'capacity',         ring: 3, angle: 130, tone: 'danger',  label: 'Capacity strain',        meta: 'Volunteer pipeline gap' },
];

const POLICY_TONE_COLOR: Record<'info' | 'success' | 'danger' | 'funder', string> = {
  info: '#02066F',
  success: '#16A34A',
  danger: '#EF4444',
  funder: '#ED4B00',
};

const POLICY_DETAILS: Record<string, HoverDetail> = {
  introduced:   { category: 'POLICY', title: 'Introduced',          body: 'Bill formally introduced Mar 2026; first reading complete.' },
  'service-area': { category: 'POLICY', title: 'Service-area expansion', body: 'Adds 12,000 eligible households across Brooklyn, Queens, and the Bronx.', opportunity: 'Update GIS overlays before Coalition Agreement deadline.' },
  committee:    { category: 'POLICY', title: 'Committee Review',    body: 'Public comment window currently open. Closes 7 days before floor vote.' },
  implementation: { category: 'POLICY', title: 'Implementation',    body: 'Eligibility zones go live Aug 2026 if bill passes floor vote and is signed by mayor.' },
  'funder-confusion': { category: 'POLICY', title: 'Funder confusion', body: 'Eligibility shift mid-grant cycle is creating questions from active funders.', action: 'Leah Kim to send clarifying memo to all Q2 funders.' },
  capacity:     { category: 'POLICY', title: 'Capacity strain',     body: 'Volunteer pipeline does not yet cover the new zones.', action: 'Volunteer Coordinator to recruit in newly eligible zones once bill advances.' },
  'floor-vote': { category: 'POLICY', title: 'Floor Vote',          body: 'Projected Jun 18, 2026. Whip count: 28 in favor, 18 opposed, 5 undecided.' },
  'cross-org':  { category: 'POLICY', title: 'Cross-org coalition', body: '3 partner orgs aligned on shared testimony.' },
  'fund-justice': { category: 'POLICY', title: 'Fund for Justice',  body: 'New RFP opens July 2026; expanded eligibility language is a strong fit.' },
  hud:          { category: 'POLICY', title: 'HUD CoC Grant',       body: 'Federal CoC grant eligibility broadens. Provide Food NYC projects +18% capture rate.' },
  robinhood:    { category: 'POLICY', title: 'Robin Hood Foundation', body: '$420K Q3 ask under preparation. Alignment trending upward.' },
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Impact Radar</p>
          <span className="text-muted/40 text-[10px]">·</span>
          <p className="text-[10px] font-mono tracking-[0.12em] text-muted">board 02 / 03</p>
        </div>
        <p className="text-[10px] font-mono tracking-[0.12em] text-muted">LIVE · SWEEP REFRESH 8s</p>
      </div>

      <div
        ref={boardRef}
        className="relative w-full h-[640px]"
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
          <h3 className="mt-2 text-[18px] font-bold text-primary leading-tight">Right to Counsel<br/>Expansion</h3>
          <p className="mt-2 text-[10px] font-mono tracking-[0.14em] text-muted">NYC · Citywide · June 2026</p>
          <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
            <p className="text-[10px] font-mono tracking-[0.16em] text-muted">RISK</p>
            <p className="text-[18px] font-bold text-danger">32</p>
          </div>
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

// ── PEERS BOARD (internal action map) ────────────────────────────────────

type ActionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface ActionCard {
  id: string;
  team: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
  lead: string;
  body: string;
  priority: ActionPriority;
  due: string;
  /** Pre-fills the AssignDropdown's recommended option (still requires user click). */
  suggestedAssigneeId?: string;
  x: number; // % within canvas
  y: number;
  detail: HoverDetail;
}

const PRIORITY_STYLES: Record<ActionPriority, { text: string; bg: string }> = {
  CRITICAL: { text: '#B91C1C', bg: '#FEE2E2' },
  HIGH:     { text: '#B45309', bg: '#FEF3C7' },
  MEDIUM:   { text: '#02066F', bg: '#E6E7F2' },
  LOW:      { text: '#4A4A55', bg: '#EBEAED' },
};

const ACTION_CARDS: ActionCard[] = [
  {
    id: 'ed',
    team: 'Executive Director',
    initials: 'ED',
    initialsBg: '#FEE2E2',
    initialsText: '#B91C1C',
    lead: 'Suggest · Sofia Reyes',
    body: 'Schedule meeting with NYC Council Housing Committee members; prepare written testimony for the June 10 floor vote.',
    priority: 'CRITICAL',
    due: 'MAY 14',
    suggestedAssigneeId: 'sofia-reyes',
    x: 18, y: 38,
    detail: {
      category: 'PEERS',
      title: 'Executive Director',
      meta: 'Critical · due May 14',
      body: 'Schedule meeting with NYC Council Housing Committee members; prepare written testimony for the June 10 floor vote.',
      action: 'Blocks Donor Relations + Programs work downstream.',
    },
  },
  {
    id: 'donor',
    team: 'Donor Relations',
    initials: 'DR',
    initialsBg: '#FEF3C7',
    initialsText: '#B45309',
    lead: 'Suggest · Leah Kim',
    body: 'Draft donor update to RobinHood Foundation highlighting expanded eligibility zones and Provide Food NYC outcomes in Brownsville and East New York.',
    priority: 'HIGH',
    due: 'MAY 30',
    suggestedAssigneeId: 'leah-kim',
    x: 50, y: 14,
    detail: {
      category: 'PEERS',
      title: 'Donor Relations',
      meta: 'High · due May 30',
      body: 'Draft donor update to RobinHood Foundation connecting expanded eligibility zones to existing program outcomes.',
      action: 'Unblocks Social Media & Comms briefing.',
    },
  },
  {
    id: 'comms',
    team: 'Social Media & Comms',
    initials: 'SM',
    initialsBg: '#E6E7F2',
    initialsText: '#02066F',
    lead: 'Suggest · Hannah Win',
    body: 'Brief comms team on advocacy messaging for the June 10 hearing; develop a campaign across social, email, and event promotion.',
    priority: 'MEDIUM',
    due: 'JUN 8',
    suggestedAssigneeId: 'hannah-win',
    x: 80, y: 36,
    detail: {
      category: 'PEERS',
      title: 'Social Media & Comms',
      meta: 'Medium · due Jun 8',
      body: 'Brief comms on advocacy messaging for the June 10 hearing and develop the campaign collateral.',
    },
  },
  {
    id: 'programs',
    team: 'Programs',
    initials: 'PG',
    initialsBg: '#DCFCE7',
    initialsText: '#15803D',
    lead: 'Suggest · Aisha Park',
    body: 'Map current Provide Food NYC service areas against new eligibility zones in Brownsville, East New York, and South Bronx; flag coverage gaps and capacity needs.',
    priority: 'HIGH',
    due: 'MAY 22',
    suggestedAssigneeId: 'aisha-park',
    x: 50, y: 62,
    detail: {
      category: 'PEERS',
      title: 'Programs',
      meta: 'High · due May 22',
      body: 'Map current service areas against new eligibility zones; flag coverage gaps and capacity needs.',
      action: 'Unblocks Volunteer Coordinator recruitment.',
    },
  },
  {
    id: 'volunteer',
    team: 'Volunteer Coordinator',
    initials: 'VC',
    initialsBg: '#EBEAED',
    initialsText: '#4A4A55',
    lead: 'Suggest · Priya Singh',
    body: 'Recruit additional food-distribution volunteers across Brownsville, East New York, and South Bronx once the bill advances.',
    priority: 'LOW',
    due: 'JUL 15',
    suggestedAssigneeId: 'priya-singh',
    x: 80, y: 80,
    detail: {
      category: 'PEERS',
      title: 'Volunteer Coordinator',
      meta: 'Low · due Jul 15',
      body: 'Recruit additional food-distribution volunteers in newly eligible zones once the bill advances.',
    },
  },
];

const ACTION_DEPS: Array<[string, string]> = [
  ['ed', 'donor'],
  ['ed', 'programs'],
  ['donor', 'comms'],
  ['programs', 'volunteer'],
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
  const linked = (id: string) =>
    ACTION_DEPS.some(([a, b]) => (a === hoverId && b === id) || (b === hoverId && a === id));

  return (
    <div className="relative rounded-md bg-page border border-border-subtle overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Internal Action Map</p>
          <span className="text-muted/40 text-[10px]">·</span>
          <p className="text-[10px] font-mono tracking-[0.12em] text-muted">board 03 / 03</p>
        </div>
        <p className="text-[10px] font-mono tracking-[0.12em] text-muted">5 TEAMS · 1 CRITICAL · 2 HIGH · 1 MEDIUM · 1 LOW</p>
      </div>
      <div className="px-4 py-2 border-b border-border-subtle bg-surface">
        <p className="text-[10px] font-mono tracking-[0.14em] text-muted uppercase">
          Dependency map · arrows = "must complete before"
        </p>
      </div>

      <div
        ref={boardRef}
        className="relative w-full h-[640px]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D6D6DC 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="cc-dep-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10z" fill="#ED4B00" />
            </marker>
            <filter id="cc-glow-dep" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {ACTION_DEPS.map(([from, to], i) => {
            const A = pos(from);
            const B = pos(to);
            const focused = hoverId === from || hoverId === to;
            const dimmed = !!hoverId && !focused;
            const d = curvedPath(A.x, A.y, B.x, B.y, 0.10, ((i * 5) % 10) - 5);
            return (
              <g key={i} style={{ opacity: dimmed ? 0.2 : 1, transition: 'opacity .25s' }}>
                <path d={d} fill="none" stroke="#ED4B00" strokeOpacity={0.20} strokeWidth={2.5} />
                <path
                  d={d}
                  fill="none"
                  stroke="#ED4B00"
                  strokeWidth={focused ? 1.6 : 1.2}
                  className={focused ? 'cc-string' : 'cc-string-slow'}
                  filter="url(#cc-glow-dep)"
                  markerEnd="url(#cc-dep-arrow)"
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {ACTION_CARDS.map((c) => {
            const focused = hoverId === c.id;
            const dim = !!hoverId && !focused && !linked(c.id);
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
  const [assignedId, setAssignedId] = useState<string | null>(null);

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
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
          <p className="text-[10px] font-mono tracking-[0.12em] text-muted">DUE · {card.due}</p>
          <AssignDropdown
            assignedId={assignedId}
            onAssign={(m) => setAssignedId(m.id)}
            placement="top"
            align="right"
          />
        </div>
      </div>
    </div>
  );
}

// ── RIGHT SIDEBAR ────────────────────────────────────────────────────────

function SidebarHint() {
  return (
    <div className="rounded-md bg-surface border border-border-subtle shadow-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Detail</p>
        <p className="text-[10px] font-mono tracking-[0.18em] text-muted/70 uppercase">Hover any node</p>
      </div>
      <h3 className="text-[15px] font-bold text-primary">Read in place</h3>
      <p className="mt-2 text-[12px] text-muted leading-relaxed">
        Hover a stakeholder, radar item, or team card to see what this policy means for them — and the suggested action for our org. Click to open the full profile.
      </p>
    </div>
  );
}

function SidebarLegend() {
  return (
    <div className="rounded-md bg-surface border border-border-subtle shadow-card p-4">
      <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase mb-3">Legend</p>

      <p className="text-[10px] font-mono tracking-[0.14em] text-primary uppercase mb-2">Stance</p>
      <div className="space-y-1.5 mb-4">
        <LegendStanceRow color="#16A34A" label="Supportive" sub="Aligned with our position" />
        <LegendStanceRow color="#EF4444" label="Opposed"    sub="Active resistance" />
        <LegendStanceRow color="#F59E0B" label="Uncertain"  sub="Awaiting data / position" />
      </div>

      <p className="text-[10px] font-mono tracking-[0.14em] text-primary uppercase mb-2">Connections</p>
      <div className="space-y-1.5 mb-4">
        <LegendDashRow color="#16A34A" label="Advocacy alignment" />
        <LegendDashRow color="#EF4444" label="Opposition" />
        <LegendDashRow color="#ED4B00" label="Funding flow" />
        <LegendDashRow color="#02066F" label="Information flow" />
      </div>

      <p className="text-[10px] font-mono tracking-[0.14em] text-primary uppercase mb-2">Influence</p>
      <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-muted/60" />LOW</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-muted/60" />MED</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full border border-muted/60" />HIGH</span>
      </div>
    </div>
  );
}

function LegendStanceRow({ color, label, sub }: { color: string; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-primary font-semibold">{label}</span>
      <span className="text-muted truncate">{sub}</span>
    </div>
  );
}

function LegendDashRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px]">
      <svg width="28" height="6" className="shrink-0">
        <line x1="0" y1="3" x2="28" y2="3" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <span className="text-primary/85">{label}</span>
    </div>
  );
}

function SidebarCaseFile() {
  return (
    <div className="rounded-md bg-surface border border-border-subtle shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono tracking-[0.18em] text-muted uppercase">Case File</p>
        <p className="text-[10px] font-mono tracking-[0.12em] text-muted/70">2026-FEA-047</p>
      </div>
      <dl className="space-y-2 text-[11px]">
        <CaseRow label="Council committee status" value="Passed" valueClass="text-success" />
        <CaseRow label="Public comment period"    value="closed" valueClass="text-muted" />
        <CaseRow label="Coalition partners"       value="4 confirmed" valueClass="text-primary" />
        <CaseRow label="Floor vote ETA"           value="Jun 10" valueClass="text-accent" />
      </dl>
      <button
        type="button"
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors"
      >
        Open full brief <ChevronRight size={13} />
      </button>
    </div>
  );
}

function CaseRow({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-mono font-medium ${valueClass}`}>{value}</dd>
    </div>
  );
}

function RelatedPolicyCard({
  title,
  relevance,
  blurb,
  status,
  href,
}: {
  title: string;
  relevance: number;
  blurb: string;
  status: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-primary leading-tight">{title}</p>
        <span className="inline-flex items-center px-2 h-5 rounded-full bg-brand/10 text-brand text-[10px] font-semibold shrink-0">
          {relevance}% relevance
        </span>
      </div>
      <p className="text-[13px] text-muted mt-2 leading-relaxed">{blurb}</p>
      <p className="text-[12px] text-primary/80 mt-3">
        Status: <span className="font-medium">{status}</span>
      </p>
    </>
  );
  const className =
    'block rounded-md border border-border-subtle bg-surface p-4 hover:border-brand/40 transition-colors no-underline';
  return href ? (
    <Link to={href} className={className}>{inner}</Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function DiscussionNote({
  author,
  role,
  date,
  body,
}: {
  author: string;
  role: string;
  date: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-page/40 p-4">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-primary">{author}</span>
          <span className="text-[11px] text-muted">·</span>
          <span className="text-[12px] text-muted">{role}</span>
        </div>
        <span className="text-[11px] text-muted">{date}</span>
      </div>
      <p className="text-[13px] text-primary/85 leading-relaxed">{body}</p>
    </div>
  );
}
