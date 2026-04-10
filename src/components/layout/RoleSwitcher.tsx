import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check, Eye } from 'lucide-react';
import { useRole } from '../../lib/RoleContext';
import { Role, roleMeta, getMembersByRole } from '../../data/team';
import { motionDurations, motionEasings } from '../../lib/motion';
import { Avatar } from '../ui/Avatar';

const ROLE_ORDER: Role[] = ['executive', 'fundraising', 'policy', 'program', 'operations'];

export function RoleSwitcher() {
  const { activeRole, activeMember, setActiveRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm text-[13px] font-medium
          transition-colors duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${open ? 'bg-surface-muted text-primary' : 'text-secondary hover:text-primary hover:bg-surface-muted/60'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Previewing as ${roleMeta[activeRole].label}`}
      >
        <Avatar member={activeMember} size="xs" />
        <span className="hidden sm:inline">{roleMeta[activeRole].short}</span>
        <ChevronDown size={12} className="text-muted" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border-subtle">
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1">
                <Eye size={11} /> Preview workspace as
              </p>
              <p className="text-[12px] text-secondary mt-0.5">
                Same product — different priorities, alerts, and recommended actions for each role.
              </p>
            </div>
            <div className="py-1">
              {ROLE_ORDER.map((r) => {
                const member = getMembersByRole(r)[0];
                const meta = roleMeta[r];
                const isActive = r === activeRole;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setActiveRole(r);
                      setOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left
                      transition-colors duration-150 ease-out
                      ${isActive ? 'bg-accent-soft/40' : 'hover:bg-surface-muted/40'}`}
                  >
                    <Avatar member={member} size="md" highlight={isActive} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-primary truncate">{meta.label}</p>
                        {isActive && <Check size={13} className="text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-[12px] text-muted truncate">{member?.name}</p>
                      <p className="text-[12px] text-secondary mt-0.5 leading-snug">{meta.focus}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-muted/30">
              <p className="text-[11px] text-muted">
                Switching is instant — no permission denials. Capability gates only affect editing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
