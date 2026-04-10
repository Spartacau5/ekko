import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { Checkbox } from './Checkbox';

interface SaveViewModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; description: string; isShared: boolean; pinToDashboard: boolean }) => void;
  resultCount: number;
  filterSummary: string[];
  defaultName?: string;
}

export function SaveViewModal({ open, onClose, onSave, resultCount, filterSummary, defaultName = '' }: SaveViewModalProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(true);
  const [pinToDashboard, setPinToDashboard] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setDescription('');
      setIsShared(true);
      setPinToDashboard(false);
      setTouched(false);
    }
  }, [open, defaultName]);

  const valid = name.trim().length > 0;

  const handleSave = () => {
    setTouched(true);
    if (!valid) return;
    onSave({ name: name.trim(), description: description.trim(), isShared, pinToDashboard });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save current view"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save view</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="bg-surface-muted/40 border border-border-subtle rounded-sm p-3">
          <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">This view captures</p>
          <p className="text-sm text-primary mb-2">{resultCount} {resultCount === 1 ? 'result' : 'results'} matching:</p>
          {filterSummary.length === 0 ? (
            <p className="text-[13px] text-secondary italic">No filters — saves the current full list.</p>
          ) : (
            <ul className="text-[13px] text-secondary space-y-0.5">
              {filterSummary.map((s, i) => (
                <li key={i}>· {s}</li>
              ))}
            </ul>
          )}
        </div>

        <TextInput
          label="View name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Major donors needing follow-up"
          error={touched && !valid ? 'Give the view a short, scannable name' : undefined}
          required
        />

        <TextInput
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this view for? Who is it useful to?"
        />

        <div className="flex flex-col gap-3 pt-2 border-t border-border-subtle">
          <Checkbox
            label="Share with team"
            description="Other roles will see this view in their saved views bar."
            checked={isShared}
            onChange={() => setIsShared((s) => !s)}
          />
          <Checkbox
            label="Pin to my dashboard"
            description="Adds a quick-access tile to the dashboard's pinned section."
            checked={pinToDashboard}
            onChange={() => setPinToDashboard((s) => !s)}
          />
        </div>
      </div>
    </Modal>
  );
}
