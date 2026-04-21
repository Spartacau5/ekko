import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Simple email composer modal used by bulk / per-row "Email" actions across
// the app. Captures subject + body, fires `onSend` on submit. No actual send
// happens in the MVP — the caller typically shows a success toast.

interface ComposeEmailModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (payload: { subject: string; body: string }) => void;
  recipients: string; // e.g. "Maya Patel, Jordan Rivera" or "3 selected donors"
  defaultSubject?: string;
  defaultBody?: string;
}

export function ComposeEmailModal({
  open,
  onClose,
  onSend,
  recipients,
  defaultSubject = '',
  defaultBody = '',
}: ComposeEmailModalProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  useEffect(() => {
    if (open) {
      setSubject(defaultSubject);
      setBody(defaultBody);
    }
  }, [open, defaultSubject, defaultBody]);

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

  const canSend = subject.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div
        className="bg-surface border border-border-default rounded-md shadow-lg w-full max-w-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[16px] font-semibold text-primary">Compose email</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <div>
            <p className="text-[12px] font-semibold text-primary mb-1">To</p>
            <div className="h-10 px-3 flex items-center bg-surface-muted/60 border border-border-subtle rounded-sm text-[13px] text-primary">
              {recipients}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-primary">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
              className="h-10 px-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-primary">Message</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              className="px-3 py-2 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted resize-none
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </label>
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
            disabled={!canSend}
            onClick={() => onSend({ subject: subject.trim(), body: body.trim() })}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium bg-accent text-primary border border-border-default rounded-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send email
          </button>
        </div>
      </div>
    </div>
  );
}
