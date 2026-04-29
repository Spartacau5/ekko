import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Mail, ChevronDown, Check } from 'lucide-react';
import { useRole } from '../../lib/RoleContext';
import { useMaturity } from '../../lib/MaturityContext';
import { Avatar } from '../ui/Avatar';
import { SetupProgress } from './SetupProgress';
import { getMembersByRole, Role } from '../../data/team';

// Sticky top bar for the app shell. Left side carries the global search; the
// right side carries the engagement / setup ring, indigo notification + email
// badges, and the active member's avatar with name + role title.

// Demo views the user can flip between from the top bar.
const DEMO_VIEW_ROLES: Role[] = ['fundraising', 'communications'];

export function TopBar() {
  const { activeMember, setActiveRole } = useRole();
  const { activeMaturity } = useMaturity();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const demoMembers = DEMO_VIEW_ROLES
    .map((r) => ({ role: r, member: getMembersByRole(r)[0] }))
    .filter((x) => Boolean(x.member));
  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center gap-4 px-6 shrink-0 z-30">
      <div className="flex-1 max-w-[720px] relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search policies, donors, organizations..."
          className="w-full pl-9 pr-3 py-2.5 text-[14px] leading-[20px] bg-page border border-border-subtle rounded-md outline-none placeholder:text-muted
            transition-[border-color,background-color,box-shadow] duration-150 ease-out
            hover:border-brand/40
            focus-visible:border-brand focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-brand/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {activeMaturity === 'day0' && <SetupProgress />}

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-brand/10 text-brand hover:bg-brand/15 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-surface" aria-hidden="true" />
        </button>

        <button
          aria-label="Messages"
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-brand/10 text-brand hover:bg-brand/15 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          <Mail size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-surface" aria-hidden="true" />
        </button>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2.5 pl-2 pr-2 h-12 rounded-md hover:bg-page transition-colors"
          >
            <Avatar member={activeMember} size="md" />
            <div className="hidden md:flex flex-col leading-tight text-left">
              <span className="text-[14px] font-semibold text-primary">{activeMember.name}</span>
              <span className="text-[12px] text-muted">{activeMember.title}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute right-0 top-full mt-2 w-[260px] bg-surface border border-border-subtle rounded-md shadow-elevated overflow-hidden z-40"
            >
              <p className="px-3 pt-3 pb-1.5 text-[10px] font-mono tracking-[0.18em] text-muted uppercase">
                Demo · switch view
              </p>
              <div className="py-1">
                {demoMembers.map(({ role, member }) => {
                  const sel = member.id === activeMember.id;
                  return (
                    <button
                      key={role}
                      type="button"
                      role="option"
                      aria-selected={sel}
                      onClick={() => { setActiveRole(role); setOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        sel ? 'bg-brand-soft' : 'hover:bg-page'
                      }`}
                    >
                      <Avatar member={member} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold leading-tight truncate ${sel ? 'text-brand' : 'text-primary'}`}>
                          {member.name}
                        </p>
                        <p className="text-[11px] text-muted leading-tight mt-0.5 truncate">{member.title}</p>
                      </div>
                      {sel && <Check size={14} className="text-brand shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
