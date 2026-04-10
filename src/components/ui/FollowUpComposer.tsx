import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';
import { AssignOwnerControl } from './AssignOwnerControl';
import { ActionPriority, ActionEntity } from '../../data/actions';
import { useRole } from '../../lib/RoleContext';

interface FollowUpComposerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    context: string;
    ownerId: string;
    dueDate: string;
    priority: ActionPriority;
    entity?: ActionEntity;
  }) => void;
  defaultTitle?: string;
  defaultContext?: string;
  defaultOwnerId?: string;
  defaultEntity?: ActionEntity;
}

const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// Static "today" + lightweight relative date suggestions for the prototype.
const TODAY = '2026-04-10';
const dateSuggestions = [
  { label: 'Today', value: '2026-04-10' },
  { label: 'In 3 days', value: '2026-04-13' },
  { label: 'This week', value: '2026-04-17' },
  { label: 'Next week', value: '2026-04-24' },
  { label: 'In 30 days', value: '2026-05-10' },
];

export function FollowUpComposer({
  open,
  onClose,
  onCreate,
  defaultTitle = '',
  defaultContext = '',
  defaultOwnerId,
  defaultEntity,
}: FollowUpComposerProps) {
  const { activeMember } = useRole();
  const [title, setTitle] = useState(defaultTitle);
  const [context, setContext] = useState(defaultContext);
  const [ownerId, setOwnerId] = useState(defaultOwnerId || activeMember.id);
  const [dueDate, setDueDate] = useState('2026-04-17');
  const [priority, setPriority] = useState<ActionPriority>('medium');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle);
      setContext(defaultContext);
      setOwnerId(defaultOwnerId || activeMember.id);
      setDueDate('2026-04-17');
      setPriority('medium');
      setTouched(false);
    }
  }, [open, defaultTitle, defaultContext, defaultOwnerId, activeMember.id]);

  const valid = title.trim().length > 0;

  const handleSubmit = () => {
    setTouched(true);
    if (!valid) return;
    onCreate({
      title: title.trim(),
      context: context.trim() || 'Follow-up created from this surface.',
      ownerId,
      dueDate,
      priority,
      entity: defaultEntity,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create follow-up"
      width="max-w-xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create task</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {defaultEntity && (
          <div className="bg-surface-muted/40 border border-border-subtle rounded-sm px-3 py-2">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-0.5">Linked to</p>
            <p className="text-[13px] text-primary font-medium">{defaultEntity.label}</p>
          </div>
        )}

        <TextInput
          label="What needs to happen?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Send tailored brief to Maya Patel"
          error={touched && !valid ? 'Give this task a short, action-oriented title' : undefined}
          required
        />

        <div>
          <label className="text-[13px] font-medium text-primary block mb-1">Context (optional)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="A sentence or two so the owner knows what they're walking into."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-sm outline-none
              transition-[border-color,box-shadow] duration-150 ease-out
              placeholder:text-muted/80
              hover:border-border-default/60 focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-primary block mb-1">Owner</label>
            <AssignOwnerControl ownerId={ownerId} onChange={setOwnerId} />
          </div>
          <SelectInput
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as ActionPriority)}
            options={priorityOptions}
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-primary block mb-1">Due date</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {dateSuggestions.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDueDate(d.value)}
                className={`px-2 py-1 text-[12px] font-medium border rounded-sm transition-colors duration-150
                  ${dueDate === d.value
                    ? 'bg-accent-soft border-accent text-primary'
                    : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={dueDate}
            min={TODAY}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 text-sm bg-surface border border-border-subtle rounded-sm outline-none
              hover:border-border-default/60 focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/40"
          />
        </div>
      </div>
    </Modal>
  );
}
