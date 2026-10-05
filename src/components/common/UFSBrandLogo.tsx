import React from 'react';

interface UFSBrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  showSlogan?: boolean;
  showLanguages?: boolean;
  theme?: 'light' | 'dark' | 'white';
  compact?: boolean;
  stacked?: boolean;
}

export const UFSBrandLogo: React.FC<UFSBrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  showSlogan = false,
  showLanguages = true,
  theme = 'light',
  compact = false,
  stacked = false,
}) => {
  const isDark = theme === 'dark' || theme === 'white';

  const crestSizes = {
    sm: 'w-7 h-9',
    md: 'w-9 h-11 sm:w-10 sm:h-12',
    lg: 'w-12 h-15 sm:w-14 sm:h-17',
    hero: 'w-16 h-20 sm:w-20 sm:h-24',
  };

  const textSizes = {
    sm: 'text-[9px] leading-tight',
    md: 'text-[11px] sm:text-xs leading-[1.25]',
    lg: 'text-sm sm:text-base leading-[1.25]',
    hero: 'text-base sm:text-lg leading-[1.25]',
  };

  return (
    <div
      className={`inline-flex ${
        stacked ? 'flex-col items-center text-center' : 'items-center gap-3'
      } select-none`}
    >
      {/* 
        ========================================================================
        AUTHENTIC UNIVERSITY OF THE FREE STATE HERALDIC CREST
        Matches the exact drawing in official UFS branding:
        - Radiating Red Sunburst rays atop the shield
        - Blue double-outline heraldic shield
        - Open Book of Knowledge / Wisdom
        - Red chevron band with white stylized emblem
        - Blue base with wavy stripes
        - White bottom banner ribbon: "IN VERITATE SAPIENTIAE LUX"
        ========================================================================
      */}
      <div className={`${crestSizes[size]} shrink-0 relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 120 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* 1. Radiating Red Sunburst Rays atop the shield */}
          <g transform="translate(60, 28)">
            {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((angle, idx) => (
              <line
                key={idx}
                x1="0"
                y1="0"
                x2={Math.sin((angle * Math.PI) / 180) * 22}
                y2={-Math.cos((angle * Math.PI) / 180) * 22}
                stroke={isDark ? '#F87171' : '#C8102E'}
                strokeWidth={idx % 2 === 0 ? '3' : '2'}
                strokeLinecap="round"
              />
            ))}
            <circle cx="0" cy="0" r="7" fill={isDark ? '#FBBF24' : '#C8102E'} />
          </g>

          {/* 2. Outer Shield Body */}
          <path
            d="M60 22C42 22 24 24 20 28C16 33 16 75 16 80C16 112 60 134 60 134C60 134 104 112 104 80C104 75 104 33 100 28C96 24 78 22 60 22Z"
            fill={isDark ? '#001A30' : '#002B49'}
            stroke={isDark ? '#FFFFFF' : '#002B49'}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Shield White Contour Line */}
          <path
            d="M60 26C44 26 28 28 24 32C20 36 20 74 20 78C20 106 60 128 60 128C60 128 100 106 100 78C100 74 100 36 96 32C92 28 76 26 60 26Z"
            fill="none"
            stroke={isDark ? '#93C5FD' : '#FFFFFF'}
            strokeWidth="1.8"
          />

          {/* 3. Open Book of Wisdom (Top Half of Shield) */}
          <g transform="translate(60, 48)">
            {/* Open Book Pages Background */}
            <path
              d="M-26 -12C-16 -16 -4 -14 0 -10C4 -14 16 -16 26 -12V14C16 10 4 12 0 16C-4 12 -16 10 -26 14V-12Z"
              fill="#FFFFFF"
            />
            {/* Book Spine Center Divider */}
            <path d="M0 -10V16" stroke="#002B49" strokeWidth="2.2" strokeLinecap="round" />
            {/* Left Page Script Lines */}
            <line x1="-22" y1="-6" x2="-6" y2="-6" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="-22" y1="-1" x2="-6" y2="-1" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="-22" y1="4" x2="-6" y2="4" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="-22" y1="9" x2="-10" y2="9" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            {/* Right Page Script Lines */}
            <line x1="6" y1="-6" x2="22" y2="-6" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="6" y1="-1" x2="22" y2="-1" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="6" y1="4" x2="22" y2="4" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="6" y1="9" x2="18" y2="9" stroke="#002B49" strokeWidth="1.3" strokeLinecap="round" />
          </g>

          {/* 4. Middle Red Chevron Band */}
          <path
            d="M20 70L60 84L100 70V84L60 98L20 84V70Z"
            fill="#C8102E"
          />
          {/* Emblem on Chevron */}
          <circle cx="60" cy="84" r="3.5" fill="#FFFFFF" />
          <path d="M54 84H66 M60 78V90" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

          {/* 5. Lower Blue Shield Waves */}
          <path
            d="M26 89C36 94 48 97 60 99C72 97 84 94 94 89C90 102 60 120 60 120C60 120 30 102 26 89Z"
            fill="#002B49"
          />
          <path
            d="M34 100Q60 114 86 100"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
          />

          {/* 6. Latin Motto Scroll Ribbon at the bottom */}
          <g transform="translate(60, 130)">
            {/* Ribbon Background */}
            <path
              d="M-50 -6Q0 4 50 -6L46 6Q0 16 -46 6L-50 -6Z"
              fill="#FFFFFF"
              stroke="#002B49"
              strokeWidth="1.2"
            />
            {/* Ribbon End Cuts */}
            <path d="M-50 -6L-54 0L-46 6" fill="#E2E8F0" stroke="#002B49" strokeWidth="0.8" />
            <path d="M50 -6L54 0L46 6" fill="#E2E8F0" stroke="#002B49" strokeWidth="0.8" />
            {/* Micro Inscription: IN VERITATE SAPIENTIAE LUX */}
            <text
              x="0"
              y="2.5"
              textAnchor="middle"
              fill="#002B49"
              fontSize="4.2"
              fontWeight="900"
              letterSpacing="0.4"
              fontFamily="serif"
            >
              IN VERITATE SAPIENTIAE LUX
            </text>
          </g>
        </svg>
      </div>

      {/* 
        ========================================================================
        OFFICIAL 3-LANGUAGE UNIVERSITY TYPOGRAPHY
        Matches the exact wording & styling from the official UFS screenshots:
        Line 1: UNIVERSITY OF THE FREE STATE
        Line 2: UNIVERSITEIT VAN DIE VRYSTAAT
        Line 3: YUNIVESITHI YA FREISTATA
        ========================================================================
      */}
      {!compact && (
        <div
          className={`flex flex-col ${
            stacked ? 'items-center text-center mt-2' : 'text-left'
          } font-sans tracking-normal`}
        >
          <div
            className={`${textSizes[size]} ${
              isDark ? 'text-white' : 'text-slate-900'
            } uppercase font-sans tracking-wide space-y-0.5`}
          >
            {/* Line 1: English */}
            <div className="whitespace-nowrap">
              <span className="font-normal opacity-90">UNIVERSITY OF THE </span>
              <span className="font-extrabold tracking-wider">FREE STATE</span>
            </div>

            {/* Line 2: Afrikaans */}
            <div className="whitespace-nowrap">
              <span className="font-normal opacity-90">UNIVERSITEIT VAN DIE </span>
              <span className="font-extrabold tracking-wider">VRYSTAAT</span>
            </div>

            {/* Line 3: Sesotho */}
            <div className="whitespace-nowrap">
              <span className="font-normal opacity-90">YUNIVESITHI YA </span>
              <span className="font-extrabold tracking-wider">FREISTATA</span>
            </div>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1 border-t border-slate-200/60 pt-0.5">
              <span className="text-[10px] font-extrabold text-[#C8102E] tracking-wider uppercase">
                KovsiePark
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                • Smart Parking System
              </span>
            </div>
          )}

          {showSlogan && (
            <div
              className={`text-[10px] italic font-serif mt-0.5 ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}
            >
              Inspiring excellence. Transforming lives.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
