// Phase 5 polish: global walkthrough launcher.
// A compact TopNav button that opens a popover listing all five demo flows.
// Lets a presenter or reviewer start any walkthrough from any page, without
// having to navigate back to the dashboard first.
//
// When a walkthrough is already active, the trigger reflects the active flow
// and the popover offers "Resume", "Restart", and "Exit" instead of a list.

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play, Sparkles, ChevronDown, X, RotateCcw, ArrowRight,
  Sprout, Users as UsersIcon, FileText, Building2, LineChart,
} from 'lucide-react';
import { demoFlows, DemoFlow, DemoFlowId } from '../../data/demoFlows';
import { useDemoFlow } from '../../lib/DemoFlowContext';
import { useMaturity } from '../../lib/MaturityContext';
import { useRole } from '../../lib/RoleContext';
import { roleMeta } from '../../data/team';
import { motionDurations, motionEasings } from '../../lib/motion';

const FLOW_ICONS: Record<DemoFlowId, React.ReactNode> = {
  'day0-activation': <Sprout size={12} className="text-success" />,
  'fundraising-jordan': <UsersIcon size={12} className="text-primary" />,
  'policy-rtc': <FileText size={12} className="text-primary" />,
  'peer-bronx': <Building2 size={12} className="text-primary" />,
  'executive-overview': <LineChart size={12} className="text-primary" />,
};

export function WalkthroughLauncher() {
  const navigate = useNavigate();
  const { active, startFlow, goToStep, exit } = useDemoFlow();
  const { setActiveMaturity, activeMaturity } = useMaturity();
  const { setActiveRole, activeRole } = useRole();
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

  function launch(flow: DemoFlow) {
    if (flow.recommendedMaturity !== activeMaturity) {
      setActiveMaturity(flow.recommendedMaturity);
    }
    if (flow.recommendedRole && flow.recommendedRole !== activeRole) {
      setActiveRole(flow.recommendedRole);
    }
    startFlow(flow.id);
    navigate(flow.steps[0].route);
    setOpen(false);
  }

  function restart() {
    if (!active) return;
    goToStep(0);
    navigate(active.flow.steps[0].route);
    setOpen(false);
  }

  function resume() {
    if (!active) return;
    navigate(active.flow.steps[active.stepIndex].route);
    setOpen(false);
  }

  const isActive = !!active;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[12px] font-semibold border
          transition-colors duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${isActive
            ? 'bg-accent-soft border-accent/60 text-primary hover:bg-accent-soft/80'
            : 'bg-surface border-border-subtle text-secondary hover:text-primary hover:border-border-default'}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={isActive ? `Walkthrough · ${active!.flow.name}` : 'Start a demo walkthrough'}
      >
        {isActive ? <Sparkles size={12} className="text-accent-hover" /> : <Play size={12} />}
        <span className="hidden md:inline tracking-wide uppercase text-[10px]">
          {isActive ? 'Walkthrough' : 'Demo'}
        </span>
        <ChevronDown size={11} className="opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="absolute right-0 top-full mt-2 w-[340px] bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border-subtle bg-surface-muted/30">
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Demo walkthroughs
              </p>
              <p className="text-[12px] text-secondary mt-0.5">
                {isActive
                  ? 'A walkthrough is running. Resume it, restart it, or exit.'
                  : 'Pick one of five rehearsed product stories.'}
              </p>
            </div>

            {isActive ? (
              <div className="py-2">
                <div className="px-4 py-2 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {FLOW_ICONS[active!.flow.id]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-primary leading-snug">{active!.flow.name}</p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Step {active!.stepIndex + 1} of {active!.total} · {active!.flow.duration}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-2 border-t border-border-subtle grid grid-cols-3 gap-1">
                  <PopoverAction icon={<ArrowRight size={12} />} label="Resume" onClick={resume} primary />
                  <PopoverAction icon={<RotateCcw size={12} />} label="Restart" onClick={restart} />
                  <PopoverAction icon={<X size={12} />} label="Exit" onClick={() => { exit(); setOpen(false); }} />
                </div>
                <div className="border-t border-border-subtle px-4 py-2.5">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Switch walkthrough</p>
                  <div className="flex flex-col gap-1">
                    {demoFlows
                      .filter((f) => f.id !== active!.flow.id)
                      .map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => launch(f)}
                          className="flex items-center gap-2 px-2 py-1.5 -mx-2 text-left rounded-sm hover:bg-surface-muted/60 transition-colors duration-150"
                        >
                          <span className="w-5 h-5 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
                            {FLOW_ICONS[f.id]}
                          </span>
                          <span className="text-[12px] text-primary font-medium truncate flex-1">{f.name}</span>
                          <span className="text-[10px] text-muted whitespace-nowrap">{f.duration}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-1 max-h-[420px] overflow-y-auto">
                {demoFlows.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => launch(f)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-surface-muted/60 transition-colors duration-150 group"
                  >
                    <div className="w-7 h-7 rounded-sm bg-accent-soft border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {FLOW_ICONS[f.id]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[13px] font-semibold text-primary truncate">{f.name}</p>
                        <span className="text-[10px] font-medium text-muted uppercase tracking-wider whitespace-nowrap">
                          {f.recommendedMaturity === 'day0' ? 'Day 0' : 'Day X'}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">
                        {f.recommendedRole ? `${roleMeta[f.recommendedRole].label} · ` : ''}
                        {f.duration} · {f.steps.length} steps
                      </p>
                      <p className="text-[12px] text-secondary mt-1 leading-snug line-clamp-2">{f.rationale}</p>
                    </div>
                    <ArrowRight size={12} className="text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-muted/30">
              <p className="text-[11px] text-muted leading-snug">
                Each walkthrough auto-sets the right role and maturity state before starting.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PopoverAction({
  icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-semibold rounded-sm border transition-colors duration-150
        ${primary
          ? 'bg-accent border-border-default text-primary hover:bg-accent-hover'
          : 'bg-surface border-border-subtle text-primary hover:bg-surface-muted'}`}
    >
      {icon} {label}
    </button>
  );
}
