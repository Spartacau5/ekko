import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { setupTasksForMaturity } from '../../data/maturity';
import { organization } from '../../data/organization';
import { motionDurations, motionEasings } from '../../lib/motion';

// Day 0 top-bar affordance: a small progress ring + click-to-reveal checklist
// dropdown. The ring shows overall setup completion; the dropdown lists each
// onboarding task with its CTA.

export function SetupProgress() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tasks = setupTasksForMaturity('day0');
  const done = tasks.filter((t) => t.status === 'done').length;
  // The organization data carries the canonical completion number so the
  // ring and the checklist can agree on percent even when the dropdown is
  // not open.
  const percent = organization.setupCompletion || Math.round((done / tasks.length) * 100);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Setup progress ${percent}%`}
        aria-expanded={open}
        className="relative w-9 h-9 flex items-center justify-center rounded-full cursor-pointer hover:bg-surface-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
      >
        <Ring percent={percent} />
        <span className="absolute text-[10px] font-semibold text-primary tabular-nums">{percent}%</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="absolute right-0 top-full mt-2 w-[340px] bg-surface border border-border-subtle rounded-md shadow-[0_12px_32px_rgba(17,17,17,0.12)] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border-subtle">
              <p className="eyebrow mb-1.5">Onboarding</p>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-primary leading-tight">Setup progress</h3>
                <span className="text-[13px] text-muted tabular-nums">{percent}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="max-h-[320px] overflow-y-auto flex flex-col gap-0.5 py-1">
              {tasks.map((t) => {
                const isDone = t.status === 'done';
                const body = (
                  <div className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-muted/60 transition-colors duration-150">
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0
                        ${isDone ? 'bg-accent border-border-default' : 'bg-surface border-border-default'}`}
                    >
                      {isDone && <Check size={11} strokeWidth={3} className="text-primary" />}
                    </span>
                    <span
                      className={`flex-1 text-[13px] leading-[18px] ${
                        isDone ? 'text-muted line-through' : 'text-primary'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                );
                if (!isDone && t.ctaLink) {
                  return (
                    <Link key={t.id} to={t.ctaLink} onClick={() => setOpen(false)} className="no-underline">
                      {body}
                    </Link>
                  );
                }
                return <div key={t.id}>{body}</div>;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Ring({ percent }: { percent: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, percent)) / 100) * c;
  return (
    <svg width={36} height={36} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx={18} cy={18} r={r} stroke="currentColor" className="text-border-subtle" strokeWidth={3} fill="none" />
      <motion.circle
        cx={18} cy={18} r={r}
        stroke="currentColor" className="text-accent"
        strokeWidth={3} fill="none" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}
