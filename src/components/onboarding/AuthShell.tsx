import React from 'react';
import { motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../../lib/motion';

// Shared split-panel layout used by Sign up and Sign in. Left side holds the
// form card; right side shows a monochrome preview of the Ekko workspace
// alongside a short tagline.

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-page flex gap-14 items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        className="basis-[30%] shrink-0 min-w-[460px] h-[calc(100vh-64px)] bg-surface rounded-[32px] shadow-[0_0_64px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(17,17,17,0.04)] flex items-center justify-center p-12"
      >
        <div className="w-full max-w-[340px] flex flex-col gap-12 items-center">
          {children}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: motionDurations.modal * 1.4, ease: motionEasings.out, delay: 0.05 }}
        className="basis-[70%] h-[calc(100vh-64px)] flex flex-col gap-6 items-center justify-center"
      >
        <div className="w-full max-w-[780px]">
          <WorkspacePreview />
        </div>
        <p className="text-[14px] leading-[18px] text-secondary font-normal max-w-[600px] text-center">
          Ekko brings together your donor relationships, policy landscape, and peer insights into one clear, actionable workspace. Let's get your organization set up.
        </p>
      </motion.div>
    </div>
  );
}

// Monochrome SVG evocation of the Ekko dashboard, framed like a tablet.
// Drawn flat rather than sourcing a real screenshot so the asset ships with
// the codebase and stays legible at any size.
function WorkspacePreview() {
  return (
    <div className="w-full aspect-[701/500] relative">
      <div className="absolute inset-0 rounded-[22px] bg-[#1d1d1f] p-[10px] shadow-[0_24px_48px_rgba(17,17,17,0.12)]">
        <div className="w-full h-full rounded-[14px] bg-[#F4F4F6] overflow-hidden flex flex-col mix-blend-luminosity">
          {/* Top bar */}
          <div className="h-8 border-b border-[#D9D9E1] flex items-center px-3 gap-2">
            <div className="w-4 h-4 rounded-sm bg-brand" />
            <div className="text-[9px] font-sans font-extrabold text-[#111] tracking-tight">EKKO</div>
            <div className="flex-1" />
            <div className="flex gap-1">
              <div className="w-8 h-3 rounded-sm bg-[#E8E8EE]" />
              <div className="w-3 h-3 rounded-full bg-[#E8E8EE]" />
            </div>
          </div>
          {/* Body */}
          <div className="flex-1 flex">
            {/* Sidebar */}
            <div className="w-20 border-r border-[#D9D9E1] p-2 flex flex-col gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-3 rounded-sm ${i === 0 ? 'bg-[#111]' : 'bg-[#E8E8EE]'}`} />
              ))}
            </div>
            {/* Main */}
            <div className="flex-1 p-3 flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <div className="h-3 w-24 rounded-sm bg-[#111]" />
                <div className="h-2 w-16 rounded-sm bg-[#E8E8EE]" />
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 h-14 rounded-md bg-surface border border-[#D9D9E1] p-1.5 flex flex-col gap-1">
                    <div className="h-1.5 w-8 rounded-sm bg-[#E8E8EE]" />
                    <div className="h-3 w-10 rounded-sm bg-[#111]" />
                    <div className="h-1 w-6 rounded-sm bg-[#E8E8EE]" />
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-md bg-surface border border-[#D9D9E1] p-2 flex flex-col gap-1.5">
                <div className="h-2 w-20 rounded-sm bg-[#111]" />
                <div className="flex-1 flex items-end gap-1">
                  {[0.5, 0.7, 0.4, 0.8, 0.6, 0.9, 0.5, 0.7, 0.85, 0.6, 0.75, 0.5].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-[#111]"
                      style={{ height: `${h * 100}%`, opacity: 0.4 + h * 0.5 }}
                    />
                  ))}
                </div>
              </div>
              <div className="h-8 rounded-md bg-surface border border-[#D9D9E1] flex items-center px-2 gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#111]" />
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="h-1.5 w-16 rounded-sm bg-[#111]" />
                  <div className="h-1 w-20 rounded-sm bg-[#E8E8EE]" />
                </div>
                <div className="h-3 w-10 rounded-sm bg-[#111]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
