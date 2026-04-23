import React, { useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

interface TourStep {
  title: string;
  description: string;
  target: string; // dom id
}

const tourSteps: TourStep[] = [
  {
    title: 'Your dashboard',
    description: 'This is your home base. Recent signals, priority people, policy radar, and peer benchmarks live here. Everything is tailored to your organization and goals.',
    target: 'dashboard-welcome',
  },
  {
    title: 'Understand your people',
    description: 'See who needs attention, what to do next, and why. Donor profiles include rich timelines, persona insights, risk levels, and AI-suggested next steps.',
    target: 'dashboard-people',
  },
  {
    title: 'Track policy that matters',
    description: 'Monitor city, state, federal, and regional policies that affect your mission. See impact, urgency, stakeholder alignment, and recommended actions in one view.',
    target: 'dashboard-policy',
  },
  {
    title: 'Compare with peers',
    description: "Benchmark your performance against similar organizations and unlock shared intelligence about campaigns, messaging themes, and what's working in your sector.",
    target: 'dashboard-peers',
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SpotlightTourProps {
  onClose: () => void;
}

export function SpotlightTour({ onClose }: SpotlightTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  // Measure highlighted region. Re-measure on step change, scroll, and resize.
  useLayoutEffect(() => {
    function measure() {
      const el = document.getElementById(current.target);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - 8,
        left: r.left - 8,
        width: r.width + 16,
        height: r.height + 16,
      });
      // Scroll element into view if it's not visible
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [current.target]);

  // Escape to dismiss, arrow keys to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setStep((s) => Math.min(tourSteps.length - 1, s + 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(0, s - 1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Compute tooltip position: prefer below the highlighted region, fall back to above
  const tooltipStyle: React.CSSProperties = (() => {
    const TOOLTIP_W = 460;
    const TOOLTIP_GAP = 16;
    if (!rect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }
    const wouldFitBelow = rect.top + rect.height + TOOLTIP_GAP + 280 <= window.innerHeight;
    const top = wouldFitBelow ? rect.top + rect.height + TOOLTIP_GAP : rect.top - TOOLTIP_GAP - 280;
    let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    left = Math.max(16, Math.min(window.innerWidth - TOOLTIP_W - 16, left));
    return { top: Math.max(16, top), left };
  })();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
      >
        {/* Dim overlay with cutout */}
        <div className="absolute inset-0 pointer-events-auto" onClick={onClose}>
          {rect ? (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <motion.rect
                    initial={false}
                    animate={{ x: rect.left, y: rect.top, width: rect.width, height: rect.height }}
                    transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
                    rx={6}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(17,17,17,0.55)"
                mask="url(#spotlight-mask)"
              />
              {/* Highlight outline */}
              <motion.rect
                initial={false}
                animate={{ x: rect.left, y: rect.top, width: rect.width, height: rect.height }}
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
                rx={6}
                fill="none"
                stroke="#2B00D4"
                strokeWidth={2}
                pointerEvents="none"
              />
            </svg>
          ) : (
            // No target found — full overlay
            <div className="absolute inset-0 bg-overlay" />
          )}
        </div>

        {/* Tooltip — wrapper persists across steps; only inner content swaps */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionDurations.tour, ease: motionEasings.out }}
          className="absolute pointer-events-auto"
          style={tooltipStyle}
        >
          <div className="bg-surface border border-border-default rounded-md w-[460px] shadow-2xl">
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <span className="text-[12px] font-medium text-muted uppercase tracking-wider">
                Tour · {step + 1} of {tourSteps.length}
              </span>
              <button
                onClick={onClose}
                aria-label="Dismiss tour"
                className="text-muted hover:text-primary transition-colors duration-150 p-1 -mr-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: motionDurations.tour, ease: motionEasings.out }}
                >
                  <h2 className="text-[22px] leading-[30px] font-semibold font-serif text-primary mb-2">
                    {current.title}
                  </h2>
                  <p className="text-sm text-secondary leading-relaxed">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle">
              <div className="flex items-center gap-1.5">
                {tourSteps.map((_, i) => (
                  <motion.div
                    key={i}
                    layout
                    transition={{ duration: motionDurations.tour, ease: motionEasings.out }}
                    className={`h-1.5 rounded-full ${i === step ? 'w-6 bg-accent' : 'w-1.5 bg-border-subtle'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={14} className="mr-1" /> Back
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Skip
                </Button>
                <Button size="sm" onClick={() => (isLast ? onClose() : setStep(step + 1))}>
                  {isLast ? 'Get started' : 'Next'}
                  {!isLast && <ArrowRight size={14} className="ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
