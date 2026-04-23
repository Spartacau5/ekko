import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AuthField } from './AuthField';
import { OnboardingDropdown } from './OnboardingDropdown';
import { motionDurations, motionEasings } from '../../lib/motion';

// Manual org-entry modal. Shape and copy follow the "Add your Org - Modal"
// frame: centered title, four required fields with two on a row, and a
// Cancel / Done footer that splits the row 50/50.

export interface OrgManualDetails {
  name: string;
  headquarters: string;
  type: string;
  mission: string;
  revenue: string;
  ein: string;
}

const ORG_TYPES = ['Nonprofit', 'Foundation', 'Civic organization', 'Government agency'];
const REVENUE_RANGES = ['Under $1M', '$1M - $5M', '$5M - $10M', '$10M - $25M', '$25M+'];

interface AddOrgModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (details: OrgManualDetails) => void;
}

export function AddOrgModal({ open, onClose, onSubmit }: AddOrgModalProps) {
  const [details, setDetails] = useState<OrgManualDetails>({
    name: '',
    headquarters: '',
    type: '',
    mission: '',
    revenue: '',
    ein: '',
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const canSubmit =
    details.name.trim() &&
    details.headquarters.trim() &&
    details.type &&
    details.mission.trim() &&
    details.revenue &&
    details.ein.trim();

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
            className="relative bg-surface rounded-[32px] w-full max-w-[560px] p-6 flex flex-col gap-10 shadow-[0_24px_64px_rgba(17,17,17,0.18)]"
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between pl-5">
                <h2 className="flex-1 text-center font-serif text-[20px] leading-[24px] font-semibold text-primary">
                  Add Your Organization
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-muted hover:text-primary transition-colors duration-150 p-1 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <AuthField
                  label="Organization Name"
                  required
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  placeholder="Rivergate Group"
                />
                <div className="flex gap-5">
                  <div className="flex-1">
                    <AuthField
                      label="Headquarters"
                      required
                      value={details.headquarters}
                      onChange={(e) => setDetails({ ...details, headquarters: e.target.value })}
                      placeholder="New York, NY"
                    />
                  </div>
                  <div className="flex-1">
                    <OnboardingDropdown
                      label="Organization Type"
                      required
                      options={ORG_TYPES}
                      value={details.type}
                      onChange={(v) => setDetails({ ...details, type: v })}
                      placeholder="Select type"
                    />
                  </div>
                </div>
                <AuthField
                  label="Mission Area"
                  required
                  value={details.mission}
                  onChange={(e) => setDetails({ ...details, mission: e.target.value })}
                  placeholder="Housing stability and community development"
                />
                <AuthField
                  label="EIN Number"
                  required
                  value={details.ein}
                  onChange={(e) => setDetails({ ...details, ein: e.target.value })}
                  placeholder="13-4567890"
                />
                <OnboardingDropdown
                  label="Annual Revenue Range"
                  required
                  options={REVENUE_RANGES}
                  value={details.revenue}
                  onChange={(v) => setDetails({ ...details, revenue: v })}
                  placeholder="Select range"
                  direction="up"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full bg-surface text-primary border border-border-default hover:bg-surface-muted cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              >
                Cancel
              </button>
              <button
                disabled={!canSubmit}
                onClick={() => canSubmit && onSubmit(details)}
                className={`flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full border transition-[background-color,border-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default
                  ${canSubmit
                    ? 'bg-brand text-white border-brand hover:bg-brand-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]'
                    : 'bg-surface-muted text-muted border-border-subtle cursor-not-allowed'}`}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
