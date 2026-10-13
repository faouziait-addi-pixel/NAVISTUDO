import React from 'react';

interface MountainPathGraphicProps {
  className?: string;
  variant?: 'hero' | 'compact' | 'card';
}

export const MountainPathGraphic: React.FC<MountainPathGraphicProps> = ({
  className = '',
  variant = 'hero'
}) => {
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B2A26" />
            <stop offset="60%" stopColor="#0F3D37" />
            <stop offset="100%" stopColor="#17564D" />
          </linearGradient>

          <linearGradient id="mtnGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1F7A6E" />
            <stop offset="100%" stopColor="#0F3D37" />
          </linearGradient>

          <linearGradient id="mtnGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A9D8F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#144C44" />
          </linearGradient>

          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7D0B8" />
            <stop offset="100%" stopColor="#F7F6F2" />
          </linearGradient>

          <linearGradient id="beaconGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7D0B8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1F7A6E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect width="600" height="400" fill="url(#skyGrad)" />

        {/* Constellations / guiding stars */}
        <circle cx="120" cy="80" r="1.5" fill="#A7D0B8" opacity="0.6" />
        <circle cx="180" cy="50" r="2" fill="#F7F6F2" opacity="0.8" />
        <circle cx="260" cy="70" r="1.5" fill="#A7D0B8" opacity="0.5" />
        <circle cx="450" cy="60" r="2.5" fill="#F7F6F2" opacity="0.9" />
        <circle cx="520" cy="95" r="1.5" fill="#A7D0B8" opacity="0.7" />
        <circle cx="340" cy="40" r="1.5" fill="#A7D0B8" opacity="0.6" />

        {/* Guiding star rays above the peak */}
        <circle cx="300" cy="90" r="50" fill="url(#beaconGlow)" />
        <circle cx="300" cy="90" r="6" fill="#F7F6F2" />
        <polygon points="300,70 304,86 320,90 304,94 300,110 296,94 280,90 296,86" fill="#A7D0B8" opacity="0.9" />

        {/* Distant mountain silhouette */}
        <path
          d="M0 320L110 210L200 270L300 130L390 240L490 190L600 310V400H0Z"
          fill="#0B2824"
          opacity="0.8"
        />

        {/* Mid-ground mountain ridges */}
        <path
          d="M-40 400L80 260L190 310L300 145L420 280L540 220L640 400Z"
          fill="url(#mtnGrad2)"
        />

        {/* Foreground mountain peaks */}
        <path
          d="M-20 400L130 290L240 330L300 160L380 290L510 240L620 400Z"
          fill="url(#mtnGrad1)"
        />

        {/* Winding educational ascent path */}
        <path
          d="M240 400C220 360 260 340 280 320C300 300 270 280 290 250C310 220 285 200 300 162"
          stroke="url(#pathGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="1 1"
          className="opacity-95"
        />

        {/* Path milestone waypoints (checkpoints on the orientation journey) */}
        <circle cx="240" cy="390" r="5" fill="#F7F6F2" stroke="#0F3D37" strokeWidth="2" />
        <circle cx="280" cy="320" r="5" fill="#F7F6F2" stroke="#0F3D37" strokeWidth="2" />
        <circle cx="290" cy="250" r="5" fill="#F7F6F2" stroke="#0F3D37" strokeWidth="2" />
        <circle cx="300" cy="162" r="6" fill="#A7D0B8" stroke="#F7F6F2" strokeWidth="2" />

        {/* Summit graduation cap icon at pinnacle */}
        <g transform="translate(288, 120) scale(0.6)">
          <path d="M20 5L35 13L20 21L5 13L20 5Z" fill="#F7F6F2" />
          <path d="M10 17V22C10 25 14 27 20 27C26 27 30 25 30 22V17" stroke="#F7F6F2" strokeWidth="2" />
          <path d="M35 13V22" stroke="#A7D0B8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
