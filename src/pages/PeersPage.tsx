import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Filter, Search } from 'lucide-react';
import { useMaturity } from '../lib/MaturityContext';
import { PeersDay0Page } from './day0/PeersDay0Page';
import { peerOrgs, PeerOrg } from '../data/peers';
import { Checkbox } from '../components/ui';

type OptInFilter = 'All' | 'Opted in' | 'Pending' | 'Not opted in';

const SIZE_OPTIONS = ['Small', 'Mid-size', 'Large'];
const MISSION_OPTIONS = [
  'Tenant rights and legal advocacy',
  'Tenant services and housing education',
  'Family housing and child welfare',
  'Affordable housing development',
  'Homelessness prevention and shelter',
  'Community organizing and neighborhood development',
  'Housing research and policy innovation',
  'Disaster preparedness and housing resilience',
];
const REVENUE_OPTIONS = ['$1M–$3M', '$2M–$4M', '$2M–$5M', '$3M–$7M', '$4M–$7M', '$4M–$8M', '$5M–$10M', '$10M–$20M'];
const GEOGRAPHY_OPTIONS = ['Bronx', 'Queens', 'Brooklyn', 'Manhattan', 'Lower East Side', 'Citywide', 'Upstate'];

export function PeersPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PeersDay0Page />;
  return <OrganizationsDayXPage />;
}

function OrganizationsDayXPage() {
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [missionFilter, setMissionFilter] = useState<string[]>([]);
  const [optInFilter, setOptInFilter] = useState<OptInFilter>('All');
  const [revenueFilter, setRevenueFilter] = useState<string[]>([]);
  const [geographyFilter, setGeographyFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return peerOrgs.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.missionArea.toLowerCase().includes(q)) return false;
      }
      if (sizeFilter.length && !sizeFilter.some((s) => p.orgSize.startsWith(s))) return false;
      if (missionFilter.length && !missionFilter.includes(p.missionArea)) return false;
      if (optInFilter !== 'All' && p.optInStatus !== optInFilter) return false;
      if (revenueFilter.length && !revenueFilter.includes(p.revenueBand)) return false;
      if (geographyFilter.length && !geographyFilter.some((g) => p.geography.includes(g))) return false;
      return true;
    });
  }, [search, sizeFilter, missionFilter, optInFilter, revenueFilter, geographyFilter]);

  const filtersDirty =
    sizeFilter.length > 0 ||
    missionFilter.length > 0 ||
    optInFilter !== 'All' ||
    revenueFilter.length > 0 ||
    geographyFilter.length > 0;

  function clearAll() {
    setSizeFilter([]);
    setMissionFilter([]);
    setOptInFilter('All');
    setRevenueFilter([]);
    setGeographyFilter([]);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Organizations</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Compare your performance against similar organizations to see where you stand.
        </p>
      </div>

      <div className="bg-surface border border-border-subtle rounded-md p-5 mb-6">
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search peer organizations..."
            className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
              focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <MultiFilterPill
            label="Size"
            options={SIZE_OPTIONS}
            selected={sizeFilter}
            onToggle={(v) => setSizeFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setSizeFilter([])}
          />
          <MultiFilterPill
            label="Mission Area"
            options={MISSION_OPTIONS}
            selected={missionFilter}
            onToggle={(v) => setMissionFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setMissionFilter([])}
          />
          <SingleFilterPill
            label="Opt-in Status"
            options={['All', 'Opted in', 'Pending', 'Not opted in']}
            value={optInFilter}
            onChange={(v) => setOptInFilter(v as OptInFilter)}
          />
          <MorePill
            revenue={revenueFilter}
            geography={geographyFilter}
            onToggleRevenue={(v) => setRevenueFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onToggleGeography={(v) => setGeographyFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClearAll={() => {
              setRevenueFilter([]);
              setGeographyFilter([]);
            }}
          />
          {filtersDirty && (
            <button
              onClick={clearAll}
              className="ml-1 text-[12px] text-secondary hover:text-primary border-b border-transparent hover:border-primary/40 pb-px"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border-subtle rounded-md py-16 text-center text-[13px] text-muted">
            No peer organizations match these filters.
          </div>
        ) : (
          filtered.map((peer) => <PeerRow key={peer.id} peer={peer} />)
        )}
      </div>
    </>
  );
}

function PeerRow({ peer }: { peer: PeerOrg }) {
  const size = peer.orgSize.split(' (')[0];
  const optInChipStyle =
    peer.optInStatus === 'Opted in'
      ? 'bg-success-soft text-success border-success/30'
      : peer.optInStatus === 'Pending'
      ? 'bg-warning-soft text-warning border-warning/30'
      : 'bg-surface-muted text-secondary border-border-subtle';

  return (
    <Link
      to={`/peers/${peer.id}`}
      className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-sm bg-surface-muted border border-border-subtle flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-primary truncate">{peer.name}</h3>
            <span className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full flex-shrink-0 ${optInChipStyle}`}>
              {peer.optInStatus}
            </span>
          </div>
          <p className="text-[13px] text-secondary truncate">{peer.missionArea}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border-subtle">
        <MetaItem label="Geography" value={peer.geography} />
        <MetaItem label="Size" value={size} />
        <MetaItem label="Revenue" value={peer.revenueBand} />
        <MetaItem label="Type" value={peer.orgType} />
      </div>

      <div className="pt-4">
        <p className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">Recent Campaigns</p>
        <div className="grid grid-cols-2 gap-4">
          {peer.recentCampaigns.map((c, i) => (
            <div key={i}>
              <p className="text-[13px] font-semibold text-primary leading-snug">{c.theme}</p>
              <p className="text-[12px] text-muted mt-0.5">{c.channels.slice(0, 3).join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-primary font-medium">{value}</p>
    </div>
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
  options: string[];
  value: string;
  onChange: (v: string) => void;
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
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[260px] p-3">
          <div className="flex flex-col gap-2 mb-2 max-h-[280px] overflow-y-auto">
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
  revenue,
  geography,
  onToggleRevenue,
  onToggleGeography,
  onClearAll,
}: {
  revenue: string[];
  geography: string[];
  onToggleRevenue: (v: string) => void;
  onToggleGeography: (v: string) => void;
  onClearAll: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = revenue.length > 0 || geography.length > 0;
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
        {active && <span className="font-semibold">({revenue.length + geography.length})</span>}
      </button>
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[280px] p-3">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Revenue</p>
          <div className="flex flex-col gap-2 mb-3">
            {REVENUE_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={revenue.includes(opt)} onChange={() => onToggleRevenue(opt)} />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Geography</p>
          <div className="flex flex-col gap-2 mb-2">
            {GEOGRAPHY_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={geography.includes(opt)} onChange={() => onToggleGeography(opt)} />
            ))}
          </div>
          {active && (
            <button
              onClick={() => {
                onClearAll();
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
