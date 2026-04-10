import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { donors, Donor } from '../../data/donors';
import { savedViews } from '../../data/savedViews';
import {
  Button, Chip, SearchBar, Modal, Checkbox, SavedViewsBar, Pagination, EmptyState,
} from '../../components/ui';
import {
  Filter, ArrowUpRight, ArrowUp, ArrowDown, ChevronsUpDown, Mail, Download, Tag, Users as UsersIcon,
} from 'lucide-react';

const filterOptions = {
  donorType: ['Individual major donor', 'Recurring donor', 'Prospective donor', 'Lapsed donor', 'Foundation contact', 'Corporate contact', 'Major donor', 'Small donor'],
  givingStatus: ['Active', 'At risk', 'Warm', 'Inactive', 'Cold'],
  risk: ['Low', 'Medium', 'High'],
  stage: ['Growing', 'Slipping', 'Early', 'Lapsed', 'Stewardship', 'Stable', 'Evaluation', 'Unqualified'],
  accountOwner: ['Leah Kim', 'Noah Stein', 'Marcus Bell'],
};

type SortField = 'name' | 'lifetimeGiving' | 'lastGift' | 'risk' | 'stage';
type SortDir = 'asc' | 'desc';

export function DonorsListPage() {
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    donorType: [],
    givingStatus: [],
    risk: [],
    stage: [],
    accountOwner: [],
  });
  const [activeViewId, setActiveViewId] = useState<string | null>('view-major-active');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const donorViews = savedViews.filter(v => v.scope === 'donors');

  const toggleFilter = (key: string, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
    setActiveViewId(null);
  };
  const clearFilters = () => {
    setFilters({ donorType: [], givingStatus: [], risk: [], stage: [], accountOwner: [] });
    setActiveViewId(null);
  };
  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  // When picking a saved view, apply its filters
  const applyView = (id: string | null) => {
    setActiveViewId(id);
    if (id === null) {
      setFilters({ donorType: [], givingStatus: [], risk: [], stage: [], accountOwner: [] });
    } else {
      const view = donorViews.find(v => v.id === id);
      if (view) {
        setFilters({
          donorType: view.filters.donorType || [],
          givingStatus: view.filters.givingStatus || [],
          risk: view.filters.risk || [],
          stage: view.filters.stage || [],
          accountOwner: view.filters.accountOwner || [],
        });
      }
    }
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = donors.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.persona.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.donorType.length && !filters.donorType.includes(d.donorType)) return false;
      if (filters.givingStatus.length && !filters.givingStatus.includes(d.givingStatus)) return false;
      if (filters.risk.length && !filters.risk.includes(d.risk)) return false;
      if (filters.stage.length && !filters.stage.includes(d.stage)) return false;
      if (filters.accountOwner.length && !filters.accountOwner.includes(d.accountOwner)) return false;
      return true;
    });

    const riskOrder = { Low: 1, Medium: 2, High: 3 };
    const stageOrder: Record<string, number> = { Growing: 1, Stewardship: 2, Stable: 3, Evaluation: 4, Early: 5, Slipping: 6, Lapsed: 7, Unqualified: 8 };

    filtered.sort((a, b) => {
      let av: any, bv: any;
      switch (sortField) {
        case 'name':
          av = a.name; bv = b.name; break;
        case 'lifetimeGiving':
          av = a.lifetimeGiving || 0; bv = b.lifetimeGiving || 0; break;
        case 'lastGift':
          av = typeof a.lastGift === 'number' ? a.lastGift : 0;
          bv = typeof b.lastGift === 'number' ? b.lastGift : 0;
          break;
        case 'risk':
          av = riskOrder[a.risk]; bv = riskOrder[b.risk]; break;
        case 'stage':
          av = stageOrder[a.stage] || 99; bv = stageOrder[b.stage] || 99; break;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, filters, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);
  const allOnPageSelected = paginated.length > 0 && paginated.every(d => selectedIds.has(d.id));

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const togglePageSelection = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allOnPageSelected) paginated.forEach(d => next.delete(d.id));
      else paginated.forEach(d => next.add(d.id));
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  return (
    <>
      {/* Saved views bar + actions */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <SavedViewsBar
          views={donorViews}
          activeViewId={activeViewId}
          onSelect={applyView}
          onSaveNew={() => {}}
        />
        <Button variant="secondary">+ Add donor</Button>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search donors by name or persona..."
          />
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

      {/* Selection bar (appears when items selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-4 mb-4 px-4 py-2.5 bg-accent-soft border border-accent rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} {selectedIds.size === 1 ? 'donor' : 'donors'} selected
            </span>
            <button onClick={clearSelection} className="text-[13px] text-secondary hover:text-primary underline">
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary"><Mail size={13} className="mr-1.5" />Email</Button>
            <Button size="sm" variant="secondary"><Tag size={13} className="mr-1.5" />Add to group</Button>
            <Button size="sm" variant="secondary"><Download size={13} className="mr-1.5" />Export</Button>
          </div>
        </div>
      )}

      {/* Donors table */}
      <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-subtle bg-surface-muted/40 items-center">
          <div className="col-span-1 flex items-center">
            <button
              onClick={togglePageSelection}
              className={`w-[18px] h-[18px] rounded-sm border flex items-center justify-center
                ${allOnPageSelected ? 'bg-accent border-border-default' : 'bg-surface border-border-subtle'}`}
            >
              {allOnPageSelected && <span className="text-[11px] font-bold text-primary leading-none">\u2713</span>}
            </button>
          </div>
          <SortHeader label="Donor" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="col-span-3" />
          <SortHeader label="Lifetime" field="lifetimeGiving" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="col-span-2" />
          <SortHeader label="Stage" field="stage" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="col-span-2" />
          <SortHeader label="Risk" field="risk" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="col-span-1" />
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Owner</div>
          <div className="col-span-1"></div>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            icon={<UsersIcon size={32} />}
            title="No donors match your filters"
            description="Try adjusting your filters or saved view."
            action={{ label: 'Clear filters', onClick: clearFilters }}
          />
        ) : (
          paginated.map((donor) => (
            <DonorRow
              key={donor.id}
              donor={donor}
              selected={selectedIds.has(donor.id)}
              onToggleSelect={() => toggleSelection(donor.id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredAndSorted.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredAndSorted.length}
            pageSize={pageSize}
          />
        </div>
      )}

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

function SortHeader({ label, field, sortField, sortDir, onSort, className }: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
  className?: string;
}) {
  const isActive = sortField === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={`${className} text-[12px] font-medium text-muted uppercase tracking-wider flex items-center gap-1 hover:text-primary transition-colors`}
    >
      {label}
      {isActive ? (
        sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
      ) : (
        <ChevronsUpDown size={11} className="opacity-40" />
      )}
    </button>
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

function DonorRow({ donor, selected, onToggleSelect }: { donor: Donor; selected: boolean; onToggleSelect: () => void }) {
  const riskVariant = donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success';

  return (
    <div className={`grid grid-cols-12 gap-4 px-5 py-4 border-b border-border-subtle last:border-0 items-center transition-colors
      ${selected ? 'bg-accent-soft/30' : 'hover:bg-surface-muted/30'}`}>
      <div className="col-span-1 flex items-center">
        <button
          onClick={(e) => { e.preventDefault(); onToggleSelect(); }}
          className={`w-[18px] h-[18px] rounded-sm border flex items-center justify-center
            ${selected ? 'bg-accent border-border-default' : 'bg-surface border-border-subtle'}`}
        >
          {selected && <span className="text-[11px] font-bold text-primary leading-none">\u2713</span>}
        </button>
      </div>
      <Link to={`/people/donors/${donor.id}`} className="col-span-3 no-underline">
        <p className="text-sm font-medium text-primary">{donor.name}</p>
        <p className="text-[13px] text-muted truncate">{donor.persona}</p>
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="col-span-2 no-underline">
        <p className="text-sm text-primary font-medium">
          {donor.lifetimeGiving ? `$${donor.lifetimeGiving.toLocaleString()}` : '\u2014'}
        </p>
        <p className="text-[12px] text-muted">
          Last: {typeof donor.lastGift === 'number' ? `$${donor.lastGift.toLocaleString()}` : donor.lastGift || '\u2014'}
        </p>
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="col-span-2 no-underline">
        <span className="text-[13px] text-primary">{donor.stage}</span>
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="col-span-1 no-underline">
        <Chip label={donor.risk} variant={riskVariant} />
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="col-span-2 no-underline">
        <p className="text-[13px] text-secondary">{donor.accountOwner}</p>
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="col-span-1 flex justify-end no-underline">
        <ArrowUpRight size={14} className="text-muted" />
      </Link>
    </div>
  );
}
