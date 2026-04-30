import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Download, Mail, Plus, Search, Trash2, Copy, X } from 'lucide-react';
import { DonorGroup } from '../../data/groups';
import { useGroups } from '../../lib/GroupsContext';
import { useDonors } from '../../lib/DonorsContext';
import { useMaturity } from '../../lib/MaturityContext';
import { GroupsListDay0Page } from '../day0/GroupsListDay0Page';
import { useToast } from '../../components/ui';

function engagementLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 70) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function GroupsListPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <GroupsListDay0Page />;
  return <GroupsListDayXPage />;
}

function GroupsListDayXPage() {
  const { groups, deleteMany, addGroup } = useGroups();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return groups;
    const q = search.toLowerCase();
    return groups.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q),
    );
  }, [groups, search]);

  const totalLifetime = useMemo(
    () => groups.reduce((sum, g) => sum + g.totalLifetime, 0),
    [groups],
  );

  function formatLifetime(value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
    return `$${value.toLocaleString()}`;
  }

  function handleCreateGroup(input: { name: string; description: string; memberIds: string[] }) {
    const g = addGroup(input);
    toast.show({
      type: 'success',
      title: 'Group created',
      description: `${g.name} — ${g.memberCount} ${g.memberCount === 1 ? 'member' : 'members'}`,
    });
    setModalOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Groups" value={groups.length.toString()} />
        <div className="col-span-2">
          <StatCard label="Lifetime Giving" value={formatLifetime(totalLifetime)} />
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-md">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="w-full h-10 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default transition-colors"
            >
              <Plus size={13} /> Add Group
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_100px] gap-4 items-center px-5 py-2.5 border-t border-b border-border-subtle bg-surface-muted/40">
          <SortHeader label="Group" />
          <SortHeader label="Donor Count" />
          <SortHeader label="Donation" />
          <SortHeader label="Engagement" />
          <div />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-muted">
            {search ? 'No groups match your search.' : 'No groups yet. Create one to get started.'}
          </div>
        ) : (
          filtered.map((g) => (
            <GroupRow
              key={g.id}
              group={g}
              onDelete={() => {
                deleteMany([g.id]);
                toast.show({
                  type: 'success',
                  title: 'Group deleted',
                  description: `${g.name} removed for this session.`,
                });
              }}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <AddGroupModal onClose={() => setModalOpen(false)} onSubmit={handleCreateGroup} />
      )}
    </>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[13px] font-medium text-secondary mb-3">{label}</p>
      <p className="metric-display text-primary">{value}</p>
    </div>
  );
}

function GroupRow({ group, onDelete }: { group: DonorGroup; onDelete: () => void }) {
  const donation =
    group.totalLifetime >= 1_000_000
      ? `$${(group.totalLifetime / 1_000_000).toFixed(2)}M`
      : `$${group.totalLifetime.toLocaleString()}`;
  const engagement = engagementLabel(group.engagementScore);

  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_100px] gap-4 items-center px-5 py-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-muted/40 transition-colors">
      <Link
        to={`/people/groups/${group.id}`}
        className="text-[13px] font-medium text-primary no-underline hover:underline underline-offset-2 decoration-border-default truncate"
      >
        {group.name}
      </Link>
      <Link to={`/people/groups/${group.id}`} className="text-[13px] text-primary tabular-nums no-underline">
        {group.memberCount}
      </Link>
      <Link to={`/people/groups/${group.id}`} className="text-[13px] text-primary tabular-nums no-underline">
        {donation}
      </Link>
      <Link to={`/people/groups/${group.id}`} className="text-[13px] text-secondary no-underline">
        {engagement}
      </Link>
      <div className="flex justify-end">
        <RowActionMenu group={group} onDelete={onDelete} />
      </div>
    </div>
  );
}

function RowActionMenu({ group, onDelete }: { group: DonorGroup; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function fire(label: string, type: 'success' | 'info' = 'success') {
    toast.show({ type, title: label, description: group.name });
    setOpen(false);
  }

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
        <div className="absolute right-0 mt-1.5 z-20 bg-surface border border-border-default rounded-sm shadow-md min-w-[170px] py-1">
          <MenuItem icon={<Mail size={12} />} label="Email all" onClick={() => fire('Email composer opened')} />
          <MenuItem icon={<Copy size={12} />} label="Edit criteria" onClick={() => fire('Edit criteria opened', 'info')} />
          <MenuItem icon={<Download size={12} />} label="Duplicate" onClick={() => fire('Group duplicated')} />
          <div className="my-1 border-t border-border-subtle" />
          <MenuItem
            icon={<Trash2 size={12} />}
            label="Delete"
            danger
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Add Group modal
// ─────────────────────────────────────────────────────────────────────────────

function AddGroupModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: { name: string; description: string; memberIds: string[] }) => void;
}) {
  const { donors } = useDonors();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const filteredDonors = useMemo(() => {
    if (!memberSearch) return donors;
    const q = memberSearch.toLowerCase();
    return donors.filter((d) => d.name.toLowerCase().includes(q) || d.persona.toLowerCase().includes(q));
  }, [donors, memberSearch]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const canSubmit = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div
        className="bg-surface border border-border-default rounded-md shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[16px] font-semibold text-primary">Add group</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-primary">Group name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q2 Major Donor Outreach"
              className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-primary">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group for?"
              rows={2}
              className="px-3 py-2 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted resize-none
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-primary">Members</span>
              <span className="text-[12px] text-muted">
                {selectedIds.size} selected
              </span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search donors..."
                className="w-full h-9 pl-8 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </div>
            <div className="border border-border-subtle rounded-sm max-h-[260px] overflow-y-auto">
              {filteredDonors.length === 0 ? (
                <div className="p-4 text-[13px] text-muted text-center">No donors match.</div>
              ) : (
                filteredDonors.map((d) => {
                  const isSelected = selectedIds.has(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggle(d.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left border-b border-border-subtle last:border-b-0 transition-colors
                        ${isSelected ? 'bg-accent-soft/40 hover:bg-accent-soft/55' : 'hover:bg-surface-muted/40'}`}
                    >
                      <span
                        className={`w-[16px] h-[16px] rounded-sm border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary border-primary' : 'bg-surface border-border-default'
                        }`}
                      >
                        {isSelected && <span className="text-[10px] leading-none text-surface">✓</span>}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-primary truncate">{d.name}</p>
                        <p className="text-[12px] text-muted truncate">{d.persona}</p>
                      </div>
                      <span className="text-[12px] text-secondary">{d.relationship}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle bg-surface-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center h-9 px-4 text-[13px] font-medium text-secondary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ name: name.trim(), description: description.trim(), memberIds: Array.from(selectedIds) })}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium bg-brand text-white border border-brand rounded-sm hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create group
          </button>
        </div>
      </div>
    </div>
  );
}
