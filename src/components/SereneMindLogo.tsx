import React from 'react';

interface SereneMindLogoProps {
  className?: string;
  size?: number | string;
  showWordmark?: boolean;
  withContainer?: boolean;
  animated?: boolean;
}

export const SereneMindLogo: React.FC<SereneMindLogoProps> = ({
  className = '',
  size = 40,
  showWordmark = false,
  withContainer = false,
  animated = true,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  const svgContent = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={pixelSize}
      height={pixelSize}
      className={`shrink-0 ${animated ? 'transition-transform duration-500 hover:scale-105' : ''}`}
      aria-label="SereneMind Logo - Calm Sunrise Brain and Waves"
    >
      <defs>
        {/* Soft Glow Filter */}
        <filter id="logoSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="logoAmbientGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradients */}
        <linearGradient id="logoSkyTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        <linearGradient id="logoSoftTeal" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        <radialGradient id="logoSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="logoSunDisc" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <linearGradient id="logoWave1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="logoWave2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        <linearGradient id="logoBgPlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      {/* Clean White Squircle Container (if requested or standard icon view) */}
      {withContainer && (
        <>
          <rect width="512" height="512" rx="128" fill="url(#logoBgPlate)" />
          <rect
            width="508"
            height="508"
            x="2"
            y="2"
            rx="126"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="3"
          />
        </>
      )}

      {/* Calming Ambient Halo Behind Brain */}
      <circle cx="256" cy="245" r="160" fill="url(#logoSunGlow)" filter="url(#logoAmbientGlow)" />

      {/* Sunrise (Emerging in Center of Brain) */}
      <g id="logo-sunrise">
        <circle cx="256" cy="240" r="42" fill="url(#logoSunDisc)" filter="url(#logoSoftGlow)" />
        <path d="M256 168 L256 148" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <path d="M205 189 L191 175" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <path d="M307 189 L321 175" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <path d="M172 238 L152 238" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
        <path d="M340 238 L360 238" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* Gentle Waves (Peace of Mind & Emotional Clarity) */}
      <g id="logo-waves">
        <path
          d="M165 258 C 195 246, 225 268, 256 256 C 287 244, 317 268, 347 258"
          fill="none"
          stroke="url(#logoWave1)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M180 286 C 205 276, 230 294, 256 284 C 282 274, 307 294, 332 284"
          fill="none"
          stroke="url(#logoWave2)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M200 314 C 220 306, 238 318, 256 312 C 274 306, 292 318, 312 314"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>

      {/* Continuous Flowing Brain Silhouette */}
      <path
        d="
          M 252 355
          C 230 355, 205 345, 185 328
          C 160 307, 142 275, 142 238
          C 142 215, 150 196, 164 182
          C 152 168, 150 148, 162 132
          C 176 113, 202 110, 222 120
          C 233 108, 246 104, 252 104
        "
        fill="none"
        stroke="url(#logoSkyTeal)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoSoftGlow)"
      />

      <path
        d="
          M 260 104
          C 266 104, 279 108, 290 120
          C 310 110, 336 113, 350 132
          C 362 148, 360 168, 348 182
          C 362 196, 370 215, 370 238
          C 370 275, 352 307, 327 328
          C 307 345, 282 355, 260 355
        "
        fill="none"
        stroke="url(#logoSoftTeal)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoSoftGlow)"
      />

      {/* Internal Gyri Folds */}
      <path
        d="
          M 215 132
          C 195 152, 180 180, 192 208
          C 198 222, 215 228, 224 218
          C 235 206, 230 188, 222 172
        "
        fill="none"
        stroke="url(#logoSkyTeal)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      <path
        d="
          M 297 132
          C 317 152, 332 180, 320 208
          C 314 222, 297 228, 288 218
          C 277 206, 282 188, 290 172
        "
        fill="none"
        stroke="url(#logoSoftTeal)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Anchor / Brainstem */}
      <path
        d="M246 360 C 246 385, 252 396, 252 408"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M266 360 C 266 385, 260 396, 260 408"
        fill="none"
        stroke="#14b8a6"
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Sparks of Clarity & Uplift */}
      <circle cx="140" cy="155" r="5" fill="#38bdf8" />
      <circle cx="372" cy="155" r="5" fill="#2dd4bf" />
      <circle cx="256" cy="78" r="4.5" fill="#fbbf24" />
      <path
        d="M256 70 L256 86 M248 78 L264 78"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  if (!showWordmark) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{svgContent}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {svgContent}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-lg tracking-tight text-slate-700">
            Serene<span className="text-sky-500 font-semibold">Mind</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-100">
            AI
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 -mt-0.5">
          Clarity · Peace · Calm
        </span>
      </div>
    </div>
  );
};

export default SereneMindLogo;
