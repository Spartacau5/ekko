// Phase 6 (second pass): refined Tabs.
// Tighter labels, uppercase count chips, and a thicker accent underline that
// echoes the TopNav active-state motif. The indicator animates between tabs
// via framer-motion's layoutId.

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
            className={`px-4 py-2.5 text-[13px] font-semibold relative cursor-pointer tracking-tight
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:bg-surface-muted/40
              ${active ? 'text-primary' : 'text-muted hover:text-secondary'}`}
          >
            <span className="inline-flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`tabular-nums text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border
                    ${active
                      ? 'bg-accent-soft text-primary border-accent/40'
                      : 'bg-surface-muted/70 text-muted border-border-subtle'}`}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-accent"
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
