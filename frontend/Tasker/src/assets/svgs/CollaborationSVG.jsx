const CollaborationSVG = ({ className = "animate-float" }) => (
  <div className="undraw-container animate-fade-in-up">
    <svg viewBox="0 0 400 300" className={className}>
      {/* Background Elements */}
      <circle
        cx="350"
        cy="50"
        r="40"
        fill="#3b82f6"
        opacity="0.08"
        className="animate-pulse"
      />
      <circle
        cx="50"
        cy="250"
        r="30"
        fill="#34d399"
        opacity="0.08"
        className="animate-pulse"
      />
      {/* People */}
      <g className="animate-slide-in-left">
        <circle cx="120" cy="80" r="25" fill="#fb923c" />
        <rect x="100" y="105" width="40" height="60" rx="20" fill="#3b82f6" />
        <rect x="110" y="120" width="20" height="40" fill="#60a5fa" />
      </g>
      <g className="animate-slide-in-right">
        <circle cx="280" cy="80" r="25" fill="#ea580c" />
        <rect x="260" y="105" width="40" height="60" rx="20" fill="#10b981" />
        <rect x="270" y="120" width="20" height="40" fill="#d1fae5" />
      </g>
      {/* Connection Lines */}
      <path
        d="M 160 130 Q 200 110 240 130"
        stroke="#1e40af"
        strokeWidth="3"
        fill="none"
        className="animate-pulse"
        strokeDasharray="5,5"
      />
      {/* Task Icons */}
      <g className="animate-float">
        <rect
          x="180"
          y="200"
          width="40"
          height="30"
          rx="8"
          fill="#ea580c"
          opacity="0.8"
        />
        <circle cx="200" cy="215" r="8" fill="#fff" />
      </g>
    </svg>
  </div>
);

export default CollaborationSVG;
