import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }: ModalProps) {
  // Lock body scroll while open + escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-overlay" />

          {/* Panel — printed border + soft editorial shadow */}
          <motion.div
            className={`relative bg-surface border border-border-default rounded-md ${width} w-full mx-4 max-h-[85vh] flex flex-col shadow-[0_24px_64px_rgba(17,17,17,0.18),0_1px_0_rgba(17,17,17,0.06)]`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border-subtle bg-surface-muted/25">
              <div className="min-w-0">
                <p className="eyebrow mb-1.5">Ekko</p>
                <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight tracking-tight">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-primary transition-colors duration-150 p-1 -mr-1 mt-0.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle bg-surface-muted/25">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
