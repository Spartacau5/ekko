import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  serif?: boolean;
}

export function PageHeader({ title, subtitle, actions, serif = false }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className={`text-[28px] leading-[36px] font-semibold text-primary ${serif ? 'font-serif' : ''}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
