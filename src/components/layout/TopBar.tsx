import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useRole } from '../../lib/RoleContext';
import { useMaturity } from '../../lib/MaturityContext';
import { Avatar } from '../ui/Avatar';
import { RoleSwitcher } from './RoleSwitcher';
import { MaturityStateSwitcher } from './MaturityStateSwitcher';
import { WalkthroughLauncher } from './WalkthroughLauncher';
import { SetupProgress } from './SetupProgress';

// Sticky top bar for the app shell. Left side holds the global search; the
// right side carries the demo-mode dev affordances (role / maturity / tour)
// alongside the notification bell and the active member's avatar.

export function TopBar() {
  const { activeMember } = useRole();
  const { activeMaturity } = useMaturity();
  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center gap-4 px-6 sticky top-0 z-30">
      <div className="flex-1 max-w-[720px] relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search policies, donors, organizations..."
          className="w-full pl-9 pr-3 py-2.5 text-[14px] leading-[20px] bg-surface-muted/60 border border-border-subtle rounded-md outline-none placeholder:text-muted/90
            transition-[border-color,background-color] duration-150 ease-out
            hover:border-border-default/70
            focus-visible:border-border-default focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-border-default/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <WalkthroughLauncher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <MaturityStateSwitcher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <RoleSwitcher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <button
          aria-label="Notifications"
          className="relative p-2 text-muted hover:text-primary hover:bg-surface-muted rounded-sm transition-colors duration-150 cursor-pointer"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger" aria-hidden="true" />
        </button>
        {activeMaturity === 'day0' && <SetupProgress />}
        <Avatar member={activeMember} size="md" />
      </div>
    </header>
  );
}
