// Phase 4.5: setup progress card. Headline percent + checklist of remaining
// setup tasks with their unlocks. Used as the anchor of the Day 0 dashboard.

import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Circle, Loader2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { SetupTask } from '../../data/maturity';

interface SetupProgressCardProps {
  percent: number;
  tasks: SetupTask[];
  daysInProduct: string;
  onTaskClick?: (task: SetupTask) => void;
}

const STATUS_ICON: Record<SetupTask['status'], React.ReactNode> = {
  done: <Check size={14} className="text-success" />,
  in_progress: <Loader2 size={14} className="text-warning animate-spin" />,
  todo: <Circle size={14} className="text-muted" />,
};

export function SetupProgressCard({ percent, tasks, daysInProduct, onTaskClick }: SetupProgressCardProps) {
  const remaining = tasks.filter((t) => t.status !== 'done').length;
  const doneCount = tasks.length - remaining;
  // The "Next up" pointer lands on the first in-progress task, or — if there
  // is no in-progress task — the first todo. Done tasks are skipped.
  const nextTask =
    tasks.find((t) => t.status === 'in_progress') ?? tasks.find((t) => t.status === 'todo');

  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start justify-between gap-6 mb-5">
        <div className="min-w-0">
          <p className="eyebrow mb-2">Getting started</p>
          <h2 className="text-[22px] font-serif font-semibold text-primary leading-tight tracking-tight">
            Set up your workspace
          </h2>
          <p className="text-[13px] text-secondary mt-1.5 leading-relaxed max-w-md">
            Each step unlocks more of what Ekko can show you. {daysInProduct} in.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-serif text-[44px] font-semibold text-primary leading-none tracking-tight tabular-nums">
            {percent}<span className="text-[22px] text-muted">%</span>
          </p>
          <p className="eyebrow-plain mt-2 justify-end">
            {doneCount} / {tasks.length} done
          </p>
        </div>
      </div>

      <div className="mb-5">
        <ProgressBar value={percent} showPercent={false} size="md" />
      </div>

      {nextTask && (
        <div className="relative mb-5 -mx-6 px-6 py-3 bg-accent-soft/35 border-y border-border-subtle flex items-start gap-3">
          <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
          <div className="w-6 h-6 rounded-sm bg-surface border border-accent/45 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles size={11} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="eyebrow-plain">Next up</p>
            <p className="text-[13px] font-semibold text-primary leading-snug mt-1 tracking-tight">{nextTask.title}</p>
          </div>
          {nextTask.ctaLink && (
            <Link
              to={nextTask.ctaLink}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary px-2.5 py-1 bg-surface border border-border-default rounded-sm hover:bg-surface-muted transition-colors duration-150 no-underline flex-shrink-0 mt-0.5"
            >
              {nextTask.ctaLabel} <ArrowRight size={11} />
            </Link>
          )}
        </div>
      )}

      <ul className="divide-y divide-border-subtle border-t border-border-subtle">
        {tasks.map((task) => {
          const isDone = task.status === 'done';
          const body = (
            <div className="flex items-start gap-3 py-3 group">
              <div className="mt-0.5 flex-shrink-0">{STATUS_ICON[task.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className={`text-[13px] font-semibold ${isDone ? 'text-muted line-through' : 'text-primary'}`}>
                    {task.title}
                  </p>
                  {task.estimateMinutes && !isDone && (
                    <span className="text-[11px] text-muted inline-flex items-center gap-1">
                      <Clock size={10} /> {task.estimateMinutes} min
                    </span>
                  )}
                </div>
                {!isDone && (
                  <>
                    <p className="text-[12px] text-secondary mt-0.5 leading-snug">{task.description}</p>
                    <p className="text-[11px] text-muted mt-1 italic">Unlocks: {task.unlocks}</p>
                  </>
                )}
              </div>
              {!isDone && (
                <span className="text-[12px] font-medium text-primary inline-flex items-center gap-1 flex-shrink-0 mt-0.5 group-hover:underline">
                  {task.ctaLabel} <ArrowRight size={11} />
                </span>
              )}
            </div>
          );
          if (isDone || !task.ctaLink) return <li key={task.id}>{body}</li>;
          return (
            <li key={task.id}>
              {onTaskClick ? (
                <button type="button" onClick={() => onTaskClick(task)} className="w-full text-left hover:bg-surface-muted/40 transition-colors duration-150 rounded-sm">
                  {body}
                </button>
              ) : (
                <Link to={task.ctaLink} className="block no-underline hover:bg-surface-muted/40 transition-colors duration-150 rounded-sm">
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
