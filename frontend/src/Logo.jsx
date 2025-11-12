export default function Logo({ size = "large" }) {
  const dimensions = size === "large" ? "w-20 h-20" : "w-12 h-12";
  
  return (
    <div className={`relative ${dimensions} logo-container`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "#00ffff", stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: "#00ff88", stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: "#00aaff", stopOpacity: 1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer hexagon */}
        <polygon 
          points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="3"
          filter="url(#glow)"
          className="logo-hexagon"
        />
        
        {/* Inner car shape */}
        <g transform="translate(50, 50)">
          {/* Car body */}
          <rect x="-20" y="-8" width="40" height="12" rx="2" fill="url(#logoGradient)" filter="url(#glow)"/>
          {/* Car top */}
          <path d="M -12,-8 L -8,-16 L 8,-16 L 12,-8 Z" fill="url(#logoGradient)" filter="url(#glow)"/>
          {/* Wheels */}
          <circle cx="-12" cy="6" r="4" fill="url(#logoGradient)" filter="url(#glow)"/>
          <circle cx="12" cy="6" r="4" fill="url(#logoGradient)" filter="url(#glow)"/>
          {/* AI symbol */}
          <text x="0" y="2" textAnchor="middle" fontSize="10" fill="#00ffff" fontWeight="bold" fontFamily="monospace">AI</text>
        </g>
        
        {/* Corner accents */}
        <circle cx="50" cy="5" r="2" fill="#00ffff" className="logo-accent"/>
        <circle cx="90" cy="50" r="2" fill="#00ff88" className="logo-accent"/>
        <circle cx="10" cy="50" r="2" fill="#00aaff" className="logo-accent"/>
      </svg>
    </div>
  );
}
