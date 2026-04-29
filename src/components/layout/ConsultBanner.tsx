import React from 'react';

interface ConsultBannerProps {
  className?: string;
  onClick?: () => void;
}

// "Still human" Consult banner — a fully scalable SVG composition built from
// the individual leaf, character, and lockup assets in /public/images. Uses
// preserveAspectRatio="xMidYMid meet" so the contents always fit inside the
// container without being cropped, regardless of how tall or short the
// remaining sidebar slot is.
export function ConsultBanner({ className = '', onClick }: ConsultBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Consult"
      className={`group block w-full h-full cursor-pointer text-left ${className}`}
    >
      <svg
        viewBox="0 0 220 360"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-full"
      >
        {/* Soft canvas */}
        <rect width="220" height="360" rx="8" fill="#F4F5FB" />

        {/* Decorative palm leaves — scattered around the corners. */}
        <image href="/images/AdobeStock_433465982 9.png"   x="-20" y="-10"  width="115" height="135" opacity="0.7" />
        <image href="/images/AdobeStock_433465982 7-1.png" x="125" y="-15"  width="115" height="140" opacity="0.7" />
        <image href="/images/AdobeStock_433465982 14.png"  x="-18" y="120"  width="90"  height="110" opacity="0.55" />
        <image href="/images/AdobeStock_433465982 15.png"  x="148" y="150"  width="90"  height="110" opacity="0.55" />
        <image href="/images/AdobeStock_433465982 12.png"  x="-12" y="245"  width="85"  height="100" opacity="0.55" />
        <image href="/images/AdobeStock_433465982 17.png"  x="150" y="265"  width="80"  height="95"  opacity="0.55" />

        {/* OO mark */}
        <g
          transform="translate(58 38)"
          stroke="#02066F"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="0"  y="2" width="44" height="46" rx="22" />
          <rect x="54" y="2" width="64" height="46" rx="23" />
        </g>

        {/* Still human caption */}
        <text
          x="110"
          y="120"
          textAnchor="middle"
          fontFamily="Poppins, system-ui, sans-serif"
          fontWeight={600}
          fontSize="16"
          fill="#020035"
        >
          Still human
        </text>

        {/* Consult button */}
        <g className="text-brand">
          <rect
            x="55"
            y="180"
            width="110"
            height="40"
            rx="20"
            fill="#FFFFFF"
            stroke="#02066F"
            strokeWidth="1.5"
            className="transition-colors duration-150 group-hover:fill-brand/5"
          />
          <text
            x="110"
            y="206"
            textAnchor="middle"
            fontFamily="Poppins, system-ui, sans-serif"
            fontWeight={500}
            fontSize="14"
            fill="#02066F"
          >
            Consult
          </text>
        </g>

        {/* Sitting character — anchored to the bottom of the banner. */}
        <image
          href="/images/sitting.png"
          x="55"
          y="245"
          width="110"
          height="115"
          preserveAspectRatio="xMidYMax meet"
        />
      </svg>
    </button>
  );
}
