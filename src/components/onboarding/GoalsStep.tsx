import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { AuthField } from './AuthField';
import { motionDurations, motionEasings } from '../../lib/motion';

// Step 3: pick goals as chips. Selecting "Other" reveals a free-text field.
// A lightweight keyword heuristic rejects obvious non-nonprofit goals.

export const GOAL_OPTIONS = [
  'Donor Relationship Management',
  'Donor Retention Increasing',
  'Donor Engagement Improvement',
  'Data-driven Strategy',
  'Foundation and Corporate Partnerships Strengthen',
  'Policy Change Tracking',
  'Risk and Opportunities Alert',
  'Peer Campaigns Learning',
  'Peer Comparison Analysis',
  'Other',
] as const;

export type GoalOption = (typeof GOAL_OPTIONS)[number];

export interface GoalsState {
  selected: GoalOption[];
  otherText: string;
}

interface GoalsStepProps {
  state: GoalsState;
  onChange: (next: GoalsState) => void;
  otherError?: string;
}

export function GoalsStep({ state, onChange, otherError }: GoalsStepProps) {
  const otherSelected = state.selected.includes('Other');

  const toggle = (goal: GoalOption) => {
    const isSelected = state.selected.includes(goal);
    const nextSelected = isSelected
      ? state.selected.filter((g) => g !== goal)
      : [...state.selected, goal];
    // Clear the Other text when deselecting Other
    onChange({
      selected: nextSelected,
      otherText: isSelected && goal === 'Other' ? '' : state.otherText,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-wrap gap-2.5">
        {GOAL_OPTIONS.map((goal) => {
          const selected = state.selected.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              onClick={() => toggle(goal)}
              aria-pressed={selected}
              className={`flex items-center justify-center px-6 py-2 rounded-full border text-[16px] leading-[20px] cursor-pointer
                transition-[background-color,border-color,color] duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border-default
                ${selected
                  ? 'border-accent bg-accent-soft/40 text-primary shadow-[inset_0_0_0_1px_rgba(244,190,0,0.4)]'
                  : 'border-border-subtle bg-surface text-muted hover:border-border-default hover:text-secondary'}`}
            >
              {goal}
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {otherSelected && (
          <motion.div
            key="other-field"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <AuthField
              label="Describe your goal"
              required
              value={state.otherText}
              onChange={(e) => onChange({ ...state, otherText: e.target.value })}
              placeholder="Previous Campaigns Report"
              aria-invalid={!!otherError}
              className={otherError ? '!border-danger focus-visible:!ring-danger/30' : ''}
            />
            <AnimatePresence>
              {otherError && (
                <motion.div
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                  className="flex gap-1.5 items-center text-[12px] leading-[14px] text-muted"
                >
                  <AlertCircle size={12} className="text-danger shrink-0" />
                  <span>{otherError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MVP: no heuristic gate. Any non-empty free-text goal is accepted.
export function validateGoalOther(text: string): string | undefined {
  if (!text.trim()) return 'Describe your goal.';
  return undefined;
}

export function isGoalsStepComplete(state: GoalsState): boolean {
  if (state.selected.length === 0) return false;
  if (state.selected.includes('Other')) {
    return validateGoalOther(state.otherText) === undefined;
  }
  return true;
}
