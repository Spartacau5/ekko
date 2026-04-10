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

  const config: Record<ToastType, { icon: React.ReactNode; bg: string; border: string }> = {
    success: { icon: <CheckCircle size={16} className="text-success" />, bg: 'bg-success-soft', border: 'border-success/30' },
    info:    { icon: <Info size={16} className="text-info" />,         bg: 'bg-info-soft',    border: 'border-info/30' },
    warning: { icon: <AlertTriangle size={16} className="text-warning" />, bg: 'bg-warning-soft', border: 'border-warning/30' },
    danger:  { icon: <AlertCircle size={16} className="text-danger" />, bg: 'bg-danger-soft', border: 'border-danger/30' },
  };
  const c = config[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.96 }}
      transition={{ duration: motionDurations.toast, ease: motionEasings.out }}
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 min-w-[320px] max-w-[420px] bg-surface border ${c.border} rounded-md shadow-lg`}
    >
      <div className="mt-0.5 flex-shrink-0">{c.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary">{toast.title}</p>
        {toast.description && <p className="text-[13px] text-secondary mt-0.5">{toast.description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="text-muted hover:text-primary transition-colors flex-shrink-0 -mr-1 -mt-0.5"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
