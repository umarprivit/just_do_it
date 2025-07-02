const PostTaskSVG = ({ className = "animate-float" }) => (
  <div className="undraw-container animate-fade-in-up">
    <svg viewBox="0 0 400 300" className={className}>
      {/* Background Elements */}
      <circle
        cx="350"
        cy="50"
        r="25"
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
      {/* Task Board */}
      <g className="animate-slide-in-left">
        <rect
          x="120"
          y="60"
          width="160"
          height="180"
          rx="12"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <rect x="135" y="80" width="130" height="15" rx="4" fill="#3b82f6" />
        <rect x="135" y="105" width="100" height="8" rx="4" fill="#fb923c" />
        <rect x="135" y="125" width="120" height="8" rx="4" fill="#e2e8f0" />
        <rect x="135" y="145" width="90" height="8" rx="4" fill="#e2e8f0" />
        <rect x="135" y="170" width="60" height="20" rx="10" fill="#10b981" />
      </g>
      {/* Person Character */}
      <g className="animate-slide-in-right">
        <circle cx="320" cy="140" r="20" fill="#fbbf24" />
        <rect x="310" y="160" width="20" height="30" rx="10" fill="#3b82f6" />
        <circle cx="315" cy="135" r="2" fill="#1f2937" />
        <circle cx="325" cy="135" r="2" fill="#1f2937" />
        <path
          d="M315 145 Q320 150 325 145"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  </div>
);

export default PostTaskSVG;
