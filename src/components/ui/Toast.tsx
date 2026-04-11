import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  show: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextId++;
    setToasts((t) => [...t, { ...toast, id }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const config: Record<ToastType, { icon: React.ReactNode; rule: string }> = {
    success: { icon: <CheckCircle size={15} className="text-success" />, rule: 'bg-success' },
    info:    { icon: <Info size={15} className="text-info" />,            rule: 'bg-info' },
    warning: { icon: <AlertTriangle size={15} className="text-warning" />, rule: 'bg-warning' },
    danger:  { icon: <AlertCircle size={15} className="text-danger" />,    rule: 'bg-danger' },
  };
  const c = config[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.98 }}
      transition={{ duration: motionDurations.toast, ease: motionEasings.out }}
      className="pointer-events-auto relative flex items-start gap-3 pl-4 pr-3 py-3 min-w-[320px] max-w-[420px] bg-surface border border-border-default rounded-md shadow-[0_2px_12px_rgba(17,17,17,0.10),0_1px_0_rgba(17,17,17,0.05)]"
    >
      {/* Printed left rule in the toast's tone colour — Ekko's editorial
          motif carried into ephemeral notifications. */}
      <span className={`absolute left-0 top-0 bottom-0 w-[2px] ${c.rule} rounded-l-md`} aria-hidden="true" />
      <div className="mt-0.5 flex-shrink-0">{c.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-primary leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="text-[12px] text-secondary mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-muted hover:text-primary transition-colors flex-shrink-0 -mr-1 -mt-0.5"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
