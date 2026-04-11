import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMaturity } from '../lib/MaturityContext';
import { PeersDay0Page } from './day0/PeersDay0Page';
import { peerOrgs, benchmarkData, PeerOrg } from '../data/peers';
import { isPeerTracked } from '../data/workspace';
import { Button, Chip, SearchBar, Modal, Checkbox, PageHeader, Tabs, NarrativeSpineBadge, useToast } from '../components/ui';
import { Filter, TrendingUp, TrendingDown, Lock, Building, BarChart3, BookOpen, ArrowUpRight, Star } from 'lucide-react';

const filterOptions = {
  missionArea: ['Tenant rights', 'Affordable housing', 'Family services', 'Homelessness', 'Community organizing', 'Housing research', 'Disaster preparedness'],
  geography: ['Bronx', 'Queens', 'Brooklyn', 'Manhattan', 'Citywide', 'Upstate'],
  orgSize: ['Small', 'Mid-size', 'Large'],
  revenueBand: ['$1M\u2013$3M', '$2M\u2013$5M', '$3M\u2013$7M', '$5M\u2013$10M', '$10M\u2013$20M'],
  channel: ['Email', 'Social media', 'Direct mail', 'Press', 'Community events', 'Text', 'In-person'],
  optInStatus: ['Opted in', 'Pending', 'Not opted in'],
};

const tabs = [
  { id: 'orgs', label: 'Peer organizations', count: peerOrgs.length },
  { id: 'campaigns', label: 'Campaign intelligence' },
  { id: 'benchmarks', label: 'Benchmarks' },
];

export function PeersPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PeersDay0Page />;
  return <PeersDayXPage />;
}

function PeersDayXPage() {
  const [activeTab, setActiveTab] = useState('orgs');
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    missionArea: [],
    geography: [],
    orgSize: [],
    optInStatus: [],
  });

  const toggleFilter = (key: string, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };
  const clearFilters = () => setFilters({ missionArea: [], geography: [], orgSize: [], optInStatus: [] });
  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const filtered = useMemo(() => {
    return peerOrgs.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.missionArea.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.optInStatus.length && !filters.optInStatus.includes(p.optInStatus)) return false;
      return true;
    });
  }, [search, filters]);

  return (
    <>
      <PageHeader
        title="Peers"
        subtitle="Benchmark, learn from, and share intelligence with similar organizations"
        serif
        actions={
          <Link
            to="/peers/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border-default rounded-sm text-sm font-medium text-primary no-underline hover:bg-surface-muted transition-colors"
          >
            <BookOpen size={14} />
            Campaign library
          </Link>
        }
      />

      {/* Consent banner — editorial, printed, with a left rule */}
      <div className="relative bg-info-soft/55 border border-info/30 rounded-md pl-5 pr-4 py-3.5 mb-6 flex items-start gap-3">
        <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-info" />
        <Lock size={15} className="text-info mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="eyebrow-plain mb-1">Data sharing</p>
          <p className="text-[13px] font-semibold text-primary tracking-tight">Aggregated only — anonymized benchmarks</p>
          <p className="text-[12px] text-secondary mt-1 leading-relaxed">
            Rivergate shares anonymized benchmark metrics with peer orgs. No donor or stakeholder details are shared. <button className="text-primary font-semibold border-b border-primary/40 hover:border-primary pb-px">Manage sharing →</button>
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Benchmark snapshot bar (always visible) */}
      <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
        <BenchmarkChartCard
          title="Email open rate"
          yours={benchmarkData.emailOpenRate.yours}
          peer={benchmarkData.emailOpenRate.peerAverage}
          top={benchmarkData.emailOpenRate.topQuartile}
          suffix="%"
        />
        <BenchmarkChartCard
          title="Donation conversion"
          yours={benchmarkData.donationConversion.yours}
          peer={benchmarkData.donationConversion.peerAverage}
          top={benchmarkData.donationConversion.topQuartile}
          suffix="%"
        />
        <BenchmarkChartCard
          title="Donor retention"
          yours={benchmarkData.donorRetention.yours}
          peer={benchmarkData.donorRetention.peerAverage}
          top={benchmarkData.donorRetention.topQuartile}
          suffix="%"
        />
      </div>

      {activeTab === 'orgs' && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 max-w-md">
              <SearchBar value={search} onChange={setSearch} placeholder="Search peer organizations..." />
            </div>
            <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
              <Filter size={14} className="mr-2" />
              Filters {activeFilterCount > 0 && <span className="ml-1.5 text-[12px] bg-accent text-primary px-1.5 rounded-sm">{activeFilterCount}</span>}
            </Button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {Object.entries(filters).map(([key, values]) =>
                values.map((v) => (
                  <Chip key={`${key}-${v}`} label={v} onRemove={() => toggleFilter(key, v)} />
                ))
              )}
              <button onClick={clearFilters} className="text-[13px] text-secondary hover:text-primary underline">
                Clear all
              </button>
            </div>
          )}

          {/* Peer org grid */}
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((peer) => <PeerOrgCard key={peer.id} peer={peer} />)}
          </div>
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-2 gap-4">
          {peerOrgs.flatMap(p => p.recentCampaigns.map((c, i) => ({ ...c, org: p.name, key: `${p.id}-${i}` }))).slice(0, 6).map((campaign) => (
            <CampaignInsightCard key={campaign.key} campaign={campaign} />
          ))}
        </div>
      )}

      {activeTab === 'benchmarks' && (
        <div className="bg-surface border border-border-subtle rounded-md p-6">
          <h3 className="text-[15px] font-semibold text-primary mb-4">Top messaging themes this quarter</h3>
          <div className="flex flex-col gap-3">
            {benchmarkData.topMessagingThemes.map((theme) => {
              const max = Math.max(...benchmarkData.topMessagingThemes.map(t => t.mentions));
              const pct = (theme.mentions / max) * 100;
              return (
                <div key={theme.theme}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-primary">{theme.theme}</span>
                    <span className="text-[13px] text-muted">{theme.mentions} peer orgs</span>
                  </div>
                  <div className="h-2 bg-surface-muted rounded-sm overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter peer organizations"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => setFilterModalOpen(false)}>Apply filters</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <FilterGroup title="Mission area" options={filterOptions.missionArea} selected={filters.missionArea || []} onToggle={(v) => toggleFilter('missionArea', v)} />
          <FilterGroup title="Geography" options={filterOptions.geography} selected={filters.geography || []} onToggle={(v) => toggleFilter('geography', v)} />
          <FilterGroup title="Org size" options={filterOptions.orgSize} selected={filters.orgSize || []} onToggle={(v) => toggleFilter('orgSize', v)} />
          <FilterGroup title="Opt-in status" options={filterOptions.optInStatus} selected={filters.optInStatus || []} onToggle={(v) => toggleFilter('optInStatus', v)} />
        </div>
      </Modal>
    </>
  );
}

function FilterGroup({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <h4 className="text-[13px] font-semibold text-primary mb-2">{title}</h4>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <Checkbox key={opt} label={opt} checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
        ))}
      </div>
    </div>
  );
}

function BenchmarkChartCard({ title, yours, peer, top, suffix }: { title: string; yours: number; peer: number; top: number; suffix: string }) {
  const max = Math.max(yours, peer, top) * 1.1;
  const yoursPct = (yours / max) * 100;
  const peerPct = (peer / max) * 100;
  const topPct = (top / max) * 100;
  const ahead = yours >= peer;

  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="eyebrow-plain mb-1.5">Benchmark</p>
          <h3 className="text-[14px] font-semibold text-primary tracking-tight">{title}</h3>
        </div>
        {ahead ? <TrendingUp size={14} className="text-success flex-shrink-0" /> : <TrendingDown size={14} className="text-danger flex-shrink-0" />}
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="metric-display">{yours}{suffix}</span>
        <span className={`text-[12px] font-medium tabular-nums ${ahead ? 'text-success' : 'text-danger'}`}>
          {ahead ? '+' : ''}{(yours - peer).toFixed(1)}{suffix} vs peers
        </span>
      </div>
      <div className="space-y-2 pt-3 border-t border-border-subtle">
        <BenchmarkBar label="You" value={yours} pct={yoursPct} suffix={suffix} highlighted />
        <BenchmarkBar label="Peer avg" value={peer} pct={peerPct} suffix={suffix} />
        <BenchmarkBar label="Top quartile" value={top} pct={topPct} suffix={suffix} dashed />
      </div>
    </div>
  );
}

function BenchmarkBar({ label, value, pct, suffix, highlighted, dashed }: { label: string; value: number; pct: number; suffix: string; highlighted?: boolean; dashed?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[11px] ${highlighted ? 'text-primary font-medium' : 'text-muted'}`}>{label}</span>
        <span className={`text-[11px] tabular-nums ${highlighted ? 'text-primary font-medium' : 'text-secondary'}`}>{value}{suffix}</span>
      </div>
      <div className="h-[6px] bg-surface-muted/70 border border-border-subtle/60 rounded-sm overflow-hidden relative">
        {dashed ? (
          <div className="absolute inset-y-0 left-0 border-r-[1.5px] border-dashed border-primary/60" style={{ width: `${pct}%` }} aria-hidden="true" />
        ) : (
          <div className={`h-full ${highlighted ? 'bg-accent' : 'bg-border-subtle'}`} style={{ width: `${pct}%` }} />
        )}
      </div>
    </div>
  );
}

function PeerOrgCard({ peer }: { peer: PeerOrg }) {
  const optInVariant = peer.optInStatus === 'Opted in' ? 'success' : peer.optInStatus === 'Pending' ? 'warning' : 'default';
  const toast = useToast();
  const [tracked, setTracked] = useState(isPeerTracked(peer.id));
  return (
    <Link
      to={`/peers/${peer.id}`}
      className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default hover:shadow-[0_1px_0_rgba(17,17,17,0.04)] transition-[border-color,box-shadow] duration-150 ease-out no-underline"
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-sm bg-surface border border-border-default flex items-center justify-center flex-shrink-0 shadow-[0_1px_0_rgba(17,17,17,0.04)]">
            <Building size={18} className="text-secondary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold text-primary truncate">{peer.name}</h3>
              <NarrativeSpineBadge id={peer.id} compact />
            </div>
            <p className="text-[13px] text-muted truncate">{peer.missionArea}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const next = !tracked;
              setTracked(next);
              toast.show({
                type: next ? 'success' : 'info',
                title: next ? 'Now tracking' : 'Stopped tracking',
                description: peer.name,
              });
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium border rounded-sm
              transition-colors duration-150
              ${tracked
                ? 'bg-accent-soft border-accent text-primary'
                : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'}`}
          >
            <Star size={11} className={tracked ? 'fill-accent text-primary' : ''} />
            {tracked ? 'Tracking' : 'Track'}
          </button>
          <Chip label={peer.optInStatus} variant={optInVariant} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border-subtle text-[12px]">
        <div>
          <p className="text-muted">Geography</p>
          <p className="text-primary font-medium">{peer.geography}</p>
        </div>
        <div>
          <p className="text-muted">Size</p>
          <p className="text-primary font-medium">{peer.orgSize.split(' (')[0]}</p>
        </div>
        <div>
          <p className="text-muted">Revenue</p>
          <p className="text-primary font-medium">{peer.revenueBand}</p>
        </div>
      </div>

      <div className="pt-3">
        <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">Recent campaigns</p>
        <div className="flex flex-col gap-1.5">
          {peer.recentCampaigns.map((c, i) => (
            <div key={i} className="text-[13px]">
              <p className="text-primary">{c.theme}</p>
              <p className="text-muted text-[12px]">{c.channels.join(' \u2022 ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
        <div>
          <p className="text-[12px] text-muted">{peer.benchmarkStat.label}</p>
          <p className="text-sm font-semibold text-primary">{peer.benchmarkStat.value}</p>
        </div>
        <ArrowUpRight size={14} className="text-muted" />
      </div>
    </Link>
  );
}

function CampaignInsightCard({ campaign }: { campaign: any }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 size={14} className="text-info" />
        <span className="text-[12px] font-medium text-muted uppercase tracking-wider">Campaign insight</span>
      </div>
      <h3 className="text-[15px] font-semibold text-primary mb-1">{campaign.theme}</h3>
      <p className="text-[13px] text-secondary mb-3">From {campaign.org}</p>
      <div className="flex flex-wrap gap-1.5">
        {campaign.channels.map((channel: string) => (
          <Chip key={channel} label={channel} variant="default" />
        ))}
      </div>
    </div>
  );
}
