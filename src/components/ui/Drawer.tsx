import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Drawer({ open, onClose, title, subtitle, children, footer, width = 480 }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
          className="fixed inset-0 z-50 flex justify-end"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        >
          <div className="absolute inset-0 bg-overlay" />

          <motion.div
            className="relative bg-surface border-l border-border-subtle h-full flex flex-col shadow-xl"
            style={{ width }}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-border-subtle">
              <div>
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-primary transition-colors duration-150 p-1 -mr-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
