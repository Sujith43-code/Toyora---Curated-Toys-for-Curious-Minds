import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  isCompact?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', isCompact = false }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Playful Geometric Arch + Disc Mark */}
      <div className="relative w-7 h-7 flex items-center justify-center">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Geometric curved arch */}
          <path
            d="M 6 24 A 10 10 0 0 1 26 24"
            stroke="#D85A38"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Centered balance sphere */}
          <circle
            cx="16"
            cy="11"
            r="4.5"
            fill={isDark ? "#19191B" : "#FAF9F5"}
          />
          {/* Small playful accent dot */}
          <circle
            cx="25"
            cy="9"
            r="2"
            fill="#E28464"
          />
        </svg>
      </div>

      {!isCompact && (
        <div className="flex flex-col">
          <span 
            className={`font-display text-xl sm:text-2xl font-bold tracking-tight uppercase transition-colors ${
              isDark ? 'text-[#19191B]' : 'text-[#FAF9F5]'
            }`}
            style={{ letterSpacing: '0.04em' }}
          >
            Toyora
          </span>
        </div>
      )}
    </div>
  );
};
