// Standalone iPhone lock-screen mockup. Used as the cold-open frame for the
// product video — Sofia (Executive Director) is glancing at her phone when
// an Ekko notification arrives about the NYC Food Expansion Act hearing.
//
// Reached only via /notification — not linked from anywhere in the app.

import React from 'react';
import { Lock, Flashlight, Camera, ChevronUp, Wifi } from 'lucide-react';

export function NotificationMockupPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B12] flex items-center justify-center p-6">
      <PhoneFrame>
        <LockScreen />
      </PhoneFrame>
    </div>
  );
}

// ─── Phone shell ────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative shrink-0 rounded-[58px] bg-[#0B0B12] p-[14px]"
      style={{
        width: 390,
        height: 844,
        boxShadow:
          '0 0 0 1.5px #1F1F26, 0 24px 80px rgba(0, 0, 0, 0.55), 0 6px 18px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div
        className="relative w-full h-full rounded-[46px] overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #2B1B38 0%, #1B2240 38%, #0F1A35 72%, #050A1E 100%)',
        }}
      >
        {children}
        {/* Side buttons (decorative) */}
      </div>
      {/* Power + volume buttons */}
      <span className="absolute left-[-2px] top-[140px] w-[3px] h-[32px] rounded-l bg-[#1F1F26]" />
      <span className="absolute left-[-2px] top-[200px] w-[3px] h-[58px] rounded-l bg-[#1F1F26]" />
      <span className="absolute left-[-2px] top-[270px] w-[3px] h-[58px] rounded-l bg-[#1F1F26]" />
      <span className="absolute right-[-2px] top-[180px] w-[3px] h-[88px] rounded-r bg-[#1F1F26]" />
    </div>
  );
}

// ─── Lock screen ────────────────────────────────────────────────────────────

function LockScreen() {
  return (
    <div className="absolute inset-0 flex flex-col text-white">
      {/* Status bar */}
      <div className="relative pt-[14px] px-7 flex items-center justify-between text-[14px] font-semibold tabular-nums">
        <span>9:41</span>
        {/* Dynamic island */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[120px] h-[34px] rounded-full bg-black" />
        <div className="flex items-center gap-1.5">
          <SignalDots />
          <Wifi size={15} strokeWidth={2.4} />
          <BatteryIcon />
        </div>
      </div>

      {/* Lock pill */}
      <div className="mt-12 flex justify-center">
        <Lock size={14} strokeWidth={2.6} className="opacity-90" />
      </div>

      {/* Time + date */}
      <div className="mt-3 flex flex-col items-center px-6">
        <p className="text-[15px] font-semibold tracking-[0.01em] opacity-95">
          Monday, June 6
        </p>
        <p
          className="mt-1 font-light leading-none text-white"
          style={{
            fontFamily: 'SF Pro Display, "Inter", system-ui, sans-serif',
            fontSize: 96,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 24px rgba(0,0,0,0.18)',
          }}
        >
          9:41
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification stack */}
      <div className="px-3 pb-[120px]">
        <EkkoNotification />
      </div>

      {/* Bottom controls */}
      <div className="absolute left-0 right-0 bottom-[42px] px-9 flex items-center justify-between">
        <CornerButton>
          <Flashlight size={20} strokeWidth={2.2} fill="white" />
        </CornerButton>
        <CornerButton>
          <Camera size={20} strokeWidth={2.2} />
        </CornerButton>
      </div>

      {/* Home indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] w-[134px] h-[5px] rounded-full bg-white/85" />
    </div>
  );
}

// ─── Ekko notification ──────────────────────────────────────────────────────

function EkkoNotification() {
  return (
    <div
      className="rounded-[18px] px-3.5 py-3 flex items-start gap-2.5 backdrop-blur-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.16)',
        border: '0.5px solid rgba(255, 255, 255, 0.18)',
        boxShadow:
          '0 8px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      <EkkoAppIcon size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-[13px] font-semibold text-white leading-none">Ekko</span>
          <span className="text-[12px] text-white/75 leading-none">9:41 AM</span>
        </div>
        <p className="text-[13.5px] leading-[1.32] text-white">
          <span className="font-semibold">NYC Food Expansion Act:</span>{' '}
          Council hearing moved to June 10. Tap to review impact assessment.
        </p>
      </div>
    </div>
  );
}

// Orange app icon with the "OO" binocular wordmark — pulled from the Ekko
// brand. Two adjoining capsule glyphs read as the binocular motif on small
// scales.
function EkkoAppIcon({ size = 38 }: { size?: number }) {
  const radius = size * 0.235;
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background:
          'linear-gradient(180deg, #FF6A1A 0%, #ED4B00 55%, #C53E00 100%)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.30) inset, 0 -1px 0 rgba(0,0,0,0.20) inset, 0 2px 6px rgba(0,0,0,0.25)',
      }}
      aria-label="Ekko"
    >
      <svg
        viewBox="0 0 64 28"
        width={size * 0.66}
        height={(size * 0.66) * (28 / 64)}
        aria-hidden="true"
      >
        {/* Two stacked capsules — left thinner, right wider — reading as the
            "OO" binocular mark in white. */}
        <rect x="2"  y="2" width="22" height="24" rx="11" stroke="white" strokeWidth="4" fill="none" />
        <rect x="30" y="2" width="32" height="24" rx="12" stroke="white" strokeWidth="4" fill="none" />
      </svg>
    </div>
  );
}

// ─── Status bar bits ────────────────────────────────────────────────────────

function SignalDots() {
  return (
    <span className="inline-flex items-end gap-[2px] mr-1">
      <span className="w-[3px] h-[4px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[6px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[8px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[10px] rounded-[1px] bg-white" />
    </span>
  );
}

function BatteryIcon() {
  return (
    <span className="relative inline-flex items-center">
      <span className="w-[24px] h-[12px] rounded-[3px] border border-white/85 relative">
        <span className="absolute inset-[1.5px] rounded-[1.5px] bg-white" />
      </span>
      <span className="ml-[1px] w-[1.5px] h-[5px] rounded-[1px] bg-white/85" />
    </span>
  );
}

function CornerButton({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white"
      style={{ background: 'rgba(0, 0, 0, 0.36)', backdropFilter: 'blur(20px)' }}
    >
      {children}
    </span>
  );
}

// Decorative — keeps the swipe-up affordance hint near the home indicator.
// Currently unused but kept here for future tweaks.
export function _SwipeUpHint() {
  return <ChevronUp size={14} className="opacity-70" />;
}
