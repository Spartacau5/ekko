// Merged Campaigns page — peer campaigns + our campaigns in one grid.
// Replaces the former Campaign library + the "Campaign intelligence" tab
// on Peers. Filters: Source / Type / Performance / More (channels).

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Filter, Info, Search } from 'lucide-react';
import { peerCampaigns, PeerCampaign, CampaignSource, CampaignTheme, CampaignChannel } from '../data/campaigns';
import { useMaturity } from '../lib/MaturityContext';
import { CampaignsDay0Page } from './day0/CampaignsDay0Page';
import { Checkbox } from '../components/ui';

const SOURCE_OPTIONS: CampaignSource[] = ['Peer organizations', 'Our campaigns'];
const TYPE_OPTIONS: CampaignTheme[] = [
  'Emergency aid',
  'Tenant rights',
  'Housing policy',
  'Year-end appeal',
  'Capital campaign',
  'Volunteer drive',
  'Stewardship',
  'Awareness',
  'Recurring acquisition',
  'Family services',
];
const PERFORMANCE_OPTIONS = ['High (>100% vs avg)', 'On par (80–100%)', 'Below avg (<80%)'];
const CHANNEL_OPTIONS: CampaignChannel[] = [
  'Email',
  'Direct mail',
  'Social media',
  'SMS',
  'Press',
  'Events',
  'Phone',
  'Door-to-door',
  'Webinars',
  'Partner network',
  'Community events',
];

export function CampaignLibraryPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <CampaignsDay0Page />;
  return <CampaignsDayXPage />;
}

function CampaignsDayXPage() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [perfFilter, setPerfFilter] = useState<string[]>([]);
  const [channelFilter, setChannelFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return peerCampaigns.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.orgName.toLowerCase().includes(q) &&
          !c.topMessage.toLowerCase().includes(q)
        )
          return false;
      }
      if (sourceFilter.length && !sourceFilter.includes(c.source)) return false;
      if (typeFilter.length && !typeFilter.includes(c.theme)) return false;
      if (perfFilter.length) {
        const match = perfFilter.some((bucket) => {
          if (bucket === 'High (>100% vs avg)') return c.performanceVsAvg > 100;
          if (bucket === 'On par (80–100%)') return c.performanceVsAvg >= 80 && c.performanceVsAvg <= 100;
          if (bucket === 'Below avg (<80%)') return c.performanceVsAvg < 80;
          return false;
        });
        if (!match) return false;
      }
      if (channelFilter.length && !c.channels.some((ch) => channelFilter.includes(ch))) return false;
      return true;
    });
  }, [search, sourceFilter, typeFilter, perfFilter, channelFilter]);

  const filtersDirty =
    sourceFilter.length > 0 || typeFilter.length > 0 || perfFilter.length > 0 || channelFilter.length > 0;

  function clearAll() {
    setSourceFilter([]);
    setTypeFilter([]);
    setPerfFilter([]);
    setChannelFilter([]);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          Campaigns
        </h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl flex items-center gap-1.5">
          Check what campaigns similar organizations are hosting and your previous campaigns.
          <span title="Combines peer campaign intelligence with your own campaign history."><Info size={13} className="text-muted" /></span>
        </p>
      </div>

      <div className="bg-surface border border-border-subtle rounded-md p-5 mb-6">
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
              focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <MultiFilterPill
            label="Source"
            options={SOURCE_OPTIONS}
            selected={sourceFilter}
            onToggle={(v) => setSourceFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setSourceFilter([])}
          />
          <MultiFilterPill
            label="Type"
            options={TYPE_OPTIONS}
            selected={typeFilter}
            onToggle={(v) => setTypeFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setTypeFilter([])}
          />
          <MultiFilterPill
            label="Performance"
            options={PERFORMANCE_OPTIONS}
            selected={perfFilter}
            onToggle={(v) => setPerfFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setPerfFilter([])}
          />
          <MorePill
            channels={channelFilter}
            onToggle={(v) => setChannelFilter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
            onClear={() => setChannelFilter([])}
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

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border-subtle rounded-md py-16 text-center text-[13px] text-muted">
          No campaigns match these filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </>
  );
}

function CampaignCard({ campaign }: { campaign: PeerCampaign }) {
  return (
    <Link
      to={`/peers/campaigns/${campaign.id}`}
      className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
    >
      <h3 className="text-[15px] font-semibold text-primary leading-snug mb-1">{campaign.title}</h3>
      <p className="text-[13px] text-secondary mb-3">{campaign.orgName}</p>
      <div className="flex flex-wrap gap-1.5">
        {campaign.channels.slice(0, 4).map((ch) => (
          <span
            key={ch}
            className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none bg-surface-muted text-secondary border border-border-subtle rounded-full"
          >
            {ch}
          </span>
        ))}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter pills
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
}: {
  label: string;
  value: string;
  active?: boolean;
  onClick: () => void;
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
      <span className={active ? 'text-surface' : 'text-secondary'}>{label}</span>
      <span className={active ? 'text-surface font-semibold' : 'text-primary font-semibold'}>{value}</span>
      <ChevronDown size={12} className={active ? 'text-surface/70' : 'text-muted'} />
    </button>
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
  channels,
  onToggle,
  onClear,
}: {
  channels: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = channels.length > 0;
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
        {active && <span className="font-semibold">({channels.length})</span>}
      </button>
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[240px] p-3">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Channels</p>
          <div className="flex flex-col gap-2 mb-2 max-h-[280px] overflow-y-auto">
            {CHANNEL_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={channels.includes(opt)} onChange={() => onToggle(opt)} />
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
