import React from 'react';
import { motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../../lib/motion';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  layoutId?: string;
}

export function Tabs({ tabs, activeTab, onChange, layoutId = 'tabs-indicator' }: TabsProps) {
  return (
    <div className="flex border-b border-border-subtle" role="tablist">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium relative cursor-pointer
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:bg-surface-muted/40
              ${active ? 'text-primary' : 'text-muted hover:text-secondary'}`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-[12px] text-muted">{tab.count}</span>
            )}
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
