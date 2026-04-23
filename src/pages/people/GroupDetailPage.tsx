import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Filter, Plus, Search, Sparkles } from 'lucide-react';
import { DonorGroup } from '../../data/groups';
import { useGroups } from '../../lib/GroupsContext';
import { useDonors } from '../../lib/DonorsContext';
import { useToast, Checkbox, FollowUpComposer, ComposeEmailModal } from '../../components/ui';
import { useActions } from '../../lib/ActionContext';
import { useRole } from '../../lib/RoleContext';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr'];

function engagementTier(score: number): 'High engagement' | 'Medium engagement' | 'Low engagement' {
  if (score >= 70) return 'High engagement';
  if (score >= 50) return 'Medium engagement';
  return 'Low engagement';
}
function valueTier(totalLifetime: number): 'High value' | 'Medium value' | 'Low value' {
  if (totalLifetime >= 500_000) return 'High value';
  if (totalLifetime >= 100_000) return 'Medium value';
  return 'Low value';
}

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { groups, dismissRecommendation, isRecommendationDismissed } = useGroups();
  const { activeMember } = useRole();
  const { addAction } = useActions();
  const toast = useToast();
  const [composerOpen, setComposerOpen] = useState(false);

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Group not found.</p>
        <Link to="/people/groups" className="text-primary underline mt-2 inline-block">Back to groups</Link>
      </div>
    );
  }

  const recDismissed = isRecommendationDismissed(group.id);

  return (
    <>
      <Link to="/people/groups" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4 no-underline">
        <ArrowLeft size={14} /> Back to groups
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-sm bg-surface-muted border border-border-subtle flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h1 className="page-title">{group.name}</h1>
              <TierChip label={engagementTier(group.engagementScore)} tone="accent" />
              <TierChip label={valueTier(group.totalLifetime)} tone="muted" />
            </div>
            <p className="text-[14px] text-secondary leading-relaxed max-w-3xl">{group.description}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DeltaKpi label="Members" value={group.memberCount.toLocaleString()} delta={group.membersDelta} caption="Compared to last 3 month" />
        <DeltaKpi
          label="Lifetime Giving"
          value={formatMoney(group.totalLifetime, { compact: true })}
          delta={group.lifetimeDelta}
          caption="Compared to last 3 month"
        />
        <DeltaKpi
          label="Average Gift"
          value={formatMoney(group.avgGift, { compact: false })}
          delta={group.avgGiftDelta}
          caption="Compared to last 3 month"
        />
        <DeltaKpi
          label="Engagement Score"
          value={group.engagementScore.toString()}
          delta={group.engagementDelta}
          caption="Compared to last month"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <h2 className="text-[15px] font-semibold text-primary tracking-tight mb-4">Giving Summary</h2>
            <GivingChart data={group.givingTrend} />
          </div>

          <MembersPanel group={group} />
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          {!recDismissed && (
            <div className="relative bg-surface border border-border-subtle rounded-md overflow-hidden">
              <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-primary" />
                  <h3 className="text-[15px] font-semibold text-primary tracking-tight">Recommended Action</h3>
                </div>
                <p className="text-[13px] text-primary leading-relaxed mb-4">{group.recommendedAction}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="inline-flex items-center h-8 px-3 text-[12px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default transition-colors"
                  >
                    Take Action
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissRecommendation(group.id)}
                    className="text-[12px] text-secondary hover:text-primary"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Group Details</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <DetailRow label="Created" value={formatDate(group.createdDate)} />
              <DetailRow label="Last updated" value={formatDate(group.lastUpdated)} />
              <DetailRow label="Created by" value={group.createdBy} />
            </div>
          </div>
        </div>
      </div>

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultTitle={group.recommendedAction.split('.')[0]}
        defaultContext={`Recommended action for ${group.name}: ${group.recommendedAction}`}
        onCreate={(payload) => {
          addAction(payload, activeMember.id, ['executive', 'fundraising', 'communications']);
          toast.show({ type: 'success', title: 'Action created', description: payload.title });
        }}
      />
    </>
  );
}

function TierChip({ label, tone }: { label: string; tone: 'accent' | 'muted' }) {
  const style =
    tone === 'accent'
      ? 'bg-accent-soft text-primary border-accent/45'
      : 'bg-surface-muted text-secondary border-border-subtle';
  return (
    <span className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full ${style}`}>
      {label}
    </span>
  );
}

function DeltaKpi({
  label,
  value,
  delta,
  caption,
}: {
  label: string;
  value: string;
  delta: number;
  caption: string;
}) {
  const isPositive = delta > 0;
  const isZero = delta === 0;
  const deltaColor = isZero ? 'text-muted' : isPositive ? 'text-success' : 'text-danger';
  const sign = isZero ? '' : isPositive ? '+' : '';
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-secondary mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="metric-display text-primary">{value}</p>
        <span className={`text-[12px] font-semibold ${deltaColor}`}>
          {sign}
          {delta}%
        </span>
      </div>
      <p className="text-[11px] text-muted mt-2">{caption}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-muted">{label}</span>
      <span className="text-primary font-medium">{value}</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMoney(value: number, { compact }: { compact: boolean }) {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  }
  return `$${value.toLocaleString()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Giving chart — tiny SVG area so we don't pull in recharts for a 4-point series.
// ─────────────────────────────────────────────────────────────────────────────

function GivingChart({ data }: { data: number[] }) {
  const width = 680;
  const height = 200;
  const padX = 30;
  const padTop = 20;
  const padBottom = 30;

  const max = Math.max(...data, 1);
  const min = 0;
  const h = height - padTop - padBottom;
  const innerW = width - padX * 2;
  const step = innerW / (data.length - 1);

  const points = data.map((v, i) => {
    const x = padX + i * step;
    const y = padTop + h - ((v - min) / (max - min || 1)) * h;
    return { x, y, v };
  });

  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const mx = (prev.x + p.x) / 2;
    return `${acc} C ${mx},${prev.y} ${mx},${p.y} ${p.x},${p.y}`;
  }, '');
  const areaPath = `${linePath} L ${padX + innerW},${padTop + h} L ${padX},${padTop + h} Z`;

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((max / yTicks) * (yTicks - i)));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full h-[200px]"
      role="img"
      aria-label="Giving summary"
    >
      {tickValues.map((v, i) => {
        const y = padTop + (h / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padX} x2={padX + innerW} y1={y} y2={y} stroke="#D9D9E1" strokeWidth={0.5} strokeDasharray="2 3" />
            <text x={padX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#7A756E">
              {formatTick(v)}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="#2B00D4" fillOpacity="0.12" />
      <path d={linePath} stroke="#262626" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#262626" />
      ))}
      {points.map((p, i) => (
        <text
          key={`lbl-${i}`}
          x={p.x}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill="#7A756E"
        >
          {MONTH_LABELS[i] ?? ''}
        </text>
      ))}
    </svg>
  );
}

function formatTick(v: number): string {
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return String(v);
}

// ─────────────────────────────────────────────────────────────────────────────
// Members table with search + More filter
// ─────────────────────────────────────────────────────────────────────────────

const RELATIONSHIP_OPTIONS = ['Active', 'At-risk', 'Lapsed', 'Inactive'];
const RISK_OPTIONS = ['Low', 'Medium', 'High'];

function MembersPanel({ group }: { group: DonorGroup }) {
  const { donors: allDonors } = useDonors();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [relFilter, setRelFilter] = useState<string[]>([]);
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [emailOpen, setEmailOpen] = useState(false);

  const members = useMemo(
    () => allDonors.filter((d) => group.memberIds.includes(d.id)),
    [allDonors, group.memberIds],
  );

  const filtered = useMemo(() => {
    return members.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.persona.toLowerCase().includes(q)) return false;
      }
      if (relFilter.length && !relFilter.includes(d.relationship)) return false;
      if (riskFilter.length && !riskFilter.includes(d.risk)) return false;
      return true;
    });
  }, [members, search, relFilter, riskFilter]);

  return (
    <div className="bg-surface border border-border-subtle rounded-md">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-primary tracking-tight">Group members</h2>
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-primary hover:bg-surface-muted/50 rounded-sm"
        >
          <Plus size={13} /> Email All
        </button>
      </div>

      <div className="p-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donors..."
              className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </div>
          <MorePill
            relFilter={relFilter}
            riskFilter={riskFilter}
            onToggleRel={(v) =>
              setRelFilter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
            }
            onToggleRisk={(v) =>
              setRiskFilter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
            }
            onClear={() => {
              setRelFilter([]);
              setRiskFilter([]);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 items-center px-5 py-2.5 border-t border-b border-border-subtle bg-surface-muted/40">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Donor</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Donation</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Relationship</span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-[13px] text-muted">
          {members.length === 0
            ? 'No members in this group yet.'
            : 'No members match these filters.'}
        </div>
      ) : (
        filtered.map((d) => {
          const donation = d.lifetimeGiving ? `$${d.lifetimeGiving.toLocaleString()}` : '—';
          return (
            <div
              key={d.id}
              className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 items-center px-5 py-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-muted/40 transition-colors"
            >
              <Link
                to={`/people/donors/${d.id}`}
                className="text-[13px] font-medium text-primary no-underline hover:underline underline-offset-2 decoration-border-default"
              >
                {d.name}
              </Link>
              <Link
                to={`/people/donors/${d.id}`}
                className="text-[13px] text-primary tabular-nums no-underline"
              >
                {donation}
              </Link>
              <Link
                to={`/people/donors/${d.id}`}
                className="text-[13px] text-secondary no-underline"
              >
                {d.relationship}
              </Link>
            </div>
          );
        })
      )}

      <ComposeEmailModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        recipients={`${members.length} members of ${group.name}`}
        defaultSubject={`${group.name} — a quick update`}
        onSend={() => {
          toast.show({
            type: 'success',
            title: 'Email sent',
            description: `Sent to ${members.length} members of ${group.name}`,
          });
          setEmailOpen(false);
        }}
      />
    </div>
  );
}

function MorePill({
  relFilter,
  riskFilter,
  onToggleRel,
  onToggleRisk,
  onClear,
}: {
  relFilter: string[];
  riskFilter: string[];
  onToggleRel: (v: string) => void;
  onToggleRisk: (v: string) => void;
  onClear: () => void;
}) {
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
  const active = relFilter.length > 0 || riskFilter.length > 0;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-sm border text-[12px] font-medium transition-colors
          ${active
            ? 'bg-primary text-surface border-primary'
            : 'bg-surface text-secondary border-border-subtle hover:border-border-default'
          }`}
      >
        <Filter size={12} className={active ? 'text-surface/80' : 'text-muted'} />
        More
        {active && <span className="font-semibold">({relFilter.length + riskFilter.length})</span>}
        <ChevronDown size={11} className={active ? 'text-surface/70' : 'text-muted'} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[260px] p-3">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Relationship</p>
          <div className="flex flex-col gap-2 mb-3">
            {RELATIONSHIP_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={relFilter.includes(opt)} onChange={() => onToggleRel(opt)} />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Risk</p>
          <div className="flex flex-col gap-2 mb-2">
            {RISK_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={riskFilter.includes(opt)} onChange={() => onToggleRisk(opt)} />
            ))}
          </div>
          {active && (
            <button
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="text-[12px] text-secondary hover:text-primary"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

