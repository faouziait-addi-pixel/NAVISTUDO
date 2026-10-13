import React from 'react';

interface CompassLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  lightText?: boolean;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  lightText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:rotate-6 duration-300"
        aria-hidden="true"
      >
        {/* Outer compass ring */}
        <circle cx="24" cy="24" r="22" stroke="#1F7A6E" strokeWidth="2.5" className="opacity-90" />
        <circle cx="24" cy="24" r="18.5" stroke="#A7D0B8" strokeWidth="1" strokeDasharray="2 3" />

        {/* Cardinal tick marks */}
        <line x1="24" y1="3" x2="24" y2="7" stroke="#0F3D37" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="41" x2="24" y2="45" stroke="#0F3D37" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="24" x2="7" y2="24" stroke="#0F3D37" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="24" x2="45" y2="24" stroke="#0F3D37" strokeWidth="2" strokeLinecap="round" />

        {/* Graduation cap base behind needle */}
        <path
          d="M24 10L37 17L24 24L11 17L24 10Z"
          fill="#0F3D37"
          stroke="#A7D0B8"
          strokeWidth="1.2"
        />
        {/* Graduation cap skull cap & tassel */}
        <path
          d="M16 20.5V25.5C16 27.5 19.5 29 24 29C28.5 29 32 27.5 32 25.5V20.5"
          stroke="#0F3D37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M37 17V24C37 25 36 26 35 26.5"
          stroke="#1F7A6E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Compass needle pointing North-East towards future */}
        <polygon points="24,24 22,27 33,13 27,22" fill="#1F7A6E" />
        <polygon points="24,24 26,21 15,35 21,26" fill="#A7D0B8" />

        {/* Central pivot circle */}
        <circle cx="24" cy="24" r="3" fill="#0F3D37" stroke="#F7F6F2" strokeWidth="1.5" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-xl font-bold tracking-tight ${lightText ? 'text-white' : 'text-[#0F3D37]'}`}>
            Navi<span className="text-[#1F7A6E]">Studo</span>
          </span>
          <span className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 ${lightText ? 'text-[#A7D0B8]' : 'text-[#4B5563]'}`}>
            Academic Guidance
          </span>
        </div>
      )}
    </div>
  );
};
