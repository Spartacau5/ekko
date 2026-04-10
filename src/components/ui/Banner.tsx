import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface BannerProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

const styles: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
  info: { bg: 'bg-info-soft', border: 'border-info/30', icon: <Info size={16} className="text-info" /> },
  warning: { bg: 'bg-warning-soft', border: 'border-warning/30', icon: <AlertTriangle size={16} className="text-warning" /> },
  danger: { bg: 'bg-danger-soft', border: 'border-danger/30', icon: <AlertCircle size={16} className="text-danger" /> },
  success: { bg: 'bg-success-soft', border: 'border-success/30', icon: <CheckCircle size={16} className="text-success" /> },
};

export function Banner({ type, title, description, action, onDismiss }: BannerProps) {
  const s = styles[type];
  return (
    <div className={`flex items-start gap-3 px-4 py-3 border rounded-sm ${s.bg} ${s.border}`}>
      <div className="mt-0.5 flex-shrink-0">{s.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary">{title}</p>
        {description && <p className="text-[13px] text-secondary mt-0.5">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[13px] font-medium text-primary underline whitespace-nowrap flex-shrink-0"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
