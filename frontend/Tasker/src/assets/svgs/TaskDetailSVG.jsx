const TaskDetailSVG = ({ className = "animate-float" }) => (
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
      {/* Task Document */}
      <g className="animate-slide-in-left">
        <rect
          x="120"
          y="60"
          width="180"
          height="220"
          rx="12"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <rect x="140" y="80" width="140" height="15" rx="4" fill="#3b82f6" />
        <rect x="140" y="105" width="100" height="8" rx="4" fill="#fb923c" />
        <rect x="140" y="125" width="120" height="6" rx="3" fill="#e2e8f0" />
        <rect x="140" y="140" width="110" height="6" rx="3" fill="#e2e8f0" />
        <rect x="140" y="155" width="90" height="6" rx="3" fill="#e2e8f0" />
        <rect x="140" y="180" width="60" height="20" rx="10" fill="#10b981" />
        <rect x="210" y="180" width="60" height="20" rx="10" fill="#f59e0b" />
        <rect x="140" y="220" width="140" height="25" rx="12" fill="#3b82f6" />
      </g>
      {/* Person Character */}
      <g className="animate-slide-in-right">
        <circle cx="320" cy="160" r="20" fill="#fbbf24" />
        <rect x="310" y="180" width="20" height="30" rx="10" fill="#3b82f6" />
        <circle cx="315" cy="155" r="2" fill="#1f2937" />
        <circle cx="325" cy="155" r="2" fill="#1f2937" />
        <path
          d="M315 165 Q320 170 325 165"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </svg>
  </div>
);

export default TaskDetailSVG;
