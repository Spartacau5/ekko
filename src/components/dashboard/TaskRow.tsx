import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ActionItem, ActionStatus } from '../../data/actions';
import { Chip } from '../ui/Chip';
import { deriveTaskCta } from './taskCta';
import { motionDurations, motionEasings } from '../../lib/motion';

// Single task row on the dashboard. Hover reveals a checkbox on the left for
// quick "mark done"; the right side holds a short verb CTA that opens the
// task drawer. Chips show priority/category; meta line shows due date + who.

interface TaskRowProps {
  task: ActionItem;
  ownerName?: string;
  onToggleComplete: (id: string, next: ActionStatus) => void;
  onPrimaryAction: (task: ActionItem) => void;
}

// "Today" is static for the prototype so demo numbers stay stable.
const TODAY = new Date('2026-04-12');
const formatDue = (iso: string) => {
  const d = new Date(iso);
  const days = Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
  const base = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (days < 0) return { label: base, hint: `${Math.abs(days)}d overdue`, urgent: true };
  if (days === 0) return { label: base, hint: 'Due today', urgent: true };
  if (days <= 5)  return { label: base, hint: `${days}d left`, urgent: true };
  return { label: base, hint: `${days}d left`, urgent: false };
};

export function TaskRow({ task, ownerName, onToggleComplete, onPrimaryAction }: TaskRowProps) {
  const completed = task.status === 'completed';
  const due = formatDue(task.dueDate);
  const cta = deriveTaskCta(task);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
      className="card-lift group flex items-start gap-3 p-3 rounded-md border border-border-subtle bg-surface hover:border-border-default"
    >
      <button
        onClick={() => onToggleComplete(task.id, completed ? 'open' : 'completed')}
        aria-label={completed ? 'Mark task incomplete' : 'Mark task complete'}
        className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 cursor-pointer
          transition-[opacity,background-color,border-color] duration-150
          ${completed
            ? 'opacity-100 bg-accent border-border-default'
            : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 border-border-default bg-surface hover:bg-surface-muted'}`}
      >
        {completed && <Check size={11} strokeWidth={3} className="text-primary" />}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {task.entity && (
            <Chip
              label={task.entity.type === 'donor' ? 'People' : task.entity.type === 'policy' ? 'Policy' : task.entity.type === 'peer' ? 'Peers' : 'System'}
              variant="default"
            />
          )}
          {task.priority === 'urgent' && <Chip label="Urgent" variant="danger" />}
        </div>
        <p className={`text-[14px] leading-[20px] font-medium ${completed ? 'text-muted line-through' : 'text-primary'}`}>
          {task.title}
        </p>
        <p className="text-[12px] leading-[16px] text-muted">
          <span className={due.urgent && !completed ? 'text-warning font-medium' : ''}>{due.label}</span>
          {due.hint && <span className="text-muted"> · {due.hint}</span>}
          {ownerName && <span className="text-muted"> · {ownerName}</span>}
        </p>
      </div>

      <button
        onClick={() => onPrimaryAction(task)}
        className="shrink-0 self-center px-3 py-1.5 text-[12px] leading-[16px] font-medium rounded-sm border border-border-default bg-surface text-primary hover:bg-accent hover:border-border-default transition-[background-color,border-color] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
      >
        {cta}
      </button>
    </motion.div>
  );
}
