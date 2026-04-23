// Phase 5: persistent walkthrough strip.
// When a demo flow is active, this sticky bottom bar shows the current step,
// the focus area to look at, Prev/Next navigation, and an "Exit walkthrough"
// affordance. Always visible at the bottom of the page during a walkthrough.
//
// The strip is intentionally restrained — a thin band that doesn't compete
// with the page content. It's a presenter aid, not a tour overlay.

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Check, Eye } from 'lucide-react';
import { useDemoFlow } from '../../lib/DemoFlowContext';
import { motionDurations, motionEasings } from '../../lib/motion';

// Phase 5 polish: when the active walkthrough step changes and the step has a
// `focus` label, look for a DOM element with `data-walkthrough-focus` that
// contains the same token. If found, scroll it into view and briefly outline
// it so the reviewer's eye is guided to the exact section the step is about.
function runFocusHighlight(focus: string | undefined) {
  if (typeof document === 'undefined') return;
  if (!focus) return;

  // Wait a frame for the target page to finish rendering after navigation.
  const run = () => {
    const needle = focus.toLowerCase();
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-walkthrough-focus]')
    );
    const match = nodes.find((n) => {
      const v = (n.getAttribute('data-walkthrough-focus') || '').toLowerCase();
      return v === needle || v.includes(needle) || needle.includes(v);
    });
    if (!match) return;

    match.scrollIntoView({ behavior: 'smooth', block: 'center' });
    match.classList.add('walkthrough-focus-pulse');
    window.setTimeout(() => {
      match.classList.remove('walkthrough-focus-pulse');
    }, 1800);
  };

  // Two frames of delay — enough for route transitions + AnimatePresence.
  window.requestAnimationFrame(() => window.requestAnimationFrame(run));
  // Also retry once after a short beat, in case content mounts late.
  window.setTimeout(run, 260);
}

export function WalkthroughStrip() {
  const { active, next, goToStep, exit } = useDemoFlow();
  const navigate = useNavigate();
  const location = useLocation();

  // Re-run the focus highlight any time the active step changes OR the
  // location has caught up to the step's route. This handles both same-page
  // step changes and step changes that navigate first.
  useEffect(() => {
    if (!active) return;
    if (location.pathname !== active.step.route) return;
    runFocusHighlight(active.step.focus);
  }, [active?.step.id, location.pathname]);  // eslint-disable-line react-hooks/exhaustive-deps

  function handleNext() {
    if (!active) return;
    const nextStep = next();
    if (nextStep) navigate(nextStep.route);
  }

  function handlePrev() {
    if (!active || active.stepIndex === 0) return;
    const prevIdx = active.stepIndex - 1;
    goToStep(prevIdx);
    navigate(active.flow.steps[prevIdx].route);
  }

  function handleRailClick(index: number) {
    if (!active) return;
    goToStep(index);
    navigate(active.flow.steps[index].route);
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pb-4"
          aria-live="polite"
        >
          <div className="pointer-events-auto bg-surface border border-border-default rounded-md shadow-[0_8px_28px_rgba(17,17,17,0.14),0_1px_0_rgba(17,17,17,0.05)] max-w-4xl w-full overflow-hidden">
            {/* Top row — eyebrow + flow name + step counter + exit */}
            <div className="px-5 py-2.5 bg-surface-muted/40 border-b border-border-subtle flex items-center gap-3">
              <p className="eyebrow">Walkthrough</p>
              <span className="text-border-subtle">·</span>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <span className="text-[13px] font-serif font-semibold text-primary truncate italic tracking-tight">
                  {active.flow.name}
                </span>
                <span className="text-[11px] text-muted whitespace-nowrap hidden md:inline">·  {active.flow.audience}</span>
              </div>
              <span className="text-[11px] font-medium text-muted whitespace-nowrap tabular-nums">
                Step {active.stepIndex + 1} / {active.total}
              </span>
              <button
                type="button"
                onClick={exit}
                className="text-muted hover:text-primary transition-colors duration-150 p-0.5 rounded-sm"
                aria-label="Exit walkthrough"
                title="Exit walkthrough"
              >
                <X size={13} />
              </button>
            </div>

            {/* Step body + nav buttons */}
            <div className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-primary leading-snug tracking-tight">{active.step.title}</p>
                <p className="text-[12px] text-secondary mt-0.5 leading-snug">{active.step.body}</p>
                {active.step.focus && (
                  <motion.p
                    key={active.step.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                    className="text-[11px] text-primary mt-1.5 inline-flex items-center gap-1.5 bg-accent-soft border border-accent/40 rounded-sm px-2 py-[3px] font-medium"
                  >
                    <Eye size={10} />
                    <span className="eyebrow-plain" style={{ fontSize: 9 }}>Look at</span>
                    <span className="font-semibold tracking-tight">{active.step.focus}</span>
                  </motion.p>
                )}
              </div>

              {/* Prev button (icon only) — disabled on step 1 */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={active.stepIndex === 0}
                className="inline-flex items-center justify-center w-9 h-9 bg-surface text-primary border border-border-default rounded-sm hover:bg-surface-muted transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Previous step"
                title="Previous step"
              >
                <ArrowLeft size={13} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-brand text-white border border-brand px-4 py-2 text-[13px] font-semibold rounded-sm hover:bg-brand-hover transition-colors duration-150 flex-shrink-0"
              >
                {active.stepIndex + 1 === active.total ? (
                  <>Finish <Check size={12} /></>
                ) : (
                  <>Next <ArrowRight size={12} /></>
                )}
              </button>
            </div>

            {/* Step rail — clickable, updates stepIndex + navigates */}
            <div className="px-5 pb-2.5 flex items-center gap-1">
              {active.flow.steps.map((s, i) => {
                const done = i < active.stepIndex;
                const current = i === active.stepIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleRailClick(i)}
                    title={`${i + 1}. ${s.title}`}
                    className={`h-1 flex-1 rounded-sm transition-colors duration-150
                      ${done ? 'bg-accent' : current ? 'bg-primary' : 'bg-border-subtle hover:bg-border-default/40'}`}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
