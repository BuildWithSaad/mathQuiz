import React from 'react';

/**
 * Runner Component
 * Animated virtual athlete with athletic gear, headband, race bib, and baton.
 * Supports states: 'idle', 'running', 'stumble', 'celebrate'
 */
export const Runner = ({ state = 'idle', className = '' }) => {
  return (
    <div className={`runner-character runner-${state} ${className}`} aria-label="Math Relay Runner">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="runner-svg"
      >
        {/* Shadow under runner */}
        <ellipse cx="32" cy="59" rx="14" ry="4" fill="rgba(15, 23, 42, 0.2)" className="runner-shadow" />

        {/* Left Leg (back) */}
        <g className="runner-leg leg-left">
          <path
            d="M28 39L23 48L19 57"
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Shoe */}
          <path
            d="M17 56L22 57L16 60Z"
            fill="#06B6D4"
            stroke="#0891B2"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Left Arm (holding baton) */}
        <g className="runner-arm arm-left">
          <path
            d="M26 26L16 32L12 28"
            stroke="#FDBA74"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Relay Baton */}
          <rect
            x="8"
            y="23"
            width="5"
            height="14"
            rx="2.5"
            transform="rotate(-20 8 23)"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="1"
          />
        </g>

        {/* Torso / Athletic Jersey */}
        <g className="runner-body">
          {/* Main jersey */}
          <path
            d="M24 23H40L38 41H26L24 23Z"
            fill="#4F46E5"
            stroke="#3730A3"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Shoulder straps */}
          <path d="M28 23V27M36 23V27" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Race Number / Bib */}
          <rect x="28" y="28" width="8" height="9" rx="2" fill="#FFFFFF" />
          <text
            x="32"
            y="35"
            textAnchor="middle"
            fontSize="7"
            fontWeight="900"
            fill="#4F46E5"
            fontFamily="Outfit, sans-serif"
          >
            π
          </text>
        </g>

        {/* Right Leg (front) */}
        <g className="runner-leg leg-right">
          <path
            d="M36 39L42 47L47 57"
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Shoe */}
          <path
            d="M45 56L51 57L46 60Z"
            fill="#06B6D4"
            stroke="#0891B2"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Head & Face */}
        <g className="runner-head">
          {/* Neck */}
          <rect x="30" y="20" width="4" height="4" fill="#FDBA74" />
          {/* Face */}
          <circle cx="32" cy="15" r="9" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1" />
          {/* Hair */}
          <path
            d="M23 14C23 9 27 6 32 6C37 6 41 9 41 13C41 14 39 12 37 12C34 12 33 13 31 11C29 13 26 12 23 14Z"
            fill="#334155"
          />
          {/* Athletic Headband */}
          <rect x="23" y="11" width="18" height="4" rx="2" fill="#EF4444" />
          <line x1="28" y1="13" x2="36" y2="13" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
          
          {/* Eyes & Smile */}
          {state === 'stumble' ? (
            /* Dizzy/oops face */
            <>
              <text x="28" y="18" fontSize="6" fontWeight="bold" fill="#1E293B">x</text>
              <text x="34" y="18" fontSize="6" fontWeight="bold" fill="#1E293B">x</text>
              <path d="M29 20Q32 18 35 20" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Determined / happy face */
            <>
              <circle cx="29" cy="16" r="1.5" fill="#1E293B" />
              <circle cx="35" cy="16" r="1.5" fill="#1E293B" />
              <path d="M29 19Q32 22 35 19" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* Right Arm (front) */}
        <g className="runner-arm arm-right">
          <path
            d="M38 26L48 31L52 27"
            stroke="#FDBA74"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
