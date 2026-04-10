import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { teamMembers, TeamMember, roleMeta } from '../../data/team';
import { motionDurations, motionEasings } from '../../lib/motion';
import { Avatar } from './Avatar';

interface AssignOwnerControlProps {
  ownerId: string;
  onChange: (memberId: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function AssignOwnerControl({ ownerId, onChange, disabled = false, size = 'md' }: AssignOwnerControlProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const owner = teamMembers.find((m) => m.id === ownerId) || teamMembers[0];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const padding = size === 'sm' ? 'px-2 py-1' : 'px-2.5 py-1.5';
  const textSize = size === 'sm' ? 'text-[12px]' : 'text-[13px]';

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 ${padding} ${textSize} font-medium border rounded-sm
          transition-[background-color,border-color] duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${disabled
            ? 'bg-surface-muted/40 border-border-subtle text-muted cursor-not-allowed'
            : 'bg-surface border-border-subtle text-primary hover:border-border-default hover:bg-surface-muted/40'}`}
      >
        <Avatar member={owner} size={size === 'sm' ? 'xs' : 'sm'} />
        <span className="truncate max-w-[140px]">{owner.name}</span>
        {!disabled && <ChevronDown size={12} className="text-muted" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="absolute left-0 top-full mt-1 z-30 w-64 bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-border-subtle">
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Assign to</p>
            </div>
            <div className="py-1 max-h-64 overflow-y-auto">
              {teamMembers.map((m) => (
                <OwnerOption
                  key={m.id}
                  member={m}
                  selected={m.id === ownerId}
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OwnerOption({ member, selected, onClick }: { member: TeamMember; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left
        transition-colors duration-150 ease-out
        ${selected ? 'bg-surface-muted/60' : 'hover:bg-surface-muted/40'}`}
    >
      <Avatar member={member} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-primary truncate">{member.name}</p>
        <p className="text-[11px] text-muted truncate">{roleMeta[member.role].label}</p>
      </div>
      {selected && <Check size={13} className="text-primary flex-shrink-0" />}
    </button>
  );
}
