// Phase 4.5: visible toggle between Day 0 and Day X product states.
// Sits next to RoleSwitcher in the top nav. Used for demos, critiques, and
// showing how Ekko evolves as data and configuration arrive.

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check, Sparkles, Sprout } from 'lucide-react';
import { useMaturity, Maturity, maturityMeta } from '../../lib/MaturityContext';
import { motionDurations, motionEasings } from '../../lib/motion';

const MATURITY_ORDER: Maturity[] = ['day0', 'dayX'];

const ICONS: Record<Maturity, React.ReactNode> = {
  day0: <Sprout size={13} className="text-success" />,
  dayX: <Sparkles size={13} className="text-accent-hover" />,
};

// The trigger button is intentionally color-coded so the active maturity is
// readable at a glance from anywhere in the app — Day 0 reads as "fresh,
// growing" (success-soft) and Day X reads as "established, lit up"
// (accent-soft). Same shape as the role switcher; just stronger color carry.
const TRIGGER_STYLES: Record<Maturity, string> = {
  day0:
    'bg-success-soft border-success/40 text-success hover:bg-success-soft/80',
  dayX:
    'bg-accent-soft border-accent/50 text-primary hover:bg-accent-soft/80',
};

export function MaturityStateSwitcher() {
  const { activeMaturity, setActiveMaturity } = useMaturity();
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

  const meta = maturityMeta[activeMaturity];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[12px] font-semibold border
          transition-colors duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${TRIGGER_STYLES[activeMaturity]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Product state — ${meta.label}: ${meta.tagline}`}
      >
        {ICONS[activeMaturity]}
        <span className="hidden sm:inline tracking-wide uppercase text-[10px]">{meta.short}</span>
        <ChevronDown size={11} className="opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border-subtle">
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Product maturity
              </p>
              <p className="text-[12px] text-secondary mt-0.5">
                Same Ekko — see how it feels on day one versus after months of use.
              </p>
            </div>
            <div className="py-1">
              {MATURITY_ORDER.map((m) => {
                const mMeta = maturityMeta[m];
                const isActive = m === activeMaturity;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setActiveMaturity(m);
                      setOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left
                      transition-colors duration-150 ease-out
                      ${isActive ? 'bg-accent-soft/40' : 'hover:bg-surface-muted/40'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0
                        ${m === 'day0' ? 'bg-success-soft' : 'bg-accent-soft'}`}
                    >
                      {ICONS[m]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-primary truncate">
                          {mMeta.label} <span className="text-muted font-normal">· {mMeta.daysInProduct}</span>
                        </p>
                        {isActive && <Check size={13} className="text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-[12px] text-muted">{mMeta.tagline}</p>
                      <p className="text-[12px] text-secondary mt-0.5 leading-snug">{mMeta.description}</p>
                      <p className="text-[11px] text-muted mt-1">
                        Setup {mMeta.setupCompletion}% complete
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-muted/30">
              <p className="text-[11px] text-muted">
                You can also deep-link a state with <span className="font-mono">/day-0/…</span> or{' '}
                <span className="font-mono">/day-x/…</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
