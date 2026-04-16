import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Check, Building2 } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

// Step 2: organization search. Empty → hero illustration with hint. Results →
// card list with a selectable option. No matches → illustration + "No results"
// copy. A trailing link opens the manual-entry modal (handled by the parent).

export interface OrgResult {
  id: string;
  name: string;
  ein: string;
  city: string;
  sizeLabel: string;
}

export const MOCK_ORGS: OrgResult[] = [
  { id: 'rivergate-youth',     name: 'Rivergate Youth Services',      ein: '13-4567890', city: 'Austin, TX',   sizeLabel: 'Large-size nonprofit' },
  { id: 'rivergate-alliance',  name: 'Rivergate Community Alliance',  ein: '32-8273423', city: 'New York, NY', sizeLabel: 'Mid-size nonprofit' },
  { id: 'rivergate-against',   name: 'Rivergate Against',             ein: '22-9784978', city: 'New York, NY', sizeLabel: 'Mid-size nonprofit' },
  { id: 'rivergate-rescue',    name: 'Rivergate Rescue',              ein: '16-2348795', city: 'Newark, NJ',   sizeLabel: 'Small nonprofit' },
];

export interface OrgState {
  query: string;
  selectedId: string | null;
  manualEntryId: string | null; // set when user submits the Add Org modal
}

export interface ManualOrgSummary {
  name: string;
  headquarters: string;
  type: string;
  ein: string;
}

interface OrganizationStepProps {
  state: OrgState;
  onChange: (next: OrgState) => void;
  onOpenManualModal: () => void;
  manualOrg?: ManualOrgSummary;
}

export function OrganizationStep({ state, onChange, onOpenManualModal, manualOrg }: OrganizationStepProps) {
  const results = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    if (q.length < 2) return null;
    return MOCK_ORGS.filter((o) => o.name.toLowerCase().includes(q) || o.ein.includes(q));
  }, [state.query]);

  const hasQuery = state.query.trim().length >= 2;
  const noResults = results !== null && results.length === 0;
  const hasResults = results !== null && results.length > 0;

  return (
    <div className="flex-1 flex flex-col gap-6 w-full">
      <div className="flex items-center gap-2 px-3 py-[9px] border border-border-subtle rounded-lg bg-surface focus-within:border-border-default transition-colors duration-150">
        <Search size={16} className="text-muted shrink-0" />
        <input
          value={state.query}
          onChange={(e) => onChange({ ...state, query: e.target.value, selectedId: null, manualEntryId: null })}
          placeholder="Rivergate"
          className="flex-1 outline-none text-[16px] leading-[20px] bg-transparent text-primary placeholder:text-muted/80"
        />
      </div>

      <AnimatePresence mode="wait">
        {!hasQuery && !state.manualEntryId && (
          <EmptyState
            key="empty"
            message="Enter at least 2 characters to search."
            onManualEntry={onOpenManualModal}
          />
        )}
        {hasQuery && noResults && (
          <EmptyState
            key="no-results"
            message="No results found. Please try again."
            onManualEntry={onOpenManualModal}
          />
        )}
        {hasResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="flex flex-col gap-4"
          >
            <p className="text-[14px] leading-[18px] text-primary">
              Total {results!.length} result{results!.length === 1 ? '' : 's'}
            </p>
            <ul className="flex flex-col gap-2">
              {results!.map((org) => {
                const selected = state.selectedId === org.id;
                return (
                  <li key={org.id}>
                    <button
                      type="button"
                      onClick={() => onChange({ ...state, selectedId: org.id, manualEntryId: null })}
                      aria-pressed={selected}
                      className={`w-full text-left flex gap-4 items-center p-4 border rounded-lg cursor-pointer
                        transition-[background-color,border-color,box-shadow] duration-150 ease-out
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border-default
                        ${selected
                          ? 'border-accent bg-accent-soft/40 shadow-[inset_0_0_0_1px_rgba(244,190,0,0.4)]'
                          : 'border-border-subtle hover:border-border-default bg-surface'}`}
                    >
                      <div className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                        selected ? 'bg-accent-soft text-primary' : 'bg-surface-muted text-muted'
                      }`}>
                        <Building2 size={20} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[16px] leading-[20px] font-medium text-primary truncate">{org.name}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-[opacity,background-color] duration-150 ${
                                selected ? 'opacity-100 bg-accent text-primary' : 'opacity-0'
                              }`}
                              aria-hidden={!selected}
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <p className="text-[12px] leading-[14px] text-muted">EIN: {org.ein}</p>
                          </div>
                        </div>
                        <p className="text-[12px] leading-[14px] text-muted">
                          {org.city} &middot; {org.sizeLabel}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <ManualEntryLink onClick={onOpenManualModal} />
          </motion.div>
        )}
        {state.manualEntryId && manualOrg && (
          <motion.div
            key="manual-selected"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="flex gap-4 items-center p-4 border border-accent bg-accent-soft/40 rounded-lg shadow-[inset_0_0_0_1px_rgba(244,190,0,0.4)]"
          >
            <div className="w-[42px] h-[42px] rounded-lg bg-accent-soft flex items-center justify-center text-primary shrink-0">
              <Building2 size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[16px] leading-[20px] font-medium text-primary truncate">
                  {manualOrg.name || 'Your organization'}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <p className="text-[12px] leading-[14px] text-muted">EIN: {manualOrg.ein || '—'}</p>
                </div>
              </div>
              <p className="text-[12px] leading-[14px] text-muted">
                {[manualOrg.headquarters, manualOrg.type].filter(Boolean).join(' · ') || 'Added manually'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ message, onManualEntry }: { message: string; onManualEntry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
      className="flex-1 flex flex-col items-center justify-center py-4"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-[180px] h-[164px]">
          <img
            src="/images/onboarding/empty/org-search-bg.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
          />
          <img
            src="/images/onboarding/empty/org-search-figure.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-[15px] left-[42px] w-[110px] h-[150px]"
          />
        </div>
        <p className="text-[16px] leading-[20px] text-muted text-center">{message}</p>
      </div>
      <div className="mt-3">
        <ManualEntryLink onClick={onManualEntry} />
      </div>
    </motion.div>
  );
}

function ManualEntryLink({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex gap-1.5 items-center text-[14px] leading-[18px]">
      <span className="text-muted">Don't see your organization?</span>
      <button
        onClick={onClick}
        className="text-secondary font-medium hover:text-primary transition-colors duration-150 cursor-pointer underline-offset-2 hover:underline"
      >
        Enter details manually
      </button>
    </div>
  );
}

export function getOrgStepDisplayName(state: OrgState, manualOrgName?: string): string | null {
  if (state.manualEntryId) return manualOrgName || 'Manual entry';
  if (state.selectedId) return MOCK_ORGS.find((o) => o.id === state.selectedId)?.name || null;
  return null;
}
