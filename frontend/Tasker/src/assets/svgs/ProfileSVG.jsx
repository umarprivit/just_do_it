const ProfileSVG = ({ className = "animate-float" }) => (
  <div className="undraw-container animate-fade-in-up">
    <svg viewBox="0 0 400 300" className={className}>
      {/* Background Elements */}
      <circle
        cx="350"
        cy="50"
        r="30"
        fill="#3b82f6"
        opacity="0.1"
        className="animate-pulse"
      />
      <circle
        cx="50"
        cy="250"
        r="20"
        fill="#fb923c"
        opacity="0.1"
        className="animate-pulse"
      />
      {/* Profile Card */}
      <g className="animate-slide-in-left">
        <rect
          x="150"
          y="80"
          width="200"
          height="140"
          rx="12"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <circle cx="200" cy="120" r="25" fill="#3b82f6" />
        <rect x="170" y="150" width="60" height="8" rx="4" fill="#fb923c" />
        <rect x="160" y="170" width="80" height="6" rx="3" fill="#e2e8f0" />
        <rect x="165" y="185" width="70" height="6" rx="3" fill="#e2e8f0" />
      </g>
      {/* Person Character */}
      <g className="animate-slide-in-right">
        <circle cx="320" cy="150" r="20" fill="#fbbf24" />
        <rect x="310" y="170" width="20" height="30" rx="10" fill="#3b82f6" />
        <circle cx="315" cy="145" r="2" fill="#1f2937" />
        <circle cx="325" cy="145" r="2" fill="#1f2937" />
        <path
          d="M315 155 Q320 160 325 155"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  </div>
);

export default ProfileSVG;
