import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-border-subtle">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer
            ${activeTab === tab.id
              ? 'text-primary'
              : 'text-muted hover:text-secondary'
            }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-[12px] text-muted">{tab.count}</span>
          )}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
          )}
        </button>
      ))}
    </div>
  );
}
