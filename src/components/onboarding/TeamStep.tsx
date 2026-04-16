import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { AuthField } from './AuthField';
import { OnboardingDropdown } from './OnboardingDropdown';
import { motionDurations, motionEasings } from '../../lib/motion';

// Step 5: invite team members. Each row is a small card with Full Name + Role
// (same role taxonomy as Profile step) and Work Email below. The list grows
// vertically; past a pixel threshold the list scrolls so the footer stays in
// view. An X on hover removes a row (at least one row is always present).

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const TEAM_ROLE_OPTIONS = [
  'Executive Director',
  'Fundraising Coordinator',
  'Communications Specialist',
  'Program Manager',
  'Operator',
  'Other',
];

let _id = 0;
export const emptyMember = (): TeamMember => ({
  id: `m-${++_id}`,
  name: '',
  role: '',
  email: '',
});

interface TeamStepProps {
  members: TeamMember[];
  onChange: (next: TeamMember[]) => void;
}

export function TeamStep({ members, onChange }: TeamStepProps) {
  const update = (id: string, patch: Partial<TeamMember>) => {
    onChange(members.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };
  const remove = (id: string) => {
    if (members.length <= 1) return;
    onChange(members.filter((m) => m.id !== id));
  };
  const add = () => onChange([...members, emptyMember()]);

  return (
    <div className="flex-1 flex flex-col gap-4 w-full min-h-0">
      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {members.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
              className="group relative flex flex-col gap-6 p-4 rounded-lg bg-page"
            >
              {members.length > 1 && (
                <button
                  onClick={() => remove(m.id)}
                  aria-label="Remove team member"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-danger hover:bg-surface transition-[opacity,color,background-color] duration-150 cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                >
                  <X size={14} />
                </button>
              )}
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <AuthField
                    label="Full Name"
                    required
                    id={`team-name-${m.id}`}
                    value={m.name}
                    onChange={(e) => update(m.id, { name: e.target.value })}
                    placeholder="Sofia Reyes"
                  />
                </div>
                <div className="flex-1">
                  <OnboardingDropdown
                    label="Role"
                    required
                    options={TEAM_ROLE_OPTIONS}
                    value={m.role}
                    onChange={(v) => update(m.id, { role: v })}
                    placeholder="Select role"
                  />
                </div>
              </div>
              <AuthField
                label="Work Email Address"
                required
                id={`team-email-${m.id}`}
                type="email"
                value={m.email}
                onChange={(e) => update(m.id, { email: e.target.value })}
                placeholder="name@rivergate.org"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={add}
        className="self-start flex gap-1.5 items-center text-[14px] leading-[18px] text-secondary font-medium hover:text-primary transition-colors duration-150 cursor-pointer"
      >
        <Plus size={14} strokeWidth={2.5} />
        <span>Add another team member</span>
      </button>
    </div>
  );
}
