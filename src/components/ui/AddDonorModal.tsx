import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { DonorType, GivingStatus, RiskLevel, Relationship, Stage } from '../../data/donors';

interface AddDonorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    email: string;
    phone: string;
    donorType: DonorType;
    givingStatus: GivingStatus;
    relationship: Relationship;
    stage: Stage;
    risk: RiskLevel;
    accountOwner: string;
  }) => void;
  ownerOptions: string[];
}

const TYPE_OPTIONS: DonorType[] = [
  'Individual major donor',
  'Major donor',
  'Recurring donor',
  'Prospective donor',
  'Foundation contact',
  'Corporate contact',
  'Small donor',
];

const RELATIONSHIP_OPTIONS: Relationship[] = ['Active', 'At-risk', 'Lapsed', 'Inactive'];
const RISK_OPTIONS: RiskLevel[] = ['Low', 'Medium', 'High'];

export function AddDonorModal({ open, onClose, onSubmit, ownerOptions }: AddDonorModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donorType, setDonorType] = useState<DonorType>('Prospective donor');
  const [relationship, setRelationship] = useState<Relationship>('Active');
  const [risk, setRisk] = useState<RiskLevel>('Low');
  const [accountOwner, setAccountOwner] = useState(ownerOptions[0] ?? '');

  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setPhone('');
      setDonorType('Prospective donor');
      setRelationship('Active');
      setRisk('Low');
      setAccountOwner(ownerOptions[0] ?? '');
    }
  }, [open, ownerOptions]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = name.trim().length > 0 && email.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div
        className="bg-surface border border-border-default rounded-md shadow-lg w-full max-w-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[16px] font-semibold text-primary">Add donor</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </Field>
            <Field label="Account owner">
              <Select value={accountOwner} onChange={setAccountOwner} options={ownerOptions} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                  focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Type">
              <Select value={donorType} onChange={(v) => setDonorType(v as DonorType)} options={TYPE_OPTIONS} />
            </Field>
            <Field label="Relationship">
              <Select value={relationship} onChange={(v) => setRelationship(v as Relationship)} options={RELATIONSHIP_OPTIONS} />
            </Field>
            <Field label="Risk">
              <Select value={risk} onChange={(v) => setRisk(v as RiskLevel)} options={RISK_OPTIONS} />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle bg-surface-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center h-9 px-4 text-[13px] font-medium text-secondary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              const givingStatus: GivingStatus =
                relationship === 'Active' ? 'Active' :
                relationship === 'At-risk' ? 'At risk' :
                relationship === 'Lapsed' ? 'Inactive' : 'Cold';
              const stage: Stage =
                relationship === 'Active' ? 'Early' :
                relationship === 'At-risk' ? 'Slipping' :
                relationship === 'Lapsed' ? 'Lapsed' : 'Unqualified';
              onSubmit({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                donorType,
                givingStatus,
                relationship,
                stage,
                risk,
                accountOwner,
              });
            }}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium bg-brand text-white border border-brand rounded-sm hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add donor
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-primary">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary
        focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
