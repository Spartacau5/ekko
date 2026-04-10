import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { policies, Policy } from '../data/policies';
import { Button, Chip, SearchBar, Modal, Checkbox, PageHeader } from '../components/ui';
import { Filter, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';

const filterOptions = {
  jurisdiction: ['City', 'State', 'Federal', 'Regional'],
  status: ['Under review', 'Proposed', 'Approved', 'Passed', 'In committee', 'Draft'],
  topic: ['Tenant protection', 'Affordable housing finance', 'Compliance', 'Emergency aid', 'Privacy', 'Land use'],
  impactLevel: ['High opportunity', 'Medium opportunity', 'High risk', 'Medium risk', 'Mixed impact'],
};

export function PolicyPage() {
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
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
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <PolicyStatCard label="Tracked policies" value={policies.length.toString()} />
        <PolicyStatCard label="High opportunity" value={policies.filter(p => p.impactLevel === 'High opportunity').length.toString()} variant="success" />
        <PolicyStatCard label="High risk" value={policies.filter(p => p.impactLevel === 'High risk').length.toString()} variant="danger" />
        <PolicyStatCard label="Active updates this week" value="4" />
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search policies..." />
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

      {/* Policy cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border-subtle rounded-md p-12 text-center text-sm text-muted">
            No policies match your filters.
          </div>
        ) : (
          filtered.map((policy) => <PolicyCard key={policy.id} policy={policy} />)
        )}
      </div>

      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter policies"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => setFilterModalOpen(false)}>Apply filters</Button>
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

function PolicyCard({ policy }: { policy: Policy }) {
  const isOpportunity = policy.impactLevel.toLowerCase().includes('opportunity');
  const isRisk = policy.impactLevel.toLowerCase().includes('risk');
  const impactVariant = isOpportunity ? 'success' : isRisk ? 'danger' : 'warning';

  return (
    <Link
      to={`/policy/${policy.id}`}
      className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Chip label={policy.jurisdiction} variant="info" />
            <Chip label={policy.topic} variant="default" />
            <span className="text-[12px] text-muted">&middot;</span>
            <span className="text-[12px] text-muted">{policy.status}</span>
          </div>
          <h3 className="text-[18px] leading-[26px] font-semibold text-primary mb-1.5">{policy.title}</h3>
          <p className="text-[14px] text-secondary line-clamp-2 mb-3">{policy.summary}</p>

          <div className="flex items-center gap-4 text-[13px] text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} /> Effective {policy.effectiveDate}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle size={12} /> {policy.teams.length} teams affected
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Chip label={policy.impactLevel} variant={impactVariant} />
          <ArrowUpRight size={14} className="text-muted" />
        </div>
      </div>
    </Link>
  );
}

function PolicyStatCard({ label, value, variant }: { label: string; value: string; variant?: 'success' | 'danger' }) {
  const colorMap = { success: 'text-success', danger: 'text-danger' };
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-[32px] leading-[36px] font-semibold ${variant ? colorMap[variant] : 'text-primary'}`}>{value}</p>
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
