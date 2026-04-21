import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, Download, Filter, Mail, Plus, Search, Trash2, Tag,
} from 'lucide-react';
import { Donor, Relationship } from '../../data/donors';
import { useDonors } from '../../lib/DonorsContext';
import { useMaturity } from '../../lib/MaturityContext';
import { DonorsListDay0Page } from '../day0/DonorsListDay0Page';
import { useToast, Checkbox, AddDonorModal, ComposeEmailModal } from '../../components/ui';

const RELATIONSHIP_OPTIONS: Relationship[] = ['Active', 'At-risk', 'Lapsed', 'Inactive'];
const TYPE_OPTIONS = [
  'Individual major donor',
  'Major donor',
  'Recurring donor',
  'Prospective donor',
  'Lapsed donor',
  'Foundation contact',
  'Corporate contact',
  'Small donor',
];
const RISK_OPTIONS = ['Low', 'Medium', 'High'];
const OWNER_OPTIONS = ['Leah Kim', 'Noah Stein', 'Marcus Bell'];
const STAGE_OPTIONS = ['Growing', 'Slipping', 'Early', 'Lapsed', 'Stewardship', 'Stable', 'Evaluation', 'Unqualified'];
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const TODAY = new Date('2026-04-12');
const NEW_WINDOW_DAYS = 7;

interface Filters {
  relationship: string[];
  type: string[];
  risk: string[];
  stage: string[];
  owner: string[];
}

export function DonorsListPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <DonorsListDay0Page />;
  return <DonorsListDayXPage />;
}

function DonorsListDayXPage() {
  const { donors, deleteMany, addDonor } = useDonors();
  const toast = useToast();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [emailModal, setEmailModal] = useState<{ open: boolean; recipients: string; target: 'bulk' | 'single'; names: string[] }>(
    { open: false, recipients: '', target: 'bulk', names: [] },
  );

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    relationship: [],
    type: [],
    risk: [],
    stage: [],
    owner: [],
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  function clearAllFilters() {
    setFilters({ relationship: [], type: [], risk: [], stage: [], owner: [] });
  }

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.persona.toLowerCase().includes(q)) return false;
      }
      if (filters.relationship.length && !filters.relationship.includes(d.relationship)) return false;
      if (filters.type.length && !filters.type.includes(d.donorType)) return false;
      if (filters.risk.length && !filters.risk.includes(d.risk)) return false;
      if (filters.stage.length && !filters.stage.includes(d.stage)) return false;
      if (filters.owner.length && !filters.owner.includes(d.accountOwner)) return false;
      return true;
    });
  }, [donors, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const stats = useMemo(() => {
    const total = donors.length;
    const inactive = donors.filter((d) => d.relationship === 'Inactive' || d.givingStatus === 'Inactive').length;
    const lapsed = donors.filter((d) => d.relationship === 'Lapsed').length;
    const newCount = donors.filter((d) => {
      const days = (TODAY.getTime() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return days <= NEW_WINDOW_DAYS;
    }).length;
    return { total, inactive, lapsed, newCount };
  }, [donors]);

  const filtersDirty =
    filters.relationship.length > 0 ||
    filters.type.length > 0 ||
    filters.risk.length > 0 ||
    filters.stage.length > 0 ||
    filters.owner.length > 0;

  const allOnPageSelected = paginated.length > 0 && paginated.every((d) => selectedIds.has(d.id));

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function togglePage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) paginated.forEach((d) => next.delete(d.id));
      else paginated.forEach((d) => next.add(d.id));
      return next;
    });
  }
  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    deleteMany(ids);
    clearSelection();
    toast.show({
      type: 'success',
      title: `${ids.length} ${ids.length === 1 ? 'donor' : 'donors'} deleted`,
      description: 'Removed for this session. Reloading the app restores them.',
    });
  }

  function handleBulkEmail() {
    const ids = Array.from(selectedIds);
    const names = donors.filter((d) => ids.includes(d.id)).map((d) => d.name);
    const recipients = names.length > 3 ? `${names.slice(0, 3).join(', ')} and ${names.length - 3} more` : names.join(', ');
    setEmailModal({ open: true, recipients, target: 'bulk', names });
  }
  function handleBulkAddToGroup() {
    toast.show({
      type: 'success',
      title: 'Added to group',
      description: `${selectedIds.size} ${selectedIds.size === 1 ? 'donor' : 'donors'} added.`,
    });
  }
  function handleBulkExport() {
    const ids = Array.from(selectedIds);
    exportDonorsCsv(donors.filter((d) => ids.includes(d.id)));
    toast.show({
      type: 'success',
      title: 'Export started',
      description: `CSV for ${ids.length} ${ids.length === 1 ? 'donor' : 'donors'} downloaded.`,
    });
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Donors</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Check and edit all donors in one place.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Donors" value={stats.total.toString()} />
        <StatCard label="Inactive Donors" value={stats.inactive.toString()} />
        <StatCard label="Lapsed Donors" value={stats.lapsed.toString()} />
        <StatCard label="New Donors" value={stats.newCount.toString()} sublabel={`Last ${NEW_WINDOW_DAYS} days`} />
      </div>

      <div className="bg-surface border border-border-subtle rounded-md">
        <div className="p-5 pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search donors..."
                className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </div>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default transition-colors"
            >
              <Plus size={13} /> Add Donor
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-5">
            <MultiFilterPill
              label="Relationship"
              options={RELATIONSHIP_OPTIONS}
              selected={filters.relationship}
              onToggle={(v) =>
                setFilters((f) => ({
                  ...f,
                  relationship: f.relationship.includes(v) ? f.relationship.filter((x) => x !== v) : [...f.relationship, v],
                }))
              }
              onClear={() => setFilters((f) => ({ ...f, relationship: [] }))}
            />
            <MultiFilterPill
              label="Type"
              options={TYPE_OPTIONS}
              selected={filters.type}
              onToggle={(v) =>
                setFilters((f) => ({
                  ...f,
                  type: f.type.includes(v) ? f.type.filter((x) => x !== v) : [...f.type, v],
                }))
              }
              onClear={() => setFilters((f) => ({ ...f, type: [] }))}
            />
            <MultiFilterPill
              label="Risk"
              options={RISK_OPTIONS}
              selected={filters.risk}
              onToggle={(v) =>
                setFilters((f) => ({
                  ...f,
                  risk: f.risk.includes(v) ? f.risk.filter((x) => x !== v) : [...f.risk, v],
                }))
              }
              onClear={() => setFilters((f) => ({ ...f, risk: [] }))}
            />
            <MorePill
              stage={filters.stage}
              owner={filters.owner}
              onToggleStage={(v) =>
                setFilters((f) => ({
                  ...f,
                  stage: f.stage.includes(v) ? f.stage.filter((x) => x !== v) : [...f.stage, v],
                }))
              }
              onToggleOwner={(v) =>
                setFilters((f) => ({
                  ...f,
                  owner: f.owner.includes(v) ? f.owner.filter((x) => x !== v) : [...f.owner, v],
                }))
              }
              onClearAll={() => setFilters((f) => ({ ...f, stage: [], owner: [] }))}
            />
            {filtersDirty && (
              <button
                onClick={clearAllFilters}
                className="ml-1 text-[12px] text-secondary hover:text-primary border-b border-transparent hover:border-primary/40 pb-px"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_100px] gap-4 items-center px-5 py-2.5 border-t border-b border-border-subtle bg-surface-muted/40">
            <div className="flex items-center">
              <button
                type="button"
                onClick={togglePage}
                aria-label={allOnPageSelected ? 'Deselect page' : 'Select page'}
                className={`w-[16px] h-[16px] rounded-sm border flex items-center justify-center ${
                  allOnPageSelected ? 'bg-primary border-primary' : 'bg-surface border-border-default'
                }`}
              >
                {allOnPageSelected && <span className="text-[10px] leading-none text-surface">✓</span>}
              </button>
            </div>
            <SortHeader label="Donor" />
            <SortHeader label="Donation" />
            <SortHeader label="Relationship" />
            <SortHeader label="Risk" />
            <div />
          </div>

          {paginated.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-muted">No donors match these filters.</div>
          ) : (
            paginated.map((donor) => (
              <DonorRow
                key={donor.id}
                donor={donor}
                selected={selectedIds.has(donor.id)}
                onToggle={() => toggleOne(donor.id)}
                onEmail={() =>
                  setEmailModal({
                    open: true,
                    recipients: donor.name,
                    target: 'single',
                    names: [donor.name],
                  })
                }
              />
            ))
          )}
        </div>

        {selectedIds.size === 0 ? (
          <FooterPagination
            page={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          />
        ) : (
          <BulkBar
            selectedCount={selectedIds.size}
            totalCount={stats.total}
            onCancel={clearSelection}
            onDelete={handleBulkDelete}
            onAddToGroup={handleBulkAddToGroup}
            onEmail={handleBulkEmail}
            onExport={handleBulkExport}
          />
        )}
      </div>

      <AddDonorModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        ownerOptions={OWNER_OPTIONS}
        onSubmit={(payload) => {
          const d = addDonor(payload);
          setAddModalOpen(false);
          toast.show({
            type: 'success',
            title: 'Donor added',
            description: `${d.name} is now in your list.`,
          });
        }}
      />

      <ComposeEmailModal
        open={emailModal.open}
        onClose={() => setEmailModal((s) => ({ ...s, open: false }))}
        recipients={emailModal.recipients}
        onSend={() => {
          toast.show({
            type: 'success',
            title: 'Email sent',
            description:
              emailModal.names.length === 1
                ? `Sent to ${emailModal.names[0]}.`
                : `Sent to ${emailModal.names.length} recipients.`,
          });
          setEmailModal((s) => ({ ...s, open: false }));
          if (emailModal.target === 'bulk') clearSelection();
        }}
      />
    </>
  );
}

function exportDonorsCsv(rows: Donor[]) {
  if (typeof window === 'undefined' || !rows.length) return;
  const header = ['Name', 'Email', 'Phone', 'Type', 'Relationship', 'Risk', 'Lifetime giving', 'Account owner'];
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    header.join(','),
    ...rows.map((d) => [
      d.name,
      d.email,
      d.phone,
      d.donorType,
      d.relationship,
      d.risk,
      d.lifetimeGiving ?? '',
      d.accountOwner,
    ].map(esc).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donors-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

function SortHeader({ label }: { label: string }) {
  return (
    <button type="button" className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-secondary hover:text-primary">
      {label}
      <ChevronDown size={11} className="opacity-50" />
    </button>
  );
}

function DonorRow({
  donor,
  selected,
  onToggle,
  onEmail,
}: {
  donor: Donor;
  selected: boolean;
  onToggle: () => void;
  onEmail: () => void;
}) {
  const relationshipLabel = donor.relationship;
  const donation = donor.lifetimeGiving ? `$${donor.lifetimeGiving.toLocaleString()}` : '—';
  const riskLabel = donor.risk === 'Low' ? 'Low' : donor.risk === 'Medium' ? 'Medium' : 'High';

  return (
    <div
      className={`relative grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_100px] gap-4 items-center px-5 py-4 border-b border-border-subtle last:border-b-0 transition-colors
        ${selected ? 'bg-accent-soft/40 hover:bg-accent-soft/55' : 'hover:bg-surface-muted/40'}`}
    >
      {selected && <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-label={selected ? `Deselect ${donor.name}` : `Select ${donor.name}`}
          className={`w-[16px] h-[16px] rounded-sm border flex items-center justify-center ${
            selected ? 'bg-primary border-primary' : 'bg-surface border-border-default'
          }`}
        >
          {selected && <span className="text-[10px] leading-none text-surface">✓</span>}
        </button>
      </div>
      <Link to={`/people/donors/${donor.id}`} className="text-[13px] font-medium text-primary no-underline hover:underline underline-offset-2 decoration-border-default truncate">
        {donor.name}
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="text-[13px] text-primary tabular-nums no-underline">
        {donation}
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="text-[13px] text-secondary no-underline">
        {relationshipLabel}
      </Link>
      <Link to={`/people/donors/${donor.id}`} className="text-[13px] text-secondary no-underline">
        {riskLabel}
      </Link>
      <div className="flex justify-end">
        <RowActionMenu donor={donor} onEmail={onEmail} />
      </div>
    </div>
  );
}

function RowActionMenu({ donor, onEmail }: { donor: Donor; onEmail: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const { deleteMany } = useDonors();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 h-7 px-2 text-[12px] font-medium text-secondary border border-border-subtle rounded-sm hover:border-border-default hover:text-primary transition-colors"
      >
        Action <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[160px] py-1">
          <MenuItem
            icon={<Mail size={12} />}
            label="Email"
            onClick={() => {
              setOpen(false);
              onEmail();
            }}
          />
          <MenuItem
            icon={<Tag size={12} />}
            label="Add to group"
            onClick={() => {
              toast.show({ type: 'success', title: 'Added to group', description: donor.name });
              setOpen(false);
            }}
          />
          <MenuItem
            icon={<Download size={12} />}
            label="Export"
            onClick={() => {
              exportDonorsCsv([donor]);
              toast.show({ type: 'success', title: 'Export downloaded', description: donor.name });
              setOpen(false);
            }}
          />
          <div className="my-1 border-t border-border-subtle" />
          <MenuItem
            icon={<Trash2 size={12} />}
            label="Delete"
            danger
            onClick={() => {
              deleteMany([donor.id]);
              toast.show({
                type: 'success',
                title: 'Donor deleted',
                description: `${donor.name} removed for this session.`,
              });
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-left px-3 py-1.5 text-[13px] hover:bg-surface-muted/60 ${
        danger ? 'text-danger' : 'text-primary'
      }`}
    >
      <span className={danger ? 'text-danger' : 'text-muted'}>{icon}</span>
      {label}
    </button>
  );
}

function BulkBar({
  selectedCount,
  totalCount,
  onCancel,
  onDelete,
  onAddToGroup,
  onEmail,
  onExport,
}: {
  selectedCount: number;
  totalCount: number;
  onCancel: () => void;
  onDelete: () => void;
  onAddToGroup: () => void;
  onEmail: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border-subtle bg-surface-muted/40">
      <p className="text-[13px] text-secondary">
        <span className="font-semibold text-primary">{selectedCount}</span>/{totalCount} selected
      </p>
      <div className="flex items-center gap-2">
        <BarButton onClick={onCancel} label="Cancel" />
        <BarButton onClick={onDelete} label="Delete" danger />
        <BarButton onClick={onAddToGroup} icon={<Plus size={12} />} label="Add to Group" />
        <BarButton onClick={onEmail} label="Send Email" />
        <BarButton onClick={onExport} icon={<Download size={12} />} label="Export Report" />
      </div>
    </div>
  );
}

function BarButton({ onClick, label, icon, danger }: { onClick: () => void; label: string; icon?: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-surface border rounded-sm transition-colors
        ${danger ? 'border-danger/30 text-danger hover:border-danger hover:bg-danger-soft' : 'border-border-subtle text-primary hover:border-border-default'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function FooterPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const pages = buildPageList(page, totalPages);
  return (
    <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-border-subtle bg-surface-muted/40 text-[12px] text-secondary">
      <span>{totalItems} total</span>
      <div className="flex items-center gap-1">
        <PageNavButton label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} />
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} className="px-1.5 text-muted">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={`min-w-[28px] h-7 px-2 text-[12px] font-medium rounded-sm border transition-colors
                ${p === page
                  ? 'bg-primary text-surface border-primary'
                  : 'bg-surface text-primary border-border-subtle hover:border-border-default'
                }`}
            >
              {p}
            </button>
          )
        )}
        <PageNavButton label="›" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
      </div>
      <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
    </div>
  );
}

function PageNavButton({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-w-[28px] h-7 px-2 text-[12px] font-medium rounded-sm border border-border-subtle bg-surface text-secondary
        hover:border-border-default hover:text-primary disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:text-secondary disabled:cursor-not-allowed transition-colors"
    >
      {label}
    </button>
  );
}

function PageSizeSelect({ value, onChange }: { value: number; onChange: (size: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 h-7 px-2 text-[12px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default text-primary"
      >
        {value} / page <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[100px] py-1">
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-muted/60 ${
                opt === value ? 'text-primary font-semibold' : 'text-secondary'
              }`}
            >
              {opt} / page
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function buildPageList(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | '…'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
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
  stage,
  owner,
  onToggleStage,
  onToggleOwner,
  onClearAll,
}: {
  stage: string[];
  owner: string[];
  onToggleStage: (v: string) => void;
  onToggleOwner: (v: string) => void;
  onClearAll: () => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const active = stage.length > 0 || owner.length > 0;
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
        {active && <span className="font-semibold">({stage.length + owner.length})</span>}
      </button>
      {open && (
        <div className="absolute left-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[280px] p-3">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Stage</p>
          <div className="flex flex-col gap-2 mb-3">
            {STAGE_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={stage.includes(opt)} onChange={() => onToggleStage(opt)} />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Account owner</p>
          <div className="flex flex-col gap-2 mb-2">
            {OWNER_OPTIONS.map((opt) => (
              <Checkbox key={opt} label={opt} checked={owner.includes(opt)} onChange={() => onToggleOwner(opt)} />
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
