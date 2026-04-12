import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMaturity } from '../lib/MaturityContext';
import { useWatchlist } from '../lib/WatchlistContext';
import { PolicyDay0Page } from './day0/PolicyDay0Page';
import { policies, Policy } from '../data/policies';
import { policyTopics, watchlist } from '../data/watchlist';
import {
  Button, Chip, SearchBar, Modal, Checkbox, PageHeader, SegmentedControl, WatchlistToggle, NarrativeSpineBadge, useToast,
} from '../components/ui';
import { Filter, Clock, AlertCircle, Bell, FolderOpen } from 'lucide-react';

const filterOptions = {
  jurisdiction: ['City', 'State', 'Federal', 'Regional'],
  status: ['Under review', 'Proposed', 'Approved', 'Passed', 'In committee', 'Draft'],
  topic: ['Tenant protection', 'Affordable housing finance', 'Compliance', 'Emergency aid', 'Privacy', 'Land use'],
  impactLevel: ['High opportunity', 'Medium opportunity', 'High risk', 'Medium risk', 'Mixed impact'],
};

const viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'topics', label: 'By topic' },
];

export function PolicyPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PolicyDay0Page />;
  return <PolicyDayXPage />;
}

function PolicyDayXPage() {
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [view, setView] = useState('list');
  const { watchedIds, toggleWatched } = useWatchlist();
  const toast = useToast();
  const [filters, setFilters] = useState<Record<string, string[]>>({
    jurisdiction: [],
    status: [],
    topic: [],
    impactLevel: [],
  });

  const toggleFilter = (key: string, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };
  const clearFilters = () => setFilters({ jurisdiction: [], status: [], topic: [], impactLevel: [] });
  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const toggleWatch = (id: string) => {
    const policy = policies.find(p => p.id === id);
    const wasWatching = watchedIds.has(id);
    toggleWatched(id);
    if (policy) {
      toast.show({
        type: wasWatching ? 'info' : 'success',
        title: wasWatching ? 'Removed from watchlist' : 'Added to watchlist',
        description: policy.title,
      });
    }
  };

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.summary.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.jurisdiction.length && !filters.jurisdiction.includes(p.jurisdiction)) return false;
      if (filters.status.length && !filters.status.includes(p.status)) return false;
      if (filters.topic.length && !filters.topic.includes(p.topic)) return false;
      if (filters.impactLevel.length && !filters.impactLevel.includes(p.impactLevel)) return false;
      return true;
    });
  }, [search, filters]);

  return (
    <>
      <PageHeader
        title="Policy"
        subtitle="Track legislative and regulatory changes that affect your mission"
        serif
        actions={
          <Link
            to="/policy/watchlist"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border-default rounded-sm text-sm font-medium text-primary no-underline hover:bg-surface-muted transition-colors"
          >
            <Bell size={14} />
            Watchlist
            <span className="text-[12px] text-muted">{watchlist.length}</span>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <PolicyStatCard label="Tracked policies" value={policies.length.toString()} />
        <PolicyStatCard label="High opportunity" value={policies.filter(p => p.impactLevel === 'High opportunity').length.toString()} variant="success" />
        <PolicyStatCard label="High risk" value={policies.filter(p => p.impactLevel === 'High risk').length.toString()} variant="danger" />
        <PolicyStatCard label="Active updates this week" value="4" />
      </div>

      {/* View toggle + filters bar */}
      <div className="flex items-center gap-3 mb-4">
        <SegmentedControl options={viewOptions} value={view} onChange={setView} />
        {view === 'list' && (
          <>
            <div className="flex-1 max-w-md">
              <SearchBar value={search} onChange={setSearch} placeholder="Search policies..." />
            </div>
            <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
              <Filter size={14} className="mr-2" />
              Filters {activeFilterCount > 0 && <span className="ml-1.5 text-[12px] bg-accent text-primary px-1.5 rounded-sm">{activeFilterCount}</span>}
            </Button>
          </>
        )}
      </div>

      {view === 'list' && activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="eyebrow-plain mr-1">Filters</span>
          {Object.entries(filters).map(([key, values]) =>
            values.map((v) => (
              <Chip key={`${key}-${v}`} label={v} onRemove={() => toggleFilter(key, v)} />
            ))
          )}
          <button onClick={clearFilters} className="text-[12px] text-secondary hover:text-primary border-b border-transparent hover:border-primary/40 pb-px">
            Clear all
          </button>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="bg-surface border border-border-subtle rounded-md p-12 text-center text-sm text-muted">
              No policies match your filters.
            </div>
          ) : (
            filtered.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                isWatching={watchedIds.has(policy.id)}
                onToggleWatch={() => toggleWatch(policy.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Topics view */}
      {view === 'topics' && (
        <div className="grid grid-cols-2 gap-4">
          {policyTopics.map(topic => {
            const topicPolicies = policies.filter(p => {
              // map data topic strings to topic ids loosely
              const map: Record<string, string> = {
                'Tenant protection': 'tenant-protection',
                'Affordable housing finance': 'affordable-housing',
                'Compliance': 'compliance',
                'Emergency aid': 'emergency-aid',
                'Privacy': 'privacy',
                'Land use': 'land-use',
              };
              return map[p.topic] === topic.id;
            });
            return (
              <TopicCard key={topic.id} topic={topic} policies={topicPolicies} watchedIds={watchedIds} />
            );
          })}
        </div>
      )}

      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter policies"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => {
              setFilterModalOpen(false);
              if (activeFilterCount > 0) {
                toast.show({
                  type: 'success',
                  title: `${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} applied`,
                  description: `Showing ${filtered.length} of ${policies.length} policies`,
                });
              }
            }}>Apply filters</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <FilterGroup title="Jurisdiction" options={filterOptions.jurisdiction} selected={filters.jurisdiction} onToggle={(v) => toggleFilter('jurisdiction', v)} />
          <FilterGroup title="Status" options={filterOptions.status} selected={filters.status} onToggle={(v) => toggleFilter('status', v)} />
          <FilterGroup title="Topic" options={filterOptions.topic} selected={filters.topic} onToggle={(v) => toggleFilter('topic', v)} />
          <FilterGroup title="Impact / risk" options={filterOptions.impactLevel} selected={filters.impactLevel} onToggle={(v) => toggleFilter('impactLevel', v)} />
        </div>
      </Modal>
    </>
  );
}

function PolicyCard({ policy, isWatching, onToggleWatch }: { policy: Policy; isWatching: boolean; onToggleWatch: () => void }) {
  const isOpportunity = policy.impactLevel.toLowerCase().includes('opportunity');
  const isRisk = policy.impactLevel.toLowerCase().includes('risk');
  const impactVariant = isOpportunity ? 'success' : isRisk ? 'danger' : 'warning';

  return (
    <div className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default hover:shadow-[0_1px_0_rgba(17,17,17,0.04)] transition-[border-color,box-shadow] duration-150 ease-out">
      <div className="flex items-start justify-between gap-4">
        <Link to={`/policy/${policy.id}`} className="flex-1 min-w-0 no-underline">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <Chip label={policy.jurisdiction} variant="info" />
            <Chip label={policy.topic} variant="default" />
            <span className="text-border-subtle">·</span>
            <p className="eyebrow-plain">{policy.status}</p>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-[18px] leading-[26px] font-semibold text-primary">{policy.title}</h3>
            <NarrativeSpineBadge id={policy.id} />
          </div>
          <p className="text-[14px] text-secondary line-clamp-2 mb-3">{policy.summary}</p>

          <div className="flex items-center gap-4 text-[13px] text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} /> Effective {policy.effectiveDate}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle size={12} /> {policy.teams.length} teams affected
            </span>
          </div>
        </Link>
        <div className="flex flex-col items-end gap-3">
          <Chip label={policy.impactLevel} variant={impactVariant} />
          <WatchlistToggle watching={isWatching} onToggle={onToggleWatch} size="sm" />
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic, policies, watchedIds }: { topic: any; policies: Policy[]; watchedIds: Set<string> }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md">
      <div className="px-5 py-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-secondary" />
            <h3 className="text-[15px] font-semibold text-primary">{topic.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted">{topic.policyCount} policies</span>
            {topic.recentActivity > 0 && (
              <span className="px-1.5 py-0.5 bg-accent-soft border border-accent text-[11px] font-medium text-primary rounded-sm">
                {topic.recentActivity} new
              </span>
            )}
          </div>
        </div>
        <p className="text-[13px] text-muted">{topic.description}</p>
      </div>
      <div className="divide-y divide-border-subtle">
        {policies.map(p => (
          <Link
            key={p.id}
            to={`/policy/${p.id}`}
            className="flex items-start justify-between gap-3 p-4 hover:bg-surface-muted/30 no-underline"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary line-clamp-1">{p.title}</p>
              <p className="text-[12px] text-muted mt-0.5">{p.jurisdiction} · {p.status} · Effective {p.effectiveDate}</p>
            </div>
            {watchedIds.has(p.id) && (
              <Bell size={12} className="text-accent flex-shrink-0 mt-1" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PolicyStatCard({ label, value, variant }: { label: string; value: string; variant?: 'success' | 'danger' }) {
  const colorMap = { success: 'text-success', danger: 'text-danger' };
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="eyebrow-plain mb-3">{label}</p>
      <p className={`metric-display ${variant ? colorMap[variant] : 'text-primary'}`}>{value}</p>
    </div>
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
