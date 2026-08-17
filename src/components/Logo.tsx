import React from 'react';

interface LogoProps {
  className?: string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 36 }) => {
  return (
    <div className={`flex items-center select-none cursor-pointer ${className}`} id="brand-logo-container">
      <svg
        height={height}
        viewBox="0 0 260 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 sm:h-9 md:h-10 w-auto object-contain"
        aria-label="Qilinker Logo"
      >
        <defs>
          <linearGradient id="qGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7E8B52" />
            <stop offset="100%" stopColor="#687642" />
          </linearGradient>
          <linearGradient id="jGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BA8C49" />
            <stop offset="100%" stopColor="#A87938" />
          </linearGradient>
        </defs>

        {/* 1. Olive Green Stylized "Q" / Dialogue Loop */}
        <path
          d="M 52 14 C 33 14 18 26 18 40 C 18 46.5 21 52.5 26.5 56.5 L 17 64 C 25.5 63.5 32 60.5 36 58 C 41 61.5 46.5 63.5 52.5 63.5 C 71.5 63.5 86.5 52 86.5 38 C 86.5 24 71.5 14 52 14 Z"
          fill="none"
          stroke="url(#qGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Golden-Bronze "J" Hook Intersecting */}
        <path
          d="M 76 22 L 76 49 C 76 57 71 61 64 61 L 52 61 C 45 61 41 57 41 50 L 41 44"
          fill="none"
          stroke="url(#jGradient)"
          strokeWidth="6.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Dark Navy Dot above the J stem */}
        <circle cx="76" cy="11.5" r="6" fill="#1C2D4A" />

        {/* 4. Wordmark "linker" */}
        <text
          x="94"
          y="49"
          fill="#1C2D4A"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif"
          fontSize="43"
          fontWeight="800"
          letterSpacing="-1.2px"
        >
          linker
        </text>
      </svg>
    </div>
  );
};
