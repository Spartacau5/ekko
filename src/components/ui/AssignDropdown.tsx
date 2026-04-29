// AssignDropdown — the "[Assign ▾]" control on Recommended Action cards and
// task cards. Unassigned by default. On select, the button flips to a green
// success state showing "✓ {Name}" and a toast confirms the assignment.
//
// Distinct from AssignOwnerControl, which is used where every record already
// has an owner and just needs reassignment.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search, UserPlus } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';
import { useToast } from './Toast';

export interface AssignableMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

// Demo team roster for assignment menus across the product.
export const ASSIGN_TEAM: AssignableMember[] = [
  { id: 'sofia-reyes', name: 'Sofia Reyes', role: 'Executive Director',     initials: 'SR' },
  { id: 'leah-kim',    name: 'Leah Kim',    role: 'Fundraising Director',   initials: 'LK' },
  { id: 'hannah-win',  name: 'Hannah Win',  role: 'Communications Director', initials: 'HW' },
  { id: 'noah-stein',  name: 'Noah Stein',  role: 'Policy Lead',            initials: 'NS' },
  { id: 'devon-kim',   name: 'Devon Kim',   role: 'Social Media Lead',      initials: 'DK' },
  { id: 'aisha-park',  name: 'Aisha Park',  role: 'Programs Director',      initials: 'AP' },
  { id: 'priya-singh', name: 'Priya Singh', role: 'Volunteer Coordinator',  initials: 'PS' },
];

interface AssignDropdownProps {
  assignedId?: string | null;
  members?: AssignableMember[];
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
  /** When the menu would otherwise overflow downward, anchor it above. */
  placement?: 'bottom' | 'top';
  onAssign?: (member: AssignableMember) => void;
}

export function AssignDropdown({
  assignedId,
  members = ASSIGN_TEAM,
  size = 'sm',
  align = 'right',
  placement = 'bottom',
  onAssign,
}: AssignDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(assignedId ?? null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (assignedId !== undefined) setSelectedId(assignedId);
  }, [assignedId]);

  useEffect(() => {
    if (!open) return;
    // Focus the search field once the menu opens.
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q),
    );
  }, [members, query]);

  const selected = members.find((m) => m.id === selectedId) ?? null;

  const handleSelect = (member: AssignableMember) => {
    setSelectedId(member.id);
    setOpen(false);
    setQuery('');
    onAssign?.(member);
    toast.show({
      type: 'success',
      title: `Task assigned to ${member.name}`,
      description: member.role,
    });
  };

  const isAssigned = !!selected;
  const padding = size === 'sm' ? 'h-7 pl-2 pr-2' : 'h-8 pl-2.5 pr-2.5';
  const text = size === 'sm' ? 'text-[12px]' : 'text-[13px]';
  const menuVerticalClass = placement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';
  const menuHorizontalClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 ${padding} ${text} font-semibold rounded-sm border
          transition-[background-color,border-color,color] duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${isAssigned
            ? 'bg-success-soft border-success/40 text-success hover:bg-success-soft/80'
            : 'bg-surface border-border-subtle text-secondary hover:border-border-default/60 hover:bg-surface-muted/50'}`}
      >
        {isAssigned ? (
          <>
            <Check size={11} strokeWidth={3} />
            <span className="truncate max-w-[110px]">{selected!.name}</span>
            <ChevronDown size={11} className="opacity-70" />
          </>
        ) : (
          <>
            <UserPlus size={11} strokeWidth={2} className="text-muted" />
            <span>Assign</span>
            <ChevronDown size={11} className="text-muted" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            role="menu"
            className={`absolute z-50 ${menuVerticalClass} ${menuHorizontalClass} w-[240px] bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-elevated`}
          >
            {/* Search */}
            <div className="px-2.5 py-2 border-b border-border-subtle bg-surface">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search team members…"
                  className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-surface-muted/40 border border-border-subtle rounded-sm outline-none focus:border-border-default focus:bg-surface placeholder:text-muted/80"
                />
              </div>
            </div>

            {/* List */}
            <div className="py-1 max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-4 text-center text-[12px] text-muted">No matches</div>
              ) : (
                filtered.map((m) => {
                  const active = m.id === selectedId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelect(m)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left transition-colors
                        ${active ? 'bg-brand-soft/50' : 'hover:bg-surface-muted/50'}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-semibold shrink-0
                          ${active
                            ? 'bg-brand text-white'
                            : 'bg-brand/10 border border-brand/15 text-brand'}`}
                      >
                        {m.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium text-primary truncate leading-tight">
                          {m.name}
                        </p>
                        <p className="text-[11px] text-muted truncate leading-tight mt-0.5">
                          {m.role}
                        </p>
                      </div>
                      {active && <Check size={12} className="text-brand shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
