import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { donors, Donor } from '../data/donors';
import { Button, Chip, SearchBar, Modal, Checkbox, PageHeader, Tabs } from '../components/ui';
import { Filter, ArrowUpRight, Users, Building } from 'lucide-react';

const filterOptions = {
  donorType: ['Individual major donor', 'Recurring donor', 'Prospective donor', 'Lapsed donor', 'Foundation contact', 'Corporate contact', 'Major donor', 'Small donor'],
  givingStatus: ['Active', 'At risk', 'Warm', 'Inactive', 'Cold'],
  risk: ['Low', 'Medium', 'High'],
  stage: ['Growing', 'Slipping', 'Early', 'Lapsed', 'Stewardship', 'Stable', 'Evaluation', 'Unqualified'],
  accountOwner: ['Leah Kim', 'Noah Stein', 'Marcus Bell'],
};

const tabs = [
  { id: 'donors', label: 'Donors', count: donors.length },
  { id: 'groups', label: 'Groups' },
  { id: 'accounts', label: 'Accounts' },
];

export function PeoplePage() {
  const [activeTab, setActiveTab] = useState('donors');
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    donorType: [],
    givingStatus: [],
    risk: [],
    stage: [],
    accountOwner: [],
  });

  const toggleFilter = (key: string, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };

  const clearFilters = () => setFilters({ donorType: [], givingStatus: [], risk: [], stage: [], accountOwner: [] });

  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.persona.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.donorType.length && !filters.donorType.includes(d.donorType)) return false;
      if (filters.givingStatus.length && !filters.givingStatus.includes(d.givingStatus)) return false;
      if (filters.risk.length && !filters.risk.includes(d.risk)) return false;
      if (filters.stage.length && !filters.stage.includes(d.stage)) return false;
      if (filters.accountOwner.length && !filters.accountOwner.includes(d.accountOwner)) return false;
      return true;
    });
  }, [search, filters]);

  const stats = useMemo(() => {
    const active = donors.filter(d => d.givingStatus === 'Active').length;
    const atRisk = donors.filter(d => d.risk === 'High').length;
    const lifetime = donors.reduce((sum, d) => sum + (d.lifetimeGiving || 0), 0);
    return { total: donors.length, active, atRisk, lifetime };
  }, []);

  if (activeTab !== 'donors') {
    return (
      <>
        <PageHeader title="People" subtitle="Donors, groups, and accounts in one place" serif />
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="bg-surface border border-border-subtle rounded-md p-12 mt-6 flex flex-col items-center text-center">
          {activeTab === 'groups' ? <Users size={32} className="text-muted mb-3" /> : <Building size={32} className="text-muted mb-3" />}
          <h3 className="text-lg font-semibold text-primary mb-1">
            {activeTab === 'groups' ? 'Groups' : 'Accounts'} coming soon
          </h3>
          <p className="text-sm text-secondary max-w-md">
            {activeTab === 'groups'
              ? 'Organize donors into segments based on shared interests, geography, or campaign engagement.'
              : 'Manage corporate accounts, foundation relationships, and household giving with shared profiles.'}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="People"
        subtitle="Donors, groups, and accounts in one place"
        serif
        actions={<Button variant="secondary">Add donor</Button>}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
        <StatCard label="Total donors" value={stats.total.toString()} />
        <StatCard label="Active" value={stats.active.toString()} sublabel={`${Math.round(stats.active / stats.total * 100)}% of total`} />
        <StatCard label="High risk" value={stats.atRisk.toString()} sublabel="Need attention" trend="negative" />
        <StatCard label="Lifetime giving" value={`$${(stats.lifetime / 1000).toFixed(0)}K`} sublabel="Across all donors" />
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search donors by name or persona..." />
        </div>
        <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
          <Filter size={14} className="mr-2" />
          Filters {activeFilterCount > 0 && <span className="ml-1.5 text-[12px] bg-accent text-primary px-1.5 rounded-sm">{activeFilterCount}</span>}
        </Button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {Object.entries(filters).map(([key, values]) =>
            values.map((v) => (
              <Chip key={`${key}-${v}`} label={v} onRemove={() => toggleFilter(key, v)} variant="default" />
            ))
          )}
          <button onClick={clearFilters} className="text-[13px] text-secondary hover:text-primary underline">
            Clear all
          </button>
        </div>
      )}

      {/* Donors table */}
      <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-subtle bg-surface-muted/40">
          <div className="col-span-3 text-[12px] font-medium text-muted uppercase tracking-wider">Donor</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Type / Status</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Stage</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Risk</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Owner</div>
          <div className="col-span-1"></div>
        </div>

        {filteredDonors.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">No donors match your filters.</div>
        ) : (
          filteredDonors.map((donor) => <DonorRow key={donor.id} donor={donor} />)
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter donors"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => setFilterModalOpen(false)}>Apply filters</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <FilterGroup title="Donor type" options={filterOptions.donorType} selected={filters.donorType} onToggle={(v) => toggleFilter('donorType', v)} />
          <FilterGroup title="Giving status" options={filterOptions.givingStatus} selected={filters.givingStatus} onToggle={(v) => toggleFilter('givingStatus', v)} />
          <FilterGroup title="Risk level" options={filterOptions.risk} selected={filters.risk} onToggle={(v) => toggleFilter('risk', v)} />
          <FilterGroup title="Relationship stage" options={filterOptions.stage} selected={filters.stage} onToggle={(v) => toggleFilter('stage', v)} />
          <FilterGroup title="Account owner" options={filterOptions.accountOwner} selected={filters.accountOwner} onToggle={(v) => toggleFilter('accountOwner', v)} />
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

function StatCard({ label, value, sublabel, trend }: { label: string; value: string; sublabel?: string; trend?: 'positive' | 'negative' }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-[32px] leading-[36px] font-semibold text-primary">{value}</p>
      {sublabel && (
        <p className={`text-[13px] mt-1 ${trend === 'negative' ? 'text-danger' : 'text-muted'}`}>{sublabel}</p>
      )}
    </div>
  );
}

function DonorRow({ donor }: { donor: Donor }) {
  const riskVariant = donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success';
  const statusVariant = donor.givingStatus === 'Active' ? 'success' : donor.givingStatus === 'At risk' || donor.givingStatus === 'Inactive' ? 'danger' : 'warning';

  return (
    <Link
      to={`/people/${donor.id}`}
      className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border-subtle last:border-0 hover:bg-surface-muted/30 transition-colors items-center no-underline"
    >
      <div className="col-span-3">
        <p className="text-sm font-medium text-primary">{donor.name}</p>
        <p className="text-[13px] text-muted truncate">{donor.persona}</p>
      </div>
      <div className="col-span-2">
        <p className="text-[13px] text-primary">{donor.donorType}</p>
        <Chip label={donor.givingStatus} variant={statusVariant} />
      </div>
      <div className="col-span-2">
        <span className="text-[13px] text-primary">{donor.stage}</span>
      </div>
      <div className="col-span-2">
        <Chip label={donor.risk} variant={riskVariant} />
      </div>
      <div className="col-span-2">
        <p className="text-[13px] text-secondary">{donor.accountOwner}</p>
      </div>
      <div className="col-span-1 flex justify-end">
        <ArrowUpRight size={14} className="text-muted" />
      </div>
    </Link>
  );
}
