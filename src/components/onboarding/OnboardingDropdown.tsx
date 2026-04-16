import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

// Onboarding-specific dropdown. Mirrors the Figma Type/Range/Use Case frames:
// bordered trigger with placeholder + chevron, list panel anchored below, the
// currently highlighted option gets a muted background. The first item in the
// options list is treated as the visual "highlighted" state only when nothing
// has been chosen yet (matching the Figma mock that shows Nonprofit / Under $1M
// highlighted as the default landing option).

interface OnboardingDropdownProps {
  label?: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  error?: string;
  /**
   * Direction the option list opens. 'auto' measures viewport space; pass
   * 'up' explicitly when you know the trigger sits near the bottom of a
   * constrained container (e.g. the last field in a modal).
   */
  direction?: 'auto' | 'up' | 'down';
}

export function OnboardingDropdown({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = 'Select',
  error,
  direction = 'auto',
}: OnboardingDropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [openUpward, setOpenUpward] = useState(direction === 'up');
  const [panelRect, setPanelRect] = useState<{ left: number; top: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  const estimatedPanelHeight = Math.min(options.length * 40 + 8, 240);

  // Measure trigger + decide direction whenever the panel opens or the viewport
  // layout changes (scroll, resize). Positioning happens through a portal so the
  // panel can escape scroll containers and modal clipping.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      let flip = openUpward;
      if (direction === 'auto') {
        const spaceBelow = window.innerHeight - rect.bottom;
        flip = spaceBelow < estimatedPanelHeight + 16 && rect.top > estimatedPanelHeight + 16;
      } else {
        flip = direction === 'up';
      }
      setOpenUpward(flip);
      setPanelRect({
        left: rect.left,
        top: flip ? rect.top : rect.bottom,
        width: rect.width,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, direction, options.length]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-2 w-full relative">
      {label && (
        <label className="text-[14px] font-medium text-primary leading-[18px]">
          {label}{required && <span className="ml-1">*</span>}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setFocusedIdx(0); }
          else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); }
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center justify-between px-3 py-[10px] text-[16px] leading-[20px] bg-surface rounded-lg cursor-pointer
          transition-[border-color] duration-150 ease-out outline-none
          focus-visible:ring-2 focus-visible:ring-border-default/30
          border ${error ? 'border-danger' : 'border-border-subtle hover:border-border-default'}
          ${value ? 'text-primary text-left' : 'text-muted/80 text-left'}`}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} className={`text-primary transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {error && <span className="text-[13px] text-danger">{error}</span>}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && panelRect && (
            <motion.ul
              ref={panelRef}
              role="listbox"
              initial={{ opacity: 0, y: openUpward ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUpward ? 2 : -2 }}
              transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              style={{
                position: 'fixed',
                left: panelRect.left,
                width: panelRect.width,
                ...(openUpward
                  ? { bottom: window.innerHeight - panelRect.top + 4 }
                  : { top: panelRect.top + 4 }),
              }}
              className="z-50 bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-[0_12px_32px_rgba(17,17,17,0.12)] max-h-[240px] overflow-y-auto"
            >
              {options.map((opt, i) => {
                const isSelected = value === opt;
                const isFocused = focusedIdx === i;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onMouseEnter={() => setFocusedIdx(i)}
                    onClick={() => pick(opt)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(opt); }
                      else if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx((i + 1) % options.length); }
                      else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx((i - 1 + options.length) % options.length); }
                    }}
                    className={`flex items-center justify-between px-3 py-[10px] text-[16px] leading-[20px] text-primary cursor-pointer
                      transition-colors duration-100 outline-none
                      ${isFocused ? 'bg-surface-muted' : 'bg-surface'}`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={14} className="text-primary" />}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
