import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { donors as seedDonors, Donor } from '../data/donors';

type AddDonorInput = Pick<
  Donor,
  'name' | 'email' | 'phone' | 'donorType' | 'givingStatus' | 'relationship' | 'stage' | 'risk' | 'accountOwner'
>;

interface DonorsContextValue {
  donors: Donor[];
  deletedIds: Set<string>;
  deleteMany: (ids: string[]) => void;
  addDonor: (input: AddDonorInput) => Donor;
  restoreAll: () => void;
}

const DonorsContext = createContext<DonorsContextValue | null>(null);

// Session-scoped. When the user reloads/logs in again, state resets because
// this lives in memory only.
export function DonorsProvider({ children }: { children: React.ReactNode }) {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [extraDonors, setExtraDonors] = useState<Donor[]>([]);

  const deleteMany = useCallback((ids: string[]) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const addDonor = useCallback((input: AddDonorInput): Donor => {
    const id = `donor-${Date.now().toString(36)}`;
    const today = new Date().toISOString().slice(0, 10);
    const newDonor: Donor = {
      id,
      name: input.name,
      donorType: input.donorType,
      givingStatus: input.givingStatus,
      relationship: input.relationship,
      persona: 'Newly added',
      interests: [],
      lastEngagement: 'Added today',
      accountOwner: input.accountOwner,
      stage: input.stage,
      risk: input.risk,
      suggestedNextAction: 'Send introductory outreach',
      lifetimeGiving: 0,
      lastGift: 0,
      email: input.email,
      phone: input.phone,
      createdAt: today,
      timeline: [
        { date: today, type: 'note', title: 'Donor added to Ekko', description: `Added by ${input.accountOwner}` },
      ],
    };
    setExtraDonors((prev) => [newDonor, ...prev]);
    return newDonor;
  }, []);

  const restoreAll = useCallback(() => {
    setDeletedIds(new Set());
    setExtraDonors([]);
  }, []);

  const visibleDonors = useMemo(
    () => [...extraDonors, ...seedDonors].filter((d) => !deletedIds.has(d.id)),
    [deletedIds, extraDonors],
  );

  return (
    <DonorsContext.Provider value={{ donors: visibleDonors, deletedIds, deleteMany, addDonor, restoreAll }}>
      {children}
    </DonorsContext.Provider>
  );
}

export function useDonors() {
  const ctx = useContext(DonorsContext);
  if (!ctx) throw new Error('useDonors must be used within DonorsProvider');
  return ctx;
}
