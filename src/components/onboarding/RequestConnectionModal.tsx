import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { AuthField } from './AuthField';
import { OnboardingDropdown } from './OnboardingDropdown';
import { motionDurations, motionEasings } from '../../lib/motion';

// Request Connection modal. Two states: form (tool name, use case, notes) and
// success (checkmark + confirmation copy). Submitting flips to success; a
// short delay + Close returns the user to the Tools step.

const USE_CASES = ['CRM', 'Email management', 'Scheduling', 'Analysis', 'Other'];

interface RequestConnectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestConnectionModal({ open, onClose }: RequestConnectionModalProps) {
  const [toolName, setToolName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  // Reset form state when the modal closes so reopening feels fresh.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setToolName('');
        setUseCase('');
        setNotes('');
        setSubmitted(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const canSubmit = toolName.trim() && useCase;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        >
          <div className="absolute inset-0 bg-overlay" />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="relative bg-surface rounded-[32px] w-full max-w-[640px] p-6 flex flex-col gap-10 shadow-[0_24px_64px_rgba(17,17,17,0.18)] min-h-[420px]"
          >
            <div className="flex items-center justify-between pl-5">
              <h2 className="flex-1 text-center font-serif text-[20px] leading-[24px] font-semibold text-primary">
                Request Connection
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-muted hover:text-primary transition-colors duration-150 p-1 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              >
                <X size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
                  className="flex flex-col gap-6"
                >
                  <AuthField
                    label="Tool Name"
                    required
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="QuickBooks"
                  />
                  <OnboardingDropdown
                    label="What do you use it for?"
                    required
                    options={USE_CASES}
                    value={useCase}
                    onChange={setUseCase}
                    placeholder="Select a use case"
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-primary leading-[18px]">Additional Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything else we should know"
                      rows={4}
                      className="w-full px-3 py-[10px] text-[16px] leading-[20px] bg-surface border border-border-subtle rounded-lg outline-none resize-none h-[120px]
                        transition-[border-color,box-shadow] duration-150 ease-out
                        placeholder:text-muted/80
                        focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/30"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
                  className="flex-1 flex flex-col gap-6 items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: motionDurations.modal, ease: motionEasings.out, delay: 0.05 }}
                    className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)]"
                  >
                    <Check size={24} strokeWidth={3} />
                  </motion.div>
                  <p className="text-[16px] leading-[20px] text-muted text-center max-w-[380px]">
                    Request received. We'll keep you posted.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!submitted ? (
              <div className="flex gap-6">
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full bg-surface text-primary border border-border-default hover:bg-surface-muted cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                >
                  Cancel
                </button>
                <button
                  disabled={!canSubmit}
                  onClick={() => canSubmit && setSubmitted(true)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full border transition-[background-color,border-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default
                    ${canSubmit
                      ? 'bg-accent text-primary border-border-default hover:bg-accent-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)]'
                      : 'bg-surface-muted text-muted border-border-subtle cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full bg-accent text-primary border border-border-default hover:bg-accent-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              >
                Close
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
