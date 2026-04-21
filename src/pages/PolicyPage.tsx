import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Filter, Search } from 'lucide-react';
import { useMaturity } from '../lib/MaturityContext';
import { usePolicyRead } from '../lib/PolicyReadContext';
import { PolicyDay0Page } from './day0/PolicyDay0Page';
import { policies, Policy } from '../data/policies';
import { Checkbox } from '../components/ui';

type ReadFilter = 'All' | 'Read' | 'Unread';

interface Filters {
  read: ReadFilter;
  riskOpp: string[];
  status: string[];
  jurisdiction: string[];
  topic: string[];
}

const READ_OPTIONS: ReadFilter[] = ['All', 'Unread', 'Read'];
const RISK_OPP_OPTIONS = [
  'High opportunity',
  'Medium opportunity',
  'High risk',
  'Medium risk',
  'Mixed impact',
];
const STATUS_OPTIONS = ['Under review', 'Proposed', 'Approved', 'Passed', 'In committee', 'Draft'];
const JURISDICTION_OPTIONS = ['City', 'State', 'Federal', 'Regional'];
const TOPIC_OPTIONS = [
  'Tenant protection',
  'Affordable housing finance',
  'Compliance',
  'Emergency aid',
  'Privacy',
  'Land use',
];

const ACTIVE_WINDOW_DAYS = 7;
const TODAY = new Date('2026-04-12');

export function PolicyPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PolicyDay0Page />;
  return <PolicyDayXPage />;
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  return (TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
}

function PolicyDayXPage() {
  const { isRead } = usePolicyRead();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    read: 'All',
    riskOpp: [],
    status: [],
    jurisdiction: [],
    topic: [],
  });

  function resetFilters() {
    setFilters({ read: 'All', riskOpp: [], status: [], jurisdiction: [], topic: [] });
  }

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.summary.toLowerCase().includes(q)) return false;
      }
      if (filters.read === 'Read' && !isRead(p.id)) return false;
      if (filters.read === 'Unread' && isRead(p.id)) return false;
      if (filters.riskOpp.length && !filters.riskOpp.includes(p.impactLevel)) return false;
      if (filters.status.length && !filters.status.includes(p.status)) return false;
      if (filters.jurisdiction.length && !filters.jurisdiction.includes(p.jurisdiction)) return false;
      if (filters.topic.length && !filters.topic.includes(p.topic)) return false;
      return true;
    });
  }, [search, filters, isRead]);

  const stats = useMemo(() => {
    const tracked = policies.length;
    const risk = policies.filter((p) => p.impactLevel.toLowerCase().includes('risk')).length;
    const opportunity = policies.filter((p) => p.impactLevel.toLowerCase().includes('opportunity')).length;
    const activeUpdates = policies.filter((p) => daysSince(p.lastUpdate) <= ACTIVE_WINDOW_DAYS).length;
    return { tracked, risk, opportunity, activeUpdates };
  }, []);

  const isFiltersDirty =
    filters.read !== 'All' ||
    filters.riskOpp.length > 0 ||
    filters.status.length > 0 ||
    filters.jurisdiction.length > 0 ||
    filters.topic.length > 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Policy</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Track legislative and regulatory changes that affect your mission.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tracked Policies" value={stats.tracked.toString()} />
        <StatCard label="Risk" value={stats.risk.toString()} />
        <StatCard label="Opportunity" value={stats.opportunity.toString()} />
        <StatCard label="Active Updates" value={stats.activeUpdates.toString()} sublabel={`Last ${ACTIVE_WINDOW_DAYS} days`} />
      </div>

      <div className="bg-surface border border-border-subtle rounded-md p-5">
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies..."
            className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
              focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-5">
          <SingleFilterPill
            label="Read"
            options={READ_OPTIONS}
            value={filters.read}
            onChange={(v) => setFilters((f) => ({ ...f, read: v }))}
          />
          <MultiFilterPill
            label="Risk & Opportunities"
            options={RISK_OPP_OPTIONS}
            selected={filters.riskOpp}
            onToggle={(v) =>
              setFilters((f) => ({
                ...f,
                riskOpp: f.riskOpp.includes(v) ? f.riskOpp.filter((x) => x !== v) : [...f.riskOpp, v],
              }))
            }
            onClear={() => setFilters((f) => ({ ...f, riskOpp: [] }))}
          />
          <MultiFilterPill
            label="Status"
            options={STATUS_OPTIONS}
            selected={filters.status}
            onToggle={(v) =>
              setFilters((f) => ({
                ...f,
                status: f.status.includes(v) ? f.status.filter((x) => x !== v) : [...f.status, v],
              }))
            }
            onClear={() => setFilters((f) => ({ ...f, status: [] }))}
          />
          <MultiFilterPill
            label="Jurisdiction"
            options={JURISDICTION_OPTIONS}
            selected={filters.jurisdiction}
            onToggle={(v) =>
              setFilters((f) => ({
                ...f,
                jurisdiction: f.jurisdiction.includes(v) ? f.jurisdiction.filter((x) => x !== v) : [...f.jurisdiction, v],
              }))
            }
            onClear={() => setFilters((f) => ({ ...f, jurisdiction: [] }))}
          />
          <MorePill
            topic={filters.topic}
            onToggleTopic={(v) =>
              setFilters((f) => ({
                ...f,
                topic: f.topic.includes(v) ? f.topic.filter((x) => x !== v) : [...f.topic, v],
              }))
            }
            onClearTopic={() => setFilters((f) => ({ ...f, topic: [] }))}
          />
          {isFiltersDirty && (
            <button
              onClick={resetFilters}
              className="ml-1 text-[12px] text-secondary hover:text-primary border-b border-transparent hover:border-primary/40 pb-px"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col divide-y divide-border-subtle">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-muted">
              No policies match these filters.
            </div>
          ) : (
            filtered.map((p) => <PolicyRow key={p.id} policy={p} unread={!isRead(p.id)} />)
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <p className="text-[13px] font-medium text-secondary">{label}</p>
        {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
      </div>
      <p className="metric-display text-primary">{value}</p>
    </div>
  );
}

function PolicyRow({ policy, unread }: { policy: Policy; unread: boolean }) {
  const isOpportunity = policy.impactLevel.toLowerCase().includes('opportunity');
  const isRisk = policy.impactLevel.toLowerCase().includes('risk');
  const impactVariant: ChipVariant = isOpportunity ? 'success' : isRisk ? 'danger' : 'warning';
  const formattedDate = new Date(policy.lastUpdate).toISOString().slice(0, 10);

  return (
    <Link
      to={`/policy/${policy.id}`}
      className="block py-5 first:pt-1 last:pb-1 no-underline group"
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <PolicyTag label={policy.impactLevel} variant={impactVariant} />
        <PolicyTag label={policy.status} variant="muted" />
        <PolicyTag
          label={policy.effectiveDate === 'Immediate' ? 'Effective now' : `Effective ${policy.effectiveDate}`}
          variant="muted"
        />
        {unread && <PolicyTag label="New" variant="accent" />}
      </div>
      <h3 className="text-[16px] leading-[22px] font-semibold text-primary group-hover:underline underline-offset-2 decoration-border-default mb-1">
        {policy.title}
      </h3>
      <p className="text-[12px] text-muted mb-2">
        Last update: {formattedDate}
        <span className="mx-2 text-border-subtle">·</span>
        {policy.jurisdiction === 'City' ? 'New York City, NY' : policy.jurisdiction}
      </p>
      <p className="text-[13px] text-secondary line-clamp-2 leading-[20px]">{policy.summary}</p>
    </Link>
  );
}

type ChipVariant = 'success' | 'danger' | 'warning' | 'muted' | 'accent';
const chipStyles: Record<ChipVariant, string> = {
  success: 'bg-success-soft text-success border-success/30',
  danger: 'bg-danger-soft text-danger border-danger/30',
  warning: 'bg-warning-soft text-warning border-warning/30',
  muted: 'bg-surface-muted text-secondary border-border-subtle',
  accent: 'bg-accent-soft text-primary border-accent/45',
};
function PolicyTag({ label, variant }: { label: string; variant: ChipVariant }) {
  return (
    <span
      className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full ${chipStyles[variant]}`}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter pill primitives
// ─────────────────────────────────────────────────────────────────────────────

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function PillTrigger({
  label,
  value,
  active,
  onClick,
  icon,
}: {
  label: string;
  value: string;
  active?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border text-[12px] font-medium transition-colors duration-150
        ${active
          ? 'bg-primary text-surface border-primary'
          : 'bg-surface text-primary border-border-subtle hover:border-border-default'
        }`}
    >
      {icon}
      <span className={active ? 'text-surface' : 'text-secondary'}>{label}</span>
      <span className={active ? 'text-surface font-semibold' : 'text-primary font-semibold'}>{value}</span>
      <ChevronDown size={12} className={active ? 'text-surface/70' : 'text-muted'} />
    </button>
  );
}

function SingleFilterPill({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadFilter[];
  value: ReadFilter;
  onChange: (v: ReadFilter) => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = value !== 'All';
  return (
    <div ref={ref} className="relative">
      <PillTrigger label={label} value={value} active={active} onClick={() => setOpen((o) => !o)} />
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[160px] py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-muted/60 ${
                value === opt ? 'text-primary font-semibold' : 'text-secondary'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiFilterPill({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = selected.length > 0;
  const valueLabel = selected.length === 0 ? 'All' : selected.length === 1 ? selected[0] : `${selected.length} selected`;
  return (
    <div ref={ref} className="relative">
      <PillTrigger label={label} value={valueLabel} active={active} onClick={() => setOpen((o) => !o)} />
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[240px] p-3">
          <div className="flex flex-col gap-2 mb-2">
            {options.map((opt) => (
              <Checkbox key={opt} label={opt} checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
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

function MorePill({
  topic,
  onToggleTopic,
  onClearTopic,
}: {
  topic: string[];
  onToggleTopic: (v: string) => void;
  onClearTopic: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = topic.length > 0;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border text-[12px] font-medium transition-colors duration-150
          ${active
            ? 'bg-primary text-surface border-primary'
            : 'bg-surface text-secondary border-border-subtle hover:border-border-default'
          }`}
      >
        <Filter size={12} className={active ? 'text-surface/80' : 'text-muted'} />
        More
        {active && <span className="font-semibold">({topic.length})</span>}
      </button>
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[260px] p-3">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Topic</p>
          <div className="flex flex-col gap-2 mb-2">
            {TOPIC_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={topic.includes(opt)} onChange={() => onToggleTopic(opt)} />
            ))}
          </div>
          {active && (
            <button
              onClick={() => {
                onClearTopic();
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
