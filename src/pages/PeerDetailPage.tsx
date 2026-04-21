import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, HelpCircle, Lightbulb, Plus } from 'lucide-react';
import { peerOrgs } from '../data/peers';
import { peerCampaigns } from '../data/campaigns';
import { notesForEntity } from '../data/notes';
import { LinkedInsightSection, useToast, InternalNotePreview, ComposeNoteModal, FollowUpComposer } from '../components/ui';
import { useActions } from '../lib/ActionContext';
import { useRole } from '../lib/RoleContext';
import { linksFor } from '../data/demoFlows';
import { useRecent } from '../lib/RecentContext';
import { useMaturity } from '../lib/MaturityContext';
import { PeerDetailDay0Page } from './day0/PeerDetailDay0Page';

export function PeerDetailPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PeerDetailDay0Page />;
  return <PeerDetailDayXPage />;
}

function PeerDetailDayXPage() {
  const { id } = useParams<{ id: string }>();
  const peer = peerOrgs.find((p) => p.id === id);
  const peerCamps = peerCampaigns.filter((c) => c.orgId === id);
  const toast = useToast();
  const { trackVisit } = useRecent();
  const { activeMember } = useRole();
  const { addAction } = useActions();
  const [noteOpen, setNoteOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerDefaults, setComposerDefaults] = useState<{ title: string; context: string }>({ title: '', context: '' });
  const [storyInsight, setStoryInsight] = useState<null | import('../data/demoFlows').LinkedInsight>(null);

  useEffect(() => {
    if (peer) trackVisit({ type: 'peer', id: peer.id, label: peer.name, path: `/peers/${peer.id}` });
  }, [peer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkedNotes = useMemo(() => (id ? notesForEntity('peer', id) : []), [id]);

  if (!peer) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Peer organization not found.</p>
        <Link to="/peers/organizations" className="text-primary underline mt-2 inline-block">Back to organizations</Link>
      </div>
    );
  }

  const optInStyle =
    peer.optInStatus === 'Opted in'
      ? 'bg-success-soft text-success border-success/30'
      : peer.optInStatus === 'Pending'
      ? 'bg-warning-soft text-warning border-warning/30'
      : 'bg-surface-muted text-secondary border-border-subtle';

  const size = peer.orgSize.split(' (')[0];

  const insights = linksFor('peer', peer.id);

  // Benchmark dataset. Email open + Donor conversion + Donor retention are
  // pulled from the shared benchmark data, augmented with a sector avg and
  // a funds-raised row from the peer record.
  // Suggestions reference aggregate cohort patterns rather than any specific
  // peer's data so the opt-in network doesn't leak sensitive detail.
  const benchmarks: Array<{
    label: string;
    yours: number;
    theirs: number;
    avg: number;
    top: number;
    suffix: string;
    suggestion: Suggestion;
  }> = [
    {
      label: 'Email open rate',
      yours: 31, theirs: 30, avg: 30, top: 38, suffix: '%',
      suggestion: {
        headingAhead: 'Protect a narrow lead',
        headingBehind: 'Close the subject-line gap',
        body: 'Top-quartile orgs in your cohort keep subject lines under ~45 characters and send 2–3x per month. A/B tests in that range typically move open rate by 3–6 points.',
        ctaLabel: 'See playbook',
      },
    },
    {
      label: 'Donor Conversion',
      yours: 3.8, theirs: 4.0, avg: 3.5, top: 4.0, suffix: '%',
      suggestion: {
        headingAhead: 'Test a higher default ask',
        headingBehind: 'Reduce form friction',
        body: 'Aggregate cohort data shows donation forms with 5 fields or fewer convert noticeably better than longer forms. Trimming one field at a time is the most reliable lever.',
        ctaLabel: 'Review donation flow',
      },
    },
    {
      label: 'Donor Retention',
      yours: 64, theirs: 64, avg: 60, top: 72, suffix: '%',
      suggestion: {
        headingAhead: 'Hold the stewardship line',
        headingBehind: 'Add a 30–60 day stewardship touch',
        body: 'Orgs at top-quartile retention in your cohort typically add a non-ask touch within 30–60 days of a gift. A short thank-you paired with an impact micro-story is the most common tactic.',
        ctaLabel: 'Draft touchpoint',
      },
    },
  ];

  return (
    <>
      <Link to="/peers/organizations" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4 no-underline">
        <ArrowLeft size={14} /> Back to organizations
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-sm bg-surface-muted border border-border-subtle flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <h1 className="page-title">{peer.name}</h1>
                <span className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full ${optInStyle}`}>
                  {peer.optInStatus}
                </span>
              </div>
              <WhyPeerTooltip />
            </div>
            <p className="text-[13px] text-secondary mt-1">{peer.missionArea}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-5 pt-5 border-t border-border-subtle">
          <DetailStat label="Geography" value={peer.geography} />
          <DetailStat label="Size" value={size} />
          <DetailStat label="Revenue" value={peer.revenueBand} />
          <DetailStat label="Type" value={peer.orgType} />
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Kpi label="Donors" value={peer.donorCount.toLocaleString()} caption={`Update ${peer.donorCountUpdatedDaysAgo} ${peer.donorCountUpdatedDaysAgo === 1 ? 'day' : 'days'} ago`} />
        <Kpi label="Campaigns Shared" value={peer.campaignsSharedLast2Months.toString()} caption="Last 2 month" />
        <Kpi label="Performance" value={peer.performanceScore.toString()} caption="Last 2 month" />
        <Kpi label="Tracked Policies" value={peer.trackedPoliciesCount.toString()} caption="Last 2 month" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Recent Campaigns</h3>
              <p className="text-[12px] text-muted mt-0.5">What this org has been running</p>
            </div>
            <div className="px-5 divide-y divide-border-subtle">
              {peerCamps.length === 0 ? (
                <p className="py-4 text-[13px] text-muted">No campaigns shared yet.</p>
              ) : (
                peerCamps.slice(0, 3).map((c) => {
                  const perfHigh = c.performanceVsAvg >= 100;
                  return (
                    <Link
                      key={c.id}
                      to={`/peers/campaigns/${c.id}`}
                      className="block py-4 no-underline group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {perfHigh && (
                            <span className="inline-flex items-center px-2 h-[20px] text-[11px] font-medium leading-none border rounded-full bg-success-soft text-success border-success/30">
                              High Performance
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 h-[20px] text-[11px] font-medium leading-none border rounded-full bg-surface-muted text-secondary border-border-subtle">
                            {c.theme}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted whitespace-nowrap">{c.dateRange}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-primary leading-snug group-hover:underline underline-offset-2 decoration-border-default">
                        {c.title}
                      </p>
                      <p className="text-[12px] text-secondary mt-1 italic leading-snug line-clamp-2">"{c.topMessage}"</p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-primary tracking-tight">Benchmark</h2>
                <p className="text-[12px] text-muted mt-0.5">Your org vs {peer.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  exportBenchmarkCsv(peer, benchmarks);
                  toast.show({
                    type: 'success',
                    title: 'Benchmark report exported',
                    description: `${peer.name} benchmark CSV downloaded.`,
                  });
                }}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default transition-colors"
              >
                <Download size={12} /> Export report
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {benchmarks.map((b) => (
                <BenchmarkBlock
                  key={b.label}
                  {...b}
                  onAction={(suggestion) => {
                    setStoryInsight(null);
                    setComposerDefaults({
                      title: `${suggestion.ctaLabel} — ${b.label}`,
                      context: `Peer benchmark cue on ${peer.name}: ${suggestion.body}`,
                    });
                    setComposerOpen(true);
                  }}
                />
              ))}
              <FundsRaisedBlock
                data={peer.fundsRaisedYtd}
                onAction={(suggestion) => {
                  setStoryInsight(null);
                  setComposerDefaults({
                    title: `${suggestion.ctaLabel} — Funds raised`,
                    context: `Peer benchmark cue on ${peer.name}: ${suggestion.body}`,
                  });
                  setComposerOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <LinkedInsightSection
            title="The Story Continues"
            insights={insights}
            onAction={(insight) => {
              setStoryInsight(insight);
              setComposerDefaults({
                title: insight.suggestedAction ?? `Follow up on ${insight.toLabel}`,
                context: insight.reason,
              });
              setComposerOpen(true);
            }}
          />

          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Team Notes</h3>
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="inline-flex items-center gap-1 h-7 px-2 text-[12px] text-secondary hover:text-primary"
              >
                <Plus size={11} /> Add Note
              </button>
            </div>
            <div className="px-5 divide-y divide-border-subtle">
              {linkedNotes.length === 0 ? (
                <p className="py-4 text-[13px] text-muted">No team notes yet.</p>
              ) : (
                linkedNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <ComposeNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        entityLabel={peer.name}
        onSubmit={(body) => {
          toast.show({ type: 'success', title: 'Note added', description: body.slice(0, 60) });
          setNoteOpen(false);
        }}
      />

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultTitle={composerDefaults.title}
        defaultContext={composerDefaults.context}
        defaultEntity={
          storyInsight
            ? { type: storyInsight.toType, id: storyInsight.toId, label: storyInsight.toLabel, link: storyInsight.toRoute }
            : { type: 'peer', id: peer.id, label: peer.name, link: `/peers/${peer.id}` }
        }
        onCreate={(payload) => {
          addAction(
            {
              ...payload,
              entity:
                payload.entity ?? { type: 'peer', id: peer.id, label: peer.name, link: `/peers/${peer.id}` },
            },
            activeMember.id,
            ['executive', 'fundraising', 'policy'],
          );
          toast.show({ type: 'success', title: 'Follow-up created', description: payload.title });
        }}
      />

    </>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow-plain mb-1.5">{label}</p>
      <p className="text-[13px] text-primary">{value}</p>
    </div>
  );
}

function Kpi({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-secondary mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="metric-display text-primary">{value}</p>
        <span className="text-[11px] text-muted">{caption}</span>
      </div>
    </div>
  );
}

function WhyPeerTooltip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[12px] text-secondary hover:text-primary"
      >
        <HelpCircle size={13} />
        Why they're a peer
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 bg-surface border border-border-default rounded-sm shadow-md w-[280px] p-4">
          <p className="text-[12px] font-semibold text-primary mb-2">Why they're a peer</p>
          <ul className="flex flex-col gap-1.5 text-[12px] text-secondary">
            <li>• Similar mission area</li>
            <li>• Comparable size and revenue</li>
            <li>• Same metro region</li>
            <li>• Active in last 90 days</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Benchmark bars — single-track comparison.
// Shows a filled bar for You colored by delta-to-Their (green ahead, red behind,
// muted near parity), a vertical tick for Their position on the same track, and
// small Avg/Top reference ticks below. Numeric values live in the caption row
// so the chart itself stays visually quiet.
// ─────────────────────────────────────────────────────────────────────────────

interface Suggestion {
  headingAhead: string;
  headingBehind: string;
  body: string;
  ctaLabel: string;
}

const FUNDS_RAISED_SUGGESTION: Suggestion = {
  headingAhead: 'Broaden the revenue mix',
  headingBehind: 'Tighten the campaign calendar',
  body: 'Cohort orgs at your size typically run 2 major and 3 minor campaigns per year. Gaps between campaigns of more than 8 weeks are the pattern most associated with YTD shortfalls.',
  ctaLabel: 'Plan next campaign',
};

function BenchmarkBlock({
  label,
  yours,
  theirs,
  avg,
  top,
  suffix,
  suggestion,
  onAction,
}: {
  label: string;
  yours: number;
  theirs: number;
  avg: number;
  top: number;
  suffix: string;
  suggestion: Suggestion;
  onAction: (s: Suggestion) => void;
}) {
  return (
    <ComparisonBar
      label={label}
      yours={yours}
      theirs={theirs}
      avg={avg}
      top={top}
      formatValue={(v) => `${v}${suffix}`}
      suggestion={suggestion}
      onAction={onAction}
    />
  );
}

function FundsRaisedBlock({
  data,
  onAction,
}: {
  data: { yours: number; theirs: number; avg: number; top: number };
  onAction: (s: Suggestion) => void;
}) {
  return (
    <ComparisonBar
      label="Funds Raised (YTD)"
      yours={data.yours}
      theirs={data.theirs}
      avg={data.avg}
      top={data.top}
      formatValue={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
      deltaUnit=""
      suggestion={FUNDS_RAISED_SUGGESTION}
      onAction={onAction}
    />
  );
}

function ComparisonBar({
  label,
  yours,
  theirs,
  avg,
  top,
  formatValue,
  deltaUnit,
  suggestion,
  onAction,
}: {
  label: string;
  yours: number;
  theirs: number;
  avg: number;
  top: number;
  formatValue: (v: number) => string;
  deltaUnit?: string;
  suggestion?: Suggestion;
  onAction?: (s: Suggestion) => void;
}) {
  const max = Math.max(yours, theirs, avg, top) * 1.1;
  const yoursPct = (yours / max) * 100;
  const theirsPct = (theirs / max) * 100;
  const avgPct = (avg / max) * 100;
  const topPct = (top / max) * 100;

  const delta = yours - theirs;
  const deltaPct = theirs === 0 ? 0 : (delta / theirs) * 100;
  const near = Math.abs(deltaPct) < 1.5;
  const ahead = delta > 0;

  const fillColor = near
    ? 'bg-border-default'
    : ahead
    ? 'bg-success'
    : 'bg-danger';
  const deltaChipStyle = near
    ? 'bg-surface-muted text-secondary border-border-subtle'
    : ahead
    ? 'bg-success-soft text-success border-success/30'
    : 'bg-danger-soft text-danger border-danger/30';

  const deltaLabel = deltaUnit
    ? `${ahead ? '+' : ''}${(delta as number).toFixed(1)}${deltaUnit} vs theirs`
    : `${ahead ? '+' : ''}${deltaPct.toFixed(1)}% vs theirs`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-[13px] font-semibold text-primary">{label}</p>
        <span
          className={`inline-flex items-center px-2 h-[20px] text-[11px] font-medium leading-none border rounded-full ${deltaChipStyle}`}
        >
          {near ? 'On par with theirs' : deltaLabel}
        </span>
      </div>

      <div className="relative h-[18px] bg-surface-muted/70 border border-border-subtle rounded-sm overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${fillColor} transition-[width]`}
          style={{ width: `${Math.max(2, yoursPct)}%` }}
          aria-label={`You: ${formatValue(yours)}`}
        />
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary"
          style={{ left: `calc(${theirsPct}% - 1px)` }}
          aria-label={`Their: ${formatValue(theirs)}`}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-muted/60"
          style={{ left: `calc(${avgPct}% - 0.5px)` }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-muted/60"
          style={{ left: `calc(${topPct}% - 0.5px)` }}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted flex-wrap">
        <LegendChip color="fill" value={formatValue(yours)} label="You" ahead={ahead} near={near} />
        <LegendChip color="tick" value={formatValue(theirs)} label="Their" />
        <span className="text-[11px] text-muted">Avg {formatValue(avg)}</span>
        <span className="text-[11px] text-muted">Top {formatValue(top)}</span>
      </div>

      {suggestion && (
        <SuggestionPanel
          suggestion={suggestion}
          ahead={ahead}
          near={near}
          onAction={onAction}
        />
      )}
    </div>
  );
}

function SuggestionPanel({
  suggestion,
  ahead,
  near,
  onAction,
}: {
  suggestion: Suggestion;
  ahead: boolean;
  near: boolean;
  onAction?: (s: Suggestion) => void;
}) {
  const heading = ahead || near ? suggestion.headingAhead : suggestion.headingBehind;
  return (
    <div className="mt-3 flex items-start gap-2.5 rounded-sm border border-border-subtle bg-surface-muted/40 px-3 py-2.5">
      <Lightbulb size={13} className="text-accent-hover mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[12px] font-semibold text-primary">{heading}</p>
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
            Cohort insight
          </span>
        </div>
        <p className="text-[12px] text-secondary mt-1 leading-snug">{suggestion.body}</p>
        {onAction && (
          <button
            type="button"
            onClick={() => onAction(suggestion)}
            className="inline-flex items-center h-7 px-2.5 mt-2 text-[12px] font-medium bg-surface border border-border-default rounded-sm hover:bg-surface-muted/60 text-primary transition-colors"
          >
            {suggestion.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function LegendChip({
  color,
  value,
  label,
  ahead,
  near,
}: {
  color: 'fill' | 'tick';
  value: string;
  label: string;
  ahead?: boolean;
  near?: boolean;
}) {
  const swatch =
    color === 'fill'
      ? near
        ? 'bg-border-default'
        : ahead
        ? 'bg-success'
        : 'bg-danger'
      : 'bg-primary';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-2 h-2 rounded-[1px] ${swatch} ${color === 'tick' ? 'w-[2px] h-3' : ''}`} />
      <span className="text-secondary">
        {label} <span className="text-primary font-semibold tabular-nums">{value}</span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Benchmark CSV export
// ─────────────────────────────────────────────────────────────────────────────

type BenchmarkRow = {
  label: string;
  yours: number;
  theirs: number;
  avg: number;
  top: number;
  suffix: string;
};

function exportBenchmarkCsv(
  peer: { id: string; name: string; fundsRaisedYtd: { yours: number; theirs: number; avg: number; top: number } },
  benchmarks: BenchmarkRow[],
) {
  if (typeof window === 'undefined') return;
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ['Metric', 'You', 'Their', 'Cohort avg', 'Top quartile'];
  const rows = benchmarks.map((b) => [b.label, `${b.yours}${b.suffix}`, `${b.theirs}${b.suffix}`, `${b.avg}${b.suffix}`, `${b.top}${b.suffix}`]);
  const fmtMoney = (v: number) => `$${(v / 1_000_000).toFixed(1)}M`;
  rows.push([
    'Funds Raised (YTD)',
    fmtMoney(peer.fundsRaisedYtd.yours),
    fmtMoney(peer.fundsRaisedYtd.theirs),
    fmtMoney(peer.fundsRaisedYtd.avg),
    fmtMoney(peer.fundsRaisedYtd.top),
  ]);
  const meta = [
    [`Benchmark report — Your org vs ${peer.name}`],
    [`Generated ${new Date().toISOString().slice(0, 10)}`],
    ['Aggregated, anonymized cohort benchmarks. No individual records included.'],
    [],
  ];
  const lines = [
    ...meta.map((r) => r.map(esc).join(',')),
    header.map(esc).join(','),
    ...rows.map((r) => r.map(esc).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `benchmark-${peer.id}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
