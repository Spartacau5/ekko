import React, { useEffect, useState } from 'react';
import { Lock, X } from 'lucide-react';

// Small internal-note composer. Used on any detail page that wants to add a
// team-visible note. Doesn't persist — caller typically toasts + closes.

interface ComposeNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: string) => void;
  entityLabel: string;
}

export function ComposeNoteModal({ open, onClose, onSubmit, entityLabel }: ComposeNoteModalProps) {
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) setBody('');
  }, [open]);

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

  const canPost = body.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div
        className="bg-surface border border-border-default rounded-md shadow-lg w-full max-w-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div>
            <h2 className="text-[16px] font-semibold text-primary">Add team note</h2>
            <p className="text-[12px] text-muted mt-0.5">On {entityLabel}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add context for the team — what should the next person know?"
            rows={5}
            autoFocus
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted resize-none
              focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
          />
          <p className="text-[11px] text-muted mt-2 flex items-center gap-1">
            <Lock size={11} /> Visible to your team only
          </p>
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
            disabled={!canPost}
            onClick={() => onSubmit(body.trim())}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium bg-accent text-primary border border-border-default rounded-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post note
          </button>
        </div>
      </div>
    </div>
  );
}
